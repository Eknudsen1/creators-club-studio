import {useState} from 'react';
import {C} from '../data';
import {Card,SLabel,Btn,Input} from '../ui';

export default function ProductPerformance(){
  const [listings,setListings]=useState(()=>{try{const s=localStorage.getItem("perf-listings");return s?JSON.parse(s):[];}catch{return [];}});
  const [form,setForm]=useState({name:"",views:"",favs:"",sales:""});
  const save=v=>{setListings(v);try{localStorage.setItem("perf-listings",JSON.stringify(v));}catch{}};
  const add=()=>{if(!form.name)return;save([...listings,{id:`p${Date.now()}`,name:form.name,views:Number(form.views)||0,favs:Number(form.favs)||0,sales:Number(form.sales)||0}]);setForm({name:"",views:"",favs:"",sales:""});};
  const remove=id=>save(listings.filter(x=>x.id!==id));
  const conv=l=>l.views?((l.sales/l.views)*100).toFixed(1):"0.0";
  const bestSales=listings.length?Math.max(...listings.map(l=>l.sales),1):1;
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {listings.length>0&&<>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
          {[["Listings",listings.length,C.mustard],["Total Sales",listings.reduce((s,l)=>s+l.sales,0),C.sage],["Avg Conv.",listings.length?(listings.reduce((s,l)=>s+parseFloat(conv(l)),0)/listings.length).toFixed(1)+"%":"—",C.lavender]].map(([l,v,col])=>(
            <div key={l} style={{background:C.creamDark,borderRadius:12,padding:14,textAlign:"center"}}>
              <div style={{fontSize:9,color:C.warm,fontWeight:700,letterSpacing:2,marginBottom:4}}>{l}</div>
              <div style={{fontSize:22,fontWeight:800,color:col}}>{v}</div>
            </div>
          ))}
        </div>
        {listings.map(l=>(
          <Card key={l.id}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
              <div style={{fontSize:14,fontWeight:700,color:C.espresso,flex:1,marginRight:8}}>{l.name}</div>
              <button onClick={()=>remove(l.id)} style={{background:"none",border:"none",color:C.warm,cursor:"pointer",fontSize:18}}>×</button>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:10}}>
              {[["Views",l.views,C.lavender],["Favs",l.favs,C.blush],["Sales",l.sales,C.sage],["Conv.",conv(l)+"%",C.mustard]].map(([k,v,col])=>(
                <div key={k} style={{background:C.cream,borderRadius:8,padding:"8px 6px",textAlign:"center"}}>
                  <div style={{fontSize:9,color:C.warm,fontWeight:700,letterSpacing:1.5,marginBottom:2}}>{k}</div>
                  <div style={{fontSize:16,fontWeight:800,color:col}}>{v}</div>
                </div>
              ))}
            </div>
            <div style={{fontSize:9,color:C.warm,fontWeight:700,letterSpacing:2,marginBottom:5}}>SALES VS BEST</div>
            <div style={{background:C.cream,borderRadius:20,height:6,overflow:"hidden"}}>
              <div style={{background:C.sage,height:"100%",width:`${(l.sales/bestSales)*100}%`,borderRadius:20,transition:"width .6s ease"}}/>
            </div>
          </Card>
        ))}
      </>}
      {!listings.length&&(
        <div style={{background:C.creamDark,borderRadius:16,padding:48,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:8,color:C.warm}}>◉</div>
          <div style={{color:C.espresso,fontWeight:700,marginBottom:6}}>No listings tracked yet</div>
          <div style={{color:C.warm,fontSize:13}}>Add your Etsy listings below to start tracking.</div>
        </div>
      )}
      <Card>
        <SLabel>Add Listing</SLabel>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <Input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Listing name"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
            <Input value={form.views} onChange={e=>setForm(p=>({...p,views:e.target.value}))} placeholder="Views" type="number"/>
            <Input value={form.favs}  onChange={e=>setForm(p=>({...p,favs:e.target.value}))}  placeholder="Favorites" type="number"/>
            <Input value={form.sales} onChange={e=>setForm(p=>({...p,sales:e.target.value}))} placeholder="Sales" type="number"/>
          </div>
          <Btn onClick={add} disabled={!form.name}>+ Add Listing</Btn>
        </div>
      </Card>
    </div>
  );
}
