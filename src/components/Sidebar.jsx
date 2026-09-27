import { NavLink } from 'react-router-dom';
import { ShieldAlert, Map, AlertTriangle, Crosshair, Activity, ListOrdered, Navigation, Sliders, FileText, Settings } from 'lucide-react';

export default function Sidebar() {
  const navItems = [
    { name: 'Overview', path: '/', icon: <ShieldAlert size={18} /> },
    { name: 'Habitation Risk Profile', path: '/habitation/HAB001', icon: <Map size={18} /> },
    { name: 'Red Zone Analysis', path: '/red-zones', icon: <AlertTriangle size={18} /> },
    { name: 'Relocation Site Finder', path: '/relocation-sites', icon: <Crosshair size={18} /> },
    { name: 'Capacity Analysis', path: '/capacity', icon: <Activity size={18} /> },
    { name: 'Relocation Priority', path: '/priority', icon: <ListOrdered size={18} /> },
    { name: 'Relocation Plan', path: '/plan', icon: <Navigation size={18} /> },
    { name: 'Scenario Simulator', path: '/simulator', icon: <Sliders size={18} /> },
    { name: 'Reports', path: '/reports', icon: <FileText size={18} /> },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>SURAKSHA-ZONE</h2>
        <p>AI + GIS Disaster Intelligence</p>
      </div>
      <div className="nav-menu">
        {navItems.map(item => (
          <NavLink 
            to={item.path} 
            key={item.path}
            className={({isActive}) => isActive ? 'nav-item active' : 'nav-item'}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </div>
      <div className="sidebar-footer">
        <a href="#" className="nav-item">
          <Settings size={18} /> Settings
        </a>
      </div>
    </div>
  );
}
