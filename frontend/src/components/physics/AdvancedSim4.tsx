"use client";
/**
 * FILE: AdvancedSim4.tsx
 * PURPOSE: 15 professional canvas simulations — Topic 4: Newton's Third Law (Action-Reaction)
 * EXPORTS: AdvancedTopic4Sims
 */
import React, { useState, useEffect, useRef } from "react";

function dA(g:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,color:string,lw=2.5){
  const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy);if(len<4)return;
  const a=Math.atan2(dy,dx),hs=Math.min(10,len*0.35);
  g.save();g.strokeStyle=color;g.fillStyle=color;g.lineWidth=lw;g.lineCap="round";
  g.beginPath();g.moveTo(x1,y1);g.lineTo(x2-hs*0.8*Math.cos(a),y2-hs*0.8*Math.sin(a));g.stroke();
  g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-hs*Math.cos(a-0.42),y2-hs*Math.sin(a-0.42));g.lineTo(x2-hs*Math.cos(a+0.42),y2-hs*Math.sin(a+0.42));g.closePath();g.fill();g.restore();
}
function t(g:CanvasRenderingContext2D,s:string,x:number,y:number,c="#e2e8f0",sz=11,align:CanvasTextAlign="center"){
  g.save();g.font=`bold ${sz}px 'Inter',sans-serif`;g.fillStyle=c;g.textAlign=align;g.fillText(s,x,y);g.restore();
}
function bg(g:CanvasRenderingContext2D,w:number,h:number){
  const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,"#0d1117");gr.addColorStop(1,"#161b22");
  g.fillStyle=gr;g.fillRect(0,0,w,h);
  g.strokeStyle="rgba(255,255,255,0.03)";g.lineWidth=1;
  for(let x=40;x<w;x+=40){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
  for(let y=40;y<h;y+=40){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
}
function rr(g:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number,fill:string,stroke?:string){
  g.save();g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=fill;g.fill();
  if(stroke){g.strokeStyle=stroke;g.lineWidth=1.5;g.stroke();}g.restore();
}
function ib(g:CanvasRenderingContext2D,lines:[string,string][],x:number,y:number,w=165){
  const ph=8,lh=16,h=lines.length*lh+ph*2;
  rr(g,x,y,w,h,6,"rgba(15,23,42,0.88)","rgba(99,102,241,0.25)");
  lines.forEach(([l,v],i)=>{t(g,l,x+ph,y+ph+i*lh+11,"#94a3b8",10,"left");t(g,v,x+w-ph,y+ph+i*lh+11,"#60a5fa",10,"right");});
}
const C={b:"#3b82f6",r:"#ef4444",g:"#10b981",a:"#f59e0b",p:"#8b5cf6",c:"#06b6d4",w:"#f1f5f9",d:"#94a3b8",o:"#f97316"};
const card:React.CSSProperties={background:"linear-gradient(135deg,#0f172a 0%,#1a2332 100%)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 20px",marginBottom:20};
const tit:React.CSSProperties={color:"#e2e8f0",fontSize:14,fontWeight:700,marginBottom:10};
const eq:React.CSSProperties={color:"#94a3b8",fontSize:11,fontFamily:"monospace",marginTop:8,background:"rgba(99,102,241,0.08)",padding:"5px 10px",borderRadius:6,display:"inline-block"};
function Sl({label:l,value,min,max,step=1,onChange,unit=""}:{label:string;value:number;min:number;max:number;step?:number;onChange:(v:number)=>void;unit?:string}){
  return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{color:"#94a3b8",fontSize:11}}>{l}</span><span style={{color:"#3b82f6",fontWeight:700,fontSize:12}}>{value}{unit}</span></div><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:"#3b82f6"}}/></div>;
}

/* SIM 1: ROCKET PROPULSION */
function RocketSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [thrust,setThrust]=useState(40000); const [running,setRunning]=useState(false);
  const rRunRef=useRef(false); const posRef=useRef(0); const velRef=useRef(0); const massRef=useRef(800);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    rRunRef.current=running; posRef.current=0; velRef.current=0; massRef.current=800;
    let raf=0;
    const frame=()=>{
      if(rRunRef.current&&massRef.current>150){
        massRef.current-=15*0.016; const net=thrust-massRef.current*9.8;
        velRef.current+=net/massRef.current*0.016; posRef.current+=velRef.current*0.016*0.8;
        if(posRef.current>H-70){posRef.current=H-70;velRef.current=0;}
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      // Stars
      for(let i=0;i<25;i++){g.fillStyle=`rgba(255,255,255,${0.3+((i*17)%10)/20})`;g.beginPath();g.arc((i*73)%W,((i*43+posRef.current*0.5)%H),1.2,0,Math.PI*2);g.fill();}
      const ry=H-80-posRef.current;
      // Rocket body
      g.fillStyle="#1e3a5f";g.beginPath();g.moveTo(W/2-16,ry+55);g.lineTo(W/2+16,ry+55);g.lineTo(W/2+16,ry+8);g.lineTo(W/2,ry);g.lineTo(W/2-16,ry+8);g.closePath();g.fill();g.strokeStyle=C.b;g.lineWidth=2;g.stroke();
      // Exhaust (action — gases pushed DOWN)
      if(rRunRef.current){
        for(let i=0;i<12;i++){const fx=W/2+(-10+Math.random()*20),fy=ry+58+Math.random()*30;g.fillStyle=i<5?"#f59e0b":i<9?"#ef4444":"#9ca3af";g.beginPath();g.arc(fx,fy,3+Math.random()*3,0,Math.PI*2);g.fill();}
        dA(g,W/2,ry+55,W/2,ry+55+45,C.r,2.5);t(g,"Action: gases pushed ↓",W/2+5,ry+75,C.r,9,"left");
        dA(g,W/2,ry+20,W/2,ry+20-50,C.g,2.5);t(g,"Reaction: rocket pushed ↑",W/2+5,ry+10,C.g,9,"left");
      }
      ib(g,[["Thrust",`${thrust} N`],["Mass",`${massRef.current.toFixed(0)} kg`],["Speed",`${velRef.current.toFixed(1)} m/s`],["Height",`${posRef.current.toFixed(0)} m`]],W-170,12);
      t(g,rRunRef.current?"Gas pushed DOWN (action) → Rocket pushed UP (reaction)":"Newton's 3rd: Every action has equal & opposite reaction",W/2,H-14,rRunRef.current?C.g:"#64748b",10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[thrust,running]);
  return(
    <div style={card}><div style={tit}>🚀 Sim 1 — Rocket Propulsion (Action-Reaction)</div>
    <canvas ref={cvs} width={580} height={250} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
      <Sl label="Thrust" value={thrust} min={10000} max={100000} step={5000} onChange={setThrust} unit=" N"/>
      <button onClick={()=>{setRunning(r=>!r);rRunRef.current=!rRunRef.current;posRef.current=0;velRef.current=0;massRef.current=800;}} style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:running?"#dc2626":"#16a34a",color:"#fff"}}>{running?"🛑 Reset":"🚀 Launch!"}</button>
    </div>
    <div style={eq}>Action: rocket pushes gas down with force F &nbsp;|&nbsp; Reaction: gas pushes rocket UP with force F &nbsp;|&nbsp; Equal &amp; opposite!</div></div>
  );
}

/* SIM 2: GUN RECOIL */
function GunRecoilSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mBullet,setMB]=useState(0.01); const [mGun,setMG]=useState(3); const [v0,setV0]=useState(800);
  const vGun=-(mBullet*v0)/mGun; const [fired,setFired]=useState(false); const fRef=useRef(false);
  const bPosRef=useRef(0); const gPosRef=useRef(0); const firedT=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    fRef.current=fired; bPosRef.current=0; gPosRef.current=0; firedT.current=0;
    let raf=0;
    const frame=()=>{
      if(fRef.current){firedT.current+=0.016; bPosRef.current+=v0*0.016*0.15; gPosRef.current+=vGun*0.016*0.8;}
      if(bPosRef.current>W/2+80){bPosRef.current=W/2+80;}
      if(gPosRef.current<-80){gPosRef.current=-80;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H/2+20;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      // Gun (moves left on recoil)
      const gx=W/2-40+gPosRef.current;
      rr(g,gx-50,fy-22,80,18,3,"#334155","#64748b");// gun body
      rr(g,gx+30,fy-22,22,10,2,"#475569","#94a3b8");// barrel
      // Bullet
      const bx=W/2+50+bPosRef.current;
      if(bx<W+20){g.fillStyle=C.a;g.beginPath();g.ellipse(bx,fy-17,8,4,0,0,Math.PI*2);g.fill();}
      // Arrows when fired
      if(fRef.current){
        dA(g,gx,fy-13,gx-40,fy-13,C.p,2.5);t(g,`Recoil: ${Math.abs(vGun).toFixed(1)}m/s`,gx-95,fy-22,C.p,9);
        if(bx<W+10){dA(g,W/2+60,fy-17,W/2+90,fy-17,C.g,2.5);t(g,`Bullet: ${v0}m/s`,W/2+95,fy-26,C.g,9,"left");}
      }
      ib(g,[["Bullet mass",`${mBullet} kg`],["Gun mass",`${mGun} kg`],["Bullet v",`${v0} m/s →`],["Gun recoil",`${Math.abs(vGun).toFixed(2)} m/s ←`]],W-175,12);
      t(g,"Bullet forward (action) ↔ Gun recoil backward (reaction) — momentum conserved!",W/2,22,"#64748b",10);
      const p_bullet=mBullet*v0, p_gun=mGun*Math.abs(vGun);
      t(g,`p_bullet=${p_bullet.toFixed(2)} kg·m/s ↔ p_gun=${p_gun.toFixed(2)} kg·m/s — EQUAL!`,W/2,H-14,C.g,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mBullet,mGun,v0,vGun,fired]);
  return(
    <div style={card}><div style={tit}>🔫 Sim 2 — Gun Recoil (Newton&apos;s 3rd Law)</div>
    <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Bullet mass" value={mBullet} min={0.005} max={0.1} step={0.005} onChange={setMB} unit=" kg"/>
      <Sl label="Gun mass" value={mGun} min={0.5} max={10} step={0.5} onChange={setMG} unit=" kg"/>
      <Sl label="Bullet speed" value={v0} min={100} max={1000} step={50} onChange={setV0} unit=" m/s"/>
      <button onClick={()=>{setFired(f=>!f);fRef.current=!fRef.current;bPosRef.current=0;gPosRef.current=0;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:fired?"#7c3aed":"#dc2626",color:"#fff"}}>{fired?"↺ Reset":"💥 Fire!"}</button>
    </div>
    <div style={eq}>v_gun = -(m_bullet × v_bullet)/m_gun = {vGun.toFixed(2)} m/s &nbsp;|&nbsp; Action &amp; reaction forces are EQUAL in magnitude</div></div>
  );
}

/* SIM 3: PERSON JUMPS FROM BOAT */
function BoatJumpSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mPerson,setMP]=useState(60); const [mBoat,setMB]=useState(200); const [jumpV,setJV]=useState(3);
  const boatV=-(mPerson*jumpV)/mBoat;
  const [jumped,setJumped]=useState(false); const jRef=useRef(false);
  const pPosRef=useRef(0); const bPosRef=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    jRef.current=jumped; pPosRef.current=0; bPosRef.current=0;
    let raf=0;
    const frame=()=>{
      if(jRef.current){pPosRef.current+=jumpV*0.016*10; bPosRef.current+=boatV*0.016*10;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const waterY=H-50;
      // Water
      g.fillStyle="rgba(37,99,235,0.2)";g.fillRect(0,waterY,W,H-waterY);
      g.strokeStyle="rgba(96,165,250,0.4)";g.lineWidth=1.5;g.beginPath();g.moveTo(0,waterY);g.lineTo(W,waterY);g.stroke();
      // Boat (moves left)
      const bx=W/2-40+bPosRef.current;
      g.fillStyle="#92400e";g.beginPath();g.moveTo(bx-70,waterY);g.lineTo(bx-60,waterY-20);g.lineTo(bx+60,waterY-20);g.lineTo(bx+70,waterY);g.closePath();g.fill();g.strokeStyle="#d97706";g.lineWidth=1.5;g.stroke();
      // Person (moves right)
      const px=W/2+pPosRef.current;
      g.fillStyle=C.o;g.beginPath();g.arc(px,waterY-32,9,0,Math.PI*2);g.fill();
      rr(g,px-5,waterY-23,10,18,3,C.o);
      if(jRef.current){
        dA(g,px,waterY-22,px+40,waterY-22,C.g,2.5);t(g,`${jumpV}m/s →`,px+45,waterY-32,C.g,9,"left");
        dA(g,bx,waterY-12,bx-40,waterY-12,C.r,2.5);t(g,`← ${Math.abs(boatV).toFixed(2)}m/s`,bx-45,waterY-22,C.r,9,"right");
      }
      ib(g,[["Person mass",`${mPerson} kg`],["Boat mass",`${mBoat} kg`],["Person v",`${jumpV} m/s →`],["Boat v",`${Math.abs(boatV).toFixed(2)} m/s ←`]],W-175,12);
      t(g,"Person pushes boat back (action) → Boat pushes person forward (reaction)",W/2,22,"#64748b",10);
      const totP=(mPerson*jumpV)+(mBoat*boatV);
      t(g,`Initial momentum = 0 &nbsp;|&nbsp; Final total = ${totP.toFixed(2)} kg·m/s ≈ 0 ✓`,W/2,H-14,C.g,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mPerson,mBoat,jumpV,boatV,jumped]);
  return(
    <div style={card}><div style={tit}>🚣 Sim 3 — Person Jumps from Boat</div>
    <canvas ref={cvs} width={580} height={210} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Person mass" value={mPerson} min={30} max={120} step={5} onChange={setMP} unit=" kg"/>
      <Sl label="Boat mass" value={mBoat} min={50} max={500} step={25} onChange={setMB} unit=" kg"/>
      <Sl label="Jump velocity" value={jumpV} min={1} max={10} onChange={setJV} unit=" m/s"/>
      <button onClick={()=>{setJumped(j=>!j);jRef.current=!jRef.current;pPosRef.current=0;bPosRef.current=0;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:jumped?"#7c3aed":"#1d4ed8",color:"#fff"}}>{jumped?"↺ Reset":"🏃 Jump!"}</button>
    </div>
    <div style={eq}>v_boat = -(m_person × v_person)/m_boat = {boatV.toFixed(2)} m/s &nbsp;|&nbsp; Total momentum stays 0</div></div>
  );
}

/* SIM 4: ICE SKATERS PUSH OFF */
function IceSkatersSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m1,setM1]=useState(60); const [m2,setM2]=useState(80); const [pushF,setPF]=useState(200);
  const v1=useRef(0); const v2=useRef(0); const p1=useRef(0); const p2=useRef(0);
  const [pushed,setPushed]=useState(false); const pRef=useRef(false);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    pRef.current=pushed; if(!pushed){v1.current=0;v2.current=0;p1.current=W/2-30;p2.current=W/2+30;}
    let raf=0; let pushDur=0;
    const frame=()=>{
      if(pRef.current&&pushDur<0.5){pushDur+=0.016; v1.current+=(-pushF/m1)*0.016; v2.current+=(pushF/m2)*0.016;}
      p1.current+=v1.current*0.016*12; p2.current+=v2.current*0.016*12;
      if(p1.current<20)p1.current=20; if(p2.current>W-20)p2.current=W-20;
      g.clearRect(0,0,W,H);bg(g,W,H);
      const iceY=H-40;
      g.fillStyle="rgba(147,197,253,0.08)";g.fillRect(0,iceY,W,H-iceY);
      g.strokeStyle="#93c5fd";g.lineWidth=1.5;g.beginPath();g.moveTo(0,iceY);g.lineTo(W,iceY);g.stroke();
      [[p1.current,"#1d4ed8","#60a5fa",m1],[p2.current,"#92400e","#f59e0b",m2]].forEach(([px,fill,stroke,m],i)=>{
        const x=Number(px);
        g.fillStyle=fill as string;g.beginPath();g.arc(x,iceY-30,14,0,Math.PI*2);g.fill();g.strokeStyle=stroke as string;g.lineWidth=2;g.stroke();
        rr(g,x-8,iceY-16,16,18,3,fill as string,stroke as string);
        t(g,`${m}kg`,x,iceY-36,C.w,9);
        const v=i===0?v1.current:v2.current;
        if(Math.abs(v)>0.1){dA(g,x,iceY-22,x+v*15,iceY-22,i===0?C.r:C.g,2.5);t(g,`${Math.abs(v*0.5).toFixed(1)}m/s`,x+v*17,iceY-32,i===0?C.r:C.g,9);}
      });
      if(pRef.current&&pushDur<0.5){
        t(g,"← ACTION & REACTION forces during push →",W/2,H-14,C.a,11);
      } else if(pushed) {
        t(g,`Lighter skater (${m1}kg) moves faster! a=F/m`,W/2,H-14,C.g,11);
      }
      ib(g,[["v₁ (lighter)",`${(v1.current*0.5).toFixed(2)} m/s`],["v₂ (heavier)",`${(v2.current*0.5).toFixed(2)} m/s`],["p₁+p₂",`${((m1*v1.current+m2*v2.current)*0.5).toFixed(1)} kg·m/s`]],W-175,12);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m1,m2,pushF,pushed]);
  return(
    <div style={card}><div style={tit}>⛸️ Sim 4 — Ice Skaters Push Off (3rd Law)</div>
    <canvas ref={cvs} width={580} height={200} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Skater 1 mass" value={m1} min={30} max={100} step={5} onChange={setM1} unit=" kg"/>
      <Sl label="Skater 2 mass" value={m2} min={30} max={150} step={5} onChange={setM2} unit=" kg"/>
      <Sl label="Push Force" value={pushF} min={50} max={500} step={25} onChange={setPF} unit=" N"/>
      <button onClick={()=>{setPushed(p=>!p);pRef.current=!pRef.current;v1.current=0;v2.current=0;p1.current=W/2-30;p2.current=W/2+30;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:pushed?"#7c3aed":"#1d4ed8",color:"#fff"}}>{pushed?"↺ Reset":"👋 Push!"}</button>
    </div>
    <div style={eq}>Same force on both → lighter skater accelerates more (a=F/m) &nbsp;|&nbsp; Both get same IMPULSE but different velocity</div></div>
  );
}

/* SIM 5: BALLOON JET */
function BalloonJetSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [airV,setAirV]=useState(20); const [running,setRunning]=useState(false);
  const rRef=useRef(false); const bPosRef=useRef(100); const sizeRef=useRef(50);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    rRef.current=running; bPosRef.current=100; sizeRef.current=50;
    let raf=0;
    const frame=()=>{
      if(rRef.current){
        const balloonV=(sizeRef.current/50)*airV*0.03;
        bPosRef.current+=balloonV; sizeRef.current=Math.max(10,sizeRef.current-0.08);
        if(bPosRef.current>W-30){bPosRef.current=100;sizeRef.current=50;}
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      const bx=bPosRef.current, by=H/2;
      const sz=sizeRef.current;
      // String and balloon
      g.strokeStyle="#94a3b8";g.lineWidth=1.5;g.beginPath();g.moveTo(bx,by+20);g.lineTo(bx,by+50);g.stroke();
      // Balloon body
      g.fillStyle="rgba(220,38,38,0.7)";g.beginPath();g.ellipse(bx,by,sz*0.8,sz,0,0,Math.PI*2);g.fill();
      g.strokeStyle=C.r;g.lineWidth=2;g.stroke();
      // Nozzle + air jet
      rr(g,bx-5,by+sz,10,12,2,"#374151","#64748b");
      if(rRef.current){
        for(let i=0;i<8;i++){const ay=by+sz+15+i*8,ax=bx+(-4+Math.random()*8);g.fillStyle=`rgba(147,197,253,${1-i/8})`;g.beginPath();g.arc(ax,ay,3,0,Math.PI*2);g.fill();}
        dA(g,bx,by+sz+5,bx,by+sz+55,C.b,2.5);t(g,"Air → DOWN (action)",bx+5,by+sz+40,C.b,9,"left");
        dA(g,bx,by,bx+50,by,C.g,2.5);t(g,"Balloon → RIGHT (reaction)",bx+55,by-8,C.g,9,"left");
      }
      t(g,`Size: ${sz.toFixed(0)} | Speed: ${(airV*(sz/50)*0.03).toFixed(2)} m/s`,W/2,22,C.d,10);
      t(g,"Air pushed out (action) → Balloon pushed forward (reaction)",W/2,H-14,"#64748b",10);
      ib(g,[["Air ejection v",`${airV} m/s`],["Balloon size",`${sz.toFixed(0)}%`],["Thrust","∝ ṁv_exhaust"]],W-170,40);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[airV,running]);
  return(
    <div style={card}><div style={tit}>🎈 Sim 5 — Balloon Jet Propulsion (3rd Law)</div>
    <canvas ref={cvs} width={580} height={230} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
      <Sl label="Air Ejection Speed" value={airV} min={5} max={50} onChange={setAirV} unit=" m/s"/>
      <button onClick={()=>{setRunning(r=>!r);rRef.current=!rRef.current;bPosRef.current=100;sizeRef.current=50;}} style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:running?"#dc2626":"#16a34a",color:"#fff"}}>{running?"🛑 Stop":"💨 Inflate & Release!"}</button>
    </div>
    <div style={eq}>Balloon pushes air backward (action) → Air pushes balloon forward (reaction) &nbsp;|&nbsp; Same as rocket propulsion!</div></div>
  );
}

/* SIM 6: WALKING MECHANISM (FOOT PUSHES GROUND) */
function WalkingSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [speed,setSpeed]=useState(4);
  const posRef=useRef(80); const legRef=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0;
    const frame=(tt:number)=>{
      const T=tt*0.001;
      posRef.current+=speed*0.016*5; legRef.current=T*speed;
      if(posRef.current>W-60)posRef.current=80;
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H-50;
      g.strokeStyle="#334155";g.lineWidth=3;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      // Stick figure walker
      const px=posRef.current;
      // Body
      g.strokeStyle=C.o;g.lineWidth=3;g.lineCap="round";
      g.beginPath();g.moveTo(px,fy-70);g.lineTo(px,fy-30);g.stroke(); // torso
      g.fillStyle=C.o;g.beginPath();g.arc(px,fy-80,12,0,Math.PI*2);g.fill(); // head
      // Arms
      g.beginPath();g.moveTo(px,fy-60);g.lineTo(px-20,fy-40+Math.sin(legRef.current)*10);g.stroke();
      g.beginPath();g.moveTo(px,fy-60);g.lineTo(px+20,fy-40-Math.sin(legRef.current)*10);g.stroke();
      // Legs
      const l1=Math.sin(legRef.current)*20, l2=-Math.sin(legRef.current)*20;
      g.beginPath();g.moveTo(px,fy-30);g.lineTo(px+l1,fy);g.stroke();
      g.beginPath();g.moveTo(px,fy-30);g.lineTo(px+l2,fy);g.stroke();
      // Foot contact + arrows
      const footX=px+l1;
      // Action: foot pushes back
      dA(g,footX,fy-5,footX-35,fy-5,C.r,2.5);t(g,"Foot pushes ← (action)",footX-40,fy-14,C.r,9,"right");
      // Reaction: ground pushes forward
      dA(g,footX-5,fy+10,footX+30,fy+10,C.g,2.5);t(g,"Ground pushes → (reaction)",footX+35,fy+4,C.g,9,"left");
      ib(g,[["Walking speed",`${speed} m/s`],["Friction force","Ground → body"],["Without friction","Would slip! (ice)"]],W-175,12);
      t(g,"Foot pushes ground backward (action) → Ground pushes body FORWARD (reaction)",W/2,22,"#64748b",10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[speed]);
  return(
    <div style={card}><div style={tit}>🚶 Sim 6 — Walking: Foot Pushes Ground (3rd Law)</div>
    <canvas ref={cvs} width={580} height={210} style={{width:"100%",borderRadius:8}}/>
    <div style={{marginTop:10}}><Sl label="Walking Speed" value={speed} min={1} max={10} onChange={setSpeed} unit=" m/s"/></div>
    <div style={eq}>Foot pushes ground BACKWARD (action) → Ground pushes body FORWARD (reaction) &nbsp;|&nbsp; No friction = no walking!</div></div>
  );
}

/* SIM 7: SWIMMER PUSHES WALL */
function SwimmerSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m,setM]=useState(65); const [pushF,setPF]=useState(400); const [dur,setDur]=useState(0.3);
  const v=pushF*dur/m; const [pushed,setPushed]=useState(false); const pRef=useRef(false);
  const posRef=useRef(0); const velRef=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    pRef.current=pushed; posRef.current=0; velRef.current=pushed?v:0;
    let raf=0; let t2=0;
    const frame=()=>{
      t2+=0.016; if(pRef.current){velRef.current*=0.99;posRef.current+=velRef.current*0.016*10;}
      if(posRef.current>W-80){posRef.current=W-80;velRef.current=0;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      // Pool water
      const waterY=H/2-20;
      g.fillStyle="rgba(37,99,235,0.15)";g.fillRect(0,waterY,W,H-waterY);
      g.strokeStyle="rgba(59,130,246,0.3)";g.lineWidth=1.5;g.beginPath();g.moveTo(0,waterY);g.lineTo(W,waterY);g.stroke();
      // Wall
      rr(g,0,waterY-20,25,H-waterY+20,4,"#374151","#475569");
      t(g,"WALL",12,H/2-5,"#94a3b8",9);
      // Swimmer
      const sx=40+posRef.current, sy=waterY+20;
      g.strokeStyle=C.o;g.lineWidth=3;g.lineCap="round";
      // Body (horizontal swim position)
      g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+40,sy);g.stroke();
      g.fillStyle=C.o;g.beginPath();g.arc(sx,sy,10,0,Math.PI*2);g.fill();
      // Arms reaching back
      g.beginPath();g.moveTo(sx+10,sy);g.lineTo(sx+10-30,sy+10);g.stroke();
      g.beginPath();g.moveTo(sx+10,sy);g.lineTo(sx+10-30,sy-10);g.stroke();
      if(!pRef.current){
        // Action arrow: hands push wall
        dA(g,sx+5,sy-15,sx-40,sy-15,C.r,2.5);t(g,"Hands push wall ← (action)",sx+5,sy-25,C.r,9);
      } else {
        // Reaction: wall pushes swimmer
        dA(g,sx+5,sy+15,sx+60,sy+15,C.g,2.5);t(g,"Wall pushes swimmer → (reaction)",sx+65,sy+8,C.g,9,"left");
        drawVArr(g,posRef.current,velRef.current,sx,sy,W);
      }
      ib(g,[["Swimmer mass",`${m} kg`],["Push Force",`${pushF} N`],["Push Duration",`${dur}s`],["Launch v",`${v.toFixed(2)} m/s`]],W-175,12);
      t(g,"Impulse = F×t = m×v → v = Ft/m = "+v.toFixed(2)+"m/s",W/2,H-14,C.b,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m,pushF,dur,v,pushed]);
  function drawVArr(g:CanvasRenderingContext2D,pos:number,vel:number,sx:number,sy:number,W:number){
    if(vel>0.1) dA(g,sx+40,sy,sx+40+vel*4,sy,C.a,2.5);
  }
  return(
    <div style={card}><div style={tit}>🏊 Sim 7 — Swimmer Pushes Wall (3rd Law)</div>
    <canvas ref={cvs} width={580} height={210} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Mass" value={m} min={40} max={120} step={5} onChange={setM} unit=" kg"/>
      <Sl label="Push Force" value={pushF} min={100} max={1000} step={50} onChange={setPF} unit=" N"/>
      <Sl label="Push Duration" value={dur} min={0.1} max={1.0} step={0.1} onChange={setDur} unit=" s"/>
      <button onClick={()=>{setPushed(p=>!p);pRef.current=!pRef.current;posRef.current=0;velRef.current=v;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:pushed?"#7c3aed":"#1d4ed8",color:"#fff"}}>{pushed?"↺ Reset":"🏊 Push Off!"}</button>
    </div>
    <div style={eq}>Swimmer pushes wall (action) → wall pushes swimmer (reaction) &nbsp;|&nbsp; v = F·t/m = {v.toFixed(2)} m/s</div></div>
  );
}

/* SIM 8: SPRING BETWEEN TWO BALLS */
function SpringTwoBallsSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m1,setM1]=useState(2); const [m2,setM2]=useState(4); const [k,setK]=useState(500);
  const p1Ref=useRef(0); const p2Ref=useRef(0); const v1Ref=useRef(0); const v2Ref=useRef(0);
  const [released,setRel]=useState(false); const rRef=useRef(false);
  const vMax1=(2*m2/(m1+m2))*Math.sqrt(k*0.05*0.05/m1/2); // simplified
  const vMax2=(2*m1/(m1+m2))*Math.sqrt(k*0.05*0.05/m2/2);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    rRef.current=released;
    const naturalLen=60,compress=0.05*100;
    p1Ref.current=0; p2Ref.current=0; v1Ref.current=0; v2Ref.current=0;
    let raf=0; let springComp=compress;
    const frame=()=>{
      if(rRef.current){
        if(springComp>0){
          const F=k*springComp*0.016;
          v1Ref.current-=F/m1*0.016; v2Ref.current+=F/m2*0.016;
          springComp=Math.max(0,springComp-Math.abs(v2Ref.current-v1Ref.current)*0.016*80);
        }
        p1Ref.current+=v1Ref.current*0.016*20;
        p2Ref.current+=v2Ref.current*0.016*20;
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H/2+20;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      const c1x=W/2-50+p1Ref.current, c2x=W/2+50+p2Ref.current;
      // Spring between
      const coils=8, spLen=c2x-c1x-28, coilH=spLen/coils;
      g.strokeStyle=springComp>0?"#8b5cf6":"#334155";g.lineWidth=2;g.beginPath();g.moveTo(c1x+14,fy);
      for(let i=0;i<coils;i++){const sx=c1x+14+(i+0.5)*coilH;g.lineTo(sx,(i%2===0?fy-12:fy+12));}
      g.lineTo(c2x-14,fy);g.stroke();
      // Ball 1 (left)
      g.fillStyle="#1d4ed8";g.beginPath();g.arc(c1x,fy,14,0,Math.PI*2);g.fill();g.strokeStyle="#60a5fa";g.lineWidth=2;g.stroke();
      t(g,`m₁=${m1}kg`,c1x,fy+22,C.b,10);
      // Ball 2 (right)
      g.fillStyle="#92400e";g.beginPath();g.arc(c2x,fy,14,0,Math.PI*2);g.fill();g.strokeStyle="#f59e0b";g.lineWidth=2;g.stroke();
      t(g,`m₂=${m2}kg`,c2x,fy+22,C.a,10);
      if(rRef.current){
        if(v1Ref.current<-0.1){dA(g,c1x+14,fy-20,c1x-30,fy-20,C.b,2);t(g,`${Math.abs(v1Ref.current).toFixed(2)}m/s`,c1x-35,fy-30,C.b,9);}
        if(v2Ref.current>0.1){dA(g,c2x-14,fy-20,c2x+30,fy-20,C.a,2);t(g,`${Math.abs(v2Ref.current).toFixed(2)}m/s`,c2x+35,fy-30,C.a,9,"left");}
      }
      const totalP=(m1*v1Ref.current+m2*v2Ref.current).toFixed(3);
      t(g,`Total momentum = ${totalP} ≈ 0 (started from rest) ✓`,W/2,H-14,C.g,10);
      if(!rRef.current) t(g,"Spring compressed between balls — holds equal & opposite forces",W/2,22,"#64748b",10);
      ib(g,[["v₁",`${(v1Ref.current).toFixed(2)} m/s`],["v₂",`${(v2Ref.current).toFixed(2)} m/s`],["m₁v₁",`${(m1*v1Ref.current).toFixed(2)}`],["m₂v₂",`${(m2*v2Ref.current).toFixed(2)}`]],W-170,12);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m1,m2,k,released]);
  return(
    <div style={card}><div style={tit}>🌀 Sim 8 — Spring Between Two Balls (Action-Reaction)</div>
    <canvas ref={cvs} width={580} height={210} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Mass m₁" value={m1} min={1} max={10} onChange={setM1} unit=" kg"/>
      <Sl label="Mass m₂" value={m2} min={1} max={10} onChange={setM2} unit=" kg"/>
      <Sl label="Spring k" value={k} min={100} max={2000} step={100} onChange={setK} unit=" N/m"/>
      <button onClick={()=>{setRel(r=>!r);rRef.current=!rRef.current;p1Ref.current=0;p2Ref.current=0;v1Ref.current=0;v2Ref.current=0;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:released?"#7c3aed":"#16a34a",color:"#fff"}}>{released?"↺ Reset":"🌀 Release!"}</button>
    </div>
    <div style={eq}>Spring exerts equal &amp; opposite forces on both balls &nbsp;|&nbsp; Lighter ball gets higher velocity (a=F/m)</div></div>
  );
}

/* SIM 9: BALL BOUNCES OFF WALL */
function BallWallSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mass,setM]=useState(0.5); const [speed,setSpd]=useState(8);
  const posRef=useRef(80); const velRef=useRef(8); const comprRef=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    posRef.current=80; velRef.current=speed;
    let raf=0;
    const frame=()=>{
      posRef.current+=velRef.current*0.016*20;
      const wallX=W-40;
      if(posRef.current>=wallX-18){posRef.current=wallX-18; velRef.current=-Math.abs(velRef.current); comprRef.current=5;}
      comprRef.current=Math.max(0,comprRef.current-0.3);
      if(posRef.current<80){posRef.current=80; velRef.current=Math.abs(velRef.current);}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H/2;
      // Wall
      rr(g,wallX,fy-80,30,H-fy+80,4,"#374151","#475569");t(g,"WALL",wallX+15,fy-50,"#64748b",9);
      // Wall compression visual
      if(comprRef.current>0){g.fillStyle=`rgba(239,68,68,${comprRef.current/5*0.4})`;g.fillRect(wallX-comprRef.current,fy-60,comprRef.current+30,100);}
      // Ball
      const bx=posRef.current;
      g.fillStyle=C.b;g.beginPath();g.arc(bx,fy,18,0,Math.PI*2);g.fill();g.strokeStyle="#60a5fa";g.lineWidth=2;g.stroke();
      // Velocity arrow
      dA(g,bx+(velRef.current>0?18:-18),fy,bx+(velRef.current>0?18:-18)+velRef.current*3,fy,C.a,2.5);
      t(g,`v=${Math.abs(velRef.current*0.5).toFixed(1)}m/s`,bx+(velRef.current>0?65:-65),fy-8,C.a,10);
      if(comprRef.current>0.5){
        dA(g,wallX-5,fy-30,wallX-30,fy-30,C.r,2.5);t(g,"Action: ball pushes wall",wallX-35,fy-40,C.r,9,"right");
        dA(g,wallX-5,fy+30,wallX-50,fy+30,C.g,2.5);t(g,"Reaction: wall pushes ball back",wallX-55,fy+22,C.g,9,"right");
      }
      const impulse=2*mass*speed;
      ib(g,[["Ball mass",`${mass} kg`],["Speed",`${speed} m/s`],["Impulse",`2mv=${impulse.toFixed(2)} N·s`],["Force",`≈ ${(impulse/0.01).toFixed(0)} N`]],W-175,12);
      t(g,"Ball pushes wall (action) → wall pushes ball back (reaction) — elastic bounce!",W/2,22,"#64748b",10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mass,speed]);
  return(
    <div style={card}><div style={tit}>⚽ Sim 9 — Ball Bounces Off Wall (3rd Law)</div>
    <canvas ref={cvs} width={580} height={210} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Ball Mass" value={mass} min={0.1} max={2.0} step={0.1} onChange={setM} unit=" kg"/>
      <Sl label="Speed" value={speed} min={2} max={20} onChange={setSpd} unit=" m/s"/>
    </div>
    <div style={eq}>Ball pushes wall with force F (action) → Wall pushes ball back with F (reaction) &nbsp;|&nbsp; Impulse = 2mv = {(2*mass*speed).toFixed(1)} N·s</div></div>
  );
}

/* SIM 10: EXPLOSION — PIECES FLY APART */
function ExplosionSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m1,setM1]=useState(3); const [m2,setM2]=useState(5); const [energy,setE]=useState(200);
  const [exploded,setExpl]=useState(false); const eRef=useRef(false);
  const v1=(Math.sqrt(2*energy*m2/(m1*(m1+m2)))); const v2=(Math.sqrt(2*energy*m1/(m2*(m1+m2))));
  const p1Ref=useRef(0); const p2Ref=useRef(0); const partsRef=useRef<{x:number,y:number,vx:number,vy:number,c:string}[]>([]);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    eRef.current=exploded; p1Ref.current=0; p2Ref.current=0;
    if(exploded){
      partsRef.current=Array.from({length:20},(_,i)=>({x:W/2,y:H/2,vx:(Math.random()-0.5)*8,vy:(Math.random()-0.5)*8,c:`hsl(${i*18},70%,60%)`}));
    } else partsRef.current=[];
    let raf=0;
    const frame=()=>{
      if(eRef.current){
        p1Ref.current-=v1*0.016*12; p2Ref.current+=v2*0.016*10;
        partsRef.current.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=0.15;});
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      const cx=W/2,cy=H/2;
      if(!eRef.current){
        // Pre-explosion
        g.fillStyle="#334155";g.beginPath();g.arc(cx,cy,30,0,Math.PI*2);g.fill();g.strokeStyle="#475569";g.lineWidth=2;g.stroke();
        t(g,"m₁+m₂",cx,cy+4,"#94a3b8",10);
        t(g,"⚠️ About to explode! (internal energy = "+energy+" J)",cx,cy-50,C.a,11);
      } else {
        // Particle debris
        partsRef.current.forEach(p=>{if(p.y<H+20){g.fillStyle=p.c;g.beginPath();g.arc(p.x,p.y,3,0,Math.PI*2);g.fill();}});
        // Piece 1 (left)
        const b1x=cx-30+p1Ref.current;
        if(b1x>20){g.fillStyle="#1d4ed8";g.beginPath();g.arc(b1x,cy,16,0,Math.PI*2);g.fill();t(g,`m₁=${m1}kg`,b1x,cy+25,C.b,10);dA(g,b1x+16,cy,b1x-30,cy,C.b,2);t(g,`${v1.toFixed(1)}m/s ←`,b1x-35,cy-8,C.b,9,"right");}
        // Piece 2 (right)
        const b2x=cx+30+p2Ref.current;
        if(b2x<W-20){g.fillStyle="#92400e";g.beginPath();g.arc(b2x,cy,16,0,Math.PI*2);g.fill();t(g,`m₂=${m2}kg`,b2x,cy+25,C.a,10);dA(g,b2x-16,cy,b2x+30,cy,C.a,2);t(g,`→ ${v2.toFixed(1)}m/s`,b2x+35,cy-8,C.a,9,"left");}
      }
      const pm1=m1*v1, pm2=m2*v2;
      ib(g,[["v₁",`${v1.toFixed(2)} m/s ←`],["v₂",`${v2.toFixed(2)} m/s →`],["p₁ = m₁v₁",`${pm1.toFixed(2)}`],["p₂ = m₂v₂",`${pm2.toFixed(2)}`],["Total p","≈ 0 ✓"]],W-175,12);
      t(g,exploded?`p₁+p₂ = ${(pm1-pm2).toFixed(2)} ≈ 0 (momentum conserved!)`:""  ,W/2,H-14,C.g,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m1,m2,energy,v1,v2,exploded]);
  return(
    <div style={card}><div style={tit}>💥 Sim 10 — Explosion: Equal &amp; Opposite Momentum</div>
    <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Mass m₁" value={m1} min={1} max={15} onChange={setM1} unit=" kg"/>
      <Sl label="Mass m₂" value={m2} min={1} max={15} onChange={setM2} unit=" kg"/>
      <Sl label="Explosion Energy" value={energy} min={50} max={500} step={25} onChange={setE} unit=" J"/>
      <button onClick={()=>{setExpl(e=>!e);eRef.current=!eRef.current;p1Ref.current=0;p2Ref.current=0;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:exploded?"#7c3aed":"#dc2626",color:"#fff"}}>{exploded?"↺ Reset":"💥 Explode!"}</button>
    </div>
    <div style={eq}>Heavier piece → slower &nbsp;|&nbsp; Total momentum = 0 (conserved) &nbsp;|&nbsp; Action &amp; reaction forces equal & opposite</div></div>
  );
}

/* SIM 11: ASTRONAUT THROWS TOOL */
function AstronautSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mAstro,setMA]=useState(80); const [mTool,setMT]=useState(2); const [vThrow,setVT]=useState(5);
  const vAstro=-(mTool*vThrow)/mAstro;
  const [thrown,setTh]=useState(false); const thRef=useRef(false);
  const aPRef=useRef(0); const tPRef=useRef(0); const starsRef=useRef<{x:number,y:number}[]>([]);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    starsRef.current=Array.from({length:50},()=>({x:Math.random()*W,y:Math.random()*H}));
    thRef.current=thrown; aPRef.current=0; tPRef.current=0;
    let raf=0;
    const frame=()=>{
      if(thRef.current){aPRef.current+=vAstro*0.016*12; tPRef.current+=vThrow*0.016*8;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      starsRef.current.forEach(s=>{g.fillStyle="rgba(255,255,255,0.5)";g.beginPath();g.arc(s.x,s.y,1,0,Math.PI*2);g.fill();});
      const ax=W/2+aPRef.current, tx=W/2+50+tPRef.current;
      // Tool
      if(tx<W+20){rr(g,tx-10,H/2-8,20,16,3,"#64748b","#94a3b8");t(g,"🔧",tx,H/2+4,C.w,12);if(thRef.current){dA(g,tx-10,H/2,tx+25,H/2,C.a,2);t(g,`${vThrow}m/s`,tx+28,H/2,C.a,9,"left");}}
      // Astronaut
      g.fillStyle="#f97316";g.beginPath();g.arc(ax,H/2-22,12,0,Math.PI*2);g.fill();
      rr(g,ax-8,H/2-10,16,22,3,C.o);
      if(thRef.current){dA(g,ax-8,H/2,ax-40,H/2,C.b,2.5);t(g,`${Math.abs(vAstro).toFixed(2)}m/s ←`,ax-45,H/2-8,C.b,9,"right");}
      ib(g,[["Astronaut",`${mAstro}kg → ${vAstro.toFixed(2)}m/s`],["Tool",`${mTool}kg → ${vThrow}m/s`],["Total p","≈ 0 ✓"]],W-178,12);
      t(g,"In space: throw tool forward → float backward! (Newton's 3rd & momentum conservation)",W/2,H-14,"#64748b",10);
      if(!thRef.current) t(g,"Zero net external force → any action creates equal opposite reaction",W/2,22,"#64748b",10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mAstro,mTool,vThrow,vAstro,thrown]);
  return(
    <div style={card}><div style={tit}>👨‍🚀 Sim 11 — Astronaut Throws Tool in Space</div>
    <canvas ref={cvs} width={580} height={200} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Astronaut mass" value={mAstro} min={50} max={150} step={5} onChange={setMA} unit=" kg"/>
      <Sl label="Tool mass" value={mTool} min={0.5} max={10} step={0.5} onChange={setMT} unit=" kg"/>
      <Sl label="Throw speed" value={vThrow} min={1} max={15} onChange={setVT} unit=" m/s"/>
      <button onClick={()=>{setTh(t=>!t);thRef.current=!thRef.current;aPRef.current=0;tPRef.current=0;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:thrown?"#7c3aed":"#1d4ed8",color:"#fff"}}>{thrown?"↺ Reset":"🤾 Throw!"}</button>
    </div>
    <div style={eq}>v_astro = -(m_tool × v_tool)/m_astro = {vAstro.toFixed(3)} m/s &nbsp;|&nbsp; Momentum conserved: total p = 0</div></div>
  );
}

/* SIM 12: FIREHOSE REACTION */
function FirehoseSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [flowRate,setFlow]=useState(30); const [waterV,setWV]=useState(20);
  const recoilF=flowRate*waterV; // F = dm/dt × v
  const posRef=useRef(0); const velRef=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    posRef.current=0; velRef.current=0;
    let raf=0; let t2=0;
    const frame=()=>{
      t2+=0.016; velRef.current+=(-recoilF/150)*0.016; posRef.current+=velRef.current*0.016*5;
      if(posRef.current<-50){posRef.current=-50;velRef.current=0;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H-50;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      // Firefighter
      const fx=200+posRef.current;
      g.fillStyle=C.o;g.beginPath();g.arc(fx,fy-50,10,0,Math.PI*2);g.fill();
      rr(g,fx-7,fy-40,14,25,3,C.o);
      // Hose
      g.strokeStyle="#334155";g.lineWidth=8;g.lineCap="round";
      g.beginPath();g.moveTo(fx+7,fy-32);g.lineTo(fx+60,fy-26);g.stroke();
      g.strokeStyle="#475569";g.lineWidth=4;g.stroke();
      // Water jet (action)
      for(let i=0;i<12;i++){
        const wx=fx+65+i*12, wy=fy-26+Math.sin(t2*10+i*0.5)*3;
        if(wx<W){g.fillStyle=`rgba(96,165,250,${1-i/12})`;g.beginPath();g.arc(wx,wy,4,0,Math.PI*2);g.fill();}
      }
      dA(g,fx+65,fy-26,fx+110,fy-26,C.b,2.5);t(g,`Water → ${waterV}m/s (action)`,fx+115,fy-35,C.b,9,"left");
      // Recoil (reaction)
      dA(g,fx,fy-32,fx-50,fy-32,C.r,2.5);t(g,`Recoil ← (reaction)`,fx-55,fy-42,C.r,9,"right");
      ib(g,[["Flow rate",`${flowRate} kg/s`],["Water speed",`${waterV} m/s`],["Recoil force",`${recoilF} N`]],W-175,12);
      t(g,`F_recoil = ṁ × v = ${flowRate} × ${waterV} = ${recoilF} N (rocket equation!)`,W/2,22,C.a,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[flowRate,waterV,recoilF]);
  return(
    <div style={card}><div style={tit}>🚒 Sim 12 — Firehose Recoil (3rd Law)</div>
    <canvas ref={cvs} width={580} height={200} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Flow Rate" value={flowRate} min={5} max={80} step={5} onChange={setFlow} unit=" kg/s"/>
      <Sl label="Water Ejection Speed" value={waterV} min={5} max={40} onChange={setWV} unit=" m/s"/>
    </div>
    <div style={eq}>F_recoil = ṁ × v_water = {recoilF} N &nbsp;|&nbsp; Same as rocket thrust equation: F = v × (dm/dt)</div></div>
  );
}

/* SIM 13: EARTH-MOON MUTUAL ATTRACTION */
function EarthMoonSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [distFactor,setDist]=useState(5);
  const G=6.674e-11, ME=6e24, MM=7.3e22, d=distFactor*1e8;
  const F=G*ME*MM/(d*d);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0; let t2=0;
    const frame=()=>{
      t2+=0.016; g.clearRect(0,0,W,H);bg(g,W,H);
      const cy=H/2;
      // Earth
      g.fillStyle="rgba(37,99,235,0.7)";g.beginPath();g.arc(140,cy,35,0,Math.PI*2);g.fill();g.strokeStyle="#60a5fa";g.lineWidth=2;g.stroke();
      g.fillStyle="rgba(22,163,74,0.5)";g.beginPath();g.arc(130,cy-10,15,0,Math.PI*2);g.fill();
      t(g,"Earth",140,cy+50,C.b,11);t(g,"5.97×10²⁴kg",140,cy+64,C.d,9);
      // Moon
      g.fillStyle="#94a3b8";g.beginPath();g.arc(W-120,cy,20,0,Math.PI*2);g.fill();g.strokeStyle="#cbd5e1";g.lineWidth=2;g.stroke();
      t(g,"Moon",W-120,cy+35,C.d,11);t(g,"7.3×10²²kg",W-120,cy+48,C.d,9);
      // Gravitational force arrows (BOTH EQUAL)
      const fScale=Math.min(F/1e18*80,100);
      dA(g,175,cy,175+fScale,cy,C.r,2.5);t(g,`F on Earth=${F.toExponential(1)}N →`,175+fScale/2,cy-14,C.r,9);
      dA(g,W-140,cy,W-140-fScale,cy,C.g,2.5);t(g,`← F on Moon=${F.toExponential(1)}N`,W-140-fScale/2,cy-14,C.g,9);
      // Force = SAME label
      t(g,"SAME FORCE on both! (Newton's 3rd Law)",W/2,H-14,C.a,12);
      t(g,`But Earth barely moves (huge mass) while Moon orbits (small mass)`,W/2,H-1,C.d,9);
      rr(g,W/2-120,30,240,32,6,"rgba(15,23,42,0.7)","rgba(245,158,11,0.25)");
      t(g,`F = G×M×m/r² = ${F.toExponential(2)} N`,W/2,51,C.a,11);
      ib(g,[["Distance",`${(d/1e9).toFixed(0)}×10⁶ km`],["Gravity F",`${F.toExponential(2)} N`]],W-175,70);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[distFactor,F,d]);
  return(
    <div style={card}><div style={tit}>🌍 Sim 13 — Earth-Moon: Mutual Gravity (3rd Law)</div>
    <canvas ref={cvs} width={580} height={210} style={{width:"100%",borderRadius:8}}/>
    <div style={{marginTop:10}}><Sl label="Distance Factor" value={distFactor} min={2} max={10} onChange={setDist} unit="×"/></div>
    <div style={eq}>Earth pulls Moon with F = {F.toExponential(1)}N &nbsp;|&nbsp; Moon pulls Earth with SAME F &nbsp;|&nbsp; Action &amp; reaction are always equal!</div></div>
  );
}

/* SIM 14: BILLIARD BALL COLLISION */
function BilliardSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [v0,setV0]=useState(8); const [m1,setM1]=useState(0.17); const [m2,setM2]=useState(0.17);
  const b1PRef=useRef(100); const b2PRef=useRef(380); const b1VRef=useRef(0); const b2VRef=useRef(0);
  const [fired,setFired]=useState(false); const fRef=useRef(false);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    fRef.current=fired; b1PRef.current=100; b2PRef.current=380; b1VRef.current=fired?v0:0; b2VRef.current=0;
    let collided=false;
    let raf=0;
    const frame=()=>{
      b1PRef.current+=b1VRef.current*0.016*20; b2PRef.current+=b2VRef.current*0.016*20;
      if(!collided&&b1PRef.current>=b2PRef.current-32){
        collided=true;
        const v1f=((m1-m2)/(m1+m2))*b1VRef.current; const v2f=(2*m1/(m1+m2))*b1VRef.current;
        b1VRef.current=v1f; b2VRef.current=v2f;
      }
      if(b1PRef.current<100){b1PRef.current=100;b1VRef.current=0;}
      if(b2PRef.current>W-20){b2PRef.current=W-20;b2VRef.current=0;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H/2;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy+18);g.lineTo(W,fy+18);g.stroke();
      // Ball 1 (white - cue)
      g.fillStyle="#f1f5f9";g.beginPath();g.arc(b1PRef.current,fy,16,0,Math.PI*2);g.fill();g.strokeStyle="#64748b";g.lineWidth=2;g.stroke();
      if(b1VRef.current>0.1) dA(g,b1PRef.current+16,fy,b1PRef.current+16+b1VRef.current*5,fy,C.g,2);
      // Ball 2 (target)
      g.fillStyle="#dc2626";g.beginPath();g.arc(b2PRef.current,fy,16,0,Math.PI*2);g.fill();g.strokeStyle="#ef4444";g.lineWidth=2;g.stroke();
      if(b2VRef.current>0.1) dA(g,b2PRef.current+16,fy,b2PRef.current+16+b2VRef.current*5,fy,C.a,2);
      if(m1===m2&&collided){t(g,"Equal masses: ALL momentum transferred (classic billiard!)",W/2,22,C.g,11);}
      else if(collided){t(g,"Unequal masses: partial transfer — lighter ball gets more velocity",W/2,22,C.a,11);}
      else {t(g,"Cue ball approaches target →",W/2,22,C.d,10);}
      const v1f=collided?b1VRef.current:0, v2f=collided?b2VRef.current:0;
      ib(g,[["v₁ before",`${v0} m/s`],["v₁ after",`${v1f.toFixed(2)} m/s`],["v₂ after",`${v2f.toFixed(2)} m/s`],["Δp check",`${((m1*(v0-v1f)-m2*v2f)).toFixed(3)} ≈0`]],W-175,12);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[v0,m1,m2,fired]);
  return(
    <div style={card}><div style={tit}>🎱 Sim 14 — Billiard Ball Collision (3rd Law + Momentum)</div>
    <canvas ref={cvs} width={580} height={200} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Cue Ball Speed" value={v0} min={2} max={20} onChange={setV0} unit=" m/s"/>
      <Sl label="Cue mass m₁" value={m1} min={0.05} max={0.5} step={0.05} onChange={setM1} unit=" kg"/>
      <Sl label="Target mass m₂" value={m2} min={0.05} max={0.5} step={0.05} onChange={setM2} unit=" kg"/>
      <button onClick={()=>{setFired(f=>!f);fRef.current=!fRef.current;b1PRef.current=100;b2PRef.current=380;b1VRef.current=v0;b2VRef.current=0;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:fired?"#7c3aed":"#1d4ed8",color:"#fff"}}>{fired?"↺ Reset":"🎱 Strike!"}</button>
    </div>
    <div style={eq}>v₁_after = (m₁-m₂)/(m₁+m₂)×v₀ &nbsp;|&nbsp; v₂_after = 2m₁/(m₁+m₂)×v₀ &nbsp;|&nbsp; Equal mass: full transfer!</div></div>
  );
}

/* SIM 15: THIRD LAW INTERACTIVE LABORATORY */
function ThirdLawLab(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [F,setF]=useState(50); const [m1,setM1]=useState(5); const [m2,setM2]=useState(3);
  const p1Ref=useRef(0); const p2Ref=useRef(0); const v1Ref=useRef(0); const v2Ref=useRef(0);
  const [interact,setInt]=useState(false); const intRef=useRef(false);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    intRef.current=interact; p1Ref.current=0; p2Ref.current=0; v1Ref.current=0; v2Ref.current=0;
    let raf=0; let intDur=0;
    const frame=()=>{
      if(intRef.current&&intDur<1.0){
        intDur+=0.016;
        v1Ref.current+=(-F/m1)*0.016; v2Ref.current+=(F/m2)*0.016;
      }
      p1Ref.current+=v1Ref.current*0.016*12; p2Ref.current+=v2Ref.current*0.016*12;
      if(p1Ref.current<-180)p1Ref.current=-180; if(p2Ref.current>180)p2Ref.current=180;
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H/2;
      const c1x=W/2-50+p1Ref.current, c2x=W/2+50+p2Ref.current;
      // Object 1
      rr(g,c1x-25,fy-20,50,38,5,"rgba(29,78,216,0.7)","#3b82f6",2);
      t(g,`m₁=${m1}kg`,c1x,fy-2,C.w,11);
      // Object 2
      rr(g,c2x-25,fy-20,50,38,5,"rgba(146,64,14,0.7)","#f59e0b",2);
      t(g,`m₂=${m2}kg`,c2x,fy-2,C.w,11);
      if(intRef.current&&intDur<1.0){
        // Action arrow
        dA(g,c2x-25,fy-8,c2x-60,fy-8,C.r,2.5);t(g,`-${F}N`,c2x-75,fy-18,C.r,9);
        // Reaction arrow
        dA(g,c1x+25,fy+8,c1x+60,fy+8,C.g,2.5);t(g,`+${F}N`,c1x+75,fy-2,C.g,9,"left");
        t(g,"← Action (on m₂) &amp; Reaction (on m₁) → forces are EQUAL &amp; OPPOSITE",W/2,H-14,C.a,10);
      }
      if(v1Ref.current<-0.1){dA(g,c1x-25,fy-30,c1x-60,fy-30,C.b,2);t(g,`${Math.abs(v1Ref.current).toFixed(1)}m/s`,c1x-65,fy-40,C.b,9,"right");}
      if(v2Ref.current>0.1){dA(g,c2x+25,fy-30,c2x+60,fy-30,C.a,2);t(g,`${v2Ref.current.toFixed(1)}m/s`,c2x+65,fy-40,C.a,9,"left");}
      const pTotal=(m1*v1Ref.current+m2*v2Ref.current);
      ib(g,[["Force on m₁",`+${F} N →`],["Force on m₂",`-${F} N ←`],["Total p",`${pTotal.toFixed(2)} kg·m/s`],["Accel a₁",`${(-F/m1).toFixed(1)} m/s²`],["Accel a₂",`${(F/m2).toFixed(1)} m/s²`]],W-175,12);
      t(g,"Same force → lighter object accelerates MORE (Newton's 2nd Law!)",W/2,22,"#64748b",10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[F,m1,m2,interact]);
  return(
    <div style={card}><div style={tit}>🔬 Sim 15 — Newton&apos;s 3rd Law Interactive Laboratory</div>
    <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Interaction Force" value={F} min={10} max={200} step={10} onChange={setF} unit=" N"/>
      <Sl label="Mass m₁" value={m1} min={1} max={20} onChange={setM1} unit=" kg"/>
      <Sl label="Mass m₂" value={m2} min={1} max={20} onChange={setM2} unit=" kg"/>
      <button onClick={()=>{setInt(i=>!i);intRef.current=!intRef.current;p1Ref.current=0;p2Ref.current=0;v1Ref.current=0;v2Ref.current=0;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:interact?"#7c3aed":"#1d4ed8",color:"#fff"}}>{interact?"↺ Reset":"🤝 Interact!"}</button>
    </div>
    <div style={eq}>F on m₁ = -F on m₂ (always equal &amp; opposite) &nbsp;|&nbsp; But a₁≠a₂ when masses differ (a=F/m)</div></div>
  );
}

export function AdvancedTopic4Sims(){
  return(
    <div style={{marginTop:24}}>
      <div style={{background:"linear-gradient(90deg,rgba(239,68,68,0.15),transparent)",borderLeft:"3px solid #ef4444",padding:"10px 16px",marginBottom:20,borderRadius:"0 8px 8px 0"}}>
        <div style={{color:"#e2e8f0",fontWeight:700,fontSize:15}}>⚡ Advanced Simulations — Newton&apos;s Third Law (Action-Reaction)</div>
        <div style={{color:"#64748b",fontSize:12,marginTop:2}}>15 interactive simulations showing every action has an equal and opposite reaction</div>
      </div>
      <RocketSim/><GunRecoilSim/><BoatJumpSim/><IceSkatersSim/><BalloonJetSim/>
      <WalkingSim/><SwimmerSim/><SpringTwoBallsSim/><BallWallSim/><ExplosionSim/>
      <AstronautSim/><FirehoseSim/><EarthMoonSim/><BilliardSim/><ThirdLawLab/>
    </div>
  );
}
