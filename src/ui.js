import { C, FONT, SCRIPT } from './data';

export const Card=({children,style={}})=>(
  <div style={{background:C.creamDark,borderRadius:16,padding:20,...style}}>{children}</div>
);
export const SLabel=({children})=>(
  <div style={{color:C.warm,fontSize:10,fontWeight:700,letterSpacing:2,marginBottom:10,textTransform:"uppercase"}}>{children}</div>
);
export const Btn=({children,onClick,variant="primary",disabled,style={}})=>{
  const v={primary:{background:C.mustard,color:C.espresso,border:"none"},secondary:{background:C.creamDark,color:C.warm,border:"none"},sage:{background:C.sage,color:"#fff",border:"none"},danger:{background:"#DC2626",color:"#fff",border:"none"},ghost:{background:"transparent",color:C.warm,border:`1px solid ${C.warm}40`}};
  return <button onClick={onClick} disabled={disabled} style={{...v[variant],borderRadius:10,padding:"9px 18px",fontSize:13,fontWeight:700,cursor:disabled?"not-allowed":"pointer",opacity:disabled?.5:1,fontFamily:FONT,transition:"all .2s",...style}}>{children}</button>;
};
export const Input=({value,onChange,placeholder,onKeyDown,type="text",style={}})=>(
  <input type={type} value={value} onChange={onChange} onKeyDown={onKeyDown} placeholder={placeholder}
    style={{background:C.cream,border:`1.5px solid ${C.mustard}30`,borderRadius:10,padding:"10px 14px",fontSize:13,fontFamily:FONT,color:C.espresso,outline:"none",width:"100%",...style}}/>
);
export const Textarea=({value,onChange,placeholder,rows=3})=>(
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{background:C.cream,border:`1.5px solid ${C.mustard}30`,borderRadius:10,padding:"10px 14px",fontSize:13,fontFamily:FONT,color:C.espresso,outline:"none",width:"100%",resize:"vertical"}}/>
);
export const Pill=({label,active,onClick,accent})=>(
  <button onClick={onClick} style={{background:active?(accent||C.mustard):C.creamDark,color:active?(accent&&accent!==C.mustard?"#fff":C.espresso):C.warm,border:"none",borderRadius:20,padding:"7px 16px",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all .2s",fontFamily:FONT}}>{label}</button>
);
