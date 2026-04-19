import {useState} from 'react';
import {C,KEYWORDS} from '../data';
import {Card,SLabel,Pill} from '../ui';

export default function KeywordVault(){
  const [active,setActive]=useState("Florals");
  const [copied,setCopied]=useState(null);
  const copy=t=>{navigator.clipboard?.writeText(t);setCopied(t);setTimeout(()=>setCopied(null),1400);};
  const cur=KEYWORDS.find(k=>k.cat===active);
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{KEYWORDS.map(k=><Pill key={k.cat} label={k.cat} active={active===k.cat} onClick={()=>setActive(k.cat)}/>)}</div>
      <Card>
        <SLabel>{active} — click any tag to copy</SLabel>
        <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
          {cur.tags.map(t=>(
            <button key={t} onClick={()=>copy(t)} style={{background:copied===t?C.sage:C.cream,color:copied===t?"#fff":C.espresso,border:`1.5px solid ${copied===t?C.sage:C.mustard+"40"}`,borderRadius:8,padding:"7px 14px",fontSize:12,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all .2s",fontWeight:600}}>
              {copied===t?"✓ Copied":t}
            </button>
          ))}
        </div>
      </Card>
      <div style={{background:C.blush+"40",borderRadius:12,padding:14,fontSize:12,color:C.warm,lineHeight:1.6}}>
        💡 Stack 2–3 style words + 1 event word: e.g. <em>"watercolor botanical valentines clipart PNG"</em>
      </div>
    </div>
  );
}
