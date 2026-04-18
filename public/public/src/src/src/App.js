import { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const T = {
  bg:"#000000", surface:"#04080f", card:"#070d1a", cardAlt:"#0a1628",
  border:"#0f2040", borderHover:"#1a3a6e", accent:"#1a6fff", navy:"#0a1628",
  navyLight:"#112240", red:"#e63946", green:"#22c55e", gold:"#f59e0b",
  text:"#e8edf5", muted:"#3d5278", mutedLight:"#7a90b8",
};

const LIBRARY = [
  { id:"squat", name:"Squat", cat:"Musculation", muscles:"Quadriceps, Fessiers, Ischio-jambiers", tip:"Pieds largeur épaules, genoux dans l'axe des orteils.", img:"https://v2.exercisedb.io/image/XF4GUgcnijyEqT" },
  { id:"deadlift", name:"Deadlift", cat:"Musculation", muscles:"Ischio-jambiers, Lombaires, Fessiers", tip:"Dos plat, barre proche du corps.", img:"https://v2.exercisedb.io/image/P0I5Cr5AiTj5Jx" },
  { id:"bench", name:"Développé couché", cat:"Musculation", muscles:"Pectoraux, Triceps, Épaules", tip:"Omoplates rétractées, coudes à 45°.", img:"https://v2.exercisedb.io/image/rFWIBhiXMU8DJd" },
  { id:"pullup", name:"Traction", cat:"Musculation", muscles:"Grand dorsal, Biceps, Rhomboïdes", tip:"Dépression scapulaire avant de tirer.", img:"https://v2.exercisedb.io/image/P8sGBFybOHlvY6" },
  { id:"lunge", name:"Fente avant", cat:"Musculation", muscles:"Quadriceps, Fessiers, Mollets", tip:"Genou avant à 90°.", img:"https://v2.exercisedb.io/image/A3ELhOLf3HQLQJ" },
  { id:"row", name:"Rowing haltère", cat:"Musculation", muscles:"Grand dorsal, Rhomboïdes, Biceps", tip:"Coude près du corps.", img:"https://v2.exercisedb.io/image/mbGHoGiDtJJGMX" },
  { id:"ohp", name:"Développé militaire", cat:"Musculation", muscles:"Épaules, Triceps, Trapèzes", tip:"Gainage abdominal, barre dans l'axe.", img:"https://v2.exercisedb.io/image/7d9FxBWlwXBXfr" },
  { id:"hip90", name:"Hip 90/90", cat:"Mobilité", muscles:"Rotateurs hanche, Fessiers", tip:"Deux jambes à 90°, bascule lente.", img:"https://v2.exercisedb.io/image/Hc-sTPPjv3gDiV" },
  { id:"pigeon", name:"Pigeon yoga", cat:"Mobilité", muscles:"Psoas, Rotateurs hanche", tip:"Hanches au sol, 60-90s par côté.", img:"https://v2.exercisedb.io/image/2JFxhCuOjz2qVc" },
  { id:"catcow", name:"Chat / Vache", cat:"Mobilité", muscles:"Rachis, Multifides", tip:"Mouvement fluide avec la respiration.", img:"https://v2.exercisedb.io/image/bkqnpRFVGWRLAf" },
  { id:"worldsgreatest", name:"World's Greatest", cat:"Mobilité", muscles:"Full body, Hanche, Thoracique", tip:"Rotation thoracique complète.", img:"https://v2.exercisedb.io/image/xnzGNaSSHmaCOp" },
  { id:"run", name:"Course / Jogging", cat:"Cardio", muscles:"Full body, Cardio", tip:"Foulée médio-pied, 170-180 pas/min.", img:"https://v2.exercisedb.io/image/mGl3BLQfGjtHNO" },
  { id:"burpee", name:"Burpee", cat:"Cardio", muscles:"Full body, Explosivité", tip:"Planche stricte en bas, saut explosif.", img:"https://v2.exercisedb.io/image/NN2zXpVCnEpVTK" },
  { id:"jumpingjack", name:"Jumping Jack", cat:"Cardio", muscles:"Cardio, Coordination", tip:"Rythme constant, atterrissage amorti.", img:"https://v2.exercisedb.io/image/3V3FD3B0qgBXb5" },
  { id:"mountainclimber", name:"Mountain Climber", cat:"Cardio", muscles:"Abdominaux, Cardio, Épaules", tip:"Hanches basses, genoux qui remontent vite.", img:"https://v2.exercisedb.io/image/MEKnG4mJSDBY7q" },
];

const CAT_COLOR = { Musculation: "#1a6fff", Mobilité: "#22c55e", Cardio: "#f59e0b" };

const SAMPLE_CLIENTS = [{
  id:"tony", name:"Tony Parker", age:41, sport:"Basketball", since:"2024-01", status:"actif",
  objective:"Maintien forme & mobilité", progress:78,
  sessions:[
    { id:"s1", date:"2026-04-15", present:true, duration:90, note:"Mobilité hanches + renforcement excentrique" },
    { id:"s2", date:"2026-04-10", present:true, duration:75, note:"Cardio HIIT — excellente séance" },
    { id:"s3", date:"2026-04-03", present:false, duration:0, note:"Absent — voyage" },
  ],
  metrics:[
    { date:"2026-04-01", weight:92.0, chest:104, waist:86, hips:98, fatPct:14.2 },
    { date:"2026-03-01", weight:93.5, chest:105, waist:87, hips:99, fatPct:14.8 },
  ],
  programs:[{ id:"p1", name:"Mobilité & Renforcement", weeks:8, startDate:"2026-03-01",
    exercises:[
      { id:"e1", name:"Hip 90/90", sets:"3", reps:"45s", load:"", note:"Chaque côté", libId:"hip90" },
      { id:"e2", name:"Deadlift", sets:"4", reps:"8", load:"60kg", note:"", libId:"deadlift" },
    ]
  }],
  goals:[
    { id:"g1", label:"Descendre à 90 kg", done:false, deadline:"2026-06-01" },
    { id:"g2", label:"Masse grasse < 13%", done:false, deadline:"2026-07-01" },
    { id:"g3", label:"30 min course sans douleur genou", done:true, deadline:"2026-03-01" },
  ]
}];
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #000; color: #e8edf5; font-family: 'Barlow', sans-serif; }
  ::-webkit-scrollbar { width: 4px; background: #000; }
  ::-webkit-scrollbar-thumb { background: #0f2040; border-radius: 4px; }
  input { color-scheme: dark; }
  input::placeholder { color: #3d5278; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .fu { animation: fadeUp .28s ease both; }
  .ch { transition: border-color .2s, transform .18s, box-shadow .2s; }
  .ch:hover { border-color: #1a3a6e !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.5); }
  button:active { transform: scale(.97); }
`;

const Avatar = ({ name, size=44 }) => {
  const initials = name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const hue = name.split("").reduce((a,c)=>a+c.charCodeAt(0),0) % 60 + 200;
  return <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,hsl(${hue},70%,14%),hsl(${hue},70%,26%))`, border:`2px solid hsl(${hue},65%,34%)`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:900, fontSize:size*.36, color:`hsl(${hue},80%,72%)`, flexShrink:0 }}>{initials}</div>;
};

const Badge = ({ label, color }) => <span style={{ padding:"2px 9px", borderRadius:20, background:color+"18", color, border:`1px solid ${color}35`, fontSize:10, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:"0.08em", textTransform:"uppercase", flexShrink:0 }}>{label}</span>;

const Bar = ({ value, color, h=5 }) => <div style={{ background:"#0f2040", borderRadius:99, height:h, overflow:"hidden" }}><div style={{ height:"100%", borderRadius:99, background:color||"#1a6fff", width:`${Math.min(100,Math.max(0,value))}%`, transition:"width .7s", boxShadow:`0 0 8px ${color||"#1a6fff"}55` }}/></div>;

const Field = ({ label, value, onChange, type="text", placeholder, half }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:4, flex:half?"0 0 calc(50% - 5px)":"1 1 100%" }}>
    {label && <label style={{ fontSize:9, fontWeight:700, color:"#3d5278", letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:"'Barlow',sans-serif" }}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ background:"#000", border:"1.5px solid #0f2040", borderRadius:8, padding:"9px 12px", color:"#e8edf5", fontSize:14, fontFamily:"'Barlow',sans-serif", outline:"none", width:"100%" }}
      onFocus={e=>e.target.style.borderColor="#1a6fff"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
  </div>
);

const Btn = ({ children, onClick, ghost, small, danger }) => (
  <button onClick={onClick} style={{ padding:small?"6px 14px":"10px 22px", borderRadius:8, cursor:"pointer", border:ghost?"1.5px solid #0f2040":danger?"1.5px solid #e6394644":"none", background:ghost?"transparent":danger?"#e6394618":"#1a6fff", color:ghost?"#7a90b8":danger?"#e63946":"#fff", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:small?11:14, letterSpacing:"0.06em", textTransform:"uppercase", transition:"all .15s" }}>
    {children}
  </button>
);

const SecTitle = ({ c }) => <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}><div style={{ width:3, height:16, borderRadius:99, background:"#1a6fff" }}/><span style={{ fontSize:11, fontWeight:700, color:"#1a6fff", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'Barlow Condensed',sans-serif" }}>{c}</span></div>;

const StatusDot = ({ status }) => {
  const color = status==="live" ? "#22c55e" : status==="connecting" ? "#f59e0b" : "#3d5278";
  const label = status==="live" ? "Sync temps réel active" : status==="connecting" ? "Connexion Firebase..." : "Mode local";
  return <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 14px", background:"#04080f", borderBottom:"1px solid #0f2040" }}><div style={{ width:6, height:6, borderRadius:"50%", background:color, boxShadow:status==="live"?`0 0 6px ${color}`:"none" }}/><span style={{ fontSize:10, color:"#3d5278", fontFamily:"'Barlow',sans-serif" }}>{label}</span></div>;
};

const ExImg = ({ libId, size=140 }) => {
  const ex = LIBRARY.find(l=>l.id===libId);
  const [err, setErr] = useState(false);
  if (!ex) return null;
  if (err) return <div style={{ width:"100%", height:size*.6, background:"#0a1628", borderRadius:10, display:"flex", alignItems:"center", justifyContent:"center", color:"#3d5278", fontSize:12 }}>{ex.name}</div>;
  return <img src={ex.img} alt={ex.name} style={{ width:"100%", height:size*.65, objectFit:"cover", borderRadius:10, background:"#0a1628" }} onError={()=>setErr(true)}/>;
};

export default function App() {
  const [clients, setClients] = useState(SAMPLE_CLIENTS);
  const [fbStatus, setFbStatus] = useState("connecting");
  const [view, setView] = useState("dash");
  const [selId, setSelId] = useState(null);
  const [tab, setTab] = useState("sessions");
  const [libCat, setLibCat] = useState("Tous");
  const [libSel, setLibSel] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newC, setNewC] = useState({ name:"", age:"", sport:"", objective:"" });
  const [newS, setNewS] = useState({ date:"", present:true, duration:"", note:"" });
  const [newM, setNewM] = useState({ date:"", weight:"", chest:"", waist:"", hips:"", fatPct:"" });
  const [newG, setNewG] = useState({ label:"", deadline:"" });
  const [newP, setNewP] = useState({ name:"", weeks:"8", startDate:"" });
  const [newEx, setNewEx] = useState({ name:"", sets:"", reps:"", load:"", note:"", libId:"" });
  const [addingExTo, setAddingExTo] = useState(null);
  const [pickingEx, setPickingEx] = useState(false);

  const cl = clients.find(c=>c.id===selId);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "coach", "data"), snap => {
      if (snap.exists()) { setClients(snap.data().clients || []); }
      else { saveToFirebase(SAMPLE_CLIENTS); }
      setFbStatus("live");
    }, () => setFbStatus("local"));
    return unsub;
  }, []);

  const saveToFirebase = useCallback(async (data) => {
    try { await setDoc(doc(db, "coach", "data"), { clients: data, updatedAt: Date.now() }); }
    catch(e) { console.error(e); }
  }, []);

  const sync = useCallback((updated) => {
    setClients(updated);
    saveToFirebase(updated);
  }, [saveToFirebase]);

  const up = (id, patch) => sync(clients.map(c=>c.id===id?{...c,...patch}:c));
  const openClient = (id) => { setSelId(id); setView("client"); setTab("sessions"); };

  function doAddClient() {
    if (!newC.name.trim()) return;
    sync([...clients, { id:"c"+Date.now(), ...newC, age:+newC.age, since:new Date().toISOString().slice(0,7), status:"actif", progress:0, sessions:[], metrics:[], programs:[], goals:[] }]);
    setNewC({ name:"", age:"", sport:"", objective:"" }); setAddOpen(false);
  }
  function doAddSession() {
    if (!newS.date||!cl) return;
    up(selId, { sessions:[{ id:"s"+Date.now(), ...newS, present:newS.present===true, duration:+newS.duration }, ...cl.sessions] });
    setNewS({ date:"", present:true, duration:"", note:"" });
  }
  function doAddMetric() {
    if (!newM.date||!newM.weight||!cl) return;
    up(selId, { metrics:[{ ...newM, weight:+newM.weight, chest:+newM.chest, waist:+newM.waist, hips:+newM.hips, fatPct:+newM.fatPct }, ...cl.metrics] });
    setNewM({ date:"", weight:"", chest:"", waist:"", hips:"", fatPct:"" });
  }
  function doAddGoal() {
    if (!newG.label.trim()||!cl) return;
    up(selId, { goals:[...cl.goals, { id:"g"+Date.now(), ...newG, done:false }] });
    setNewG({ label:"", deadline:"" });
  }
  function doAddProgram() {
    if (!newP.name.trim()||!cl) return;
    up(selId, { programs:[...cl.programs, { id:"p"+Date.now(), ...newP, weeks:+newP.weeks, exercises:[] }] });
    setNewP({ name:"", weeks:"8", startDate:"" });
  }
  function doAddExercise(pid) {
    if (!newEx.name.trim()||!cl) return;
    up(selId, { programs:cl.programs.map(p=>p.id===pid?{...p,exercises:[...p.exercises,{id:"e"+Date.now(),...newEx}]}:p) });
    setNewEx({ name:"", sets:"", reps:"", load:"", note:"", libId:"" }); setAddingExTo(null); setPickingEx(false);
  }

  const wrap = (children) => (
    <div style={{ minHeight:"100vh", background:"#000", color:"#e8edf5", fontFamily:"'Barlow',sans-serif", paddingBottom:48 }}>
      <style>{GLOBAL_CSS}</style>
      <StatusDot status={fbStatus}/>
      {children}
    </div>
  );

  if (view==="library") {
    const cats = ["Tous","Musculation","Mobilité","Cardio"];
    const filtered = libCat==="Tous" ? LIBRARY : LIBRARY.filter(e=>e.cat===libCat);
    return wrap(
      <div style={{ padding:"16px" }}>
        <button onClick={()=>setView("dash")} style={{ background:"none", border:"none", color:"#7a90b8", cursor:"pointer", fontSize:12, marginBottom:14, fontFamily:"'Barlow',sans-serif", padding:0 }}>← Retour</button>
        <div style={{ fontSize:32, fontWeight:900, fontFamily:"'Barlow Condensed',sans-serif", marginBottom:16 }}>BIBLIOTHÈQUE</div>
        <div style={{ display:"flex", gap:6, marginBottom:16, overflowX:"auto", paddingBottom:4 }}>
          {cats.map(cat=>(
            <button key={cat} onClick={()=>setLibCat(cat)} style={{ padding:"6px 15px", borderRadius:99, border:`1px solid ${libCat===cat?"#1a6fff":"#0f2040"}`, background:libCat===cat?"#1a6fff":"transparent", color:libCat===cat?"#fff":"#7a90b8", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:13, textTransform:"uppercase", cursor:"pointer", flexShrink:0 }}>
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
          {filtered.map(ex=>(
            <div key={ex.id} className="ch fu" onClick={()=>setLibSel(libSel===ex.id?null:ex.id)}
              style={{ background:"#070d1a", border:`1px solid ${libSel===ex.id?(CAT_COLOR[ex.cat]||"#1a6fff")+"66":"#0f2040"}`, borderRadius:16, overflow:"hidden", cursor:"pointer" }}>
              <ExImg libId={ex.id} size={160}/>
              <div style={{ padding:"10px 12px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:5 }}>
                  <div style={{ fontWeight:800, fontSize:13, fontFamily:"'Barlow Condensed',sans-serif" }}>{ex.name}</div>
                  <Badge label={ex.cat} color={CAT_COLOR[ex.cat]||"#1a6fff"}/>
                </div>
                <div style={{ fontSize:11, color:"#7a90b8" }}>💪 {ex.muscles}</div>
                {libSel===ex.id && <div style={{ marginTop:8, padding:"8px 10px", background:"#000", borderRadius:8, border:"1px solid #0f2040" }}><div style={{ fontSize:11, color:"#e8edf5" }}>💡 {ex.tip}</div></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (view==="dash") {
    const total=clients.reduce((a,c)=>a+c.sessions.filter(s=>s.present).length,0);
    const actif=clients.filter(c=>c.status==="actif").length;
    const att=clients.length?Math.round(clients.reduce((a,c)=>{ if(!c.sessions.length)return a; return a+c.sessions.filter(s=>s.present).length/c.sessions.length; },0)/clients.length*100):0;
    return wrap(<>
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:7, marginBottom:4 }}>
          <div style={{ width:6, height:6, borderRadius:"50%", background:"#1a6fff", boxShadow:"0 0 8px #1a6fff" }}/>
          <span style={{ fontSize:10, color:"#1a6fff", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase" }}>Logan Lagarde · Coaching Individuel</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end", marginBottom:16 }}>
          <div style={{ fontSize:34, fontWeight:900, fontFamily:"'Barlow Condensed',sans-serif", letterSpacing:-0.5, lineHeight:1 }}>MES CLIENTS</div>
          <div style={{ display:"flex", gap:8 }}>
            <Btn ghost small onClick={()=>setView("library")}>📚 Biblio</Btn>
            <Btn small onClick={()=>setAddOpen(true)}>+ Client</Btn>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, marginBottom:16 }}>
          {[{l:"Actifs",v:actif,c:"#1a6fff",i:"⚡"},{l:"Séances",v:total,c:"#e8edf5",i:"📋"},{l:"Assiduité",v:att+"%",c:"#22c55e",i:"🎯"}].map(s=>(
            <div key={s.l} style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:12, padding:"12px 14px", flex:1 }}>
              <div style={{ fontSize:9, color:"#3d5278", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:6 }}>{s.i} {s.l}</div>
              <div style={{ fontSize:22, fontWeight:900, color:s.c, fontFamily:"'Barlow Condensed',sans-serif", lineHeight:1 }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ height:1, background:"linear-gradient(90deg,#1a6fff44,transparent)", marginBottom:14 }}/>
      </div>
      <div style={{ padding:"0 16px" }}>
        {clients.map((c,i)=>{
          const a2=c.sessions.length?Math.round(c.sessions.filter(s=>s.present).length/c.sessions.length*100):0;
          const lw=c.metrics[0];
          return (
            <div key={c.id} className="ch fu" onClick={()=>openClient(c.id)}
              style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:14, padding:15, marginBottom:10, cursor:"pointer", animationDelay:`${i*.05}s` }}>
              <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:10 }}>
                <Avatar name={c.name}/>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:900, fontSize:16, fontFamily:"'Barlow Condensed',sans-serif", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.name.toUpperCase()}</div>
                  <div style={{ color:"#7a90b8", fontSize:12, marginTop:1, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{c.sport} · {c.objective}</div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:4, flexShrink:0 }}>
                  <Badge label={c.status} color={c.status==="actif"?"#22c55e":"#3d5278"}/>
                  {lw&&<span style={{ fontSize:13, fontWeight:800, color:"#1a6fff", fontFamily:"'Barlow Condensed',sans-serif" }}>{lw.weight}kg</span>}
                </div>
              </div>
              <div style={{ display:"flex", gap:14, fontSize:11, color:"#3d5278", marginBottom:8 }}>
                <span>📅 <b style={{ color:"#7a90b8" }}>{c.sessions.length}</b></span>
                <span>✅ <b style={{ color:a2>=80?"#22c55e":"#f59e0b" }}>{a2}%</b></span>
                <span>🎯 <b style={{ color:"#7a90b8" }}>{c.goals.filter(g=>g.done).length}/{c.goals.length}</b></span>
              </div>
              <Bar value={c.progress} color="#1a6fff"/>
            </div>
          );
        })}
        {!clients.length&&<div style={{ textAlign:"center", color:"#3d5278", padding:60 }}>Aucun client — ajoutes-en un !</div>}
      </div>
      {addOpen&&(
        <div style={{ position:"fixed", inset:0, background:"#000c", display:"flex", alignItems:"flex-end", zIndex:99 }} onClick={()=>setAddOpen(false)}>
          <div onClick={e=>e.stopPropagation()} className="fu" style={{ background:"#0a1628", border:"1px solid #0f2040", borderRadius:"20px 20px 0 0", padding:"24px 18px 40px", width:"100%", maxHeight:"88vh", overflowY:"auto" }}>
            <div style={{ width:36, height:4, borderRadius:99, background:"#0f2040", margin:"0 auto 18px" }}/>
            <div style={{ fontSize:22, fontWeight:900, fontFamily:"'Barlow Condensed',sans-serif", marginBottom:16 }}>NOUVEAU CLIENT</div>
            <div style={{ display:"flex", flexDirection:"column", gap:11 }}>
              <Field label="Nom complet" value={newC.name} onChange={v=>setNewC(p=>({...p,name:v}))} placeholder="ex. Thomas Dupont"/>
              <div style={{ display:"flex", gap:10 }}>
                <Field label="Âge" type="number" value={newC.age} onChange={v=>setNewC(p=>({...p,age:v}))} placeholder="30" half/>
                <Field label="Sport" value={newC.sport} onChange={v=>setNewC(p=>({...p,sport:v}))} placeholder="Basketball..." half/>
              </div>
              <Field label="Objectif" value={newC.objective} onChange={v=>setNewC(p=>({...p,objective:v}))} placeholder="Perte de poids, Performance..."/>
            </div>
            <div style={{ display:"flex", gap:10, marginTop:16 }}>
              <Btn onClick={doAddClient}>Ajouter</Btn>
              <Btn ghost onClick={()=>setAddOpen(false)}>Annuler</Btn>
            </div>
          </div>
        </div>
      )}
    </>);
  }

  if (view==="client"&&cl) {
    const att=cl.sessions.length?Math.round(cl.sessions.filter(s=>s.present).length/cl.sessions.length*100):0;
    const lw=cl.metrics[0],pw=cl.metrics[1];
    const wd=lw&&pw?+(lw.weight-pw.weight).toFixed(1):null;
    const done=cl.goals.filter(g=>g.done).length;
    const gPct=cl.goals.length?Math.round(done/cl.goals.length*100):0;
    const TABS=[{id:"sessions",label:"Séances"},{id:"metrics",label:"Métriques"},{id:"programs",label:"Programme"},{id:"goals",label:"Objectifs"}];
    return wrap(<>
      <div style={{ background:"linear-gradient(170deg,#112240 0%,#000 100%)", padding:"16px 16px 14px", borderBottom:"1px solid #0f2040" }}>
        <button onClick={()=>setView("dash")} style={{ background:"none", border:"none", color:"#3d5278", cursor:"pointer", fontSize:12, marginBottom:12, fontFamily:"'Barlow',sans-serif", padding:0 }}>← Tableau de bord</button>
        <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:14 }}>
          <Avatar name={cl.name} size={54}/>
          <div>
            <div style={{ fontSize:24, fontWeight:900, fontFamily:"'Barlow Condensed',sans-serif", lineHeight:1 }}>{cl.name.toUpperCase()}</div>
            <div style={{ color:"#7a90b8", fontSize:12, marginTop:3 }}>{cl.sport} · {cl.age} ans · depuis {cl.since}</div>
            <div style={{ marginTop:5 }}><Badge label={cl.status} color="#22c55e"/></div>
          </div>
        </div>
        <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:2 }}>
          {[
            {l:"Présences",v:cl.sessions.filter(s=>s.present).length,c:"#e8edf5"},
            {l:"Assiduité",v:`${att}%`,c:att>=80?"#22c55e":"#f59e0b"},
            {l:"Poids",v:lw?`${lw.weight}kg`:"—",c:"#1a6fff"},
            {l:"Δ",v:wd!==null?`${wd>0?"+":""}${wd}kg`:"—",c:wd!==null?(wd<=0?"#22c55e":"#e63946"):"#3d5278"},
            {l:"Objectifs",v:`${done}/${cl.goals.length}`,c:"#1a6fff"},
          ].map(s=>(
            <div key={s.l} style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:10, padding:"8px 12px", flexShrink:0 }}>
              <div style={{ fontSize:8, color:"#3d5278", fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", marginBottom:3 }}>{s.l}</div>
              <div style={{ fontSize:16, fontWeight:900, color:s.c, fontFamily:"'Barlow Condensed',sans-serif", lineHeight:1 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"10px 14px", background:"#04080f", borderBottom:"1px solid #0f2040" }}>
        <div style={{ display:"flex", gap:2, background:"#070d1a", borderRadius:10, padding:3, border:"1px solid #0f2040" }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1, padding:"8px 4px", borderRadius:8, border:"none", cursor:"pointer", background:tab===t.id?"#112240":"transparent", color:tab===t.id?"#e8edf5":"#3d5278", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, textTransform:"uppercase", transition:"all .2s", borderBottom:tab===t.id?"2px solid #1a6fff":"2px solid transparent" }}>{t.label}</button>
          ))}
        </div>
      </div>
      <div style={{ padding:"14px" }}>
        {tab==="sessions"&&<div className="fu">
          <div style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:14, padding:14, marginBottom:14 }}>
            <SecTitle c="Nouvelle séance"/>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              <Field label="Date" type="date" value={newS.date} onChange={v=>setNewS(p=>({...p,date:v}))} half/>
              <Field label="Durée min" type="number" value={newS.duration} onChange={v=>setNewS(p=>({...p,duration:v}))} placeholder="60" half/>
              <div style={{ flex:"1 1 100%", display:"flex", alignItems:"center", gap:8 }}>
                <input type="checkbox" checked={newS.present} onChange={e=>setNewS(p=>({...p,present:e.target.checked}))} style={{ accentColor:"#22c55e", width:16, height:16 }}/>
                <span style={{ fontSize:13, color:"#7a90b8", fontWeight:600 }}>Client présent(e)</span>
              </div>
              <Field label="Notes" value={newS.note} onChange={v=>setNewS(p=>({...p,note:v}))} placeholder="Observations..."/>
            </div>
            <div style={{ marginTop:12 }}><Btn onClick={doAddSession}>Enregistrer</Btn></div>
          </div>
          {cl.sessions.map((s,i)=>(
            <div key={s.id} className="ch fu" style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:12, padding:"12px 14px", marginBottom:8, display:"flex", gap:12, animationDelay:`${i*.04}s` }}>
              <div style={{ width:8, height:8, borderRadius:"50%", background:s.present?"#22c55e":"#e63946", marginTop:5, flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontWeight:800, fontFamily:"'Barlow Condensed',sans-serif", fontSize:15 }}>{s.date}</span>
                  <div style={{ display:"flex", gap:6 }}>
                    {s.duration>0&&<span style={{ fontSize:11, color:"#3d5278" }}>{s.duration}min</span>}
                    <Badge label={s.present?"Présent":"Absent"} color={s.present?"#22c55e":"#e63946"}/>
                  </div>
                </div>
                {s.note&&<div style={{ color:"#7a90b8", fontSize:12, marginTop:3 }}>{s.note}</div>}
              </div>
            </div>
          ))}
          {!cl.sessions.length&&<div style={{ textAlign:"center", color:"#3d5278", padding:40 }}>Aucune séance enregistrée</div>}
        </div>}
        {tab==="metrics"&&<div className="fu">
          <div style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:14, padding:14, marginBottom:14 }}>
            <SecTitle c="Nouvelle mesure"/>
            <div style={{ display:"flex", flexWrap:"wrap", gap:10 }}>
              <Field label="Date" type="date" value={newM.date} onChange={v=>setNewM(p=>({...p,date:v}))} half/>
              <Field label="Poids (kg)" type="number" value={newM.weight} onChange={v=>setNewM(p=>({...p,weight:v}))} placeholder="88.5" half/>
              <Field label="Poitrine cm" type="number" value={newM.chest} onChange={v=>setNewM(p=>({...p,chest:v}))} placeholder="104" half/>
              <Field label="Taille cm" type="number" value={newM.waist} onChange={v=>setNewM(p=>({...p,waist:v}))} placeholder="86" half/>
              <Field label="Hanches cm" type="number" value={newM.hips} onChange={v=>setNewM(p=>({...p,hips:v}))} placeholder="98" half/>
              <Field label="Masse grasse %" type="number" value={newM.fatPct} onChange={v=>setNewM(p=>({...p,fatPct:v}))} placeholder="14.2" half/>
            </div>
            <div style={{ marginTop:12 }}><Btn onClick={doAddMetric}>Enregistrer</Btn></div>
          </div>
          {cl.metrics.map((m,i)=>{
            const prev=cl.metrics[i+1]; const d=prev?+(m.weight-prev.weight).toFixed(1):null;
            return <div key={m.date+i} className="ch fu" style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:14, padding:14, marginBottom:10, animationDelay:`${i*.04}s` }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:10 }}>
                <span style={{ fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", fontSize:14, color:"#7a90b8" }}>{m.date}</span>
                <div style={{ textAlign:"right" }}>
                  <div style={{ fontSize:24, fontWeight:900, color:"#1a6fff", fontFamily:"'Barlow Condensed',sans-serif", lineHeight:1 }}>{m.weight} kg</div>
                  {d!==null&&<div style={{ fontSize:11, color:d<=0?"#22c55e":"#e63946" }}>{d>0?"+":""}{d} kg</div>}
                </div>
              </div>
              <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
                {m.chest>0&&<span style={{ fontSize:12, color:"#3d5278" }}>Poitrine <b style={{ color:"#e8edf5" }}>{m.chest}cm</b></span>}
                {m.waist>0&&<span style={{ fontSize:12, color:"#3d5278" }}>Taille <b style={{ color:"#e8edf5" }}>{m.waist}cm</b></span>}
                {m.hips>0&&<span style={{ fontSize:12, color:"#3d5278" }}>Hanches <b style={{ color:"#e8edf5" }}>{m.hips}cm</b></span>}
                {m.fatPct>0&&<span style={{ fontSize:12, color:"#3d5278" }}>MG <b style={{ color:"#e8edf5" }}>{m.fatPct}%</b></span>}
              </div>
            </div>;
          })}
          {!cl.metrics.length&&<div style={{ textAlign:"center", color:"#3d5278", padding:40 }}>Aucune mesure enregistrée</div>}
        </div>}
        {tab==="programs"&&<div className="fu">
          <div style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:14, padding:14, marginBottom:14 }}>
            <SecTitle c="Nouveau programme"/>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <Field label="Nom" value={newP.name} onChange={v=>setNewP(p=>({...p,name:v}))} placeholder="ex. Force & Mobilité"/>
              <div style={{ display:"flex", gap:10 }}>
                <Field label="Semaines" type="number" value={newP.weeks} onChange={v=>setNewP(p=>({...p,weeks:v}))} placeholder="8" half/>
                <Field label="Date début" type="date" value={newP.startDate} onChange={v=>setNewP(p=>({...p,startDate:v}))} half/>
              </div>
            </div>
            <div style={{ marginTop:12 }}><Btn onClick={doAddProgram}>Créer</Btn></div>
          </div>
          {cl.programs.map((prog,i)=>(
            <div key={prog.id} className="fu" style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:14, marginBottom:14, overflow:"hidden", animationDelay:`${i*.05}s` }}>
              <div style={{ background:"#112240", padding:"12px 14px", display:"flex", justifyContent:"space-between", alignItems:"center", borderBottom:"1px solid #0f2040" }}>
                <div>
                  <div style={{ fontWeight:900, fontFamily:"'Barlow Condensed',sans-serif", fontSize:15 }}>{prog.name.toUpperCase()}</div>
                  <div style={{ fontSize:10, color:"#3d5278" }}>{prog.weeks} sem · {prog.startDate}</div>
                </div>
                <Btn small onClick={()=>{ setAddingExTo(addingExTo===prog.id?null:prog.id); setPickingEx(false); }}>+ Exercice</Btn>
              </div>
              {addingExTo===prog.id&&(
                <div style={{ padding:14, background:"#000", borderBottom:"1px solid #0f2040" }}>
                  <button onClick={()=>setPickingEx(!pickingEx)} style={{ background:"#112240", border:"1px solid #1a6fff44", borderRadius:8, padding:"7px 14px", color:"#1a6fff", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:12, textTransform:"uppercase", cursor:"pointer", marginBottom:12 }}>
                    📚 {pickingEx?"Fermer":"Choisir dans la bibliothèque"}
                  </button>
                  {pickingEx&&(
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:6, marginBottom:12 }}>
                      {LIBRARY.map(ex=>(
                        <div key={ex.id} onClick={()=>{ setNewEx(p=>({...p,name:ex.name,libId:ex.id})); setPickingEx(false); }}
                          style={{ background:"#070d1a", border:`1px solid ${newEx.libId===ex.id?"#1a6fff":"#0f2040"}`, borderRadius:10, overflow:"hidden", cursor:"pointer" }}>
                          <ExImg libId={ex.id} size={80}/>
                          <div style={{ padding:"4px 6px", fontSize:9, fontWeight:700, fontFamily:"'Barlow Condensed',sans-serif", color:"#7a90b8" }}>{ex.name}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    <Field label="Exercice" value={newEx.name} onChange={v=>setNewEx(p=>({...p,name:v}))} placeholder="ex. Squat"/>
                    <Field label="Séries" value={newEx.sets} onChange={v=>setNewEx(p=>({...p,sets:v}))} placeholder="4" half/>
                    <Field label="Reps" value={newEx.reps} onChange={v=>setNewEx(p=>({...p,reps:v}))} placeholder="8" half/>
                    <Field label="Charge" value={newEx.load} onChange={v=>setNewEx(p=>({...p,load:v}))} placeholder="70kg" half/>
                    <Field label="Note" value={newEx.note} onChange={v=>setNewEx(p=>({...p,note:v}))} placeholder="Indication..." half/>
                  </div>
                  <div style={{ display:"flex", gap:8, marginTop:10 }}>
                    <Btn small onClick={()=>doAddExercise(prog.id)}>Ajouter</Btn>
                    <Btn small ghost onClick={()=>{ setAddingExTo(null); setPickingEx(false); }}>Annuler</Btn>
                  </div>
                </div>
              )}
              {prog.exercises.map((ex,j)=>{
                const lib=LIBRARY.find(l=>l.id===ex.libId);
                return <div key={j} style={{ display:"flex", alignItems:"center", padding:"11px 14px", gap:10, borderBottom:j<prog.exercises.length-1?"1px solid #0f2040":"none" }}>
                  {lib?<div style={{ width:44, height:32, borderRadius:6, overflow:"hidden", flexShrink:0 }}><ExImg libId={lib.id} size={60}/></div>
                  :<div style={{ width:24, height:24, borderRadius:6, background:"#1a6fff1a", border:"1px solid #1a6fff44", display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, color:"#1a6fff", flexShrink:0 }}>{j+1}</div>}
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700, fontSize:14 }}>{ex.name}</div>
                    {ex.note&&<div style={{ fontSize:11, color:"#3d5278" }}>{ex.note}</div>}
                  </div>
                  <div style={{ display:"flex", gap:5 }}>
                    {ex.sets&&<Badge label={`${ex.sets}×${ex.reps}`} color="#1a6fff"/>}
                    {ex.load&&<Badge label={ex.load} color="#f59e0b"/>}
                  </div>
                </div>;
              })}
              {!prog.exercises.length&&<div style={{ padding:"14px", color:"#3d5278", fontSize:12 }}>Aucun exercice — ajoutes-en un !</div>}
            </div>
          ))}
          {!cl.programs.length&&<div style={{ textAlign:"center", color:"#3d5278", padding:40 }}>Aucun programme créé</div>}
        </div>}
        {tab==="goals"&&<div className="fu">
          <div style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:14, padding:14, marginBottom:14 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
              <span style={{ fontSize:12, fontWeight:700, color:"#7a90b8" }}>Progression globale</span>
              <span style={{ fontSize:22, fontWeight:900, color:gPct===100?"#22c55e":"#1a6fff", fontFamily:"'Barlow Condensed',sans-serif" }}>{gPct}%</span>
            </div>
            <Bar value={gPct} color={gPct===100?"#22c55e":"#1a6fff"} h={8}/>
            <div style={{ marginTop:8, fontSize:11, color:"#3d5278" }}>{done}/{cl.goals.length} objectif{done>1?"s":""} atteint{done>1?"s":""}</div>
          </div>
          <div style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:14, padding:14, marginBottom:14 }}>
            <SecTitle c="Nouvel objectif"/>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              <Field label="Objectif" value={newG.label} onChange={v=>setNewG(p=>({...p,label:v}))} placeholder="ex. Descendre à 85 kg"/>
              <Field label="Échéance" type="date" value={newG.deadline} onChange={v=>setNewG(p=>({...p,deadline:v}))}/>
            </div>
            <div style={{ marginTop:12 }}><Btn onClick={doAddGoal}>Ajouter</Btn></div>
          </div>
          {cl.goals.map((g,i)=>(
            <div key={g.id} className="ch fu" onClick={()=>up(selId,{goals:cl.goals.map(x=>x.id===g.id?{...x,done:!x.done}:x)})}
              style={{ background:g.done?"#22c55e0e":"#070d1a", border:`1px solid ${g.done?"#22c55e44":"#0f2040"}`, borderRadius:12, padding:"13px 14px", marginBottom:8, cursor:"pointer", display:"flex", alignItems:"center", gap:12, animationDelay:`${i*.04}s` }}>
              <div style={{ width:22, height:22, borderRadius:6, flexShrink:0, background:g.done?"#22c55e":"transparent", border:`2px solid ${g.done?"#22c55e":"#0f2040"}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:12, color:"#000", fontWeight:900 }}>{g.done?"✓":""}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700, fontSize:14, textDecoration:g.done?"line-through":"none", color:g.done?"#7a90b8":"#e8edf5" }}>{g.label}</div>
                {g.deadline&&<div style={{ fontSize:11, color:"#3d5278", marginTop:2 }}>Échéance : {g.deadline}</div>}
              </div>
              <Badge label={g.done?"Atteint ✓":"En cours"} color={g.done?"#22c55e":"#f59e0b"}/>
            </div>
          ))}
          {!cl.goals.length&&<div style={{ textAlign:"center", color:"#3d5278", padding:40 }}>Aucun objectif défini</div>}
        </div>}
      </div>
    </>);
  }
  return null;
}
