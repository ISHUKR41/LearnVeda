"use client";
/**
 * FILE: AdvancedSim5.tsx
 * PURPOSE: 15 professional canvas simulations — Topic 5: Conservation of Momentum
 * EXPORTS: AdvancedTopic5Sims
 */
import React, { useState, useEffect, useRef } from "react";

function dA(g:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,col:string,lw=2.5){
  const dx=x2-x1,dy=y2-y1,len=Math.sqrt(dx*dx+dy*dy);if(len<4)return;
  const a=Math.atan2(dy,dx),hs=Math.min(10,len*0.35);
  g.save();g.strokeStyle=col;g.fillStyle=col;g.lineWidth=lw;g.lineCap="round";
  g.beginPath();g.moveTo(x1,y1);g.lineTo(x2-hs*0.8*Math.cos(a),y2-hs*0.8*Math.sin(a));g.stroke();
  g.beginPath();g.moveTo(x2,y2);g.lineTo(x2-hs*Math.cos(a-0.42),y2-hs*Math.sin(a-0.42));g.lineTo(x2-hs*Math.cos(a+0.42),y2-hs*Math.sin(a+0.42));g.closePath();g.fill();g.restore();
}
function tt(g:CanvasRenderingContext2D,s:string,x:number,y:number,c="#e2e8f0",sz=11,align:CanvasTextAlign="center"){
  g.save();g.font=`bold ${sz}px 'Inter',sans-serif`;g.fillStyle=c;g.textAlign=align;g.fillText(s,x,y);g.restore();
}
function bg(g:CanvasRenderingContext2D,w:number,h:number){
  const gr=g.createLinearGradient(0,0,w,h);gr.addColorStop(0,"#0d1117");gr.addColorStop(1,"#161b22");
  g.fillStyle=gr;g.fillRect(0,0,w,h);
  g.strokeStyle="rgba(255,255,255,0.03)";g.lineWidth=1;
  for(let x=40;x<w;x+=40){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
  for(let y=40;y<h;y+=40){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
}
function rr(g:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number,fill:string,stroke?:string,sw=1.5){
  g.save();g.beginPath();g.roundRect(x,y,w,h,r);g.fillStyle=fill;g.fill();
  if(stroke){g.strokeStyle=stroke;g.lineWidth=sw;g.stroke();}g.restore();
}
function ib(g:CanvasRenderingContext2D,lines:[string,string][],x:number,y:number,w=165){
  const ph=8,lh=16,h=lines.length*lh+ph*2;
  rr(g,x,y,w,h,6,"rgba(15,23,42,0.88)","rgba(99,102,241,0.25)");
  lines.forEach(([l,v],i)=>{tt(g,l,x+ph,y+ph+i*lh+11,"#94a3b8",10,"left");tt(g,v,x+w-ph,y+ph+i*lh+11,"#60a5fa",10,"right");});
}
const C={b:"#3b82f6",r:"#ef4444",g:"#10b981",a:"#f59e0b",p:"#8b5cf6",c:"#06b6d4",w:"#f1f5f9",d:"#94a3b8",o:"#f97316"};
const card:React.CSSProperties={background:"linear-gradient(135deg,#0f172a 0%,#1a2332 100%)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 20px",marginBottom:20};
const tit:React.CSSProperties={color:"#e2e8f0",fontSize:14,fontWeight:700,marginBottom:10};
const eq:React.CSSProperties={color:"#94a3b8",fontSize:11,fontFamily:"monospace",marginTop:8,background:"rgba(99,102,241,0.08)",padding:"5px 10px",borderRadius:6,display:"inline-block"};
function Sl({label:l,value,min,max,step=1,onChange,unit=""}:{label:string;value:number;min:number;max:number;step?:number;onChange:(v:number)=>void;unit?:string}){
  return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{color:"#94a3b8",fontSize:11}}>{l}</span><span style={{color:"#3b82f6",fontWeight:700,fontSize:12}}>{value}{unit}</span></div><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:"#3b82f6"}}/></div>;
}

/* SIM 1: ELASTIC COLLISION EXPLORER */
function ElasticCollision(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m1,setM1]=useState(3); const [m2,setM2]=useState(5); const [v1i,setV1]=useState(8); const [v2i,setV2]=useState(-2);
  const v1f=((m1-m2)*v1i+2*m2*v2i)/(m1+m2);
  const v2f=((m2-m1)*v2i+2*m1*v1i)/(m1+m2);
  const p_before=m1*v1i+m2*v2i, p_after=m1*v1f+m2*v2f;
  const KE_before=0.5*(m1*v1i**2+m2*v2i**2), KE_after=0.5*(m1*v1f**2+m2*v2f**2);
  const [running,setRunning]=useState(false); const runRef=useRef(false);
  const x1Ref=useRef(120); const x2Ref=useRef(420); const vv1=useRef(0); const vv2=useRef(0); const collided=useRef(false);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    runRef.current=running; x1Ref.current=120; x2Ref.current=420; vv1.current=running?v1i:0; vv2.current=running?v2i:0; collided.current=false;
    let raf=0;
    const frame=()=>{
      if(runRef.current){
        x1Ref.current+=vv1.current*0.016*15; x2Ref.current+=vv2.current*0.016*15;
        if(!collided.current&&x1Ref.current>=x2Ref.current-32){
          collided.current=true; vv1.current=v1f; vv2.current=v2f;
        }
        if(x1Ref.current<20){x1Ref.current=20;vv1.current=Math.abs(vv1.current);}
        if(x2Ref.current>W-20){x2Ref.current=W-20;vv2.current=-Math.abs(vv2.current);}
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H/2+10;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy+16);g.lineTo(W,fy+16);g.stroke();
      // Ball 1
      g.fillStyle="#1d4ed8";g.beginPath();g.arc(x1Ref.current,fy,16,0,Math.PI*2);g.fill();g.strokeStyle="#60a5fa";g.lineWidth=2;g.stroke();
      tt(g,`m₁=${m1}`,x1Ref.current,fy+30,C.b,10);
      if(Math.abs(vv1.current)>0.1){dA(g,x1Ref.current,fy,x1Ref.current+vv1.current*5,fy,C.b,2);}
      // Ball 2
      g.fillStyle="#dc2626";g.beginPath();g.arc(x2Ref.current,fy,16,0,Math.PI*2);g.fill();g.strokeStyle="#f87171";g.lineWidth=2;g.stroke();
      tt(g,`m₂=${m2}`,x2Ref.current,fy+30,C.r,10);
      if(Math.abs(vv2.current)>0.1){dA(g,x2Ref.current,fy,x2Ref.current+vv2.current*5,fy,C.r,2);}
      const ph=collided.current;
      ib(g,[["p before",`${p_before.toFixed(2)} kg·m/s`],["p after",`${p_after.toFixed(2)} kg·m/s`],["KE before",`${KE_before.toFixed(1)} J`],["KE after",`${KE_after.toFixed(1)} J`]],W-172,12);
      tt(g,ph?`v₁_after=${v1f.toFixed(2)}m/s  v₂_after=${v2f.toFixed(2)}m/s  ✓Elastic: KE conserved!`:`Initial: v₁=${v1i}m/s v₂=${v2i}m/s`,W/2,22,ph?C.g:C.d,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m1,m2,v1i,v2i,v1f,v2f,p_before,p_after,KE_before,KE_after,running]);
  return(
    <div style={card}><div style={tit}>⚡ Sim 1 — Elastic Collision (p & KE both conserved)</div>
    <canvas ref={cvs} width={580} height={200} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:6,marginTop:10,alignItems:"end"}}>
      <Sl label="m₁" value={m1} min={1} max={15} onChange={setM1} unit=" kg"/>
      <Sl label="v₁" value={v1i} min={-15} max={15} onChange={setV1} unit=" m/s"/>
      <Sl label="m₂" value={m2} min={1} max={15} onChange={setM2} unit=" kg"/>
      <Sl label="v₂" value={v2i} min={-15} max={0} onChange={setV2} unit=" m/s"/>
      <button onClick={()=>{setRunning(r=>!r);runRef.current=!runRef.current;x1Ref.current=120;x2Ref.current=420;collided.current=false;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:running?"#7c3aed":"#1d4ed8",color:"#fff"}}>{running?"↺":"▶ Go"}</button>
    </div>
    <div style={eq}>v₁_after={(v1f).toFixed(2)}m/s &nbsp;|&nbsp; v₂_after={(v2f).toFixed(2)}m/s &nbsp;|&nbsp; p_before={p_before.toFixed(1)} = p_after={p_after.toFixed(1)} ✓</div></div>
  );
}

/* SIM 2: INELASTIC COLLISION */
function InelasticCollision(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m1,setM1]=useState(4); const [m2,setM2]=useState(3); const [v1i,setV1]=useState(10);
  const vf=(m1*v1i)/(m1+m2); // objects stick together
  const KE_i=0.5*m1*v1i**2; const KE_f=0.5*(m1+m2)*vf**2; const KE_lost=KE_i-KE_f;
  const [running,setRunning]=useState(false); const runRef=useRef(false);
  const x1Ref=useRef(100); const x2Ref=useRef(400); const v=useRef(0); const combined=useRef(false); const xc=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    runRef.current=running; x1Ref.current=100; x2Ref.current=400; v.current=running?v1i:0; combined.current=false; xc.current=0;
    let raf=0;
    const frame=()=>{
      if(runRef.current){
        if(!combined.current){x1Ref.current+=v.current*0.016*12; if(x1Ref.current>=x2Ref.current-32){combined.current=true; xc.current=(x1Ref.current+x2Ref.current)/2; v.current=vf;}}
        else{xc.current+=v.current*0.016*12; if(xc.current>W-30)xc.current=W-30;}
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H/2+10;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy+16);g.lineTo(W,fy+16);g.stroke();
      if(!combined.current){
        g.fillStyle="#1d4ed8";g.beginPath();g.arc(x1Ref.current,fy,16,0,Math.PI*2);g.fill();g.strokeStyle="#60a5fa";g.lineWidth=2;g.stroke();
        tt(g,`m₁=${m1}kg`,x1Ref.current,fy+28,C.b,10);
        if(v.current>0.1) dA(g,x1Ref.current+16,fy,x1Ref.current+16+30,fy,C.b,2);
        g.fillStyle="#7c3aed";g.beginPath();g.arc(x2Ref.current,fy,16,0,Math.PI*2);g.fill();g.strokeStyle="#a78bfa";g.lineWidth=2;g.stroke();
        tt(g,`m₂=${m2}kg (stationary)`,x2Ref.current,fy+28,C.p,10);
      } else {
        // Combined mass
        const cw=44+Math.min(m2*4,20);
        rr(g,xc.current-cw/2,fy-20,cw,38,5,"rgba(124,58,237,0.6)","#8b5cf6",2);
        tt(g,`${m1+m2}kg stuck`,xc.current,fy-2,C.w,11);
        if(vf>0.1) dA(g,xc.current+cw/2,fy,xc.current+cw/2+30,fy,C.a,2.5);
      }
      ib(g,[["p before",`${(m1*v1i).toFixed(1)} kg·m/s`],["p after",`${((m1+m2)*vf).toFixed(1)} kg·m/s`],["KE before",`${KE_i.toFixed(1)} J`],["KE after",`${KE_f.toFixed(1)} J`],["KE lost",`${KE_lost.toFixed(1)} J`]],W-172,12);
      tt(g,combined.current?`Combined speed=${vf.toFixed(2)}m/s ✓p conserved | KE lost=${KE_lost.toFixed(0)}J (heat/sound)`:`m₁ approaches m₂ at rest →`,W/2,22,combined.current?C.a:C.d,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m1,m2,v1i,vf,KE_i,KE_f,KE_lost,running]);
  return(
    <div style={card}><div style={tit}>💥 Sim 2 — Perfectly Inelastic Collision (Objects Stick)</div>
    <canvas ref={cvs} width={580} height={200} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="m₁" value={m1} min={1} max={15} onChange={setM1} unit=" kg"/>
      <Sl label="v₁" value={v1i} min={1} max={20} onChange={setV1} unit=" m/s"/>
      <Sl label="m₂ (at rest)" value={m2} min={1} max={15} onChange={setM2} unit=" kg"/>
      <button onClick={()=>{setRunning(r=>!r);runRef.current=!runRef.current;x1Ref.current=100;x2Ref.current=400;combined.current=false;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:running?"#7c3aed":"#1d4ed8",color:"#fff"}}>{running?"↺":"▶ Go"}</button>
    </div>
    <div style={eq}>v_final = m₁v₁/(m₁+m₂) = {vf.toFixed(2)} m/s &nbsp;|&nbsp; p conserved ✓ &nbsp;|&nbsp; KE lost={KE_lost.toFixed(0)}J → heat/sound/deformation</div></div>
  );
}

/* SIM 3: NEWTON'S CRADLE (5 BALLS) */
function NewtonsCradle(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [released,setRel]=useState(1);
  const anglesRef=useRef([0.6,0,0,0,0]);
  const avRef=useRef([0,0,0,0,0]);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    anglesRef.current=Array.from({length:5},(_, i)=>i<released?0.65:0);
    avRef.current=Array.from({length:5},()=>0);
    let raf=0;
    const frame=()=>{
      const L=90, GR=9.8, dt=0.016;
      const angles=anglesRef.current; const avs=avRef.current;
      // Simple pendulum physics for each ball
      for(let i=0;i<5;i++){avs[i]+=(-GR/L)*Math.sin(angles[i])*dt; avs[i]*=0.9998; angles[i]+=avs[i]*dt;}
      // Collision detection (simplified: transfer momentum at bottom)
      for(let i=0;i<4;i++){
        const gap=44;
        if(angles[i]>-0.01&&avs[i]>0&&i<5-released&&avs[i+released]<=0){
          const v=avs[i]; avs[i]=avs[i+released]; avs[i+released]=v;
        }
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      const cx=W/2, anchorY=50;
      // Frame
      rr(g,cx-115,anchorY-10,230,12,3,"#334155","#475569");
      const spacing=44, L_px=90;
      [0,1,2,3,4].forEach(i=>{
        const bx=cx-88+i*spacing;
        g.strokeStyle="#64748b";g.lineWidth=1.5;
        g.beginPath();g.moveTo(bx-5,anchorY);g.lineTo(bx-5+L_px*Math.sin(angles[i]),anchorY+L_px*Math.cos(angles[i]));g.stroke();
        g.beginPath();g.moveTo(bx+5,anchorY);g.lineTo(bx+5+L_px*Math.sin(angles[i]),anchorY+L_px*Math.cos(angles[i]));g.stroke();
        const ballX=bx+L_px*Math.sin(angles[i]), ballY=anchorY+L_px*Math.cos(angles[i]);
        g.fillStyle=i<released?"#1d4ed8":"#334155";g.beginPath();g.arc(ballX,ballY,14,0,Math.PI*2);g.fill();g.strokeStyle=i<released?"#60a5fa":"#475569";g.lineWidth=2;g.stroke();
      });
      tt(g,`${released} ball(s) released — watch ${released} ball(s) swing out the other side!`,W/2,H-14,C.g,11);
      tt(g,"Each collision: momentum transferred ball-by-ball (Newton's 3rd + Conservation of Momentum)",W/2,22,"#64748b",10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[released]);
  return(
    <div style={card}><div style={tit}>🎿 Sim 3 — Newton&apos;s Cradle (5 Balls)</div>
    <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}}/>
    <div style={{marginTop:10}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{color:"#94a3b8",fontSize:11}}>Balls released:</span>
        {[1,2,3,4].map(n=><button key={n} onClick={()=>setRel(n)} style={{padding:"6px 14px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:released===n?"#1d4ed8":"#1e293b",color:released===n?"#fff":"#94a3b8"}}>{n}</button>)}
      </div>
    </div>
    <div style={eq}>Pull n balls → n balls fly out! Momentum is transferred through each ball &nbsp;|&nbsp; p_before = p_after (elastic)</div></div>
  );
}

/* SIM 4: CANNON BALL RECOIL */
function CannonSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mCannon,setMC]=useState(500); const [mBall,setMB]=useState(5); const [vBall,setVB]=useState(200);
  const vCannon=-(mBall*vBall)/mCannon;
  const [fired,setFired]=useState(false); const fRef=useRef(false);
  const bPRef=useRef(0); const cPRef=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    fRef.current=fired; bPRef.current=0; cPRef.current=0;
    let raf=0;
    const frame=()=>{
      if(fRef.current){bPRef.current+=vBall*0.016*0.2; cPRef.current+=vCannon*0.016*2;}
      if(cPRef.current<-80)cPRef.current=-80;
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H-50; g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      // Cannon (moves left)
      const cx=200+cPRef.current;
      rr(g,cx-60,fy-35,100,28,5,"#374151","#64748b");
      rr(g,cx+40,fy-32,50,14,3,"#4b5563","#6b7280"); // barrel
      [cx-40,cx+30].forEach(wx=>{g.fillStyle="#1e293b";g.beginPath();g.arc(wx,fy,14,0,Math.PI*2);g.fill();g.strokeStyle="#374151";g.lineWidth=2;g.stroke();});
      if(fRef.current){dA(g,cx-60,fy-22,cx-100,fy-22,C.r,2.5);tt(g,`← ${Math.abs(vCannon).toFixed(2)}m/s`,cx-105,fy-32,C.r,9,"right");}
      // Cannonball
      const bx=250+bPRef.current;
      if(bx<W+20){g.fillStyle="#64748b";g.beginPath();g.arc(bx,fy-36,10,0,Math.PI*2);g.fill();g.strokeStyle="#94a3b8";g.lineWidth=1.5;g.stroke();}
      if(fRef.current&&bx<W){dA(g,bx+10,fy-36,bx+40,fy-36,C.a,2);tt(g,`${vBall}m/s →`,bx+45,fy-46,C.a,9,"left");}
      // Smoke
      if(fRef.current){for(let i=0;i<6;i++){const sx=cx+60+(i*15),sy=fy-30+Math.sin(i)*5;g.fillStyle=`rgba(100,116,139,${0.4-i*0.06})`;g.beginPath();g.arc(sx,sy,8+i*4,0,Math.PI*2);g.fill();}}
      const pTotal=mBall*vBall+mCannon*vCannon;
      ib(g,[["Ball v",`${vBall} m/s →`],["Cannon v",`${vCannon.toFixed(2)} m/s ←`],["p_ball",`${(mBall*vBall).toFixed(0)} kg·m/s`],["p_cannon",`${(mCannon*vCannon).toFixed(0)} kg·m/s`],["Total p",`${pTotal.toFixed(0)} ≈ 0 ✓`]],W-175,12);
      tt(g,"Cannon recoil: p_before=0, p_ball+p_cannon=0 after firing (conserved!)",W/2,H-14,C.g,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mCannon,mBall,vBall,vCannon,fired]);
  return(
    <div style={card}><div style={tit}>💣 Sim 4 — Cannon Recoil (Momentum Conservation)</div>
    <canvas ref={cvs} width={580} height={200} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Cannon mass" value={mCannon} min={100} max={2000} step={100} onChange={setMC} unit=" kg"/>
      <Sl label="Ball mass" value={mBall} min={1} max={20} onChange={setMB} unit=" kg"/>
      <Sl label="Ball velocity" value={vBall} min={50} max={500} step={25} onChange={setVB} unit=" m/s"/>
      <button onClick={()=>{setFired(f=>!f);fRef.current=!fRef.current;bPRef.current=0;cPRef.current=0;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:fired?"#7c3aed":"#dc2626",color:"#fff"}}>{fired?"↺ Reset":"💥 Fire!"}</button>
    </div>
    <div style={eq}>v_cannon = -m_ball×v_ball/m_cannon = {vCannon.toFixed(2)} m/s &nbsp;|&nbsp; Heavier cannon → less recoil</div></div>
  );
}

/* SIM 5: BULLET EMBEDDING IN BLOCK */
function BulletBlockSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mBullet,setMB]=useState(0.02); const [mBlock,setMBlock]=useState(5); const [vBullet,setVB]=useState(400);
  const vFinal=(mBullet*vBullet)/(mBullet+mBlock);
  const KE_before=0.5*mBullet*vBullet**2, KE_after=0.5*(mBullet+mBlock)*vFinal**2;
  const KE_lost=KE_before-KE_after;
  const [fired,setFired]=useState(false); const fRef=useRef(false);
  const bxRef=useRef(60); const blxRef=useRef(360); const combined=useRef(false); const cxRef=useRef(0); const vel=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    fRef.current=fired; bxRef.current=60; blxRef.current=360; combined.current=false; cxRef.current=0; vel.current=0;
    let raf=0;
    const frame=()=>{
      if(fRef.current){
        if(!combined.current){bxRef.current+=vBullet*0.016*0.3; if(bxRef.current>=blxRef.current-20){combined.current=true; cxRef.current=blxRef.current; vel.current=vFinal;}}
        else{cxRef.current+=vel.current*0.016*5; vel.current*=0.98; if(cxRef.current>W-60)cxRef.current=W-60;}
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H-50; g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      if(!combined.current){
        // Bullet
        g.fillStyle=C.a;g.beginPath();g.ellipse(bxRef.current,fy-20,10,5,0,0,Math.PI*2);g.fill();
        if(fRef.current) dA(g,bxRef.current+10,fy-20,bxRef.current+40,fy-20,C.a,2);
        // Block
        rr(g,blxRef.current-25,fy-45,50,42,4,"#334155","#475569");tt(g,`${mBlock}kg`,blxRef.current,fy-25,C.w,11);
      } else {
        // Combined block with bullet hole
        rr(g,cxRef.current-28,fy-45,56,42,4,"rgba(120,53,15,0.5)","#92400e",2);tt(g,`${(mBullet+mBlock).toFixed(2)}kg`,cxRef.current,fy-25,C.w,11);
        if(vel.current>0.1) dA(g,cxRef.current+28,fy-25,cxRef.current+28+vel.current*5,fy-25,C.g,2);
        tt(g,`v=${vFinal.toFixed(2)}m/s`,cxRef.current,fy+12,C.g,10);
      }
      ib(g,[["Bullet v",`${vBullet} m/s`],["Final v",`${vFinal.toFixed(2)} m/s`],["KE before",`${KE_before.toFixed(0)} J`],["KE lost",`${KE_lost.toFixed(0)} J`],["p conserved","✓"]],W-175,12);
      tt(g,combined.current?`Inelastic! KE lost=${KE_lost.toFixed(0)}J (deformation/heat). But p conserved!`:`Bullet at ${vBullet}m/s approaching block →`,W/2,22,combined.current?C.a:C.d,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mBullet,mBlock,vBullet,vFinal,KE_before,KE_after,KE_lost,fired]);
  return(
    <div style={card}><div style={tit}>🎯 Sim 5 — Bullet Embedding in Block (Inelastic)</div>
    <canvas ref={cvs} width={580} height={200} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Bullet mass" value={mBullet} min={0.01} max={0.2} step={0.01} onChange={setMB} unit=" kg"/>
      <Sl label="Block mass" value={mBlock} min={1} max={20} onChange={setMBlock} unit=" kg"/>
      <Sl label="Bullet speed" value={vBullet} min={100} max={800} step={50} onChange={setVB} unit=" m/s"/>
      <button onClick={()=>{setFired(f=>!f);fRef.current=!fRef.current;bxRef.current=60;blxRef.current=360;combined.current=false;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:fired?"#7c3aed":"#dc2626",color:"#fff"}}>{fired?"↺ Reset":"🔫 Fire!"}</button>
    </div>
    <div style={eq}>v_final = m_bullet×v₀/(m_bullet+m_block) = {vFinal.toFixed(2)} m/s &nbsp;|&nbsp; p conserved, KE NOT conserved (inelastic)</div></div>
  );
}

/* SIM 6: COEFFICIENT OF RESTITUTION COMPARISON */
function CoeffRestitution(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [e,setE]=useState(0.8); const [height,setH]=useState(2.0); const [mass,setM]=useState(0.5);
  const v_impact=Math.sqrt(2*9.8*height); const v_rebound=e*v_impact;
  const h_rebound=v_rebound**2/(2*9.8); const KE_frac=e*e;
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0; let t2=0; const ballX=W/2;
    const frame=()=>{
      t2+=0.016;
      // Simple bounce animation
      const period=2*v_impact/9.8;
      const phase=t2%(period*(1+e+e*e+e**3));
      let ballY;
      const maxH=height*80;
      if(phase<v_impact/9.8*2) ballY=H-60-maxH+9.8*(phase-v_impact/9.8)**2*80/(2*height);
      else ballY=H-60-h_rebound*80+9.8*(phase-v_impact/9.8*2-v_rebound/9.8)**2*80/(2*height);
      if(isNaN(ballY)||ballY>H-60) ballY=H-60;
      g.clearRect(0,0,W,H);bg(g,W,H);
      // Floor
      g.strokeStyle="#334155";g.lineWidth=3;g.beginPath();g.moveTo(0,H-55);g.lineTo(W,H-55);g.stroke();
      // Drop height line
      g.strokeStyle="rgba(148,163,184,0.2)";g.lineWidth=1;g.setLineDash([4,4]);
      g.beginPath();g.moveTo(ballX-40,H-55-height*80);g.lineTo(ballX+40,H-55-height*80);g.stroke();
      tt(g,`H=${height}m`,ballX-50,H-55-height*80+4,"#64748b",9,"right");
      // Rebound height line
      g.strokeStyle="rgba(16,185,129,0.2)";
      g.beginPath();g.moveTo(ballX-40,H-55-h_rebound*80);g.lineTo(ballX+40,H-55-h_rebound*80);g.stroke();g.setLineDash([]);
      tt(g,`h_r=${h_rebound.toFixed(2)}m`,ballX+42,H-55-h_rebound*80+4,C.g,9,"left");
      // Ball
      g.fillStyle=C.b;g.beginPath();g.arc(ballX,Math.max(15,ballY),15,0,Math.PI*2);g.fill();g.strokeStyle="#60a5fa";g.lineWidth=2;g.stroke();
      // Bars: KE before/after
      const barMaxH=80;
      rr(g,W-200,H-55-barMaxH,50,barMaxH,3,"rgba(239,68,68,0.3)",C.r);
      rr(g,W-140,H-55-barMaxH*KE_frac,50,barMaxH*KE_frac,3,"rgba(16,185,129,0.3)",C.g);
      tt(g,"KE_i",W-175,H-40,C.r,10);tt(g,`KE_f\n${(KE_frac*100).toFixed(0)}%`,W-115,H-40,C.g,10);
      ib(g,[["e (COR)",`${e}`],["v_impact",`${v_impact.toFixed(2)} m/s`],["v_rebound",`${v_rebound.toFixed(2)} m/s`],["KE retained",`${(KE_frac*100).toFixed(0)}%`]],12,12);
      tt(g,`e=${e}: ${e===1?"Perfectly elastic (ideal)":e===0?"Perfectly inelastic":e>0.8?"High elasticity":e>0.5?"Medium elasticity":"Low elasticity"}`,W/2,22,e>0.8?C.g:e>0.5?C.a:C.r,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[e,height,mass,v_impact,v_rebound,h_rebound,KE_frac]);
  return(
    <div style={card}><div style={tit}>🎾 Sim 6 — Coefficient of Restitution (Elastic vs Inelastic)</div>
    <canvas ref={cvs} width={580} height={230} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Coefficient of Restitution e" value={e} min={0} max={1.0} step={0.05} onChange={setE}/>
      <Sl label="Drop Height" value={height} min={0.5} max={5.0} step={0.25} onChange={setH} unit=" m"/>
    </div>
    <div style={eq}>e = v_rebound/v_impact = {e} &nbsp;|&nbsp; h_rebound = e²×H = {h_rebound.toFixed(2)}m &nbsp;|&nbsp; KE retained = e² = {(KE_frac*100).toFixed(0)}%</div></div>
  );
}

/* SIM 7: MOMENTUM BAR CHART (Before/After) */
function MomentumBarChart(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m1,setM1]=useState(4); const [m2,setM2]=useState(3); const [v1,setV1]=useState(6); const [v2,setV2]=useState(-2);
  const [eType,setE]=useState<"elastic"|"inelastic">("elastic");
  const p1i=m1*v1, p2i=m2*v2, pTotal_i=p1i+p2i;
  const v1f=eType==="elastic"?((m1-m2)*v1+2*m2*v2)/(m1+m2):pTotal_i/(m1+m2);
  const v2f=eType==="elastic"?((m2-m1)*v2+2*m1*v1)/(m1+m2):pTotal_i/(m1+m2);
  const p1f=m1*v1f, p2f=eType==="elastic"?m2*v2f:m2*(pTotal_i/(m1+m2));
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0;
    const frame=()=>{
      g.clearRect(0,0,W,H);bg(g,W,H);
      const midY=H/2, maxP=Math.max(Math.abs(p1i),Math.abs(p2i),Math.abs(p1f),Math.abs(p2f),Math.abs(pTotal_i),1);
      const scale=70/maxP;
      const drawBar=(label:string,p:number,x:number,col:string)=>{
        const bh=Math.abs(p)*scale; const y=p>=0?midY-bh:midY;
        rr(g,x-18,y,36,bh||2,3,`${col}66`,col,1.5);
        tt(g,label,x,midY+14,C.d,9);tt(g,`${p.toFixed(1)}`,x,p>=0?y-6:y+bh+10,col,9);
      };
      // Before
      tt(g,"BEFORE",W/4,26,C.d,10);tt(g,"AFTER",3*W/4,26,C.d,10);
      tt(g,"Conservation: p_before = p_after",W/2,H-14,C.g,10);
      drawBar("m₁v₁",p1i,W/4-60,C.b);drawBar("m₂v₂",p2i,W/4,C.r);drawBar("Total",pTotal_i,W/4+60,C.a);
      g.strokeStyle="rgba(255,255,255,0.15)";g.lineWidth=1;g.beginPath();g.moveTo(W/2,20);g.lineTo(W/2,H-24);g.stroke();
      if(eType==="elastic"){drawBar("m₁v₁f",p1f,3*W/4-60,C.b);drawBar("m₂v₂f",m2*v2f,3*W/4,C.r);drawBar("Total",p1f+m2*v2f,3*W/4+60,C.a);}
      else{drawBar("Combined p",pTotal_i,3*W/4-30,C.p);drawBar("= Before",pTotal_i,3*W/4+30,C.g);}
      // Zero line
      g.strokeStyle="rgba(255,255,255,0.2)";g.lineWidth=1;g.beginPath();g.moveTo(20,midY);g.lineTo(W-20,midY);g.stroke();tt(g,"0",12,midY+4,C.d,9);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m1,m2,v1,v2,p1i,p2i,p1f,p2f,pTotal_i,eType,v1f,v2f]);
  return(
    <div style={card}><div style={tit}>📊 Sim 7 — Momentum Bar Chart (Before vs After)</div>
    <canvas ref={cvs} width={580} height={250} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:6,marginTop:10,alignItems:"end"}}>
      <Sl label="m₁" value={m1} min={1} max={10} onChange={setM1} unit=" kg"/>
      <Sl label="v₁" value={v1} min={-10} max={10} onChange={setV1} unit=" m/s"/>
      <Sl label="m₂" value={m2} min={1} max={10} onChange={setM2} unit=" kg"/>
      <Sl label="v₂" value={v2} min={-10} max={10} onChange={setV2} unit=" m/s"/>
      <button onClick={()=>setE(e=>e==="elastic"?"inelastic":"elastic")} style={{padding:"8px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:eType==="elastic"?"#1d4ed8":"#7c3aed",color:"#fff"}}>{eType==="elastic"?"Elastic":"Inelastic"}</button>
    </div>
    <div style={eq}>p_total_before = {pTotal_i.toFixed(1)} kg·m/s = p_total_after (always conserved!)</div></div>
  );
}

/* SIM 8: TRAIN COUPLING */
function TrainCouplingSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mMoving,setMM]=useState(5000); const [mStationary,setMS]=useState(3000); const [vInit,setVI]=useState(15);
  const vFinal=mMoving*vInit/(mMoving+mStationary);
  const [coupled,setCoupled]=useState(false); const cRef=useRef(false);
  const t1Ref=useRef(60); const t2Ref=useRef(420); const coupleX=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    cRef.current=coupled; t1Ref.current=60; t2Ref.current=420; coupleX.current=0;
    let raf=0; let vel=coupled?vInit:0; let isCoupled=false;
    const frame=()=>{
      if(cRef.current){
        if(!isCoupled){t1Ref.current+=vel*0.016*5; if(t1Ref.current>=t2Ref.current-60){isCoupled=true; coupleX.current=t2Ref.current-30; vel=vFinal;}}
        else{coupleX.current+=vel*0.016*5; if(coupleX.current>W-80)coupleX.current=W-80;}
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H-45; const trackColor="#334155";
      g.strokeStyle=trackColor;g.lineWidth=3;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      // Rail ties
      g.strokeStyle="#1e293b";g.lineWidth=4;for(let x=0;x<W;x+=25){g.beginPath();g.moveTo(x,fy-4);g.lineTo(x,fy+8);g.stroke();}
      const drawTrain=(x:number,m:number,col:string,label:string)=>{
        rr(g,x-60,fy-35,120,30,5,`${col}55`,col,2);rr(g,x-40,fy-55,80,23,4,`${col}44`,col);
        [x-40,x+30].forEach(wx=>{g.fillStyle="#1e293b";g.beginPath();g.arc(wx,fy,12,0,Math.PI*2);g.fill();g.strokeStyle="#374151";g.lineWidth=2;g.stroke();});
        tt(g,label,x,fy-42,C.w,10);tt(g,`${(m/1000).toFixed(1)}t`,x,fy-22,C.d,9);
      };
      if(!isCoupled){
        drawTrain(t1Ref.current,mMoving,C.b,"Moving train");
        drawTrain(t2Ref.current,mStationary,"#64748b","Stationary");
        if(cRef.current) dA(g,t1Ref.current+60,fy-22,t1Ref.current+90,fy-22,C.b,2.5);
      } else {
        drawTrain(coupleX.current,mMoving+mStationary,C.a,"Coupled trains");
        dA(g,coupleX.current+60,fy-22,coupleX.current+90,fy-22,C.a,2);
        tt(g,`v=${vFinal.toFixed(2)}m/s`,coupleX.current,fy-70,C.a,10);
      }
      ib(g,[["v_before",`${vInit} m/s`],["v_after",`${vFinal.toFixed(2)} m/s`],["p_before",`${(mMoving*vInit).toFixed(0)}`],["p_after",`${((mMoving+mStationary)*vFinal).toFixed(0)}`],["KE ratio",`${(100*vFinal/vInit*(mMoving/(mMoving+mStationary))).toFixed(0)}%`]],W-175,12);
      tt(g,isCoupled?"✅ Coupled! Momentum conserved, but KE lost (perfectly inelastic)":"Moving train approaches stationary →",W/2,22,isCoupled?C.g:C.d,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mMoving,mStationary,vInit,vFinal,coupled]);
  return(
    <div style={card}><div style={tit}>🚂 Sim 8 — Train Coupling (Inelastic Collision)</div>
    <canvas ref={cvs} width={580} height={200} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Moving train" value={mMoving} min={1000} max={20000} step={1000} onChange={setMM} unit=" kg"/>
      <Sl label="Stationary" value={mStationary} min={1000} max={20000} step={1000} onChange={setMS} unit=" kg"/>
      <Sl label="Initial speed" value={vInit} min={5} max={40} step={5} onChange={setVI} unit=" m/s"/>
      <button onClick={()=>{setCoupled(c=>!c);cRef.current=!cRef.current;t1Ref.current=60;t2Ref.current=420;coupleX.current=0;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:coupled?"#7c3aed":"#1d4ed8",color:"#fff"}}>{coupled?"↺ Reset":"🚂 Move!"}</button>
    </div>
    <div style={eq}>v_final = m₁v₁/(m₁+m₂) = {vFinal.toFixed(2)} m/s &nbsp;|&nbsp; p_before = m₁v₁ = {(mMoving*vInit).toFixed(0)} kg·m/s = p_after ✓</div></div>
  );
}

/* SIM 9: EQUAL MASS HEAD-ON (COMPLETE EXCHANGE) */
function EqualMassHeadOnSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mass,setMass]=useState(3); const [v1,setV1]=useState(8); const [v2,setV2]=useState(-6);
  const v1f=(mass-mass)*v1/(2*mass)+2*mass*v2/(2*mass); // = v2
  const v2f=2*mass*v1/(2*mass)+(mass-mass)*v2/(2*mass); // = v1
  const [running,setRunning]=useState(false); const runRef=useRef(false);
  const x1Ref=useRef(100); const x2Ref=useRef(480); const vv1=useRef(0); const vv2=useRef(0); const coll=useRef(false);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    runRef.current=running; x1Ref.current=100; x2Ref.current=480; vv1.current=running?v1:0; vv2.current=running?v2:0; coll.current=false;
    let raf=0;
    const frame=()=>{
      if(runRef.current){
        x1Ref.current+=vv1.current*0.016*12; x2Ref.current+=vv2.current*0.016*12;
        if(!coll.current&&Math.abs(x1Ref.current-x2Ref.current)<32){coll.current=true; const t=vv1.current; vv1.current=vv2.current; vv2.current=t;}
        if(x1Ref.current<20){x1Ref.current=20;vv1.current=Math.abs(vv1.current);}
        if(x2Ref.current>W-20){x2Ref.current=W-20;vv2.current=-Math.abs(vv2.current);}
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H/2;
      g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy+16);g.lineTo(W,fy+16);g.stroke();
      [[x1Ref.current,"#1d4ed8","#60a5fa",vv1.current],[x2Ref.current,"#92400e","#f59e0b",vv2.current]].forEach(([x,f,s,v],i)=>{
        g.fillStyle=f as string;g.beginPath();g.arc(Number(x),fy,16,0,Math.PI*2);g.fill();g.strokeStyle=s as string;g.lineWidth=2;g.stroke();
        tt(g,`m=${mass}kg`,Number(x),fy+30,C.d,9);
        if(Math.abs(Number(v))>0.3) dA(g,Number(x),fy,Number(x)+Number(v)*5,fy,(i===0?C.b:C.a) as string,2);
        tt(g,`${(Number(v)).toFixed(1)}m/s`,Number(x),fy-28,i===0?C.b:C.a,10);
      });
      tt(g,coll.current?"✅ EQUAL MASS: velocities completely EXCHANGED after collision!":`v₁=${v1}m/s ← → v₂=${v2}m/s head-on`,W/2,22,coll.current?C.g:C.d,11);
      ib(g,[["v₁ after",`${v2f.toFixed(1)} m/s`],["v₂ after",`${v1f.toFixed(1)} m/s`],["Observation","Velocities swap!"],["Both p & KE","conserved ✓"]],W-175,40);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mass,v1,v2,running]);
  return(
    <div style={card}><div style={tit}>🔄 Sim 9 — Equal Mass Head-On: Velocity Exchange</div>
    <canvas ref={cvs} width={580} height={200} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
      <Sl label="Equal mass" value={mass} min={1} max={10} onChange={setMass} unit=" kg"/>
      <Sl label="v₁ →" value={v1} min={1} max={15} onChange={setV1} unit=" m/s"/>
      <Sl label="v₂ ←" value={v2} min={-15} max={-1} onChange={setV2} unit=" m/s"/>
      <button onClick={()=>{setRunning(r=>!r);runRef.current=!runRef.current;x1Ref.current=100;x2Ref.current=480;coll.current=false;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:running?"#7c3aed":"#1d4ed8",color:"#fff"}}>{running?"↺":"▶ Go"}</button>
    </div>
    <div style={eq}>Equal masses in elastic collision: velocities completely exchange! v₁_after = v₂_before, v₂_after = v₁_before</div></div>
  );
}

/* SIM 10: PENDULUM BALL HITS BLOCK */
function PendulumHitsSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mBall,setMB]=useState(1); const [mBlock,setMBlock]=useState(3); const [angle,setAngle]=useState(0.7);
  const GR=9.8; const L=100;
  const angRef=useRef(angle); const avRef=useRef(0); const blockX=useRef(0); const blockV=useRef(0); const hit=useRef(false);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    angRef.current=angle; avRef.current=0; blockX.current=0; blockV.current=0; hit.current=false;
    let raf=0;
    const frame=()=>{
      avRef.current+=(-GR/L*100)*Math.sin(angRef.current)*0.016; avRef.current*=0.998; angRef.current+=avRef.current*0.016;
      const anchorX=W/2-80, anchorY=50;
      const ballX=anchorX+L*Math.sin(angRef.current), ballY=anchorY+L*Math.cos(angRef.current);
      const blockRest=W/2-40;
      if(!hit.current&&ballX>=blockRest-16&&avRef.current>0){
        hit.current=true;
        const vBall=avRef.current*L;
        const vBallAfter=((mBall-mBlock)*vBall)/(mBall+mBlock);
        const vBlockAfter=(2*mBall*vBall)/(mBall+mBlock);
        avRef.current=vBallAfter/L; blockV.current=vBlockAfter;
      }
      if(hit.current){blockX.current+=blockV.current*0.016*0.8; blockV.current*=0.98;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H-50; g.strokeStyle="#334155";g.lineWidth=2;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      rr(g,anchorX-40,anchorY-8,80,10,3,"#334155","#475569");
      g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(anchorX,anchorY);g.lineTo(ballX,ballY);g.stroke();
      g.fillStyle=C.b;g.beginPath();g.arc(ballX,ballY,14,0,Math.PI*2);g.fill();g.strokeStyle="#60a5fa";g.lineWidth=2;g.stroke();
      tt(g,`m₁=${mBall}kg`,ballX,ballY+24,C.b,9);
      const bx=blockRest+blockX.current;
      rr(g,bx-22,fy-42,44,38,4,"#334155","#64748b");tt(g,`m₂=${mBlock}kg`,bx,fy-24,C.w,10);
      if(blockV.current>0.5) dA(g,bx+22,fy-24,bx+22+blockV.current*0.5,fy-24,C.a,2);
      ib(g,[["Ball v_impact",`${(angle*Math.sqrt(2*GR*L*(1-Math.cos(angle)))).toFixed(1)} m/s`],["Block v",`${(blockV.current*0.6).toFixed(2)} m/s`],["p conserved","✓"]],W-172,12);
      tt(g,hit.current?`Ball bounces, block moves → p conserved!`:`Pendulum swings → hits block at maximum speed`,W/2,22,hit.current?C.g:C.d,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mBall,mBlock,angle,GR,L]);
  return(
    <div style={card}><div style={tit}>🏏 Sim 10 — Pendulum Hits Block (Momentum Transfer)</div>
    <canvas ref={cvs} width={580} height={230} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Ball mass m₁" value={mBall} min={0.5} max={5} step={0.5} onChange={setMB} unit=" kg"/>
      <Sl label="Block mass m₂" value={mBlock} min={1} max={15} onChange={setMBlock} unit=" kg"/>
      <Sl label="Release angle" value={angle} min={0.2} max={1.2} step={0.1} onChange={setAngle} unit=" rad"/>
    </div>
    <div style={eq}>v_block = 2m₁/(m₁+m₂)×v_impact &nbsp;|&nbsp; Smaller block → gets more velocity (a=F/m)</div></div>
  );
}

/* SIM 11: BALLISTIC PENDULUM */
function BallisticPendulumSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [mBullet,setMB]=useState(0.05); const [mBlock,setMBlock]=useState(2); const [vBullet,setVB]=useState(300);
  const vFinal=mBullet*vBullet/(mBullet+mBlock);
  const heightReached=vFinal*vFinal/(2*9.8);
  const L=110; const theta=Math.min(Math.acos(1-heightReached/L),1.4);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0; let t2=0; let shot=false; let blockAngle=0; let blockAv=0;
    const frame=()=>{
      t2+=0.016;
      if(t2>1.0&&!shot){shot=true; blockAv=vFinal/L;}
      if(shot){blockAv+=(-9.8/L)*Math.sin(blockAngle)*0.016; blockAv*=0.999; blockAngle+=blockAv*0.016;}
      g.clearRect(0,0,W,H);bg(g,W,H);
      const anchorX=W/2+50, anchorY=40;
      const blockX=anchorX+L*Math.sin(blockAngle), blockY=anchorY+L*Math.cos(blockAngle);
      g.strokeStyle="#475569";g.lineWidth=4;g.beginPath();g.moveTo(anchorX-60,anchorY-8);g.lineTo(anchorX+60,anchorY-8);g.stroke();
      g.strokeStyle="#94a3b8";g.lineWidth=2;g.beginPath();g.moveTo(anchorX,anchorY);g.lineTo(blockX,blockY);g.stroke();
      rr(g,blockX-20,blockY-16,40,30,4,"#334155","#64748b",2);tt(g,`${mBlock}kg`,blockX,blockY-2,C.w,10);
      // Bullet path
      if(!shot){const bx=80+t2*vBullet*0.2; if(bx<blockX){g.fillStyle=C.a;g.beginPath();g.ellipse(bx,blockY+6,10,5,0,0,Math.PI*2);g.fill();}}
      // Height indicator
      const maxH=(1-Math.cos(theta))*L;
      if(blockAngle>0.05){
        g.strokeStyle="rgba(16,185,129,0.3)";g.lineWidth=1;g.setLineDash([3,3]);
        g.beginPath();g.moveTo(anchorX,anchorY+L-maxH);g.lineTo(anchorX+L+30,anchorY+L-maxH);g.stroke();g.setLineDash([]);
        tt(g,`H=${heightReached.toFixed(3)}m`,anchorX+L+35,anchorY+L-maxH+4,C.g,9,"left");
      }
      ib(g,[["Bullet v (unknown)",`${vBullet} m/s`],["Block+Bullet v",`${vFinal.toFixed(2)} m/s`],["Height H",`${heightReached.toFixed(3)} m`],["Bullet speed",`Found via H!`]],W-175,12);
      tt(g,"Ballistic pendulum: measure height → find bullet speed via momentum conservation!",W/2,H-14,"#64748b",10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[mBullet,mBlock,vBullet,vFinal,heightReached,theta]);
  return(
    <div style={card}><div style={tit}>🎯 Sim 11 — Ballistic Pendulum (Find Bullet Speed from Height)</div>
    <canvas ref={cvs} width={580} height={230} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10}}>
      <Sl label="Bullet mass" value={mBullet} min={0.01} max={0.2} step={0.01} onChange={setMB} unit=" kg"/>
      <Sl label="Block mass" value={mBlock} min={0.5} max={10} step={0.5} onChange={setMBlock} unit=" kg"/>
      <Sl label="Bullet speed" value={vBullet} min={50} max={600} step={25} onChange={setVB} unit=" m/s"/>
    </div>
    <div style={eq}>v_bullet = (m_bullet+m_block)×√(2gH)/m_bullet &nbsp;|&nbsp; H = {heightReached.toFixed(3)} m &nbsp;|&nbsp; Classic forensics technique!</div></div>
  );
}

/* SIM 12: 2D COLLISION */
function TwoDCollisionSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m1,setM1]=useState(3); const [m2,setM2]=useState(2); const [v1,setV1]=useState(8); const [deflect,setDefl]=useState(30);
  const θ=deflect*Math.PI/180;
  const v1f=((m1-m2)*v1)/(m1+m2); const v2f=(2*m1*v1)/(m1+m2);
  const [running,setRunning]=useState(false); const runRef=useRef(false);
  const x1Ref=useRef(80); const y1Ref=useRef(0); const x2Ref=useRef(450); const y2Ref=useRef(0);
  const v1xRef=useRef(0); const v1yRef=useRef(0); const v2xRef=useRef(0); const v2yRef=useRef(0);
  const coll=useRef(false);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    runRef.current=running; x1Ref.current=80; y1Ref.current=H/2; x2Ref.current=400; y2Ref.current=H/2;
    v1xRef.current=running?v1:0; v1yRef.current=0; v2xRef.current=0; v2yRef.current=0; coll.current=false;
    let raf=0;
    const frame=()=>{
      if(runRef.current){
        x1Ref.current+=v1xRef.current*0.016*10; y1Ref.current+=v1yRef.current*0.016*10;
        x2Ref.current+=v2xRef.current*0.016*10; y2Ref.current+=v2yRef.current*0.016*10;
        const dx=x2Ref.current-x1Ref.current, dy=y2Ref.current-y1Ref.current;
        if(!coll.current&&Math.sqrt(dx*dx+dy*dy)<32){
          coll.current=true;
          v1xRef.current=v1f*Math.cos(θ); v1yRef.current=-v1f*Math.sin(θ);
          v2xRef.current=v2f*Math.cos(-θ+0.1); v2yRef.current=v2f*Math.sin(-θ+0.1);
        }
        if(x1Ref.current>W||x1Ref.current<0||y1Ref.current>H||y1Ref.current<0)x1Ref.current=-100;
        if(x2Ref.current>W||x2Ref.current<0)x2Ref.current=W+100;
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      [[x1Ref.current,y1Ref.current,m1,C.b,"#60a5fa",v1xRef.current,v1yRef.current],[x2Ref.current,y2Ref.current,m2,C.r,"#f87171",v2xRef.current,v2yRef.current]].forEach(([x,y,m,f,s,vx,vy])=>{
        if(Number(x)<-50||Number(x)>W+50)return;
        g.fillStyle=f as string;g.beginPath();g.arc(Number(x),Number(y),14,0,Math.PI*2);g.fill();g.strokeStyle=s as string;g.lineWidth=2;g.stroke();
        const spd=Math.sqrt(Number(vx)**2+Number(vy)**2);
        if(spd>0.2) dA(g,Number(x),Number(y),Number(x)+Number(vx)*5,Number(y)+Number(vy)*5,f as string,2);
        tt(g,`${m}kg`,Number(x),Number(y)+28,C.d,9);
      });
      ib(g,[["p_x total",`${(m1*v1xRef.current+m2*v2xRef.current).toFixed(1)}`],["p_y total",`${(m1*v1yRef.current+m2*v2yRef.current).toFixed(1)}`],["Both conserved","✓"]],W-172,12);
      tt(g,coll.current?"2D Elastic: p_x & p_y both conserved!":`2D Collision — deflection angle: ${deflect}°`,W/2,22,coll.current?C.g:C.d,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m1,m2,v1,deflect,θ,v1f,v2f,running]);
  return(
    <div style={card}><div style={tit}>🔀 Sim 12 — 2D Collision (Vector Momentum Conservation)</div>
    <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:6,marginTop:10,alignItems:"end"}}>
      <Sl label="m₁" value={m1} min={1} max={10} onChange={setM1} unit=" kg"/>
      <Sl label="m₂" value={m2} min={1} max={10} onChange={setM2} unit=" kg"/>
      <Sl label="v₁" value={v1} min={2} max={15} onChange={setV1} unit=" m/s"/>
      <Sl label="Deflect angle" value={deflect} min={10} max={80} onChange={setDefl} unit="°"/>
      <button onClick={()=>{setRunning(r=>!r);runRef.current=!runRef.current;x1Ref.current=80;y1Ref.current=0;x2Ref.current=400;y2Ref.current=0;coll.current=false;}} style={{padding:"8px",borderRadius:8,fontSize:11,fontWeight:700,cursor:"pointer",border:"none",background:running?"#7c3aed":"#1d4ed8",color:"#fff"}}>{running?"↺":"▶ Go"}</button>
    </div>
    <div style={eq}>In 2D: p_x_before = p_x_after AND p_y_before = p_y_after &nbsp;|&nbsp; Both components conserved separately!</div></div>
  );
}

/* SIM 13: MOMENTUM CHAIN (SUPERBALL) */
function MomentumChainSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [dropped,setDropped]=useState(false); const dRef=useRef(false);
  const bigY=useRef(30); const bigV=useRef(0); const smallY=useRef(10); const smallV=useRef(0);
  const bouncedBig=useRef(false); const bouncedSmall=useRef(false);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    dRef.current=dropped; bigY.current=60; bigV.current=0; smallY.current=30; smallV.current=0; bouncedBig.current=false; bouncedSmall.current=false;
    let raf=0;
    const frame=()=>{
      if(dRef.current){
        bigV.current+=9.8*0.016; bigY.current+=bigV.current*0.016*8;
        smallV.current+=9.8*0.016; smallY.current=bigY.current-35;
        const floorY=H-50;
        if(!bouncedBig.current&&bigY.current>=floorY-22){
          bouncedBig.current=true; bigV.current=-Math.abs(bigV.current);
          // Transfer momentum to small ball
          const vImpact=Math.abs(bigV.current);
          const vSmall=(3*vImpact); // approx 3× for tennis-on-basketball
          smallV.current=-vSmall;
        }
        if(bouncedBig.current) smallY.current+=smallV.current*0.016*8;
        smallV.current+=9.8*0.016*(bouncedBig.current?1:1);
        bigY.current=Math.min(bigY.current,floorY-22);
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      const fy=H-50; g.strokeStyle="#334155";g.lineWidth=3;g.beginPath();g.moveTo(0,fy);g.lineTo(W,fy);g.stroke();
      const cx=W/2;
      // Big ball (basketball)
      g.fillStyle="#f97316";g.beginPath();g.arc(cx,bigY.current,22,0,Math.PI*2);g.fill();g.strokeStyle="#ea580c";g.lineWidth=2;g.stroke();tt(g,"Basketball",cx,bigY.current+36,C.o,9);tt(g,"m=1kg",cx,bigY.current+46,C.d,8);
      // Small ball
      const sy=Math.min(smallY.current,bigY.current-35);
      g.fillStyle="#10b981";g.beginPath();g.arc(cx,sy,11,0,Math.PI*2);g.fill();g.strokeStyle="#059669";g.lineWidth=2;g.stroke();tt(g,"Tennis",cx,sy-18,C.g,9);tt(g,"m=0.06kg",cx,sy-28,C.d,8);
      if(bouncedBig.current&&smallV.current<-0.5){
        const vShow=Math.abs(smallV.current*0.15);
        dA(g,cx+15,sy,cx+15,sy-30,C.g,2.5);tt(g,`↑ ~${vShow.toFixed(0)}×faster!`,cx+20,sy-18,C.g,9,"left");
      }
      ib(g,[["Mechanism","Momentum chain"],["Big → floor","bounces up"],["Small on big","gets ~3× v"],["Demo","Superball trick!"]],W-175,12);
      tt(g,"Stack: tennis ball on basketball! Tennis ball shoots up to ~9× the drop height!",W/2,22,"#64748b",10);
      tt(g,"Momentum transfers through the chain — energy amplification!",W/2,H-14,C.g,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[dropped]);
  return(
    <div style={card}><div style={tit}>⚡ Sim 13 — Superball Stack: Momentum Chain</div>
    <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}}/>
    <div style={{marginTop:10,display:"flex",gap:10}}>
      <button onClick={()=>{setDropped(d=>!d);dRef.current=!dRef.current;bigY.current=60;smallY.current=30;bigV.current=0;smallV.current=0;bouncedBig.current=false;bouncedSmall.current=false;}} style={{padding:"8px 24px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:dropped?"#7c3aed":"#16a34a",color:"#fff"}}>{dropped?"↺ Reset":"⬇️ Drop Stack!"}</button>
    </div>
    <div style={eq}>p transferred through chain: small ball gets large velocity from large ball&apos;s momentum &nbsp;|&nbsp; Real demo: Jokari, Superball!</div></div>
  );
}

/* SIM 14: ROCKET FUEL MOMENTUM */
function RocketMomentumSim(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [exhaustV,setEV]=useState(3000); const [burnRate,setBR]=useState(10);
  const [running,setRunning]=useState(false); const runRef=useRef(false);
  const massRef=useRef(1000); const velRef=useRef(0); const posRef=useRef(0);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    runRef.current=running; massRef.current=1000; velRef.current=0; posRef.current=0;
    let raf=0;
    const frame=(T:number)=>{
      if(runRef.current&&massRef.current>100){
        const dm=burnRate*0.016;
        const dv=exhaustV*(dm/massRef.current);
        massRef.current-=dm; velRef.current+=dv; posRef.current+=velRef.current*0.016*0.05;
        if(posRef.current>H-70)posRef.current=H-70;
      }
      g.clearRect(0,0,W,H);bg(g,W,H);
      for(let i=0;i<20;i++){const sy=((i*37+posRef.current*0.4)%H);g.fillStyle=`rgba(255,255,255,${0.2+((i*7)%5)/20})`;g.beginPath();g.arc((i*67)%W,sy,1,0,Math.PI*2);g.fill();}
      const ry=H-90-posRef.current;
      g.fillStyle="#1e3a5f";g.beginPath();g.moveTo(W/2-14,ry+50);g.lineTo(W/2+14,ry+50);g.lineTo(W/2+14,ry+8);g.lineTo(W/2,ry);g.lineTo(W/2-14,ry+8);g.closePath();g.fill();g.strokeStyle=C.b;g.lineWidth=2;g.stroke();
      if(runRef.current&&massRef.current>100){
        for(let i=0;i<15;i++){const fx=W/2+(-12+Math.random()*24),fy=ry+55+Math.random()*30;g.fillStyle=i<8?"#f59e0b":i<12?"#ef4444":"#9ca3af";g.beginPath();g.arc(fx,fy,2+Math.random()*4,0,Math.PI*2);g.fill();}
      }
      // Momentum bar
      const p_exhaust_rate=burnRate*exhaustV;
      const Thrust=p_exhaust_rate;
      tt(g,`Tsiolkovsky Equation: Δv = v_e × ln(m₀/m_f)`,W/2,22,C.a,11);
      ib(g,[["Mass",`${massRef.current.toFixed(0)} kg`],["Velocity",`${velRef.current.toFixed(0)} m/s`],["Thrust",`${Thrust.toFixed(0)} N`],["Δv so far",`${velRef.current.toFixed(0)} m/s`],["Fuel %",`${((1000-massRef.current)/9).toFixed(0)}%`]],W-175,40);
      tt(g,"As fuel burns: m↓ → same thrust → greater acceleration (why rockets accelerate faster!)",W/2,H-14,"#64748b",10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[exhaustV,burnRate,running]);
  return(
    <div style={card}><div style={tit}>🚀 Sim 14 — Rocket: Momentum Conservation (Tsiolkovsky)</div>
    <canvas ref={cvs} width={580} height={260} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
      <Sl label="Exhaust Velocity" value={exhaustV} min={500} max={5000} step={250} onChange={setEV} unit=" m/s"/>
      <Sl label="Burn Rate" value={burnRate} min={2} max={50} step={2} onChange={setBR} unit=" kg/s"/>
      <button onClick={()=>{setRunning(r=>!r);runRef.current=!runRef.current;massRef.current=1000;velRef.current=0;posRef.current=0;}} style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:running?"#dc2626":"#16a34a",color:"#fff"}}>{running?"🛑 Reset":"🚀 Ignite!"}</button>
    </div>
    <div style={eq}>Thrust = ṁ × v_exhaust = {burnRate*exhaustV} N &nbsp;|&nbsp; Δv = v_e × ln(m₀/m_f) — Tsiolkovsky rocket equation</div></div>
  );
}

/* SIM 15: INTERACTIVE MOMENTUM CONSERVATION LAB */
function MomentumConservationLab(){
  const cvs=useRef<HTMLCanvasElement>(null);
  const [m1,setM1]=useState(4); const [v1,setV1]=useState(8); const [m2,setM2]=useState(6); const [v2,setV2]=useState(-3);
  const [collType,setType]=useState<"elastic"|"inelastic"|"partial">("elastic");
  const p_before=m1*v1+m2*v2;
  let v1f=0, v2f=0;
  if(collType==="elastic"){v1f=((m1-m2)*v1+2*m2*v2)/(m1+m2); v2f=((m2-m1)*v2+2*m1*v1)/(m1+m2);}
  else if(collType==="inelastic"){const vf=p_before/(m1+m2); v1f=vf; v2f=vf;}
  else{const e=0.5; v1f=((m1-m2)*v1+2*m2*v2)/(m1+m2)*0.5; v2f=((m2-m1)*v2+2*m1*v1)/(m1+m2)*0.8;}
  const p_after=m1*v1f+m2*v2f;
  const KE_before=0.5*(m1*v1**2+m2*v2**2); const KE_after=0.5*(m1*v1f**2+m2*v2f**2);
  useEffect(()=>{
    const c=cvs.current;if(!c)return; const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0;
    const frame=()=>{
      g.clearRect(0,0,W,H);bg(g,W,H);
      const cy=H/2;
      // Before column
      const bx=W/4;
      tt(g,"BEFORE",bx,20,C.d,11);
      g.fillStyle="#1d4ed8";g.beginPath();g.arc(bx-30,cy,Math.sqrt(m1)*8,0,Math.PI*2);g.fill();
      g.fillStyle="#dc2626";g.beginPath();g.arc(bx+30,cy,Math.sqrt(m2)*8,0,Math.PI*2);g.fill();
      tt(g,`m₁=${m1}kg`,bx-30,cy+32,C.b,9);tt(g,`m₂=${m2}kg`,bx+30,cy+32,C.r,9);
      if(v1>0) dA(g,bx-30,cy,bx-30+v1*5,cy,C.b,2);
      if(v2<0) dA(g,bx+30,cy,bx+30+v2*5,cy,C.r,2);
      tt(g,`p = ${p_before.toFixed(1)} kg·m/s`,bx,cy+50,C.a,10);
      // Divider
      g.strokeStyle="rgba(255,255,255,0.1)";g.lineWidth=1;g.beginPath();g.moveTo(W/2,20);g.lineTo(W/2,H-20);g.stroke();tt(g,"→",W/2,cy,C.w,16);
      // After column
      const ax=3*W/4;
      tt(g,"AFTER",ax,20,C.d,11);
      if(collType==="inelastic"){
        const rCombined=Math.sqrt((m1+m2))*5;
        g.fillStyle="#7c3aed";g.beginPath();g.arc(ax,cy,rCombined,0,Math.PI*2);g.fill();g.strokeStyle="#a78bfa";g.lineWidth=2;g.stroke();
        tt(g,`${m1+m2}kg (stuck)`,ax,cy+rCombined+12,C.p,9);
        if(Math.abs(v1f)>0.1) dA(g,ax+rCombined,cy,ax+rCombined+v1f*5,cy,C.a,2);
      } else {
        g.fillStyle="#1d4ed8";g.beginPath();g.arc(ax-30,cy,Math.sqrt(m1)*8,0,Math.PI*2);g.fill();
        g.fillStyle="#dc2626";g.beginPath();g.arc(ax+30,cy,Math.sqrt(m2)*8,0,Math.PI*2);g.fill();
        if(Math.abs(v1f)>0.1) dA(g,ax-30,cy,ax-30+v1f*5,cy,C.b,2);
        if(Math.abs(v2f)>0.1) dA(g,ax+30,cy,ax+30+v2f*5,cy,C.r,2);
        tt(g,`v₁=${v1f.toFixed(1)}`,ax-30,cy+32,C.b,9);tt(g,`v₂=${v2f.toFixed(1)}`,ax+30,cy+32,C.r,9);
      }
      tt(g,`p = ${p_after.toFixed(1)} kg·m/s`,ax,cy+50,C.g,10);
      const pConserved=Math.abs(p_before-p_after)<0.1;
      tt(g,pConserved?"✅ Momentum ALWAYS conserved! p_before = p_after":"⚠️ Check values",W/2,H-14,C.g,11);
      ib(g,[["p before",`${p_before.toFixed(1)} kg·m/s`],["p after",`${p_after.toFixed(1)} kg·m/s`],["KE before",`${KE_before.toFixed(1)} J`],["KE after",`${KE_after.toFixed(1)} J`],["KE change",`${(KE_after-KE_before).toFixed(1)} J`]],W-175,12);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[m1,v1,m2,v2,collType,p_before,p_after,KE_before,KE_after,v1f,v2f]);
  return(
    <div style={card}><div style={tit}>🔬 Sim 15 — Momentum Conservation Laboratory</div>
    <canvas ref={cvs} width={580} height={230} style={{width:"100%",borderRadius:8}}/>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gap:6,marginTop:10,alignItems:"end"}}>
      <Sl label="m₁" value={m1} min={1} max={15} onChange={setM1} unit=" kg"/>
      <Sl label="v₁" value={v1} min={-10} max={15} onChange={setV1} unit=" m/s"/>
      <Sl label="m₂" value={m2} min={1} max={15} onChange={setM2} unit=" kg"/>
      <Sl label="v₂" value={v2} min={-15} max={10} onChange={setV2} unit=" m/s"/>
      <div><span style={{color:"#94a3b8",fontSize:10}}>Collision type</span><div style={{display:"flex",gap:3,marginTop:3}}>{(["elastic","inelastic","partial"] as const).map(t=><button key={t} onClick={()=>setType(t)} style={{flex:1,padding:"5px 2px",borderRadius:5,fontSize:9,fontWeight:700,cursor:"pointer",border:"none",background:collType===t?"#1d4ed8":"#1e293b",color:collType===t?"#fff":"#94a3b8"}}>{t.slice(0,4)}</button>)}</div></div>
    </div>
    <div style={eq}>Law of Conservation of Momentum: p_before = p_after (ALWAYS, for any collision type!) &nbsp;|&nbsp; p = {p_before.toFixed(1)} kg·m/s</div></div>
  );
}

export function AdvancedTopic5Sims(){
  return(
    <div style={{marginTop:24}}>
      <div style={{background:"linear-gradient(90deg,rgba(6,182,212,0.15),transparent)",borderLeft:"3px solid #06b6d4",padding:"10px 16px",marginBottom:20,borderRadius:"0 8px 8px 0"}}>
        <div style={{color:"#e2e8f0",fontWeight:700,fontSize:15}}>⚡ Advanced Simulations — Conservation of Momentum</div>
        <div style={{color:"#64748b",fontSize:12,marginTop:2}}>15 interactive simulations exploring momentum conservation in all collision types</div>
      </div>
      <ElasticCollision/><InelasticCollision/><NewtonsCradle/><CannonSim/><BulletBlockSim/>
      <CoeffRestitution/><MomentumBarChart/><TrainCouplingSim/><EqualMassHeadOnSim/><PendulumHitsSim/>
      <BallisticPendulumSim/><TwoDCollisionSim/><MomentumChainSim/><RocketMomentumSim/><MomentumConservationLab/>
    </div>
  );
}
