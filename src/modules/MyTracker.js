import {useState} from 'react';
import {C,SCRIPT,STATUS_OPTIONS,STATUS_COLORS} from '../data';
import {Card,Pill} from '../ui';

export default function MyTracker({library,onUpdateStatus,onRemove,isMobile}){
  const [filter,setFilter]=useState("All");
  const filtered=filter==="All"?library:library.filter(b=>b.status===filter);
  const counts=STATUS_OPTIONS.reduce((a,s)=>({...a,[s]:library.filter(b=>b.status===s).length}),{});
  if(!library.length)return(
    <div style={{background:C.creamDark,borderRadius:16,padding:48,textAlign:"center"}}>
      <div style={{fontSize:32,marginBottom:12,color:C.warm}}>◈</div>
      <div style={{color:C.espresso,fontWeight:700,marginBottom:6}}>Your tracker is empty</div>
      <div style={{color:C.warm,fontSize:13}}>Browse the Brief Library and save briefs to track your progress.</div>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {STATUS_OPTIONS.map(s=>(
          <div key={s} style={{background:C.creamDark,borderRadius:12,padding:14,textAlign:"center"}}>
            <div style={{fontSize:26,fontWeight:800,color:STATUS_COLORS[s]}}>{counts[s]}</div>
            <div style={{fontSize:9,color:C.warm,fontWeight:700,letterSpacing:1.5,marginTop:2}}>{s.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {["All",...STATUS_OPTIONS].map(s=><Pill key={s} label={s} active={filter===s} onClick={()=>setFilter(s)} accent={STATUS_COLORS[s]}/>)}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(brief=>(
          <Card key={brief.id} style={{display:"flex",flexDirection:"column",gap:12}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
              <div>
                <div style={{fontSize:10,color:C.warm,fontWeight:700,letterSpacing:2,marginBottom:3}}>{brief.week}</div>
                <div style={{fontSize:isMobile?15:17,fontWeight:800,color:C.espresso,fontFamily:SCRIPT}}>{brief.title}</div>
              </div>
              <button onClick={()=>onRemove(brief.id)} style={{background:"none",border:"none",color:C.warm,cursor:"pointer",fontSize:20,lineHeight:1,padding:4}}>×</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              <div style={{background:C.cream,borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:9,color:C.warm,fontWeight:700,letterSpacing:2,marginBottom:4}}>THEME</div>
                <div style={{fontSize:13,color:C.espresso,fontWeight:600}}>{brief.theme}</div>
              </div>
              <div style={{background:C.cream,borderRadius:10,padding:"10px 12px"}}>
                <div style={{fontSize:9,color:C.warm,fontWeight:700,letterSpacing:2,marginBottom:4}}>ART STYLE</div>
                <div style={{fontSize:13,color:C.espresso,fontWeight:600}}>{brief.style}</div>
              </div>
            </div>
            <div style={{background:C.cream,borderRadius:10,padding:"10px 12px"}}>
              <div style={{fontSize:9,color:C.warm,fontWeight:700,letterSpacing:2,marginBottom:8}}>COLOR PALETTE</div>
              <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
                {brief.palette.map((col,i)=>(
                  <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                    <div style={{width:30,height:30,borderRadius:8,background:col,boxShadow:"0 2px 6px rgba(0,0,0,.12)"}}/>
                    <div style={{fontSize:8,color:C.warm,textAlign:"center",maxWidth:42,lineHeight:1.2}}>{brief.paletteNames[i]}</div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div style={{fontSize:9,color:C.warm,fontWeight:700,letterSpacing:2,marginBottom:8}}>STATUS</div>
              <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                {STATUS_OPTIONS.map(s=>(
                  <button key={s} onClick={()=>onUpdateStatus(brief.id,s)} style={{background:brief.status===s?STATUS_COLORS[s]:C.cream,color:brief.status===s?(s==="In Progress"?C.espresso:"#fff"):C.warm,border:`1.5px solid ${brief.status===s?STATUS_COLORS[s]:C.warm+"30"}`,borderRadius:8,padding:"7px 13px",fontSize:11,fontWeight:700,cursor:"pointer",transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>{s}</button>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
