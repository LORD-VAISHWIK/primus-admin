import React, { useState, useEffect } from 'react';
import { showToast } from '../../../utils/api';
import { settingsAPI, settingsToObject, objectToSettings } from '../../../utils/settings.js';
import "../SettingsPageRight.css";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.5"
       strokeLinecap="round" strokeLinejoin="round" style={{ width: 13, height: 13 }}>
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

function CenterFinancial() {
    const [financialSettings, setFinancialSettings] = useState({
        // Billing information
        company_name: '',
        tax_number: '',
        decimal_places: 2,
        address: '',

        // Payment methods - web admin
        payment_cash: false,
        payment_credit_card: false,
        payment_account_balance: false,

        // Payment methods - client
        client_account_balance: false,
        client_summon_human: false,
        client_stripe_phone: false,
        client_pay_after_logout: false,

        // Tax rates
        tax_included_in_price: false,
        tax1_name: 'Tax 1',
        tax1_percentage: 0.00,
        tax2_name: 'Tax 2',
        tax2_percentage: 0.00,
        tax3_name: 'Tax 3',
        tax3_percentage: 0.00,

        // Guest pricing
        guest_legacy_prices: 'Price per hour (INR)'
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        loadFinancialSettings();
    }, []);

    const loadFinancialSettings = async () => {
        try {
            const settings = await settingsAPI.getSettingsByCategory('financial');
            const settingsObj = settingsToObject(settings);

            setFinancialSettings(prev => ({
                ...prev,
                ...settingsObj
            }));
        } catch (error) {
            showToast('Failed to load financial settings', 'error');
        } finally {
            setLoading(false);
        }
    };

    const saveFinancialSettings = async () => {
        setSaving(true);
        try {
            const settingsToUpdate = objectToSettings(financialSettings, 'financial');
            await settingsAPI.bulkUpdateSettings(settingsToUpdate);
            showToast('Financial settings saved successfully', 'success');
        } catch (error) {
            showToast('Failed to save financial settings', 'error');
        } finally {
            setSaving(false);
        }
    };

    const updateSetting = (key, value) => {
        setFinancialSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    if (loading) {
        return (
            <div className="financial-page">
                <h1 className="financial-page__title">Center/Financial</h1>
                <div className='text-gray-400 text-sm mt-2'>Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="financial-page">
            <h1 className="financial-page__title">Center/Financial</h1>

            <div className="financial-grid">
                {/* ---------------- Left column ---------------- */}
                <div className="financial-col">
                    <section className="card card--violet">
                        <h2 className="card__title">Billing Information</h2>

                        <div className="field">
                            <label className="field__label">Company name</label>
                            <input
                                className="input"
                                type="text"
                                value={financialSettings.company_name}
                                onChange={(e) => updateSetting('company_name', e.target.value)}
                            />
                        </div>

                        <div className="field-row">
                            <div className="field">
                                <label className="field__label">Tax number</label>
                                <input
                                    className="input"
                                    type="text"
                                    value={financialSettings.tax_number}
                                    onChange={(e) => updateSetting('tax_number', e.target.value)}
                                />
                            </div>
                            <div className="field field--narrow">
                                <label className="field__label">Decimal places</label>
                                <input
                                    className="input"
                                    type="number"
                                    value={financialSettings.decimal_places}
                                    onChange={(e) => updateSetting('decimal_places', parseInt(e.target.value) || 2)}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label className="field__label">Address</label>
                            <textarea
                                className="textarea"
                                value={financialSettings.address}
                                onChange={(e) => updateSetting('address', e.target.value)}
                            />
                        </div>
                    </section>
                </div>

                {/* ---------------- Right column ---------------- */}
                <div className="financial-col">
                    <section className="card card--violet">
                        <h2 className="card__title">Accepted Web-Admin Payment Methods</h2>
                        <div className="radio-row">
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={financialSettings.payment_cash}
                                    onChange={(e) => updateSetting('payment_cash', e.target.checked)}
                                />
                                <span className="checkbox__box">
                                    <CheckIcon />
                                </span>
                                Cash
                            </label>
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={financialSettings.payment_credit_card}
                                    onChange={(e) => updateSetting('payment_credit_card', e.target.checked)}
                                />
                                <span className="checkbox__box">
                                    <CheckIcon />
                                </span>
                                Credit card
                            </label>
                            <label className="checkbox">
                                <input
                                    type="checkbox"
                                    checked={financialSettings.payment_account_balance}
                                    onChange={(e) => updateSetting('payment_account_balance', e.target.checked)}
                                />
                                <span className="checkbox__box">
                                    <CheckIcon />
                                </span>
                                Account balance
                            </label>
                        </div>
                    </section>

                    <section className="card card--violet">
                        <h2 className="card__title">Accepted Client Payment Methods</h2>
                        <div className="toggle-list">
                            {[
                                ["client_account_balance", "Account balance"],
                                ["client_summon_human", "Summon a human"],
                                ["client_stripe_phone", "Stripe (phone)"],
                                ["client_pay_after_logout", "Pay after logout"],
                            ].map(([key, label]) => (
                                <div className="toggle-row" key={key}>
                                    <span className="toggle-row__label">{label}</span>
                                    <button
                                        type="button"
                                        className={`toggle ${financialSettings[key] ? "is-on" : ""}`}
                                        aria-pressed={financialSettings[key]}
                                        onClick={() => updateSetting(key, !financialSettings[key])}
                                    >
                                        <span className="toggle__knob" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>

            {/* ---------------- Tax Rates ---------------- */}
            <section className="card card--slate" style={{ marginTop: 20 }}>
                <h2 className="card__title">Tax Rates</h2>

                <label className="checkbox">
                    <input
                        type="checkbox"
                        checked={financialSettings.tax_included_in_price}
                        onChange={(e) => updateSetting('tax_included_in_price', e.target.checked)}
                    />
                    <span className="checkbox__box">
                        <CheckIcon />
                    </span>
                    Tax calculation included in price
                </label>

                {[1, 2, 3].map((n) => (
                    <div className="field-row tax-block" key={n}>
                        <div className="field" style={{ marginBottom: 0 }}>
                            <label className="field__label">Tax {n} Name</label>
                            <input
                                className="input"
                                type="text"
                                value={financialSettings[`tax${n}_name`] || ''}
                                onChange={(e) => updateSetting(`tax${n}_name`, e.target.value)}
                            />
                        </div>
                        <div className="field" style={{ marginBottom: 0 }}>
                            <label className="field__label">Percentage</label>
                            <input
                                className="input"
                                type="number"
                                step="0.01"
                                value={financialSettings[`tax${n}_percentage`] || 0}
                                onChange={(e) => updateSetting(`tax${n}_percentage`, parseFloat(e.target.value) || 0.00)}
                            />
                        </div>
                    </div>
                ))}

                <h3 className="subheading">Guest Legacy Prices</h3>
                <select
                    className="input"
                    style={{ background: 'var(--input-bg)' }}
                    value={financialSettings.guest_legacy_prices}
                    onChange={(e) => updateSetting('guest_legacy_prices', e.target.value)}
                >
                    <option>Price per hour (INR)</option>
                    <option>Price per minute (INR)</option>
                    <option>Fixed price per session</option>
                </select>
            </section>

            {/* ---------------- Actions ---------------- */}
            <div className="actions">
                <button type="button" className="btn btn--ghost" onClick={loadFinancialSettings}>Cancel</button>
                <button type="button" className="btn btn--primary" onClick={saveFinancialSettings} disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}

export default CenterFinancial;
