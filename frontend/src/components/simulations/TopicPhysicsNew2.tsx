/**
 * FILE: TopicPhysicsNew2.tsx
 * LOCATION: src/components/simulations/TopicPhysicsNew2.tsx
 * PURPOSE: 6 professional canvas-based physics simulations for
 *          Topic 2 — Newton's First Law of Motion & Inertia (CBSE Class 9)
 *
 * Simulations:
 *   Pro2_SpaceCoasting     — Object in space with zero friction, moves forever
 *   Pro2_InertiaMassComp   — Heavy vs light block — inertia difference
 *   Pro2_BusPassenger      — Passenger lurches when bus brakes (inertia of motion)
 *   Pro2_FrictionDecel     — Block slides and stops on different surfaces
 *   Pro2_TableclothTrick   — Quick pull leaves objects behind (inertia of rest)
 *   Pro2_GalileoRamp       — Galileo's inclined plane: speed at bottom vs height
 *
 * CBSE coverage: Law of inertia, inertia of rest, inertia of motion,
 *   inertia of direction, relationship between inertia and mass.
 *
 * LAST UPDATED: 2026-06-01
 */

"use client";
import { useRef, useEffect, useState } from "react";

const C = {
  bg:"#07101f", panel:"#0f1c2e", surface:"#162032", border:"#1e3050",
  block:"#2563EB", blockHi:"#3b82f6", right:"#22c55e", left:"#ef4444",
  net:"#f59e0b", gravity:"#f97316", normal:"#a78bfa",
  text:"#e2e8f0", textDim:"#94a3b8", textFaint:"#334155",
  space:"#020817", star:"#e2e8f0",
};
function rRect(ctx:CanvasRenderingContext2D,x:number,y:number,w:number,h:number,r:number){
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.lineTo(x+w-r,y);ctx.arcTo(x+w,y,x+w,y+r,r);
  ctx.lineTo(x+w,y+h-r);ctx.arcTo(x+w,y+h,x+w-r,y+h,r);
  ctx.lineTo(x+r,y+h);ctx.arcTo(x,y+h,x,y+h-r,r);
  ctx.lineTo(x,y+r);ctx.arcTo(x,y,x+r,y,r);
  ctx.closePath();
}
function arrow(ctx:CanvasRenderingContext2D,x1:number,y1:number,x2:number,y2:number,color:string,lw=2.5,lbl=""){
  const dx=x2-x1,dy=y2-y1,len=Math.hypot(dx,dy);
  if(len<3)return;
  const angle=Math.atan2(dy,dx),hw=Math.min(14,len*0.38);
  ctx.save();ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=lw;ctx.lineCap="round";
  ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
  ctx.beginPath();ctx.moveTo(x2,y2);
  ctx.lineTo(x2-hw*Math.cos(angle-0.42),y2-hw*Math.sin(angle-0.42));
  ctx.lineTo(x2-hw*Math.cos(angle+0.42),y2-hw*Math.sin(angle+0.42));
  ctx.closePath();ctx.fill();
  if(lbl){
    ctx.font="bold 11px Inter,system-ui,sans-serif";ctx.textAlign="center";ctx.textBaseline="middle";
    const mx=(x1+x2)/2,my=(y1+y2)/2-13;
    ctx.fillStyle="rgba(7,16,31,0.85)";
    const tw=ctx.measureText(lbl).width;
    ctx.fillRect(mx-tw/2-4,my-8,tw+8,16);
    ctx.fillStyle=color;ctx.fillText(lbl,mx,my);
  }
  ctx.restore();
}
function txt(ctx:CanvasRenderingContext2D,t:string,x:number,y:number,color:string,size=12,align:CanvasTextAlign="center"){
  ctx.save();ctx.fillStyle=color;ctx.font=`${size}px Inter,system-ui,sans-serif`;
  ctx.textAlign=align;ctx.textBaseline="middle";ctx.fillText(t,x,y);ctx.restore();
}
function drawDotGrid(ctx:CanvasRenderingContext2D,W:number,H:number){
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
 * SIMULATION 1 — Space Coasting (Newton's First Law in space)
 * Physics: No friction, no air resistance → constant velocity forever
 * Learning: Objects in space keep moving at constant velocity (no force needed)
 * ══════════════════════════════════════════════════════════════════ */
export function Pro2_SpaceCoasting() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({ x:60, v:0 });
  const [speed, setSpeed] = useState(3);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);
  // Stars (static positions)
  const stars = useRef<{x:number,y:number,r:number,blink:number}[]>([]);

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    // Generate stars once
    stars.current = Array.from({length:60},()=>({
      x:Math.random()*W, y:Math.random()*H,
      r:Math.random()*1.5+0.3, blink:Math.random()*Math.PI*2
    }));
    st.current = { x: 60, v: speedRef.current };
    let last = performance.now(), t = 0;

    function frame(now:number) {
      const dt=Math.min((now-last)/1000,1/30); last=now; t+=dt;
      st.current.v = speedRef.current; // velocity follows slider (no force changes it)
      st.current.x += st.current.v * dt * 60;
      if (st.current.x > W + 50) st.current.x = -50;

      // Deep space background
      ctx.fillStyle="#020817"; ctx.fillRect(0,0,W,H);
      // Stars with twinkle
      stars.current.forEach(s => {
        const alpha = 0.5 + 0.5*Math.sin(t*1.2+s.blink);
        ctx.fillStyle=`rgba(226,232,240,${alpha.toFixed(2)})`;
        ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2); ctx.fill();
      });

      // Velocity trail (comet tail)
      const bx = st.current.x;
      for (let i=1;i<=8;i++) {
        const tx = bx - i*14, alpha = (1-i/9)*0.4;
        ctx.fillStyle=`rgba(59,130,246,${alpha})`;
        rRect(ctx, tx, H/2-8, 10, 16, 3); ctx.fill();
      }

      // Spacecraft block
      const g = ctx.createLinearGradient(bx,H/2-16,bx,H/2+16);
      g.addColorStop(0,"#3b82f6"); g.addColorStop(1,"#1e40af");
      ctx.fillStyle=g; rRect(ctx,bx,H/2-16,40,32,5); ctx.fill();
      // Thruster glow (no thruster active — we're coasting)
      ctx.fillStyle="rgba(99,102,241,0.15)";
      ctx.beginPath(); ctx.arc(bx-8,H/2,14,0,Math.PI*2); ctx.fill();

      // Labels
      txt(ctx,"🚀 Spacecraft",bx+20,H/2-30,C.text,12);
      txt(ctx,`v = ${speed.toFixed(1)} m/s (CONSTANT)`,bx+20,H/2+35,C.net,11);

      // No-force label
      txt(ctx,"No friction in space",W/2,22,C.textDim,12);
      txt(ctx,"→ Velocity stays constant forever (Newton's 1st Law)",W/2,38,"#93c5fd",11);

      // Velocity vector
      arrow(ctx,bx+40,H/2,bx+40+speed*12,H/2,C.right,2.5,`${speed.toFixed(1)} m/s`);

      // Zero net force indicator
      ctx.fillStyle="rgba(34,197,94,0.1)"; ctx.strokeStyle="#22c55e"; ctx.lineWidth=1;
      rRect(ctx,W-130,10,120,24,6); ctx.fill(); ctx.stroke();
      txt(ctx,"Fnet = 0 N",W-70,22,"#22c55e",11);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, [speed]);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>🚀 Space Coasting — Constant Velocity Forever</h3>
        <p style={DESC}>In space, with no friction, an object keeps moving at the same speed in the same direction indefinitely.</p>
      </div>
      <canvas ref={cvs} width={580} height={200} style={{width:"100%",display:"block"}} />
      <div style={CONCEPT}>
        <strong style={{color:"#93c5fd"}}>Key Concept (Newton's 1st Law):</strong>{" "}
        An object continues in its state of rest or uniform motion in a straight line
        UNLESS acted upon by an external force. In space, no friction → spacecraft coasts at
        constant velocity forever — no engine needed!
      </div>
      <div style={CTRLS}>
        <div style={SW}>
          <span style={{fontSize:11,color:C.right}}>Velocity: {speed} m/s</span>
          <input type="range" min={0} max={10} step={0.5} value={speed}
                 onChange={e=>{setSpeed(+e.target.value); st.current.x=60;}}
                 style={{accentColor:C.right}}/>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 2 — Inertia vs Mass Comparison
 * Physics: Inertia ∝ mass. Heavier object harder to start moving.
 * Learning: More mass = more resistance to change in motion (inertia)
 * ══════════════════════════════════════════════════════════════════ */
export function Pro2_InertiaMassComp() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef([{x:100,v:0,m:5},{x:100,v:0,m:25}]);
  const [force, setForce] = useState(50);
  const fRef = useRef(force);
  useEffect(() => { fRef.current = force; }, [force]);

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    st.current = [{x:100,v:0,m:5},{x:100,v:0,m:25}];
    let last = performance.now();

    function frame(now:number) {
      const dt=Math.min((now-last)/1000,1/30); last=now;
      const f = fRef.current;
      ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
      drawDotGrid(ctx,W,H);

      const rowH = H/2;
      st.current.forEach((blk,i) => {
        const a = f / blk.m;
        blk.v += a*dt;
        blk.x += blk.v*dt*40;
        if (blk.x > W-80) { blk.x = W-80; blk.v=0; }

        const ry = i*rowH;
        ctx.fillStyle = i%2===0?C.panel:C.bg;
        ctx.fillRect(0,ry,W,rowH);

        // Ground line
        const gY = ry+rowH-20;
        ctx.fillStyle=C.surface; ctx.fillRect(0,gY,W,20);
        ctx.fillStyle=C.border; ctx.fillRect(0,gY,W,2);

        const BH = 36, BY = gY-BH;
        const sz = 24+blk.m;
        const bGrad = ctx.createLinearGradient(blk.x,BY,blk.x,BY+BH);
        bGrad.addColorStop(0,"#3b82f6"); bGrad.addColorStop(1,"#1e40af");
        ctx.fillStyle=bGrad; rRect(ctx,blk.x,BY,sz,BH,5); ctx.fill();
        txt(ctx,`${blk.m}kg`,blk.x+sz/2,BY+BH/2,"#fff",11);

        // Force arrow
        if(f>0) arrow(ctx,blk.x+sz,BY+BH/2,blk.x+sz+f*0.9,BY+BH/2,C.right,2.5,`F=${f}N`);

        // Labels
        txt(ctx,i===0?"Light Object (low inertia)":"Heavy Object (high inertia)",
            10,ry+18,i===0?C.right:C.left,11,"left");
        txt(ctx,`a = F/m = ${f}/${blk.m} = ${a.toFixed(2)} m/s²`,
            W-10,ry+18,C.net,11,"right");
        txt(ctx,`v = ${blk.v.toFixed(2)} m/s`,W-10,ry+34,C.text,10,"right");

        if(i<1){
          ctx.strokeStyle=C.border; ctx.lineWidth=1; ctx.setLineDash([4,4]);
          ctx.beginPath(); ctx.moveTo(0,rowH); ctx.lineTo(W,rowH); ctx.stroke();
          ctx.setLineDash([]);
        }
      });

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>⚖️ Inertia vs Mass — Heavier = Harder to Move</h3>
        <p style={DESC}>Same force on a 5 kg and 25 kg block. Watch the difference in acceleration.</p>
      </div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",display:"block"}} />
      <div style={CONCEPT}>
        <strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Inertia is the tendency to resist change in motion. Inertia ∝ mass.
        A heavier object has MORE inertia → needs MORE force to achieve the same acceleration.
        Same force on 5kg gives 5× more acceleration than on 25kg.
      </div>
      <div style={CTRLS}>
        <div style={SW}>
          <span style={{fontSize:11,color:C.right}}>Applied Force: {force} N</span>
          <input type="range" min={10} max={150} value={force}
                 onChange={e=>{setForce(+e.target.value); st.current=[{x:100,v:0,m:5},{x:100,v:0,m:25}];}}
                 style={{accentColor:C.right}}/>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 3 — Bus Passenger Inertia
 * Physics: Passenger body continues at previous velocity when bus changes speed
 * Learning: Inertia of motion (body keeps moving when bus brakes)
 * ══════════════════════════════════════════════════════════════════ */
export function Pro2_BusPassenger() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({ busV:6, passV:6, busX:0, passLean:0, mode:"cruise" });
  const [mode, setMode] = useState<"cruise"|"brake"|"accelerate">("cruise");
  const mRef = useRef(mode);
  useEffect(() => { mRef.current = mode; }, [mode]);

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    let last = performance.now();
    st.current = { busV:6, passV:6, busX:0, passLean:0, mode:"cruise" };

    function frame(now:number) {
      const dt=Math.min((now-last)/1000,1/30); last=now;
      const s = st.current;
      const m = mRef.current;

      // Bus acceleration
      let busA = 0;
      if(m==="brake")      busA = -15;
      else if(m==="accelerate") busA = 10;

      s.busV += busA*dt;
      s.busV = Math.max(0, Math.min(12, s.busV));

      // Passenger inertia — body velocity lags behind bus
      const passF = -8*(s.passV - s.busV) - 20*(s.passLean);
      s.passV += (passF/70)*dt;
      s.passLean = (s.passV - s.busV) * 2; // lean angle proportional to slip

      // Scroll the scene (bus stays roughly centered)
      s.busX = (s.busX + s.busV*dt*30) % W;

      ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
      drawDotGrid(ctx,W,H);

      // Road
      const ry = H-60;
      ctx.fillStyle=C.surface; ctx.fillRect(0,ry,W,60);
      ctx.fillStyle="#f59e0b";
      for(let x=(-s.busX%80+80)%80;x<W;x+=80){
        ctx.fillRect(x,ry+28,40,4);
      }

      // Bus body
      const busY = ry-70;
      ctx.fillStyle="#1d4ed8"; rRect(ctx,80,busY,380,70,8); ctx.fill();
      ctx.fillStyle="#3b82f6"; rRect(ctx,85,busY+5,370,30,5); ctx.fill();
      // Windows
      for(let wx=100;wx<430;wx+=70){
        ctx.fillStyle="rgba(186,230,253,0.3)";
        rRect(ctx,wx,busY+8,50,20,3); ctx.fill();
      }
      // Wheels
      [-1,1].forEach(side => {
        const wx = 160+side*110;
        ctx.fillStyle="#1e293b"; ctx.beginPath(); ctx.arc(wx,ry+4,18,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#475569"; ctx.beginPath(); ctx.arc(wx,ry+4,10,0,Math.PI*2); ctx.fill();
      });

      // Passenger (simple stick figure with lean)
      const px = 270, py = busY+10;
      const lean = s.passLean * 0.4;
      ctx.save(); ctx.strokeStyle="#fbbf24"; ctx.lineWidth=3; ctx.lineCap="round";
      ctx.beginPath(); ctx.arc(px,py,10,0,Math.PI*2); ctx.fill();
      ctx.strokeStyle="#fbbf24";
      ctx.beginPath(); ctx.moveTo(px,py+10); ctx.lineTo(px+lean,py+35); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px,py+20); ctx.lineTo(px+lean*0.5-15,py+28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px,py+20); ctx.lineTo(px+lean*0.5+15,py+28); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px+lean,py+35); ctx.lineTo(px+lean-8,py+55); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(px+lean,py+35); ctx.lineTo(px+lean+8,py+55); ctx.stroke();
      ctx.restore();

      // Labels
      txt(ctx,`Bus velocity: ${s.busV.toFixed(1)} m/s`,W/2,22,C.text,11);
      txt(ctx,m==="brake"?"🔴 BRAKING — passenger lurches FORWARD (inertia of motion)":
             m==="accelerate"?"🟢 ACCELERATING — passenger falls BACKWARD (inertia of rest)":
             "🟡 CRUISING — passenger upright (no net force difference)",
          W/2,38,m==="brake"?C.left:m==="accelerate"?C.right:C.net,11);

      // Speedometer
      ctx.fillStyle="rgba(7,16,31,0.88)";
      rRect(ctx,W-110,busY,100,44,7); ctx.fill();
      txt(ctx,"Speed",W-60,busY+14,C.textDim,10);
      txt(ctx,`${s.busV.toFixed(1)} m/s`,W-60,busY+30,C.net,13);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>🚌 Bus Passenger — Inertia of Motion & Rest</h3>
        <p style={DESC}>Passenger body resists changes to its motion. Watch the lean when the bus brakes or accelerates.</p>
      </div>
      <canvas ref={cvs} width={580} height={260} style={{width:"100%",display:"block"}} />
      <div style={CONCEPT}>
        <strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        When the bus brakes, the passenger's body continues forward at the old speed
        (inertia of motion → lurches forward). When bus accelerates, body stays behind
        (inertia of rest → falls backward). This IS Newton's First Law in daily life.
      </div>
      <div style={CTRLS}>
        <div style={SW}>
          <span style={{fontSize:11,color:C.textDim}}>Bus State:</span>
          <div style={{display:"flex",gap:8,flexWrap:"wrap" as const}}>
            {(["cruise","brake","accelerate"] as const).map(m=>(
              <button key={m} onClick={()=>setMode(m)} style={{
                padding:"5px 12px", borderRadius:6, border:"1px solid",
                borderColor:mode===m?"#2563eb":"#1e3050",
                background:mode===m?"#2563eb":"transparent",
                color:C.text, cursor:"pointer", fontSize:12,
              }}>{m==="cruise"?"🟡 Cruise":m==="brake"?"🔴 Brake":"🟢 Accelerate"}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 4 — Friction Deceleration Race
 * Physics: Deceleration = μg; stopping distance = v²/2μg
 * Learning: More friction → stops sooner (objects don't slide forever on Earth)
 * ══════════════════════════════════════════════════════════════════ */
export function Pro2_FrictionDecel() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const [v0, setV0] = useState(8);
  const v0Ref = useRef(v0);
  useEffect(() => { v0Ref.current = v0; }, [v0]);
  const st = useRef<{x:number,v:number,mu:number,lbl:string,col:string}[]>([]);
  const running = useRef(false);

  const reset = () => {
    const v = v0Ref.current;
    st.current = [
      {x:30, v, mu:0.03, lbl:"Ice (μ=0.03)",     col:"#7dd3fc"},
      {x:30, v, mu:0.35, lbl:"Wood (μ=0.35)",    col:"#d97706"},
      {x:30, v, mu:0.70, lbl:"Rubber (μ=0.70)",  col:"#6b7280"},
    ];
    running.current = true;
  };

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    const G = 9.8, rowH = H/3;
    reset();
    let last = performance.now();

    function frame(now:number) {
      const dt=Math.min((now-last)/1000,1/30); last=now;
      ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
      drawDotGrid(ctx,W,H);

      st.current.forEach((blk,i) => {
        const ry = i*rowH;
        ctx.fillStyle=i%2===0?C.panel:C.bg; ctx.fillRect(0,ry,W,rowH);
        const gY = ry+rowH-18;
        ctx.fillStyle=blk.col+"33"; ctx.fillRect(0,gY-2,W,20);
        ctx.fillStyle=blk.col+"88"; ctx.fillRect(0,gY-2,W,2);

        if(blk.v > 0) {
          const decel = blk.mu * G;
          blk.v = Math.max(0, blk.v - decel*dt);
          blk.x += blk.v*dt*40;
        }

        const BW=40, BH=28, BY=gY-BH;
        const g2=ctx.createLinearGradient(blk.x,BY,blk.x,BY+BH);
        g2.addColorStop(0,"#3b82f6"); g2.addColorStop(1,"#1e40af");
        ctx.fillStyle=g2; rRect(ctx,blk.x,BY,BW,BH,5); ctx.fill();

        // Motion trail
        for(let t=1;t<=5;t++){
          ctx.fillStyle=`rgba(59,130,246,${0.15-t*0.025})`;
          rRect(ctx,blk.x-t*8,BY,BW,BH,5); ctx.fill();
        }

        txt(ctx,blk.lbl,10,ry+rowH/2-10,blk.col,11,"left");
        txt(ctx,`v = ${blk.v.toFixed(2)} m/s`,10,ry+rowH/2+6,C.textDim,10,"left");
        txt(ctx,`a = -${(blk.mu*9.8).toFixed(2)} m/s²`,W-10,ry+rowH/2,C.left,10,"right");
        if(blk.v<0.05) txt(ctx,"STOPPED",W-10,ry+rowH/2+14,"#22c55e",10,"right");

        if(i<2){
          ctx.strokeStyle=C.border; ctx.lineWidth=1; ctx.setLineDash([4,4]);
          ctx.beginPath(); ctx.moveTo(0,ry+rowH); ctx.lineTo(W,ry+rowH); ctx.stroke();
          ctx.setLineDash([]);
        }
      });
      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>🛷 Friction Deceleration — Why Objects Stop on Earth</h3>
        <p style={DESC}>Same initial velocity on different surfaces. Friction decelerates the block — more friction = stops sooner.</p>
      </div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",display:"block"}} />
      <div style={CONCEPT}>
        <strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Objects don't slide forever on Earth because friction acts (unlike space).
        Galileo realized: if friction could be eliminated, a sliding object would move forever.
        This insight led Newton to formulate the 1st Law: objects resist change in motion.
      </div>
      <div style={CTRLS}>
        <div style={SW}>
          <span style={{fontSize:11,color:C.right}}>Initial Velocity: {v0} m/s</span>
          <input type="range" min={2} max={15} value={v0}
                 onChange={e=>{setV0(+e.target.value); reset();}}
                 style={{accentColor:C.right}}/>
        </div>
        <button onClick={reset} style={{padding:"6px 14px",borderRadius:7,border:`1px solid ${C.border}`,background:C.surface,color:C.text,cursor:"pointer",fontSize:12}}>↺ Reset</button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 5 — Tablecloth Trick (Inertia of Rest)
 * Physics: Cloth pulled quickly, dishes have inertia of rest → stay put
 * Learning: Short contact time → small impulse → objects barely move
 * ══════════════════════════════════════════════════════════════════ */
export function Pro2_TableclothTrick() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({ phase:"idle" as "idle"|"slow"|"fast"|"done", clothX:0, dish1X:200, dish2X:280, t:0 });

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    let last = performance.now();
    const TABLE_Y = H-80, TABLE_W=400, TABLE_X=90;

    function frame(now:number) {
      const dt=Math.min((now-last)/1000,1/30); last=now;
      const s = st.current;
      if(s.phase!=="idle") s.t += dt;

      const speed = s.phase==="fast" ? 320 : s.phase==="slow" ? 80 : 0;
      s.clothX += speed*dt;

      // Dish friction from cloth (proportional to contact duration)
      const dishFriction = s.phase==="fast" ? 0.05 : s.phase==="slow" ? 0.45 : 0;
      if(s.clothX < TABLE_X+TABLE_W) {
        s.dish1X += speed*dt*dishFriction;
        s.dish2X += speed*dt*dishFriction;
      }
      if(s.clothX > W+50) s.phase="done";

      ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
      drawDotGrid(ctx,W,H);

      // Table
      ctx.fillStyle="#5b3911"; rRect(ctx,TABLE_X,TABLE_Y,TABLE_W,16,4); ctx.fill();
      ctx.fillStyle="#7c4a14"; rRect(ctx,TABLE_X,TABLE_Y,TABLE_W,4,2); ctx.fill();
      // Legs
      ctx.fillStyle="#5b3911";
      [TABLE_X+20,TABLE_X+TABLE_W-30].forEach(lx=>{
        ctx.fillRect(lx,TABLE_Y+16,14,60);
      });

      // Tablecloth
      if(s.clothX<W+50){
        ctx.fillStyle="#dc2626"; rRect(ctx,Math.max(TABLE_X,s.clothX),TABLE_Y-6,Math.max(0,TABLE_X+TABLE_W-Math.max(TABLE_X,s.clothX)),10,2); ctx.fill();
        // Falling edge
        if(s.clothX > TABLE_X) {
          ctx.fillStyle="#dc2626"; rRect(ctx,s.clothX,TABLE_Y-6,6,30,2); ctx.fill();
        }
      }

      // Dishes (stay due to inertia)
      [s.dish1X, s.dish2X].forEach((dx,i)=>{
        // Plate
        ctx.fillStyle="#e2e8f0"; ctx.beginPath(); ctx.ellipse(dx+20,TABLE_Y-8,22,10,0,0,Math.PI*2); ctx.fill();
        ctx.fillStyle="#cbd5e1"; ctx.beginPath(); ctx.ellipse(dx+20,TABLE_Y-8,14,6,0,0,Math.PI*2); ctx.fill();
        // Cup
        if(i===1){
          ctx.fillStyle="#3b82f6"; rRect(ctx,dx+8,TABLE_Y-28,24,20,3); ctx.fill();
          ctx.fillStyle="#2563eb"; ctx.fillRect(dx+32,TABLE_Y-22,8,8);
        }
      });

      // Status
      const msg = s.phase==="idle" ? "Click a button below to start!"
        : s.phase==="fast" ? "⚡ FAST PULL — dishes stay (inertia wins!)"
        : s.phase==="slow" ? "🐌 SLOW PULL — friction drags dishes along"
        : "✅ Done! Reset to try again";
      txt(ctx,msg,W/2,28,s.phase==="fast"?"#22c55e":s.phase==="slow"?C.left:C.text,12);

      if(s.phase!=="idle") {
        txt(ctx,`Contact time: ${s.t.toFixed(2)}s`,W/2,48,C.textDim,10);
        txt(ctx,`Cloth speed: ${speed.toFixed(0)} m/s`,W/2,62,C.net,10);
      }

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const doTrick = (fast:boolean) => {
    st.current = { phase:fast?"fast":"slow", clothX:90, dish1X:200, dish2X:280, t:0 };
  };

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>🎩 Tablecloth Trick — Inertia of Rest</h3>
        <p style={DESC}>Pull the cloth quickly: dishes stay (inertia). Pull slowly: friction drags them along.</p>
      </div>
      <canvas ref={cvs} width={580} height={230} style={{width:"100%",display:"block"}} />
      <div style={CONCEPT}>
        <strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Inertia of rest: objects at rest tend to stay at rest. A fast cloth pull means
        very short contact time → very small impulse on dishes → dishes barely move.
        A slow pull gives friction more time to drag the dishes along.
      </div>
      <div style={CTRLS}>
        <div style={{display:"flex",gap:10,flexWrap:"wrap" as const}}>
          <button onClick={()=>doTrick(true)} style={{padding:"7px 16px",borderRadius:7,border:"1px solid #22c55e",background:"rgba(34,197,94,0.1)",color:"#22c55e",cursor:"pointer",fontSize:13,fontWeight:600}}>⚡ Fast Pull</button>
          <button onClick={()=>doTrick(false)} style={{padding:"7px 16px",borderRadius:7,border:"1px solid #ef4444",background:"rgba(239,68,68,0.1)",color:"#ef4444",cursor:"pointer",fontSize:13,fontWeight:600}}>🐌 Slow Pull</button>
          <button onClick={()=>{st.current={phase:"idle",clothX:0,dish1X:200,dish2X:280,t:0};}} style={{padding:"7px 14px",borderRadius:7,border:`1px solid ${C.border}`,background:C.surface,color:C.text,cursor:"pointer",fontSize:12}}>↺ Reset</button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 6 — Galileo's Inclined Plane
 * Physics: v = √(2gh); h = L·sinθ; time = 2L/v (for constant accel)
 * Learning: Speed at bottom depends only on height, not slope angle
 * ══════════════════════════════════════════════════════════════════ */
export function Pro2_GalileoRamp() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const [ang, setAng] = useState(30); // degrees
  const angRef = useRef(ang);
  useEffect(() => { angRef.current = ang; }, [ang]);
  const st = useRef({x:0, v:0, dist:0});

  useEffect(() => {
    const cv = cvs.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const W = cv.width, H = cv.height;
    const G = 9.8, L = 280; // ramp length in pixels
    let last = performance.now();

    const reset = () => { st.current = {x:0,v:0,dist:0}; };
    reset();

    function frame(now:number) {
      const dt=Math.min((now-last)/1000,1/30); last=now;
      const θ = angRef.current * Math.PI/180;
      const a = G * Math.sin(θ); // acceleration along ramp
      st.current.v += a*dt;
      st.current.dist += st.current.v*dt*30;
      if(st.current.dist > L) { reset(); }

      ctx.fillStyle=C.bg; ctx.fillRect(0,0,W,H);
      drawDotGrid(ctx,W,H);

      // Ramp geometry
      const θ_ = angRef.current * Math.PI/180;
      const bx = 80, by = H-60;  // base corner
      const tx = bx + L*Math.cos(θ_);  // NO — ramp goes from top-left to bottom-right
      const tx_ = bx, ty_ = by - L*Math.sin(θ_); // top of ramp

      // Ramp surface
      ctx.fillStyle=C.surface;
      ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(tx,by); ctx.lineTo(tx_,ty_); ctx.closePath(); ctx.fill();
      ctx.strokeStyle=C.border; ctx.lineWidth=2;
      ctx.beginPath(); ctx.moveTo(bx,by); ctx.lineTo(tx,by); ctx.lineTo(tx_,ty_); ctx.stroke();

      // Height marker
      ctx.strokeStyle=C.gravity; ctx.lineWidth=1.5; ctx.setLineDash([4,3]);
      ctx.beginPath(); ctx.moveTo(tx_,ty_); ctx.lineTo(tx_,by); ctx.stroke();
      ctx.setLineDash([]);
      const h = L*Math.sin(θ_)/30; // actual height in meters
      txt(ctx,`h = ${h.toFixed(2)}m`,tx_-35,(ty_+by)/2,C.gravity,11);

      // Ball position along ramp
      const bPos = st.current.dist;
      const ballX = tx_ + (bPos/L)*(bx + L*Math.cos(θ_) - tx_);
      const ballY = ty_ + (bPos/L)*(by - ty_);
      // Ball shadow
      ctx.fillStyle="rgba(37,99,235,0.2)"; ctx.beginPath(); ctx.arc(ballX,by-8,12,0,Math.PI*2); ctx.fill();
      // Ball
      const ballGrad = ctx.createRadialGradient(ballX-4,ballY-4,2,ballX,ballY,14);
      ballGrad.addColorStop(0,"#60a5fa"); ballGrad.addColorStop(1,"#1e40af");
      ctx.fillStyle=ballGrad; ctx.beginPath(); ctx.arc(ballX,ballY,14,0,Math.PI*2); ctx.fill();

      // Expected speed at bottom (energy: v = √2gh)
      const expectedV = Math.sqrt(2*G*h);
      const actualV = st.current.v/30;

      // Info panel
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,W-170,10,160,100,8); ctx.fill(); ctx.strokeStyle=C.border; ctx.lineWidth=1;
      rRect(ctx,W-170,10,160,100,8); ctx.stroke();
      txt(ctx,"Galileo's Experiment",W-90,26,C.textDim,10);
      txt(ctx,`Angle θ = ${angRef.current}°`,W-90,42,C.text,11);
      txt(ctx,`Height h = ${h.toFixed(2)} m`,W-90,57,C.gravity,11);
      txt(ctx,`v = √(2gh) = ${expectedV.toFixed(2)} m/s`,W-90,72,C.net,11);
      txt(ctx,`Current v = ${actualV.toFixed(2)} m/s`,W-90,87,C.text,10);
      txt(ctx,`a = g·sinθ = ${a.toFixed(2)} m/s²`,W-90,100,C.textDim,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  return (
    <div style={WRAP}>
      <div style={HEAD}>
        <h3 style={TITLE}>📐 Galileo's Inclined Plane — Speed Depends on Height</h3>
        <p style={DESC}>Change the angle. A ball always reaches the same speed from the same height regardless of slope angle.</p>
      </div>
      <canvas ref={cvs} width={580} height={280} style={{width:"100%",display:"block"}} />
      <div style={CONCEPT}>
        <strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Galileo used inclined planes to slow down free fall for measurement.
        By energy conservation: v = √(2gh). Speed at the bottom depends ONLY on height h,
        not on the angle. This laid the foundation for Newton's First Law.
      </div>
      <div style={CTRLS}>
        <div style={SW}>
          <span style={{fontSize:11,color:C.net}}>Ramp Angle: {ang}°</span>
          <input type="range" min={10} max={60} value={ang}
                 onChange={e=>{setAng(+e.target.value); st.current={x:0,v:0,dist:0};}}
                 style={{accentColor:C.net}}/>
        </div>
      </div>
    </div>
  );
}
