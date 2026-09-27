import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './screens/Dashboard';
import HabitationProfile from './screens/HabitationProfile';
import RedZoneAnalysis from './screens/RedZoneAnalysis';
import RelocationFinder from './screens/RelocationFinder';
import CapacityAnalysis from './screens/CapacityAnalysis';
import RelocationPriority from './screens/RelocationPriority';
import RelocationPlan from './screens/RelocationPlan';
import ScenarioSimulator from './screens/ScenarioSimulator';
import ReportView from './screens/ReportView';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="habitation/:id" element={<HabitationProfile />} />
          <Route path="red-zones" element={<RedZoneAnalysis />} />
          <Route path="relocation-sites" element={<RelocationFinder />} />
          <Route path="capacity" element={<CapacityAnalysis />} />
          <Route path="priority" element={<RelocationPriority />} />
          <Route path="plan" element={<RelocationPlan />} />
          <Route path="simulator" element={<ScenarioSimulator />} />
          <Route path="reports" element={<ReportView />} />
        </Route>
      </Routes>
    </Router>
  );
}
