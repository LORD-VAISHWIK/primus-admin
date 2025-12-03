import { getApiBase, authHeaders, showToast } from "./api";

// Simple singleton WebSocket manager for /ws/admin
let socket = null;
let reconnectTimer = null;
let manualClose = false;
const listeners = new Set();

const RECONNECT_BASE_MS = 2000;
let reconnectAttempts = 0;

function buildUrl() {
  const base = getApiBase().replace(/\/$/, "");
  // Translate http(s) → ws(s)
  if (base.startsWith("https://")) {
    return base.replace("https://", "wss://") + "/ws/admin";
  }
  if (base.startsWith("http://")) {
    return base.replace("http://", "ws://") + "/ws/admin";
  }
  return "ws://" + base + "/ws/admin";
}

function sendAuth() {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  const headers = authHeaders();
  const token = headers.Authorization ? headers.Authorization.replace("Bearer ", "") : null;
  if (!token) {
    return;
  }
  const envelope = {
    event: "auth",
    payload: { token },
    ts: Math.floor(Date.now() / 1000),
  };
  try {
    socket.send(JSON.stringify(envelope));
  } catch {
    // Ignore auth send errors; reconnect logic will handle
  }
}

function scheduleReconnect() {
  if (manualClose) return;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  const delay = Math.min(RECONNECT_BASE_MS * Math.pow(2, reconnectAttempts), 30000);
  reconnectTimer = setTimeout(() => {
    reconnectAttempts += 1;
    connect();
  }, delay);
}

export function connect() {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return socket;
  }

  manualClose = false;
  const url = buildUrl();
  try {
    socket = new WebSocket(url);
  } catch (e) {
    console.error("Failed to open admin websocket:", e);
    scheduleReconnect();
    return null;
  }

  socket.onopen = () => {
    reconnectAttempts = 0;
    sendAuth();
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      listeners.forEach((fn) => {
        try {
          fn(data);
        } catch (err) {
          console.error("wsAdmin listener error:", err);
        }
      });
    } catch (e) {
      console.error("Failed to parse ws/admin message:", e);
    }
  };

  socket.onclose = (ev) => {
    socket = null;
    if (!manualClose) {
      // Avoid spamming toasts; only show for abnormal closures
      if (ev.code !== 1000) {
        showToast("Admin realtime connection lost. Reconnecting...");
      }
      scheduleReconnect();
    }
  };

  socket.onerror = () => {
    // Errors will lead to close and reconnect handling
  };

  return socket;
}

export function disconnect() {
  manualClose = true;
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = null;
  if (socket) {
    try {
      socket.close(1000, "manual");
    } catch {
      // ignore
    }
    socket = null;
  }
}

export function subscribe(handler) {
  if (typeof handler !== "function") return () => {};
  listeners.add(handler);
  // Ensure connection is established when first subscriber registers
  connect();
  return () => {
    listeners.delete(handler);
  };
}


