import {useState} from 'react';
import {C,MONTHS_DATA} from '../data';

export default function TrendCalendar(){
  const [active,setActive]=useState(new Date().getMonth());
  const m=MONTHS_DATA[active];
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>
        {MONTHS_DATA.map((mo,i)=>(
          <button key={mo.month} onClick={()=>setActive(i)} style={{background:active===i?C.espresso:C.creamDark,color:active===i?C.mustard:C.warm,border:"none",borderRadius:8,padding:"8px 4px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",transition:"all .2s"}}>{mo.month}</button>
        ))}
      </div>
      <div style={{background:C.espresso,borderRadius:14,padding:24}}>
        <div style={{color:C.mustard,fontSize:20,fontWeight:800,fontFamily:"'Playfair Display',serif",marginBottom:16}}>{m.month} — Key Moments</div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {m.events.map((ev,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,.07)",borderLeft:`3px solid ${m.color}`,borderRadius:8,padding:"10px 14px"}}>
              <span style={{color:C.cream,fontSize:13}}>{ev}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:C.mustard+"20",borderRadius:12,padding:14,fontSize:12,color:C.espresso,lineHeight:1.6}}>
        🗓 <strong>Start creating 6–8 weeks before peak season</strong> for maximum Etsy algorithm exposure.
      </div>
    </div>
  );
}
