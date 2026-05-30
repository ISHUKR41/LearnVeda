"use client";
/**
 * FILE: AdvancedSim2.tsx
 * LOCATION: src/components/physics/AdvancedSim2.tsx
 * PURPOSE: 15 professional canvas-based physics simulations for
 *          Topic 2: Newton's First Law of Motion & Inertia (Class 9 Science).
 * EXPORTS: AdvancedTopic2Sims
 * LAST UPDATED: 2026-05-30
 */

import React, { useState, useEffect, useRef } from "react";

/* ── Shared helpers (identical pattern to AdvancedSim1) ── */
function drawArrow(g: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, color: string, lw = 2.5) {
  const dx = x2-x1, dy = y2-y1, len = Math.sqrt(dx*dx+dy*dy);
  if (len < 4) return;
  const a = Math.atan2(dy, dx), hs = Math.min(10, len*0.35);
  g.save(); g.strokeStyle = color; g.fillStyle = color; g.lineWidth = lw; g.lineCap = "round";
  g.beginPath(); g.moveTo(x1,y1); g.lineTo(x2-hs*0.8*Math.cos(a), y2-hs*0.8*Math.sin(a)); g.stroke();
  g.beginPath(); g.moveTo(x2,y2); g.lineTo(x2-hs*Math.cos(a-0.42), y2-hs*Math.sin(a-0.42)); g.lineTo(x2-hs*Math.cos(a+0.42), y2-hs*Math.sin(a+0.42)); g.closePath(); g.fill(); g.restore();
}
function txt(g: CanvasRenderingContext2D, s: string, x: number, y: number, c="#e2e8f0", sz=11, align: CanvasTextAlign="center") {
  g.save(); g.font=`bold ${sz}px 'Inter',sans-serif`; g.fillStyle=c; g.textAlign=align; g.fillText(s,x,y); g.restore();
}
function bg(g: CanvasRenderingContext2D, w: number, h: number) {
  const gr = g.createLinearGradient(0,0,w,h); gr.addColorStop(0,"#0d1117"); gr.addColorStop(1,"#161b22");
  g.fillStyle=gr; g.fillRect(0,0,w,h);
  g.strokeStyle="rgba(255,255,255,0.03)"; g.lineWidth=1;
  for (let x=40;x<w;x+=40){g.beginPath();g.moveTo(x,0);g.lineTo(x,h);g.stroke();}
  for (let y=40;y<h;y+=40){g.beginPath();g.moveTo(0,y);g.lineTo(w,y);g.stroke();}
}
function rr(g: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number, fill: string, stroke?: string, lw?: number) {
  g.save(); g.beginPath(); g.roundRect(x,y,w,h,r); g.fillStyle=fill; g.fill();
  if(stroke){g.strokeStyle=stroke;g.lineWidth=lw??1.5;g.stroke();} g.restore();
}
function infoBox(g: CanvasRenderingContext2D, lines: [string,string][], x: number, y: number, w=165) {
  const ph=8,lh=16,h=lines.length*lh+ph*2;
  rr(g,x,y,w,h,6,"rgba(15,23,42,0.88)","rgba(99,102,241,0.25)");
  lines.forEach(([l,v],i)=>{txt(g,l,x+ph,y+ph+i*lh+11,"#94a3b8",10,"left");txt(g,v,x+w-ph,y+ph+i*lh+11,"#60a5fa",10,"right");});
}
const C={blue:"#3b82f6",red:"#ef4444",green:"#10b981",amber:"#f59e0b",purple:"#8b5cf6",cyan:"#06b6d4",white:"#f1f5f9",dim:"#94a3b8",orange:"#f97316"};
const card: React.CSSProperties={background:"linear-gradient(135deg,#0f172a 0%,#1a2332 100%)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:14,padding:"16px 20px",marginBottom:20};
const titleStyle: React.CSSProperties={color:"#e2e8f0",fontSize:14,fontWeight:700,marginBottom:10,display:"flex",alignItems:"center",gap:6};
const eqStyle: React.CSSProperties={color:"#94a3b8",fontSize:11,fontFamily:"monospace",marginTop:8,background:"rgba(99,102,241,0.08)",padding:"5px 10px",borderRadius:6,display:"inline-block"};
function Slider({label:l,value,min,max,step=1,onChange,unit=""}: {label:string;value:number;min:number;max:number;step?:number;onChange:(v:number)=>void;unit?:string}) {
  return <div><div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}><span style={{color:"#94a3b8",fontSize:11}}>{l}</span><span style={{color:"#3b82f6",fontWeight:700,fontSize:12}}>{value}{unit}</span></div><input type="range" min={min} max={max} step={step} value={value} onChange={e=>onChange(Number(e.target.value))} style={{width:"100%",accentColor:"#3b82f6",cursor:"pointer"}} /></div>;
}

/* ═══════════════════════════════════════════════════════
 * SIM 1: FRICTIONLESS PUCK ON ICE
 * Newton's 1st: Object in motion stays in motion
 * ═══════════════════════════════════════════════════════ */
function FrictionlessPuckSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [friction, setFriction] = useState(0.02);
  const [initSpeed, setSpeed] = useState(5);
  const posRef = useRef(50); const velRef = useRef(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    const c = cvs.current; if(!c) return;
    const g = c.getContext("2d")!; const W=c.width, H=c.height;
    let raf=0; velRef.current = running ? initSpeed : 0; posRef.current = 50;
    const frame = () => {
      const f = friction * 9.8; const dec = velRef.current > 0 ? -f : (velRef.current < 0 ? f : 0);
      velRef.current += dec * 0.016; if(Math.abs(velRef.current) < 0.01) velRef.current=0;
      posRef.current += velRef.current * 0.016 * 30;
      if(posRef.current > W-50) { posRef.current = W-50; velRef.current = 0; }
      g.clearRect(0,0,W,H); bg(g,W,H);
      // Ice surface
      const iceY = H/2+40;
      g.fillStyle="rgba(147,197,253,0.12)"; g.fillRect(0,iceY,W,H-iceY);
      g.strokeStyle="#93c5fd"; g.lineWidth=1.5; g.beginPath(); g.moveTo(0,iceY); g.lineTo(W,iceY); g.stroke();
      txt(g,`μ=${friction} (${friction===0?"Frictionless!":friction<0.05?"Nearly frictionless":"High friction"})`,W/2,iceY+15,"#93c5fd",10);
      // Puck
      g.fillStyle="#3b82f6"; g.beginPath(); g.ellipse(posRef.current, iceY-14, 22, 10, 0, 0, Math.PI*2); g.fill();
      g.fillStyle="#60a5fa"; g.beginPath(); g.ellipse(posRef.current, iceY-14, 16, 6, 0, 0, Math.PI*2); g.fill();
      // Velocity arrow
      if(Math.abs(velRef.current) > 0.1) drawArrow(g, posRef.current, iceY-14, posRef.current+velRef.current*8, iceY-14, C.amber, 2.5);
      // Friction arrow
      if(Math.abs(velRef.current) > 0.1 && friction > 0)
        drawArrow(g, posRef.current, iceY-26, posRef.current - Math.sign(velRef.current)*35, iceY-26, C.red, 2);
      infoBox(g,[["Velocity",`${velRef.current.toFixed(2)} m/s`],["Friction f",`${(friction*9.8).toFixed(2)} N`],["State",velRef.current>0.05?"Moving→":velRef.current<-0.05?"←Moving":"At rest"]],W-170,12);
      txt(g, friction<0.01?"🧊 No friction → moves forever (Newton's 1st Law!)" : `Friction decelerates puck. a=${(-friction*9.8).toFixed(2)} m/s²`, W/2,22,friction<0.01?C.green:C.amber,11);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  },[friction, initSpeed, running]);

  return (
    <div style={card}>
      <div style={titleStyle}>🧊 Sim 1 — Frictionless Puck (Newton&apos;s 1st Law)</div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
        <Slider label="Friction μ" value={friction} min={0} max={0.3} step={0.01} onChange={setFriction} />
        <Slider label="Initial Speed" value={initSpeed} min={1} max={15} onChange={setSpeed} unit=" m/s" />
        <button onClick={()=>setRunning(r=>!r)} style={{padding:"8px 16px",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",border:"none",background:running?"#7c3aed":"#1d4ed8",color:"#fff"}}>{running?"⏹ Stop":"▶ Launch Puck"}</button>
      </div>
      <div style={eqStyle}>If net force = 0, velocity = constant (even 0 is constant). Law of Inertia: ΣF = 0 → a = 0</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 2: COIN CARD PULL (INERTIA OF REST)
 * ═══════════════════════════════════════════════════════ */
function CoinCardPullSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed] = useState(8); // pull speed
  const stateRef = useRef({phase:"idle",cardX:0,coinX:0,coinY:0,timer:0,coinVy:0,cardVx:0});
  const [phase, setPhase] = useState("idle");

  useEffect(() => {
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    const s=stateRef.current;
    s.phase="idle"; s.cardX=W/2; s.coinX=W/2; s.coinY=H/2-15; s.timer=0; s.coinVy=0; s.cardVx=0;
    setPhase("idle");
    let raf=0;
    const frame=(t: number)=>{
      s.timer+=0.016;
      if(s.phase==="pulling"){
        s.cardX+=speed*0.016*30; s.cardVx=speed*30;
        if(s.cardX>W+100){s.phase="coin_falling"; setPhase("coin_falling");}
      }
      if(s.phase==="coin_falling"){
        s.coinVy+=9.8*0.016*8;
        s.coinY+=s.coinVy*0.016;
        if(s.coinY>H-30){s.coinY=H-30;s.coinVy=0;s.phase="done";setPhase("done");}
      }
      g.clearRect(0,0,W,H); bg(g,W,H);
      // Table
      const tableY=H/2+10;
      rr(g,0,tableY,W,H-tableY,0,"rgba(120,80,40,0.3)","#78350f");
      // Card (unless pulled off)
      if(s.cardX<W+60){
        rr(g,s.cardX-60,tableY-6,120,6,2,"#f1f5f9","rgba(255,255,255,0.3)");
        txt(g,"CARD",s.cardX,tableY-2,"#334155",9);
      }
      // Coin
      g.fillStyle="#f59e0b"; g.strokeStyle="#d97706";
      g.beginPath(); g.arc(s.coinX,s.coinY,14,0,Math.PI*2); g.fill(); g.lineWidth=2; g.stroke();
      txt(g,"₹",s.coinX,s.coinY+4,"#fff",12);
      // Inertia label
      if(s.phase==="coin_falling"||s.phase==="done")
        txt(g,"Coin stays due to INERTIA of rest!",W/2,30,C.green,12);
      if(s.phase==="idle"||s.phase==="pulling")
        txt(g,`Pull speed: ${speed} (${speed>5?"FAST → coin stays!":"Slow → coin moves with card"}`,W/2,25,speed>5?C.green:C.red,11);
      infoBox(g,[["Pull Speed",`${speed} units`],["Inertia",speed>5?"Overcomes ✓":"Insufficient"],["Coin State",s.phase]],W-170,12);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[speed, phase]);

  const pull=()=>{stateRef.current.phase="pulling"; setPhase("pulling");};
  const reset=()=>{const s=stateRef.current; s.phase="idle"; s.cardX=0; s.coinX=stateRef.current.coinX=290; s.coinY=0; setPhase("idle");};

  return (
    <div style={card}>
      <div style={titleStyle}>🎴 Sim 2 — Coin &amp; Card (Inertia of Rest)</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
        <Slider label="Pull Speed" value={speed} min={1} max={15} onChange={setSpeed} unit=" units" />
        <button onClick={pull} style={{padding:"8px 16px",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",border:"none",background:"#1d4ed8",color:"#fff"}}>🎴 Pull Card!</button>
        <button onClick={reset} style={{padding:"8px 16px",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94a3b8"}}>↺ Reset</button>
      </div>
      <div style={eqStyle}>Fast pull → coin stays (inertia of rest) &nbsp;|&nbsp; Slow pull → friction acts → coin moves too</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 3: TRAIN BRAKING — INERTIA OF MOTION
 * ═══════════════════════════════════════════════════════ */
function TrainBrakingSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [trainSpeed, setTSpeed]=useState(30);
  const trainPosRef=useRef(100); const passPosRef=useRef(100); const trainVRef=useRef(0); const passVRef=useRef(0);
  const [braking, setBraking]=useState(false);
  const brakingRef=useRef(false);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    trainVRef.current=trainSpeed*0.016*10; passVRef.current=trainSpeed*0.016*10;
    trainPosRef.current=80; passPosRef.current=80;
    brakingRef.current=braking;
    let raf=0;
    const frame=()=>{
      if(brakingRef.current){
        trainVRef.current=Math.max(0,trainVRef.current-0.8); // train decelerates fast
        passVRef.current=Math.max(0,passVRef.current-0.1); // passenger decelerates slowly (inertia)
      }
      trainPosRef.current+=trainVRef.current; passPosRef.current+=passVRef.current;
      if(trainPosRef.current>W-100){trainPosRef.current=80;passPosRef.current=80; brakingRef.current=false; setBraking(false);}
      g.clearRect(0,0,W,H); bg(g,W,H);
      const floorY=H-50;
      // Track
      g.strokeStyle="#334155"; g.lineWidth=4; g.beginPath(); g.moveTo(0,floorY+20); g.lineTo(W,floorY+20); g.stroke();
      g.strokeStyle="#1e293b"; g.lineWidth=2;
      for(let x=-30+((trainPosRef.current*0.3)%30);x<W;x+=30){g.beginPath();g.moveTo(x,floorY+18);g.lineTo(x,floorY+22);g.stroke();}
      // Train body
      const tx=trainPosRef.current;
      rr(g,tx-100,floorY-60,200,60,8,"#1e3a5f","#3b82f6",2);
      rr(g,tx-60,floorY-80,120,25,4,"#1e3a5f","#1d4ed8");
      // Windows
      [[tx-70,floorY-55],[tx-30,floorY-55],[tx+10,floorY-55],[tx+50,floorY-55]].forEach(([wx,wy])=>{rr(g,wx-10,wy,20,15,3,"rgba(147,197,253,0.3)","#60a5fa");});
      // Passenger (small person shape)
      const px=passPosRef.current;
      const lean=brakingRef.current?0.35:0;
      g.save(); g.translate(px,floorY-58); g.rotate(lean);
      g.fillStyle="#f97316"; g.beginPath(); g.arc(0,-22,9,0,Math.PI*2); g.fill(); // head
      rr(g,-6,-14,12,22,3,"#f97316"); g.restore();
      // Velocity labels
      txt(g,`Train: ${trainVRef.current.toFixed(1)} m/s`,tx,floorY-90,C.blue,11);
      txt(g,`Passenger: ${passVRef.current.toFixed(1)} m/s`,px+30,floorY-70,C.orange,11,"left");
      if(brakingRef.current&&passVRef.current>trainVRef.current+0.5) txt(g,"⚡ Passenger lurches FORWARD (inertia of motion)!",W/2,24,C.amber,12);
      else txt(g,"Watch what happens when brakes are applied →",W/2,24,C.dim,11);
      infoBox(g,[["Train v",`${trainVRef.current.toFixed(1)} m/s`],["Passenger v",`${passVRef.current.toFixed(1)} m/s`],["Difference",`${Math.max(0,passVRef.current-trainVRef.current).toFixed(1)} m/s`]],W-170,40);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[trainSpeed, braking]);

  return (
    <div style={card}>
      <div style={titleStyle}>🚂 Sim 3 — Train Braking: Inertia of Motion</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
        <Slider label="Train Speed" value={trainSpeed} min={5} max={60} onChange={setTSpeed} unit=" m/s" />
        <button onClick={()=>{setBraking(true);brakingRef.current=true;}} style={{padding:"8px 16px",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",border:"none",background:"#dc2626",color:"#fff"}}>🚨 Apply Brakes!</button>
        <button onClick={()=>{setBraking(false);brakingRef.current=false;trainPosRef.current=80;passPosRef.current=80;}} style={{padding:"8px 16px",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94a3b8"}}>↺ Reset</button>
      </div>
      <div style={eqStyle}>Passenger continues at train&apos;s original speed due to inertia &nbsp;|&nbsp; Seatbelt provides the deceleration force</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 4: STRING BALL RELEASE — TANGENTIAL MOTION
 * ═══════════════════════════════════════════════════════ */
function StringBallRelease() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed]=useState(4);
  const angleRef=useRef(0); const releasedRef=useRef(false);
  const ballPosRef=useRef({x:0,y:0}); const ballVelRef=useRef({x:0,y:0});
  const [released, setReleased]=useState(false);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    const cx=W/2, cy=H/2; const R=90;
    releasedRef.current=released;
    if(!released){angleRef.current=0; ballPosRef.current={x:cx+R,y:cy}; ballVelRef.current={x:0,y:0};}
    let raf=0;
    const frame=()=>{
      g.clearRect(0,0,W,H); bg(g,W,H);
      if(!releasedRef.current){
        angleRef.current+=speed*0.016;
        const bx=cx+R*Math.cos(angleRef.current), by=cy+R*Math.sin(angleRef.current);
        ballPosRef.current={x:bx,y:by};
        const tang={x:-Math.sin(angleRef.current),y:Math.cos(angleRef.current)};
        ballVelRef.current={x:tang.x*speed*30,y:tang.y*speed*30};
        // String
        g.strokeStyle="#94a3b8"; g.lineWidth=2; g.beginPath(); g.moveTo(cx,cy); g.lineTo(bx,by); g.stroke();
        // Pivot
        g.fillStyle="#64748b"; g.beginPath(); g.arc(cx,cy,6,0,Math.PI*2); g.fill();
        // Velocity arrow (tangential)
        drawArrow(g,bx,by,bx+tang.x*35,by+tang.y*35,C.amber,2.5);
        txt(g,"v (tangential)",bx+tang.x*45,by+tang.y*45,C.amber,10);
        // Circular path
        g.strokeStyle="rgba(255,255,255,0.08)"; g.lineWidth=1; g.setLineDash([4,4]);
        g.beginPath(); g.arc(cx,cy,R,0,Math.PI*2); g.stroke(); g.setLineDash([]);
        txt(g,"Click 'Release' to see straight-line motion!",W/2,22,C.dim,10);
      } else {
        const p=ballPosRef.current, v=ballVelRef.current;
        p.x+=v.x*0.016; p.y+=v.y*0.016;
        // Trail
        g.strokeStyle="rgba(245,158,11,0.15)"; g.lineWidth=1;
        // Previous circle ghost
        g.strokeStyle="rgba(255,255,255,0.06)"; g.lineWidth=1; g.setLineDash([3,3]);
        g.beginPath(); g.arc(cx,cy,R,0,Math.PI*2); g.stroke(); g.setLineDash([]);
        // Velocity arrow
        drawArrow(g,p.x,p.y,p.x+v.x*0.015,p.y+v.y*0.015,C.amber,2.5);
        txt(g,"⚡ Straight-line motion! (Newton's 1st Law)",W/2,22,C.green,12);
        txt(g,"No string = no centripetal force = moves in straight line",W/2,38,C.dim,10);
      }
      // Ball
      const bp=ballPosRef.current;
      g.fillStyle=released?"#f59e0b":"#3b82f6"; g.beginPath(); g.arc(bp.x,bp.y,14,0,Math.PI*2); g.fill();
      g.strokeStyle=released?"#d97706":"#60a5fa"; g.lineWidth=2; g.stroke();
      infoBox(g,[["Status",released?"Free (straight)":"Circular"],["Speed",`${speed} rev/s`]],W-170,12);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[speed, released]);

  return (
    <div style={card}>
      <div style={titleStyle}>⚪ Sim 4 — Ball on String: Release → Straight Line</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
        <Slider label="Rotation Speed" value={speed} min={1} max={8} onChange={setSpeed} unit=" rev/s" />
        <button onClick={()=>setReleased(true)} style={{padding:"8px 16px",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",border:"none",background:"#d97706",color:"#fff"}}>✂️ Cut String!</button>
        <button onClick={()=>setReleased(false)} style={{padding:"8px 16px",borderRadius:8,fontWeight:700,fontSize:12,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94a3b8"}}>↺ Reset</button>
      </div>
      <div style={eqStyle}>Circular motion needs centripetal force. Remove force → ball moves in straight line (inertia)</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 5: SPACE PROBE — CONSTANT VELOCITY IN SPACE
 * ═══════════════════════════════════════════════════════ */
function SpaceProbeSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [vel, setVel]=useState(8);
  const posRef=useRef(50); const starsRef=useRef<{x:number,y:number,size:number}[]>([]);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    starsRef.current=Array.from({length:80},()=>({x:Math.random()*W,y:Math.random()*H,size:Math.random()*2}));
    posRef.current=80;
    let raf=0;
    const frame=(t: number)=>{
      posRef.current+=vel*0.016*4;
      if(posRef.current>W+80) posRef.current=-80;
      g.clearRect(0,0,W,H); bg(g,W,H);
      // Stars parallax
      starsRef.current.forEach(s=>{
        s.x-=vel*0.016*(s.size*0.8+0.2);
        if(s.x<0) s.x=W;
        g.fillStyle=`rgba(255,255,255,${0.3+s.size*0.35})`; g.beginPath(); g.arc(s.x,s.y,s.size*0.8,0,Math.PI*2); g.fill();
      });
      // Probe
      const px=posRef.current, py=H/2;
      g.save(); g.translate(px,py);
      // Body
      rr(g,-30,-14,60,28,5,"#1e3a5f","#3b82f6");
      // Solar panels
      rr(g,-60,-6,25,12,2,"#1a2e4a","#0e7490");
      rr(g,35,-6,25,12,2,"#1a2e4a","#0e7490");
      // Engine (no thrust particles - constant v)
      g.fillStyle="#334155"; rr(g,-8,14,16,8,3,"#334155");
      g.restore();
      // Velocity label
      drawArrow(g,px+35,py,px+55,py,C.amber,2.5);
      txt(g,`v=${vel} km/s (constant!)`,px+90,py,C.amber,10,"left");
      // Info
      txt(g,"Deep Space — No friction, No air resistance",W/2,22,C.dim,10);
      txt(g,"🚀 Voyager 1: flying at 17 km/s with NO engine since 1980!",W/2,H-14,C.green,10);
      infoBox(g,[["Velocity",`${vel} km/s`],["Acceleration","0 m/s² ✓"],["Force needed","0 N ✓"]],W-170,38);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[vel]);

  return (
    <div style={card}>
      <div style={titleStyle}>🛸 Sim 5 — Space Probe: Constant Velocity Forever</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{marginTop:10}}><Slider label="Probe Velocity" value={vel} min={1} max={20} onChange={setVel} unit=" km/s" /></div>
      <div style={eqStyle}>In space: no friction, no air → ΣF = 0 → v = constant (Newton&apos;s 1st Law in action)</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 6: PASSENGERS IN BUS — INERTIA
 * ═══════════════════════════════════════════════════════ */
function PassengerBusSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [accel, setAccel]=useState(3);
  const [mode, setMode]=useState<"accel"|"brake"|"steady">("steady");
  const leanRef=useRef(0);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0; let t=0;
    const frame=()=>{
      t+=0.016;
      const targetLean=mode==="accel"?-accel*0.08:mode==="brake"?accel*0.08:0;
      leanRef.current+=(targetLean-leanRef.current)*0.05;
      g.clearRect(0,0,W,H); bg(g,W,H);
      const floorY=H-50;
      // Bus body
      rr(g,40,floorY-100,W-80,100,10,"rgba(30,58,138,0.5)","#3b82f6",2);
      // Bus windows
      for(let i=0;i<5;i++){rr(g,70+i*90,floorY-90,70,35,5,"rgba(147,197,253,0.15)","#60a5fa");}
      // Bus wheels
      [100,W-100].forEach(wx=>{g.fillStyle="#1e293b";g.beginPath();g.arc(wx,floorY,25,0,Math.PI*2);g.fill();g.strokeStyle="#475569";g.lineWidth=4;g.stroke();});
      // Road
      g.strokeStyle="#334155"; g.lineWidth=3; g.beginPath(); g.moveTo(0,floorY+26); g.lineTo(W,floorY+26); g.stroke();
      // Passengers (3 people showing different lean)
      [150,300,450].forEach(px=>{
        g.save(); g.translate(px,floorY-30); g.rotate(leanRef.current);
        g.fillStyle="#f97316"; g.beginPath(); g.arc(0,-30,9,0,Math.PI*2); g.fill();
        rr(g,-6,-20,12,22,3,"#f97316"); g.restore();
      });
      // Arrow showing bus motion
      if(mode==="accel"){drawArrow(g,W-60,floorY-50,W-20,floorY-50,C.green,3); txt(g,"Bus accelerates →",W-100,floorY-60,C.green,10,"right");}
      if(mode==="brake"){drawArrow(g,W-60,floorY-50,W-90,floorY-50,C.red,3); txt(g,"← Bus braking",W-80,floorY-60,C.red,10,"right");}
      if(mode==="steady") txt(g,"Steady speed → no lean",W/2,30,C.dim,11);
      const leanDeg=(leanRef.current*180/Math.PI).toFixed(1);
      infoBox(g,[["Mode",mode],["Lean angle",`${leanDeg}°`],["Reason",mode==="accel"?"Inertia of rest":mode==="brake"?"Inertia of motion":"No net force"]],W-175,12);
      const msg=mode==="accel"?"Passengers lean BACK (inertia of rest)":mode==="brake"?"Passengers lean FORWARD (inertia of motion)":"Passengers stand straight (uniform motion)";
      txt(g,msg,W/2,22,mode==="steady"?C.dim:C.amber,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[accel, mode]);

  return (
    <div style={card}>
      <div style={titleStyle}>🚌 Sim 6 — Bus Passengers: Inertia Demonstration</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
        <Slider label="Acceleration" value={accel} min={1} max={10} onChange={setAccel} unit=" m/s²" />
        <button onClick={()=>setMode("accel")} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:mode==="accel"?"#16a34a":"#1e293b",color:"#fff"}}>🚌 Accelerate</button>
        <button onClick={()=>setMode("brake")} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:mode==="brake"?"#dc2626":"#1e293b",color:"#fff"}}>🛑 Brake</button>
        <button onClick={()=>setMode("steady")} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:mode==="steady"?"#1d4ed8":"#1e293b",color:"#fff"}}>➡ Steady</button>
      </div>
      <div style={eqStyle}>Acceleration → lean back (inertia of rest) &nbsp;|&nbsp; Braking → lean forward (inertia of motion)</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 7: BOWLING BALL DECELERATION
 * ═══════════════════════════════════════════════════════ */
function BowlingBallSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [surface, setSurface]=useState<"ice"|"wood"|"carpet">("wood");
  const [initSpeed, setSpeed]=useState(8);
  const velRef=useRef(0); const posRef=useRef(60); const spinRef=useRef(0);

  const mu={ice:0.02,wood:0.25,carpet:0.6}[surface];
  const surfaceColor={ice:"rgba(147,197,253,0.15)",wood:"rgba(120,80,40,0.2)",carpet:"rgba(124,58,237,0.15)"}[surface];
  const surfaceLabel={ice:"Ice (μ=0.02) — glides far",wood:"Wood Floor (μ=0.25)",carpet:"Carpet (μ=0.6) — stops fast"}[surface];

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    velRef.current=initSpeed; posRef.current=60; spinRef.current=0;
    let raf=0;
    const frame=()=>{
      const f=mu*9.8; velRef.current=Math.max(0,velRef.current-f*0.016);
      posRef.current+=velRef.current*0.016*20; spinRef.current+=velRef.current*0.016;
      if(posRef.current>W-50){posRef.current=60;velRef.current=initSpeed;}
      g.clearRect(0,0,W,H); bg(g,W,H);
      const floorY=H-50;
      g.fillStyle=surfaceColor; g.fillRect(0,floorY,W,H-floorY);
      g.strokeStyle="#475569"; g.lineWidth=2; g.beginPath(); g.moveTo(0,floorY); g.lineTo(W,floorY); g.stroke();
      txt(g,surfaceLabel,W/2,floorY+16,"#64748b",10);
      // Ball
      const bx=posRef.current, by=floorY-20;
      g.fillStyle="#1e293b"; g.beginPath(); g.arc(bx,by,20,0,Math.PI*2); g.fill();
      g.strokeStyle="#475569"; g.lineWidth=2; g.stroke();
      // Spin indicator
      g.strokeStyle="#60a5fa"; g.lineWidth=2;
      g.beginPath(); g.moveTo(bx,by); g.lineTo(bx+20*Math.cos(spinRef.current),by+20*Math.sin(spinRef.current)); g.stroke();
      // Velocity arrow
      if(velRef.current>0.1) drawArrow(g,bx+22,by,bx+22+velRef.current*4,by,C.amber,2.5);
      // Friction arrow
      if(velRef.current>0.05) drawArrow(g,bx,by+24,bx-30,by+24,C.red,2);
      infoBox(g,[["Speed",`${velRef.current.toFixed(2)} m/s`],["Friction a",`${(mu*9.8).toFixed(2)} m/s²`],["Surface",surface]],W-170,12);
      const pct=((velRef.current/initSpeed)*100).toFixed(0);
      txt(g,`Friction decelerates: a = -μg = -${(mu*9.8).toFixed(2)} m/s²   Speed: ${pct}% of initial`,W/2,22,C.blue,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[surface, initSpeed, mu, surfaceColor, surfaceLabel]);

  return (
    <div style={card}>
      <div style={titleStyle}>🎳 Sim 7 — Bowling Ball: Friction Slows Motion</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
        <Slider label="Initial Speed" value={initSpeed} min={2} max={20} onChange={setSpeed} unit=" m/s" />
        <div><span style={{color:"#94a3b8",fontSize:11}}>Surface</span><div style={{display:"flex",gap:6,marginTop:4}}>{(["ice","wood","carpet"] as const).map(s=><button key={s} onClick={()=>setSurface(s)} style={{padding:"4px 10px",borderRadius:6,fontSize:11,fontWeight:700,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:surface===s?"#1d4ed8":"rgba(255,255,255,0.04)",color:surface===s?"#fff":"#94a3b8"}}>{s}</button>)}</div></div>
      </div>
      <div style={eqStyle}>Ball decelerates due to friction: a = -μg = -{(mu*9.8).toFixed(2)} m/s² &nbsp;|&nbsp; Perfect Newton&apos;s 1st: no friction → no stop!</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 8: PENDULUM — VACUUM VS AIR
 * ═══════════════════════════════════════════════════════ */
function PendulumSwingSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [length, setLength]=useState(1.2);
  const [airResist, setAir]=useState(0.02);
  const ang1Ref=useRef(0.6); const av1Ref=useRef(0); // vacuum
  const ang2Ref=useRef(0.6); const av2Ref=useRef(0); // air

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    ang1Ref.current=0.6; av1Ref.current=0; ang2Ref.current=0.6; av2Ref.current=0;
    let raf=0;
    const frame=()=>{
      const dt=0.016, G=9.8, L=length;
      // Vacuum pendulum
      av1Ref.current+=(-G/L)*Math.sin(ang1Ref.current)*dt;
      ang1Ref.current+=av1Ref.current*dt;
      // Air resistance pendulum
      av2Ref.current+=(-G/L)*Math.sin(ang2Ref.current)*dt - airResist*av2Ref.current;
      ang2Ref.current+=av2Ref.current*dt;
      g.clearRect(0,0,W,H); bg(g,W,H);
      const scale=Math.min(80/(length),120);
      // Left: vacuum pendulum
      const cx1=W/4, cy1=50, bLen1=length*scale;
      txt(g,"Vacuum (no air)",cx1,cy1-12,"#10b981",11);
      g.fillStyle="#334155"; g.beginPath(); g.arc(cx1,cy1,5,0,Math.PI*2); g.fill();
      const bx1=cx1+bLen1*Math.sin(ang1Ref.current), by1=cy1+bLen1*Math.cos(ang1Ref.current);
      g.strokeStyle="#94a3b8"; g.lineWidth=2; g.beginPath(); g.moveTo(cx1,cy1); g.lineTo(bx1,by1); g.stroke();
      g.fillStyle="#10b981"; g.beginPath(); g.arc(bx1,by1,14,0,Math.PI*2); g.fill();
      txt(g,"Swings forever!",cx1,H-15,C.green,10);
      // Right: air pendulum
      const cx2=3*W/4, cy2=50, bLen2=length*scale;
      txt(g,`Air (b=${airResist})`,cx2,cy2-12,"#f59e0b",11);
      g.fillStyle="#334155"; g.beginPath(); g.arc(cx2,cy2,5,0,Math.PI*2); g.fill();
      const bx2=cx2+bLen2*Math.sin(ang2Ref.current), by2=cy2+bLen2*Math.cos(ang2Ref.current);
      g.strokeStyle="#94a3b8"; g.lineWidth=2; g.beginPath(); g.moveTo(cx2,cy2); g.lineTo(bx2,by2); g.stroke();
      const alpha2=Math.abs(ang2Ref.current)/0.6;
      g.fillStyle=`hsl(${45*alpha2},90%,50%)`; g.beginPath(); g.arc(bx2,by2,14,0,Math.PI*2); g.fill();
      txt(g,"Gradually slows down",cx2,H-15,C.amber,10);
      const period=(2*Math.PI*Math.sqrt(length/9.8)).toFixed(2);
      txt(g,`Period T = 2π√(L/g) = ${period} s (same for both!)`,W/2,H-30,C.blue,11);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[length, airResist]);

  return (
    <div style={card}>
      <div style={titleStyle}>🕰️ Sim 8 — Pendulum: Vacuum vs Air Resistance</div>
      <canvas ref={cvs} width={580} height={250} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
        <Slider label="Length" value={length} min={0.3} max={2.0} step={0.1} onChange={setLength} unit=" m" />
        <Slider label="Air Resistance b" value={airResist} min={0} max={0.2} step={0.01} onChange={setAir} />
      </div>
      <div style={eqStyle}>Vacuum: swings forever (inertia) &nbsp;|&nbsp; Air: energy lost to drag &nbsp;|&nbsp; T = 2π√(L/g) = {(2*Math.PI*Math.sqrt(length/9.8)).toFixed(2)} s</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 9: ASTEROID IN DEEP SPACE
 * ═══════════════════════════════════════════════════════ */
function AsteroidSpaceSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [vx, setVx]=useState(3); const [vy, setVy]=useState(1);
  const posRef=useRef({x:100,y:120}); const starsRef=useRef<{x:number,y:number}[]>([]);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    starsRef.current=Array.from({length:60},()=>({x:Math.random()*W,y:Math.random()*H}));
    posRef.current={x:100,y:H/2};
    const trail: {x:number,y:number}[]=[];
    let raf=0;
    const frame=()=>{
      posRef.current.x+=vx*0.016*20; posRef.current.y+=vy*0.016*20;
      trail.push({...posRef.current});
      if(trail.length>40) trail.shift();
      if(posRef.current.x>W+40){posRef.current.x=-40; trail.length=0;}
      if(posRef.current.y<-40){posRef.current.y=H+40; trail.length=0;}
      if(posRef.current.y>H+40){posRef.current.y=-40; trail.length=0;}
      g.clearRect(0,0,W,H); bg(g,W,H);
      starsRef.current.forEach(s=>{g.fillStyle="rgba(255,255,255,0.5)";g.beginPath();g.arc(s.x,s.y,1,0,Math.PI*2);g.fill();});
      // Trail
      for(let i=1;i<trail.length;i++){
        g.strokeStyle=`rgba(245,158,11,${i/trail.length*0.6})`; g.lineWidth=2;
        g.beginPath(); g.moveTo(trail[i-1].x,trail[i-1].y); g.lineTo(trail[i].x,trail[i].y); g.stroke();
      }
      // Asteroid
      const ax=posRef.current.x, ay=posRef.current.y;
      g.fillStyle="#64748b"; g.beginPath(); g.arc(ax,ay,18,0,Math.PI*2); g.fill();
      g.fillStyle="#94a3b8"; g.beginPath(); g.arc(ax-5,ay-4,8,0,Math.PI*2); g.fill();
      // Velocity arrow
      const vLen=Math.sqrt(vx*vx+vy*vy);
      drawArrow(g,ax,ay,ax+vx*10,ay+vy*10,C.amber,2.5);
      txt(g,`v=${vLen.toFixed(1)} km/s`,ax+vx*10+5,ay+vy*10,C.amber,10,"left");
      // No force label
      txt(g,"Zero net force in empty space — velocity stays constant!",W/2,22,C.green,11);
      txt(g,"This is exactly what Voyager 1 does since 1977!",W/2,H-14,C.dim,10);
      infoBox(g,[["vx",`${vx} km/s`],["vy",`${vy} km/s`],["Net Force","0 N ✓"],["ΔV","0 (constant)"]],W-170,38);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[vx, vy]);

  return (
    <div style={card}>
      <div style={titleStyle}>☄️ Sim 9 — Asteroid in Deep Space (Zero Force = Constant Velocity)</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:10}}>
        <Slider label="Horizontal Velocity vx" value={vx} min={0} max={10} onChange={setVx} unit=" km/s" />
        <Slider label="Vertical Velocity vy" value={vy} min={-5} max={5} onChange={setVy} unit=" km/s" />
      </div>
      <div style={eqStyle}>No force → no acceleration → constant velocity (Newton&apos;s 1st Law) &nbsp;|&nbsp; F_net = 0 ↔ v = constant</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 10: WATER IN CUP DURING ACCELERATION
 * ═══════════════════════════════════════════════════════ */
function WaterCupSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [accel, setAccel]=useState(5);
  const [direction, setDir]=useState<"forward"|"brake"|"none">("none");

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let t=0, raf=0;
    const frame=()=>{
      t+=0.016;
      g.clearRect(0,0,W,H); bg(g,W,H);
      const cx=W/2, cy=H/2+20;
      // Car body
      rr(g,cx-120,cy-30,240,60,8,"rgba(30,58,138,0.4)","#3b82f6",2);
      rr(g,cx-80,cy-65,160,38,6,"rgba(30,58,138,0.3)","#1d4ed8");
      [cx-80,cx+50].forEach(wx=>{g.fillStyle="#1e293b";g.beginPath();g.arc(wx,cy+30,16,0,Math.PI*2);g.fill();g.strokeStyle="#475569";g.lineWidth=3;g.stroke();});
      // Cup on dashboard
      const cupX=cx-30, cupY=cy-40;
      rr(g,cupX-12,cupY-25,24,25,2,"rgba(148,163,184,0.2)","#94a3b8");
      // Water tilt angle based on acceleration
      const tiltAngle = direction==="forward" ? accel*0.04 : direction==="brake" ? -accel*0.04 : 0;
      const wH=14; const wW=20;
      g.save(); g.translate(cupX,cupY-5); g.rotate(tiltAngle);
      g.fillStyle="rgba(59,130,246,0.5)";
      g.beginPath(); g.moveTo(-wW/2,0); g.lineTo(wW/2,0); g.lineTo(wW/2-2,wH); g.lineTo(-wW/2+2,wH); g.closePath(); g.fill();
      g.restore();
      // Arrows
      if(direction==="forward"){drawArrow(g,cx+120,cy,cx+165,cy,C.green,3); txt(g,"Accelerating →",cx+140,cy-12,C.green,10);}
      if(direction==="brake"){drawArrow(g,cx+120,cy,cx+80,cy,C.red,3); txt(g,"Braking ←",cx+100,cy-12,C.red,10);}
      // Explanation
      const msg=direction==="forward"?"Water tilts back (inertia of rest)":direction==="brake"?"Water tilts forward (inertia of motion)":"Cup steady — no acceleration";
      txt(g,msg,W/2,24,direction==="none"?C.dim:C.amber,12);
      const tiltDeg=(tiltAngle*180/Math.PI).toFixed(1);
      infoBox(g,[["Acceleration",`${direction==="none"?0:accel} m/s²`],["Water tilt",`${Math.abs(Number(tiltDeg))}°`],["Direction",direction]],W-170,12);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[accel, direction]);

  return (
    <div style={card}>
      <div style={titleStyle}>☕ Sim 10 — Water in Cup: Pseudo-Force & Inertia</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
        <Slider label="Acceleration" value={accel} min={1} max={15} onChange={setAccel} unit=" m/s²" />
        <button onClick={()=>setDir("forward")} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:direction==="forward"?"#16a34a":"#1e293b",color:"#fff"}}>🚗 Accelerate</button>
        <button onClick={()=>setDir("brake")} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:direction==="brake"?"#dc2626":"#1e293b",color:"#fff"}}>🛑 Brake</button>
        <button onClick={()=>setDir("none")} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94a3b8"}}>Steady</button>
      </div>
      <div style={eqStyle}>Accelerate: water tilts back (inertia of rest) &nbsp;|&nbsp; Brake: water tilts forward (inertia of motion)</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 11: HOVERCRAFT — ZERO FRICTION MOTION
 * ═══════════════════════════════════════════════════════ */
function HovercraftSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [thrust, setThrust]=useState(0);
  const [mass, setMass]=useState(50);
  const posRef=useRef(100); const velRef=useRef(0);
  const [thrusting, setThrusting]=useState(false);
  const thrustRef=useRef(false);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    let raf=0; let t=0;
    const frame=()=>{
      t+=0.016;
      const F=thrustRef.current ? thrust : 0;
      const a=F/mass;
      velRef.current+=a*0.016; velRef.current*=0.9998; // air cushion: ~zero friction
      posRef.current+=velRef.current*0.016*12;
      if(posRef.current>W+80) posRef.current=-80;
      g.clearRect(0,0,W,H); bg(g,W,H);
      const floorY=H-40;
      g.fillStyle="rgba(148,163,184,0.05)"; g.fillRect(0,floorY,W,H-floorY);
      g.strokeStyle="#475569"; g.lineWidth=2; g.beginPath(); g.moveTo(0,floorY); g.lineTo(W,floorY); g.stroke();
      txt(g,"Air cushion surface — virtually ZERO friction",W/2,floorY+16,"#64748b",9);
      // Air cushion particles
      for(let i=0;i<6;i++){
        const px=posRef.current-30+i*12, py=floorY;
        const floatY=Math.sin(t*8+i)*3;
        g.fillStyle="rgba(147,197,253,0.3)"; g.beginPath(); g.arc(px,py+floatY,3,0,Math.PI*2); g.fill();
      }
      // Hovercraft body
      const hx=posRef.current;
      g.fillStyle="#1e3a5f"; g.beginPath();
      g.ellipse(hx,floorY-20,45,15,0,0,Math.PI*2); g.fill();
      g.strokeStyle="#3b82f6"; g.lineWidth=2; g.stroke();
      rr(g,hx-25,floorY-42,50,22,5,"#1d4ed8","#60a5fa");
      // Thrust indicator
      if(thrustRef.current){
        for(let i=0;i<4;i++){
          const px=hx-20+i*13, py=floorY-20;
          g.fillStyle="rgba(245,158,11,0.4)"; g.beginPath(); g.arc(px,py+20+Math.sin(t*20+i)*3,2,0,Math.PI*2); g.fill();
        }
        drawArrow(g,hx-50,floorY-30,hx-75,floorY-30,C.amber,2.5);
      }
      const speed=Math.abs(velRef.current);
      drawArrow(g,hx+50,floorY-28,hx+50+speed*3,floorY-28,C.green,2);
      infoBox(g,[["Thrust",thrustRef.current?`${thrust}N`:"0 N"],["Velocity",`${(velRef.current*0.6).toFixed(2)} m/s`],["Friction","~0 N ✓"],["Mass",`${mass} kg`]],W-170,12);
      txt(g,"Once moving, hovercraft keeps moving with almost no energy!",W/2,22,C.dim,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[thrust, mass]);

  return (
    <div style={card}>
      <div style={titleStyle}>🚁 Sim 11 — Hovercraft: Zero Friction = Constant Motion</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
        <Slider label="Thrust Force" value={thrust} min={10} max={500} step={10} onChange={setThrust} unit=" N" />
        <Slider label="Mass" value={mass} min={10} max={200} step={10} onChange={setMass} unit=" kg" />
        <button onClick={()=>{setThrusting(true);thrustRef.current=true;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:thrusting?"#16a34a":"#1e293b",color:"#fff"}}>💨 Apply Thrust</button>
        <button onClick={()=>{setThrusting(false);thrustRef.current=false;}} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94a3b8"}}>✋ Cut Thrust</button>
      </div>
      <div style={eqStyle}>No friction → no deceleration → constant velocity after thrust removed (Perfect Newton&apos;s 1st Law!)</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 12: SEATBELT IMPORTANCE (CRASH SIMULATION)
 * ═══════════════════════════════════════════════════════ */
function SeatbeltCrashSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [speed, setSpeed]=useState(60);
  const carPosRef=useRef(100); const passPosRef=useRef(100);
  const carVRef=useRef(0); const passVRef=useRef(0);
  const [crashed, setCrashed]=useState(false);
  const [seatbelt, setSeatbelt]=useState(true);
  const crashedRef=useRef(false); const seatbeltRef=useRef(true);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    carPosRef.current=100; passPosRef.current=100;
    carVRef.current=speed*0.016; passVRef.current=speed*0.016;
    crashedRef.current=crashed; seatbeltRef.current=seatbelt;
    let raf=0;
    const frame=()=>{
      if(crashedRef.current){
        carVRef.current=Math.max(0,carVRef.current-3);
        if(seatbeltRef.current){passVRef.current=Math.max(0,passVRef.current-3);}
        else {passVRef.current=Math.max(0,passVRef.current-0.15);}
      }
      carPosRef.current+=carVRef.current; passPosRef.current+=passVRef.current;
      if(passPosRef.current>W+50) passPosRef.current=W+50;
      g.clearRect(0,0,W,H); bg(g,W,H);
      const floorY=H-50;
      g.strokeStyle="#334155"; g.lineWidth=3; g.beginPath(); g.moveTo(0,floorY+20); g.lineTo(W,floorY+20); g.stroke();
      // Wall
      if(crashed||carPosRef.current>W-120){
        rr(g,W-20,floorY-80,20,80,0,"#374151","#4b5563");
        txt(g,"WALL",W-10,floorY-40,"#94a3b8",10);
        crashedRef.current=true; setCrashed(true);
      }
      // Car
      const cx=Math.min(carPosRef.current,W-120);
      rr(g,cx-80,floorY-50,160,50,6,"rgba(30,58,138,0.5)","#3b82f6",2);
      rr(g,cx-50,floorY-80,100,33,5,"rgba(30,58,138,0.3)","#1d4ed8");
      [cx-55,cx+35].forEach(wx=>{g.fillStyle="#1e293b";g.beginPath();g.arc(wx,floorY,18,0,Math.PI*2);g.fill();g.strokeStyle="#475569";g.lineWidth=3;g.stroke();});
      // Passenger
      const px=Math.min(passPosRef.current+50,W-20);
      const passLean=crashedRef.current&&!seatbeltRef.current?0.5:0;
      g.save(); g.translate(px,floorY-48); g.rotate(passLean);
      g.fillStyle="#f97316"; g.beginPath(); g.arc(0,-20,8,0,Math.PI*2); g.fill();
      rr(g,-5,-12,10,18,3,"#f97316"); g.restore();
      // Seatbelt
      if(seatbeltRef.current){g.strokeStyle="#f59e0b"; g.lineWidth=2.5; g.beginPath(); g.moveTo(px+5,floorY-55); g.lineTo(px-10,floorY-38); g.stroke();}
      const impact=Math.min((speed*speed/(2*0.8)),999);
      infoBox(g,[["Speed",`${speed} km/h`],["Seatbelt",seatbelt?"Yes ✓":"NO ⚠️"],["Impact Force",`${impact.toFixed(0)} N`],["Safe?",seatbelt?"Yes ✓":"DANGER!"]],W-175,12);
      if(crashedRef.current) txt(g,seatbeltRef.current?"✓ Seatbelt SAVED the passenger!":"⚠️ Passenger continues forward! (inertia of motion)",W/2,24,seatbeltRef.current?C.green:C.red,12);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[speed, seatbelt, crashed]);

  const reset=()=>{setCrashed(false);crashedRef.current=false;carPosRef.current=100;passPosRef.current=100;};

  return (
    <div style={card}>
      <div style={titleStyle}>🚗 Sim 12 — Seatbelt: Inertia of Motion in a Crash</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
        <Slider label="Car Speed" value={speed} min={20} max={120} step={5} onChange={setSpeed} unit=" km/h" />
        <button onClick={()=>setSeatbelt(s=>!s)} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:seatbelt?"#16a34a":"#dc2626",color:"#fff"}}>{seatbelt?"🔒 Seatbelt ON":"🔓 No Seatbelt"}</button>
        <button onClick={reset} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94a3b8"}}>↺ Reset</button>
      </div>
      <div style={eqStyle}>Without seatbelt: passenger continues at car&apos;s speed after crash (inertia). Seatbelt provides stopping force F = ma</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 13: TABLECLOTH PULL EXPERIMENT
 * ═══════════════════════════════════════════════════════ */
function TableclothPullSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [pullSpeed, setPullSpeed]=useState(8);
  const [pulling, setPulling]=useState(false);
  const clothRef=useRef(0); const dishRef=useRef(0); const dishVRef=useRef(0);
  const pullingRef=useRef(false);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    clothRef.current=0; dishRef.current=0; dishVRef.current=0;
    pullingRef.current=pulling;
    let raf=0;
    const frame=()=>{
      if(pullingRef.current){
        clothRef.current=Math.min(clothRef.current+pullSpeed*0.016*15,W);
        const frictionAcc=pullSpeed>6?0.05:0.8; // fast pull = less friction time
        dishVRef.current+=frictionAcc*0.016;
        dishRef.current+=dishVRef.current*0.016*8;
      }
      g.clearRect(0,0,W,H); bg(g,W,H);
      const tableY=H/2+20;
      // Table
      rr(g,20,tableY,W-40,30,4,"rgba(120,80,40,0.3)","#78350f");
      rr(g,60,tableY+28,30,60,3,"rgba(120,80,40,0.2)","#78350f");
      rr(g,W-90,tableY+28,30,60,3,"rgba(120,80,40,0.2)","#78350f");
      // Tablecloth
      if(clothRef.current<W+20){
        rr(g,clothRef.current-280,tableY-2,280,8,2,"#f1f5f9","rgba(255,255,255,0.3)");
      }
      // Dishes (stay on table)
      const dishX=200+dishRef.current;
      // Plate
      g.fillStyle="#e2e8f0"; g.beginPath(); g.ellipse(dishX,tableY-12,30,8,0,0,Math.PI*2); g.fill();
      g.strokeStyle="#94a3b8"; g.lineWidth=1.5; g.stroke();
      // Cup
      rr(g,dishX+40,tableY-30,18,20,3,"#93c5fd","#60a5fa");
      if(pullingRef.current&&pullSpeed>6) txt(g,"✓ Fast pull — dishes stay! (inertia)",W/2,24,C.green,12);
      else if(pullingRef.current) txt(g,"Slow pull — friction moves dishes with cloth",W/2,24,C.amber,11);
      else txt(g,"Click 'Pull' to see inertia in action!",W/2,24,C.dim,11);
      infoBox(g,[["Pull Speed",`${pullSpeed} units`],["Friction Time",pullSpeed>6?"Short (fast)":"Long (slow)"],["Result",pullSpeed>6?"Dishes stay ✓":"Dishes move"]],W-175,40);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[pullSpeed, pulling]);

  return (
    <div style={card}>
      <div style={titleStyle}>🍽️ Sim 13 — Tablecloth Pull (Inertia of Rest)</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
        <Slider label="Pull Speed" value={pullSpeed} min={1} max={15} onChange={setPullSpeed} unit=" units" />
        <button onClick={()=>{setPulling(true);pullingRef.current=true;}} style={{padding:"8px 16px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:"#1d4ed8",color:"#fff"}}>🏃 Pull!</button>
        <button onClick={()=>{setPulling(false);pullingRef.current=false;clothRef.current=0;dishRef.current=0;dishVRef.current=0;}} style={{padding:"8px",borderRadius:8,fontSize:12,cursor:"pointer",border:"1px solid rgba(255,255,255,0.1)",background:"transparent",color:"#94a3b8"}}>↺ Reset</button>
      </div>
      <div style={eqStyle}>Fast pull → short friction time → dishes&apos; inertia keeps them in place &nbsp;|&nbsp; Slow pull → enough friction time → dishes move</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 14: HEAVY vs LIGHT OBJECT — INERTIA COMPARISON
 * ═══════════════════════════════════════════════════════ */
function InertiaComparisonSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [force, setForce]=useState(50);
  const [m1, setM1]=useState(2); const [m2, setM2]=useState(10);
  const x1Ref=useRef(80); const x2Ref=useRef(80);
  const v1Ref=useRef(0); const v2Ref=useRef(0);
  const [running, setRunning]=useState(false);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    const a1=force/m1, a2=force/m2;
    x1Ref.current=80; x2Ref.current=80; v1Ref.current=0; v2Ref.current=0;
    let raf=0; let applying=running;
    const frame=()=>{
      if(applying){
        v1Ref.current+=a1*0.016; v2Ref.current+=a2*0.016;
        x1Ref.current+=v1Ref.current*0.016*5; x2Ref.current+=v2Ref.current*0.016*5;
        if(x1Ref.current>W-40){x1Ref.current=80;v1Ref.current=0;}
        if(x2Ref.current>W-40){x2Ref.current=80;v2Ref.current=0;}
      }
      g.clearRect(0,0,W,H); bg(g,W,H);
      // Track 1 (light)
      const y1=H/3, y2=2*H/3;
      g.strokeStyle="#334155"; g.lineWidth=2;
      g.beginPath();g.moveTo(50,y1);g.lineTo(W-20,y1);g.stroke();
      g.beginPath();g.moveTo(50,y2);g.lineTo(W-20,y2);g.stroke();
      txt(g,`Light: ${m1} kg → a=${a1.toFixed(1)} m/s²`,80,y1-12,C.green,10,"left");
      txt(g,`Heavy: ${m2} kg → a=${a2.toFixed(2)} m/s²`,80,y2-12,C.amber,10,"left");
      // Object 1 (light, moves faster)
      rr(g,x1Ref.current-18,y1-28,36,26,5,"#065f46","#10b981");
      txt(g,`${m1}kg`,x1Ref.current,y1-16,"#fff",11);
      if(applying) drawArrow(g,x1Ref.current-18,y1-15,x1Ref.current-50,y1-15,C.green,2);
      // Object 2 (heavy, moves slower)
      rr(g,x2Ref.current-24,y2-32,48,30,5,"#78350f","#f59e0b");
      txt(g,`${m2}kg`,x2Ref.current,y2-18,"#fff",11);
      if(applying) drawArrow(g,x2Ref.current-24,y2-18,x2Ref.current-56,y2-18,C.amber,2);
      infoBox(g,[["Force F",`${force} N`],["a₁ (light)",`${a1.toFixed(2)} m/s²`],["a₂ (heavy)",`${a2.toFixed(2)} m/s²`],["Ratio",`${(a1/a2).toFixed(1)}× faster`]],W-170,12);
      txt(g,`Same ${force}N force → ${m1}kg accelerates ${(a1/a2).toFixed(1)}× faster than ${m2}kg (more inertia!)`,W/2,22,C.blue,10);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[force, m1, m2, running]);

  return (
    <div style={card}>
      <div style={titleStyle}>⚖️ Sim 14 — Inertia Comparison: Light vs Heavy Object</div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginTop:10,alignItems:"end"}}>
        <Slider label="Same Force F" value={force} min={10} max={200} step={10} onChange={setForce} unit=" N" />
        <Slider label="Light Mass m₁" value={m1} min={1} max={10} onChange={setM1} unit=" kg" />
        <Slider label="Heavy Mass m₂" value={m2} min={5} max={50} step={5} onChange={setM2} unit=" kg" />
        <button onClick={()=>setRunning(r=>!r)} style={{padding:"8px",borderRadius:8,fontSize:12,fontWeight:700,cursor:"pointer",border:"none",background:running?"#7c3aed":"#1d4ed8",color:"#fff"}}>{running?"⏹ Stop":"▶ Apply Force"}</button>
      </div>
      <div style={eqStyle}>Greater mass = greater inertia = less acceleration &nbsp;|&nbsp; a = F/m &nbsp;|&nbsp; This is ALSO Newton&apos;s 2nd Law!</div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
 * SIM 15: NEWTON'S FIRST LAW INTERACTIVE LAB
 * ═══════════════════════════════════════════════════════ */
function FirstLawLabSim() {
  const cvs=useRef<HTMLCanvasElement>(null);
  const [friction, setFriction]=useState(0.1);
  const velRef=useRef(0); const posRef=useRef(100);
  const forcingRef=useRef(false); const [forcing, setForcing]=useState(false);

  useEffect(()=>{
    const c=cvs.current; if(!c) return;
    const g=c.getContext("2d")!; const W=c.width,H=c.height;
    posRef.current=100; velRef.current=0;
    let raf=0;
    const frame=()=>{
      const F=forcingRef.current?80:0;
      const f=friction*50*9.8*0.01;
      const net=F - (velRef.current>0?f:-f);
      velRef.current+=net*0.016;
      if(!forcingRef.current&&Math.abs(velRef.current)<0.05) velRef.current=0;
      posRef.current+=velRef.current*0.016*8;
      if(posRef.current>W-50){posRef.current=W-50; velRef.current=0;}
      if(posRef.current<50){posRef.current=50; velRef.current=0;}
      g.clearRect(0,0,W,H); bg(g,W,H);
      const floorY=H-55;
      rr(g,0,floorY,W,H-floorY,0,"rgba(30,41,59,0.4)","#334155");
      // Net force indicator bar
      const netDisplay=F-(velRef.current>0.1?f:0);
      const barW=Math.abs(netDisplay)*1.5;
      rr(g,W/2,30,netDisplay>0?barW:0,20,3,netDisplay>0?"rgba(16,185,129,0.4)":"rgba(239,68,68,0.4)",netDisplay>0?C.green:C.red);
      rr(g,W/2-barW,30,netDisplay<0?barW:0,20,3,"rgba(239,68,68,0.4)",C.red);
      txt(g,"Net Force →",W/2,25,"#475569",10,"left");
      // Object
      const bx=posRef.current;
      rr(g,bx-22,floorY-36,44,34,5,"#1d4ed8","#3b82f6");
      txt(g,"5kg",bx,floorY-20,"#fff",11);
      // Arrows
      if(forcingRef.current) {drawArrow(g,bx-22,floorY-19,bx-55,floorY-19,C.green,2.5); txt(g,"F=80N",bx-80,floorY-30,C.green,9);}
      if(Math.abs(velRef.current)>0.05&&friction>0.01){drawArrow(g,bx+22,floorY-19,bx+50,floorY-19,C.red,2); txt(g,"f",bx+55,floorY-30,C.red,9);}
      if(Math.abs(velRef.current)>0.1){drawArrow(g,bx,floorY-50,bx+velRef.current*5,floorY-50,C.amber,2.5); txt(g,`v=${(velRef.current*0.5).toFixed(1)}m/s`,bx+velRef.current*5+5,floorY-50,C.amber,9,"left");}
      const state=Math.abs(velRef.current)<0.05?"AT REST (Law 1 ✓)":!forcingRef.current?"DECELERATING (friction)":friction<0.02?"CONSTANT v ≈ (Law 1!)":"ACCELERATING";
      txt(g,state,W/2,22,Math.abs(velRef.current)<0.05?C.green:!forcingRef.current?C.red:friction<0.02?C.cyan:C.amber,12);
      infoBox(g,[["Applied F",forcingRef.current?"80 N":"0 N"],["Friction f",`${(f).toFixed(1)} N`],["Velocity",`${(velRef.current*0.5).toFixed(2)} m/s`],["Net F",`${netDisplay.toFixed(1)} N`]],W-170,40);
      raf=requestAnimationFrame(frame);
    };
    raf=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf);
  },[friction]);

  return (
    <div style={card}>
      <div style={titleStyle}>🔬 Sim 15 — Newton&apos;s First Law Interactive Laboratory</div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",borderRadius:8}} />
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginTop:10,alignItems:"end"}}>
        <Slider label="Surface Friction μ" value={friction} min={0} max={0.5} step={0.01} onChange={setFriction} />
        <button onMouseDown={()=>{setForcing(true);forcingRef.current=true;}} onMouseUp={()=>{setForcing(false);forcingRef.current=false;}} onTouchStart={()=>{setForcing(true);forcingRef.current=true;}} onTouchEnd={()=>{setForcing(false);forcingRef.current=false;}} style={{padding:"10px",borderRadius:8,fontSize:13,fontWeight:700,cursor:"pointer",border:"none",background:forcing?"#16a34a":"#1d4ed8",color:"#fff",userSelect:"none"}}>
          {forcing?"✋ HOLD to Push":"👉 Hold to Push →"}
        </button>
        <div style={{color:"#94a3b8",fontSize:11,padding:8}}>{friction<0.02?"Zero friction: release → constant velocity!":"Release → friction stops it"}</div>
      </div>
      <div style={eqStyle}>If ΣF = 0 → object remains at rest OR moves at constant velocity (Newton&apos;s 1st Law of Motion)</div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
 * MAIN EXPORT
 * ════════════════════════════════════════════════════════ */
export function AdvancedTopic2Sims() {
  return (
    <div style={{marginTop:24}}>
      <div style={{background:"linear-gradient(90deg,rgba(16,185,129,0.15),transparent)",borderLeft:"3px solid #10b981",padding:"10px 16px",marginBottom:20,borderRadius:"0 8px 8px 0"}}>
        <div style={{color:"#e2e8f0",fontWeight:700,fontSize:15}}>⚡ Advanced Simulations — Newton&apos;s First Law &amp; Inertia</div>
        <div style={{color:"#64748b",fontSize:12,marginTop:2}}>15 interactive simulations demonstrating inertia and the law of motion</div>
      </div>
      <FrictionlessPuckSim/><CoinCardPullSim/><TrainBrakingSim/><StringBallRelease/><SpaceProbeSim/>
      <PassengerBusSim/><BowlingBallSim/><PendulumSwingSim/><AsteroidSpaceSim/><WaterCupSim/>
      <HovercraftSim/><SeatbeltCrashSim/><TableclothPullSim/><InertiaComparisonSim/><FirstLawLabSim/>
    </div>
  );
}
