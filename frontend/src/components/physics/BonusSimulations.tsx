/**
 * FILE: BonusSimulations.tsx
 * LOCATION: src/components/physics/BonusSimulations.tsx
 * PURPOSE: Sixth simulation for each Force & Laws of Motion topic.
 *          Each bonus sim demonstrates a vivid, real-world application of the concept
 *          using interactive sliders, animations, and live physics calculations.
 *
 * TOPICS COVERED:
 *   Topic 1 — Balanced/Unbalanced Forces  → Car Safety Physics (Crumple Zones)
 *   Topic 2 — Newton's First Law / Inertia → Spacecraft Free Motion in Space
 *   Topic 3 — Newton's Second Law (F=ma)  → Rocket Launch Thrust Calculator
 *   Topic 4 — Newton's Third Law          → Recoil & Gun-Bullet Physics
 *   Topic 5 — Conservation of Momentum    → Ballistic Pendulum Experiment
 *
 * DEPENDENCIES: React, CSS Modules (PhysicsSimulation.module.css reused + inline styles)
 * USED BY: PhysicsSimulation.tsx (TopicSimulation wrapper)
 * LAST UPDATED: 2026-05-29
 */

"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./PhysicsSimulation.module.css";

/* ══════════════════════════════════════════════════════════════════════════
 * TOPIC 1 BONUS — Car Safety Physics: Crumple Zones & Impulse
 * Shows how increasing collision time (crumple zones / airbags) reduces force
 * ══════════════════════════════════════════════════════════════════════════ */
export function CarSafetySimulation() {
  const [carMass, setCarMass] = useState(1000);        // kg
  const [carSpeed, setCarSpeed] = useState(60);         // km/h
  const [collisionTime, setCollisionTime] = useState(200); // ms
  const [crumpleEnabled, setCrumpleEnabled] = useState(false);
  const [impactPhase, setImpactPhase] = useState<"ready"|"crashing"|"done">("ready");
  const [carX, setCarX] = useState(30);
  const animRef = useRef<number>(0);

  const speedMs = carSpeed / 3.6;
  const momentum = carMass * speedMs;
  const timeS = (crumpleEnabled ? collisionTime * 3 : collisionTime) / 1000;
  const forcekN = (momentum / timeS / 1000).toFixed(1);
  const isSafe = Number(forcekN) < 50;
  const actualTimeMs = crumpleEnabled ? collisionTime * 3 : collisionTime;

  const startCrash = useCallback(() => {
    if (impactPhase !== "ready") { setImpactPhase("ready"); setCarX(30); return; }
    setImpactPhase("crashing");
    const startTime = Date.now();
    const moveDuration = 1200;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / moveDuration, 1);
      setCarX(30 + progress * 155);
      if (progress < 1) {
        animRef.current = requestAnimationFrame(animate);
      } else {
        setImpactPhase("done");
      }
    };
    animRef.current = requestAnimationFrame(animate);
  }, [impactPhase]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>🚗</span>
        Bonus Sim 6: Car Safety Physics — Crumple Zones &amp; Impulse
      </div>
      <p className={styles.simDesc}>
        Real-world application: A car crashes into a wall. Discover how crumple zones
        and airbags reduce the impact force by <strong>increasing collision time</strong>.
        F = Δp / Δt — less Δt means MORE force on the passengers!
      </p>

      {/* Crash Arena */}
      <div style={{
        position:"relative", height:100, background:"linear-gradient(180deg,#0f172a 60%,#1e293b 100%)",
        borderRadius:12, margin:"16px 0", overflow:"hidden", border:"1px solid rgba(99,102,241,0.2)"
      }}>
        {/* Road markings */}
        {[0,1,2,3,4].map(i => (
          <div key={i} style={{
            position:"absolute", bottom:14, left:`${i*20+5}%`, width:40, height:4,
            background:"rgba(255,255,255,0.2)", borderRadius:2
          }}/>
        ))}
        {/* Wall */}
        <div style={{
          position:"absolute", right:10, top:10, width:22, height:80,
          background:"linear-gradient(180deg,#64748b,#334155)",
          borderRadius:4, display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:24
        }}>🧱</div>
        {/* Car */}
        <div style={{
          position:"absolute", left:`${carX}px`, top:22,
          fontSize:impactPhase==="done" ? "1.8rem" : "2.2rem",
          transition: impactPhase==="crashing" ? "none" : "left 0.3s ease",
          filter: impactPhase==="done" ? "grayscale(1) brightness(0.6)" : "none",
          transform: impactPhase==="done" ? "scaleX(-0.7)" : "none"
        }}>
          {impactPhase==="done" ? "💥" : "🚗"}
        </div>
        {/* Impact label */}
        {impactPhase==="done" && (
          <div style={{
            position:"absolute", top:8, left:"50%", transform:"translateX(-50%)",
            padding:"4px 12px", borderRadius:8, fontSize:"0.75rem", fontWeight:700,
            background: isSafe ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)",
            color: isSafe ? "#6ee7b7" : "#fca5a5",
            border: `1px solid ${isSafe ? "#10b981" : "#ef4444"}`
          }}>
            {isSafe ? "✓ Survivable" : "✗ Fatal Force"} — {forcekN} kN impact
          </div>
        )}
      </div>

      {/* Physics readout */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16,
        fontSize:"0.8rem"
      }}>
        {[
          { label:"Car Momentum", value:`${(momentum/1000).toFixed(1)} kN·s`, color:"#6366f1" },
          { label:"Collision Time", value:`${actualTimeMs} ms`, color:"#06b6d4" },
          { label:"Impact Force", value:`${forcekN} kN`, color: Number(forcekN)>50?"#ef4444":"#10b981" },
          { label:"Safety", value: isSafe?"Safe ✓":"Dangerous ✗", color: isSafe?"#10b981":"#ef4444" },
        ].map(item => (
          <div key={item.label} style={{
            background:"rgba(255,255,255,0.04)", borderRadius:8, padding:"8px 12px",
            border:`1px solid rgba(255,255,255,0.08)`
          }}>
            <div style={{color:"#94a3b8", fontSize:"0.7rem"}}>{item.label}</div>
            <div style={{color:item.color, fontWeight:700, fontSize:"0.9rem"}}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.sliderLabel}>
          Car speed: <strong style={{color:"#f59e0b"}}>{carSpeed} km/h</strong>
          <input type="range" min={20} max={120} value={carSpeed}
            onChange={e => { setCarSpeed(+e.target.value); setImpactPhase("ready"); setCarX(30); }}
            className={styles.slider} style={{accentColor:"#f59e0b"}} />
        </label>
        <label className={styles.sliderLabel}>
          Collision time (no crumple): <strong style={{color:"#06b6d4"}}>{collisionTime} ms</strong>
          <input type="range" min={10} max={500} value={collisionTime}
            onChange={e => { setCollisionTime(+e.target.value); setImpactPhase("ready"); setCarX(30); }}
            className={styles.slider} style={{accentColor:"#06b6d4"}} />
        </label>
        <label style={{display:"flex",alignItems:"center",gap:10,fontSize:"0.875rem",color:"#cbd5e1",cursor:"pointer"}}>
          <input type="checkbox" checked={crumpleEnabled}
            onChange={e => { setCrumpleEnabled(e.target.checked); setImpactPhase("ready"); setCarX(30); }}
            style={{width:16,height:16,accentColor:"#10b981"}} />
          <span>Enable crumple zone (×3 collision time = {crumpleEnabled ? collisionTime*3 : collisionTime} ms)</span>
        </label>
      </div>

      <div className={styles.simControls}>
        <button className={styles.simBtn} onClick={startCrash}>
          {impactPhase==="ready" ? "💥 Crash!" : impactPhase==="crashing" ? "⏳ Crashing..." : "↺ Reset"}
        </button>
      </div>

      <div style={{
        marginTop:12, padding:"10px 14px", borderRadius:8,
        background:"rgba(99,102,241,0.08)", fontSize:"0.78rem", color:"#94a3b8",
        lineHeight:1.6
      }}>
        <strong style={{color:"#c7d2fe"}}>Physics insight:</strong> Impulse (Δp) is fixed —
        the car must stop regardless. But F = Δp/Δt means a <em>longer</em> Δt gives a
        <em> smaller</em> F. Crumple zones triple the collision time, reducing force by 3×.
        This is why modern cars are designed to crush — to save lives!
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 * TOPIC 2 BONUS — Spacecraft Free Motion (Newton's First Law in Space)
 * Shows that without friction, a pushed object travels forever at const velocity
 * ══════════════════════════════════════════════════════════════════════════ */
export function SpacecraftSimulation() {
  const [thrust, setThrust] = useState(0);
  const [mass, setMass] = useState(500);
  const [friction, setFriction] = useState(0);
  const [shipX, setShipX] = useState(20);
  const [velocity, setVelocity] = useState(0);
  const [running, setRunning] = useState(false);
  const animRef = useRef<number>(0);
  const stateRef = useRef({ x: 20, v: 0 });

  const MAX_X = 340;

  const startStop = useCallback(() => {
    if (running) {
      cancelAnimationFrame(animRef.current);
      setRunning(false);
      return;
    }
    stateRef.current = { x: shipX, v: velocity };
    setRunning(true);
    let last = Date.now();
    const accel = thrust / mass;
    const drag = friction / 100;
    const tick = () => {
      const now = Date.now();
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      stateRef.current.v += accel * dt - stateRef.current.v * drag;
      stateRef.current.x += stateRef.current.v * 40 * dt;
      if (stateRef.current.x >= MAX_X) {
        stateRef.current.x = 20;
      }
      setShipX(stateRef.current.x);
      setVelocity(parseFloat(stateRef.current.v.toFixed(2)));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, [running, thrust, mass, friction, shipX, velocity]);

  const reset = useCallback(() => {
    cancelAnimationFrame(animRef.current);
    setRunning(false); setShipX(20); setVelocity(0);
    stateRef.current = { x: 20, v: 0 };
  }, []);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const envLabel = friction === 0 ? "Deep Space (no friction)" :
                   friction < 30 ? "Low Orbit (thin atmosphere)" :
                   friction < 70 ? "Upper Atmosphere" : "Dense Atmosphere";

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>🚀</span>
        Bonus Sim 6: Spacecraft &amp; Newton's First Law in Space
      </div>
      <p className={styles.simDesc}>
        In space, there is no air resistance. A spacecraft given a single thrust will
        travel at constant velocity forever — exactly as Newton's First Law predicts.
        Adjust friction to see how atmosphere changes the outcome.
      </p>

      {/* Space arena */}
      <div style={{
        position:"relative", height:100, overflow:"hidden", borderRadius:12,
        background:"radial-gradient(ellipse at center, #0f172a 0%, #020617 100%)",
        margin:"16px 0", border:"1px solid rgba(99,102,241,0.15)"
      }}>
        {/* Stars */}
        {Array.from({length:20}).map((_,i) => (
          <div key={i} style={{
            position:"absolute", borderRadius:"50%",
            width: i%3===0?2:1, height: i%3===0?2:1,
            background:"white", opacity:0.4+Math.random()*0.4,
            top:`${5+((i*37)%90)}%`, left:`${(i*19)%100}%`
          }}/>
        ))}
        {/* Velocity trail */}
        {running && velocity > 0.1 && (
          <div style={{
            position:"absolute", top:"44%", left:`${shipX-20}px`,
            width:Math.min(velocity*15,80), height:3,
            background:"linear-gradient(to left, rgba(99,102,241,0.6), transparent)",
            borderRadius:2
          }}/>
        )}
        {/* Spacecraft */}
        <div style={{
          position:"absolute", left:`${shipX}px`, top:34,
          fontSize:"1.8rem", transition:"none",
          filter: running && velocity > 1 ? "drop-shadow(0 0 6px #6366f1)" : "none"
        }}>🛸</div>
        {/* Stats overlay */}
        <div style={{
          position:"absolute", bottom:8, right:10, fontSize:"0.7rem",
          color:"#94a3b8", textAlign:"right"
        }}>
          <div>v = <strong style={{color:"#6366f1"}}>{velocity.toFixed(2)} m/s</strong></div>
          <div>{envLabel}</div>
        </div>
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.sliderLabel}>
          Thrust: <strong style={{color:"#6366f1"}}>{thrust} N</strong>
          <input type="range" min={0} max={500} value={thrust}
            onChange={e=>{setThrust(+e.target.value); if(!running) setVelocity(0);}}
            className={styles.slider} style={{accentColor:"#6366f1"}} />
        </label>
        <label className={styles.sliderLabel}>
          Spacecraft mass: <strong style={{color:"#f59e0b"}}>{mass} kg</strong>
          <input type="range" min={50} max={2000} value={mass}
            onChange={e=>setMass(+e.target.value)}
            className={styles.slider} style={{accentColor:"#f59e0b"}} />
        </label>
        <label className={styles.sliderLabel}>
          Atmospheric drag: <strong style={{color:"#ef4444"}}>{friction}%</strong>
          <input type="range" min={0} max={100} value={friction}
            onChange={e=>setFriction(+e.target.value)}
            className={styles.slider} style={{accentColor:"#ef4444"}} />
        </label>
      </div>

      <div className={styles.simControls}>
        <button className={styles.simBtn} onClick={startStop}>
          {running ? "⏸ Pause" : "▶ Launch"}
        </button>
        <button className={`${styles.simBtn} ${styles.simBtnDanger}`} onClick={reset}>↺ Reset</button>
      </div>

      {thrust === 0 && velocity > 0 && friction === 0 && (
        <div style={{
          marginTop:12, padding:"10px 14px", borderRadius:8,
          background:"rgba(16,185,129,0.08)", fontSize:"0.78rem", color:"#6ee7b7",
          lineHeight:1.6, border:"1px solid rgba(16,185,129,0.2)"
        }}>
          🎉 <strong>First Law in action!</strong> Thrust is OFF, yet the spacecraft
          continues at constant velocity — because there's no friction to stop it.
          This is exactly what Voyager 1 does right now, 24+ billion km from Earth!
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 * TOPIC 3 BONUS — Rocket Launch Thrust Calculator (F = ma in Real Life)
 * User builds a rocket by choosing fuel, payload, and thrust to reach orbit
 * ══════════════════════════════════════════════════════════════════════════ */
export function RocketLaunchSimulation() {
  const [thrust, setThrust] = useState(5000);    // kN
  const [rocketMass, setRocketMass] = useState(200);  // tonnes
  const [payload, setPayload] = useState(20);    // tonnes
  const [altitude, setAltitude] = useState(0);
  const [launched, setLaunched] = useState(false);
  const [velocity, setVelocity] = useState(0);
  const animRef = useRef<number>(0);
  const stateRef = useRef({alt:0, vel:0});

  const totalMass = (rocketMass + payload) * 1000; // kg
  const thrustN = thrust * 1000;                   // N
  const netForce = thrustN - totalMass * 9.8;       // subtract gravity
  const acceleration = (netForce / totalMass).toFixed(2);
  const canLaunch = netForce > 0;
  const thrustToWeightRatio = (thrustN / (totalMass * 9.8)).toFixed(2);

  const launch = useCallback(() => {
    if (launched) {
      cancelAnimationFrame(animRef.current);
      setLaunched(false); setAltitude(0); setVelocity(0);
      stateRef.current = {alt:0, vel:0};
      return;
    }
    if (!canLaunch) return;
    setLaunched(true);
    stateRef.current = {alt:0, vel:0};
    const a = netForce / totalMass;
    let last = Date.now();
    const tick = () => {
      const now = Date.now();
      const dt = Math.min((now-last)/1000, 0.05);
      last = now;
      stateRef.current.vel += a * dt;
      stateRef.current.alt += stateRef.current.vel * dt;
      if (stateRef.current.alt > 400) {
        setAltitude(400); setVelocity(parseFloat(stateRef.current.vel.toFixed(0)));
        setLaunched(false); return;
      }
      setAltitude(parseFloat(stateRef.current.alt.toFixed(0)));
      setVelocity(parseFloat(stateRef.current.vel.toFixed(0)));
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
  }, [launched, canLaunch, netForce, totalMass]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const rocketY = Math.min(altitude / 400 * 80, 80);

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>🚀</span>
        Bonus Sim 6: Rocket Launch — F = ma in Real Life
      </div>
      <p className={styles.simDesc}>
        Design a rocket using Newton's Second Law. Your thrust must overcome gravity
        (F = mg) to produce upward acceleration. Adjust thrust, mass, and payload to
        achieve a successful launch. This is exactly how SpaceX engineers design rockets!
      </p>

      {/* Launch pad */}
      <div style={{
        position:"relative", height:120, borderRadius:12, margin:"16px 0",
        background:"linear-gradient(180deg,#020617 0%,#0f172a 60%,#1e3a0e 100%)",
        overflow:"hidden", border:"1px solid rgba(99,102,241,0.15)"
      }}>
        {/* Stars */}
        {[10,25,40,55,70,85].map((x,i)=>(
          <div key={i} style={{position:"absolute",width:2,height:2,borderRadius:"50%",
            background:"white",opacity:0.6,top:`${5+i*8}%`,left:`${x}%`}}/>
        ))}
        {/* Ground */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:14,
          background:"linear-gradient(#16a34a,#15803d)"}}/>
        {/* Rocket */}
        <div style={{
          position:"absolute", left:"calc(50% - 14px)", bottom:`${14+rocketY}px`,
          fontSize:"1.6rem", transition: launched?"none":"bottom 0.3s ease",
          filter: launched && velocity > 50 ? "drop-shadow(0 2px 8px #f59e0b)" : "none"
        }}>🚀</div>
        {/* Flames */}
        {launched && (
          <div style={{
            position:"absolute", left:"calc(50% - 6px)", bottom:`${14+rocketY-12}px`,
            fontSize:"0.9rem", animation:"none"
          }}>🔥</div>
        )}
        {/* Stats */}
        <div style={{position:"absolute",top:8,right:10,fontSize:"0.7rem",color:"#94a3b8",textAlign:"right"}}>
          <div>Alt: <strong style={{color:"#6366f1"}}>{altitude} km</strong></div>
          <div>v: <strong style={{color:"#f59e0b"}}>{velocity} m/s</strong></div>
        </div>
        {/* Launch impossible warning */}
        {!canLaunch && (
          <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
            background:"rgba(239,68,68,0.3)",borderRadius:8,padding:"4px 10px",
            fontSize:"0.75rem",color:"#fca5a5",fontWeight:600,border:"1px solid #ef4444",
            whiteSpace:"nowrap"
          }}>⚠ Thrust too low — can't lift off!</div>
        )}
      </div>

      {/* Data panel */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginBottom:16}}>
        {[
          {label:"Total Mass",value:`${(totalMass/1000).toFixed(0)} t`,color:"#6366f1"},
          {label:"Net Force",value:`${(netForce/1000).toFixed(0)} kN`,color:canLaunch?"#10b981":"#ef4444"},
          {label:"Acceleration",value:`${acceleration} m/s²`,color:"#f59e0b"},
          {label:"T/W Ratio",value:thrustToWeightRatio,color: +thrustToWeightRatio>1?"#10b981":"#ef4444"},
          {label:"Altitude",value:`${altitude} km`,color:"#06b6d4"},
          {label:"Velocity",value:`${velocity} m/s`,color:"#a855f7"},
        ].map(item=>(
          <div key={item.label} style={{background:"rgba(255,255,255,0.04)",borderRadius:8,
            padding:"6px 10px",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{color:"#94a3b8",fontSize:"0.65rem"}}>{item.label}</div>
            <div style={{color:item.color,fontWeight:700,fontSize:"0.85rem"}}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.sliderLabel}>
          Engine thrust: <strong style={{color:"#6366f1"}}>{thrust} kN</strong>
          <input type="range" min={500} max={15000} step={100} value={thrust}
            onChange={e=>{setThrust(+e.target.value);if(launched){cancelAnimationFrame(animRef.current);setLaunched(false);setAltitude(0);setVelocity(0);}}}
            className={styles.slider} style={{accentColor:"#6366f1"}} />
        </label>
        <label className={styles.sliderLabel}>
          Rocket dry mass: <strong style={{color:"#f59e0b"}}>{rocketMass} tonnes</strong>
          <input type="range" min={10} max={500} value={rocketMass}
            onChange={e=>setRocketMass(+e.target.value)}
            className={styles.slider} style={{accentColor:"#f59e0b"}} />
        </label>
        <label className={styles.sliderLabel}>
          Payload: <strong style={{color:"#a855f7"}}>{payload} tonnes</strong>
          <input type="range" min={1} max={100} value={payload}
            onChange={e=>setPayload(+e.target.value)}
            className={styles.slider} style={{accentColor:"#a855f7"}} />
        </label>
      </div>

      <div className={styles.simControls}>
        <button className={styles.simBtn} onClick={launch} disabled={!canLaunch && !launched}>
          {launched ? "🛑 Abort" : canLaunch ? "🚀 Launch!" : "⚠ Cannot Launch"}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 * TOPIC 4 BONUS — Gun Recoil Physics (Newton's Third Law)
 * Demonstrates action-reaction: bullet fires forward, gun kicks backward
 * ══════════════════════════════════════════════════════════════════════════ */
export function RecoilSimulation() {
  const [bulletMass, setBulletMass] = useState(10);      // grams
  const [gunMass, setGunMass] = useState(4000);          // grams
  const [bulletVelocity, setBulletVelocity] = useState(800); // m/s
  const [fired, setFired] = useState(false);
  const [bulletX, setBulletX] = useState(150);
  const [gunX, setGunX] = useState(150);
  const animRef = useRef<number>(0);

  const bulletMassKg = bulletMass / 1000;
  const gunMassKg = gunMass / 1000;
  const gunRecoilVelocity = (bulletMassKg * bulletVelocity) / gunMassKg;
  const bulletMomentum = bulletMassKg * bulletVelocity;
  const gunMomentum = gunMassKg * gunRecoilVelocity;

  const fire = useCallback(() => {
    if (fired) {
      cancelAnimationFrame(animRef.current);
      setFired(false); setBulletX(150); setGunX(150);
      return;
    }
    setFired(true);
    const startTime = Date.now();
    const duration = 1500;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(elapsed / duration, 1);
      setBulletX(150 + t * 180);
      setGunX(150 - t * Math.min(gunRecoilVelocity * 30, 100));
      if (t < 1) animRef.current = requestAnimationFrame(animate);
    };
    animRef.current = requestAnimationFrame(animate);
  }, [fired, gunRecoilVelocity]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>🔫</span>
        Bonus Sim 6: Gun Recoil — Newton's Third Law in Action
      </div>
      <p className={styles.simDesc}>
        When a gun fires, the bullet experiences a forward force (action) and the gun
        experiences an equal backward force (reaction). Conservation of momentum:
        total momentum before = total momentum after = 0.
      </p>

      {/* Firing arena */}
      <div style={{
        position:"relative", height:90, borderRadius:12, margin:"16px 0",
        background:"#0f172a", overflow:"hidden", border:"1px solid rgba(99,102,241,0.15)"
      }}>
        {/* Gun */}
        <div style={{
          position:"absolute", top:28, fontSize:"2rem",
          left:`${gunX-20}px`, transition:"none"
        }}>🔫</div>
        {/* Bullet */}
        {fired && (
          <div style={{
            position:"absolute", top:36, fontSize:"1rem",
            left:`${bulletX}px`, transition:"none"
          }}>🔶</div>
        )}
        {/* Flash */}
        {fired && bulletX < 200 && (
          <div style={{position:"absolute",top:30,left:`${gunX+30}px`,fontSize:"1.2rem"}}>✨</div>
        )}
        {/* Direction labels */}
        <div style={{position:"absolute",bottom:8,left:10,fontSize:"0.65rem",color:"#6366f1"}}>
          ← Gun recoil ({gunRecoilVelocity.toFixed(2)} m/s)
        </div>
        <div style={{position:"absolute",bottom:8,right:10,fontSize:"0.65rem",color:"#ef4444"}}>
          Bullet → ({bulletVelocity} m/s)
        </div>
      </div>

      {/* Momentum conservation panel */}
      <div style={{
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:16
      }}>
        {[
          {label:"Bullet Momentum",value:`${bulletMomentum.toFixed(2)} kg·m/s →`,color:"#ef4444"},
          {label:"Gun Momentum",value:`${gunMomentum.toFixed(2)} kg·m/s ←`,color:"#6366f1"},
          {label:"Total Before",value:"0 kg·m/s",color:"#10b981"},
          {label:"Total After",value:`≈ 0 kg·m/s ✓`,color:"#10b981"},
        ].map(item=>(
          <div key={item.label} style={{background:"rgba(255,255,255,0.04)",borderRadius:8,
            padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{color:"#94a3b8",fontSize:"0.68rem"}}>{item.label}</div>
            <div style={{color:item.color,fontWeight:700,fontSize:"0.85rem"}}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.sliderLabel}>
          Bullet mass: <strong style={{color:"#ef4444"}}>{bulletMass} g</strong>
          <input type="range" min={1} max={50} value={bulletMass}
            onChange={e=>{setBulletMass(+e.target.value);setFired(false);setBulletX(150);setGunX(150);cancelAnimationFrame(animRef.current);}}
            className={styles.slider} style={{accentColor:"#ef4444"}} />
        </label>
        <label className={styles.sliderLabel}>
          Gun mass: <strong style={{color:"#6366f1"}}>{(gunMass/1000).toFixed(1)} kg</strong>
          <input type="range" min={500} max={10000} step={100} value={gunMass}
            onChange={e=>{setGunMass(+e.target.value);setFired(false);setBulletX(150);setGunX(150);cancelAnimationFrame(animRef.current);}}
            className={styles.slider} style={{accentColor:"#6366f1"}} />
        </label>
        <label className={styles.sliderLabel}>
          Muzzle velocity: <strong style={{color:"#f59e0b"}}>{bulletVelocity} m/s</strong>
          <input type="range" min={100} max={1500} value={bulletVelocity}
            onChange={e=>{setBulletVelocity(+e.target.value);setFired(false);setBulletX(150);setGunX(150);cancelAnimationFrame(animRef.current);}}
            className={styles.slider} style={{accentColor:"#f59e0b"}} />
        </label>
      </div>

      <div className={styles.simControls}>
        <button className={styles.simBtn} onClick={fire}>
          {fired ? "↺ Reset" : "🔫 Fire!"}
        </button>
      </div>

      <div style={{
        marginTop:12, padding:"10px 14px", borderRadius:8,
        background:"rgba(99,102,241,0.08)", fontSize:"0.78rem", color:"#94a3b8",
        lineHeight:1.6
      }}>
        <strong style={{color:"#c7d2fe"}}>Key formula:</strong> p_bullet + p_gun = 0 &nbsp;→&nbsp;
        m₁v₁ = m₂v₂ &nbsp;→&nbsp; Recoil velocity = (m_bullet × v_bullet) / m_gun =&nbsp;
        <strong style={{color:"#6366f1"}}>{gunRecoilVelocity.toFixed(3)} m/s</strong>.
        A heavier gun has less recoil (smaller velocity) for the same bullet — the shooter's shoulder thanks them!
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
 * TOPIC 5 BONUS — Ballistic Pendulum (Conservation of Momentum + Energy)
 * Classic physics lab experiment: bullet hits pendulum, they swing together
 * ══════════════════════════════════════════════════════════════════════════ */
export function BallisticPendulumSimulation() {
  const [bulletMass, setBulletMass] = useState(0.05);   // kg
  const [bulletSpeed, setBulletSpeed] = useState(400);  // m/s
  const [pendulumMass, setPendulumMass] = useState(5);  // kg
  const [phase, setPhase] = useState<"ready"|"fired"|"swinging">("ready");
  const [swingAngle, setSwingAngle] = useState(0);
  const animRef = useRef<number>(0);

  const combinedMass = bulletMass + pendulumMass;
  const systemVelocity = (bulletMass * bulletSpeed) / combinedMass;
  const kineticBefore = 0.5 * bulletMass * bulletSpeed * bulletSpeed;
  const kineticAfter = 0.5 * combinedMass * systemVelocity * systemVelocity;
  const energyLost = kineticBefore - kineticAfter;
  const swingHeight = (systemVelocity * systemVelocity) / (2 * 9.8);
  const maxAngle = Math.min(Math.atan2(Math.sqrt(2*9.8*swingHeight), 1) * 180 / Math.PI, 85);

  const fire = useCallback(() => {
    if (phase !== "ready") {
      cancelAnimationFrame(animRef.current);
      setPhase("ready"); setSwingAngle(0); return;
    }
    setPhase("fired");
    setTimeout(() => {
      setPhase("swinging");
      const start = Date.now();
      const period = 1200;
      const swing = () => {
        const t = (Date.now() - start) / period * Math.PI;
        setSwingAngle(maxAngle * Math.cos(t) * Math.exp(-(Date.now()-start)/5000));
        animRef.current = requestAnimationFrame(swing);
      };
      animRef.current = requestAnimationFrame(swing);
    }, 400);
  }, [phase, maxAngle]);

  useEffect(() => () => cancelAnimationFrame(animRef.current), []);

  const pendX = 140 + Math.sin(swingAngle * Math.PI / 180) * 70;
  const pendY = 20 + (1 - Math.cos(swingAngle * Math.PI / 180)) * 70;

  return (
    <div className={styles.simCard}>
      <div className={styles.simTitle}>
        <span className={styles.simIcon}>🎯</span>
        Bonus Sim 6: Ballistic Pendulum — Momentum Conservation Lab
      </div>
      <p className={styles.simDesc}>
        The ballistic pendulum is a classic experiment to measure bullet speed using
        conservation of momentum. A bullet embeds in a pendulum block and they swing
        together. From the swing height, we calculate initial bullet speed!
      </p>

      {/* Pendulum arena */}
      <div style={{
        position:"relative", height:140, borderRadius:12, margin:"16px 0",
        background:"linear-gradient(180deg,#0f172a,#1e293b)",
        overflow:"hidden", border:"1px solid rgba(99,102,241,0.15)"
      }}>
        {/* Pivot */}
        <div style={{
          position:"absolute", top:2, left:140, width:12, height:12,
          borderRadius:"50%", background:"#64748b", zIndex:2
        }}/>
        {/* String */}
        <svg style={{position:"absolute",top:0,left:0,width:"100%",height:"100%",overflow:"visible",pointerEvents:"none"}}>
          <line x1={146} y1={8} x2={pendX+12} y2={pendY+20} stroke="rgba(255,255,255,0.3)" strokeWidth={1.5}/>
        </svg>
        {/* Pendulum block */}
        <div style={{
          position:"absolute", left:`${pendX-2}px`, top:`${pendY+10}px`,
          width:28, height:28, background:"linear-gradient(135deg,#475569,#334155)",
          borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:14, border:"1px solid #64748b", zIndex:2
        }}>📦</div>
        {/* Bullet */}
        {phase==="fired" && (
          <div style={{
            position:"absolute", top:38, left:20, fontSize:"1rem",
            animation:"none"
          }}>→🔶</div>
        )}
        {/* Ground */}
        <div style={{position:"absolute",bottom:0,left:0,right:0,height:10,
          background:"#334155"}}/>
        {/* Angle indicator */}
        {phase==="swinging" && swingAngle > 2 && (
          <div style={{
            position:"absolute",top:12,right:10,fontSize:"0.7rem",
            color:"#6366f1",fontWeight:600
          }}>∠{swingAngle.toFixed(1)}°</div>
        )}
      </div>

      {/* Results */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:8,marginBottom:16}}>
        {[
          {label:"Bullet Momentum",value:`${(bulletMass*bulletSpeed).toFixed(2)} kg·m/s`,color:"#6366f1"},
          {label:"System velocity",value:`${systemVelocity.toFixed(2)} m/s`,color:"#10b981"},
          {label:"Swing Height",value:`${swingHeight.toFixed(3)} m`,color:"#f59e0b"},
          {label:"KE Lost (heat+sound)",value:`${(energyLost/1000).toFixed(2)} kJ`,color:"#ef4444"},
        ].map(item=>(
          <div key={item.label} style={{background:"rgba(255,255,255,0.04)",borderRadius:8,
            padding:"8px 12px",border:"1px solid rgba(255,255,255,0.06)"}}>
            <div style={{color:"#94a3b8",fontSize:"0.68rem"}}>{item.label}</div>
            <div style={{color:item.color,fontWeight:700,fontSize:"0.85rem"}}>{item.value}</div>
          </div>
        ))}
      </div>

      <div className={styles.sliderGroup}>
        <label className={styles.sliderLabel}>
          Bullet mass: <strong style={{color:"#6366f1"}}>{bulletMass*1000} g</strong>
          <input type="range" min={10} max={500} step={10}
            value={bulletMass*1000}
            onChange={e=>{setBulletMass(+e.target.value/1000);setPhase("ready");setSwingAngle(0);cancelAnimationFrame(animRef.current);}}
            className={styles.slider} style={{accentColor:"#6366f1"}} />
        </label>
        <label className={styles.sliderLabel}>
          Bullet speed: <strong style={{color:"#ef4444"}}>{bulletSpeed} m/s</strong>
          <input type="range" min={50} max={1000} value={bulletSpeed}
            onChange={e=>{setBulletSpeed(+e.target.value);setPhase("ready");setSwingAngle(0);cancelAnimationFrame(animRef.current);}}
            className={styles.slider} style={{accentColor:"#ef4444"}} />
        </label>
        <label className={styles.sliderLabel}>
          Pendulum mass: <strong style={{color:"#f59e0b"}}>{pendulumMass} kg</strong>
          <input type="range" min={0.5} max={20} step={0.5} value={pendulumMass}
            onChange={e=>{setPendulumMass(+e.target.value);setPhase("ready");setSwingAngle(0);cancelAnimationFrame(animRef.current);}}
            className={styles.slider} style={{accentColor:"#f59e0b"}} />
        </label>
      </div>

      <div className={styles.simControls}>
        <button className={styles.simBtn} onClick={fire}>
          {phase==="ready" ? "🔫 Fire Bullet" : "↺ Reset"}
        </button>
      </div>

      <div style={{
        marginTop:12, padding:"10px 14px", borderRadius:8,
        background:"rgba(99,102,241,0.08)", fontSize:"0.78rem", color:"#94a3b8",
        lineHeight:1.6
      }}>
        <strong style={{color:"#c7d2fe"}}>Momentum conserved:</strong> m₁v₁ = (m₁+m₂)v₂ &nbsp;→&nbsp;
        v₂ = <strong style={{color:"#10b981"}}>{systemVelocity.toFixed(3)} m/s</strong>.
        Then energy: v₂² = 2gh &nbsp;→&nbsp; h = <strong style={{color:"#f59e0b"}}>{swingHeight.toFixed(3)} m</strong>.
        Notice: {(energyLost/kineticBefore*100).toFixed(1)}% of kinetic energy is lost to heat and deformation — this is an <em>inelastic</em> collision!
      </div>
    </div>
  );
}
