import {useState} from 'react';
import {C,SCRIPT,STATUS_OPTIONS,STATUS_COLORS} from '../data';
import {Card,Pill} from '../ui';

function exportBriefAsPDF(brief){
  const w=window.open("","_blank");
  w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet"/>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'DM Sans',sans-serif;background:#FAF6F0;padding:40px;max-width:800px;margin:0 auto;color:#2C1A0E;}
    .header{background:#2C1A0E;border-radius:16px;padding:28px 32px;margin-bottom:24px;}
    .week{color:#D4A843;font-size:12px;font-weight:700;letter-spacing:3px;margin-bottom:8px;text-transform:uppercase;}
    .title{color:#FAF6F0;font-family:'Playfair Display',serif;font-size:36px;font-weight:800;line-height:1.2;}
    .section{background:#F0E8DC;border-radius:12px;padding:20px 24px;margin-bottom:16px;}
    .label{font-size:10px;font-weight:700;letter-spacing:2px;color:#8B7355;margin-bottom:12px;text-transform:uppercase;}
    .palette{display:flex;gap:16px;align-items:flex-start;flex-wrap:wrap;}
    .swatch{display:flex;flex-direction:column;align-items:center;gap:6px;width:56px;}
    .swatch-circle{width:48px;height:48px;border-radius:50%;border:none;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .swatch-name{font-size:9px;color:#8B7355;text-align:center;line-height:1.3;word-break:break-word;}
    .mood{display:flex;gap:8px;flex-wrap:wrap;}
    .mood-tag{background:#C4B5D4;color:#2C1A0E;border-radius:20px;padding:5px 14px;font-size:13px;font-weight:600;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .elements{display:grid;grid-template-columns:1fr 1fr;gap:8px;}
    .element{display:flex;align-items:flex-start;gap:8px;font-size:13px;line-height:1.4;}
    .el-num{color:#D4A843;font-weight:800;font-size:11px;min-width:22px;margin-top:1px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .tip{background:#7A9E7E;border-radius:12px;padding:18px 24px;margin-bottom:16px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .tip .label{color:rgba(255,255,255,.85);}
    .tip p{color:#fff;font-size:14px;line-height:1.6;}
    .example-img{width:100%;border-radius:12px;margin-bottom:20px;display:block;page-break-inside:avoid;}
    .style-tag{display:inline-block;background:#C4B5D4;color:#2C1A0E;border-radius:20px;padding:4px 14px;font-size:12px;font-weight:600;margin-top:8px;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    .footer{text-align:right;font-size:11px;color:#BFA882;margin-top:24px;padding-top:16px;border-top:1px solid #F0E8DC;}
    @media print{
      body{padding:20px;}
      @page{margin:1cm;}
      .no-break{page-break-inside:avoid;}
    }
  </style></head><body>
  ${brief.exampleImage?`<img src="${brief.exampleImage}" class="example-img" alt="${brief.title}"/>`:""}
  <div class="header no-break">
    <div class="week">${brief.week}</div>
    <div class="title">${brief.title}</div>
    ${brief.style?`<span class="style-tag">${brief.style}</span>`:""}
  </div>
  <div class="section no-break">
    <div class="label">Color Palette</div>
    <div class="palette">
      ${brief.palette.map((col,i)=>`
        <div class="swatch">
          <div class="swatch-circle" style="background-color:${col};-webkit-print-color-adjust:exact;print-color-adjust:exact;"></div>
          <div class="swatch-name">${brief.paletteNames[i]||""}<br/><span style="font-size:8px;color:#BFA882;">${col}</span></div>
        </div>`).join("")}
    </div>
  </div>
  <div class="section no-break">
    <div class="label">Mood Words</div>
    <div class="mood">${brief.moodWords.map(w=>`<span class="mood-tag">${w}</span>`).join("")}</div>
  </div>
  <div class="section">
    <div class="label">Elements to Create (${brief.elements.length})</div>
    <div class="elements">${brief.elements.map((el,i)=>`<div class="element"><span class="el-num">${String(i+1).padStart(2,"0")}</span><span>${el}</span></div>`).join("")}</div>
  </div>
  ${brief.sellerTip?`<div class="tip no-break"><div class="label">Seller Tip</div><p>${brief.sellerTip}</p></div>`:""}
  <div class="footer">Clipart Creator Studio — ${brief.title}</div>
  <script>
    window.onload=function(){
      setTimeout(function(){window.print();},800);
    };
  <\/script>
  </body></html>`);
  w.document.close();
}

function exportBriefAsImage(brief){
  const canvas=document.createElement("canvas");
  const W=1200;
  const hasImage=!!brief.exampleImage;
  const imgH=hasImage?500:0;
  const H=200+imgH+120+100+80+Math.ceil(brief.elements.length/2)*70+160+60;
  canvas.width=W;canvas.height=Math.max(H,1400);
  const ctx=canvas.getContext("2d");

  const draw=()=>{
    let y=0;
    // Background
    ctx.fillStyle="#FAF6F0";ctx.fillRect(0,0,W,canvas.height);

    // Example image
    if(hasImage&&brief.exampleImage){
      const img=new Image();
      img.onload=()=>{
        ctx.drawImage(img,0,0,W,imgH);
        drawContent(ctx,W,imgH,brief,canvas);
      };
      img.src=brief.exampleImage;
    } else {
      drawContent(ctx,W,0,brief,canvas);
    }
  };
  draw();
}

function drawContent(ctx,W,startY,brief,canvas){
  let y=startY;

  // Header bar
  ctx.fillStyle="#2C1A0E";ctx.fillRect(0,y,W,130);
  ctx.fillStyle="#D4A843";ctx.font="bold 24px sans-serif";ctx.fillText(brief.week,50,y+45);
  ctx.fillStyle="#FAF6F0";ctx.font="bold 54px 'Georgia',serif";ctx.fillText(brief.title,50,y+108);
  y+=150;

  // Palette section
  ctx.fillStyle="#F0E8DC";roundRect(ctx,30,y,W-60,150,14);ctx.fill();
  ctx.fillStyle="#8B7355";ctx.font="bold 20px sans-serif";ctx.fillText("COLOR PALETTE",50,y+35);
  const sw=64,sg=20;
  brief.palette.forEach((col,i)=>{
    const cx=50+i*(sw+sg)+sw/2;
    const cy=y+80;
    ctx.fillStyle=col;
    ctx.beginPath();ctx.arc(cx,cy,sw/2,0,Math.PI*2);ctx.fill();
    ctx.fillStyle="#8B7355";ctx.font="18px sans-serif";ctx.textAlign="center";
    const name=(brief.paletteNames[i]||"").substring(0,10);
    ctx.fillText(name,cx,cy+sw/2+20);
    ctx.textAlign="left";
  });
  y+=170;

  // Mood words
  ctx.fillStyle="#F0E8DC";roundRect(ctx,30,y,W-60,90,14);ctx.fill();
  ctx.fillStyle="#8B7355";ctx.font="bold 20px sans-serif";ctx.fillText("MOOD WORDS",50,y+32);
  let mx=50;
  brief.moodWords.forEach(w=>{
    ctx.font="bold 20px sans-serif";
    const tw=ctx.measureText(w).width+28;
    ctx.fillStyle="#C4B5D4";roundRect(ctx,mx,y+44,tw,36,18);ctx.fill();
    ctx.fillStyle="#2C1A0E";ctx.fillText(w,mx+14,y+68);
    mx+=tw+10;
  });
  y+=110;

  // Elements
  const rows=Math.ceil(brief.elements.length/2);
  const elH=rows*64+60;
  ctx.fillStyle="#F0E8DC";roundRect(ctx,30,y,W-60,elH,14);ctx.fill();
  ctx.fillStyle="#8B7355";ctx.font="bold 20px sans-serif";ctx.fillText(`ELEMENTS TO CREATE (${brief.elements.length})`,50,y+34);
  const colW=(W-60)/2;
  brief.elements.forEach((el,i)=>{
    const col=i%2,row=Math.floor(i/2);
    const ex=50+col*colW,ey=y+60+row*64;
    ctx.fillStyle="#D4A843";ctx.font="bold 18px sans-serif";ctx.fillText(String(i+1).padStart(2,"0"),ex,ey);
    ctx.fillStyle="#2C1A0E";ctx.font="22px sans-serif";
    const text=el.length>30?el.substring(0,28)+"…":el;
    ctx.fillText(text,ex+36,ey);
  });
  y+=elH+20;

  // Seller tip
  if(brief.sellerTip){
    ctx.fillStyle="#7A9E7E";roundRect(ctx,30,y,W-60,120,14);ctx.fill();
    ctx.fillStyle="#fff";ctx.font="bold 20px sans-serif";ctx.fillText("SELLER TIP",50,y+34);
    ctx.font="21px sans-serif";
    const words=brief.sellerTip.split(" ");let line="",ty=y+64;
    words.forEach(w=>{const test=line+w+" ";if(ctx.measureText(test).width>W-120&&line){ctx.fillText(line.trim(),50,ty);line=w+" ";ty+=30;}else line=test;});
    if(line.trim())ctx.fillText(line.trim(),50,ty);
    y+=140;
  }

  // Watermark
  ctx.fillStyle="rgba(139,115,85,.35)";ctx.font="bold 24px sans-serif";ctx.textAlign="right";
  ctx.fillText("Clipart Creator Studio",W-40,canvas.height-30);ctx.textAlign="left";

  // Download
  const link=document.createElement("a");
  link.download=`${brief.title.replace(/\s+/g,"-")}-brief.png`;
  link.href=canvas.toDataURL("image/png",1.0);link.click();
}

function roundRect(ctx,x,y,w,h,r){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.quadraticCurveTo(x+w,y,x+w,y+r);ctx.lineTo(x+w,y+h-r);ctx.quadraticCurveTo(x+w,y+h,x+w-r,y+h);ctx.lineTo(x+r,y+h);ctx.quadraticCurveTo(x,y+h,x,y+h-r);ctx.lineTo(x,y+r);ctx.quadraticCurveTo(x,y,x+r,y);ctx.closePath();
}

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
      {/* Kanban overview */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}}>
        {STATUS_OPTIONS.map(s=>{
          const items=library.filter(b=>b.status===s);
          const col=STATUS_COLORS[s];
          return(
            <div key={s} style={{background:C.creamDark,borderRadius:14,padding:16,borderTop:`3px solid ${col}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={{fontSize:10,fontWeight:700,letterSpacing:2,color:col,textTransform:"uppercase"}}>{s}</div>
                <div style={{background:col,color:s==="In Progress"?C.espresso:"#fff",borderRadius:20,width:24,height:24,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:800}}>{items.length}</div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {!items.length&&<div style={{fontSize:11,color:C.warm+"80",fontStyle:"italic"}}>Nothing here yet</div>}
                {items.map(b=>(
                  <div key={b.id} style={{background:"white",borderRadius:8,overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,.06)"}}>
                    {b.exampleImage&&<img src={b.exampleImage} alt={b.title} style={{width:"100%",height:60,objectFit:"cover",display:"block"}}/>}
                    <div style={{padding:"6px 10px"}}>
                      <div style={{fontSize:12,color:C.espresso,fontWeight:600,lineHeight:1.3}}>{b.title}</div>
                      <div style={{fontSize:10,color:C.warm,marginTop:2}}>{b.theme}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Filter pills */}
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {["All",...STATUS_OPTIONS].map(s=><Pill key={s} label={`${s}${s!=="All"?" ("+counts[s]+")":""}`} active={filter===s} onClick={()=>setFilter(s)} accent={STATUS_COLORS[s]}/>)}
      </div>

      {/* Brief cards */}
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {filtered.map(brief=>(
          <Card key={brief.id} style={{display:"flex",flexDirection:"column",gap:12,padding:0,overflow:"hidden"}}>
            {brief.exampleImage&&(
              <img src={brief.exampleImage} alt={brief.title} style={{width:"100%",height:200,objectFit:"cover",display:"block"}}/>
            )}
            <div style={{padding:20,display:"flex",flexDirection:"column",gap:12}}>
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
              <div style={{display:"flex",gap:8,paddingTop:4,borderTop:`1px solid ${C.creamDark}`}}>
                <button onClick={()=>exportBriefAsImage(brief)} style={{flex:1,background:C.creamDark,border:"none",borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:700,color:C.espresso,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>📸 Save as Image</button>
                <button onClick={()=>exportBriefAsPDF(brief)} style={{flex:1,background:C.espresso,border:"none",borderRadius:8,padding:"8px 12px",fontSize:12,fontWeight:700,color:C.cream,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>📄 Save as PDF</button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
