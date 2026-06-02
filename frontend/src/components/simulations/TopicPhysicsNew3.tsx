/**
 * FILE: TopicPhysicsNew3.tsx
 * LOCATION: src/components/simulations/TopicPhysicsNew3.tsx
 * PURPOSE: 6 professional canvas simulations for Topic 3 — Newton's Second Law
 *          F = ma (CBSE Class 9, Chapter 9 — Force & Laws of Motion)
 *
 * Simulations:
 *   Pro3_FMA_Interactive   — Real-time F=ma with sliders for F, m, see a
 *   Pro3_MassEffect        — Same force on 3 different masses (compare accelerations)
 *   Pro3_ForceEffect       — Same mass with 3 different forces (compare accelerations)
 *   Pro3_FMA_Graph         — Live F vs a graph for constant mass (linear relationship)
 *   Pro3_RocketFMA         — Rocket with variable thrust showing F=ma
 *   Pro3_MomentumChange    — Impulse = Force × time = change in momentum
 *
 * CBSE coverage: Newton's 2nd Law, momentum p=mv, rate of change of momentum,
 *   force-acceleration graph, unit of Newton, impulse.
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
 * SIMULATION 1 — F=ma Interactive Lab
 * Physics: a = F/m, v += a·dt, x += v·dt
 * Learning: Newton's 2nd Law — force and mass together determine acceleration
 * ══════════════════════════════════════════════════════════════════ */
export function Pro3_FMA_Interactive() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({x:60,v:0});
  const [F, setF] = useState(50);
  const [m, setM] = useState(10);
  const FR=useRef(F); const mR=useRef(m);
  useEffect(()=>{FR.current=F;mR.current=m;},[F,m]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const BY=H-80,BH=44;
    st.current={x:60,v:0};
    let last=performance.now();

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;
      const f=FR.current,mass=mR.current;
      const a=f/mass;
      st.current.v+=a*dt;
      st.current.x+=st.current.v*dt*40;
      if(st.current.x>W-60){st.current.x=60;st.current.v=0;}

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);

      // Ground
      ctx.fillStyle=C.surface;ctx.fillRect(0,BY+BH,W,H-BY-BH);
      ctx.fillStyle=C.border;ctx.fillRect(0,BY+BH,W,2);

      const BW=20+mass*2.5;
      const bx=st.current.x;
      const g=ctx.createLinearGradient(bx,BY,bx,BY+BH);
      g.addColorStop(0,"#8b5cf6");g.addColorStop(1,"#6d28d9");
      ctx.fillStyle=g;rRect(ctx,bx,BY,BW,BH,6);ctx.fill();
      ctx.fillStyle="rgba(255,255,255,0.1)";rRect(ctx,bx+4,BY+4,BW-8,BH/3,3);ctx.fill();
      txt(ctx,`${mass}kg`,bx+BW/2,BY+BH/2,"#fff",11);

      if(f>0) arrow(ctx,bx+BW,BY+BH/2,bx+BW+f*1.1,BY+BH/2,C.right,3,`F=${f}N`);

      // F=ma equation display
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,200,92,10);ctx.fill();
      ctx.strokeStyle=C.border;ctx.lineWidth=1;rRect(ctx,10,10,200,92,10);ctx.stroke();
      txt(ctx,"⚡ Newton's 2nd Law",110,26,C.textDim,10);
      txt(ctx,`F = ${f} N`,110,42,C.right,12);
      txt(ctx,`m = ${mass} kg`,110,58,C.normal,12);
      txt(ctx,`a = F/m = ${a.toFixed(2)} m/s²`,110,74,C.net,12);
      txt(ctx,`v = ${st.current.v.toFixed(2)} m/s`,110,90,C.text,11);

      // Scale bar (shows block size relative to mass)
      txt(ctx,"Block size ∝ mass →",W/2,H-15,C.textFaint,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>⚡ F = ma — Newton's Second Law Lab</h3>
        <p style={DESC}>Adjust force and mass. Acceleration = Force ÷ Mass.</p></div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Newton's 2nd Law: F = ma. The acceleration of an object is directly proportional to the net force
        and inversely proportional to its mass. Unit: 1 Newton = 1 kg·m/s².</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Force F: {F} N</span>
          <input type="range" min={10} max={200} value={F} onChange={e=>{setF(+e.target.value);st.current={x:60,v:0};}} style={{accentColor:C.right}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.normal}}>Mass m: {m} kg → a = {(F/m).toFixed(2)} m/s²</span>
          <input type="range" min={1} max={40} value={m} onChange={e=>{setM(+e.target.value);st.current={x:60,v:0};}} style={{accentColor:C.normal}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 2 — Mass Effect on Acceleration
 * Physics: Same F, three masses → a1 > a2 > a3
 * Learning: Heavier object accelerates less (a ∝ 1/m at constant F)
 * ══════════════════════════════════════════════════════════════════ */
export function Pro3_MassEffect() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const [F, setF] = useState(60);
  const FR = useRef(F);
  useEffect(()=>{FR.current=F;},[F]);
  const blocks = useRef([{m:5,x:60,v:0},{m:15,x:60,v:0},{m:30,x:60,v:0}]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const rowH=H/3;
    blocks.current=[{m:5,x:60,v:0},{m:15,x:60,v:0},{m:30,x:60,v:0}];
    let last=performance.now();
    const colors=["#22c55e","#f59e0b","#ef4444"];
    const labels=["Light (5 kg)","Medium (15 kg)","Heavy (30 kg)"];

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;
      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);
      blocks.current.forEach((b,i)=>{
        const ry=i*rowH;
        ctx.fillStyle=i%2===0?C.panel:C.bg;ctx.fillRect(0,ry,W,rowH);
        const gY=ry+rowH-18;
        ctx.fillStyle=C.surface;ctx.fillRect(0,gY,W,18);
        ctx.fillStyle=C.border;ctx.fillRect(0,gY,W,2);
        const f=FR.current,a=f/b.m;
        b.v+=a*dt;b.x+=b.v*dt*30;
        if(b.x>W-80){b.x=W-80;b.v=0;}
        const BH=32,BY=gY-BH,BW=16+b.m;
        const col=colors[i];
        const g=ctx.createLinearGradient(b.x,BY,b.x,BY+BH);
        g.addColorStop(0,col);g.addColorStop(1,col+"aa");
        ctx.fillStyle=g;rRect(ctx,b.x,BY,BW,BH,5);ctx.fill();
        txt(ctx,`${b.m}kg`,b.x+BW/2,BY+BH/2,"#fff",10);
        arrow(ctx,b.x+BW,BY+BH/2,b.x+BW+f*0.7,BY+BH/2,col,2.5,`${f}N`);
        txt(ctx,labels[i],10,ry+rowH/2-12,col,11,"left");
        txt(ctx,`a = ${f}/${b.m} = ${a.toFixed(2)} m/s²`,W-10,ry+rowH/2+4,C.net,11,"right");
        txt(ctx,`v = ${b.v.toFixed(2)} m/s`,W-10,ry+rowH/2+18,C.text,10,"right");
        if(i<2){ctx.strokeStyle=C.border;ctx.lineWidth=1;ctx.setLineDash([4,4]);
          ctx.beginPath();ctx.moveTo(0,ry+rowH);ctx.lineTo(W,ry+rowH);ctx.stroke();ctx.setLineDash([]);}
      });
      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>⚖️ Mass Effect — Same Force, Different Masses</h3>
        <p style={DESC}>Same force applied to 5 kg, 15 kg, and 30 kg. Heavier block accelerates less.</p></div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        a ∝ 1/m (for constant F). Doubling mass halves acceleration. Tripling mass reduces
        acceleration to one-third. This is why a loaded truck accelerates slower than an empty one.</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Applied Force: {F} N</span>
          <input type="range" min={10} max={150} value={F} onChange={e=>{setF(+e.target.value);blocks.current=[{m:5,x:60,v:0},{m:15,x:60,v:0},{m:30,x:60,v:0}];}} style={{accentColor:C.right}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 3 — Force Effect on Acceleration
 * Physics: Same mass, three forces → a1 < a2 < a3
 * Learning: Larger force → greater acceleration (a ∝ F at constant m)
 * ══════════════════════════════════════════════════════════════════ */
export function Pro3_ForceEffect() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const [m, setM] = useState(10);
  const mR = useRef(m);
  useEffect(()=>{mR.current=m;},[m]);
  const blocks = useRef([{F:20,x:60,v:0},{F:60,x:60,v:0},{F:120,x:60,v:0}]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const rowH=H/3;
    blocks.current=[{F:20,x:60,v:0},{F:60,x:60,v:0},{F:120,x:60,v:0}];
    let last=performance.now();
    const colors=["#94a3b8","#f59e0b","#22c55e"];
    const labels=["Small Force (20 N)","Medium Force (60 N)","Large Force (120 N)"];

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;
      const mass=mR.current;
      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);
      blocks.current.forEach((b,i)=>{
        const ry=i*rowH;
        ctx.fillStyle=i%2===0?C.panel:C.bg;ctx.fillRect(0,ry,W,rowH);
        const gY=ry+rowH-18;
        ctx.fillStyle=C.surface;ctx.fillRect(0,gY,W,18);
        ctx.fillStyle=C.border;ctx.fillRect(0,gY,W,2);
        const a=b.F/mass;
        b.v+=a*dt;b.x+=b.v*dt*35;
        if(b.x>W-80){b.x=W-80;b.v=0;}
        const BH=32,BY=gY-BH,BW=40,col=colors[i];
        const g=ctx.createLinearGradient(b.x,BY,b.x,BY+BH);
        g.addColorStop(0,"#3b82f6");g.addColorStop(1,"#1e40af");
        ctx.fillStyle=g;rRect(ctx,b.x,BY,BW,BH,5);ctx.fill();
        txt(ctx,`${mass}kg`,b.x+BW/2,BY+BH/2,"#fff",10);
        arrow(ctx,b.x+BW,BY+BH/2,b.x+BW+b.F*0.7,BY+BH/2,col,2.5,`${b.F}N`);
        txt(ctx,labels[i],10,ry+rowH/2-12,col,11,"left");
        txt(ctx,`a = ${b.F}/${mass} = ${a.toFixed(2)} m/s²`,W-10,ry+rowH/2+4,C.net,11,"right");
        txt(ctx,`v = ${b.v.toFixed(2)} m/s`,W-10,ry+rowH/2+18,C.text,10,"right");
        if(i<2){ctx.strokeStyle=C.border;ctx.lineWidth=1;ctx.setLineDash([4,4]);
          ctx.beginPath();ctx.moveTo(0,ry+rowH);ctx.lineTo(W,ry+rowH);ctx.stroke();ctx.setLineDash([]);}
      });
      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>🔋 Force Effect — Same Mass, Different Forces</h3>
        <p style={DESC}>Three different forces on the same mass. Larger force → larger acceleration.</p></div>
      <canvas ref={cvs} width={580} height={240} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        a ∝ F (for constant m). Double the force → double the acceleration. Triple the force →
        triple the acceleration. This is the direct proportionality relationship in F = ma.</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.normal}}>Mass: {m} kg</span>
          <input type="range" min={2} max={25} value={m} onChange={e=>{setM(+e.target.value);blocks.current=[{F:20,x:60,v:0},{F:60,x:60,v:0},{F:120,x:60,v:0}];}} style={{accentColor:C.normal}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 4 — Live F vs a Graph (Newton's 2nd Law Graph)
 * Physics: For constant mass, a = F/m → straight line through origin
 * Learning: The F-a graph is linear; slope = 1/m
 * ══════════════════════════════════════════════════════════════════ */
export function Pro3_FMA_Graph() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const history = useRef<{f:number,a:number}[]>([]);
  const [m, setM] = useState(10);
  const [F, setF] = useState(50);
  const mR=useRef(m); const FR=useRef(F);
  useEffect(()=>{mR.current=m;},[m]);
  useEffect(()=>{FR.current=F;},[F]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const GX=60,GY=20,GW=W-140,GH=H-60; // graph area
    const FMAX=200,AMAX=30;
    let last=performance.now();
    history.current=[];

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;
      const mass=mR.current,force=FR.current;
      const a=force/mass;
      history.current.push({f:force,a});
      if(history.current.length>120) history.current.shift();

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);

      // Graph axes
      ctx.strokeStyle=C.border;ctx.lineWidth=1.5;
      ctx.beginPath();ctx.moveTo(GX,GY);ctx.lineTo(GX,GY+GH);ctx.lineTo(GX+GW,GY+GH);ctx.stroke();

      // Grid lines
      ctx.save();ctx.strokeStyle=C.surface;ctx.lineWidth=1;ctx.setLineDash([3,3]);
      for(let f=0;f<=FMAX;f+=50){const px=GX+f/FMAX*GW;ctx.beginPath();ctx.moveTo(px,GY);ctx.lineTo(px,GY+GH);ctx.stroke();}
      for(let a_=0;a_<=AMAX;a_+=5){const py=GY+GH-a_/AMAX*GH;ctx.beginPath();ctx.moveTo(GX,py);ctx.lineTo(GX+GW,py);ctx.stroke();}
      ctx.restore();

      // Theoretical line: a = F/m (straight line)
      ctx.strokeStyle=C.textFaint;ctx.lineWidth=1;ctx.setLineDash([5,4]);
      ctx.beginPath();ctx.moveTo(GX,GY+GH);
      ctx.lineTo(GX+FMAX/FMAX*GW,GY+GH-Math.min(FMAX/mass,AMAX)/AMAX*GH);
      ctx.stroke();ctx.setLineDash([]);

      // Data points (trailing dots)
      history.current.forEach((pt,i)=>{
        const px=GX+pt.f/FMAX*GW, py=GY+GH-Math.min(pt.a,AMAX)/AMAX*GH;
        const alpha=(i/history.current.length)*0.9+0.1;
        ctx.fillStyle=`rgba(245,158,11,${alpha})`;
        ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);ctx.fill();
      });

      // Current point (larger)
      const cpx=GX+force/FMAX*GW, cpy=GY+GH-Math.min(a,AMAX)/AMAX*GH;
      ctx.fillStyle=C.net;ctx.strokeStyle="#fff";ctx.lineWidth=2;
      ctx.beginPath();ctx.arc(cpx,cpy,7,0,Math.PI*2);ctx.fill();ctx.stroke();

      // Axis labels
      txt(ctx,"F (N)",GX+GW/2,GY+GH+22,C.textDim,11);
      txt(ctx,"a",GX-20,GY+GH/2-10,C.textDim,11);
      txt(ctx,"(m/s²)",GX-20,GY+GH/2+6,C.textDim,9);
      for(let f=0;f<=FMAX;f+=50) txt(ctx,`${f}`,GX+f/FMAX*GW,GY+GH+12,C.textFaint,9);
      for(let a_=0;a_<=AMAX;a_+=5) txt(ctx,`${a_}`,GX-14,GY+GH-a_/AMAX*GH,C.textFaint,9);

      // Info panel
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,W-120,GY,110,90,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,W-120,GY,110,90,8);ctx.stroke();
      txt(ctx,"Live Data",W-65,GY+16,C.textDim,10);
      txt(ctx,`F = ${force} N`,W-65,GY+32,C.right,11);
      txt(ctx,`m = ${mass} kg`,W-65,GY+48,C.normal,11);
      txt(ctx,`a = ${a.toFixed(2)} m/s²`,W-65,GY+64,C.net,12);
      txt(ctx,`slope = 1/${mass}`,W-65,GY+80,C.textDim,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>📈 F vs a Graph — Linear Relationship</h3>
        <p style={DESC}>For constant mass, the force-acceleration graph is a straight line through the origin. Slope = 1/m.</p></div>
      <canvas ref={cvs} width={580} height={260} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        a = F/m → a ∝ F for constant m. The graph of a vs F is a straight line (linear) passing through
        the origin. Slope of the line = 1/m. A heavier mass gives a smaller slope (less acceleration per Newton).</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Force F: {F} N</span>
          <input type="range" min={0} max={200} value={F} onChange={e=>setF(+e.target.value)} style={{accentColor:C.right}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.normal}}>Mass m: {m} kg (slope = {(1/m).toFixed(3)})</span>
          <input type="range" min={2} max={30} value={m} onChange={e=>setM(+e.target.value)} style={{accentColor:C.normal}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 5 — Rocket F=ma in Action
 * Physics: Net F = Thrust - Weight; a = F_net / m; v += a·dt
 * Learning: Rocket needs thrust > weight to lift off; a = (T-W)/m
 * ══════════════════════════════════════════════════════════════════ */
export function Pro3_RocketFMA() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({y:0, v:0});
  const [thrust, setThrust] = useState(4000);
  const [rMass, setRMass]   = useState(200);
  const tR=useRef(thrust); const mR=useRef(rMass);
  useEffect(()=>{tR.current=thrust;mR.current=rMass;},[thrust,rMass]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const G=9.8;
    const GROUND=H-50;
    st.current={y:0,v:0};
    let last=performance.now(),t=0;

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;t+=dt;
      const T=tR.current,mass=mR.current;
      const W_force=mass*G;
      const fNet=T-W_force;
      const a=fNet/mass;

      if(st.current.y>0||fNet>0){
        st.current.v+=a*dt;
        st.current.y+=st.current.v*dt*25;
      }
      if(st.current.y<0){st.current.y=0;st.current.v=0;}
      if(st.current.y>GROUND-80){st.current.y=GROUND-80;}

      const ry=GROUND-80-st.current.y;

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      // Sky gradient
      const sky=ctx.createLinearGradient(0,0,0,GROUND);
      sky.addColorStop(0,"#020817");sky.addColorStop(1,"#0f172a");
      ctx.fillStyle=sky;ctx.fillRect(0,0,W,GROUND);
      dots(ctx,W,H);

      // Stars
      ctx.fillStyle="rgba(226,232,240,0.6)";
      for(let sx=0;sx<W;sx+=47)for(let sy=0;sy<GROUND-80;sy+=41){
        ctx.beginPath();ctx.arc(sx+12*Math.sin(sx+sy),sy,0.8,0,Math.PI*2);ctx.fill();
      }

      // Ground
      ctx.fillStyle="#1e3050";ctx.fillRect(0,GROUND,W,H-GROUND);
      ctx.fillStyle=C.border;ctx.fillRect(0,GROUND-2,W,2);
      // Launch pad
      ctx.fillStyle="#374151";rRect(ctx,W/2-40,GROUND-12,80,12,3);ctx.fill();
      ctx.fillStyle="#4b5563";rRect(ctx,W/2-50,GROUND-6,100,6,2);ctx.fill();

      // Rocket exhaust (if thrusting)
      if(T>W_force){
        const flames=Math.sin(t*15)*8;
        const flameGrad=ctx.createLinearGradient(0,ry+70,0,ry+90+flames);
        flameGrad.addColorStop(0,"#fbbf24");flameGrad.addColorStop(0.5,"#f97316");flameGrad.addColorStop(1,"rgba(239,68,68,0)");
        ctx.fillStyle=flameGrad;
        ctx.beginPath();ctx.moveTo(W/2-12,ry+70);ctx.lineTo(W/2+12,ry+70);
        ctx.lineTo(W/2+6+flames/3,ry+90+Math.abs(flames));
        ctx.lineTo(W/2-6-flames/3,ry+90+Math.abs(flames));ctx.closePath();ctx.fill();
      }

      // Rocket body
      const rx=W/2-15,rh=70;
      const rGrad=ctx.createLinearGradient(rx,ry,rx+30,ry);
      rGrad.addColorStop(0,"#e2e8f0");rGrad.addColorStop(0.5,"#94a3b8");rGrad.addColorStop(1,"#64748b");
      ctx.fillStyle=rGrad;rRect(ctx,rx,ry+12,30,rh-12,4);ctx.fill();
      // Nose cone
      ctx.fillStyle="#ef4444";
      ctx.beginPath();ctx.moveTo(W/2,ry);ctx.lineTo(rx,ry+16);ctx.lineTo(rx+30,ry+16);ctx.closePath();ctx.fill();
      // Fins
      ctx.fillStyle="#64748b";
      ctx.beginPath();ctx.moveTo(rx,ry+rh);ctx.lineTo(rx-16,ry+rh+12);ctx.lineTo(rx,ry+rh-12);ctx.closePath();ctx.fill();
      ctx.beginPath();ctx.moveTo(rx+30,ry+rh);ctx.lineTo(rx+46,ry+rh+12);ctx.lineTo(rx+30,ry+rh-12);ctx.closePath();ctx.fill();
      // Window
      ctx.fillStyle="rgba(186,230,253,0.6)";ctx.beginPath();ctx.arc(W/2,ry+32,8,0,Math.PI*2);ctx.fill();

      // Force arrows on rocket
      arrow(ctx,W/2,ry,W/2,ry-T/80,C.right,2.5,`T=${T}N`);
      arrow(ctx,W/2,ry+rh,W/2,ry+rh+W_force/80,C.gravity,2.5,`W=${W_force.toFixed(0)}N`);

      // Info
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,185,100,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,185,100,8);ctx.stroke();
      txt(ctx,"🚀 Rocket Physics",102,26,C.textDim,10);
      txt(ctx,`Thrust T = ${T} N`,102,42,C.right,11);
      txt(ctx,`Weight W = ${W_force.toFixed(0)} N`,102,57,C.gravity,11);
      txt(ctx,`Fnet = ${fNet.toFixed(0)} N`,102,72,fNet>0?C.net:C.left,12);
      txt(ctx,`a = ${a.toFixed(2)} m/s² ${fNet>0?"↑":""}`,102,87,C.net,11);
      txt(ctx,fNet>0?"🟢 LIFTOFF!":fNet===0?"🟡 Hover":"🔴 Too heavy",102,100,fNet>0?"#22c55e":fNet===0?"#f59e0b":"#ef4444",10);

      txt(ctx,`Altitude: ${(st.current.y/25).toFixed(1)}m  v=${st.current.v.toFixed(1)}m/s`,W/2,H-15,C.textDim,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>🚀 Rocket Launch — F=ma in Real Life</h3>
        <p style={DESC}>Thrust must exceed weight for liftoff. Net force = Thrust − Weight. a = F_net / mass.</p></div>
      <canvas ref={cvs} width={580} height={320} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Rocket liftoff: T &gt; W → F_net upward → a upward → rocket accelerates skyward.
        If T = W, rocket hovers (equilibrium). If T &lt; W, rocket stays grounded.
        This is Newton's 2nd Law: a = (T−W)/m.</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Thrust: {thrust} N</span>
          <input type="range" min={500} max={6000} step={100} value={thrust} onChange={e=>{setThrust(+e.target.value);st.current={y:0,v:0};}} style={{accentColor:C.right}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.normal}}>Rocket Mass: {rMass} kg (W={rMass*9.8}N)</span>
          <input type="range" min={50} max={500} step={10} value={rMass} onChange={e=>{setRMass(+e.target.value);st.current={y:0,v:0};}} style={{accentColor:C.normal}}/></div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
 * SIMULATION 6 — Impulse = Change in Momentum (F·t = Δp)
 * Physics: J = F·t = m·Δv = Δp; shorter time → greater force needed
 * Learning: Newton's 2nd Law in momentum form: F = Δp/Δt
 * ══════════════════════════════════════════════════════════════════ */
export function Pro3_MomentumChange() {
  const cvs = useRef<HTMLCanvasElement>(null);
  const raf  = useRef(0);
  const st   = useRef({x:60,v:0,t_contact:0,phase:"move" as "move"|"impact"|"after"});
  const [m, setM]  = useState(5);
  const [v0, setV0] = useState(4);
  const [wallX, setWallX] = useState(400);
  const mR=useRef(m); const v0R=useRef(v0); const wR=useRef(wallX);
  useEffect(()=>{mR.current=m;v0R.current=v0;wR.current=wallX;},[m,v0,wallX]);

  useEffect(()=>{
    const cv=cvs.current;if(!cv)return;
    const ctx=cv.getContext("2d")!;
    const W=cv.width,H=cv.height;
    const BY=H-90,BH=40,BW=44;
    const reset=()=>{st.current={x:60,v:v0R.current,t_contact:0,phase:"move"};};
    reset();
    let last=performance.now();

    function frame(now:number){
      const dt=Math.min((now-last)/1000,1/30);last=now;
      const s=st.current,mass=mR.current;
      const wx=wR.current;
      const v_initial=v0R.current;
      const p_initial=mass*v_initial;
      let impulse=0;

      if(s.phase==="move"){
        s.x+=s.v*dt*50;
        if(s.x+BW>=wx){s.phase="impact";s.t_contact=0;}
      } else if(s.phase==="impact"){
        s.t_contact+=dt;
        s.v=-v_initial; // elastic bounce
        if(s.t_contact>0.2){s.phase="after";}
      } else {
        s.x+=s.v*dt*50;
        if(s.x<0){reset();}
      }

      impulse=mass*(s.v-v_initial);
      const force=s.phase==="impact"?Math.abs(mass*2*v_initial/0.15):0;

      ctx.fillStyle=C.bg;ctx.fillRect(0,0,W,H);
      dots(ctx,W,H);
      ctx.fillStyle=C.surface;ctx.fillRect(0,BY+BH,W,H-BY-BH);
      ctx.fillStyle=C.border;ctx.fillRect(0,BY+BH,W,2);

      // Wall
      ctx.fillStyle="#374151";ctx.fillRect(wx,BY-20,16,BH+40);
      ctx.fillStyle="#4b5563";ctx.fillRect(wx,BY-20,4,BH+40);
      ctx.fillStyle="#6b7280";
      for(let wy=BY-20;wy<BY+BH+20;wy+=12){ctx.fillRect(wx,wy,16,6);}

      // Block
      const bx=s.x;
      const col=s.phase==="impact"?"#ef4444":"#3b82f6";
      const bg=ctx.createLinearGradient(bx,BY,bx,BY+BH);
      bg.addColorStop(0,col);bg.addColorStop(1,col+"aa");
      ctx.fillStyle=bg;rRect(ctx,bx,BY,BW,BH,6);ctx.fill();
      txt(ctx,`${mass}kg`,bx+BW/2,BY+BH/2,"#fff",11);

      // Velocity arrow
      if(Math.abs(s.v)>0.1) arrow(ctx,bx+BW/2,BY-18,bx+BW/2+s.v*15,BY-18,s.v>0?C.right:C.left,2.5,`v=${s.v.toFixed(1)}m/s`);

      // Info panel
      ctx.fillStyle="rgba(7,16,31,0.9)";
      rRect(ctx,10,10,200,105,8);ctx.fill();ctx.strokeStyle=C.border;ctx.lineWidth=1;
      rRect(ctx,10,10,200,105,8);ctx.stroke();
      txt(ctx,"Impulse-Momentum Theorem",110,26,C.textDim,10);
      txt(ctx,`Initial p = mv = ${p_initial.toFixed(1)} kg·m/s`,110,42,C.right,11);
      txt(ctx,`After p  = m×(-v) = ${-p_initial.toFixed(1)} kg·m/s`,110,57,C.left,11);
      txt(ctx,`Δp = ${(mass*2*v_initial).toFixed(1)} kg·m/s`,110,72,C.net,12);
      txt(ctx,`J = F·t = Δp = ${(mass*2*v_initial).toFixed(1)} N·s`,110,87,C.net,11);
      txt(ctx,s.phase==="impact"?`F ≈ ${force.toFixed(0)} N during impact`:
             s.phase==="after"?"Bounced! →":"→ Moving toward wall",110,100,C.textDim,10);

      raf.current=requestAnimationFrame(frame);
    }
    raf.current=requestAnimationFrame(frame);
    return ()=>cancelAnimationFrame(raf.current);
  },[]);

  return(
    <div style={WRAP}>
      <div style={HEAD}><h3 style={TITLE}>💥 Impulse & Change in Momentum — F·t = Δp</h3>
        <p style={DESC}>Block bounces off wall. Net force × contact time = change in momentum (Impulse-Momentum Theorem).</p></div>
      <canvas ref={cvs} width={580} height={260} style={{width:"100%",display:"block"}}/>
      <div style={CONCEPT}><strong style={{color:"#93c5fd"}}>Key Concept:</strong>{" "}
        Newton's 2nd Law in momentum form: F = Δp/Δt → F·Δt = Δp (Impulse).
        Impulse = change in momentum. Short contact time → enormous force for same Δp
        (explains why airbags save lives: more time → less force on body).</div>
      <div style={CTRLS}>
        <div style={SW}><span style={{fontSize:11,color:C.normal}}>Mass: {m} kg</span>
          <input type="range" min={1} max={20} value={m} onChange={e=>setM(+e.target.value)} style={{accentColor:C.normal}}/></div>
        <div style={SW}><span style={{fontSize:11,color:C.right}}>Initial velocity: {v0} m/s</span>
          <input type="range" min={1} max={10} value={v0} onChange={e=>setV0(+e.target.value)} style={{accentColor:C.right}}/></div>
      </div>
    </div>
  );
}
