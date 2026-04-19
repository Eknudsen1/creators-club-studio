import {useState,useEffect,useRef} from 'react';
import {C,FONT,SCRIPT,ADMIN_PASSWORD,SEED_BRIEFS} from './data';
import {Btn,Input} from './ui';
import AdminPanel from './AdminPanel';
import BriefLibrary from './modules/BriefLibrary';
import MyTracker from './modules/MyTracker';
import TrendCalendar from './modules/TrendCalendar';
import KeywordVault from './modules/KeywordVault';
import RevenueTracker from './modules/RevenueTracker';
import ProductPerformance from './modules/ProductPerformance';
import StyleBoard from './modules/StyleBoard';

const NAV=[
  {id:"library",icon:"◈",label:"Brief Library"},
  {id:"tracker",icon:"✦",label:"My Tracker"},
  {id:"trends",icon:"◉",label:"Trend Calendar"},
  {id:"keywords",icon:"◎",label:"Keyword Vault"},
  {id:"revenue",icon:"▣",label:"Revenue"},
  {id:"performance",icon:"◈",label:"Performance"},
  {id:"styleboard",icon:"⬡",label:"Style Board"},
];

function useLS(key,fallback){
  const [val,setVal]=useState(()=>{try{const s=localStorage.getItem(key);return s?JSON.parse(s):fallback;}catch{return fallback;}});
  const save=v=>{const next=typeof v==="function"?v(val):v;setVal(next);try{localStorage.setItem(key,JSON.stringify(next));}catch{}};
  return [val,save];
}

function useBreakpoint(){
  const [isMobile,setIsMobile]=useState(window.innerWidth<768);
  useEffect(()=>{const fn=()=>setIsMobile(window.innerWidth<768);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
  return isMobile;
}

export default function App(){
  const isMobile=useBreakpoint();
  const [page,setPage]=useState("library");
  const [navOpen,setNavOpen]=useState(false);
  const [library,setLibrary]=useLS("brief-library",[]);
  const [sharedBriefs,setSharedBriefs]=useLS("shared-briefs",SEED_BRIEFS);
  const [showAdmin,setShowAdmin]=useState(false);
  const [showPw,setShowPw]=useState(false);
  const [pw,setPw]=useState("");
  const [pwErr,setPwErr]=useState(false);
  const [isAdmin,setIsAdmin]=useState(false);
  const tapCount=useRef(0);
  const tapTimer=useRef(null);

  const handleLogoTap=()=>{
    tapCount.current+=1;
    clearTimeout(tapTimer.current);
    if(tapCount.current>=3){tapCount.current=0;setShowPw(true);setPw("");setPwErr(false);}
    else{tapTimer.current=setTimeout(()=>{tapCount.current=0;},1200);}
  };
  const handlePw=()=>{
    if(pw===ADMIN_PASSWORD){setIsAdmin(true);setShowPw(false);setShowAdmin(true);setPwErr(false);}
    else{setPwErr(true);setPw("");}
  };

  const saveBrief=brief=>setLibrary(l=>l.find(b=>b.id===brief.id)?l:[...l,{...brief,status:"Not Started",savedAt:Date.now()}]);
  const updateStatus=(id,status)=>setLibrary(l=>l.map(b=>b.id===id?{...b,status}:b));
  const removeBrief=id=>setLibrary(l=>l.filter(b=>b.id!==id));

  const allBriefs=sharedBriefs.length?sharedBriefs:SEED_BRIEFS;
  const savedCount=library.length;
  const doneCount=library.filter(b=>b.status==="Completed").length;

  const PAGE_MAP={
    library:<BriefLibrary allBriefs={allBriefs} library={library} onSave={saveBrief} isMobile={isMobile}/>,
    tracker:<MyTracker library={library} onUpdateStatus={updateStatus} onRemove={removeBrief} isMobile={isMobile}/>,
    trends:<TrendCalendar/>,
    keywords:<KeywordVault isAdmin={isAdmin}/>,
    revenue:<RevenueTracker/>,
    performance:<ProductPerformance/>,
    styleboard:<StyleBoard/>,
  };

  const SidebarContent=()=>(
    <>
      <div onClick={handleLogoTap} style={{padding:"22px 18px 16px",borderBottom:"1px solid rgba(255,255,255,.07)",cursor:"default",userSelect:"none"}}>
        <div style={{color:C.mustard,fontSize:19,fontFamily:SCRIPT,fontWeight:800,lineHeight:1.2}}>Clipart Creator<br/>Studio</div>
        <div style={{color:"rgba(255,255,255,.28)",fontSize:9,marginTop:5,letterSpacing:2.5}}>YOUR CREATIVE HQ</div>
      </div>
      <div style={{padding:"12px 14px",display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {[["Saved",savedCount,C.mustard],["Done",doneCount,C.sage]].map(([l,v,col])=>(
          <div key={l} style={{background:"rgba(255,255,255,.06)",borderRadius:8,padding:"8px 10px",textAlign:"center"}}>
            <div style={{color:col,fontSize:20,fontWeight:800}}>{v}</div>
            <div style={{color:"rgba(255,255,255,.35)",fontSize:9,fontWeight:700,letterSpacing:1.5}}>{l.toUpperCase()}</div>
          </div>
        ))}
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:1,padding:"4px 8px"}}>
        {NAV.map(item=>(
          <button key={item.id} onClick={()=>{setPage(item.id);setNavOpen(false);}} style={{background:page===item.id?"rgba(212,168,67,.15)":"transparent",color:page===item.id?C.mustard:"rgba(255,255,255,.45)",border:"none",borderRadius:9,padding:"11px 12px",textAlign:"left",fontFamily:FONT,fontSize:12,fontWeight:page===item.id?700:400,cursor:"pointer",display:"flex",alignItems:"center",gap:9,transition:"all .15s"}}>
            <span style={{fontSize:13}}>{item.icon}</span>
            {item.label}
            {item.id==="tracker"&&savedCount>0&&<span style={{marginLeft:"auto",background:C.mustard,color:C.espresso,borderRadius:10,padding:"1px 7px",fontSize:9,fontWeight:800}}>{savedCount}</span>}
          </button>
        ))}
      </div>
      <div style={{margin:"0 10px 10px",background:`linear-gradient(135deg,${C.sage}25,${C.lavender}15)`,border:`1px solid ${C.sage}40`,borderRadius:10,padding:12}}>
        <div style={{color:C.mustard,fontSize:9,fontWeight:700,letterSpacing:2,marginBottom:3}}>✦ WEEKLY DROP</div>
        <div style={{color:"rgba(255,255,255,.6)",fontSize:11,lineHeight:1.5}}>New briefs every week. Check the library!</div>
      </div>
      {isAdmin&&<button onClick={()=>setShowAdmin(true)} style={{margin:"0 10px 0",background:C.mustard+"20",border:`1px solid ${C.mustard}40`,borderRadius:10,padding:"10px 14px",color:C.mustard,fontFamily:FONT,fontSize:12,fontWeight:700,cursor:"pointer"}}>⚙️ Admin Panel</button>}
    </>
  );

  return(
    <div style={{display:"flex",height:"100vh",background:C.cream,fontFamily:FONT,overflow:"hidden"}}>
      {/* Desktop sidebar */}
      {!isMobile&&(
        <div style={{width:200,background:C.espresso,display:"flex",flexDirection:"column",padding:"0 0 20px",flexShrink:0,overflowY:"auto"}}>
          <SidebarContent/>
        </div>
      )}

      {/* Mobile drawer */}
      {isMobile&&navOpen&&(
        <>
          <div onClick={()=>setNavOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.4)",zIndex:199}}/>
          <div style={{position:"fixed",top:0,left:0,bottom:0,width:220,background:C.espresso,zIndex:200,display:"flex",flexDirection:"column",padding:"0 0 20px",overflowY:"auto",transition:"transform .3s ease"}}>
            <SidebarContent/>
          </div>
        </>
      )}

      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:isMobile?"14px 16px":"16px 24px",borderBottom:`1px solid ${C.mustard}15`,background:C.cream,display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0,gap:12}}>
          {isMobile&&<button onClick={()=>setNavOpen(o=>!o)} style={{background:"none",border:"none",color:C.espresso,fontSize:22,cursor:"pointer",padding:4,lineHeight:1}}>☰</button>}
          <div style={{fontSize:isMobile?17:20,fontWeight:800,color:C.espresso,fontFamily:SCRIPT,flex:1}}>{NAV.find(n=>n.id===page)?.label}</div>
          <div style={{background:C.creamDark,borderRadius:20,padding:"5px 14px",fontSize:11,color:C.warm,fontWeight:600,whiteSpace:"nowrap"}}>
            {new Date().toLocaleDateString("en-US",{month:"long",year:"numeric"})} ✦
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto",padding:isMobile?14:22}}>
          <div key={page} style={{animation:"fadeIn .3s ease",maxWidth:900,margin:"0 auto"}}>
            {PAGE_MAP[page]}
          </div>
        </div>
      </div>

      {/* Password prompt */}
      {showPw&&(
        <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:500,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:C.cream,borderRadius:20,padding:32,width:"100%",maxWidth:360,display:"flex",flexDirection:"column",gap:16}}>
            <div style={{fontSize:18,fontWeight:800,color:C.espresso,fontFamily:SCRIPT}}>Admin Access</div>
            <Input value={pw} onChange={e=>{setPw(e.target.value);setPwErr(false);}} onKeyDown={e=>e.key==="Enter"&&handlePw()} placeholder="Enter admin password" type="password"/>
            {pwErr&&<div style={{color:"#DC2626",fontSize:13,fontWeight:600}}>Incorrect password</div>}
            <div style={{display:"flex",gap:10}}>
              <Btn variant="ghost" onClick={()=>setShowPw(false)} style={{flex:1}}>Cancel</Btn>
              <Btn onClick={handlePw} style={{flex:1}}>Enter</Btn>
            </div>
          </div>
        </div>
      )}

      {showAdmin&&<AdminPanel sharedBriefs={sharedBriefs} setSharedBriefs={setSharedBriefs} onClose={()=>setShowAdmin(false)}/>}
    </div>
  );
}
