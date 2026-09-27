import { Bell, Search, User, MapPin } from 'lucide-react';

export default function Topbar() {
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="flex-between gap-2">
          <MapPin size={18} color="var(--govt-blue)" />
          <select style={{background:'transparent', color:'white', border:'none', fontSize:'1rem', fontWeight:600, outline:'none', cursor:'pointer'}}>
            <option style={{background:'var(--bg-panel)'}}>Kamrup Metropolitan, Assam</option>
            <option style={{background:'var(--bg-panel)'}}>Guwahati</option>
          </select>
        </div>
      </div>
      <div className="topbar-right">
        <div style={{position:'relative'}}>
          <Search size={16} style={{position:'absolute', left:10, top:8, color:'var(--text-muted)'}}/>
          <input type="text" placeholder="Search..." style={{background:'var(--bg-panel)', border:'1px solid var(--border-color)', borderRadius:20, padding:'6px 16px 6px 32px', color:'white', outline:'none'}} />
        </div>
        <div style={{display:'flex', alignItems:'center', gap:16, color:'var(--text-muted)'}}>
          <div style={{display:'flex', alignItems:'center', gap:6, fontSize:'0.8rem'}}>
            <span style={{width:8, height:8, borderRadius:'50%', background:'var(--risk-low)'}}></span>
            Systems Operational
          </div>
          <Bell size={20} style={{cursor:'pointer'}} />
          <div style={{display:'flex', alignItems:'center', gap:8}}>
            <div style={{width:32, height:32, borderRadius:'50%', background:'var(--govt-blue)', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <User size={16} color="white" />
            </div>
            <div className="flex-column" style={{gap:0}}>
              <span style={{fontSize:'0.85rem', fontWeight:600, color:'white'}}>NDRF Admin</span>
              <span style={{fontSize:'0.7rem'}}>Last updated: Just now</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
