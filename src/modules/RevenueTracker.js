import {useState} from 'react';
import {C} from '../data';
import {Card,SLabel,Btn,Input} from '../ui';

const DEFAULT=[{id:"r1",month:"Nov 25",rev:142},{id:"r2",month:"Dec 25",rev:389},{id:"r3",month:"Jan 26",rev:210},{id:"r4",month:"Feb 26",rev:267},{id:"r5",month:"Mar 26",rev:334},{id:"r6",month:"Apr 26",rev:412}];

export default function RevenueTracker(){
  const [entries,setEntries]=useState(()=>{try{const s=localStorage.getItem("revenue-entries");return s?JSON.parse(s):DEFAULT;}catch{return DEFAULT;}});
  const [form,setForm]=useState({month:"",rev:""});
  const save=v=>{setEntries(v);try{localStorage.setItem("revenue-entries",JSON.stringify(v));}catch{}};
  const add=()=>{if(!form.month||!form.rev)return;save([...entries,{id:`r${Date.now()}`,month:form.month,rev:Number(form.rev)}]);setForm({month:"",rev:""}); };
  const remove=id=>save(entries.filter(x=>x.id!==id));
  const total=entries.reduce((s,e)=>s+e.rev,0);
  const max=Math.max(...entries.map(e=>e.rev),1);
  const avg=entries.length?Math.round(total/entries.length):0;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
        {[["Total Revenue",`$${total.toLocaleString()}`,C.mustard],["Monthly Avg",`$${avg}`,C.sage],["Months",entries.length,C.lavender]].map(([l,v,col])=>(
          <div key={l} style={{background:C.creamDark,borderRadius:12,padding:14,textAlign:"center"}}>
            <div style={{fontSize:9,color:C.warm,fontWeight:700,letterSpacing:2,marginBottom:4}}>{l}</div>
            <div style={{fontSize:22,fontWeight:800,color:col}}>{v}</div>
          </div>
        ))}
      </div>
      <Card>
        <SLabel>Monthly Revenue — click bar to remove</SLabel>
        <div style={{display:"flex",alignItems:"flex-end",gap:6,height:110,marginBottom:6}}>
          {entries.map(e=>(
            <div key={e.id} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
              <div style={{fontSize:9,color:C.warm}}>${e.rev}</div>
              <div onClick={()=>remove(e.id)} title="Click to remove" style={{width:"100%",background:C.mustard,borderRadius:"4px 4px 0 0",height:`${(e.rev/max)*80}px`,cursor:"pointer",transition:"height .5s ease"}}/>
              <div style={{fontSize:9,color:C.warm,textAlign:"center",lineHeight:1.2}}>{e.month}</div>
            </div>
          ))}
        </div>
      </Card>
      <Card style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
        <Input value={form.month} onChange={e=>setForm(p=>({...p,month:e.target.value}))} placeholder="Month (e.g. May 26)" style={{flex:1,minWidth:120}}/>
        <Input value={form.rev} onChange={e=>setForm(p=>({...p,rev:e.target.value}))} placeholder="Revenue $" type="number" style={{flex:1,minWidth:100}}/>
        <Btn onClick={add}>Add</Btn>
      </Card>
    </div>
  );
}
