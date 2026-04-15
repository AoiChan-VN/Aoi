// =======================
// SettingsPanel.tsx
// =======================
import { useState } from 'react';
export default function SettingsPanel(){
  const [open,setOpen]=useState(false);
  return (
    <div>
      <button onClick={()=>setOpen(!open)}>⚙</button>
      {open && (
        <div className="glass" style={{position:'absolute',right:20,top:60,padding:16}}>
          <p>Language</p>
          <select>
            <option>EN</option>
            <option>VI</option>
          </select>
        </div>
      )}
    </div>
  );
}
