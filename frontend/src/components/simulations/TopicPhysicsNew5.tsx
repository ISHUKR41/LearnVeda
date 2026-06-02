/**
 * FILE: TopicPhysicsNew5.tsx
 * LOCATION: src/components/simulations/TopicPhysicsNew5.tsx
 * PURPOSE: 6 professional canvas simulations for Topic 5 — Conservation of Momentum
 *          (CBSE Class 9, Chapter 9 — Force & Laws of Motion)
 *
 * Simulations:
 *   Pro5_ElasticCollision1D  — Two balls: elastic collision, p and KE conserved
 *   Pro5_InelasticCollision  — Clay balls stick together, p conserved but KE not
 *   Pro5_NewtonsCradle       — Newton's cradle with proper momentum transfer
 *   Pro5_ExplosionMomentum   — Object at rest explodes into two fragments
 *   Pro5_RocketMomentum      — Fuel ejection → rocket accelerates (Tsiolkovsky)
 *   Pro5_MomentumGraph       — Live momentum bar chart during collision
 *
 * CBSE coverage: Law of conservation of momentum, elastic/inelastic collision,
 *   explosion, examples and derivation from Newton's 3rd Law.
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

/* Elastic collision equations:
 *   v1' = (m1-m2)v1/(m1+m2) + 2m2·v2/(m1+m2)
 *   v2' = 2m1·v1/(m1+m2) + (m2-m1)v2/(m1+m2)
 */
function elasticCollision(m1:number,v1:number,m2:number,v2:number):[number,number]{
  const v1n=((m1-m2)*v1+2*m2*v2)/(m1+m2);
  const v2n=(2*m1*v1+(m2-m1)*v2)/(m1+m2);
  return [v1n,v2n];
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 1 — Elastic Collision in 1D
 * Physics: Both p and KE conserved. v1',v2' from elastic collision equations.
 * Learning: Total momentum before = total momentum after
 * ══════════════════════════════════════════════════════════════════ */
export function Pro5_ElasticCollision1D() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({b1x:80,b2x:400,b1v:0,b2v:0,collided:false});
  const [m1,setM1]=useState(8); const [m2,setM2]=useState(5);
  const [v1i,setV1i]=useState(4);
  const m1R=useRef(m1); const m2R=useRef(m2); const v1R=useRef(v1i);
  useEffect(()=>{m1R.current=m1;m2R.current=m2;v1R.current=v1i;},[m1,m2,v1i]);

  const reset=()=>{st.current={b1x:80,b2x:400,b1v:v1R.current,b2v:0,collided:false};};

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const CY=H/2+10;
    reset();
    let last=performance.now();
    const R1=()=>12+m1R.current*1.2, R2=()=>12+m2R.current*1.2;

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;
      const s=st.current;
      const r1=R1(),r2=R2();

      // Collision check
      if(!s.collided && s.b1x+r1 >= s.b2x-r2){
        const [v1n,v2n]=elasticCollision(m1R.current,s.b1v,m2R.current,s.b2v);
        s.b1v=v1n; s.b2v=v2n; s.collided=true;
        s.b1x=s.b2x-r1-r2;
      }
      s.b1x+=s.b1v*dt*40; s.b2x+=s.b2v*dt*40;
      if(s.b1x<r1){s.b1x=r1;s.b1v=Math.abs(s.b1v);}
      if(s.b2x>W-r2){s.b2x=W-r2;s.b2v=-Math.abs(s.b2v);}
      if(s.b2x<r2+r1+10&&s.collided){reset();}

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);
      ctx.fillStyle=C.surface;ctx.fillRect(0,CY+20,W,H-CY-20);
      ctx.fillStyle=C.border;ctx.fillRect(0,CY+20,W,2);

      // Ball 1 (blue)
      const g1=ctx.createRadialGradient(s.b1x-r1*0.3,CY-r1*0.3,2,s.b1x,CY,r1);
      g1.addColorStop(0,"#60a5fa");g1.addColorStop(1,"#1e40af");
      ctx.fillStyle=g1;ctx.beginPath();ctx.arc(s.b1x,CY,r1,0,Math.PI*2);ctx.fill();
      txt(ctx,`m₁=${m1}kg`,s.b1x,CY+r1+14,C.right,10);

      // Ball 2 (amber)
      const g2=ctx.createRadialGradient(s.b2x-r2*0.3,CY-r2*0.3,2,s.b2x,CY,r2);
      g2.addColorStop(0,"#fde68a");g2.addColorStop(1,"#d97706");
      ctx.fillStyle=g2;ctx.beginPath();ctx.arc(s.b2x,CY,r2,0,Math.PI*2);ctx.fill();
      txt(ctx,`m₂=${m2}kg`,s.b2x,CY+r2+14,C.net,10);

      // Velocity arrows
      if(Math.abs(s.b1v)>0.05) arrow(ctx,s.b1x,CY,s.b1x+s.b1v*12,CY,C.right,2.5,`${s.b1v.toFixed(1)}m/s`);
      if(Math.abs(s.b2v)>0.05) arrow(ctx,s.b2x,CY,s.b2x+s.b2v*12,CY,C.net,2.5,`${s.b2v.toFixed(1)}m/s`);

      // Impact flash
      if(s.collided&&Math.abs(s.b1x+R1()-s.b2x+R2())<10){
        ctx.fillStyle="rgba(255,255,200,0.3)";ctx.beginPath();ctx.arc((s.b1x+s.b2x)/2,CY,20,0,Math.PI*2);ctx.fill();
      }

      // Momentum display
      const p1=m1R.current*s.b1v, p2=m2R.current*s.b2v;
      const pTotal=p1+p2;
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,210,95,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,210,95,8);ctx.stroke();
      txt(ctx,"Elastic Collision — Momentum",115,26,C.textDim,10);
      txt(ctx,`p₁ = m₁v₁ = ${p1.toFixed(1)} kg·m/s`,115,42,C.right,11);
      txt(ctx,`p₂ = m₂v₂ = ${p2.toFixed(1)} kg·m/s`,115,57,C.net,11);
      txt(ctx,`p_total = ${pTotal.toFixed(1)} kg·m/s`,115,72,C.text,12);
      txt(ctx,s.collided?"✅ p conserved! (same as before)":"Before: p = "+((m1R.current*v1R.current)).toFixed(1)+" kg·m/s",
          115,88,s.collided?"#22c55e":C.textDim,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>⚡ Elastic Collision — Momentum & KE Both Conserved</h3>
        <p style={DESC}>Ball 1 hits Ball 2. In elastic collision, total momentum AND kinetic energy are conserved.</p></div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Law of Conservation of Momentum: p_before = p_after = constant (no external forces).
        In elastic collision, KE is also conserved. In inelastic collision, p is conserved but some KE
        is lost as heat/sound. Total momentum of an isolated system NEVER changes.</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>m₁: {m1} kg</span>
          <input type="range" min={1} max={20} value={m1} onChange={e=>{setM1(+e.target.value);reset();}} style={{accentColor:C.right}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.net}}>m₂: {m2} kg</span>
          <input type="range" min={1} max={20} value={m2} onChange={e=>{setM2(+e.target.value);reset();}} style={{accentColor:C.net}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.normal}}>v₁ (initial): {v1i} m/s</span>
          <input type="range" min={1} max={10} value={v1i} onChange={e=>{setV1i(+e.target.value);reset();}} style={{accentColor:C.normal}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 2 — Perfectly Inelastic (Sticky) Collision
 * Physics: m1v1 = (m1+m2)v_f  → v_f = m1v1/(m1+m2)
 * Learning: Objects stick together, momentum conserved but KE is not
 * ══════════════════════════════════════════════════════════════════ */
export function Pro5_InelasticCollision() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const [m1,setM1]=useState(10); const [m2,setM2]=useState(5);
  const [v1i,setV1i]=useState(6);
  const m1R=useRef(m1); const m2R=useRef(m2); const vR=useRef(v1i);
  useEffect(()=>{m1R.current=m1;m2R.current=m2;vR.current=v1i;},[m1,m2,v1i]);
  const st=useRef({x1:80,x2:420,v:0,stuck:false});

  const reset=()=>st.current={x1:80,x2:420,v:vR.current,stuck:false};

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const CY=H/2+10;
    reset();
    let last=performance.now();

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;
      const s=st.current;
      const m1_=m1R.current,m2_=m2R.current,v_=vR.current;
      const r1=14+m1_,r2=12+m2_;

      if(!s.stuck){
        s.x1+=s.v*dt*40;
        if(s.x1+r1>=s.x2-r2){
          // Perfectly inelastic: stick together
          const vf=(m1_*v_)/(m1_+m2_);
          s.v=vf; s.stuck=true;
          s.x1=s.x2-r1-r2;
        }
      } else {
        const combined_r=r1+r2;
        s.x1+=s.v*dt*40;
        s.x2=s.x1+r1+r2;
        if(s.x2>W-r2){s.x1=W-combined_r;s.v*=-0.4;}
        if(s.x1<r1){s.x1=r1;s.v=Math.abs(s.v)*0.4;}
        if(Math.abs(s.v)<0.05) setTimeout(reset,1500);
      }

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);
      ctx.fillStyle=C.surface;ctx.fillRect(0,CY+22,W,H-CY-22);
      ctx.fillStyle=C.border;ctx.fillRect(0,CY+22,W,2);

      // Clay ball 1
      const g1=ctx.createRadialGradient(s.x1-r1*0.3,CY-r1*0.3,2,s.x1,CY,r1);
      g1.addColorStop(0,"#a78bfa");g1.addColorStop(1,"#6d28d9");
      ctx.fillStyle=g1;ctx.beginPath();ctx.arc(s.x1,CY,r1,0,Math.PI*2);ctx.fill();
      txt(ctx,`m₁=${m1_}kg`,s.x1,CY+r1+14,C.normal,10);

      // Clay ball 2
      const g2=ctx.createRadialGradient(s.x2-r2*0.3,CY-r2*0.3,2,s.x2,CY,r2);
      g2.addColorStop(0,"#fde68a");g2.addColorStop(1,"#d97706");
      ctx.fillStyle=g2;ctx.beginPath();ctx.arc(s.x2,CY,r2,0,Math.PI*2);ctx.fill();
      txt(ctx,`m₂=${m2_}kg`,s.x2,CY+r2+14,C.net,10);

      // Stuck indicator
      if(s.stuck){
        ctx.strokeStyle=C.net;ctx.lineWidth=2;ctx.setLineDash([4,3]);
        ctx.beginPath();ctx.arc((s.x1+s.x2)/2,CY,r1+r2+4,0,Math.PI*2);ctx.stroke();
        ctx.setLineDash([]);
        txt(ctx,"STUCK",( s.x1+s.x2)/2,CY-r1-16,C.net,10);
      }

      if(!s.stuck && s.v>0.05)
        arrow(ctx,s.x1,CY,s.x1+s.v*12,CY,C.right,2.5,`v₁=${s.v.toFixed(1)}m/s`);
      if(s.stuck)
        arrow(ctx,s.x1,CY,s.x1+s.v*12,CY,C.normal,2.5,`vf=${s.v.toFixed(2)}m/s`);

      // KE comparison
      const KE_before=0.5*m1_*v_*v_;
      const vf=(m1_*v_)/(m1_+m2_);
      const KE_after=0.5*(m1_+m2_)*vf*vf;
      const KE_lost=KE_before-KE_after;
      const p_before=m1_*v_, p_after=(m1_+m2_)*vf;

      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,215,105,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,215,105,8);ctx.stroke();
      txt(ctx,"Inelastic Collision Analysis",117,26,C.textDim,10);
      txt(ctx,`p_before = ${p_before.toFixed(1)} kg·m/s`,117,42,C.right,11);
      txt(ctx,`p_after  = ${p_after.toFixed(1)} kg·m/s`,117,57,C.right,11);
      txt(ctx,`p conserved ✅`,117,72,"#22c55e",11);
      txt(ctx,`KE lost = ${KE_lost.toFixed(1)} J (heat/sound)`,117,87,C.left,11);
      txt(ctx,`KE NOT conserved ⚠️`,117,100,C.left,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>🪨 Inelastic Collision — Balls Stick Together</h3>
        <p style={DESC}>Clay balls stick on impact (perfectly inelastic). Momentum is conserved but kinetic energy is lost.</p></div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Perfectly inelastic: objects stick together. v_final = m₁v₁/(m₁+m₂).
        Momentum IS conserved (no external forces). KE is NOT conserved (converted to heat, sound, deformation).
        Real collisions (cars, clay) are inelastic.</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.normal}}>m₁: {m1} kg</span>
          <input type="range" min={2} max={20} value={m1} onChange={e=>{setM1(+e.target.value);reset();}} style={{accentColor:C.normal}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.net}}>m₂: {m2} kg</span>
          <input type="range" min={2} max={20} value={m2} onChange={e=>{setM2(+e.target.value);reset();}} style={{accentColor:C.net}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>v₁: {v1i} m/s</span>
          <input type="range" min={1} max={10} value={v1i} onChange={e=>{setV1i(+e.target.value);reset();}} style={{accentColor:C.right}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 3 — Newton's Cradle
 * Physics: 1 ball hits 5 → 1 ball exits. n balls hit → n balls exit.
 *          Momentum AND energy both conserved in elastic collision.
 * ══════════════════════════════════════════════════════════════════ */
export function Pro5_NewtonsCradle() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef<{ang:number,vel:number,right:boolean}[]>([]);
  const [nBalls,setNBalls]=useState(1); // number of balls in initial swing

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const N=5,L=100,R=18;
    const CX=W/2,topY=60;
    const spacing=R*2+2;
    const g=9.8;

    // Initialize: all at rest, leftmost 'nBalls' pulled to angle 45°
    const init=()=>{
      st.current=Array.from({length:N},(_,i)=>{
        const pulled=i<nBalls; // pulled back (on left)
        return {ang:pulled?-0.7:0, vel:0, right:false};
      });
    };
    init();
    let last=performance.now();

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;
      const balls=st.current;

      // Pendulum physics for each ball
      balls.forEach(b=>{
        b.vel+=-g/L*Math.sin(b.ang)*dt*2;
        b.vel*=0.999; // tiny air resistance
        b.ang+=b.vel*dt;
      });

      // Collision: check if left-side balls reach center AND right-side balls
      // Simplified model: detect when leftmost ball crosses center
      const leftBalls=balls.filter(b=>b.ang<-0.02&&b.vel>0);
      const rightBalls=balls.filter(b=>b.ang>0.02&&b.vel<0);

      // Momentum transfer at rest position (angle≈0, velocity peak)
      for(let i=0;i<N-1;i++){
        if(balls[i].ang>=-0.05&&balls[i].ang<=0.05&&balls[i].vel>0.05&&balls[i+1].ang<0.05){
          // Transfer momentum: elastic, equal masses → swap velocities
          const tmp=balls[i].vel;
          balls[i].vel=balls[i+1].vel;
          balls[i+1].vel=tmp;
        }
        if(balls[i].ang>=-0.05&&balls[i].ang<=0.05&&balls[i].vel<-0.05&&balls[i-1]&&balls[i-1].ang>-0.05){
          const tmp=balls[i].vel;
          balls[i].vel=balls[i-1]?.vel||0;
          if(balls[i-1]) balls[i-1].vel=tmp;
        }
      }

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);

      // Frame (top bar)
      ctx.fillStyle="#374151";
      ctx.fillRect(CX-(N*spacing)/2-20,topY-10,N*spacing+40,10);
      // Left and right supports
      ctx.fillRect(CX-(N*spacing)/2-20,topY-80,8,80);
      ctx.fillRect(CX+(N*spacing)/2+12,topY-80,8,80);

      // Draw strings and balls
      balls.forEach((b,i)=>{
        const bx=CX+(i-Math.floor(N/2))*spacing;
        const ballX=bx+Math.sin(b.ang)*L;
        const ballY=topY+Math.cos(b.ang)*L;

        // String
        ctx.strokeStyle="#64748b";ctx.lineWidth=1.5;
        ctx.beginPath();ctx.moveTo(bx,topY);ctx.lineTo(ballX,ballY);ctx.stroke();

        // Ball
        const g_=ctx.createRadialGradient(ballX-R*0.3,ballY-R*0.3,2,ballX,ballY,R);
        const col=b.ang<-0.05?"#60a5fa":b.ang>0.05?"#fbbf24":"#e2e8f0";
        g_.addColorStop(0,col);g_.addColorStop(1,col+"88");
        ctx.fillStyle=g_;ctx.beginPath();ctx.arc(ballX,ballY,R,0,Math.PI*2);ctx.fill();
        ctx.strokeStyle="rgba(255,255,255,0.2)";ctx.lineWidth=1;ctx.stroke();
      });

      // Labels
      const totalP=balls.reduce((s,b)=>s+b.vel,0).toFixed(2);
      txt(ctx,`Total p ≈ ${totalP} (conserved)`,W/2,H-20,C.net,11);
      txt(ctx,"Newton's Cradle — Elastic p Transfer",W/2,28,C.textDim,11);
      txt(ctx,`${nBalls} ball(s) swing → ${nBalls} ball(s) exit other side`,W/2,44,C.text,11);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>{cancelAnimationFrame(raf.current);};
  },[nBalls]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>🎱 Newton's Cradle — Momentum Chain Transfer</h3>
        <p style={DESC}>Pull n balls → n balls exit the other side. Momentum transfers through the chain. KE and p both conserved.</p></div>
      <canvas ref={cvs} width={580} height={280} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        In Newton's cradle, momentum passes through stationary balls (equal masses → velocity swaps).
        1 ball hits → 1 ball exits at the same speed. 2 balls hit → 2 balls exit.
        This perfectly demonstrates conservation of both momentum AND kinetic energy.</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.net}}>Pull n balls: {nBalls}</span>
          <input type="range" min={1} max={4} step={1} value={nBalls} onChange={e=>setNBalls(+e.target.value)} style={{accentColor:C.net}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 4 — Explosion from Rest
 * Physics: p_initial = 0; m1·v1 + m2·v2 = 0 → v1/v2 = -m2/m1
 * Learning: Explosion conserves momentum. Lighter fragment moves faster.
 * ══════════════════════════════════════════════════════════════════ */
export function Pro5_ExplosionMomentum() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const [m1,setM1]=useState(8); const [m2,setM2]=useState(4);
  const m1R=useRef(m1); const m2R=useRef(m2);
  useEffect(()=>{m1R.current=m1;m2R.current=m2;},[m1,m2]);
  const st=useRef({f1x:290,f2x:290,v1:0,v2:0,phase:"ready" as "ready"|"exploded"});

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const CY=H/2;
    const reset=()=>st.current={f1x:W/2,f2x:W/2,v1:0,v2:0,phase:"ready"};
    reset();
    let last=performance.now(),t=0;

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;t+=dt;
      const s=st.current,m1_=m1R.current,m2_=m2R.current;

      if(s.phase==="exploded"){
        s.f1x+=s.v1*dt*40;
        s.f2x+=s.v2*dt*40;
        if(s.f1x<-60||s.f2x>W+60) reset();
      }

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);

      // Ground
      ctx.fillStyle=C.surface;ctx.fillRect(0,CY+35,W,H-CY-35);
      ctx.fillStyle=C.border;ctx.fillRect(0,CY+35,W,2);

      if(s.phase==="ready"){
        // Combined object at center
        const g=ctx.createRadialGradient(W/2-5,CY-5,4,W/2,CY,30);
        g.addColorStop(0,"#8b5cf6");g.addColorStop(1,"#4c1d95");
        ctx.fillStyle=g;ctx.beginPath();ctx.arc(W/2,CY,30,0,Math.PI*2);ctx.fill();
        // Fuse animation
        const fuseLen=20+Math.sin(t*6)*3;
        ctx.strokeStyle="#fbbf24";ctx.lineWidth=2;ctx.setLineDash([3,2]);
        ctx.beginPath();ctx.moveTo(W/2,CY-30);ctx.lineTo(W/2,CY-30-fuseLen);ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle="#fbbf24";ctx.beginPath();ctx.arc(W/2,CY-30-fuseLen,4,0,Math.PI*2);ctx.fill();
        txt(ctx,`${m1_+m2_} kg`,W/2,CY,C.text,12);
        txt(ctx,"Click EXPLODE!",W/2,CY+55,C.textDim,11);
      } else {
        // Fragment 1 (heavier, moves left)
        const r1=10+m1_*1.2;
        const g1=ctx.createRadialGradient(s.f1x-r1*0.3,CY-r1*0.3,2,s.f1x,CY,r1);
        g1.addColorStop(0,"#60a5fa");g1.addColorStop(1,"#1e40af");
        ctx.fillStyle=g1;ctx.beginPath();ctx.arc(s.f1x,CY,r1,0,Math.PI*2);ctx.fill();
        txt(ctx,`${m1_}kg`,s.f1x,CY+r1+14,C.right,10);
        arrow(ctx,s.f1x,CY,s.f1x+s.v1*12,CY,C.left,2.5,`${s.v1.toFixed(1)}m/s`);

        // Fragment 2 (lighter, moves right faster)
        const r2=10+m2_*1.2;
        const g2=ctx.createRadialGradient(s.f2x-r2*0.3,CY-r2*0.3,2,s.f2x,CY,r2);
        g2.addColorStop(0,"#fde68a");g2.addColorStop(1,"#d97706");
        ctx.fillStyle=g2;ctx.beginPath();ctx.arc(s.f2x,CY,r2,0,Math.PI*2);ctx.fill();
        txt(ctx,`${m2_}kg`,s.f2x,CY+r2+14,C.net,10);
        arrow(ctx,s.f2x,CY,s.f2x+s.v2*12,CY,C.right,2.5,`${s.v2.toFixed(1)}m/s`);
      }

      const totalP=m1_*s.v1+m2_*s.v2;
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,215,90,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,215,90,8);ctx.stroke();
      txt(ctx,"Explosion — Momentum Conservation",117,26,C.textDim,10);
      txt(ctx,"Initial p = 0 (at rest)",117,42,C.text,11);
      txt(ctx,`p₁ = ${(m1_*s.v1).toFixed(1)} kg·m/s ←`,117,57,C.left,11);
      txt(ctx,`p₂ = ${(m2_*s.v2).toFixed(1)} kg·m/s →`,117,72,C.right,11);
      txt(ctx,`p₁ + p₂ = ${totalP.toFixed(1)} ≈ 0 ✅`,117,86,C.net,11);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  const explode=()=>{
    const m1_=m1R.current,m2_=m2R.current,J=60;
    // m1*v1 + m2*v2 = 0 → v1 = -m2*K, v2 = m1*K for some K
    const K=J/(m1_+m2_);
    st.current={f1x:W/2-30,f2x:W/2+30,v1:-m2_*K,v2:m1_*K,phase:"exploded"};
  };
  const W=580;

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>💣 Explosion from Rest — p Before = p After = 0</h3>
        <p style={DESC}>Object at rest explodes into two fragments. Total momentum stays zero. Lighter fragment moves faster.</p></div>
      <canvas ref={cvs} width={580} height={220} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Before explosion: p = 0. After: m₁v₁ + m₂v₂ = 0 → v₁/v₂ = -m₂/m₁.
        The lighter fragment moves FASTER so both momenta cancel.
        This is why rifle recoil is small compared to bullet speed (rifle is much heavier).</div>
      <div style={CTRLS}>
        <button onClick={explode} style={{padding:"7px 16px",borderRadius:8,border:"1px solid #f97316",background:"rgba(249,115,22,0.1)",color:"#f97316",cursor:"pointer",fontSize:13,fontWeight:700}}>💥 EXPLODE!</button>
        <div style={SW}><span style={{fontSize:11,color:C.left}}>Fragment 1: {m1} kg</span>
          <input type="range" min={2} max={20} value={m1} onChange={e=>setM1(+e.target.value)} style={{accentColor:C.left}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Fragment 2: {m2} kg</span>
          <input type="range" min={2} max={20} value={m2} onChange={e=>setM2(+e.target.value)} style={{accentColor:C.right}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 5 — Rocket & Momentum Conservation
 * Physics: m·dv = -v_exhaust·dm (Tsiolkovsky); each fuel ejection conserves p
 * Learning: Rockets work by momentum conservation — fuel backward → rocket forward
 * ══════════════════════════════════════════════════════════════════ */
export function Pro5_RocketMomentum() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({rocketX:100,rocketV:0,fuel:100,exhaustX:100,exhaustV:0});
  const [ejectRate,setEjectRate]=useState(3);
  const eR=useRef(ejectRate);
  useEffect(()=>{eR.current=ejectRate;},[ejectRate]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const CY=H/2;
    const EXHAUST_V=8;
    st.current={rocketX:100,rocketV:0,fuel:100,exhaustX:100,exhaustV:0};
    let last=performance.now(),t=0;
    const exhaustParticles:{x:number,v:number,alpha:number}[]=[];

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;t+=dt;
      const s=st.current,rate=eR.current;
      const MASS=5+s.fuel*0.3;

      if(s.fuel>0){
        // Eject fuel mass dm; conserve momentum: MASS*v = (MASS-dm)*(v+dv) + dm*(v-EXHAUST_V)
        const dm=rate*dt*0.5;
        const dv=(dm*EXHAUST_V)/MASS;
        s.rocketV+=dv;
        s.fuel=Math.max(0,s.fuel-dm*10);

        // Exhaust particle
        if(Math.random()<0.5) exhaustParticles.push({x:s.rocketX,v:-EXHAUST_V-s.rocketV,alpha:1});
      }
      s.rocketX+=s.rocketV*dt*40;
      if(s.rocketX>W-60) s.rocketX=W-60;

      // Update exhaust particles
      for(let i=exhaustParticles.length-1;i>=0;i--){
        exhaustParticles[i].x+=exhaustParticles[i].v*dt*40;
        exhaustParticles[i].alpha-=dt*1.5;
        if(exhaustParticles[i].alpha<=0||exhaustParticles[i].x<0) exhaustParticles.splice(i,1);
      }

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);
      ctx.fillStyle=C.surface;ctx.fillRect(0,CY+25,W,H-CY-25);
      ctx.fillStyle=C.border;ctx.fillRect(0,CY+25,W,2);

      // Exhaust particles
      exhaustParticles.forEach(p=>{
        ctx.fillStyle=`rgba(249,115,22,${p.alpha*0.7})`;
        ctx.beginPath();ctx.arc(p.x,CY+4,4+Math.random()*3,0,Math.PI*2);ctx.fill();
      });

      // Rocket
      const rx=s.rocketX;
      // Body
      const rGrad=ctx.createLinearGradient(rx,CY-20,rx+60,CY-20);
      rGrad.addColorStop(0,"#94a3b8");rGrad.addColorStop(0.5,"#e2e8f0");rGrad.addColorStop(1,"#94a3b8");
      ctx.fillStyle=rGrad;rRect(ctx,rx,CY-18,60,36,5);ctx.fill();
      // Nose
      ctx.fillStyle="#ef4444";
      ctx.beginPath();ctx.moveTo(rx+60,CY);ctx.lineTo(rx+80,CY-10);ctx.lineTo(rx+80,CY+10);ctx.closePath();ctx.fill();
      // Fin
      ctx.fillStyle="#64748b";
      ctx.beginPath();ctx.moveTo(rx,CY-18);ctx.lineTo(rx-14,CY-30);ctx.lineTo(rx,CY-6);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(rx,CY+18);ctx.lineTo(rx-14,CY+30);ctx.lineTo(rx,CY+6);ctx.closePath();ctx.fill();
      // Fuel gauge
      const fuelW=54*s.fuel/100;
      ctx.fillStyle="#1e293b";rRect(ctx,rx+3,CY-8,54,16,3);ctx.fill();
      ctx.fillStyle=s.fuel>30?"#22c55e":s.fuel>10?"#f59e0b":"#ef4444";
      rRect(ctx,rx+3,CY-8,fuelW,16,3);ctx.fill();
      txt(ctx,`Fuel ${s.fuel.toFixed(0)}%`,rx+30,CY,C.text,9);

      // Velocity arrow
      if(s.rocketV>0.05) arrow(ctx,rx+80,CY,rx+80+s.rocketV*15,CY,C.right,2.5,`v=${s.rocketV.toFixed(2)}m/s`);

      // Info
      const p_rocket=MASS*s.rocketV;
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,205,90,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,205,90,8);ctx.stroke();
      txt(ctx,"Rocket — Momentum Conservation",117,26,C.textDim,10);
      txt(ctx,"Exhaust ← pushed backward",117,42,C.left,11);
      txt(ctx,"Rocket → pushed forward",117,57,C.right,11);
      txt(ctx,`p_rocket = ${p_rocket.toFixed(1)} kg·m/s`,117,72,C.net,11);
      txt(ctx,s.fuel>0?"⛽ Burning fuel…":"🏁 Fuel empty — coasting",117,87,s.fuel>0?C.right:C.textDim,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>🚀 Rocket — Momentum Conservation (Tsiolkovsky Equation)</h3>
        <p style={DESC}>Fuel ejected backward → rocket accelerates forward. Total momentum stays constant throughout.</p></div>
      <canvas ref={cvs} width={580} height={200} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Each tiny ejected fuel mass carries backward momentum. The rocket gains equal forward momentum.
        Σp = constant. This is why rockets work in space — no air to "push against" needed.
        More fuel ejected per second (higher burn rate) → greater thrust → faster acceleration.</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Fuel Ejection Rate: {ejectRate}</span>
          <input type="range" min={1} max={8} value={ejectRate} onChange={e=>{setEjectRate(+e.target.value);st.current={rocketX:100,rocketV:0,fuel:100,exhaustX:100,exhaustV:0};}} style={{accentColor:C.right}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 6 — Live Momentum Bar Chart During Collision
 * Physics: Real-time p1, p2, p_total displayed as animated bars
 * Learning: See momentum transfer visually — total never changes
 * ══════════════════════════════════════════════════════════════════ */
export function Pro5_MomentumGraph() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const [m1,setM1]=useState(6); const [m2,setM2]=useState(4);
  const m1R=useRef(m1); const m2R=useRef(m2);
  useEffect(()=>{m1R.current=m1;m2R.current=m2;},[m1,m2]);
  const st=useRef({b1x:80,b2x:420,b1v:5,b2v:0,collided:false});

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const reset=()=>st.current={b1x:80,b2x:420,b1v:5,b2v:0,collided:false};
    reset();
    let last=performance.now();

    function drawBar(x:number,y:number,w:number,h:number,col:string,lbl:string,val:number){
      const bh=Math.abs(h);
      const by=h>0?y-bh:y;
      const g=ctx.createLinearGradient(x,by,x,by+bh);
      g.addColorStop(0,col);g.addColorStop(1,col+"66");
      ctx.fillStyle=g;rRect(ctx,x,by,w,bh,3);ctx.fill();
      txt(ctx,lbl,x+w/2,y+20,C.textDim,10);
      txt(ctx,val.toFixed(1),x+w/2,by-12,col,11);
    }

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;
      const s=st.current;
      const m1_=m1R.current,m2_=m2R.current;
      const r1=12+m1_,r2=12+m2_;

      // Physics
      if(!s.collided && s.b1x+r1>=s.b2x-r2){
        const [v1n,v2n]=elasticCollision(m1_,s.b1v,m2_,s.b2v);
        s.b1v=v1n;s.b2v=v2n;s.collided=true;s.b1x=s.b2x-r1-r2;
      }
      s.b1x+=s.b1v*dt*35;s.b2x+=s.b2v*dt*35;
      if(s.b1x<r1){s.b1x=r1;s.b1v=Math.abs(s.b1v);}
      if(s.b2x>W/2-r2){s.b2x=W/2-r2;s.b2v=-Math.abs(s.b2v);}

      const p1=m1_*s.b1v, p2=m2_*s.b2v, pT=p1+p2;

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);

      // Split: left half = balls, right half = bar chart
      const MID=W/2;
      ctx.strokeStyle=C.border;ctx.lineWidth=1;ctx.setLineDash([4,4]);
      ctx.beginPath();ctx.moveTo(MID,0);ctx.lineTo(MID,H);ctx.stroke();
      ctx.setLineDash([]);

      // Left: ball simulation
      const CY=H/2;
      ctx.fillStyle=C.surface;ctx.fillRect(0,CY+20,MID,H-CY-20);
      ctx.fillStyle=C.border;ctx.fillRect(0,CY+20,MID,2);

      const g1=ctx.createRadialGradient(s.b1x-r1*0.3,CY-r1*0.3,2,s.b1x,CY,r1);
      g1.addColorStop(0,"#60a5fa");g1.addColorStop(1,"#1e40af");
      ctx.fillStyle=g1;ctx.beginPath();ctx.arc(s.b1x,CY,r1,0,Math.PI*2);ctx.fill();

      const g2=ctx.createRadialGradient(s.b2x-r2*0.3,CY-r2*0.3,2,s.b2x,CY,r2);
      g2.addColorStop(0,"#fde68a");g2.addColorStop(1,"#d97706");
      ctx.fillStyle=g2;ctx.beginPath();ctx.arc(s.b2x,CY,r2,0,Math.PI*2);ctx.fill();

      if(Math.abs(s.b1v)>0.1) arrow(ctx,s.b1x,CY,s.b1x+s.b1v*8,CY,C.right,2);
      if(Math.abs(s.b2v)>0.1) arrow(ctx,s.b2x,CY,s.b2x+s.b2v*8,CY,C.net,2);

      // Right: momentum bar chart
      const barCY=H/2+10, scale=6, barW=30;
      ctx.strokeStyle=C.border;ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(MID+20,20);ctx.lineTo(W-20,20);
      ctx.moveTo(MID+20,barCY);ctx.lineTo(W-20,barCY);
      ctx.moveTo(MID+20,H-20);ctx.lineTo(W-20,H-20);ctx.stroke();

      const gap=(W-MID-80)/4;
      drawBar(MID+20+gap*0,barCY,barW,p1*scale,C.right,"p₁",p1);
      drawBar(MID+20+gap*1,barCY,barW,p2*scale,C.net,"p₂",p2);
      drawBar(MID+20+gap*2,barCY,barW,pT*scale,"#22c55e","p_total",pT);

      txt(ctx,"Momentum Bars",MID+(W-MID)/2,16,C.textDim,10);
      txt(ctx,`Total p = ${pT.toFixed(2)} kg·m/s (CONSTANT)`,MID+(W-MID)/2,H-8,"#22c55e",10);

      if(s.b2x<20) reset();

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>📊 Live Momentum Chart — See p Transfer in Real Time</h3>
        <p style={DESC}>Left panel: balls colliding. Right panel: momentum bars for each ball + total. Total p never changes.</p></div>
      <canvas ref={cvs} width={580} height={280} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        During collision, p₁ decreases and p₂ increases by exactly the same amount.
        The total p bar stays constant throughout. This is the Law of Conservation of Momentum
        shown live: p is transferred, never created or destroyed.</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>m₁: {m1} kg</span>
          <input type="range" min={2} max={15} value={m1} onChange={e=>{setM1(+e.target.value);st.current={b1x:80,b2x:420,b1v:5,b2v:0,collided:false};}} style={{accentColor:C.right}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.net}}>m₂: {m2} kg</span>
          <input type="range" min={2} max={15} value={m2} onChange={e=>{setM2(+e.target.value);st.current={b1x:80,b2x:420,b1v:5,b2v:0,collided:false};}} style={{accentColor:C.net}}/></div>
      </div>
    </div>
  );
}
