import React, { useState } from "react";
import "./SettingsPage.css";

// Each item: label, and optional `children` to make it expandable (shows a chevron).
const MENU = [
  {
    key: "center",
    label: "Center config",
    children: [
      { key: "financial", label: "Financial configuration" },
      { key: "reports", label: "Report configuration" },
      { key: "info", label: "Center information" },
      { key: "network", label: "Center network" },
      { key: "user-fields", label: "User details configuration" },
      { key: "licenses", label: "Licenses" },
      { key: "language", label: "Language" },
    ],
  },
  {
    key: "client",
    label: "Client configuration",
    children: [
      { key: "billing", label: "Billing information" },
      { key: "general", label: "General settings" },
      { key: "version", label: "Version" },
      { key: "consoles", label: "Consoles" },
      { key: "homescreen", label: "Home screen" },
      { key: "customization", label: "Customization" },
      { key: "advanced", label: "Advanced" },
      { key: "security", label: "Security" },
      { key: "games-apps", label: "Games/apps" },
      { key: "terms", label: "Terms and conditions" },
      { key: "discord", label: "Discord configuration" },
    ],
  },
  { key: "shop", label: "Shop settings" },
  { key: "groups", label: "Groups config" },
  { key: "employees", label: "Employees" },
  { key: "loyalty", label: "Loyalty system" },
  { key: "players", label: "Players web portal" },
  { key: "exports", label: "Exports" },
  { key: "bookings", label: "Bookings" },
  { key: "webadmin", label: "Web-admin settings" },
  { key: "notifications", label: "Player notifications" },
  { key: "subscription", label: "Subscription management" },
  { key: "userlogin", label: "User login" },
  { key: "integrations", label: "Integrations" },
  { key: "api", label: "API" },
  { key: "account", label: "Account" },
  { key: "marketplace", label: "Add-Ons Marketplace" },
];

export default function SettingsPageLeftNav({ active, setActive }) {
  // Compute initial open index based on active prop
  const getInitialOpenIndex = () => {
    if (!active) return null;
    const parts = active.split(':');
    if (parts.length > 1) {
      return MENU.findIndex(item => item.key === parts[0]);
    }
    return null;
  };

  // Index of the currently expanded item (only one open at a time).
  const [openIndex, setOpenIndex] = useState(getInitialOpenIndex);

  const handleClick = (index, item) => {
    if (item.children && item.children.length > 0) {
      // Accordion behaviour: opening one closes the previously open one.
      setOpenIndex((prev) => (prev === index ? null : index));
    } else {
      // A plain item has no panel; collapse any open accordion and activate the tab.
      setOpenIndex(null);
      setActive(item.key);
    }
  };

  return (
    <div>
      <h1 className="Settings_Title text-white font-semibold mb-4">Settings</h1>
      <nav className="sidebar" aria-label="Admin navigation">
        <ul className="sidebar__list">
          {MENU.map((item, index) => {
            const isExpandable = Boolean(item.children && item.children.length > 0);
            const isOpen = openIndex === index;
            const isActive = active === item.key || (item.key && active.startsWith(item.key + ":"));

            return (
              <li key={item.label} className="sidebar__item">
                <button
                  type="button"
                  className={`sidebar__row${isActive ? " is-active" : ""}`}
                  onClick={() => handleClick(index, item)}
                  aria-expanded={isExpandable ? isOpen : undefined}
                >
                  <span className="sidebar__label">{item.label}</span>
                  {isExpandable && (
                    <svg
                      className={`sidebar__chevron${isOpen ? " is-open" : ""}`}
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M9 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {isExpandable && (
                  <div
                    className={`sidebar__panel${isOpen ? " is-open" : ""}`}
                    role="region"
                  >
                    <ul className="sidebar__sublist">
                      {item.children.map((child) => {
                        const isChildActive = active === `${item.key}:${child.key}`;
                        return (
                          <li key={child.key}>
                            <button
                              type="button"
                              className={`sidebar__subrow${isChildActive ? " is-active" : ""}`}
                              onClick={() => setActive(`${item.key}:${child.key}`)}
                            >
                              {child.label}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
