"use client";
/**
 * FILE: AdvancedSim3.tsx
 * PURPOSE: 15 professional canvas simulations — Topic 3: Newton's Second Law (F = ma)
 * EXPORTS: AdvancedTopic3Sims
 */
import React, { useState, useEffect, useRef } from "react";

function drawArrow(g: CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,color:string,lw=2.5){
  const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy); if(len<4)return;
  const a=Math.atan2(dy,dx),hs=Math.min(10,len*0.35);
  g.save();g.strokeStyle=color;g.fillStyle=color;g.lineWidth=lw;g.lineCap="round";
  g.beginPath();g.moveTo(x1,y1);g.lineTo(x2-hs*0.8*Math.cos(a),y2-hs*0.8*Math.sin(a));g.stroke();
  g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-hs*Math.cos(a-0.42),y2-hs*Math.sin(a-0.42));g.lineTo(x2-hs*Math.cos(a+0.42),y2-hs*Math.sin(a+0.42));g.closePath();g.fill();g.restore();
}
function txt(g:CanvasRenderingContext2D,s:string,x:number,y:number,c="#e2e8f0",sz=11,align:CanvasTextAlign="center"){
  g.save();g.font=`bold ${sz}px 'Inter',sans-serif`;g.fillStyle=c;g.textAlign=align;g.fillText(s,x,y);g.restore();
}
function bg(g:CanvasRenderingContext2D,w:number,h:number){
  const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,"#0d1117");gr.addColorStop(1,"#161b22");
  g.fillStyle=gr;g.fillRect(0,0,w,h);
  g.strokeStyle="rgba(255,255,255,0.03)";g.lineWidth=1;
  for(let x=40;x<w;x+=40){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
  for(let y=40;y<h;y+=40){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
}
function rr(g:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number,fill:string,stroke?:string,lw?:number){
g.save();g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=fill;g.fill();if(stroke){g.strokeStyle=stroke;g.lineWidth=lw??1.5;g.stroke();}g.restore();}
function ibox(g:CanvasRenderingContext2D,lines:[string,string][],x:number,y:number,w=165){
  const ph=8,lh=16,h=lines.length*lh+ph*2;
  rr(g,x,y,w,h,6,"rgba(15,23,42,0.88)","rgba(99,102,241,0.25)");
  lines.forEach(([l,v],i)=>{txt(g,l,x+ph,y+ph+i*lh+11,"#94a3b8",10,"left");txt(g,v,x+w-ph,y+ph+i*lh+11,"#60a5fa",10,"right");});
}
const C={blue:"#3b82f6",red:"#ef4444",green:"#10b981",amber:"#f59e0b",purple:"#8b5cf6",cyan:"#06b6d4",white:"#f1f5f9",dim:"#94a3b8"};
const card:React.CSSProperties={background:"linear-gradient(135deg,#0f172a 0%,#1a2332 100%)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 20px",marginBottom:20};
const titleSt:React.CSSProperties={color:"#e2e8f0",fontSize:14,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:6};
const eqSt:React.CSSProperties={color:"#94a3b8",fontSize:11,fontFamily:"monospace",marginTop:8,background:"rgba(99,102,241,0.08)",padding:"5px 10px",borderRadius:6,display:"inline-block"};
function Sl({label:l,value,min,max,step=1,onChange,unit=""}:{label:string;value:number;min:number;max:number;step?:number;onChange:(v:number)=>void;unit?:string}){
  return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{color:"#94a3b8",fontSize:11}}>{l}</span><span style={{color:"#3b82f6",fontWeight:700,fontSize:12}}>{value}{unit}</span></div><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:"#3b82f6",cursor:"pointer"}} /></div>;
}

/* SIM 1: F=MA DYNAMIC BLOCK EXPLORER */
function FmaBlock(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [F,setF]=useState(50); const [m,setMass]=useState(10);
  const posRef=useRef(80); const velRef=useRef(0); const [running,setRunning]=useState(false);
  const runRef=useRef(false);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    const a=F/m; runRef.current=running;
    let raf=0;
    const frame=()=>{
      if(runRef.current){velRef.current+=a*0.016; posRef.current+=velRef.current*0.016*5;}
      if(posRef.current>W-60){posRef.current=80;velRef.current=0;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H-50;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      // Block
      const bx=posRef.current,by=fy-35;
      rr(g,bx-25,by,50,32,4,"#1d4ed8","#3b82f6");
      txt(g,`${m}kg`,bx,by+18,"#fff",11);
      // Force arrow
      if(runRef.current) drawArrow(g,bx-25,by+12,bx-60,by+12,C.green,3);
      txt(g,`F=${F}N`,bx-85,by+6,C.green,9);
      // Velocity arrow
      if(velRef.current>0.1) drawArrow(g,bx+25,by+12,bx+25+velRef.current*2,by+12,C.amber,2.5);
      // Accel display
      const bigEq=`F = ma → a = F/m = ${F}/${m} = ${a.toFixed(2)} m/s²`;
      txt(g,bigEq,W/2,22,C.blue,12);
      ibox(g,[["Force F",`${F} N`],["Mass m",`${m} kg`],["Accel a",`${a.toFixed(2)} m/s²`],["Speed v",`${(velRef.current*0.4).toFixed(1)} m/s`]],W-170,40);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[F,m,running]);
  return(
    <div style={card}><div style={titleSt}>⚡ Sim 1 — F = ma: Dynamic Block Explorer</div>
    <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
      <Sl label="Applied Force F" value={F} min={10} max={300} step={10} onChange={setF} unit=" N"/>
      <Sl label="Mass m" value={m} min={1} max={50} onChange={setMass} unit=" kg"/>
      <button onClick={()=>{setRunning(r=>!r);runRef.current=!runRef.current;}} style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:running?"#7c3aed":"#1d4ed8",color:"#fff"}}>{running?"⏹ Stop":"▶ Apply Force"}</button>
    </div>
    <div style={eqSt}>F = ma &nbsp;|&nbsp; a = F/m = {(F/m).toFixed(2)} m/s² &nbsp;|&nbsp; Double F → double a &nbsp;|&nbsp; Double m → half a</div></div>
  );
}

/* SIM 2: LIVE F VS ACCELERATION GRAPH */
function FvsAGraph(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m,setMass]=useState(10); const [currentF,setF]=useState(0);
  const pointsRef=useRef<{f:number,a:number}[]>([]);
  useEffect(()=>{
    pointsRef.current=[];
    for(let f=0;f<=200;f+=20) pointsRef.current.push({f,a:f/m});
  },[m]);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0;
    const frame=()=>{
      g.clearRect(0,0,W,H);bg(g,W,H);
      const ox=60,oy=H-50,gw=W-80,gh=H-80;
      const maxF=250,maxA=maxF/m;
      // Axes
      g.strokeStyle="#475569";g.lineWidth=2;
      g.beginPath();g.moveTo(ox,oy-gh);g.lineTo(ox,oy);g.lineTo(ox+gw,oy);g.stroke();
      // Grid
      g.strokeStyle="rgba(255,255,255,0.05)";g.lineWidth=1;
      for(let i=1;i<=5;i++){
        const gy=oy-i*gh/5;g.beginPath();g.moveTo(ox,gy);g.lineTo(ox+gw,gy);g.stroke();
        txt(g,`${(maxA*i/5).toFixed(1)}`,ox-8,gy+4,"#64748b",9,"right");
      }
      for(let i=1;i<=5;i++){
        const gx=ox+i*gw/5;g.beginPath();g.moveTo(gx,oy);g.lineTo(gx,oy-gh);g.stroke();
        txt(g,`${maxF*i/5}`,gx,oy+14,"#64748b",9);
      }
      txt(g,"Force F (N)",ox+gw/2,H-12,C.dim,11);
      g.save();g.translate(16,oy-gh/2);g.rotate(-Math.PI/2);txt(g,"Acceleration a (m/s²)",0,0,C.dim,11);g.restore();
      // F=ma line (theory)
      g.strokeStyle="rgba(59,130,246,0.3)";g.lineWidth=1.5;g.setLineDash([4,4]);
      g.beginPath();g.moveTo(ox,oy);g.lineTo(ox+gw,oy-(maxA)*gh/maxA);g.stroke();g.setLineDash([]);
      // Actual points
      g.strokeStyle=C.green;g.lineWidth=2.5;g.beginPath();
      pointsRef.current.forEach((p,i)=>{
        const px=ox+p.f/maxF*gw, py=oy-p.a/maxA*gh;
        if(i===0)g.moveTo(px,py); else g.lineTo(px,py);
      });
      g.stroke();
      pointsRef.current.forEach(p=>{
        const px=ox+p.f/maxF*gw, py=oy-p.a/maxA*gh;
        g.fillStyle=C.green;g.beginPath();g.arc(px,py,4,0,Math.PI*2);g.fill();
      });
      // Current F indicator
      if(currentF>0){
        const px=ox+currentF/maxF*gw, py=oy-(currentF/m)/maxA*gh;
        g.fillStyle=C.amber;g.beginPath();g.arc(px,py,8,0,Math.PI*2);g.fill();
        g.strokeStyle="rgba(245,158,11,0.3)";g.lineWidth=1;g.setLineDash([3,3]);
        g.beginPath();g.moveTo(px,oy);g.lineTo(px,py);g.moveTo(ox,py);g.lineTo(px,py);g.stroke();g.setLineDash([]);
        txt(g,`(${currentF}N, ${(currentF/m).toFixed(1)}m/s²)`,px+8,py-6,C.amber,10,"left");
      }
      txt(g,`F vs a (m=${m}kg) — straight line through origin proves a ∝ F`,W/2,18,C.white,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m,currentF]);
  return(
    <div style={card}><div style={titleSt}>📈 Sim 2 — Live F vs Acceleration Graph</div>
    <canvas ref={cvs} width={580} height={260} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Mass m" value={m} min={1} max={30} onChange={setMass} unit=" kg"/>
      <Sl label="Current Force" value={currentF} min={0} max={250} step={10} onChange={setF} unit=" N"/>
    </div>
    <div style={eqSt}>a = F/m — straight line (slope=1/m) &nbsp;|&nbsp; Doubling F doubles a &nbsp;|&nbsp; This proves a ∝ F</div></div>
  );
}

/* SIM 3: MASS VS ACCELERATION GRAPH */
function MvsAGraph(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [F,setF]=useState(100); const [curM,setCurM]=useState(10);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0;
    const frame=()=>{
      g.clearRect(0,0,W,H);bg(g,W,H);
      const ox=65,oy=H-50,gw=W-85,gh=H-80,maxM=50;
      g.strokeStyle="#475569";g.lineWidth=2;
      g.beginPath();g.moveTo(ox,oy-gh);g.lineTo(ox,oy);g.lineTo(ox+gw,oy);g.stroke();
      for(let i=1;i<=5;i++){
        const gx=ox+i*gw/5;g.strokeStyle="rgba(255,255,255,0.05)";g.lineWidth=1;g.beginPath();g.moveTo(gx,oy);g.lineTo(gx,oy-gh);g.stroke();
        txt(g,`${maxM*i/5}`,gx,oy+14,"#64748b",9);
      }
      const maxA=F/1;
      for(let i=1;i<=5;i++){
        const gy=oy-i*gh/5;g.strokeStyle="rgba(255,255,255,0.05)";g.lineWidth=1;g.beginPath();g.moveTo(ox,gy);g.lineTo(ox+gw,gy);g.stroke();
        txt(g,`${(maxA/5*(6-i)).toFixed(0)}`,ox-8,gy+4,"#64748b",9,"right");
      }
      txt(g,"Mass m (kg)",ox+gw/2,H-12,C.dim,11);
      g.save();g.translate(14,oy-gh/2);g.rotate(-Math.PI/2);txt(g,"Acceleration a (m/s²)",0,0,C.dim,11);g.restore();
      // Hyperbola curve a=F/m
      g.strokeStyle=C.purple;g.lineWidth=2.5;g.beginPath();
      for(let m=1;m<=maxM;m+=0.5){
        const a=F/m; const px=ox+m/maxM*gw; const py=oy-Math.min(a/maxA*gh,gh);
        if(m===1)g.moveTo(px,py); else g.lineTo(px,py);
      }
      g.stroke();
      // Highlight current point
      const ca=F/curM;
      const px2=ox+curM/maxM*gw, py2=oy-Math.min(ca/maxA*gh,gh-4);
      g.fillStyle=C.amber;g.beginPath();g.arc(px2,py2,8,0,Math.PI*2);g.fill();
      txt(g,`(${curM}kg, ${ca.toFixed(1)}m/s²)`,px2+8,py2-5,C.amber,10,"left");
      txt(g,`a vs m (F=${F}N) — hyperbola: a=F/m &nbsp;&nbsp; Doubling m halves a!`,W/2,18,C.white,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[F,curM]);
  return(
    <div style={card}><div style={titleSt}>📉 Sim 3 — Mass vs Acceleration Graph (Inverse Proportionality)</div>
    <canvas ref={cvs} width={580} height={260} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Constant Force F" value={F} min={20} max={300} step={10} onChange={setF} unit=" N"/>
      <Sl label="Selected Mass" value={curM} min={1} max={50} onChange={setCurM} unit=" kg"/>
    </div>
    <div style={eqSt}>a = F/m — hyperbola (a ∝ 1/m) &nbsp;|&nbsp; Double mass → half acceleration &nbsp;|&nbsp; a and m are inversely proportional</div></div>
  );
}

/* SIM 4: ELEVATOR APPARENT WEIGHT */
function ElevatorSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mass,setMass]=useState(70); const [accel,setAccel]=useState(0);
  const [mode,setMode]=useState<"up"|"down"|"free"|"none">("none");
  const eY=useRef(120); const eVRef=useRef(0); const modeRef=useRef<"up"|"down"|"free"|"none">("none");
  const g_acc=9.8;
  const actualAccel=mode==="up"?accel:mode==="down"?-accel:mode==="free"?-g_acc:0;
  const apparentW=mass*(g_acc+actualAccel);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    modeRef.current=mode; eY.current=130; eVRef.current=0;
    let raf=0;
    const frame=()=>{
      const a=modeRef.current==="up"?accel:modeRef.current==="down"?-accel:modeRef.current==="free"?-g_acc:0;
      eVRef.current+=a*0.016*8; eY.current+=eVRef.current*0.016*4;
      if(eY.current>H-100){eY.current=H-100;eVRef.current=0;}
      if(eY.current<30){eY.current=30;eVRef.current=0;}
      const aw=mass*(g_acc+a);
      g.clearRect(0,0,W,H);bg(g,W,H);
      // Building shaft
      g.strokeStyle="#334155";g.lineWidth=3;
      g.beginPath();g.moveTo(W/2-80,0);g.lineTo(W/2-80,H);g.stroke();
      g.beginPath();g.moveTo(W/2+80,0);g.lineTo(W/2+80,H);g.stroke();
      // Elevator
      const ey=eY.current;
      rr(g,W/2-70,ey,140,70,4,"rgba(30,58,138,0.5)","#3b82f6",2);
      // Cable
      g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(W/2,0);g.lineTo(W/2,ey);g.stroke();
      // Person
      g.fillStyle="#f97316";g.beginPath();g.arc(W/2,ey+18,9,0,Math.PI*2);g.fill();
      rr(g,W/2-6,ey+27,12,20,3,"#f97316");
      // Scale under person
      rr(g,W/2-20,ey+52,40,14,3,aw>0?"#1d4ed8":"#dc2626","#60a5fa");
      txt(g,`${aw.toFixed(0)}N`,W/2,ey+62,"#fff",10);
      // Arrows
      drawArrow(g,W/2+90,ey+35,W/2+90,ey+35+mass*g_acc*0.15,C.red,2.5);
      txt(g,`mg=${(mass*g_acc).toFixed(0)}N`,W/2+92,ey+55,C.red,9,"left");
      if(Math.abs(a)>0.1){
        drawArrow(g,W/2+90,ey+20,W/2+90,ey+20-(a>0?30:-30),C.purple,2.5);
        txt(g,`ma=${(mass*a).toFixed(0)}N`,W/2+92,ey+12,C.purple,9,"left");
      }
      const status=mode==="up"?"⬆ Accelerating up → feels HEAVIER":mode==="down"?"⬇ Accelerating down → feels LIGHTER":mode==="free"?"FREE FALL → feels WEIGHTLESS!":"No acceleration → normal weight";
      const sc=mode==="up"?C.green:mode==="down"?C.amber:mode==="free"?C.red:C.dim;
      txt(g,status,W/2,H-14,sc,11);
      ibox(g,[["Real weight",`${(mass*g_acc).toFixed(0)} N`],["Apparent W",`${aw.toFixed(0)} N`],["Accel",`${a.toFixed(1)} m/s²`],["Scale reads",`${(aw/g_acc).toFixed(1)} kg`]],W-170,12);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mass,accel,mode]);
  return(
    <div style={card}><div style={titleSt}>🛗 Sim 4 — Elevator: Apparent Weight (F = ma)</div>
    <canvas ref={cvs} width={580} height={240} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:6,marginTop:10,alignItems:"end"}}>
      <Sl label="Mass" value={mass} min={40} max={120} onChange={setMass} unit=" kg"/>
      <Sl label="Accel" value={accel} min={1} max={15} onChange={setAccel} unit=" m/s²"/>
      <button onClick={()=>{setMode("up");modeRef.current="up";}} style={{padding:"8px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:mode==="up"?"#16a34a":"#1e293b",color:"#fff"}}>⬆ Accel Up</button>
      <button onClick={()=>{setMode("down");modeRef.current="down";}} style={{padding:"8px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:mode==="down"?"#d97706":"#1e293b",color:"#fff"}}>⬇ Accel Down</button>
      <button onClick={()=>{setMode("free");modeRef.current="free";}} style={{padding:"8px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:mode==="free"?"#dc2626":"#1e293b",color:"#fff"}}>💥 Free Fall</button>
    </div>
    <div style={eqSt}>Apparent weight = m(g+a) when going up &nbsp;|&nbsp; m(g-a) going down &nbsp;|&nbsp; 0 in free fall (weightlessness!)</div></div>
  );
}

/* SIM 5: INCLINED PLANE ACCELERATION */
function InclinedAccelSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [ang,setAng]=useState(30); const [mass,setMass]=useState(5); const [mu,setMu]=useState(0.2);
  const posRef=useRef(0.15); const velRef=useRef(0);
  const GR=9.8; const θ=ang*Math.PI/180;
  const N=mass*GR*Math.cos(θ), fFric=mu*N, fNet=mass*GR*Math.sin(θ)-fFric;
  const a=fNet/mass;
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    posRef.current=0.15; velRef.current=0;
    let raf=0;
    const frame=()=>{
      velRef.current+=a*0.016; posRef.current+=velRef.current*0.016*0.8;
      if(posRef.current<0.05){posRef.current=0.05;velRef.current=0;}
      if(posRef.current>0.85){posRef.current=0.15;velRef.current=0;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const len=260,ox=60,oy=H-50;
      const tx=ox+len*Math.cos(θ),ty=oy-len*Math.sin(θ);
      g.save();g.beginPath();g.moveTo(ox,oy);g.lineTo(tx,ty);g.lineTo(tx,oy);g.closePath();g.fillStyle="rgba(30,41,59,0.7)";g.fill();g.strokeStyle="#475569";g.lineWidth=2;g.stroke();g.restore();
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(ox-20,oy);g.lineTo(tx+20,oy);g.stroke();
      const t=posRef.current;
      const bx=ox+(50+t*(len-90))*Math.cos(θ), by=oy-(50+t*(len-90))*Math.sin(θ);
      g.save();g.translate(bx,by);g.rotate(-θ);
      rr(g,-22,-26,44,24,4,"#1d4ed8","#3b82f6");
      txt(g,`${mass}kg`,0,-14,"#fff",11);
      g.restore();
      drawArrow(g,bx,by-10,bx,by-10+mass*GR*0.35,C.red,2);
      drawArrow(g,bx,by-18,bx-N*0.35*Math.sin(θ),by-18-N*0.35*Math.cos(θ),C.green,2);
      if(Math.abs(a)>0.1){
        drawArrow(g,bx,by,bx+Math.sign(a)*30*Math.cos(θ),by-Math.sign(a)*30*Math.sin(θ),C.amber,2.5);
      }
      ibox(g,[["Normal N",`${N.toFixed(1)} N`],["Friction f",`${fFric.toFixed(1)} N`],["Net F",`${fNet.toFixed(1)} N`],["Accel a",`${a.toFixed(2)} m/s²`]],W-170,12);
      txt(g,`F_net = mg·sinθ - μN = ${fNet.toFixed(1)}N → a = ${a.toFixed(2)} m/s²`,W/2,22,C.blue,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[ang,mass,mu,a,N,fFric,fNet,θ]);
  return(
    <div style={card}><div style={titleSt}>📐 Sim 5 — Inclined Plane Acceleration</div>
    <canvas ref={cvs} width={580} height={240} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Angle θ" value={ang} min={1} max={70} onChange={setAng} unit="°"/>
      <Sl label="Mass" value={mass} min={1} max={20} onChange={setMass} unit=" kg"/>
      <Sl label="Friction μ" value={mu} min={0} max={0.8} step={0.05} onChange={setMu}/>
    </div>
    <div style={eqSt}>a = (mg·sinθ - μmg·cosθ)/m = g(sinθ - μcosθ) = {a.toFixed(2)} m/s²</div></div>
  );
}

/* SIM 6: SPRING LAUNCH */
function SpringLaunchSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [k,setK]=useState(500); const [compress,setComp]=useState(0.1);
  const [fired,setFired]=useState(false); const firedRef=useRef(false);
  const posRef=useRef(80); const velRef=useRef(0);
  const KE=0.5*k*compress*compress; const launchV=Math.sqrt(2*KE/2);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    firedRef.current=fired; if(!fired){posRef.current=80;velRef.current=0;}
    else velRef.current=launchV*3;
    let raf=0;
    const frame=()=>{
      if(firedRef.current){posRef.current+=velRef.current*0.016; if(posRef.current>W+40){posRef.current=80;velRef.current=launchV*3;}}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const floorY=H-50;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,floorY);g.lineTo(W,floorY);g.stroke();
      // Spring (compressed)
      const springX=80; const compPx=compress*200;
      const coils=8; const coilH=(60-compPx)/coils; const coilW=16;
      g.strokeStyle="#8b5cf6";g.lineWidth=2;g.beginPath();g.moveTo(springX,floorY);
      for(let i=0;i<coils;i++){const y=floorY-(i+0.5)*coilH;g.lineTo(springX+(i%2===0?coilW:-coilW),y);}
      g.lineTo(springX,floorY-60+compPx);g.stroke();
      // Mass
      if(!firedRef.current){
        rr(g,springX-22,floorY-60+compPx-30,44,28,4,"#1d4ed8","#3b82f6");
        txt(g,"2kg",springX,floorY-60+compPx-17,"#fff",11);
        txt(g,`Compressed: ${compress}m`,springX,floorY-95,C.purple,10);
        txt(g,`Stored KE = ½kx² = ${KE.toFixed(1)} J`,springX,floorY-80,C.amber,10);
      } else {
        // Flying mass
        const bx=posRef.current;
        rr(g,bx-22,floorY-34,44,28,4,"#f59e0b","#d97706");
        txt(g,"2kg",bx,floorY-21,"#fff",11);
        drawArrow(g,bx+22,floorY-20,bx+22+30,floorY-20,C.green,2.5);
        txt(g,`v=${launchV.toFixed(1)}m/s`,bx+55,floorY-32,C.green,10,"left");
      }
      ibox(g,[["Spring k",`${k} N/m`],["Compression",`${compress}m`],["Energy ½kx²",`${KE.toFixed(1)} J`],["Launch v",`${launchV.toFixed(2)} m/s`]],W-170,12);
      txt(g,fired?"✅ Spring energy → Kinetic energy: ½kx² = ½mv²":"Spring stores potential energy E = ½kx²",W/2,22,fired?C.green:C.amber,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[k,compress,fired,launchV,KE]);
  return(
    <div style={card}><div style={titleSt}>🌀 Sim 6 — Spring Launch (Force → Acceleration → Velocity)</div>
    <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
      <Sl label="Spring Constant k" value={k} min={100} max={2000} step={100} onChange={setK} unit=" N/m"/>
      <Sl label="Compression x" value={compress} min={0.02} max={0.3} step={0.02} onChange={setComp} unit=" m"/>
      <button onClick={()=>setFired(f=>!f)} style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:fired?"#7c3aed":"#1d4ed8",color:"#fff"}}>{fired?"↺ Reset":"🚀 Fire!"}</button>
    </div>
    <div style={eqSt}>F = kx = {(k*compress).toFixed(0)}N &nbsp;|&nbsp; a = F/m = {(k*compress/2).toFixed(0)} m/s² &nbsp;|&nbsp; Launch v = √(kx²/m) = {launchV.toFixed(2)} m/s</div></div>
  );
}

/* SIM 7: BRAKING DISTANCE VS SPEED */
function BrakingDistanceSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [speed,setSpeed]=useState(60); const [brakeF,setBrakeF]=useState(5000); const mass=1200;
  const vms=speed/3.6; const a=brakeF/mass; const d=vms*vms/(2*a);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0; let t=0;
    const frame=()=>{
      t+=0.016; g.clearRect(0,0,W,H);bg(g,W,H);
      // Road
      const ry=H/2+30;
      g.fillStyle="rgba(30,41,59,0.5)";g.fillRect(0,ry,W,H-ry);
      g.strokeStyle="#475569";g.lineWidth=2;g.beginPath();g.moveTo(0,ry);g.lineTo(W,ry);g.stroke();
      // Lane markings
      g.strokeStyle="rgba(245,158,11,0.3)";g.lineWidth=2;g.setLineDash([20,15]);
      g.beginPath();g.moveTo(0,ry+20);g.lineTo(W,ry+20);g.stroke();g.setLineDash([]);
      // Speed bars
      const speeds=[20,40,60,80,100,120];
      const maxD=120*120/3.6/3.6/(2*a); // d at 120kmh
      const bw=55,gap=10,startX=30;
      speeds.forEach((s,i)=>{
        const sd=s*s/3.6/3.6/(2*a);
        const bh=Math.min(sd/maxD*(H/2-20),H/2-20);
        const bx=startX+i*(bw+gap);
        const highlight=s===speed;
        rr(g,bx,H/2-bh,bw,bh,3,highlight?"rgba(239,68,68,0.7)":"rgba(30,64,175,0.5)",highlight?"#ef4444":"#3b82f6",highlight?2:1);
        txt(g,`${s}km/h`,bx+bw/2,H/2+14,"#94a3b8",9);
        txt(g,`${sd.toFixed(0)}m`,bx+bw/2,H/2-bh-6,highlight?C.red:C.dim,9);
      });
      // Stopping distance visualization
      const dPx=Math.min(d/maxD*(W-60),W-60);
      g.fillStyle="rgba(239,68,68,0.15)";g.fillRect(30,ry-8,dPx,6);
      g.strokeStyle=C.red;g.lineWidth=1.5;g.beginPath();g.moveTo(30,ry-5);g.lineTo(30+dPx,ry-5);g.stroke();
      txt(g,`Braking distance: ${d.toFixed(0)} m`,30+dPx/2,ry-16,C.red,11);
      ibox(g,[["Speed",`${speed} km/h`],["Braking F",`${brakeF} N`],["Decel a",`${a.toFixed(1)} m/s²`],["Distance",`${d.toFixed(0)} m`]],W-170,12);
      txt(g,"DANGER: Double speed → 4× stopping distance! (d ∝ v²)",W/2,18,C.amber,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[speed,brakeF,d,a,mass]);
  return(
    <div style={card}><div style={titleSt}>🚗 Sim 7 — Braking Distance vs Speed (a = F/m)</div>
    <canvas ref={cvs} width={580} height={250} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Car Speed" value={speed} min={20} max={120} step={10} onChange={setSpeed} unit=" km/h"/>
      <Sl label="Braking Force" value={brakeF} min={1000} max={15000} step={1000} onChange={setBrakeF} unit=" N"/>
    </div>
    <div style={eqSt}>d = v²/2a = v²·m/(2F) = {d.toFixed(0)}m &nbsp;|&nbsp; Double speed → 4× distance &nbsp;|&nbsp; a = F/m = {a.toFixed(1)} m/s²</div></div>
  );
}

/* SIM 8: FREE FALL — F = mg */
function FreeFallSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mass,setMass]=useState(5);
  const posRef=useRef(30); const velRef=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    posRef.current=30; velRef.current=0;
    let raf=0; let t=0; const trail:number[]=[];
    const frame=()=>{
      t+=0.016; velRef.current+=9.8*0.016; posRef.current+=velRef.current*0.016*10;
      trail.push(posRef.current); if(trail.length>30)trail.shift();
      if(posRef.current>H-50){posRef.current=30;velRef.current=0;trail.length=0;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const floorY=H-50;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,floorY);g.lineTo(W,floorY);g.stroke();
      // Trail dots
      trail.forEach((y,i)=>{const alpha=i/trail.length; g.fillStyle=`rgba(59,130,246,${alpha*0.5})`;g.beginPath();g.arc(W/2,y,5*alpha,0,Math.PI*2);g.fill();});
      // Ball
      g.fillStyle=C.blue;g.beginPath();g.arc(W/2,posRef.current,18,0,Math.PI*2);g.fill();
      g.strokeStyle="#60a5fa";g.lineWidth=2;g.stroke();
      txt(g,`${mass}kg`,W/2,posRef.current+4,"#fff",11);
      // Force arrow (gravity)
      drawArrow(g,W/2,posRef.current+20,W/2,posRef.current+20+mass*9.8*0.4,C.red,2.5);
      txt(g,`F=mg=${(mass*9.8).toFixed(0)}N`,W/2+25,posRef.current+45,C.red,10,"left");
      // Velocity arrow
      drawArrow(g,W/2+30,posRef.current,W/2+30,posRef.current+velRef.current*0.6,C.amber,2.5);
      txt(g,`v=${(velRef.current*0.1).toFixed(1)}m/s`,W/2+32,posRef.current+velRef.current*0.3,C.amber,9,"left");
      // Equations
      const dispStr=`h = ½gt² | t = ${t.toFixed(2)}s | v = gt = ${(9.8*t).toFixed(1)}m/s`;
      txt(g,dispStr,W/2,22,C.cyan,10);
      ibox(g,[["Time t",`${t.toFixed(2)} s`],["F = mg",`${(mass*9.8).toFixed(0)} N`],["a = g",`9.8 m/s²`],["v = gt",`${(9.8*t).toFixed(1)} m/s`]],W-170,40);
      txt(g,"Free fall: only gravity acts → F = mg → a = g = 9.8 m/s² (same for ALL masses!)",W/2,H-14,"#64748b",10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mass]);
  return(
    <div style={card}><div style={titleSt}>🎯 Sim 8 — Free Fall: F = mg, a = g</div>
    <canvas ref={cvs} width={580} height={240} style={{width:"100%",borderRadius:8}}/>
    <div style={{marginTop:10}}><Sl label="Mass" value={mass} min={1} max={20} onChange={setMass} unit=" kg"/></div>
    <div style={eqSt}>F = mg &nbsp;|&nbsp; a = F/m = mg/m = g = 9.8 m/s² (mass cancels!) &nbsp;|&nbsp; All objects fall at same rate in vacuum</div></div>
  );
}

/* SIM 9: TWO CONNECTED BLOCKS */
function TwoBlocksSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m1,setM1]=useState(3); const [m2,setM2]=useState(5); const [mu,setMu]=useState(0.15);
  const GR=9.8; const a=(m2*GR-mu*m1*GR)/(m1+m2); const T=m1*(a+mu*GR);
  const posRef=useRef(0); const velRef=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    posRef.current=0; velRef.current=0;
    let raf=0;
    const frame=()=>{
      velRef.current+=a*0.016; posRef.current+=velRef.current*0.016*10;
      if(posRef.current>120){posRef.current=0;velRef.current=0;}
      if(posRef.current<0){posRef.current=0;velRef.current=0;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      // Table
      const tableY=H/2+10;
      rr(g,20,tableY,W-40,12,3,"rgba(120,80,40,0.3)","#78350f");
      // m1 on table
      const b1x=100+posRef.current;
      rr(g,b1x-24,tableY-32,48,30,4,"#1d4ed8","#3b82f6");
      txt(g,`m₁=${m1}kg`,b1x,tableY-18,"#fff",11);
      // String over edge pulley
      const pulleyX=W-60, pulleyY=tableY;
      g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(b1x+24,tableY-17);g.lineTo(pulleyX,tableY-17);g.lineTo(pulleyX,tableY+20+posRef.current);g.stroke();
      g.fillStyle="#334155";g.beginPath();g.arc(pulleyX,tableY,8,0,Math.PI*2);g.fill();g.strokeStyle="#475569";g.lineWidth=1.5;g.stroke();
      // m2 hanging
      rr(g,pulleyX-22,tableY+22+posRef.current,44,30,4,"#92400e","#f59e0b");
      txt(g,`m₂=${m2}kg`,pulleyX,tableY+37+posRef.current,"#fff",11);
      // Force arrows
      if(a>0){drawArrow(g,b1x+24,tableY-17,b1x+50,tableY-17,C.green,2);txt(g,`T=${T.toFixed(0)}N`,b1x+55,tableY-28,C.green,9,"left");}
      drawArrow(g,pulleyX,tableY+52+posRef.current,pulleyX,tableY+52+posRef.current+m2*GR*0.25,C.red,2);
      txt(g,`m₂g=${(m2*GR).toFixed(0)}N`,pulleyX+5,tableY+75+posRef.current,C.red,9,"left");
      ibox(g,[["Accel a",`${a.toFixed(2)} m/s²`],["Tension T",`${T.toFixed(1)} N`],["Net F",`${((m2-mu*m1)*GR).toFixed(1)} N`]],W-170,12);
      txt(g,`a = (m₂g - μm₁g)/(m₁+m₂) = ${a.toFixed(2)} m/s²`,W/2,22,C.blue,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m1,m2,mu,a,T]);
  return(
    <div style={card}><div style={titleSt}>🔗 Sim 9 — Two Connected Blocks (Table + Hanging)</div>
    <canvas ref={cvs} width={580} height={230} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Mass m₁ (table)" value={m1} min={1} max={20} onChange={setM1} unit=" kg"/>
      <Sl label="Mass m₂ (hanging)" value={m2} min={1} max={20} onChange={setM2} unit=" kg"/>
      <Sl label="Friction μ" value={mu} min={0} max={0.8} step={0.05} onChange={setMu}/>
    </div>
    <div style={eqSt}>a = (m₂g - μm₁g)/(m₁+m₂) = {a.toFixed(2)} m/s² &nbsp;|&nbsp; T = m₁(a + μg) = {T.toFixed(1)} N</div></div>
  );
}

/* SIM 10: MULTIPLE FORCES VECTOR SUM */
function MultipleForcesSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [f1,setF1]=useState(60); const [a1,setA1]=useState(30);
  const [f2,setF2]=useState(40); const [a2,setA2]=useState(150);
  const mass=10;
  const fx=f1*Math.cos(a1*Math.PI/180)+f2*Math.cos(a2*Math.PI/180);
  const fy=f1*Math.sin(a1*Math.PI/180)+f2*Math.sin(a2*Math.PI/180);
  const fNet=Math.sqrt(fx*fx+fy*fy); const acc=fNet/mass;
  const netAng=Math.atan2(fy,fx)*180/Math.PI;
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0;
    const frame=()=>{
      g.clearRect(0,0,W,H);bg(g,W,H);
      const cx=W/2, cy=H/2+10;
      // Mass
      g.fillStyle="#1e3a5f";g.beginPath();g.arc(cx,cy,22,0,Math.PI*2);g.fill();g.strokeStyle="#3b82f6";g.lineWidth=2;g.stroke();
      txt(g,`${mass}kg`,cx,cy+4,"#fff",11);
      const scale=1.2;
      // Force 1
      const f1x=f1*Math.cos(a1*Math.PI/180)*scale, f1y=-f1*Math.sin(a1*Math.PI/180)*scale;
      drawArrow(g,cx,cy,cx+f1x,cy+f1y,C.blue,2.5);
      txt(g,`F₁=${f1}N`,cx+f1x+5*(f1x>0?1:-1),cy+f1y,C.blue,10,f1x>0?"left":"right");
      // Force 2
      const f2x=f2*Math.cos(a2*Math.PI/180)*scale, f2y=-f2*Math.sin(a2*Math.PI/180)*scale;
      drawArrow(g,cx,cy,cx+f2x,cy+f2y,C.purple,2.5);
      txt(g,`F₂=${f2}N`,cx+f2x+5*(f2x>0?1:-1),cy+f2y,C.purple,10,f2x>0?"left":"right");
      // Net force
      const netX=fx*scale, netY=-fy*scale;
      drawArrow(g,cx,cy,cx+netX,cy+netY,C.amber,3);
      txt(g,`F_net=${fNet.toFixed(0)}N`,cx+netX+5,cy+netY,C.amber,11,"left");
      // Acceleration arrow
      drawArrow(g,cx,cy,cx+netX*0.6,cy+netY*0.6,"rgba(16,185,129,0.7)",2);
      txt(g,`a=${acc.toFixed(1)}m/s²`,cx+netX*0.3-5,cy+netY*0.3,C.green,9);
      ibox(g,[["F₁",`${f1}N @ ${a1}°`],["F₂",`${f2}N @ ${a2}°`],["F_net",`${fNet.toFixed(1)}N @ ${netAng.toFixed(0)}°`],["Accel",`${acc.toFixed(2)} m/s²`]],W-172,12);
      txt(g,"Vector addition: F_net = √(Fx² + Fy²)",W/2,H-14,C.dim,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[f1,a1,f2,a2,fx,fy,fNet,acc,netAng]);
  return(
    <div style={card}><div style={titleSt}>🔀 Sim 10 — Multiple Forces: Vector Sum → F = ma</div>
    <canvas ref={cvs} width={580} height={240} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10}}>
      <Sl label="F₁ magnitude" value={f1} min={10} max={100} step={5} onChange={setF1} unit=" N"/>
      <Sl label="F₁ angle" value={a1} min={0} max={360} step={5} onChange={setA1} unit="°"/>
      <Sl label="F₂ magnitude" value={f2} min={10} max={100} step={5} onChange={setF2} unit=" N"/>
      <Sl label="F₂ angle" value={a2} min={0} max={360} step={5} onChange={setA2} unit="°"/>
    </div>
    <div style={eqSt}>ΣF = F₁ + F₂ = {fNet.toFixed(0)}N &nbsp;|&nbsp; a = ΣF/m = {acc.toFixed(2)} m/s² in direction {netAng.toFixed(0)}°</div></div>
  );
}

/* SIM 11: CAR ENGINE vs AIR DRAG */
function CarDragSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [engineF,setEngine]=useState(3000); const [mass,setMass]=useState(1200);
  const velRef=useRef(0);
  const RHO=1.2,A=2.2,Cd=0.3;
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    velRef.current=0;
    let raf=0; let t=0;
    const frame=()=>{
      t+=0.016;
      const drag=0.5*RHO*Cd*A*velRef.current*velRef.current;
      const net=engineF-drag; const acc=net/mass;
      velRef.current=Math.max(0,velRef.current+acc*0.016);
      const vTerminal=Math.sqrt(2*engineF/(RHO*Cd*A));
      g.clearRect(0,0,W,H);bg(g,W,H);
      const floorY=H-50;
      g.fillStyle="rgba(30,41,59,0.4)";g.fillRect(0,floorY,W,H-floorY);
      g.strokeStyle="#475569";g.lineWidth=2;g.beginPath();g.moveTo(0,floorY);g.lineTo(W,floorY);g.stroke();
      // Road markings (animated)
      const off=t*velRef.current*15%40;
      g.strokeStyle="rgba(245,158,11,0.3)";g.lineWidth=2;g.setLineDash([15,15]);
      g.beginPath();g.moveTo(-off,floorY+20);g.lineTo(W,floorY+20);g.stroke();g.setLineDash([]);
      // Car at fixed position
      const cx=W/2;
      rr(g,cx-70,floorY-40,140,40,6,"rgba(30,58,138,0.5)","#3b82f6",2);
      rr(g,cx-50,floorY-70,100,32,5,"rgba(30,58,138,0.4)","#1d4ed8");
      [cx-45,cx+35].forEach(wx=>{g.fillStyle="#1e293b";g.beginPath();g.arc(wx,floorY,16,0,Math.PI*2);g.fill();g.strokeStyle="#475569";g.lineWidth=3;g.stroke();});
      // Engine force arrow
      drawArrow(g,cx+70,floorY-22,cx+70+engineF*0.012,floorY-22,C.green,2.5);
      txt(g,`F_engine=${engineF}N`,cx+75,floorY-34,C.green,9,"left");
      // Drag arrow
      if(drag>10) drawArrow(g,cx-70,floorY-22,cx-70-Math.min(drag*0.012,80),floorY-22,C.red,2.5);
      txt(g,`Drag=${drag.toFixed(0)}N`,cx-75,floorY-34,C.red,9,"right");
      // Speed gauge
      const kmh=velRef.current*3.6;
      const pct=Math.min(kmh/(vTerminal*3.6),1);
      rr(g,W-200,30,180,30,6,"rgba(15,23,42,0.8)","rgba(99,102,241,0.3)");
      rr(g,W-198,32,Math.max(4,176*pct),26,5,kmh>vTerminal*3.6*0.95?"#10b981":"#3b82f6");
      txt(g,`${kmh.toFixed(0)} km/h`,W-110,49,"#fff",11);
      txt(g,`Terminal speed: ${(vTerminal*3.6).toFixed(0)} km/h`,W/2,22,C.amber,11);
      ibox(g,[["Engine F",`${engineF} N`],["Drag",`${drag.toFixed(0)} N`],["Net F",`${net.toFixed(0)} N`],["Speed",`${kmh.toFixed(0)} km/h`]],W-170,72);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[engineF,mass]);
  return(
    <div style={card}><div style={titleSt}>🚗 Sim 11 — Car: Engine Force vs Air Drag (F = ma)</div>
    <canvas ref={cvs} width={580} height={230} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Engine Force" value={engineF} min={500} max={10000} step={500} onChange={setEngine} unit=" N"/>
      <Sl label="Car Mass" value={mass} min={500} max={3000} step={100} onChange={setMass} unit=" kg"/>
    </div>
    <div style={eqSt}>F_net = F_engine - Drag = {(engineF-0.5*RHO*Cd*A*(velRef.current**2||0)).toFixed(0)}N &nbsp;|&nbsp; Terminal: Engine = Drag</div></div>
  );
}

/* SIM 12: WEIGHT ON DIFFERENT PLANETS */
function PlanetWeightSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mass,setMass]=useState(70);
  const planets=[
    {name:"Mercury",g:3.7,color:"#94a3b8"},{name:"Venus",g:8.87,color:"#f59e0b"},
    {name:"Earth",g:9.8,color:"#3b82f6"},{name:"Mars",g:3.72,color:"#ef4444"},
    {name:"Jupiter",g:24.8,color:"#f97316"},{name:"Moon",g:1.62,color:"#64748b"},
  ];
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0;
    const frame=()=>{
      g.clearRect(0,0,W,H);bg(g,W,H);
      const maxW=mass*24.8; const bw=55,gap=13,startX=28;
      planets.forEach((p,i)=>{
        const W_p=mass*p.g;
        const bh=Math.min(W_p/maxW*(H-90),H-90);
        const bx=startX+i*(bw+gap);
        rr(g,bx,H-40-bh,bw,bh,3,`${p.color}55`,p.color);
        txt(g,p.name,bx+bw/2,H-24,"#94a3b8",9);
        txt(g,`${W_p.toFixed(0)}N`,bx+bw/2,H-40-bh-6,p.color,10);
        txt(g,`g=${p.g}`,bx+bw/2,H-40-bh-18,p.color,9);
        // Person height indicator
        const personH=20*p.g/9.8;
        g.fillStyle=p.color;g.beginPath();g.arc(bx+bw/2,H-60-bh,personH,0,Math.PI*2);g.fill();
      });
      txt(g,`Mass = ${mass} kg (CONSTANT everywhere). Weight = mg (changes with g)`,W/2,18,C.white,11);
      txt(g,"Mass is inertia. Weight is force due to gravity. They are DIFFERENT!",W/2,H-8,"#64748b",10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mass]);
  return(
    <div style={card}><div style={titleSt}>🌍 Sim 12 — Weight on Different Planets (F = mg)</div>
    <canvas ref={cvs} width={580} height={270} style={{width:"100%",borderRadius:8}}/>
    <div style={{marginTop:10}}><Sl label="Mass (same on all planets)" value={mass} min={10} max={150} step={10} onChange={setMass} unit=" kg"/></div>
    <div style={eqSt}>W = mg &nbsp;|&nbsp; Earth: {(mass*9.8).toFixed(0)}N &nbsp;|&nbsp; Moon: {(mass*1.62).toFixed(0)}N &nbsp;|&nbsp; Jupiter: {(mass*24.8).toFixed(0)}N &nbsp;|&nbsp; Mass never changes!</div></div>
  );
}

/* SIM 13: IMPULSE = Ft = Δmv */
function ImpulseSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [F,setF]=useState(100); const [dur,setDur]=useState(0.5); const [mass,setMass]=useState(5);
  const impulse=F*dur; const deltaV=impulse/mass; const finalV=deltaV;
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0; let t=0; let applying=false; let v=0; let pos=80;
    const frame=()=>{
      t+=0.016;
      if(applying&&t<dur){v+=F/mass*0.016;}
      else {v*=0.996;} // slight decel
      pos+=v*0.016*5; if(pos>W-50){pos=80;v=0;t=0;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H-50;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      // Ball
      g.fillStyle=C.blue;g.beginPath();g.arc(pos,fy-18,18,0,Math.PI*2);g.fill();g.strokeStyle="#60a5fa";g.lineWidth=2;g.stroke();
      txt(g,`${mass}kg`,pos,fy-14,"#fff",11);
      if(applying&&t<dur){
        drawArrow(g,pos-20,fy-18,pos-55,fy-18,C.green,3);
        txt(g,`${F}N`,pos-70,fy-28,C.green,10);
        // Force duration bar
        rr(g,50,30,Math.min(t/dur*(W-100),W-100)*0.8,20,4,"rgba(59,130,246,0.4)","#3b82f6");
        txt(g,`Applying: ${t.toFixed(2)}s / ${dur}s`,W/2,48,C.blue,10);
      }
      if(v>0.5) drawArrow(g,pos+18,fy-18,pos+18+v*4,fy-18,C.amber,2.5);
      ibox(g,[["Impulse J",`${impulse.toFixed(1)} N·s`],["Δ momentum",`${impulse.toFixed(1)} kg·m/s`],["Δ velocity",`${deltaV.toFixed(2)} m/s`],["Current v",`${(v*0.2).toFixed(2)} m/s`]],W-170,12);
      txt(g,`Impulse = F×t = ${impulse.toFixed(1)} N·s = Δ(mv) = m×Δv = ${(mass*deltaV).toFixed(1)} kg·m/s`,W/2,22,C.amber,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[F,dur,mass,impulse,deltaV]);
  return(
    <div style={card}><div style={titleSt}>💥 Sim 13 — Impulse: F×t = Δ(mv)</div>
    <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Force F" value={F} min={10} max={500} step={10} onChange={setF} unit=" N"/>
      <Sl label="Duration t" value={dur} min={0.1} max={2.0} step={0.1} onChange={setDur} unit=" s"/>
      <Sl label="Mass" value={mass} min={1} max={20} onChange={setMass} unit=" kg"/>
    </div>
    <div style={eqSt}>J = F·t = {impulse.toFixed(1)} N·s = Δp = m·Δv &nbsp;|&nbsp; Δv = J/m = {deltaV.toFixed(2)} m/s &nbsp;|&nbsp; Connects F=ma with momentum!</div></div>
  );
}

/* SIM 14: REAL-TIME F=MA EQUATION */
function FmaEquationSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [F,setF]=useState(60); const [m,setM]=useState(10); const [a,setA]=useState(6);
  const [locked,setLocked]=useState<"F"|"m"|"a">("a");
  const displayF=locked==="F"?(m*a).toFixed(1):F.toString();
  const displayM=locked==="m"?(F/a).toFixed(1):m.toString();
  const displayA=locked==="a"?(F/m).toFixed(1):a.toString();
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0;
    const frame=()=>{
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fv=locked==="F"?m*a:F; const mv=locked==="m"?F/a:m; const av=locked==="a"?F/m:a;
      // Large equation display
      txt(g,"F",W/2-120,H/2,C.green,52);
      txt(g,"=",W/2-60,H/2,C.white,52);
      txt(g,"m",W/2+0,H/2,C.blue,52);
      txt(g,"×",W/2+55,H/2,C.white,52);
      txt(g,"a",W/2+110,H/2,C.amber,52);
      // Values below
      txt(g,`${fv.toFixed(1)}N`,W/2-120,H/2+40,C.green,16);
      txt(g,`${mv.toFixed(2)}kg`,W/2+0,H/2+40,C.blue,16);
      txt(g,`${av.toFixed(2)}m/s²`,W/2+110,H/2+40,C.amber,16);
      // Bar visualization
      const maxV=Math.max(fv,mv*10,av*20)+1;
      [[fv,W/4,C.green,"F"],[mv*8,W/2,C.blue,"m×8"],[av*12,3*W/4,C.amber,"a×12"]].forEach(([v,x,col,lbl])=>{
        const bh=Math.min(Number(v)/maxV*(H/2-60),H/2-60);
        rr(g,Number(x)-20,H/2-80-bh,40,bh,3,`${col}44`,col as string);
        txt(g,lbl as string,Number(x),H/2-88,col as string,9);
      });
      txt(g,`Solving for: ${locked==="F"?"Force F = m×a":locked==="m"?"Mass m = F/a":"Acceleration a = F/m"}`,W/2,H-14,C.dim,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[F,m,a,locked]);
  return(
    <div style={card}><div style={titleSt}>🔢 Sim 14 — Interactive F = m × a Equation</div>
    <canvas ref={cvs} width={580} height={260} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label={`Force F${locked==="F"?"(computed)":""}`} value={F} min={10} max={300} step={5} onChange={setF} unit=" N"/>
      <Sl label={`Mass m${locked==="m"?"(computed)":""}`} value={m} min={1} max={50} onChange={setM} unit=" kg"/>
      <Sl label={`Accel a${locked==="a"?"(computed)":""}`} value={a} min={1} max={30} onChange={setA} unit=" m/s²"/>
      <div><span style={{color:"#94a3b8",fontSize:11}}>Solve for:</span><div style={{display:"flex",gap:4,marginTop:4}}>{(["F","m","a"] as const).map(v=><button key={v} onClick={()=>setLocked(v)} style={{flex:1,padding:"6px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:locked===v?"#1d4ed8":"#1e293b",color:locked===v?"#fff":"#94a3b8"}}>{v}</button>)}</div></div>
    </div>
    <div style={eqSt}>F = m×a &nbsp;|&nbsp; Rearrange: a = F/m &nbsp;|&nbsp; m = F/a &nbsp;|&nbsp; The SAME equation, just solving for different variables</div></div>
  );
}

/* SIM 15: ROCKET LAUNCH (VARIABLE MASS) */
function RocketLaunchF(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [thrust,setThrust]=useState(50000); const [fuelRate,setFuelRate]=useState(20);
  const massRef=useRef(1000); const velRef=useRef(0); const posRef=useRef(0); const [running,setRunning]=useState(false);
  const runRef=useRef(false);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    massRef.current=1000; velRef.current=0; posRef.current=0; runRef.current=running;
    let raf=0;
    const frame=()=>{
      if(runRef.current&&massRef.current>100){
        massRef.current-=fuelRate*0.016;
        const fNet=thrust-massRef.current*9.8;
        const a=fNet/massRef.current;
        velRef.current=Math.max(0,velRef.current+a*0.016);
        posRef.current+=velRef.current*0.016*0.5;
      }
      if(posRef.current>H-60) posRef.current=H-60;
      g.clearRect(0,0,W,H);bg(g,W,H);
      // Stars
      for(let i=0;i<30;i++){const sy=((i*47+posRef.current*0.3)%H);g.fillStyle=`rgba(255,255,255,${0.3+Math.sin(i)*0.2})`;g.beginPath();g.arc((i*73)%W,sy,1,0,Math.PI*2);g.fill();}
      // Launch pad
      if(posRef.current<10){rr(g,W/2-60,H-40,120,20,3,"#475569","#64748b");}
      // Rocket
      const ry=H-80-posRef.current;
      // Body
      g.fillStyle="#1e3a5f";g.beginPath();g.moveTo(W/2-18,ry+60);g.lineTo(W/2+18,ry+60);g.lineTo(W/2+18,ry+10);g.lineTo(W/2,ry);g.lineTo(W/2-18,ry+10);g.closePath();g.fill();g.strokeStyle="#3b82f6";g.lineWidth=2;g.stroke();
      // Engine flame
      if(runRef.current&&massRef.current>100){
        for(let i=0;i<8;i++){
          const fx=W/2+(-8+i*2.5), fy=ry+60+10+Math.random()*20;
          g.fillStyle=i<4?"#f59e0b":"#ef4444";
          g.beginPath();g.arc(fx,fy,4+Math.random()*4,0,Math.PI*2);g.fill();
        }
        drawArrow(g,W/2,ry+60,W/2,ry+60+40,C.amber,3);
        txt(g,`Thrust=${thrust}N`,W/2+25,ry+80,C.amber,9,"left");
      }
      // Weight arrow
      drawArrow(g,W/2,ry,W/2,ry-massRef.current*9.8*0.001,C.red,2);
      txt(g,`W=${(massRef.current*9.8).toFixed(0)}N`,W/2+5,ry-8,C.red,9,"left");
      ibox(g,[["Mass",`${massRef.current.toFixed(0)} kg`],["Thrust",`${thrust} N`],["Weight",`${(massRef.current*9.8).toFixed(0)} N`],["Net F",`${(thrust-massRef.current*9.8).toFixed(0)} N`],["Speed",`${velRef.current.toFixed(1)} m/s`]],W-170,12);
      txt(g,"As fuel burns: mass decreases → same thrust → more acceleration!",W/2,22,C.dim,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[thrust,fuelRate,running]);
  return(
    <div style={card}><div style={titleSt}>🚀 Sim 15 — Rocket Launch: Variable Mass F = ma</div>
    <canvas ref={cvs} width={580} height={260} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
      <Sl label="Thrust Force" value={thrust} min={10000} max={100000} step={5000} onChange={setThrust} unit=" N"/>
      <Sl label="Fuel Burn Rate" value={fuelRate} min={5} max={100} step={5} onChange={setFuelRate} unit=" kg/s"/>
      <button onClick={()=>{setRunning(r=>!r);runRef.current=!runRef.current;massRef.current=1000;velRef.current=0;posRef.current=0;}} style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:running?"#dc2626":"#16a34a",color:"#fff"}}>{running?"🛑 Reset":"🚀 Launch!"}</button>
    </div>
    <div style={eqSt}>a = (Thrust - mg)/m &nbsp;|&nbsp; As m decreases, a increases &nbsp;|&nbsp; This is why rockets accelerate faster as fuel burns!</div></div>
  );
}

export function AdvancedTopic3Sims(){
  return(
    <div style={{marginTop:24}}>
      <div style={{background:"linear-gradient(90deg,rgba(245,158,11,0.15),transparent)",borderLeft:"3px solid #f59e0b",padding:"10px 16px",marginBottom:20,borderRadius:"0 8px 8px 0"}}>
        <div style={{color:"#e2e8f0",fontWeight:700,fontSize:15}}>⚡ Advanced Simulations — Newton&apos;s Second Law (F = ma)</div>
        <div style={{color:"#64748b",fontSize:12,marginTop:2}}>15 interactive simulations demonstrating force, mass, and acceleration relationships</div>
      </div>
      <FmaBlock/><FvsAGraph/><MvsAGraph/><ElevatorSim/><InclinedAccelSim/>
      <SpringLaunchSim/><BrakingDistanceSim/><FreeFallSim/><TwoBlocksSim/><MultipleForcesSim/>
      <CarDragSim/><PlanetWeightSim/><ImpulseSim/><FmaEquationSim/><RocketLaunchF/>
    </div>
  );
}
