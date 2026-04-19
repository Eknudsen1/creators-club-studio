import {useState} from 'react';
import {C,SCRIPT} from '../data';
import {Card,SLabel,Btn,Pill} from '../ui';

function BriefCard({brief,isSaved,onSave,isMobile}){
  const [open,setOpen]=useState(false);
  return(
    <Card style={{display:"flex",flexDirection:"column",gap:14}}>
      {/* Example image — always visible if present */}
      {brief.exampleImage&&(
        <div style={{borderRadius:12,overflow:"hidden",margin:"-20px -20px 0 -20px"}}>
          <img src={brief.exampleImage} alt={brief.title} style={{width:"100%",maxHeight:220,objectFit:"cover",display:"block"}}/>
        </div>
      )}

      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
        <div style={{flex:1}}>
          <div style={{fontSize:10,color:C.warm,fontWeight:700,letterSpacing:2,marginBottom:4}}>{brief.week}</div>
          <div style={{fontSize:isMobile?16:18,fontWeight:800,color:C.espresso,fontFamily:SCRIPT,lineHeight:1.2}}>{brief.title}</div>
          <div style={{display:"flex",gap:6,marginTop:7,flexWrap:"wrap"}}>
            {brief.style&&<span style={{background:C.lavender+"50",color:C.espresso,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600}}>{brief.style}</span>}
            <span style={{background:C.blush+"50",color:C.espresso,borderRadius:20,padding:"3px 10px",fontSize:11,fontWeight:600}}>{brief.theme}</span>
          </div>
        </div>
        <div style={{display:"flex",gap:4,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end",maxWidth:120}}>
          {brief.palette.map((col,i)=><div key={i} title={brief.paletteNames[i]} style={{width:20,height:20,borderRadius:"50%",background:col,boxShadow:"0 1px 4px rgba(0,0,0,.15)"}}/>)}
        </div>
      </div>

      {open&&(
        <div style={{display:"flex",flexDirection:"column",gap:12,animation:"fadeIn .3s ease"}}>
          <div>
            <SLabel>Mood Words</SLabel>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {brief.moodWords.map(w=><span key={w} style={{background:C.lavender+"40",color:C.espresso,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:600}}>{w}</span>)}
            </div>
          </div>
          <div>
            <SLabel>Elements ({brief.elements.length})</SLabel>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
              {brief.elements.map((el,i)=>(
                <div key={i} style={{fontSize:12,color:C.espresso,display:"flex",alignItems:"center",gap:6}}>
                  <span style={{color:C.mustard,fontWeight:800,fontSize:10,minWidth:18}}>{String(i+1).padStart(2,"0")}</span>{el}
                </div>
              ))}
            </div>
          </div>
          <div>
            <SLabel>Color Palette</SLabel>
            <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap"}}>
              {brief.palette.map((col,i)=>(
                <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
                  <div style={{width:32,height:32,borderRadius:8,background:col,boxShadow:"0 2px 6px rgba(0,0,0,.12)"}}/>
                  <div style={{fontSize:9,color:C.warm,textAlign:"center",maxWidth:48,lineHeight:1.2}}>{brief.paletteNames[i]}</div>
                </div>
              ))}
            </div>
          </div>
          {brief.sellerTip&&(
            <div style={{background:C.sage+"20",border:`1px solid ${C.sage}`,borderRadius:10,padding:12}}>
              <div style={{fontSize:10,color:C.sageDark,fontWeight:700,letterSpacing:2,marginBottom:4}}>SELLER TIP</div>
              <div style={{fontSize:12,color:C.espresso,lineHeight:1.6}}>{brief.sellerTip}</div>
            </div>
          )}
        </div>
      )}

      <div style={{display:"flex",gap:8,alignItems:"center"}}>
        <Btn variant="ghost" onClick={()=>setOpen(o=>!o)} style={{fontSize:12,padding:"6px 14px"}}>{open?"▲ Less":"▼ More Details"}</Btn>
        <div style={{flex:1}}/>
        {isSaved
          ?<span style={{background:C.sage+"30",color:C.sageDark,borderRadius:20,padding:"5px 12px",fontSize:12,fontWeight:700}}>✓ Saved</span>
          :<Btn onClick={()=>onSave(brief)}>+ Save to Tracker</Btn>}
      </div>
    </Card>
  );
}

export default function BriefLibrary({allBriefs,library,onSave,isMobile}){
  const styles=["All",...new Set(allBriefs.map(b=>b.style).filter(Boolean))];
  const [filter,setFilter]=useState("All");
  const filtered=filter==="All"?allBriefs:allBriefs.filter(b=>b.style===filter);
  const savedIds=new Set(library.map(b=>b.id));
  if(!allBriefs.length)return(
    <div style={{background:C.creamDark,borderRadius:16,padding:48,textAlign:"center"}}>
      <div style={{fontSize:32,marginBottom:12,color:C.warm}}>◈</div>
      <div style={{color:C.espresso,fontWeight:700,marginBottom:6}}>No briefs yet</div>
      <div style={{color:C.warm,fontSize:13}}>New briefs drop weekly! Check back soon.</div>
    </div>
  );
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{styles.map(s=><Pill key={s} label={s} active={filter===s} onClick={()=>setFilter(s)}/>)}</div>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {[...filtered].sort((a,b)=>b.createdAt-a.createdAt).map(b=><BriefCard key={b.id} brief={b} isSaved={savedIds.has(b.id)} onSave={onSave} isMobile={isMobile}/>)}
      </div>
    </div>
  );
}
