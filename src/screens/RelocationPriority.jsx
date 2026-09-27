import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { getRelocationPriorities } from '../data/data.js';

export default function RelocationPriority() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Immediate');

  const rankedHabitations = getRelocationPriorities();

  const filteredData = activeTab === 'Immediate' 
    ? rankedHabitations.filter(d => d.priorityCategory === 'Immediate')
    : activeTab === 'Short Term'
    ? rankedHabitations.filter(d => d.priorityCategory === 'Short-Term')
    : activeTab === 'Medium Term'
    ? rankedHabitations.filter(d => d.priorityCategory === 'Medium-Term')
    : rankedHabitations;

  return (
    <>
      <div className="flex-between mb-4">
        <div>
          <h1>Relocation Priority Planner</h1>
          <p className="text-muted">AI-ranked list of habitations requiring relocation</p>
        </div>
        <button className="btn btn-primary" onClick={() => navigate('/plan')}>
          Generate Relocation Plan <ArrowRight size={16} />
        </button>
      </div>

      <div className="tabs">
        {['Immediate', 'Short Term', 'Medium Term', 'Monitor', 'All'].map(tab => (
          <div 
            key={tab} 
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </div>
        ))}
      </div>

      <div className="card" style={{padding:0, overflow:'hidden'}}>
        <table className="data-table">
          <thead style={{background:'var(--bg-surface)'}}>
            <tr>
              <th>Rank</th>
              <th>Habitation</th>
              <th>Population</th>
              <th>Risk Score</th>
              <th>Vulnerability</th>
              <th>Timeline</th>
              <th>Priority</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
              {filteredData.map((d, index) => {
                const riskColor = d.riskTier === 'Extreme' ? 'var(--risk-extreme)' 
                                : d.riskTier === 'High' ? 'var(--risk-high)' 
                                : d.riskTier === 'Moderate' ? 'var(--risk-moderate)' 
                                : 'var(--risk-low)';
                                
                const vulnLevel = d.vulnerabilityScore >= 75 ? 'High' 
                                : d.vulnerabilityScore >= 50 ? 'Medium' : 'Low';
                                
                return (
                  <tr key={d.id}>
                    <td><strong>#{index + 1}</strong></td>
                    <td style={{fontWeight: 600}}>{d.name}</td>
                    <td>{d.population.toLocaleString()}</td>
                    <td>
                      <div className="badge" style={{background: `${riskColor}20`, color: riskColor}}>
                        {d.priorityEngine.score}
                      </div>
                    </td>
                    <td>{vulnLevel}</td>
                    <td><strong>{d.priorityCategory}</strong></td>
                    <td>
                      <button 
                        className="btn btn-secondary" 
                        style={{padding: '6px 12px', fontSize: '0.8rem'}}
                        onClick={() => navigate(`/habitation/${d.id}`)}
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
        </table>
      </div>
    </>
  );
}
