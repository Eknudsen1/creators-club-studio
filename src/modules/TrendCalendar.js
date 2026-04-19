import {useState} from 'react';
import {C} from '../data';
import {Card,SLabel,Btn,Input} from '../ui';

const MONTHS=["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const MONTH_COLORS=["#C4B5D4","#E8C4C0","#7A9E7E","#D4A843","#E8C4C0","#D4A843","#7A9E7E","#C4B5D4","#D4A843","#E8C4C0","#7A9E7E","#C4B5D4"];

const DEFAULT_CALENDAR=MONTHS.map((month,i)=>({
  month,
  color:MONTH_COLORS[i],
  events:[],
}));

// Seed with some default events
DEFAULT_CALENDAR[0].events=["New Year's Day","Winter Botanicals","Valentine's Prep"];
DEFAULT_CALENDAR[1].events=["Valentine's Day","Galentine's","Winter Cozy"];
DEFAULT_CALENDAR[2].events=["St. Patrick's Day","Spring Equinox","Easter Prep"];
DEFAULT_CALENDAR[3].events=["Easter","Earth Day","Spring Garden","Watercolor Blooms"];
DEFAULT_CALENDAR[4].events=["Mother's Day","Graduation","Spring Boho"];
DEFAULT_CALENDAR[5].events=["Father's Day","Summer Solstice","Beach & Coastal"];
DEFAULT_CALENDAR[6].events=["4th of July","Americana","Summer Fruits"];
DEFAULT_CALENDAR[7].events=["Back to School","Late Summer Blooms","Sunflowers"];
DEFAULT_CALENDAR[8].events=["Fall Launch","Autumn Botanicals","Halloween Prep"];
DEFAULT_CALENDAR[9].events=["Halloween","Fall Harvest","Spooky Cute"];
DEFAULT_CALENDAR[10].events=["Thanksgiving","Holiday Prep","Winter Florals"];
DEFAULT_CALENDAR[11].events=["Christmas","Winter Wonderland","New Year Prep"];

function useCalendar(){
  const [calendar,setCalendar]=useState(()=>{
    try{const s=localStorage.getItem("admin-calendar");return s?JSON.parse(s):DEFAULT_CALENDAR;}
    catch{return DEFAULT_CALENDAR;}
  });
  const save=v=>{setCalendar(v);try{localStorage.setItem("admin-calendar",JSON.stringify(v));}catch{}};
  return [calendar,save];
}

function AdminCalendar({calendar,setCalendar,onClose}){
  const [activeMonth,setActiveMonth]=useState(0);
  const [newEvent,setNewEvent]=useState("");

  const current=calendar[activeMonth];

  const addEvent=()=>{
    if(!newEvent.trim())return;
    const updated=calendar.map((m,i)=>i===activeMonth?{...m,events:[...m.events,newEvent.trim()]}:m);
    setCalendar(updated);setNewEvent("");
  };
  const removeEvent=(ev)=>{
    const updated=calendar.map((m,i)=>i===activeMonth?{...m,events:m.events.filter(e=>e!==ev)}:m);
    setCalendar(updated);
  };
  const updateColor=(col)=>{
    const updated=calendar.map((m,i)=>i===activeMonth?{...m,color:col}:m);
    setCalendar(updated);
  };

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.6)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
      <div style={{background:C.cream,borderRadius:20,width:"100%",maxWidth:640,maxHeight:"90vh",overflowY:"auto"}}>
        <div style={{background:C.espresso,borderRadius:"20px 20px 0 0",padding:"20px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:C.mustard,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:3}}>ADMIN</div>
            <div style={{color:C.cream,fontSize:18,fontWeight:800,fontFamily:"'Playfair Display',serif"}}>Trend Calendar Manager</div>
          </div>
          <button onClick={onClose} style={{background:"rgba(255,255,255,.1)",border:"none",color:C.cream,borderRadius:"50%",width:34,height:34,fontSize:18,cursor:"pointer"}}>×</button>
        </div>
        <div style={{padding:24,display:"flex",flexDirection:"column",gap:16}}>
          {/* Month selector */}
          <div>
            <SLabel>Select Month</SLabel>
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>
              {MONTHS.map((m,i)=>(
                <button key={m} onClick={()=>setActiveMonth(i)} style={{background:activeMonth===i?C.espresso:C.creamDark,color:activeMonth===i?C.mustard:C.warm,border:"none",borderRadius:8,padding:"8px 4px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",transition:"all .2s"}}>{m}</button>
              ))}
            </div>
          </div>

          {/* Month accent color */}
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <SLabel style={{margin:0}}>Accent Color for {current.month}</SLabel>
            <input type="color" value={current.color} onChange={e=>updateColor(e.target.value)} style={{width:40,height:32,borderRadius:8,border:"none",cursor:"pointer",padding:2}}/>
          </div>

          {/* Events */}
          <Card>
            <SLabel>{current.month} — {current.events.length} events</SLabel>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:14}}>
              {!current.events.length&&<div style={{fontSize:12,color:C.warm,fontStyle:"italic"}}>No events yet — add some below</div>}
              {current.events.map((ev,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:C.cream,borderRadius:8,padding:"8px 12px"}}>
                  <span style={{fontSize:13,color:C.espresso}}>{ev}</span>
                  <button onClick={()=>removeEvent(ev)} style={{background:"none",border:"none",color:C.warm,cursor:"pointer",fontSize:16,lineHeight:1}}>×</button>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:8}}>
              <Input value={newEvent} onChange={e=>setNewEvent(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addEvent()} placeholder="e.g. Mother's Day, Spring Florals..." style={{flex:1}}/>
              <Btn onClick={addEvent} disabled={!newEvent.trim()}>+ Add</Btn>
            </div>
          </Card>

          <div style={{background:C.mustard+"20",borderRadius:10,padding:12,fontSize:12,color:C.espresso}}>
            💡 Changes save automatically. Members see updates instantly.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TrendCalendar({isAdmin}){
  const [calendar,setCalendar]=useCalendar();
  const [active,setActive]=useState(new Date().getMonth());
  const [showAdmin,setShowAdmin]=useState(false);
  const m=calendar[active];

  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {/* Month grid */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:6}}>
        {calendar.map((mo,i)=>(
          <button key={mo.month} onClick={()=>setActive(i)} style={{background:active===i?C.espresso:C.creamDark,color:active===i?C.mustard:C.warm,border:"none",borderRadius:8,padding:"8px 4px",fontFamily:"'DM Sans',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",transition:"all .2s"}}>{mo.month}</button>
        ))}
      </div>

      {/* Active month */}
      <div style={{background:C.espresso,borderRadius:14,padding:24}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:16}}>
          <div style={{color:C.mustard,fontSize:20,fontWeight:800,fontFamily:"'Playfair Display',serif"}}>{m.month} — Key Moments</div>
          {isAdmin&&(
            <button onClick={()=>setShowAdmin(true)} style={{background:C.mustard+"20",border:`1px solid ${C.mustard}40`,borderRadius:8,padding:"6px 12px",color:C.mustard,fontFamily:"'DM Sans',sans-serif",fontSize:11,fontWeight:700,cursor:"pointer"}}>⚙️ Edit</button>
          )}
        </div>
        {!m.events.length&&<div style={{color:"rgba(250,246,240,.4)",fontSize:13,fontStyle:"italic"}}>No events added for this month yet.</div>}
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

      {showAdmin&&<AdminCalendar calendar={calendar} setCalendar={setCalendar} onClose={()=>setShowAdmin(false)}/>}
    </div>
  );
}
