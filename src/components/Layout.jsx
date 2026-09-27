import Sidebar from './Sidebar';
import Topbar from './Topbar';
import SurakshaAI from './SurakshaAI';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Topbar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
      <SurakshaAI />
    </div>
  );
}
