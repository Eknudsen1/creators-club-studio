import {useState,useRef} from 'react';
import {C} from '../data';
import {Card,SLabel,Btn,Input} from '../ui';

const TAG_COLORS=[C.mustard,C.sage,C.lavender,C.blush];

export default function StyleBoard(){
  const [boards,setBoards]=useState(()=>{try{const s=localStorage.getItem("style-boards");return s?JSON.parse(s):[];}catch{return [];}});
  const [url,setUrl]=useState("");
  const [note,setNote]=useState("");
  const [label,setLabel]=useState("");
  const fileRef=useRef();
  const save=v=>{setBoards(v);try{localStorage.setItem("style-boards",JSON.stringify(v));}catch{}};
  const addUrl=()=>{if(!url.trim())return;save([...boards,{id:`sb${Date.now()}`,src:url.trim(),note:note.trim(),label:label.trim()||"Inspiration"}]);setUrl("");setNote("");setLabel("");};
  const addFile=e=>{const file=e.target.files[0];if(!file)return;const r=new FileReader();r.onload=ev=>{save([...boards,{id:`sb${Date.now()}`,src:ev.target.result,note:note.trim(),label:label.trim()||"Upload"}]);setNote("");setLabel("");};r.readAsDataURL(file);e.target.value="";};
  const remove=id=>save(boards.filter(x=>x.id!==id));
  return(
    <div style={{display:"flex",flexDirection:"column",gap:16}}>
      {!boards.length&&(
        <div style={{background:C.creamDark,borderRadius:16,padding:48,textAlign:"center"}}>
          <div style={{fontSize:28,marginBottom:8,color:C.warm}}>◎</div>
          <div style={{color:C.espresso,fontWeight:700,marginBottom:6}}>Your style board is empty</div>
          <div style={{color:C.warm,fontSize:13}}>Paste image URLs or upload files to build your moodboard.</div>
        </div>
      )}
      {boards.length>0&&(
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          {boards.map((b,i)=>(
            <div key={b.id} style={{background:C.creamDark,borderRadius:16,overflow:"hidden"}}>
              <div style={{position:"relative"}}>
                <img src={b.src} alt={b.label} onError={e=>e.target.style.display="none"} style={{width:"100%",height:160,objectFit:"cover",display:"block"}}/>
                <button onClick={()=>remove(b.id)} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.55)",border:"none",color:"#fff",borderRadius:"50%",width:28,height:28,fontSize:15,cursor:"pointer"}}>×</button>
                <div style={{position:"absolute",top:8,left:8,background:TAG_COLORS[i%4],color:i%4===0?C.espresso:"#fff",borderRadius:6,padding:"3px 10px",fontSize:10,fontWeight:700}}>{b.label}</div>
              </div>
              {b.note&&<div style={{padding:"10px 14px",fontSize:12,color:C.warm,lineHeight:1.5}}>{b.note}</div>}
            </div>
          ))}
        </div>
      )}
      <Card>
        <SLabel>Add to Style Board</SLabel>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <Input value={label} onChange={e=>setLabel(e.target.value)} placeholder="Label (e.g. Color Inspo, Style Ref...)"/>
          <Input value={note}  onChange={e=>setNote(e.target.value)}  placeholder="Notes (optional)"/>
          <div style={{display:"flex",gap:8}}>
            <Input value={url} onChange={e=>setUrl(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addUrl()} placeholder="Paste image URL..." style={{flex:1}}/>
            <Btn onClick={addUrl} disabled={!url.trim()}>Add</Btn>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{flex:1,height:1,background:C.cream}}/><span style={{fontSize:11,color:C.warm}}>or</span><div style={{flex:1,height:1,background:C.cream}}/>
          </div>
          <input ref={fileRef} type="file" accept="image/*" onChange={addFile} style={{display:"none"}}/>
          <Btn variant="secondary" onClick={()=>fileRef.current?.click()}>📎 Upload Image from Device</Btn>
        </div>
      </Card>
    </div>
  );
}
