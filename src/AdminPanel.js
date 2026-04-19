import {useState} from 'react';
import {C,FONT,SCRIPT,ART_STYLES} from './data';
import {Card,SLabel,Btn,Input,Textarea} from './ui';

const EMPTY={title:"",week:"",theme:"",style:"Loose Watercolor",palette:["#F9C6C6","#B8D8BA","#F7E4BE","#C5D8E8","#EDD9F0"],paletteNames:["","","","",""],moodWordsRaw:"",elementsRaw:"",sellerTip:""};

export default function AdminPanel({sharedBriefs,setSharedBriefs,onClose}){
  const [form,setForm]=useState(EMPTY);
  const [editId,setEditId]=useState(null);
  const [saved,setSaved]=useState(false);
  const [tab,setTab]=useState("add");
  const setF=(k,v)=>setForm(f=>({...f,[k]:v}));
  const setPalette=(i,v)=>setForm(f=>{const p=[...f.palette];p[i]=v;return{...f,palette:p};});
  const setPName=(i,v)=>setForm(f=>{const p=[...f.paletteNames];p[i]=v;return{...f,paletteNames:p};});

  const save=()=>{
    const moodWords=form.moodWordsRaw.split(",").map(s=>s.trim()).filter(Boolean);
    const elements=form.elementsRaw.split("\n").map(s=>s.trim()).filter(Boolean);
    if(!form.title||!form.week||!form.theme||!elements.length)return;
    const brief={id:editId||`brief-${Date.now()}`,title:form.title,week:form.week,theme:form.theme,style:form.style,palette:form.palette,paletteNames:form.paletteNames,moodWords,elements,sellerTip:form.sellerTip,createdAt:editId?(sharedBriefs.find(b=>b.id===editId)?.createdAt||Date.now()):Date.now()};
    setSharedBriefs(bs=>editId?bs.map(b=>b.id===editId?brief:b):[...bs,brief]);
    setForm(EMPTY);setEditId(null);setSaved(true);setTimeout(()=>setSaved(false),2000);setTab("manage");
  };

  const startEdit=b=>{setForm({title:b.title,week:b.week,theme:b.theme,style:b.style,palette:b.palette,paletteNames:b.paletteNames,moodWordsRaw:b.moodWords.join(", "),elementsRaw:b.elements.join("\n"),sellerTip:b.sellerTip});setEditId(b.id);setTab("add");};

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.cream,borderRadius:20,width:"100%",maxWidth:640,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{background:C.espresso,borderRadius:"20px 20px 0 0",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:C.mustard,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:3}}>ADMIN</div>
            <div style={{color:C.cream,fontSize:18,fontWeight:800,fontFamily:SCRIPT}}>Brief Manager</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.1)",border:"none",color:C.cream,borderRadius:"50%",width:34,height:34,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{display:"flex",borderBottom:`1px solid ${C.creamDark}`}}>
          {[["add",editId?"Edit Brief":"Add New Brief"],["manage","Manage Briefs"]].map(([id,label])=>(
            <button key={id} onClick={()=>setTab(id)} style={{flex:1,padding:"13px 16px",fontFamily:FONT,fontWeight:700,fontSize:13,background:tab===id?C.creamDark:C.cream,color:tab===id?C.espresso:C.warm,border:"none",cursor:"pointer",borderBottom:tab===id?`2px solid ${C.mustard}`:"2px solid transparent"}}>{label}</button>
          ))}
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
          {tab==="add"&&<>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><SLabel>Title</SLabel><Input value={form.title} onChange={e=>setF("title",e.target.value)} placeholder="e.g. Watercolor Spring Florals"/></div>
              <div><SLabel>Week Label</SLabel><Input value={form.week} onChange={e=>setF("week",e.target.value)} placeholder="e.g. Week 05 · May 2026"/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
              <div><SLabel>Theme</SLabel><Input value={form.theme} onChange={e=>setF("theme",e.target.value)} placeholder="e.g. Spring Florals"/></div>
              <div><SLabel>Art Style</SLabel>
                <select value={form.style} onChange={e=>setF("style",e.target.value)} style={{background:C.cream,border:`1.5px solid ${C.mustard}30`,borderRadius:10,padding:"10px 14px",fontSize:13,fontFamily:FONT,color:C.espresso,outline:"none",width:"100%"}}>
                  {ART_STYLES.map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <SLabel>Color Palette (5 colors)</SLabel>
              <div style={{display:"flex",gap:8}}>
                {form.palette.map((col,i)=>(
                  <div key={i} style={{flex:1,display:"flex",flexDirection:"column",gap:4}}>
                    <input type="color" value={col} onChange={e=>setPalette(i,e.target.value)} style={{width:"100%",height:40,borderRadius:8,border:"none",cursor:"pointer",padding:2}}/>
                    <input value={form.paletteNames[i]} onChange={e=>setPName(i,e.target.value)} placeholder="Name" style={{background:C.cream,border:`1px solid ${C.mustard}30`,borderRadius:6,padding:"4px 6px",fontSize:10,fontFamily:FONT,color:C.espresso,outline:"none",width:"100%",textAlign:"center"}}/>
                  </div>
                ))}
              </div>
            </div>
            <div><SLabel>Mood Words (comma-separated)</SLabel><Input value={form.moodWordsRaw} onChange={e=>setF("moodWordsRaw",e.target.value)} placeholder="Dreamy, Soft, Romantic, Fresh, Airy"/></div>
            <div>
              <SLabel>Elements — one per line</SLabel>
              <Textarea value={form.elementsRaw} onChange={e=>setF("elementsRaw",e.target.value)} rows={8} placeholder={"Full peony bloom\nLoose daisy cluster\n..."}/>
              <div style={{fontSize:11,color:C.warm,marginTop:4}}>{form.elementsRaw.split("\n").filter(s=>s.trim()).length} elements</div>
            </div>
            <div><SLabel>Seller Tip</SLabel><Textarea value={form.sellerTip} onChange={e=>setF("sellerTip",e.target.value)} rows={2} placeholder="One actionable Etsy selling tip..."/></div>
            {saved&&<div style={{background:C.sage+"30",border:`1px solid ${C.sage}`,borderRadius:10,padding:12,color:"#4E7252",fontWeight:700,fontSize:13,textAlign:"center"}}>✓ Brief published!</div>}
            <div style={{display:"flex",gap:10}}>
              {editId&&<Btn variant="ghost" onClick={()=>{setForm(EMPTY);setEditId(null);}} style={{flex:1}}>Cancel</Btn>}
              <Btn onClick={save} style={{flex:1}} disabled={!form.title||!form.week||!form.theme}>{editId?"Update":"Publish Brief"}</Btn>
            </div>
          </>}
          {tab==="manage"&&<>
            {!sharedBriefs.length&&<div style={{textAlign:"center",padding:32,color:C.warm}}><div style={{fontSize:28,marginBottom:8}}>◈</div><div style={{fontSize:13}}>No briefs yet.</div></div>}
            {[...sharedBriefs].sort((a,b)=>b.createdAt-a.createdAt).map(brief=>(
              <Card key={brief.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
                <div style={{flex:1}}>
                  <div style={{fontSize:10,color:C.warm,fontWeight:700,letterSpacing:2,marginBottom:3}}>{brief.week}</div>
                  <div style={{fontSize:15,fontWeight:800,color:C.espresso,fontFamily:SCRIPT,marginBottom:6}}>{brief.title}</div>
                  <div style={{display:"flex",gap:5}}>{brief.palette.map((col,i)=><div key={i} style={{width:16,height:16,borderRadius:"50%",background:col}}/>)}</div>
                </div>
                <div style={{display:"flex",gap:8,flexShrink:0}}>
                  <Btn variant="ghost" onClick={()=>startEdit(brief)} style={{fontSize:12,padding:"6px 12px"}}>Edit</Btn>
                  <Btn variant="danger" onClick={()=>setSharedBriefs(bs=>bs.filter(b=>b.id!==brief.id))} style={{fontSize:12,padding:"6px 12px"}}>Delete</Btn>
                </div>
              </Card>
            ))}
          </>}
        </div>
      </div>
    </div>
  );
}
