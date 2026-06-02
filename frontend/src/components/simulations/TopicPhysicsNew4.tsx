/**
 * FILE: TopicPhysicsNew4.tsx
 * LOCATION: src/components/simulations/TopicPhysicsNew4.tsx
 * PURPOSE: 6 professional canvas simulations for Topic 4 — Newton's Third Law
 *          Action & Reaction (CBSE Class 9, Chapter 9)
 *
 * Simulations:
 *   Pro4_ActionReactionCannon  — Cannon: ball forward, cannon backward (equal forces)
 *   Pro4_RocketPropulsion      — Rocket exhaust down → rocket lifts up
 *   Pro4_SwimmerWallPush       — Swimmer pushes wall → glides away
 *   Pro4_GunRecoilSim          — Bullet exits → gun recoils (momentum conservation)
 *   Pro4_BoatJump              — Person jumps from boat → boat moves opposite
 *   Pro4_BallWallBounce        — Ball hits wall: ball pushes wall, wall pushes ball back
 *
 * CBSE coverage: Newton's Third Law, action-reaction pairs, simultaneous forces,
 *   equal and opposite, free body diagrams of paired forces.
 *
 * LAST UPDATED: 2026-06-01
 */

"use client";
import { useRef, useEffect, useState } from "react";

const C={bg:"#07101f",panel:"#0f1c2e",surface:"#162032",border:"#1e3050",
  right:"#22c55e",left:"#ef4444",net:"#f59e0b",gravity:"#f97316",normal:"#a78bfa",
  text:"#e2e8f0",textDim:"#94a3b8",textFaint:"#334155"};
function rRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  ctx.beginPath();ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);ctx.closePath();
}
function arrow(ctx:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,color:string,lw=2.5,lbl=""){
  const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);if(len<3)return;
  const angle=Math.atan2(dy,dx),hw=Math.min(14,len*0.38);
  ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=lw;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x2,y2);
  ctx.lineTo(x2-hw*Math.cos(angle-0.42),y2-hw*Math.sin(angle-0.42));
  ctx.lineTo(x2-hw*Math.cos(angle+0.42),y2-hw*Math.sin(angle+0.42));
  ctx.closePath();ctx.fill();
  if(lbl){ctx.font="bold 11px Inter,system-ui,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
    const mx=(x1+x2)/2,my=(y1+y2)/2-13;ctx.fillStyle="rgba(7,16,31,0.85)";
    const tw=ctx.measureText(lbl).width;ctx.fillRect(mx-tw/2-4,my-8,tw+8,16);
    ctx.fillStyle=color;ctx.fillText(lbl,mx,my);}
  ctx.restore();
}
function txt(ctx:CanvasRenderingContext2D,t:string,x:number,y:number,color:string,size=12,align:CanvasTextAlign="center"){
  ctx.save();ctx.fillStyle=color;ctx.font=`${size}px Inter,system-ui,sans-serif`;
  ctx.textAlign=align;ctx.textBaseline="middle";ctx.fillText(t,x,y);ctx.restore();
}
function dots(ctx:CanvasRenderingContext2D,W:number,H:number){
  ctx.save();ctx.fillStyle="rgba(99,102,241,0.12)";
  for(let x=20;x<W;x+=30)for(let y=20;y<H;y+=30){ctx.beginPath();ctx.arc(x,y,1,0,Math.PI*2);ctx.fill();}
  ctx.restore();
}
const WRAP:React.CSSProperties={background:C.bg,border:`1px solid ${C.border}`,borderRadius:18,overflow:"hidden",fontFamily:"Inter,system-ui,sans-serif"};
const HEAD:React.CSSProperties={padding:"16px 22px 12px",borderBottom:`1px solid ${C.border}`};
const TITLE:React.CSSProperties={margin:0,fontSize:15,fontWeight:700,color:C.text,letterSpacing:"-0.01em"};
const DESC:React.CSSProperties={margin:"3px 0 0",fontSize:12,color:C.textDim,lineHeight:1.5};
const CONCEPT:React.CSSProperties={padding:"10px 22px",background:"rgba(37,99,235,0.06)",borderTop:`1px solid ${C.border}`,fontSize:11.5,color:C.textDim,lineHeight:1.6};
const CTRLS:React.CSSProperties={padding:"12px 22px",display:"flex",flexWrap:"wrap" as const,gap:14,borderTop:`1px solid ${C.border}`};
const SW:React.CSSProperties={display:"flex",flexDirection:"column" as const,gap:3,flex:1,minWidth:150};

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 1 — Cannon Action-Reaction
 * Physics: m_ball·v_ball = m_cannon·v_cannon (momentum conservation = 3rd law)
 * Learning: Action = ball pushed forward; Reaction = cannon pushed backward
 * ══════════════════════════════════════════════════════════════════ */
export function Pro4_ActionReactionCannon() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({phase:"ready" as "ready"|"fired",cannonX:260,ballX:310,ballV:0,cannonV:0});
  const [cannonM,setCannonM]=useState(50);
  const [ballM,setBallM]=useState(5);
  const cmR=useRef(cannonM); const bmR=useRef(ballM);
  useEffect(()=>{cmR.current=cannonM;bmR.current=ballM;},[cannonM,ballM]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const BY=H-80;
    const reset=()=>{st.current={phase:"ready",cannonX:240,ballX:300,ballV:0,cannonV:0};};
    reset();
    let last=performance.now();

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;
      const s=st.current;
      if(s.phase==="fired"){
        s.ballX+=s.ballV*dt*35;
        s.cannonX+=s.cannonV*dt*35;
        if(s.ballX>W+60||s.cannonX<-100) reset();
      }

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);
      ctx.fillStyle=C.surface;ctx.fillRect(0,BY,W,H-BY);
      ctx.fillStyle=C.border;ctx.fillRect(0,BY,W,2);

      // Cannon body
      const CW=80,CH=40;
      ctx.fillStyle="#374151";rRect(ctx,s.cannonX,BY-CH,CW,CH,6);ctx.fill();
      ctx.fillStyle="#4b5563";rRect(ctx,s.cannonX+CW-4,BY-CH/2-6,30,12,4);ctx.fill();
      // Cannon wheels
      [s.cannonX+15,s.cannonX+65].forEach(wx=>{
        ctx.fillStyle="#1e293b";ctx.beginPath();ctx.arc(wx,BY,14,0,Math.PI*2);ctx.fill();
        ctx.fillStyle="#374151";ctx.beginPath();ctx.arc(wx,BY,8,0,Math.PI*2);ctx.fill();
      });
      txt(ctx,`${cmR.current}kg`,s.cannonX+CW/2,BY-CH/2,C.text,10);

      // Ball
      const ballGrad=ctx.createRadialGradient(s.ballX-3,BY-CH/2-3,2,s.ballX,BY-CH/2,12);
      ballGrad.addColorStop(0,"#fbbf24");ballGrad.addColorStop(1,"#d97706");
      ctx.fillStyle=ballGrad;ctx.beginPath();ctx.arc(s.ballX,BY-CH/2,12,0,Math.PI*2);ctx.fill();
      txt(ctx,`${bmR.current}kg`,s.ballX,BY-CH/2+26,C.textDim,9);

      // Force arrows (when fired)
      if(s.phase==="fired"){
        arrow(ctx,s.ballX,BY-CH/2,s.ballX+60,BY-CH/2,C.right,3,"Action");
        arrow(ctx,s.cannonX+CW/2,BY-CH/2,s.cannonX+CW/2-60,BY-CH/2,C.left,3,"Reaction");
      }

      // Info
      const bv=s.phase==="fired"?s.ballV:0, cv_=s.phase==="fired"?-s.cannonV:0;
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,200,95,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,200,95,8);ctx.stroke();
      txt(ctx,"Newton's 3rd Law",110,26,C.textDim,10);
      txt(ctx,`Ball v = +${bv.toFixed(1)} m/s →`,110,42,C.right,11);
      txt(ctx,`Cannon v = -${cv_.toFixed(1)} m/s ←`,110,57,C.left,11);
      txt(ctx,`p_ball = ${(bmR.current*bv).toFixed(0)} kg·m/s`,110,72,C.right,10);
      txt(ctx,`p_cannon = ${(cmR.current*cv_).toFixed(0)} kg·m/s`,110,87,C.left,10);

      txt(ctx,s.phase==="ready"?"Click FIRE to launch!":"⚡ Equal forces: ball→ & ←cannon",
          W/2,22,s.phase==="ready"?C.textDim:C.net,11);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  const fire=()=>{
    const cm=cmR.current,bm=bmR.current;
    const ballV=10*(cm/bm)*0.4; // conserve momentum: bm*bv = cm*cv
    const cannonV=-10*0.4;
    st.current={phase:"fired",cannonX:240,ballX:300,ballV,cannonV};
  };

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>💥 Cannon — Action & Reaction Forces</h3>
        <p style={DESC}>Ball pushed forward (action) = equal force pushes cannon backward (reaction). Same magnitude, opposite direction.</p></div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept (Newton's 3rd Law):</strong>{" "}
        For every action there is an equal and opposite reaction. Forces always come in pairs —
        cannon exerts force on ball, ball exerts equal force back on cannon.
        Both forces exist simultaneously and act on DIFFERENT objects.</div>
      <div style={CTRLS}>
        <button onClick={fire} style={{padding:"7px 20px",borderRadius:8,border:"1px solid #22c55e",background:"rgba(34,197,94,0.12)",color:"#22c55e",cursor:"pointer",fontSize:13,fontWeight:700}}>🔥 FIRE!</button>
        <div style={SW}><span style={{fontSize:11,color:C.normal}}>Cannon mass: {cannonM} kg</span>
          <input type="range" min={20} max={200} value={cannonM} onChange={e=>setCannonM(+e.target.value)} style={{accentColor:C.normal}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Ball mass: {ballM} kg</span>
          <input type="range" min={1} max={20} value={ballM} onChange={e=>setBallM(+e.target.value)} style={{accentColor:C.right}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 2 — Rocket Propulsion (3rd Law)
 * Physics: Exhaust gas pushed DOWN (action) → rocket pushed UP (reaction)
 * Learning: Rockets don't need air to push against — they push their own exhaust
 * ══════════════════════════════════════════════════════════════════ */
export function Pro4_RocketPropulsion() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({y:0,v:0,exhaustY:0,exhaustAlpha:1});
  const [thrust,setThrust]=useState(3);
  const tR=useRef(thrust);
  useEffect(()=>{tR.current=thrust;},[thrust]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const GROUND=H-50;
    st.current={y:0,v:0,exhaustY:0,exhaustAlpha:1};
    let last=performance.now(),t=0;

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;t+=dt;
      const s=st.current,th=tR.current;
      s.v+=th*dt;
      s.y+=s.v*dt*20;
      if(s.y>GROUND-70){s.y=GROUND-70;s.v=0;}
      if(s.y<0){s.y=0;}
      const ry=GROUND-70-s.y;

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);

      // Space/sky gradient
      const sky=ctx.createLinearGradient(0,0,0,GROUND);
      sky.addColorStop(0,"#020817");sky.addColorStop(0.7,"#0f172a");sky.addColorStop(1,"#1e3050");
      ctx.fillStyle=sky;ctx.fillRect(0,0,W,GROUND);

      // Stars
      [50,120,200,340,450,520,90,290,400].forEach((sx,i)=>{
        const sy=20+i*30,r=0.5+0.5*Math.sin(t+i);
        ctx.fillStyle=`rgba(226,232,240,${r})`;ctx.beginPath();ctx.arc(sx,sy%120+10,1,0,Math.PI*2);ctx.fill();
      });

      // Ground
      ctx.fillStyle="#1e3050";ctx.fillRect(0,GROUND,W,H-GROUND);

      // Exhaust gases (action: pushed DOWN)
      const eLen=th*15+Math.sin(t*20)*5;
      const flGrad=ctx.createLinearGradient(0,ry+68,0,ry+68+eLen);
      flGrad.addColorStop(0,"#fbbf24");flGrad.addColorStop(0.4,"#f97316");flGrad.addColorStop(1,"rgba(239,68,68,0)");
      ctx.fillStyle=flGrad;
      for(let w=0;w<3;w++){
        const wo=[-8,0,8][w];
        ctx.beginPath();ctx.moveTo(W/2+wo-6,ry+68);ctx.lineTo(W/2+wo+6,ry+68);
        ctx.lineTo(W/2+wo+Math.sin(t*15+w)*4,ry+68+eLen);ctx.closePath();ctx.fill();
      }
      // Exhaust action arrow
      arrow(ctx,W/2,ry+70,W/2,ry+70+th*20,C.left,3,"Action");
      txt(ctx,"Exhaust→DOWN",W/2+65,ry+70+th*10,C.left,10);

      // Rocket
      const rx=W/2-14;
      const rGrad=ctx.createLinearGradient(rx,ry,rx+28,ry);
      rGrad.addColorStop(0,"#e2e8f0");rGrad.addColorStop(0.5,"#94a3b8");rGrad.addColorStop(1,"#64748b");
      ctx.fillStyle=rGrad;rRect(ctx,rx,ry+14,28,56,4);ctx.fill();
      ctx.fillStyle="#ef4444";ctx.beginPath();ctx.moveTo(W/2,ry);ctx.lineTo(rx,ry+18);ctx.lineTo(rx+28,ry+18);ctx.closePath();ctx.fill();
      ctx.fillStyle="#64748b";
      ctx.beginPath();ctx.moveTo(rx,ry+66);ctx.lineTo(rx-12,ry+80);ctx.lineTo(rx,ry+54);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(rx+28,ry+66);ctx.lineTo(rx+40,ry+80);ctx.lineTo(rx+28,ry+54);ctx.closePath();ctx.fill();
      ctx.fillStyle="rgba(186,230,253,0.6)";ctx.beginPath();ctx.arc(W/2,ry+30,7,0,Math.PI*2);ctx.fill();

      // Reaction arrow (rocket goes UP)
      arrow(ctx,W/2,ry,W/2,ry-th*20,"#22c55e",3,"Reaction");
      txt(ctx,"Rocket→UP",W/2-60,ry-th*10,"#22c55e",10);

      // Labels
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,195,80,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,195,80,8);ctx.stroke();
      txt(ctx,"🚀 Newton's 3rd Law",102,26,C.textDim,10);
      txt(ctx,"Action: exhaust pushed DOWN",102,42,C.left,11);
      txt(ctx,"Reaction: rocket goes UP",102,57,C.right,11);
      txt(ctx,`Both forces EQUAL & OPPOSITE`,102,72,C.net,10);
      txt(ctx,`Alt: ${(s.y/20).toFixed(1)}m  v=${s.v.toFixed(1)}m/s`,W/2,H-15,C.textDim,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>🚀 Rocket Propulsion — Newton's 3rd Law in Space</h3>
        <p style={DESC}>Exhaust gases pushed backward (action) → rocket pushed forward (reaction). No air needed!</p></div>
      <canvas ref={cvs} width={580} height={320} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Rocket engines work in space because they push exhaust gas (action) — no air needed.
        By Newton's 3rd Law, exhaust gas pushes rocket equally in the opposite direction (reaction).
        The rocket does NOT push against air — it pushes against its own exhaust.</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Thrust Level: {thrust}</span>
          <input type="range" min={1} max={8} value={thrust} onChange={e=>{setThrust(+e.target.value);st.current={y:0,v:0,exhaustY:0,exhaustAlpha:1};}} style={{accentColor:C.right}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 3 — Swimmer Wall Push
 * Physics: Swimmer pushes wall (action) → wall pushes swimmer back (reaction)
 * Learning: 3rd Law pairs — you cannot push without being pushed back
 * ══════════════════════════════════════════════════════════════════ */
export function Pro4_SwimmerWallPush() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({phase:"ready" as "ready"|"push"|"glide",x:140,v:0,t:0});
  const [pushF,setPushF]=useState(300);
  const fR=useRef(pushF);
  useEffect(()=>{fR.current=pushF;},[pushF]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const WATER_Y=H-80;
    const reset=()=>{st.current={phase:"ready",x:140,v:0,t:0};};
    reset();
    let last=performance.now(),t=0;

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;t+=dt;
      const s=st.current;
      if(s.phase==="push"){
        s.t+=dt;
        if(s.t>0.2){s.v=fR.current/600*8;s.phase="glide";}
      } else if(s.phase==="glide"){
        s.x-=s.v*dt*30;
        s.v*=0.97; // water drag
        if(s.x<-50) reset();
      }

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      // Water
      const waterGrad=ctx.createLinearGradient(0,WATER_Y,0,H);
      waterGrad.addColorStop(0,"#0c4a6e");waterGrad.addColorStop(1,"#082f49");
      ctx.fillStyle=waterGrad;ctx.fillRect(0,WATER_Y,W,H-WATER_Y);
      // Water shimmer
      ctx.save();ctx.strokeStyle="rgba(125,211,252,0.3)";ctx.lineWidth=1;
      for(let wx=0;wx<W;wx+=18){
        const wy=WATER_Y+Math.sin(t*2+wx*0.1)*2;
        ctx.beginPath();ctx.moveTo(wx,wy);ctx.lineTo(wx+12,wy);ctx.stroke();
      }
      ctx.restore();

      // Pool wall (right side)
      ctx.fillStyle="#374151";ctx.fillRect(W-50,WATER_Y-40,16,80);
      ctx.fillStyle="#4b5563";ctx.fillRect(W-52,WATER_Y-40,4,80);
      txt(ctx,"WALL",W-42,WATER_Y-10,C.textDim,9);

      // Swimmer (stick figure in water)
      const sx=s.x;
      ctx.save();ctx.strokeStyle="#fbbf24";ctx.lineWidth=2.5;ctx.lineCap="round";
      ctx.fillStyle="#fbbf24";
      // Head
      ctx.beginPath();ctx.arc(sx,WATER_Y-22,9,0,Math.PI*2);ctx.fill();
      // Body
      ctx.beginPath();ctx.moveTo(sx,WATER_Y-13);ctx.lineTo(sx,WATER_Y-2);ctx.stroke();
      // Arms (reaching forward when pushing)
      const armAngle=s.phase==="push"?0.2:0.5;
      ctx.beginPath();ctx.moveTo(sx,WATER_Y-10);ctx.lineTo(sx+22,WATER_Y-6+armAngle*5);ctx.stroke();
      ctx.beginPath();ctx.moveTo(sx,WATER_Y-10);ctx.lineTo(sx-10,WATER_Y-2);ctx.stroke();
      // Legs
      ctx.beginPath();ctx.moveTo(sx,WATER_Y-2);ctx.lineTo(sx-14,WATER_Y+8);ctx.stroke();
      ctx.beginPath();ctx.moveTo(sx,WATER_Y-2);ctx.lineTo(sx-6,WATER_Y+10);ctx.stroke();
      ctx.restore();

      // Force arrows when pushing
      if(s.phase==="push"){
        const force=fR.current;
        arrow(ctx,sx+22,WATER_Y-10,sx+22+force*0.15,WATER_Y-10,C.right,2.5,`${force}N (Action on wall)`);
        arrow(ctx,W-50,WATER_Y-10,W-50-force*0.15,WATER_Y-10,C.left,2.5,`${force}N (Reaction on swimmer)`);
      }
      if(s.phase==="glide"){
        arrow(ctx,sx,WATER_Y-22,sx-s.v*15,WATER_Y-22,C.left,2.5,`v=${s.v.toFixed(1)}m/s`);
      }

      // Labels
      txt(ctx,s.phase==="ready"?"Click PUSH to start!":
             s.phase==="push"?"💪 Pushing wall → wall pushes back!":
             "🏊 Gliding away (reaction force)!",
          W/2,22,s.phase==="push"?C.net:s.phase==="glide"?C.right:C.textDim,11);
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,200,60,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,200,60,8);ctx.stroke();
      txt(ctx,"Action: swimmer pushes wall →",110,26,C.right,10);
      txt(ctx,"Reaction: wall pushes swimmer ←",110,40,C.left,10);
      txt(ctx,"Both forces = EQUAL in magnitude",110,54,C.net,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>🏊 Swimmer Wall Push — Action-Reaction in Water</h3>
        <p style={DESC}>Swimmer pushes wall (action). Wall pushes swimmer back with equal force (reaction). Swimmer glides away.</p></div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        When a swimmer pushes the pool wall, the wall pushes back with an equal and opposite force.
        You cannot exert a force without the other object exerting an equal force back on you.
        Action and reaction ALWAYS act on different objects simultaneously.</div>
      <div style={CTRLS}>
        <button onClick={()=>st.current.phase="push"} style={{padding:"7px 18px",borderRadius:8,border:"1px solid #22c55e",background:"rgba(34,197,94,0.12)",color:"#22c55e",cursor:"pointer",fontSize:13,fontWeight:600}}>💪 PUSH!</button>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Push Force: {pushF} N</span>
          <input type="range" min={100} max={600} value={pushF} onChange={e=>setPushF(+e.target.value)} style={{accentColor:C.right}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 4 — Gun Recoil
 * Physics: p_bullet = m_b×v_b → p_gun = m_g×v_g = -p_bullet
 * Learning: Same force fires bullet AND causes recoil — 3rd Law + momentum conservation
 * ══════════════════════════════════════════════════════════════════ */
export function Pro4_GunRecoilSim() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({gunX:250,bulletX:300,bulletV:0,gunV:0,phase:"ready" as "ready"|"fired"});
  const [gMass,setGMass]=useState(2.5);
  const [bMass,setBMass]=useState(0.01);
  const gmR=useRef(gMass); const bmR=useRef(bMass);
  useEffect(()=>{gmR.current=gMass;bmR.current=bMass;},[gMass,bMass]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const BY=H-90;
    const reset=()=>st.current={gunX:220,bulletX:270,bulletV:0,gunV:0,phase:"ready"};
    reset();
    let last=performance.now(),t=0;

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;t+=dt;
      const s=st.current;
      if(s.phase==="fired"){
        s.bulletX+=s.bulletV*dt*30;
        s.gunX+=s.gunV*dt*30;
        if(s.bulletX>W+50||s.gunX<-150) reset();
      }

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);
      ctx.fillStyle=C.surface;ctx.fillRect(0,BY,W,H-BY);
      ctx.fillStyle=C.border;ctx.fillRect(0,BY,W,2);

      // Gun (moving left on recoil)
      const gx=s.gunX;
      ctx.fillStyle="#374151";rRect(ctx,gx,BY-36,80,36,6);ctx.fill();
      ctx.fillStyle="#4b5563";rRect(ctx,gx+80,BY-22,28,14,4);ctx.fill();
      ctx.fillStyle="#6b7280";ctx.fillRect(gx+18,BY-44,40,10);
      txt(ctx,`${gMass}kg`,gx+40,BY-18,C.text,10);
      txt(ctx,"GUN",gx+40,BY-32,C.textDim,9);

      // Bullet
      const bx=s.bulletX;
      const bGrad=ctx.createRadialGradient(bx,BY-22,1,bx,BY-22,6);
      bGrad.addColorStop(0,"#fde68a");bGrad.addColorStop(1,"#d97706");
      ctx.fillStyle=bGrad;ctx.beginPath();ctx.ellipse(bx,BY-22,10,5,0,0,Math.PI*2);ctx.fill();

      // Muzzle flash
      if(s.phase==="fired"&&s.bulletX-270<30){
        ctx.fillStyle="rgba(251,191,36,0.7)";ctx.beginPath();ctx.arc(gx+108,BY-22,12+Math.random()*8,0,Math.PI*2);ctx.fill();
      }

      // Force arrows
      if(s.phase==="fired"){
        arrow(ctx,s.bulletX,BY-22,s.bulletX+50,BY-22,C.right,2.5,"Action →");
        arrow(ctx,s.gunX+40,BY-22,s.gunX+40-50,BY-22,C.left,2.5,"← Reaction");
      }

      const bv=s.bulletV, gv=-s.gunV;
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,205,100,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,205,100,8);ctx.stroke();
      txt(ctx,"Gun Recoil — 3rd Law",107,26,C.textDim,10);
      txt(ctx,`Bullet v = +${bv.toFixed(1)} m/s →`,107,42,C.right,11);
      txt(ctx,`Gun v = -${gv.toFixed(1)} m/s ←`,107,57,C.left,11);
      txt(ctx,`p_bullet = ${(bmR.current*bv).toFixed(3)} kg·m/s`,107,72,C.right,10);
      txt(ctx,`p_gun = ${(gmR.current*gv).toFixed(3)} kg·m/s`,107,87,C.left,10);
      txt(ctx,"Total momentum = 0 (conserved!)",107,100,C.net,10);

      txt(ctx,s.phase==="ready"?"Click FIRE to shoot!":"⚡ Equal opposite forces!",
          W/2,22,s.phase==="ready"?C.textDim:C.net,11);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  const fire=()=>{
    const gm=gmR.current,bm=bmR.current;
    // Conservation of momentum: 0 = bm*bv + gm*gv
    const bulletV=120*(gm/(bm+gm));
    const gunV=-120*(bm/(bm+gm));
    st.current={gunX:220,bulletX:270,bulletV,gunV,phase:"fired"};
  };

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>🔫 Gun Recoil — Action & Reaction + Momentum</h3>
        <p style={DESC}>Firing a bullet: bullet goes forward (action), gun recoils backward (reaction). Total momentum stays zero.</p></div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        When a gun fires, the charge pushes the bullet forward AND pushes the gun backward equally.
        A heavy gun recoils less than a light gun (same force, more mass → less acceleration).
        This is Newton's 3rd Law combined with momentum conservation.</div>
      <div style={CTRLS}>
        <button onClick={fire} style={{padding:"7px 16px",borderRadius:8,border:"1px solid #ef4444",background:"rgba(239,68,68,0.1)",color:"#ef4444",cursor:"pointer",fontSize:13,fontWeight:700}}>🔥 FIRE!</button>
        <div style={SW}><span style={{fontSize:11,color:C.normal}}>Gun mass: {gMass} kg</span>
          <input type="range" min={0.5} max={5} step={0.5} value={gMass} onChange={e=>setGMass(+e.target.value)} style={{accentColor:C.normal}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Bullet mass: {bMass} kg</span>
          <input type="range" min={0.005} max={0.05} step={0.005} value={bMass} onChange={e=>setBMass(+e.target.value)} style={{accentColor:C.right}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 5 — Person Jumps from Boat
 * Physics: p_person + p_boat = 0 (started from rest)
 *          m_p × v_p = -m_b × v_b
 * Learning: Person jumps forward → boat moves backward
 * ══════════════════════════════════════════════════════════════════ */
export function Pro4_BoatJump() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({boatX:240,personX:280,personV:0,boatV:0,phase:"ready" as "ready"|"jumped"});
  const [pM,setPM]=useState(60); const [bM,setBM]=useState(200);
  const pmR=useRef(pM); const bmR=useRef(bM);
  useEffect(()=>{pmR.current=pM;bmR.current=bM;},[pM,bM]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const WATER_Y=H-70;
    const reset=()=>st.current={boatX:200,personX:260,personV:0,boatV:0,phase:"ready"};
    reset();
    let last=performance.now(),t=0;

    function drawBoat(bx:number){
      // Hull
      ctx.fillStyle="#5b3911";
      ctx.beginPath();ctx.moveTo(bx,WATER_Y);ctx.lineTo(bx+120,WATER_Y);
      ctx.lineTo(bx+110,WATER_Y+25);ctx.lineTo(bx+10,WATER_Y+25);ctx.closePath();ctx.fill();
      ctx.fillStyle="#7c4a14";ctx.fillRect(bx+4,WATER_Y-4,112,6);
    }

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;t+=dt;
      const s=st.current;
      if(s.phase==="jumped"){
        s.personX+=s.personV*dt*40;
        s.boatX+=s.boatV*dt*40;
      }
      // Water wave
      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);
      const waterGrad=ctx.createLinearGradient(0,WATER_Y,0,H);
      waterGrad.addColorStop(0,"#0c4a6e");waterGrad.addColorStop(1,"#082f49");
      ctx.fillStyle=waterGrad;ctx.fillRect(0,WATER_Y,W,H-WATER_Y);
      ctx.save();ctx.strokeStyle="rgba(125,211,252,0.25)";ctx.lineWidth=1;
      for(let wx=0;wx<W;wx+=20){
        ctx.beginPath();ctx.moveTo(wx,WATER_Y+Math.sin(t*1.5+wx*0.05)*3);
        ctx.lineTo(wx+12,WATER_Y+Math.sin(t*1.5+wx*0.05)*3);ctx.stroke();
      }
      ctx.restore();

      drawBoat(s.boatX);

      // Person (stick figure)
      const px=s.personX;
      const py=WATER_Y-40;
      const jump=s.phase==="jumped"?-30:0;
      ctx.save();ctx.strokeStyle="#3b82f6";ctx.lineWidth=2.5;ctx.lineCap="round";
      ctx.fillStyle="#3b82f6";
      ctx.beginPath();ctx.arc(px,py+jump-10,9,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.moveTo(px,py+jump);ctx.lineTo(px,py+jump+22);ctx.stroke();
      ctx.beginPath();ctx.moveTo(px,py+jump+8);ctx.lineTo(px+14,py+jump+2);ctx.stroke();
      ctx.beginPath();ctx.moveTo(px,py+jump+8);ctx.lineTo(px-12,py+jump+6);ctx.stroke();
      ctx.beginPath();ctx.moveTo(px,py+jump+22);ctx.lineTo(px-8,py+jump+38);ctx.stroke();
      ctx.beginPath();ctx.moveTo(px,py+jump+22);ctx.lineTo(px+8,py+jump+38);ctx.stroke();
      ctx.restore();

      if(s.phase==="jumped"){
        arrow(ctx,px,py,px+s.personV*8,py,C.right,2.5,`v=${s.personV.toFixed(1)}m/s`);
        arrow(ctx,s.boatX+60,WATER_Y-15,s.boatX+60+s.boatV*8,WATER_Y-15,C.left,2.5,`v=${(-s.boatV).toFixed(2)}m/s`);
      }

      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,205,90,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,205,90,8);ctx.stroke();
      txt(ctx,"Boat Jump — 3rd Law + Momentum",107,26,C.textDim,10);
      txt(ctx,`Person: ${pM}kg → v=${s.personV.toFixed(1)}m/s`,107,42,C.right,11);
      txt(ctx,`Boat: ${bM}kg → v=${(-s.boatV).toFixed(2)}m/s`,107,57,C.left,11);
      txt(ctx,`m_p×v_p = ${(pmR.current*s.personV).toFixed(0)} kg·m/s`,107,72,C.right,10);
      txt(ctx,`m_b×v_b = ${(bmR.current*(-s.boatV)).toFixed(0)} kg·m/s`,107,87,C.left,10);

      txt(ctx,s.phase==="ready"?"Click JUMP to see 3rd Law!":"Person jumps→ boat pushes back!",
          W/2,22,s.phase==="ready"?C.textDim:C.net,11);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  const jump=()=>{
    const pm=pmR.current,bm=bmR.current;
    const personV=8*(bm/(pm+bm));
    const boatV=-8*(pm/(pm+bm));
    st.current={boatX:200,personX:260,personV,boatV,phase:"jumped"};
  };

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>🚣 Jumping from a Boat — 3rd Law + Conservation</h3>
        <p style={DESC}>Person jumps forward from a stationary boat. Boat slides backward. Total momentum stays at zero.</p></div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Person pushes boat backward (action on boat). Boat pushes person forward (reaction on person).
        By momentum conservation: m_person × v_person = m_boat × v_boat.
        Heavier boat → smaller recoil velocity (same momentum, more mass).</div>
      <div style={CTRLS}>
        <button onClick={jump} style={{padding:"7px 16px",borderRadius:8,border:"1px solid #22c55e",background:"rgba(34,197,94,0.1)",color:"#22c55e",cursor:"pointer",fontSize:13,fontWeight:600}}>🏃 JUMP!</button>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Person mass: {pM} kg</span>
          <input type="range" min={30} max={100} value={pM} onChange={e=>setPM(+e.target.value)} style={{accentColor:C.right}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.normal}}>Boat mass: {bM} kg</span>
          <input type="range" min={50} max={500} value={bM} onChange={e=>setBM(+e.target.value)} style={{accentColor:C.normal}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 6 — Ball Bounces off Wall (Action-Reaction Visualization)
 * Physics: Ball exerts F on wall; wall exerts -F on ball (elastic)
 * Learning: Visualize force pairs on a bouncing ball
 * ══════════════════════════════════════════════════════════════════ */
export function Pro4_BallWallBounce() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({x:80,v:5,contact:false,contactT:0});
  const [speed,setSpeed]=useState(5);
  const sR=useRef(speed);
  useEffect(()=>{sR.current=speed;},[speed]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const WALL_X=W-70,R=22,CY=H/2;
    st.current={x:80,v:sR.current,contact:false,contactT:0};
    let last=performance.now(),t=0;

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;t+=dt;
      const s=st.current;
      s.x+=s.v*dt*40;
      if(s.x+R>=WALL_X){s.x=WALL_X-R;s.v=-Math.abs(sR.current);s.contact=true;s.contactT=0;}
      if(s.x-R<=40){s.x=40+R;s.v=Math.abs(sR.current);}
      if(s.contact){s.contactT+=dt;if(s.contactT>0.15)s.contact=false;}

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);

      // Floor
      ctx.fillStyle=C.surface;ctx.fillRect(0,H/2+R+10,W,H);
      ctx.fillStyle=C.border;ctx.fillRect(0,H/2+R+10,W,2);

      // Left wall (starting boundary)
      ctx.fillStyle=C.surface;ctx.fillRect(0,0,40,H);
      ctx.fillStyle=C.border;ctx.fillRect(40,0,2,H);

      // Right wall
      const wallShake=s.contact?Math.sin(s.contactT*80)*2:0;
      ctx.fillStyle=s.contact?"#374151":"#1e293b";
      ctx.fillRect(WALL_X+wallShake,0,40,H);
      ctx.fillStyle="#4b5563";ctx.fillRect(WALL_X+wallShake,0,4,H);

      // Contact force visualization (when ball hits wall)
      if(s.contact){
        // Ball pushes wall (action)
        const fLen=Math.abs(sR.current)*15;
        arrow(ctx,s.x+R,CY,s.x+R+fLen,CY,C.right,3,"Action on wall →");
        // Wall pushes ball (reaction)
        arrow(ctx,WALL_X,CY,WALL_X-fLen,CY,C.left,3,"← Reaction on ball");
        // Impact glow
        ctx.fillStyle="rgba(245,158,11,0.2)";ctx.beginPath();ctx.arc(WALL_X,CY,20,0,Math.PI*2);ctx.fill();
      }

      // Ball with gradient
      const ballGrad=ctx.createRadialGradient(s.x-6,CY-6,2,s.x,CY,R);
      ballGrad.addColorStop(0,s.contact?"#fbbf24":"#60a5fa");
      ballGrad.addColorStop(1,s.contact?"#d97706":"#1e40af");
      ctx.fillStyle=ballGrad;ctx.beginPath();ctx.arc(s.x,CY,R,0,Math.PI*2);ctx.fill();
      // Ball shine
      ctx.fillStyle="rgba(255,255,255,0.2)";ctx.beginPath();ctx.arc(s.x-6,CY-6,7,0,Math.PI*2);ctx.fill();

      // Velocity arrow on ball
      if(!s.contact){
        arrow(ctx,s.x,CY,s.x+s.v*12,CY,s.v>0?C.right:C.left,2,`v=${Math.abs(s.v).toFixed(1)}m/s`);
      }

      // Info
      txt(ctx,s.contact?"⚡ CONTACT: Action-Reaction pair active!":"Ball approaches wall →",
          W/2,25,s.contact?C.net:C.textDim,11);
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,205,75,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,205,75,8);ctx.stroke();
      txt(ctx,"Ball & Wall Force Pairs",107,26,C.textDim,10);
      txt(ctx,"Ball → Wall (Action)",107,42,C.right,11);
      txt(ctx,"Wall → Ball (Reaction)",107,57,C.left,11);
      txt(ctx,"Equal magnitude, opposite direction",107,70,C.net,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[speed]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>🎾 Ball Bouncing — Force Pairs During Impact</h3>
        <p style={DESC}>During contact, ball pushes wall (action) and wall pushes ball back (reaction). See both forces simultaneously.</p></div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        During the brief moment of contact, the ball exerts a force on the wall (action)
        AND the wall exerts an equal and opposite force on the ball (reaction) simultaneously.
        The reaction force reverses the ball's direction. Both forces have the exact same magnitude.</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Ball Speed: {speed} m/s</span>
          <input type="range" min={1} max={12} value={speed} onChange={e=>{setSpeed(+e.target.value);st.current.v=+e.target.value;}} style={{accentColor:C.right}}/></div>
      </div>
    </div>
  );
}
