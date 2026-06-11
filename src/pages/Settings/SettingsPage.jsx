import React, { useState } from "react";
import "./SettingsPage.css";
import SettingsPageLeftNav from "./SettingsPageLeftNav";

// Center config pages
import CenterFinancial from './Center/CenterFinancial.jsx';
import CenterReports from './Center/CenterReports.jsx';
import CenterInfo from './Center/CenterInfo.jsx';
import CenterNetwork from './Center/CenterNetwork.jsx';
import CenterLanguage from './Center/CenterLanguage.jsx';
import UserDetails from './UserDetails.jsx';
import Licenses from './Licenses/Licenses.jsx';

// Client configuration pages
import ClientGeneral from './Client/ClientGeneral.jsx';
import ClientVersion from './Client/ClientVersion.jsx';
import ClientConsoles from './Client/ClientConsoles.jsx';
import ClientCustomization from './Client/ClientCustomization.jsx';
import ClientAdvanced from './Client/ClientAdvanced.jsx';
import ClientSecurity from './Client/ClientSecurity.jsx';
import ClientGamesApps from './Client/ClientGamesApps.jsx';

import PlaceholderPage from '../PlaceholderPage.jsx';

export default function SettingsPage() {
  const [active, setActive] = useState('center:financial');

  const renderRight = () => {
    const [group, page] = active.split(':');
    
    // Center config pages
    if (group === 'center' && page === 'financial') return <CenterFinancial />;
    if (group === 'center' && page === 'reports') return <CenterReports />;
    if (group === 'center' && page === 'info') return <CenterInfo />;
    if (group === 'center' && page === 'network') return <CenterNetwork />;
    if (group === 'center' && page === 'user-fields') return <UserDetails />;
    if (group === 'center' && page === 'licenses') return <Licenses />;
    if (group === 'center' && page === 'language') return <CenterLanguage />;

    // Client configuration pages
    if (group === 'client' && page === 'billing') return <PlaceholderPage title='Client/Billing information' />;
    if (group === 'client' && page === 'general') return <ClientGeneral />;
    if (group === 'client' && page === 'version') return <ClientVersion />;
    if (group === 'client' && page === 'consoles') return <ClientConsoles />;
    if (group === 'client' && page === 'homescreen') return <PlaceholderPage title='Client/Home screen' />;
    if (group === 'client' && page === 'customization') return <ClientCustomization />;
    if (group === 'client' && page === 'advanced') return <ClientAdvanced />;
    if (group === 'client' && page === 'security') return <ClientSecurity />;
    if (group === 'client' && page === 'games-apps') return <ClientGamesApps />;
    if (group === 'client' && page === 'terms') return <PlaceholderPage title='Client/Terms and conditions' />;
    if (group === 'client' && page === 'discord') return <PlaceholderPage title='Client/Discord configuration' />;

    // Other main sections
    if (active === 'shop') return <PlaceholderPage title='Shop settings' />;
    if (active === 'groups') return <PlaceholderPage title='Groups config' />;
    if (active === 'employees') return <PlaceholderPage title='Employees' />;
    if (active === 'loyalty') return <PlaceholderPage title='Loyalty system' />;
    if (active === 'players') return <PlaceholderPage title='Players web portal' />;
    if (active === 'exports') return <PlaceholderPage title='Exports' />;
    if (active === 'bookings') return <PlaceholderPage title='Bookings' />;
    if (active === 'webadmin') return <PlaceholderPage title='Web-admin settings' />;
    if (active === 'notifications') return <PlaceholderPage title='Player notifications' />;
    if (active === 'subscription') return <PlaceholderPage title='Subscription management' />;
    if (active === 'userlogin') return <PlaceholderPage title='User login' />;
    if (active === 'integrations') return <PlaceholderPage title='Integrations' />;
    if (active === 'api') return <PlaceholderPage title='API' />;
    if (active === 'account') return <PlaceholderPage title='Account' />;
    if (active === 'marketplace') return <PlaceholderPage title='Add-Ons Marketplace' />;

    return <div className='text-gray-400'>Select a settings page</div>;
  };

  return (
    <div className="DashboardSection SettingsSection flex flex-col lg:flex-row gap-6">
      <div className="DashboardLeft">
        <SettingsPageLeftNav active={active} setActive={setActive} />
      </div>
      <div className="DashboardRight flex-1">
        {renderRight()}
      </div>
    </div>
  );
}
