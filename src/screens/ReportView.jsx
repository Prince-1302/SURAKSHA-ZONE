import { Download, Printer } from 'lucide-react';

export default function ReportView() {
  return (
    <>
      <div className="flex-between mb-4 print-hide">
        <div>
          <h1>Authority Action Report</h1>
          <p className="text-muted">Printable government-style assessment preview.</p>
        </div>
        <div style={{display:'flex', gap:12}}>
          <button className="btn btn-secondary" onClick={() => window.print()}>
            <Printer size={16} /> Print
          </button>
          <button className="btn btn-primary">
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      <div className="card" style={{background:'white', color:'black', padding:'60px', maxWidth:900, margin:'0 auto', borderRadius:2, border:'none', boxShadow:'0 0 20px rgba(0,0,0,0.2)'}}>
        <div style={{textAlign:'center', borderBottom:'2px solid black', paddingBottom:20, marginBottom:40}}>
          <h1 style={{margin:0, fontSize:'2rem', textTransform:'uppercase'}}>District Disaster Relocation Assessment</h1>
          <h3 style={{margin:'10px 0', fontWeight:500}}>Ministry of Home Affairs / NDRF</h3>
        </div>

        <div style={{display:'flex', justifyContent:'space-between', marginBottom:40, fontSize:'1.1rem'}}>
          <div><strong>District:</strong> Kamrup Metropolitan</div>
          <div><strong>Assessment Date:</strong> 08 September 2026</div>
        </div>

        <div style={{marginBottom:40}}>
          <h2 style={{borderBottom:'1px solid #ccc', paddingBottom:10, textTransform:'uppercase'}}>1. Executive Summary</h2>
          <p style={{lineHeight:1.6}}>
            This assessment identifies critically vulnerable habitations within Kamrup Metropolitan requiring immediate evacuation and relocation due to extreme multi-hazard exposure (primarily severe flood and cloudburst risk). 
            The AI-driven carrying capacity assessment has confirmed safe relocation sites that can accommodate the displaced populations without overwhelming local infrastructure.
          </p>
        </div>

        <div style={{marginBottom:40}}>
          <h2 style={{borderBottom:'1px solid #ccc', paddingBottom:10, textTransform:'uppercase'}}>2. Red-Zone Habitations</h2>
          <table style={{width:'100%', borderCollapse:'collapse', marginTop:20}}>
            <thead>
              <tr style={{background:'#f0f0f0'}}>
                <th style={{padding:12, border:'1px solid #ccc', textAlign:'left'}}>Habitation</th>
                <th style={{padding:12, border:'1px solid #ccc', textAlign:'left'}}>Risk Score</th>
                <th style={{padding:12, border:'1px solid #ccc', textAlign:'left'}}>Population</th>
                <th style={{padding:12, border:'1px solid #ccc', textAlign:'left'}}>Primary Hazard</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{padding:12, border:'1px solid #ccc'}}>Village Boragaon</td>
                <td style={{padding:12, border:'1px solid #ccc'}}>92 / 100</td>
                <td style={{padding:12, border:'1px solid #ccc'}}>1,240</td>
                <td style={{padding:12, border:'1px solid #ccc'}}>Flood (91%)</td>
              </tr>
              <tr>
                <td style={{padding:12, border:'1px solid #ccc'}}>Village Sonapur</td>
                <td style={{padding:12, border:'1px solid #ccc'}}>89 / 100</td>
                <td style={{padding:12, border:'1px solid #ccc'}}>980</td>
                <td style={{padding:12, border:'1px solid #ccc'}}>Cloudburst (86%)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div style={{marginBottom:40}}>
          <h2 style={{borderBottom:'1px solid #ccc', paddingBottom:10, textTransform:'uppercase'}}>3. Relocation Recommendations</h2>
          <p style={{lineHeight:1.6, marginBottom:20}}>Based on real-time carrying capacity constraints, the following assignments have been generated:</p>
          
          <div style={{border:'1px solid #ccc', padding:20, background:'#f9f9f9'}}>
            <h4 style={{margin:0}}>Assignment A: Boragaon Population</h4>
            <ul style={{marginTop:10, paddingLeft:20, lineHeight:1.6}}>
              <li><strong>Destination:</strong> Relocation Site C</li>
              <li><strong>Target Population:</strong> 1,240</li>
              <li><strong>Site Max Capacity:</strong> 1,500</li>
              <li><strong>Constraint:</strong> Water Infrastructure</li>
              <li><strong>Distance:</strong> 4.8 km</li>
            </ul>
          </div>
        </div>

        <div style={{marginTop:80, display:'flex', justifyContent:'space-between'}}>
          <div style={{textAlign:'center', width:250}}>
            <div style={{borderBottom:'1px solid black', height:40}}></div>
            <p style={{marginTop:10, fontWeight:600}}>SDMA Approving Officer</p>
          </div>
          <div style={{textAlign:'center', width:250}}>
            <div style={{borderBottom:'1px solid black', height:40}}></div>
            <p style={{marginTop:10, fontWeight:600}}>NDRF Commander</p>
          </div>
        </div>
        
        <style>{`
          @media print {
            body { background: white !important; }
            .print-hide, .sidebar, .topbar { display: none !important; }
            .main-content { margin: 0 !important; padding: 0 !important; }
            .app-container { height: auto !important; overflow: visible !important; }
          }
        `}</style>
      </div>
    </>
  );
}
