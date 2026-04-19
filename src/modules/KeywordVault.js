import {useState} from 'react';
import {C} from '../data';
import {Card,SLabel,Btn,Input,Pill} from '../ui';

const DEFAULT_KEYWORDS=[
  {cat:"Florals",tags:["watercolor flowers","spring blooms","floral clipart","botanical illustration","wildflowers png","peony clipart","rose clipart","lavender sprig","pressed flower","garden clipart"]},
  {cat:"Aesthetic",tags:["coquette aesthetic","cottagecore clipart","boho clipart","soft girl aesthetic","dark academia","kawaii clipart","retro groovy","coastal grandmother","tomato girl","matcha aesthetic"]},
  {cat:"Seasonal",tags:["fall leaves clipart","pumpkin png","winter botanical","spring garden","summer beach","autumn harvest","snow clipart","sunflower clipart","christmas clipart","halloween png"]},
  {cat:"Events",tags:["wedding clipart","baby shower png","birthday party","graduation clipart","mother's day","valentines day","christmas sublimation","easter clipart","thanksgiving png","new year"]},
  {cat:"Characters",tags:["cute animals png","fairy clipart","mushroom character","cottagecore girl","vintage lady","whimsical cat","frog clipart","bunny png","gnome clipart","mermaid illustration"]},
  {cat:"File Types",tags:["commercial use png","transparent background","sublimation design","digital download","300 dpi clipart","procreate stamp","printable clipart","seamless pattern","svg cut file","watercolor texture"]},
];

function useKeywords(){
  const [keywords,setKeywords]=useState(()=>{
    try{const s=localStorage.getItem("admin-keywords");return s?JSON.parse(s):DEFAULT_KEYWORDS;}
    catch{return DEFAULT_KEYWORDS;}
  });
  const save=v=>{setKeywords(v);try{localStorage.setItem("admin-keywords",JSON.stringify(v));}catch{}};
  return [keywords,save];
}

function AdminKeywords({keywords,setKeywords,onClose}){
  const [activeCat,setActiveCat]=useState(keywords[0]?.cat||"");
  const [newCat,setNewCat]=useState("");
  const [newTag,setNewTag]=useState("");

  const currentIdx=keywords.findIndex(k=>k.cat===activeCat);
  const current=keywords[currentIdx];

  const addCategory=()=>{
    if(!newCat.trim()||keywords.find(k=>k.cat===newCat.trim()))return;
    const updated=[...keywords,{cat:newCat.trim(),tags:[]}];
    setKeywords(updated);setActiveCat(newCat.trim());setNewCat("");
  };
  const deleteCategory=()=>{
    if(keywords.length<=1)return;
    const updated=keywords.filter(k=>k.cat!==activeCat);
    setKeywords(updated);setActiveCat(updated[0]?.cat||"");
  };
  const addTag=()=>{
    if(!newTag.trim()||!current)return;
    const updated=keywords.map((k,i)=>i===currentIdx?{...k,tags:[...k.tags,newTag.trim()]}:k);
    setKeywords(updated);setNewTag("");
  };
  const removeTag=(tag)=>{
    const updated=keywords.map((k,i)=>i===currentIdx?{...k,tags:k.tags.filter(t=>t!==tag)}:k);
    setKeywords(updated);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.cream,borderRadius:20,width:"100%",maxWidth:640,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{background:C.espresso,borderRadius:"20px 20px 0 0",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:C.mustard,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:3}}>ADMIN</div>
            <div style={{color:C.cream,fontSize:18,fontWeight:800,fontFamily:"'Playfair Display',serif"}}>Keyword Manager</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.1)",border:"none",color:C.cream,borderRadius:"50%",width:34,height:34,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
          {/* Categories */}
          <div>
            <SLabel>Categories</SLabel>
            <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:12}}>
              {keywords.map(k=>(
                <button key={k.cat} onClick={()=>setActiveCat(k.cat)} style={{background:activeCat===k.cat?C.mustard:C.creamDark,color:activeCat===k.cat?C.espresso:C.warm,border:"none",borderRadius:20,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{k.cat}</button>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <Input value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addCategory()} placeholder="New category name..." style={{flex:1}}/>
              <Btn onClick={addCategory} disabled={!newCat.trim()}>+ Add</Btn>
            </div>
          </div>

          {/* Tags for active category */}
          {current&&(
            <Card>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <SLabel style={{margin:0}}>{current.cat} — {current.tags.length} keywords</SLabel>
                <Btn variant="danger" onClick={deleteCategory} style={{fontSize:11,padding:"5px 12px"}}>Delete Category</Btn>
              </div>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
                {current.tags.map(t=>(
                  <div key={t} style={{background:C.cream,border:`1px solid ${C.mustard}30`,borderRadius:8,padding:"6px 12px",display:"flex",alignItems:"center",gap:6}}>
                    <span style={{fontSize:12,color:C.espresso,fontWeight:600}}>{t}</span>
                    <button onClick={()=>removeTag(t)} style={{background:"none",border:"none",color:C.warm,cursor:"pointer",fontSize:14,lineHeight:1,padding:0}}>×</button>
                  </div>
                ))}
                {!current.tags.length&&<div style={{fontSize:12,color:C.warm,fontStyle:"italic"}}>No keywords yet — add some below</div>}
              </div>
              <div style={{display:"flex",gap:8}}>
                <Input value={newTag} onChange={e=>setNewTag(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addTag()} placeholder="Add keyword (e.g. watercolor flowers png)..." style={{flex:1}}/>
                <Btn onClick={addTag} disabled={!newTag.trim()}>+ Add</Btn>
              </div>
            </Card>
          )}

          <div style={{background:C.mustard+"20",borderRadius:10,padding:12,fontSize:12,color:C.espresso}}>
            💡 Changes save automatically and are visible to all members instantly.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KeywordVault({isAdmin}){
  const [keywords,setKeywords]=useKeywords();
  const [active,setActive]=useState(keywords[0]?.cat||"");
  const [copied,setCopied]=useState(null);
  const [showAdmin,setShowAdmin]=useState(false);
  const copy=t=>{navigator.clipboard?.writeText(t);setCopied(t);setTimeout(()=>setCopied(null),1400);};
  const cur=keywords.find(k=>k.cat===active);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        {keywords.map(k=><Pill key={k.cat} label={k.cat} active={active===k.cat} onClick={()=>setActive(k.cat)}/>)}
        {isAdmin&&(
          <button onClick={()=>setShowAdmin(true)} style={{marginLeft:"auto",background:C.espresso,border:"none",borderRadius:20,padding:"7px 16px",fontSize:12,fontWeight:700,color:C.mustard,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>⚙️ Edit Keywords</button>
        )}
      </div>
      {cur?(
        <Card>
          <SLabel>{cur.cat} — click any tag to copy</SLabel>
          {!cur.tags.length&&<div style={{fontSize:13,color:C.warm,fontStyle:"italic"}}>No keywords in this category yet.</div>}
          <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
            {cur.tags.map(t=>(
              <button key={t} onClick={()=>copy(t)} style={{background:copied===t?C.sage:C.cream,color:copied===t?"#fff":C.espresso,border:`1.5px solid ${copied===t?C.sage:C.mustard+"40"}`,borderRadius:8,padding:"7px 14px",fontSize:12,fontFamily:"'DM Sans',sans-serif",cursor:"pointer",transition:"all .2s",fontWeight:600}}>
                {copied===t?"✓ Copied":t}
              </button>
            ))}
          </div>
        </Card>
      ):(
        <Card style={{textAlign:"center",padding:32}}>
          <div style={{color:C.warm,fontSize:13}}>No keyword categories yet. {isAdmin?"Add some using the Edit Keywords button above.":"Check back soon!"}</div>
        </Card>
      )}
      <div style={{background:C.blush+"40",borderRadius:12,padding:14,fontSize:12,color:C.warm,lineHeight:1.6}}>
        💡 Stack 2–3 style words + 1 event word: e.g. <em>"watercolor botanical valentines clipart PNG"</em>
      </div>
      {showAdmin&&<AdminKeywords keywords={keywords} setKeywords={setKeywords} onClose={()=>setShowAdmin(false)}/>}
    </div>
  );
}
