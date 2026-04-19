import { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const MuscleRed = "#e63946";
const MuscleOrange = "#f59e0b";
const BodyColor = "#2a3a5a";
const BodyStroke = "#3d5278";

const AnatomySVG = ({ id }) => {
  const s = { width:"100%", height:"100%" };
  const body = { fill:BodyColor, stroke:BodyStroke, strokeWidth:1.5 };
  const muscle = { fill:MuscleRed, stroke:"#ff6b7a", strokeWidth:1 };
  const muscleO = { fill:MuscleOrange, stroke:"#fbbf24", strokeWidth:1 };
  const illustrations = {
    squat:(<svg style={s} viewBox="0 0 200 120" fill="none"><text x="50" y="9" textAnchor="middle" fill="#1a6fff" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">DÉPART</text><text x="150" y="9" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">FIN</text><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><circle cx="50" cy="16" r="7" {...body}/><rect x="46" y="23" width="8" height="18" rx="3" {...body}/><rect x="43" y="28" width="6" height="14" rx="2" {...body}/><rect x="51" y="28" width="6" height="14" rx="2" {...body}/><rect x="45" y="41" width="5" height="20" rx="2" {...body}/><rect x="50" y="41" width="5" height="20" rx="2" {...body}/><rect x="44" y="61" width="5" height="14" rx="2" {...body}/><rect x="51" y="61" width="5" height="14" rx="2" {...body}/><circle cx="150" cy="22" r="7" {...body}/><rect x="146" y="29" width="8" height="14" rx="3" {...body}/><rect x="140" y="33" width="7" height="12" rx="2" {...body}/><rect x="153" y="33" width="7" height="12" rx="2" {...body}/><rect x="141" y="45" width="7" height="22" rx="3" {...muscle}/><rect x="152" y="45" width="7" height="22" rx="3" {...muscle}/><rect x="144" y="42" width="12" height="8" rx="3" {...muscleO}/><rect x="141" y="67" width="6" height="16" rx="2" {...body}/><rect x="153" y="67" width="6" height="16" rx="2" {...body}/><text x="150" y="115" textAnchor="middle" fill={MuscleRed} fontSize="6" fontFamily="Barlow">Quadriceps • Fessiers</text></svg>),
    deadlift:(<svg style={s} viewBox="0 0 200 120" fill="none"><text x="50" y="9" textAnchor="middle" fill="#1a6fff" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">DÉPART</text><text x="150" y="9" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">FIN</text><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><circle cx="55" cy="28" r="7" {...body}/><rect x="51" y="35" width="8" height="14" rx="3" {...muscle}/><rect x="44" y="38" width="6" height="12" rx="2" {...body}/><rect x="61" y="38" width="6" height="12" rx="2" {...body}/><rect x="46" y="49" width="6" height="18" rx="2" {...body}/><rect x="53" y="49" width="6" height="18" rx="2" {...body}/><rect x="45" y="67" width="5" height="14" rx="2" {...body}/><rect x="52" y="67" width="5" height="14" rx="2" {...body}/><rect x="16" y="79" width="60" height="4" rx="2" fill="#1a6fff" opacity="0.7"/><rect x="12" y="77" width="8" height="8" rx="2" fill="#1a6fff"/><rect x="68" y="77" width="8" height="8" rx="2" fill="#1a6fff"/><circle cx="150" cy="14" r="7" {...body}/><rect x="146" y="21" width="8" height="18" rx="3" {...body}/><rect x="140" y="39" width="6" height="22" rx="3" {...muscle}/><rect x="154" y="39" width="6" height="22" rx="3" {...muscle}/><rect x="144" y="28" width="12" height="10" rx="3" {...muscleO}/><rect x="139" y="61" width="6" height="14" rx="2" {...body}/><rect x="155" y="61" width="6" height="14" rx="2" {...body}/><rect x="120" y="36" width="60" height="4" rx="2" fill="#22c55e" opacity="0.7"/><rect x="116" y="34" width="8" height="8" rx="2" fill="#22c55e"/><rect x="176" y="34" width="8" height="8" rx="2" fill="#22c55e"/><text x="150" y="115" textAnchor="middle" fill={MuscleRed} fontSize="6" fontFamily="Barlow">Ischio-jambiers • Lombaires</text></svg>),
    bench_press:(<svg style={s} viewBox="0 0 200 120" fill="none"><text x="50" y="9" textAnchor="middle" fill="#1a6fff" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">DÉPART</text><text x="150" y="9" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">FIN</text><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><rect x="10" y="72" width="80" height="7" rx="3" fill="#112240"/><circle cx="50" cy="46" r="7" {...body}/><rect x="46" y="53" width="8" height="19" rx="3" {...body}/><rect x="36" y="54" width="10" height="12" rx="3" {...muscle}/><rect x="54" y="54" width="10" height="12" rx="3" {...muscle}/><line x1="26" y1="32" x2="36" y2="56" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><line x1="74" y1="32" x2="64" y2="56" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><rect x="18" y="20" width="64" height="5" rx="2" fill="#1a6fff" opacity="0.8"/><rect x="12" y="17" width="10" height="11" rx="2" fill="#1a6fff"/><rect x="78" y="17" width="10" height="11" rx="2" fill="#1a6fff"/><rect x="110" y="72" width="80" height="7" rx="3" fill="#112240"/><circle cx="150" cy="46" r="7" {...body}/><rect x="146" y="53" width="8" height="19" rx="3" {...body}/><rect x="136" y="54" width="10" height="12" rx="3" {...muscle}/><rect x="154" y="54" width="10" height="12" rx="3" {...muscle}/><line x1="128" y1="58" x2="138" y2="58" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><line x1="162" y1="58" x2="172" y2="58" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><rect x="120" y="56" width="60" height="5" rx="2" fill="#22c55e" opacity="0.8"/><rect x="114" y="53" width="10" height="11" rx="2" fill="#22c55e"/><rect x="176" y="53" width="10" height="11" rx="2" fill="#22c55e"/><text x="150" y="115" textAnchor="middle" fill={MuscleRed} fontSize="6" fontFamily="Barlow">Pectoraux • Triceps</text></svg>),
    pullup:(<svg style={s} viewBox="0 0 200 120" fill="none"><text x="50" y="9" textAnchor="middle" fill="#1a6fff" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">DÉPART</text><text x="150" y="9" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">FIN</text><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><rect x="10" y="14" width="80" height="5" rx="2" fill="#1a6fff" opacity="0.6"/><rect x="110" y="14" width="80" height="5" rx="2" fill="#1a6fff" opacity="0.6"/><circle cx="50" cy="36" r="7" {...body}/><line x1="36" y1="19" x2="44" y2="32" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><line x1="64" y1="19" x2="56" y2="32" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><rect x="46" y="43" width="8" height="20" rx="3" {...body}/><rect x="44" y="63" width="5" height="22" rx="2" {...body}/><rect x="51" y="63" width="5" height="22" rx="2" {...body}/><circle cx="150" cy="24" r="7" {...body}/><line x1="136" y1="19" x2="142" y2="24" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><line x1="164" y1="19" x2="158" y2="24" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><rect x="138" y="31" width="9" height="18" rx="3" {...muscle}/><rect x="153" y="31" width="9" height="18" rx="3" {...muscle}/><rect x="136" y="22" width="5" height="10" rx="2" {...muscleO}/><rect x="159" y="22" width="5" height="10" rx="2" {...muscleO}/><rect x="146" y="49" width="8" height="18" rx="3" {...body}/><rect x="144" y="67" width="5" height="20" rx="2" {...body}/><rect x="151" y="67" width="5" height="20" rx="2" {...body}/><text x="150" y="115" textAnchor="middle" fill={MuscleRed} fontSize="6" fontFamily="Barlow">Grand dorsal • Biceps</text></svg>),
    overhead_press:(<svg style={s} viewBox="0 0 200 120" fill="none"><text x="50" y="9" textAnchor="middle" fill="#1a6fff" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">DÉPART</text><text x="150" y="9" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">FIN</text><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><circle cx="50" cy="32" r="7" {...body}/><rect x="46" y="39" width="8" height="18" rx="3" {...body}/><rect x="34" y="38" width="10" height="10" rx="4" {...muscle}/><rect x="56" y="38" width="10" height="10" rx="4" {...muscle}/><line x1="34" y1="42" x2="22" y2="48" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><line x1="66" y1="42" x2="78" y2="48" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><rect x="18" y="40" width="64" height="4" rx="2" fill="#1a6fff" opacity="0.8"/><rect x="12" y="38" width="8" height="8" rx="2" fill="#1a6fff"/><rect x="80" y="38" width="8" height="8" rx="2" fill="#1a6fff"/><rect x="45" y="57" width="10" height="24" rx="3" {...body}/><rect x="43" y="81" width="6" height="18" rx="2" {...body}/><rect x="51" y="81" width="6" height="18" rx="2" {...body}/><circle cx="150" cy="42" r="7" {...body}/><rect x="146" y="49" width="8" height="18" rx="3" {...body}/><rect x="134" y="48" width="10" height="10" rx="4" {...muscle}/><rect x="156" y="48" width="10" height="10" rx="4" {...muscle}/><rect x="131" y="36" width="6" height="14" rx="2" {...muscleO}/><rect x="163" y="36" width="6" height="14" rx="2" {...muscleO}/><line x1="134" y1="48" x2="128" y2="22" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><line x1="166" y1="48" x2="172" y2="22" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><rect x="120" y="14" width="60" height="4" rx="2" fill="#22c55e" opacity="0.8"/><rect x="114" y="12" width="8" height="8" rx="2" fill="#22c55e"/><rect x="178" y="12" width="8" height="8" rx="2" fill="#22c55e"/><rect x="145" y="67" width="10" height="24" rx="3" {...body}/><rect x="143" y="91" width="6" height="18" rx="2" {...body}/><rect x="151" y="91" width="6" height="18" rx="2" {...body}/><text x="150" y="115" textAnchor="middle" fill={MuscleRed} fontSize="6" fontFamily="Barlow">Épaules • Triceps</text></svg>),
    barbell_row:(<svg style={s} viewBox="0 0 200 120" fill="none"><text x="50" y="9" textAnchor="middle" fill="#1a6fff" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">DÉPART</text><text x="150" y="9" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">FIN</text><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><circle cx="50" cy="30" r="7" {...body}/><rect x="46" y="37" width="8" height="14" rx="3" {...body}/><rect x="38" y="40" width="7" height="12" rx="2" {...body}/><rect x="55" y="40" width="7" height="12" rx="2" {...body}/><rect x="44" y="51" width="6" height="20" rx="2" {...body}/><rect x="50" y="51" width="6" height="20" rx="2" {...body}/><rect x="43" y="71" width="5" height="14" rx="2" {...body}/><rect x="50" y="71" width="5" height="14" rx="2" {...body}/><line x1="38" y1="46" x2="22" y2="80" stroke={BodyColor} strokeWidth="3" strokeLinecap="round"/><rect x="10" y="80" width="56" height="4" rx="2" fill="#1a6fff" opacity="0.7"/><rect x="6" y="78" width="7" height="8" rx="2" fill="#1a6fff"/><rect x="60" y="78" width="7" height="8" rx="2" fill="#1a6fff"/><circle cx="150" cy="30" r="7" {...body}/><rect x="146" y="37" width="8" height="14" rx="3" {...body}/><rect x="137" y="38" width="8" height="16" rx="3" {...muscle}/><rect x="155" y="38" width="8" height="16" rx="3" {...muscle}/><rect x="143" y="36" width="14" height="8" rx="3" {...muscleO}/><rect x="144" y="51" width="6" height="20" rx="2" {...body}/><rect x="150" y="51" width="6" height="20" rx="2" {...body}/><rect x="143" y="71" width="5" height="14" rx="2" {...body}/><rect x="150" y="71" width="5" height="14" rx="2" {...body}/><line x1="137" y1="46" x2="122" y2="54" stroke={BodyColor} strokeWidth="3" strokeLinecap="round"/><rect x="110" y="52" width="56" height="4" rx="2" fill="#22c55e" opacity="0.7"/><rect x="106" y="50" width="7" height="8" rx="2" fill="#22c55e"/><rect x="160" y="50" width="7" height="8" rx="2" fill="#22c55e"/><text x="150" y="115" textAnchor="middle" fill={MuscleRed} fontSize="6" fontFamily="Barlow">Grand dorsal • Rhomboïdes</text></svg>),
    lunge:(<svg style={s} viewBox="0 0 200 120" fill="none"><text x="50" y="9" textAnchor="middle" fill="#1a6fff" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">DÉPART</text><text x="150" y="9" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">FIN</text><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><circle cx="50" cy="16" r="7" {...body}/><rect x="46" y="23" width="8" height="18" rx="3" {...body}/><rect x="43" y="28" width="6" height="14" rx="2" {...body}/><rect x="51" y="28" width="6" height="14" rx="2" {...body}/><rect x="45" y="41" width="5" height="20" rx="2" {...body}/><rect x="50" y="41" width="5" height="20" rx="2" {...body}/><rect x="44" y="61" width="5" height="14" rx="2" {...body}/><rect x="51" y="61" width="5" height="14" rx="2" {...body}/><circle cx="148" cy="20" r="7" {...body}/><rect x="144" y="27" width="8" height="14" rx="3" {...body}/><rect x="138" y="30" width="6" height="12" rx="2" {...body}/><rect x="154" y="30" width="6" height="12" rx="2" {...body}/><rect x="138" y="41" width="7" height="24" rx="3" {...muscle}/><rect x="155" y="38" width="7" height="20" rx="3" {...muscleO}/><rect x="137" y="65" width="6" height="16" rx="2" {...body}/><rect x="154" y="58" width="6" height="16" rx="2" {...body}/><text x="150" y="117" textAnchor="middle" fill={MuscleRed} fontSize="6" fontFamily="Barlow">Quadriceps • Fessiers</text></svg>),
    hip90:(<svg style={s} viewBox="0 0 200 120" fill="none"><text x="50" y="9" textAnchor="middle" fill="#1a6fff" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">DÉPART</text><text x="150" y="9" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">FIN</text><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><circle cx="50" cy="42" r="7" {...body}/><rect x="46" y="49" width="8" height="18" rx="3" {...body}/><rect x="38" y="56" width="8" height="12" rx="2" {...body}/><rect x="54" y="56" width="8" height="12" rx="2" {...body}/><rect x="30" y="67" width="20" height="6" rx="3" {...body}/><rect x="50" y="67" width="20" height="6" rx="3" {...body}/><rect x="30" y="73" width="6" height="16" rx="2" {...body}/><rect x="44" y="73" width="6" height="16" rx="2" {...body}/><circle cx="150" cy="38" r="7" {...body}/><rect x="146" y="45" width="8" height="18" rx="3" {...body}/><rect x="135" y="52" width="8" height="12" rx="2" {...body}/><rect x="157" y="52" width="8" height="12" rx="2" {...body}/><rect x="130" y="63" width="20" height="8" rx="4" {...muscle}/><rect x="150" y="63" width="20" height="8" rx="4" {...muscle}/><rect x="130" y="71" width="6" height="16" rx="2" {...body}/><rect x="144" y="71" width="6" height="16" rx="2" {...body}/><line x1="138" y1="56" x2="118" y2="68" stroke={BodyColor} strokeWidth="3" strokeLinecap="round"/><text x="150" y="117" textAnchor="middle" fill={MuscleRed} fontSize="6" fontFamily="Barlow">Rotateurs hanche • Fessiers</text></svg>),
    burpee:(<svg style={s} viewBox="0 0 200 120" fill="none"><text x="50" y="9" textAnchor="middle" fill="#1a6fff" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">PLANCHE</text><text x="150" y="9" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">SAUT</text><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><circle cx="68" cy="42" r="6" {...body}/><rect x="38" y="58" width="42" height="7" rx="3" {...body}/><rect x="64" y="48" width="6" height="12" rx="2" {...body}/><rect x="28" y="60" width="6" height="12" rx="2" {...body}/><rect x="76" y="60" width="6" height="12" rx="2" {...body}/><rect x="44" y="56" width="26" height="7" rx="3" {...muscle}/><circle cx="150" cy="16" r="7" {...body}/><rect x="146" y="23" width="8" height="18" rx="3" {...body}/><line x1="128" y1="14" x2="146" y2="28" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><line x1="172" y1="14" x2="154" y2="28" stroke={BodyColor} strokeWidth="4" strokeLinecap="round"/><rect x="140" y="41" width="6" height="20" rx="2" {...muscle}/><rect x="154" y="41" width="6" height="20" rx="2" {...muscle}/><rect x="138" y="61" width="6" height="18" rx="2" {...body}/><rect x="156" y="61" width="6" height="18" rx="2" {...body}/><text x="150" y="115" textAnchor="middle" fill={MuscleRed} fontSize="6" fontFamily="Barlow">Full body • Cardio</text></svg>),
    run:(<svg style={s} viewBox="0 0 200 120" fill="none"><text x="50" y="9" textAnchor="middle" fill="#1a6fff" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">APPUI</text><text x="150" y="9" textAnchor="middle" fill="#22c55e" fontSize="7" fontFamily="Barlow Condensed" fontWeight="700">FOULÉE</text><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><circle cx="50" cy="20" r="7" {...body}/><rect x="46" y="27" width="8" height="16" rx="3" {...body}/><rect x="36" y="33" width="8" height="12" rx="2" {...body}/><rect x="56" y="33" width="8" height="12" rx="2" {...body}/><rect x="43" y="43" width="6" height="20" rx="2" {...body}/><rect x="51" y="43" width="6" height="20" rx="2" {...body}/><rect x="41" y="63" width="6" height="16" rx="2" {...body}/><rect x="51" y="63" width="6" height="16" rx="2" {...body}/><circle cx="150" cy="18" r="7" {...body}/><rect x="146" y="25" width="8" height="16" rx="3" {...body}/><rect x="133" y="30" width="8" height="12" rx="2" {...body}/><rect x="159" y="30" width="8" height="12" rx="2" {...body}/><rect x="138" y="41" width="7" height="20" rx="3" {...muscle}/><rect x="156" y="38" width="7" height="18" rx="3" {...muscleO}/><rect x="137" y="61" width="6" height="16" rx="2" {...body}/><rect x="155" y="56" width="6" height="14" rx="2" {...body}/><text x="150" y="117" textAnchor="middle" fill={MuscleRed} fontSize="6" fontFamily="Barlow">Quadriceps • Ischio • Mollets</text></svg>),
  };
  const defaultSVG=(<svg style={s} viewBox="0 0 200 120" fill="none"><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><circle cx="50" cy="24" r="8" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="44" y="32" width="12" height="22" rx="4" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="36" y="36" width="8" height="18" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="56" y="36" width="8" height="18" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="42" y="54" width="7" height="24" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="51" y="54" width="7" height="24" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="41" y="78" width="6" height="20" rx="2" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="50" y="78" width="6" height="20" rx="2" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><circle cx="150" cy="24" r="8" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="144" y="32" width="12" height="22" rx="4" fill={MuscleRed} stroke="#ff6b7a" strokeWidth="1"/><rect x="136" y="36" width="8" height="18" rx="3" fill={MuscleRed} stroke="#ff6b7a" strokeWidth="1"/><rect x="156" y="36" width="8" height="18" rx="3" fill={MuscleRed} stroke="#ff6b7a" strokeWidth="1"/><rect x="142" y="54" width="7" height="24" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="151" y="54" width="7" height="24" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="141" y="78" width="6" height="20" rx="2" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="150" y="78" width="6" height="20" rx="2" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/></svg>);
  return (<div style={{ width:"100%", aspectRatio:"2/1", background:"#04080f", borderRadius:10, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", padding:6 }}>{illustrations[id]||defaultSVG}</div>);
};

const MUSCLE_GROUPS = {
  "Pectoraux":["bench_press","incline_press","dips","cable_fly","pushup","bench_dumbbell","incline_fly"],
  "Épaules":["overhead_press","lateral_raise","face_pull","shrug"],
  "Triceps":["overhead_press","dips","tricep_pushdown","skull_crusher","bench_press"],
  "Dorsaux":["pullup","barbell_row","dumbbell_row","lat_pulldown","deadlift","gorilla_row"],
  "Biceps":["pullup","bicep_curl","hammer_curl","barbell_row"],
  "Quadriceps":["squat","back_squat","front_squat","zercher_squat","goblet_squat","lunge","leg_press","bulgarian_split"],
  "Ischio-jamb.":["deadlift","rdl","leg_curl","glute_bridge","lunge"],
  "Fessiers":["squat","back_squat","rdl","glute_bridge","bulgarian_split","lunge","hip90","hip_thrust","crab_walk","kickback"],
  "Abdominaux":["plank","ab_crunch","ab_wheel","leg_raise","russian_twist","hollow_body","dragon_flag","pallof_press","sit_up","cable_crunch"],
  "Cardio":["run","bike","rowing_machine","assault_bike","skierg","jumpingjack","jump_rope","hiit_sprint"],
  "Functional":["kb_russian_swing","kb_american_swing","kb_snatch","kb_tgu","kb_clean_press","gorilla_row","farmer_walk","wall_ball","box_jump","thruster","clean_jerk","barbell_snatch","battle_rope"],
};

const LIBRARY = [
  { id:"bench_press",      name:"Développé couché",      cat:"Push",       muscles:"Pectoraux, Triceps, Épaules",        tip:"Omoplates rétractées, coudes à 45°." },
  { id:"overhead_press",   name:"Développé militaire",   cat:"Push",       muscles:"Épaules, Triceps, Trapèzes",         tip:"Gainage abdominal, barre dans l'axe." },
  { id:"incline_press",    name:"Développé incliné",     cat:"Push",       muscles:"Pectoraux sup., Épaules",            tip:"Inclinaison 30-45°, contrôle en descente." },
  { id:"incline_fly",      name:"Écarté incliné",        cat:"Push",       muscles:"Pectoraux sup., Deltoïdes ant.",      tip:"Arc de cercle, légère flexion des coudes." },
  { id:"dips",             name:"Dips",                  cat:"Push",       muscles:"Triceps, Pectoraux inférieurs",      tip:"Légère inclinaison avant pour les pectoraux." },
  { id:"lateral_raise",    name:"Élévations latérales",  cat:"Push",       muscles:"Deltoïdes latéraux",                 tip:"Coudes légèrement fléchis, jusqu'à l'horizontal." },
  { id:"tricep_pushdown",  name:"Pushdown triceps",      cat:"Push",       muscles:"Triceps",                            tip:"Coudes fixes contre le corps." },
  { id:"cable_fly",        name:"Écarté poulie",         cat:"Push",       muscles:"Pectoraux, Deltoïdes ant.",          tip:"Légère flexion des coudes, arc de cercle." },
  { id:"skull_crusher",    name:"Skull crusher",         cat:"Push",       muscles:"Triceps long",                       tip:"Coudes fixes, descente vers le front." },
  { id:"pushup",           name:"Pompes",                cat:"Push",       muscles:"Pectoraux, Triceps, Épaules",        tip:"Corps gainé, coudes à 45°." },
  { id:"bench_dumbbell",   name:"Développé haltères",    cat:"Push",       muscles:"Pectoraux, Triceps",                 tip:"Grande amplitude, coudes à 45°." },
  { id:"pullup",           name:"Traction",              cat:"Pull",       muscles:"Grand dorsal, Biceps, Rhomboïdes",   tip:"Dépression scapulaire avant de tirer." },
  { id:"barbell_row",      name:"Rowing barre",          cat:"Pull",       muscles:"Grand dorsal, Rhomboïdes, Biceps",   tip:"Dos plat, tirage vers le nombril." },
  { id:"dumbbell_row",     name:"Rowing haltère",        cat:"Pull",       muscles:"Grand dorsal, Rhomboïdes",           tip:"Coude près du corps, tirage jusqu'à la hanche." },
  { id:"lat_pulldown",     name:"Tirage poulie haute",   cat:"Pull",       muscles:"Grand dorsal, Biceps",               tip:"Tirage vers le sternum." },
  { id:"face_pull",        name:"Face pull",             cat:"Pull",       muscles:"Deltoïdes post., Rhomboïdes",        tip:"Tirer vers le visage, coudes hauts." },
  { id:"bicep_curl",       name:"Curl biceps",           cat:"Pull",       muscles:"Biceps, Brachial",                   tip:"Coudes fixes, supination en haut." },
  { id:"hammer_curl",      name:"Curl marteau",          cat:"Pull",       muscles:"Biceps, Brachioradial",              tip:"Prise neutre, coudes fixes." },
  { id:"shrug",            name:"Haussements épaules",   cat:"Pull",       muscles:"Trapèzes supérieurs",                tip:"Mouvement vertical pur, pas de rotation." },
  { id:"deadlift",         name:"Deadlift",              cat:"Pull",       muscles:"Ischio-jambiers, Lombaires, Fessiers",tip:"Dos plat, barre proche du corps." },
  { id:"gorilla_row",      name:"Gorilla Row",           cat:"Pull",       muscles:"Grand dorsal, Biceps, Core",         tip:"2 KB au sol, row alterné." },
  { id:"squat",            name:"Squat",                 cat:"Legs",       muscles:"Quadriceps, Fessiers, Ischio",       tip:"Pieds largeur épaules, genoux dans l'axe." },
  { id:"back_squat",       name:"Back Squat",            cat:"Legs",       muscles:"Quadriceps, Fessiers, Ischio",       tip:"Barre haute sur les trapèzes, dos droit." },
  { id:"front_squat",      name:"Front Squat",           cat:"Legs",       muscles:"Quadriceps, Core, Épaules",          tip:"Coudes hauts, barre sur les deltoïdes." },
  { id:"zercher_squat",    name:"Zercher Squat",         cat:"Legs",       muscles:"Quadriceps, Core, Biceps",           tip:"Barre dans le creux des coudes, dos droit." },
  { id:"goblet_squat",     name:"Goblet Squat",          cat:"Legs",       muscles:"Quadriceps, Fessiers, Core",         tip:"KB contre la poitrine, talons au sol." },
  { id:"hip_thrust",       name:"Hip Thrust",            cat:"Legs",       muscles:"Fessiers, Ischio-jambiers",          tip:"Épaules sur le banc, poussée explosive." },
  { id:"lunge",            name:"Fente avant",           cat:"Legs",       muscles:"Quadriceps, Fessiers, Mollets",      tip:"Genou avant à 90°, genou arrière près du sol." },
  { id:"rdl",              name:"Romanian Deadlift",     cat:"Legs",       muscles:"Ischio-jambiers, Fessiers",          tip:"Charnière hanche, dos plat." },
  { id:"leg_press",        name:"Presse à cuisses",      cat:"Legs",       muscles:"Quadriceps, Fessiers",               tip:"Pieds à largeur d'épaules, genoux dans l'axe." },
  { id:"leg_curl",         name:"Leg curl",              cat:"Legs",       muscles:"Ischio-jambiers",                    tip:"Contraction complète, descente contrôlée." },
  { id:"calf_raise",       name:"Mollets debout",        cat:"Legs",       muscles:"Mollets, Soléaire",                  tip:"Amplitude complète, pause en haut." },
  { id:"glute_bridge",     name:"Pont fessier",          cat:"Legs",       muscles:"Fessiers, Ischio-jambiers",          tip:"Poussée sur les talons, contraction en haut." },
  { id:"bulgarian_split",  name:"Fente bulgare",         cat:"Legs",       muscles:"Quadriceps, Fessiers",               tip:"Pied arrière surélevé, genou avant à 90°." },
  { id:"crab_walk",        name:"Marche crabe élastique",cat:"Legs",       muscles:"Fessiers, Abducteurs, Genoux",       tip:"Élastique au-dessus des genoux, pas latéraux." },
  { id:"kickback",         name:"Kickback fessier",      cat:"Legs",       muscles:"Fessiers, Ischio-jambiers",          tip:"Contraction maximale en haut, contrôle en descente." },
  { id:"plank",            name:"Gainage planche",       cat:"Musculation",muscles:"Abdominaux, Lombaires, Épaules",     tip:"Corps aligné, hanches ne tombent pas." },
  { id:"hip90",            name:"Hip 90/90",             cat:"Musculation",muscles:"Rotateurs hanche, Fessiers",         tip:"Deux jambes à 90°, bascule lente." },
  { id:"ab_crunch",        name:"Crunch",                cat:"Abdos",      muscles:"Grand droit abdominal",              tip:"Expiration en montant, ne pas tirer la nuque." },
  { id:"ab_wheel",         name:"Ab Wheel (roulette)",   cat:"Abdos",      muscles:"Grand droit, Core profond",          tip:"Dos plat, bras tendus, ne pas creuser les reins." },
  { id:"leg_raise",        name:"Relevé de jambes",      cat:"Abdos",      muscles:"Abdominaux bas, Fléchisseurs hanche",tip:"Lombaires au sol, jambes quasi tendues." },
  { id:"russian_twist",    name:"Russian Twist KB",      cat:"Abdos",      muscles:"Obliques, Grand droit",              tip:"Pieds levés, rotation complète de chaque côté." },
  { id:"hollow_body",      name:"Hollow Body",           cat:"Abdos",      muscles:"Core profond, Grand droit",          tip:"Bas du dos au sol, membres en extension." },
  { id:"dragon_flag",      name:"Dragon Flag",           cat:"Abdos",      muscles:"Grand droit, Core complet",          tip:"Corps rigide, descente lente et contrôlée." },
  { id:"pallof_press",     name:"Pallof Press",          cat:"Abdos",      muscles:"Obliques, Core anti-rotation",       tip:"Résister à la rotation, bras tendus devant." },
  { id:"sit_up",           name:"Sit-up",                cat:"Abdos",      muscles:"Grand droit, Fléchisseurs hanche",   tip:"Mouvement complet, expiration en montant." },
  { id:"cable_crunch",     name:"Crunch poulie haute",   cat:"Abdos",      muscles:"Grand droit abdominal",              tip:"Flexion du tronc, ne pas tirer avec les bras." },
  { id:"pigeon",           name:"Pigeon yoga",           cat:"Mobilité",   muscles:"Psoas, Rotateurs hanche",            tip:"Hanches au sol, 60-90s par côté." },
  { id:"catcow",           name:"Chat / Vache",          cat:"Mobilité",   muscles:"Rachis, Multifides",                 tip:"Mouvement fluide avec la respiration." },
  { id:"worldsgreatest",   name:"World's Greatest",      cat:"Mobilité",   muscles:"Full body, Hanche, Thoracique",      tip:"Rotation thoracique complète." },
  { id:"thoracic_rot",     name:"Rotation thoracique",   cat:"Mobilité",   muscles:"Rachis thoracique, Obliques",        tip:"Regard suit la main, amplitude max." },
  { id:"hip_flexor",       name:"Étirement psoas",       cat:"Mobilité",   muscles:"Psoas, Quadriceps",                  tip:"Bassin en rétroversion, avancer doucement." },
  { id:"ankle_mob",        name:"Mobilité cheville",     cat:"Mobilité",   muscles:"Tibial antérieur, Mollets",          tip:"Genou dans l'axe du pied, talon au sol." },
  { id:"foam_roll",        name:"Foam roll dos",         cat:"Mobilité",   muscles:"Érecteurs, Thoracique",              tip:"Pause 20-30s sur les zones tendues." },
  { id:"shoulder_mob",     name:"Mobilité épaule",       cat:"Mobilité",   muscles:"Coiffe des rotateurs",               tip:"Mouvements lents et contrôlés." },
  { id:"run",              name:"Course / Jogging",      cat:"Cardio",     muscles:"Quadriceps, Ischio, Mollets",        tip:"Foulée médio-pied, 170-180 pas/min.",         cardioType:"run" },
  { id:"bike",             name:"Vélo / Cycling",        cat:"Cardio",     muscles:"Quadriceps, Fessiers, Cardio",       tip:"Selle à hauteur de hanche, 80-90 rpm.",       cardioType:"watts" },
  { id:"rowing_machine",   name:"Rameur",                cat:"Cardio",     muscles:"Full body, Dos, Cardio",             tip:"Jambes d'abord, puis dos, puis bras.",         cardioType:"watts" },
  { id:"assault_bike",     name:"Assault Bike",          cat:"Cardio",     muscles:"Full body, Bras, Cardio",            tip:"Push/pull simultané bras et jambes.",          cardioType:"watts" },
  { id:"skierg",           name:"SkiErg",                cat:"Cardio",     muscles:"Dorsaux, Épaules, Cardio",           tip:"Traction double bras, genoux légèrement fléchis.",cardioType:"watts" },
  { id:"jumpingjack",      name:"Jumping Jack",          cat:"Cardio",     muscles:"Cardio, Coordination",               tip:"Rythme constant, atterrissage amorti.",        cardioType:"duration" },
  { id:"jump_rope",        name:"Corde à sauter",        cat:"Cardio",     muscles:"Mollets, Cardio, Coordination",      tip:"Sauts légers, poignets qui tournent.",         cardioType:"duration" },
  { id:"hiit_sprint",      name:"Sprint HIIT",           cat:"Cardio",     muscles:"Full body, Explosivité",             tip:"Effort max 20s, récup 40s.",                   cardioType:"run" },
  { id:"battle_rope",      name:"Battle Rope",           cat:"Cardio",     muscles:"Épaules, Bras, Cardio",              tip:"Genoux fléchis, ondulations continues.",       cardioType:"duration" },
  { id:"kb_russian_swing", name:"KB Russian Swing",      cat:"Functional", muscles:"Fessiers, Ischio, Lombaires",        tip:"Charnière hanche pure, KB jusqu'aux épaules." },
  { id:"kb_american_swing",name:"KB American Swing",     cat:"Functional", muscles:"Fessiers, Épaules, Full body",       tip:"KB au-dessus de la tête, bras tendus en haut." },
  { id:"kb_snatch",        name:"KB Snatch",             cat:"Functional", muscles:"Full body, Épaules, Ischio",         tip:"Mouvement explosif, rotation du poignet en haut." },
  { id:"kb_tgu",           name:"KB Turkish Get-Up",     cat:"Functional", muscles:"Full body, Stabilité, Épaules",      tip:"Regard sur la KB tout au long du mouvement." },
  { id:"kb_clean_press",   name:"KB Clean & Press",      cat:"Functional", muscles:"Full body, Épaules, Jambes",         tip:"Clean explosif, presse stricte au-dessus." },
  { id:"farmer_walk",      name:"Farmer Walk",           cat:"Functional", muscles:"Trapèzes, Core, Avant-bras, Jambes", tip:"Dos droit, pas contrôlés, charge lourde." },
  { id:"wall_ball",        name:"Wall Ball Shot",        cat:"Functional", muscles:"Full body, Quadriceps, Épaules",     tip:"Squat profond, lancer explosif à la cible." },
  { id:"box_jump",         name:"Box Jump",              cat:"Functional", muscles:"Quadriceps, Fessiers, Explosivité",  tip:"Atterrissage amorti, hanches en arrière." },
  { id:"thruster",         name:"Thruster",              cat:"Functional", muscles:"Full body, Quadriceps, Épaules",     tip:"Squat + press en un mouvement continu." },
  { id:"clean_jerk",       name:"Clean & Jerk",          cat:"Functional", muscles:"Full body, Olympique",               tip:"Phase 1 clean, phase 2 jerk au-dessus." },
  { id:"barbell_snatch",   name:"Snatch barre",          cat:"Functional", muscles:"Full body, Explosivité, Olympique",  tip:"Prise large, barre proche du corps." },
  { id:"double_under",     name:"Double Under",          cat:"Functional", muscles:"Mollets, Cardio, Coordination",      tip:"Poignets rapides, saut légèrement plus haut." },
  { id:"muscle_up",        name:"Muscle Up",             cat:"Functional", muscles:"Grand dorsal, Triceps, Épaules",     tip:"Traction explosive suivie d'un dip en haut." },
  { id:"handstand_pushup", name:"Handstand Push-up",     cat:"Functional", muscles:"Épaules, Triceps, Core",             tip:"Tête touche le sol, extension complète des bras." },
  { id:"toes_to_bar",      name:"Toes To Bar",           cat:"Functional", muscles:"Abdominaux, Fléchisseurs hanche",    tip:"Orteils touchent la barre, contrôle en descente." },
  { id:"ring_dip",         name:"Ring Dip",              cat:"Functional", muscles:"Triceps, Pectoraux, Épaules",        tip:"Anneaux stables, descente contrôlée." },
  { id:"rope_climb",       name:"Corde lisse",           cat:"Functional", muscles:"Grand dorsal, Biceps, Core",         tip:"Technique L-sit pour économiser l'énergie." },
  { id:"devil_press",      name:"Devil Press",           cat:"Functional", muscles:"Full body, Épaules, Cardio",         tip:"Burpee avec haltères + snatch au-dessus." },
];

const CATS = ["Tous","Push","Pull","Legs","Musculation","Abdos","Mobilité","Cardio","Functional"];
const CAT_COLOR = { Push:"#1a6fff",Pull:"#8b5cf6",Legs:"#22c55e",Musculation:"#1a6fff",Abdos:"#e63946",Mobilité:"#22c55e",Cardio:"#f59e0b",Functional:"#f97316" };
const MONTH_NAMES = {"01":"Janvier","02":"Février","03":"Mars","04":"Avril","05":"Mai","06":"Juin","07":"Juillet","08":"Août","09":"Septembre","10":"Octobre","11":"Novembre","12":"Décembre"};
const DAY_NAMES = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const DAY_FULL = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const STATUS_OPTIONS = ["actif","pause","inactif"];
const STATUS_COLOR = { actif:"#22c55e",pause:"#f59e0b",inactif:"#3d5278" };

const WOD_FORMATS = [
  { id:"amrap",   name:"AMRAP",    desc:"As Many Rounds As Possible", color:"#e63946", icon:"🔄" },
  { id:"emom",    name:"EMOM",     desc:"Every Minute On the Minute", color:"#f97316", icon:"⏰" },
  { id:"fortime", name:"For Time", desc:"Finir le plus vite possible",color:"#1a6fff", icon:"🏁" },
  { id:"timecap", name:"Timecap",  desc:"Maximum dans le temps imparti",color:"#8b5cf6",icon:"⏱️" },
  { id:"metcon",  name:"MetCon",   desc:"Metabolic Conditioning",     color:"#f59e0b", icon:"💪" },
  { id:"tabata",  name:"Tabata",   desc:"20s effort / 10s repos × 8", color:"#22c55e", icon:"⚡" },
];

const WOD_BENCHMARKS = [
  { id:"wod_cindy",   name:"CINDY",   type:"wod", format:"amrap",   duration:20, color:"#e63946", description:"AMRAP 20 min",          category:"The Girls",
    movements:[{name:"Pull-ups",reps:"5",libId:"pullup"},{name:"Push-ups",reps:"10",libId:"pushup"},{name:"Air Squats",reps:"15",libId:"squat"}],
    scoreType:"rounds", tip:"Pace-toi dès le départ, reste constant." },
  { id:"wod_annie",   name:"ANNIE",   type:"wod", format:"fortime", timecap:15,  color:"#f97316", description:"For Time",               category:"The Girls",
    movements:[{name:"Double Unders",reps:"50-40-30-20-10",libId:"double_under"},{name:"Sit-ups",reps:"50-40-30-20-10",libId:"sit_up"}],
    scoreType:"time", tip:"Enchaîne les double-unders sans t'arrêter." },
  { id:"wod_angie",   name:"ANGIE",   type:"wod", format:"fortime", timecap:30,  color:"#8b5cf6", description:"For Time",               category:"The Girls",
    movements:[{name:"Pull-ups",reps:"100",libId:"pullup"},{name:"Push-ups",reps:"100",libId:"pushup"},{name:"Sit-ups",reps:"100",libId:"sit_up"},{name:"Air Squats",reps:"100",libId:"squat"}],
    scoreType:"time", tip:"Complète chaque mouvement en entier." },
  { id:"wod_barbara", name:"BARBARA", type:"wod", format:"fortime", timecap:40,  color:"#1a6fff", description:"5 rounds For Time",      category:"The Girls",
    movements:[{name:"Pull-ups",reps:"20",libId:"pullup"},{name:"Push-ups",reps:"30",libId:"pushup"},{name:"Sit-ups",reps:"40",libId:"sit_up"},{name:"Air Squats",reps:"50",libId:"squat"}],
    scoreType:"time", tip:"3 min de repos entre chaque round." },
  { id:"wod_fran",    name:"FRAN",    type:"wod", format:"fortime", timecap:10,  color:"#e63946", description:"21-15-9 For Time",       category:"The Girls",
    movements:[{name:"Thrusters (43kg)",reps:"21-15-9",libId:"thruster"},{name:"Pull-ups",reps:"21-15-9",libId:"pullup"}],
    scoreType:"time", tip:"WOD iconique. Objectif sub-5min pour les élites." },
  { id:"wod_grace",   name:"GRACE",   type:"wod", format:"fortime", timecap:10,  color:"#f59e0b", description:"30 reps For Time",       category:"The Girls",
    movements:[{name:"Clean & Jerk (60kg)",reps:"30",libId:"clean_jerk"}],
    scoreType:"time", tip:"Mouvement complet à chaque répétition." },
  { id:"wod_chelsea", name:"CHELSEA", type:"wod", format:"emom",    minutes:30,  color:"#22c55e", description:"EMOM 30 min",            category:"The Girls",
    movements:[{name:"Pull-ups",reps:"5",libId:"pullup"},{name:"Push-ups",reps:"10",libId:"pushup"},{name:"Air Squats",reps:"15",libId:"squat"}],
    scoreType:"rounds", tip:"Si tu rates une minute, continue." },
  { id:"wod_karen",   name:"KAREN",   type:"wod", format:"fortime", timecap:15,  color:"#f59e0b", description:"For Time",               category:"The Girls",
    movements:[{name:"Wall Ball Shot (9kg)",reps:"150",libId:"wall_ball"}],
    scoreType:"time", tip:"Sets de 10-15 avec courte pause." },
  { id:"wod_helen",   name:"HELEN",   type:"wod", format:"fortime", timecap:15,  color:"#22c55e", description:"3 rounds For Time",      category:"The Girls",
    movements:[{name:"Run 400m",reps:"400m",libId:"run"},{name:"KB Swing (24kg)",reps:"21",libId:"kb_russian_swing"},{name:"Pull-ups",reps:"12",libId:"pullup"}],
    scoreType:"time", tip:"Sub-9min est bon." },
  { id:"wod_murph",   name:"MURPH",   type:"wod", format:"fortime", timecap:60,  color:"#e63946", description:"For Time (gilet 20lbs)",  category:"The Heroes",
    movements:[{name:"Run",reps:"1 mile",libId:"run"},{name:"Pull-ups",reps:"100",libId:"pullup"},{name:"Push-ups",reps:"200",libId:"pushup"},{name:"Air Squats",reps:"300",libId:"squat"},{name:"Run",reps:"1 mile",libId:"run"}],
    scoreType:"time", tip:"Partition : 20 rounds de 5/10/15." },
  { id:"wod_dt",      name:"DT",      type:"wod", format:"fortime", timecap:20,  color:"#8b5cf6", description:"5 rounds For Time (70kg)",category:"The Heroes",
    movements:[{name:"Deadlift",reps:"12",libId:"deadlift"},{name:"Hang Power Clean",reps:"9",libId:"clean_jerk"},{name:"Push Jerk",reps:"6",libId:"clean_jerk"}],
    scoreType:"time", tip:"Ne lâche pas la barre." },
  { id:"wod_jt",      name:"JT",      type:"wod", format:"fortime", timecap:20,  color:"#f97316", description:"21-15-9 For Time",       category:"The Heroes",
    movements:[{name:"Handstand Push-ups",reps:"21-15-9",libId:"handstand_pushup"},{name:"Ring Dips",reps:"21-15-9",libId:"ring_dip"},{name:"Push-ups",reps:"21-15-9",libId:"pushup"}],
    scoreType:"time", tip:"Très exigeant pour les épaules et triceps." },
  { id:"wod_loredo",  name:"LOREDO",  type:"wod", format:"fortime", timecap:30,  color:"#1a6fff", description:"6 rounds For Time",      category:"The Heroes",
    movements:[{name:"Run 400m",reps:"400m",libId:"run"},{name:"Air Squats",reps:"24",libId:"squat"},{name:"Push-ups",reps:"24",libId:"pushup"},{name:"Walking Lunges",reps:"24",libId:"lunge"}],
    scoreType:"time", tip:"Pace ton run dès le départ." },
];

const calc1RM = (load, reps) => {
  if (!load||!reps||+reps===0||+reps>30) return null;
  return Math.round(+load*(1 + +reps/30));
};
const rpeColor = (rpe) => { if(!rpe)return"#3d5278"; const r=+rpe; if(r<=4)return"#22c55e"; if(r<=6)return"#f59e0b"; if(r<=8)return"#f97316"; return"#e63946"; };
const rpeLabel = (rpe) => { if(!rpe)return""; const r=+rpe; if(r<=3)return"Facile"; if(r<=5)return"Modéré"; if(r<=7)return"Difficile"; if(r<=9)return"Très dur"; return"Maximal"; };
const zoneColor = (z) => ({"1":"#3b82f6","2":"#22c55e","3":"#f59e0b","4":"#f97316","5":"#e63946"}[z]||"#3d5278");
const zoneLabel = (z) => ({"1":"Récup","2":"Aérobie","3":"Tempo","4":"Seuil","5":"VO2max"}[z]||"");

const todayStr = () => { const t=new Date(); return `${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`; };
const getWeekDates = () => {
  const today=new Date(); const dow=(today.getDay()+6)%7;
  const monday=new Date(today); monday.setDate(today.getDate()-dow);
  return Array.from({length:7},(_,i)=>{ const d=new Date(monday); d.setDate(monday.getDate()+i); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; });
};

const DEFAULT_TEMPLATES = [
  { id:"tpl_push_a", name:"Push Day A", cat:"Push", color:"#1a6fff", exercises:[
    {libId:"bench_press",name:"Développé couché",sets:"4",reps:"6",rest:"150"},
    {libId:"incline_press",name:"Développé incliné",sets:"3",reps:"10",rest:"90"},
    {libId:"incline_fly",name:"Écarté incliné",sets:"3",reps:"12",rest:"60"},
    {libId:"dips",name:"Dips",sets:"3",reps:"12",rest:"60"},
    {libId:"pushup",name:"Pompes",sets:"3",reps:"15",rest:"60"},
  ]},
  { id:"tpl_push_b", name:"Push Day B", cat:"Push", color:"#1a6fff", exercises:[
    {libId:"overhead_press",name:"Développé militaire",sets:"4",reps:"8",rest:"120"},
    {libId:"bench_dumbbell",name:"Développé haltères",sets:"3",reps:"10",rest:"90"},
    {libId:"lateral_raise",name:"Élévations latérales",sets:"3",reps:"15",rest:"60"},
    {libId:"skull_crusher",name:"Skull crusher",sets:"3",reps:"12",rest:"60"},
    {libId:"tricep_pushdown",name:"Pushdown triceps",sets:"3",reps:"15",rest:"60"},
  ]},
  { id:"tpl_back_a", name:"Back Day A", cat:"Pull", color:"#8b5cf6", exercises:[
    {libId:"barbell_row",name:"Rowing barre",sets:"4",reps:"8",rest:"120"},
    {libId:"dumbbell_row",name:"Rowing haltère",sets:"3",reps:"10",rest:"90"},
    {libId:"lateral_raise",name:"Élévations latérales",sets:"3",reps:"15",rest:"60"},
    {libId:"pullup",name:"Traction",sets:"4",reps:"8",rest:"120"},
    {libId:"face_pull",name:"Face pull",sets:"3",reps:"15",rest:"60"},
  ]},
  { id:"tpl_back_b", name:"Back Day B", cat:"Pull", color:"#8b5cf6", exercises:[
    {libId:"lat_pulldown",name:"Tirage poulie haute",sets:"4",reps:"10",rest:"90"},
    {libId:"gorilla_row",name:"Gorilla Row",sets:"3",reps:"10",rest:"90"},
    {libId:"face_pull",name:"Face pull",sets:"3",reps:"15",rest:"60"},
    {libId:"bicep_curl",name:"Curl biceps",sets:"3",reps:"12",rest:"60"},
    {libId:"hammer_curl",name:"Curl marteau",sets:"3",reps:"12",rest:"60"},
  ]},
  { id:"tpl_leg_a", name:"Leg Day A", cat:"Legs", color:"#22c55e", exercises:[
    {libId:"back_squat",name:"Back Squat",sets:"4",reps:"6",rest:"180"},
    {libId:"hip_thrust",name:"Hip Thrust",sets:"4",reps:"10",rest:"90"},
    {libId:"bulgarian_split",name:"Fente bulgare",sets:"3",reps:"10",rest:"90"},
    {libId:"rdl",name:"Romanian Deadlift",sets:"3",reps:"10",rest:"90"},
    {libId:"crab_walk",name:"Marche crabe élastique",sets:"3",reps:"20",rest:"60"},
    {libId:"kickback",name:"Kickback fessier",sets:"3",reps:"15",rest:"60"},
  ]},
  { id:"tpl_leg_b", name:"Leg Day B", cat:"Legs", color:"#22c55e", exercises:[
    {libId:"front_squat",name:"Front Squat",sets:"4",reps:"6",rest:"180"},
    {libId:"leg_press",name:"Presse à cuisses",sets:"3",reps:"12",rest:"90"},
    {libId:"leg_curl",name:"Leg curl",sets:"3",reps:"12",rest:"60"},
    {libId:"glute_bridge",name:"Pont fessier",sets:"3",reps:"15",rest:"60"},
    {libId:"calf_raise",name:"Mollets debout",sets:"4",reps:"20",rest:"45"},
  ]},
  { id:"tpl_functional", name:"WOD Functional", cat:"Functional", color:"#f97316", exercises:[
    {libId:"kb_russian_swing",name:"KB Russian Swing",sets:"5",reps:"15",rest:"60"},
    {libId:"thruster",name:"Thruster",sets:"4",reps:"10",rest:"90"},
    {libId:"box_jump",name:"Box Jump",sets:"4",reps:"10",rest:"60"},
    {libId:"farmer_walk",name:"Farmer Walk",sets:"4",reps:"30",rest:"90"},
    {libId:"wall_ball",name:"Wall Ball Shot",sets:"4",reps:"15",rest:"60"},
  ]},
  { id:"tpl_fullbody", name:"Full Body", cat:"Musculation", color:"#1a6fff", exercises:[
    {libId:"deadlift",name:"Deadlift",sets:"4",reps:"5",rest:"180"},
    {libId:"overhead_press",name:"Développé militaire",sets:"3",reps:"8",rest:"120"},
    {libId:"pullup",name:"Traction",sets:"3",reps:"8",rest:"120"},
    {libId:"back_squat",name:"Back Squat",sets:"3",reps:"8",rest:"150"},
    {libId:"plank",name:"Gainage planche",sets:"3",reps:"60s",rest:"60"},
  ]},
];

const applyTemplate = (template, clientSessions) => {
  if (template.type==="wod") {
    return template.movements.map(mv=>({ id:"se"+Date.now()+Math.random(), libId:mv.libId||"", name:mv.name, reps:mv.reps, sets:"1", load:"", rest:"", rpe:"", note:"", isWodMovement:true }));
  }
  return template.exercises.map(tplEx=>{
    let lastLoad="", lastReps=tplEx.reps, lastRpe="";
    for (const s of [...clientSessions].sort((a,b)=>b.date.localeCompare(a.date))) {
      const found=(s.exercises||[]).find(e=>e.libId===tplEx.libId);
      if (found) { lastLoad=found.load||""; lastReps=found.reps||tplEx.reps; lastRpe=found.rpe||""; break; }
    }
    let suggestedLoad=lastLoad;
    if (lastLoad&&+lastLoad>0&&lastRpe&&+lastRpe<=7) suggestedLoad=String(+lastLoad+2.5);
    return { id:"se"+Date.now()+Math.random(), libId:tplEx.libId, name:tplEx.name, sets:tplEx.sets, reps:lastReps, load:suggestedLoad, rest:tplEx.rest, rpe:"",
      note:lastLoad&&suggestedLoad!==lastLoad?`↑ +2.5kg vs dernière fois (${lastLoad}kg)`:lastLoad?`Dernière fois: ${lastLoad}kg`:"",
      cardioType:LIBRARY.find(l=>l.id===tplEx.libId)?.cardioType||"" };
  });
};

const SAMPLE_CLIENTS = [{
  id:"tony", name:"Tony Parker", age:41, sport:"Basketball", since:"2024-01", status:"actif",
  objective:"Maintien forme & mobilité", progress:78, notes:"Attention genou droit.",
  sessions:[
    { id:"s1", date:"2026-04-15", present:true, duration:90, note:"Push Day", templateId:"tpl_push_a", exercises:[
      { id:"se1", libId:"bench_press", name:"Développé couché", sets:"4", reps:"6", load:"90", rest:"150", rpe:"7" },
      { id:"se2", libId:"incline_press", name:"Développé incliné", sets:"3", reps:"10", load:"70", rest:"90", rpe:"6" },
    ]},
    { id:"s2", date:"2026-04-10", present:true, duration:30, note:"WOD Cindy", templateId:"wod_cindy",
      isWod:true, wodFormat:"amrap", wodDuration:20, wodScore:"18 rounds + 5 pull-ups",
      exercises:[{id:"se3",libId:"pullup",name:"Pull-ups",reps:"5",isWodMovement:true},{id:"se4",libId:"pushup",name:"Push-ups",reps:"10",isWodMovement:true},{id:"se5",libId:"squat",name:"Air Squats",reps:"15",isWodMovement:true}]},
    { id:"s3", date:"2026-03-28", present:true, duration:75, note:"Back Day", templateId:"tpl_back_a", exercises:[
      { id:"se6", libId:"barbell_row", name:"Rowing barre", sets:"4", reps:"8", load:"80", rest:"120", rpe:"7" },
    ]},
  ],
  planned:[
    { id:"pl1", date:"2026-04-22", type:"template", templateId:"tpl_leg_a", name:"Leg Day A", note:"Apporter sa ceinture", color:"#22c55e",
      exercises:[
        {id:"pe1",libId:"back_squat",name:"Back Squat",sets:"4",reps:"6",load:"100",rest:"180",rpe:"",note:"Dernière fois: 100kg"},
        {id:"pe2",libId:"hip_thrust",name:"Hip Thrust",sets:"4",reps:"10",load:"80",rest:"90",rpe:"",note:""},
        {id:"pe3",libId:"bulgarian_split",name:"Fente bulgare",sets:"3",reps:"10",load:"20",rest:"90",rpe:"",note:""},
        {id:"pe4",libId:"rdl",name:"Romanian Deadlift",sets:"3",reps:"10",load:"70",rest:"90",rpe:"",note:""},
        {id:"pe5",libId:"crab_walk",name:"Marche crabe élastique",sets:"3",reps:"20",load:"",rest:"60",rpe:"",note:""},
        {id:"pe6",libId:"kickback",name:"Kickback fessier",sets:"3",reps:"15",load:"",rest:"60",rpe:"",note:""},
      ]},
    { id:"pl2", date:"2026-04-24", type:"wod", templateId:"wod_murph", name:"MURPH", note:"Gilet 10kg", color:"#e63946",
      exercises:[{id:"pw1",libId:"pullup",name:"Pull-ups",reps:"100",isWodMovement:true},{id:"pw2",libId:"pushup",name:"Push-ups",reps:"200",isWodMovement:true},{id:"pw3",libId:"squat",name:"Air Squats",reps:"300",isWodMovement:true}]},
  ],
  metrics:[
    { date:"2026-04-01", weight:92.0, chest:104, waist:86, hips:98, fatPct:14.2 },
    { date:"2026-03-01", weight:93.5, chest:105, waist:87, hips:99, fatPct:14.8 },
  ],
  programs:[{ id:"p1", name:"Mobilité & Renforcement", weeks:8, startDate:"2026-03-01", exercises:[
    {id:"e1",name:"Hip 90/90",sets:"3",reps:"45s",load:"",note:"Chaque côté",libId:"hip90"},
    {id:"e2",name:"Back Squat",sets:"4",reps:"6",load:"100",note:"",libId:"back_squat"},
  ]}],
  goals:[
    {id:"g1",label:"Descendre à 90 kg",done:false,deadline:"2026-06-01"},
    {id:"g2",label:"Masse grasse < 13%",done:false,deadline:"2026-07-01"},
    {id:"g3",label:"30 min course genou ✓",done:true,deadline:"2026-03-01"},
  ]
}];
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: #000; color: #e8edf5; font-family: 'Barlow', sans-serif; }
  ::-webkit-scrollbar { width: 4px; background: #000; }
  ::-webkit-scrollbar-thumb { background: #0f2040; border-radius: 4px; }
  input, textarea, select { color-scheme: dark; }
  input::placeholder, textarea::placeholder { color: #3d5278; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .fu { animation: fadeUp .28s ease both; }
  .ch { transition: border-color .2s, transform .18s, box-shadow .2s; }
  .ch:hover { border-color: #1a3a6e !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,.5); }
  button:active { transform: scale(.97); }
`;

const Avatar = ({ name, size=44 }) => {
  const initials=name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const hue=name.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%60+200;
  return <div style={{ width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,hsl(${hue},70%,14%),hsl(${hue},70%,26%))`,border:`2px solid hsl(${hue},65%,34%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:size*.36,color:`hsl(${hue},80%,72%)`,flexShrink:0 }}>{initials}</div>;
};

const Badge = ({ label, color }) => <span style={{ padding:"2px 9px",borderRadius:20,background:color+"18",color,border:`1px solid ${color}35`,fontSize:10,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0 }}>{label}</span>;

const Bar = ({ value, color, h=5 }) => (
  <div style={{ background:"#0f2040",borderRadius:99,height:h,overflow:"hidden" }}>
    <div style={{ height:"100%",borderRadius:99,background:color||"#1a6fff",width:`${Math.min(100,Math.max(0,value))}%`,transition:"width .7s",boxShadow:`0 0 8px ${color||"#1a6fff"}55` }}/>
  </div>
);

const Field = ({ label, value, onChange, type="text", placeholder, half, third }) => {
  let width="100%"; if(half)width="calc(50% - 4px)"; if(third)width="calc(33% - 4px)";
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:4,width,flexShrink:0 }}>
      {label&&<label style={{ fontSize:9,fontWeight:700,color:"#3d5278",letterSpacing:"0.12em",textTransform:"uppercase" }}>{label}</label>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        style={{ background:"#000",border:"1.5px solid #0f2040",borderRadius:8,padding:"9px 10px",color:"#e8edf5",fontSize:13,fontFamily:"'Barlow',sans-serif",outline:"none",width:"100%",colorScheme:"dark",boxSizing:"border-box" }}
        onFocus={e=>e.target.style.borderColor="#1a6fff"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
    </div>
  );
};

const Btn = ({ children, onClick, ghost, small, danger, color }) => (
  <button onClick={onClick} style={{ padding:small?"6px 14px":"10px 22px",borderRadius:8,cursor:"pointer",border:ghost?"1.5px solid #0f2040":danger?"1.5px solid #e6394644":"none",background:ghost?"transparent":danger?"#e6394618":color||"#1a6fff",color:ghost?"#7a90b8":danger?"#e63946":"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:small?11:14,letterSpacing:"0.06em",textTransform:"uppercase",transition:"all .15s" }}>{children}</button>
);

const SecTitle = ({ c }) => (
  <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
    <div style={{ width:3,height:16,borderRadius:99,background:"#1a6fff" }}/>
    <span style={{ fontSize:11,fontWeight:700,color:"#1a6fff",letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Barlow Condensed',sans-serif" }}>{c}</span>
  </div>
);

const SwipeToDelete = ({ children, onDelete }) => {
  const [startX,setStartX]=useState(null);
  const [offsetX,setOffsetX]=useState(0);
  const [revealed,setRevealed]=useState(false);
  const [confirming,setConfirming]=useState(false);
  function onTouchStart(e){setStartX(e.touches[0].clientX);}
  function onTouchMove(e){
    if(startX===null||confirming)return;
    const diff=e.touches[0].clientX-startX;
    if(diff<0)setOffsetX(Math.max(diff,-100));
    else if(revealed)setOffsetX(Math.min(diff-100,0));
  }
  function onTouchEnd(){setStartX(null);if(offsetX<-75){setOffsetX(-100);setRevealed(true);}else{setOffsetX(0);setRevealed(false);}}
  function handleDelete(){setConfirming(true);setTimeout(()=>{onDelete();setConfirming(false);setOffsetX(0);setRevealed(false);},300);}
  function handleCancel(){setOffsetX(0);setRevealed(false);}
  return (
    <div style={{ position:"relative",overflow:"hidden",borderRadius:14,marginBottom:10 }}>
      <div style={{ position:"absolute",right:0,top:0,bottom:0,width:100,display:"flex",flexDirection:"column",borderRadius:"0 14px 14px 0",overflow:"hidden" }}>
        <button onClick={handleDelete} style={{ flex:1,background:"#e63946",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2 }}>
          <span style={{ fontSize:16 }}>🗑️</span><span style={{ color:"#fff",fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:"uppercase" }}>Supprimer</span>
        </button>
        <button onClick={handleCancel} style={{ flex:0.6,background:"#0f2040",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <span style={{ color:"#7a90b8",fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:"uppercase" }}>Annuler</span>
        </button>
      </div>
      <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ transform:`translateX(${confirming?-120:offsetX}px)`,transition:startX?'none':'transform .3s ease',position:"relative",zIndex:1 }}>
        {children}
      </div>
    </div>
  );
};

const StatusDot = ({ status }) => {
  const color=status==="live"?"#22c55e":status==="connecting"?"#f59e0b":"#3d5278";
  return (
    <div style={{ display:"flex",alignItems:"center",gap:6,padding:"5px 14px",background:"#04080f",borderBottom:"1px solid #0f2040" }}>
      <div style={{ width:6,height:6,borderRadius:"50%",background:color,boxShadow:status==="live"?`0 0 6px ${color}`:"none" }}/>
      <span style={{ fontSize:10,color:"#3d5278" }}>{status==="live"?"Sync temps réel active":status==="connecting"?"Connexion Firebase...":"Mode local"}</span>
    </div>
  );
};

const RPESelector = ({ value, onChange }) => (
  <div style={{ width:"100%" }}>
    <label style={{ fontSize:9,fontWeight:700,color:"#3d5278",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:4 }}>RPE {value?`${value}/10 — ${rpeLabel(value)}`:""}</label>
    <div style={{ display:"flex",gap:3 }}>
      {[1,2,3,4,5,6,7,8,9,10].map(n=>(
        <button key={n} onClick={()=>onChange(value===String(n)?"":String(n))}
          style={{ flex:1,padding:"7px 0",borderRadius:6,border:`1px solid ${+value===n?rpeColor(n)+"88":"#0f2040"}`,background:+value===n?rpeColor(n)+"22":"transparent",color:+value===n?rpeColor(n):"#3d5278",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,cursor:"pointer",transition:"all .15s" }}>
          {n}
        </button>
      ))}
    </div>
  </div>
);

const ZoneSelector = ({ value, onChange }) => (
  <div style={{ width:"100%" }}>
    <label style={{ fontSize:9,fontWeight:700,color:"#3d5278",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:4 }}>Zone {value?`${value} — ${zoneLabel(value)}`:""}</label>
    <div style={{ display:"flex",gap:4 }}>
      {["1","2","3","4","5"].map(z=>(
        <button key={z} onClick={()=>onChange(value===z?"":z)}
          style={{ flex:1,padding:"8px 0",borderRadius:6,border:`1px solid ${value===z?zoneColor(z)+"88":"#0f2040"}`,background:value===z?zoneColor(z)+"22":"transparent",color:value===z?zoneColor(z):"#3d5278",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,cursor:"pointer",transition:"all .15s" }}>
          Z{z}
        </button>
      ))}
    </div>
  </div>
);

const CardioFields = ({ ex, onChange }) => {
  const type=ex.cardioType||"duration";
  return (
    <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
      <div style={{ display:"flex",gap:6,flexWrap:"wrap" }}>
        <Field label="Durée (min)" type="number" value={ex.duration||""} onChange={v=>onChange("duration",v)} placeholder="20" half/>
        {type==="run"&&<Field label="Vitesse km/h" type="number" value={ex.speed||""} onChange={v=>onChange("speed",v)} placeholder="12" half/>}
        {type==="watts"&&<Field label="Watts" type="number" value={ex.watts||""} onChange={v=>onChange("watts",v)} placeholder="200" half/>}
      </div>
      <ZoneSelector value={ex.zone||""} onChange={v=>onChange("zone",v)}/>
    </div>
  );
};

const ExerciseFields = ({ ex, onChange, onRemove, idx }) => {
  const libEx=LIBRARY.find(l=>l.id===ex.libId);
  const isCardio=libEx?.cat==="Cardio";
  const isWod=ex.isWodMovement;
  return (
    <div style={{ background:"#0a1628",borderRadius:10,padding:10,marginBottom:8,border:"1px solid #0f2040" }}>
      <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:8 }}>
        <div style={{ width:32,height:16,borderRadius:4,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.libId}/></div>
        <span style={{ flex:1,fontSize:13,fontWeight:700 }}>{ex.name}</span>
        {isWod&&<Badge label={`× ${ex.reps}`} color="#f97316"/>}
        {libEx&&<Badge label={libEx.cat} color={CAT_COLOR[libEx.cat]||"#1a6fff"}/>}
        {onRemove&&<button onClick={onRemove} style={{ background:"none",border:"none",color:"#e63946",cursor:"pointer",fontSize:16,padding:0,flexShrink:0 }}>✕</button>}
      </div>
      {!isWod&&(isCardio?(
        <CardioFields ex={ex} onChange={(field,val)=>onChange(idx,field,val)}/>
      ):(
        <div>
          <div style={{ display:"flex",gap:6,flexWrap:"wrap",marginBottom:8 }}>
            <Field label="Séries" type="number" value={ex.sets||""} onChange={v=>onChange(idx,"sets",v)} placeholder="3" third/>
            <Field label="Reps" type="number" value={ex.reps||""} onChange={v=>onChange(idx,"reps",v)} placeholder="10" third/>
            <Field label="Charge kg" type="number" value={ex.load||""} onChange={v=>onChange(idx,"load",v)} placeholder="0" third/>
            <Field label="Repos sec" type="number" value={ex.rest||""} onChange={v=>onChange(idx,"rest",v)} placeholder="60" half/>
            <Field label="Note" value={ex.note||""} onChange={v=>onChange(idx,"note",v)} placeholder="Remarque..." half/>
          </div>
          <RPESelector value={ex.rpe||""} onChange={v=>onChange(idx,"rpe",v)}/>
        </div>
      ))}
    </div>
  );
};

// ── SESSION LIVE MODE ─────────────────────────────────────────────────────────
const SessionLiveMode = ({ plan, allTemplates, allWods, onSave, onClose }) => {
  const fmt=plan.type==="wod"?WOD_FORMATS.find(f=>f.id===plan.wodFormat):null;
  const [exercises,setExercises]=useState(
    (plan.exercises||[]).map(ex=>({...ex,load:ex.load||"",reps:ex.reps||"",sets:ex.sets||"",rpe:"",note:ex.note||"",duration:ex.duration||"",speed:ex.speed||"",watts:ex.watts||"",zone:ex.zone||""}))
  );
  const [duration,setDuration]=useState("");
  const [sessionNote,setSessionNote]=useState(plan.note||"");
  const [wodScore,setWodScore]=useState("");
  const [startTime]=useState(Date.now());
  function updateEx(idx,field,val){setExercises(p=>p.map((ex,i)=>i===idx?{...ex,[field]:val}:ex));}
  function handleSave(){
    const sess={
      id:"s"+Date.now(), date:plan.date, present:true,
      duration:+duration||Math.round((Date.now()-startTime)/60000),
      note:sessionNote, templateId:plan.templateId,
      isWod:plan.type==="wod",
      ...(plan.type==="wod"?{wodFormat:plan.wodFormat,wodDuration:plan.duration,wodScore,wodName:plan.name,wodColor:plan.color}:{}),
      exercises,
    };
    onSave(sess);
  }
  const color=plan.color||"#1a6fff";
  return (
    <div style={{ position:"fixed",inset:0,background:"#000",zIndex:200,overflowY:"auto",paddingBottom:40 }}>
      <div style={{ background:`linear-gradient(135deg,${color}22,#000)`,padding:"16px 16px 14px",borderBottom:`1px solid ${color}44`,position:"sticky",top:0,zIndex:10,backdropFilter:"blur(10px)" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
          <button onClick={onClose} style={{ background:"none",border:"none",color:"#7a90b8",cursor:"pointer",fontSize:12,fontFamily:"'Barlow',sans-serif",padding:0 }}>✕ Fermer</button>
          <div style={{ display:"flex",gap:6,alignItems:"center" }}>
            <div style={{ width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e" }}/>
            <span style={{ fontSize:10,color:"#22c55e",fontWeight:700,letterSpacing:"0.1em" }}>EN COURS</span>
          </div>
        </div>
        <div style={{ fontSize:26,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",color,marginBottom:2 }}>
          {plan.type==="wod"?"🏋️ ":""}{plan.name}
        </div>
        <div style={{ fontSize:12,color:"#7a90b8" }}>
         {plan.date} · {plan.type==="wod"?(fmt?`${fmt.icon} ${fmt.name}${plan.duration?` — ${plan.duration} min`:""}`:""):`${exercises.length} exercices`}
        </div>
        {plan.note&&<div style={{ fontSize:11,color:"#3d5278",marginTop:4,fontStyle:"italic" }}>📝 {plan.note}</div>}
      </div>
      <div style={{ padding:"16px" }}>
        {plan.type==="wod"&&(
          <div style={{ background:color+"11",border:`1px solid ${color}33`,borderRadius:14,padding:14,marginBottom:16 }}>
            <div style={{ fontSize:12,fontWeight:700,color,marginBottom:8 }}>{fmt?.icon} {fmt?.name} {plan.duration?`— ${plan.duration} min`:""}</div>
            {exercises.map((ex,i)=>(
              <div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:i<exercises.length-1?"1px solid #0f204044":"none" }}>
                <span style={{ color,fontSize:11 }}>•</span>
                <span style={{ flex:1,fontSize:12,fontWeight:600 }}>{ex.name}</span>
                <span style={{ fontSize:11,color,fontWeight:700 }}>× {ex.reps}</span>
              </div>
            ))}
            <div style={{ marginTop:12 }}>
              <Field label="Score final" value={wodScore} onChange={setWodScore} placeholder={["amrap","emom","timecap"].includes(plan.wodFormat)?"ex. 18 rounds + 5 reps":"ex. 12:34"}/>
            </div>
          </div>
        )}
        {plan.type!=="wod"&&(
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:11,fontWeight:700,color:"#1a6fff",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
              <div style={{ width:3,height:16,borderRadius:99,background:"#1a6fff" }}/>EXERCICES
            </div>
            {exercises.map((ex,i)=>(
              <ExerciseFields key={i} ex={ex} idx={i} onChange={(idx,field,val)=>updateEx(idx,field,val)}/>
            ))}
          </div>
        )}
        <div style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14,marginBottom:16 }}>
          <SecTitle c="Infos de la séance"/>
          <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
            <Field label="Durée (min)" type="number" value={duration} onChange={setDuration} placeholder={`~${Math.round((Date.now()-startTime)/60000)+1} min`} half/>
            <Field label="Note" value={sessionNote} onChange={setSessionNote} placeholder="Observations..." half/>
          </div>
        </div>
        <button onClick={handleSave} style={{ width:"100%",background:`linear-gradient(135deg,${color},${color}88)`,border:"none",borderRadius:14,padding:"16px",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",boxShadow:`0 4px 24px ${color}44` }}>
          ✅ TERMINER & ENREGISTRER
        </button>
      </div>
    </div>
  );
};

// ── NEXT SESSION WIDGET ───────────────────────────────────────────────────────
const NextSessionWidget = ({ client, allTemplates, allWods, onStartSession }) => {
  const [expanded,setExpanded]=useState(null);
  const today=todayStr();
  const weekDates=getWeekDates();
  const weekPlanned=client.planned.filter(p=>weekDates.includes(p.date)&&p.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
  if(!weekPlanned.length)return(
    <div style={{ background:"#070d1a",border:"1px dashed #0f2040",borderRadius:14,padding:14,marginBottom:14 }}>
      <div style={{ display:"flex",alignItems:"center",gap:10 }}>
        <span style={{ fontSize:20 }}>📅</span>
        <div>
          <div style={{ fontSize:13,fontWeight:700,color:"#3d5278" }}>Aucune séance cette semaine</div>
          <div style={{ fontSize:11,color:"#3d5278" }}>Va dans Planning pour en planifier une</div>
        </div>
      </div>
    </div>
  );
  return(
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:11,fontWeight:700,color:"#1a6fff",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:8 }}>
        <div style={{ width:3,height:16,borderRadius:99,background:"#1a6fff" }}/>CETTE SEMAINE
      </div>
      {weekPlanned.map((plan,i)=>{
        const color=plan.color||"#1a6fff";
        const isOpen=expanded===plan.id;
        const[y,m,d]=plan.date.split("-");
        const date=new Date(+y,+m-1,+d);
        const dayName=DAY_FULL[date.getDay()];
        const isToday=plan.date===today;
        return(
          <div key={plan.id} className="fu" style={{ animationDelay:`${i*.06}s` }}>
            <div onClick={()=>setExpanded(isOpen?null:plan.id)}
              style={{ background:isToday?color+"18":"#070d1a",border:`1px solid ${isToday?color:color+"55"}`,borderRadius:isOpen?"14px 14px 0 0":14,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .2s" }}>
              <div style={{ width:4,minHeight:40,borderRadius:99,background:color,flexShrink:0 }}/>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:2 }}>
                  <div style={{ fontWeight:900,fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",color }}>{isToday?"AUJOURD'HUI":dayName.toUpperCase()}</div>
                  {isToday&&<div style={{ width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e" }}/>}
                </div>
                <div style={{ fontSize:12,fontWeight:700,color:"#e8edf5" }}>{plan.type==="wod"?"🏋️ ":""}{plan.name}</div>
                <div style={{ fontSize:10,color:"#3d5278" }}>{plan.date} · {plan.type==="wod"?"WOD":`${(plan.exercises||[]).length} exercices`}</div>
              </div>
              <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6 }}>
                <Badge label={plan.type==="wod"?"WOD":"Séance"} color={color}/>
                <span style={{ fontSize:16,color }}>{isOpen?"▲":"▼"}</span>
              </div>
            </div>
            {isOpen&&(
              <div style={{ background:"#04080f",border:`1px solid ${color}44`,borderTop:"none",borderRadius:"0 0 14px 14px",padding:14 }}>
                {(plan.exercises||[]).slice(0,4).map((ex,j)=>{
                  const isWodMov=ex.isWodMovement;
                  return(
                    <div key={j} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:j<Math.min((plan.exercises||[]).length,4)-1?"1px solid #0f204044":"none" }}>
                      <div style={{ width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.libId}/></div>
                      <span style={{ flex:1,fontSize:12,fontWeight:600 }}>{ex.name}</span>
                      <div style={{ display:"flex",gap:4 }}>
                        {isWodMov?<Badge label={`× ${ex.reps}`} color={color}/>:<>
                          {ex.sets&&ex.reps&&<Badge label={`${ex.sets}×${ex.reps}`} color={color}/>}
                          {ex.load&&+ex.load>0&&<Badge label={`${ex.load}kg`} color="#f59e0b"/>}
                        </>}
                      </div>
                    </div>
                  );
                })}
                {(plan.exercises||[]).length>4&&<div style={{ fontSize:11,color:"#3d5278",marginTop:6,textAlign:"center" }}>+ {(plan.exercises||[]).length-4} exercices...</div>}
                {plan.note&&<div style={{ fontSize:11,color:"#3d5278",marginTop:8,fontStyle:"italic" }}>📝 {plan.note}</div>}
                <div style={{ marginTop:12 }}>
                  <button onClick={()=>onStartSession(plan)}
                    style={{ width:"100%",background:`linear-gradient(135deg,${color},${color}88)`,border:"none",borderRadius:10,padding:"12px",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",boxShadow:`0 4px 16px ${color}44` }}>
                    ▶ DÉMARRER LA SÉANCE
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

const SessionExercisePicker = ({ onAdd, onClose }) => {
  const [mode,setMode]=useState("cat");
  const [selCat,setSelCat]=useState("Push");
  const [selMuscle,setSelMuscle]=useState("Pectoraux");
  const [search,setSearch]=useState("");
  const [selected,setSelected]=useState([]);
  const filtered=LIBRARY.filter(ex=>{
    if(search)return ex.name.toLowerCase().includes(search.toLowerCase())||ex.muscles.toLowerCase().includes(search.toLowerCase());
    if(mode==="cat")return ex.cat===selCat;
    if(mode==="muscle")return(MUSCLE_GROUPS[selMuscle]||[]).includes(ex.id);
    return true;
  });
  function toggleEx(ex){setSelected(prev=>prev.find(e=>e.id===ex.id)?prev.filter(e=>e.id!==ex.id):[...prev,ex]);}
  function confirm(){onAdd(selected);onClose();}
  return(
    <div style={{ background:"#0a1628",border:"1px solid #0f2040",borderRadius:12,padding:12,marginBottom:10 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
        <span style={{ fontSize:11,fontWeight:700,color:"#1a6fff",textTransform:"uppercase",letterSpacing:"0.08em" }}>Choisir des exercices</span>
        <Btn small ghost onClick={onClose}>✕</Btn>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..."
        style={{ width:"100%",background:"#000",border:"1.5px solid #0f2040",borderRadius:8,padding:"7px 10px",color:"#e8edf5",fontSize:12,fontFamily:"'Barlow',sans-serif",outline:"none",marginBottom:8,colorScheme:"dark",boxSizing:"border-box" }}
        onFocus={e=>e.target.style.borderColor="#1a6fff"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
      {!search&&(<>
        <div style={{ display:"flex",gap:5,marginBottom:8 }}>
          {["cat","muscle"].map(m=>(
            <button key={m} onClick={()=>setMode(m)} style={{ padding:"4px 12px",borderRadius:99,border:`1px solid ${mode===m?(m==="cat"?"#1a6fff":"#22c55e"):"#0f2040"}`,background:mode===m?(m==="cat"?"#1a6fff22":"#22c55e22"):"transparent",color:mode===m?(m==="cat"?"#1a6fff":"#22c55e"):"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer" }}>{m==="cat"?"Type":"Muscle"}</button>
          ))}
        </div>
        {mode==="cat"&&(
          <div style={{ display:"flex",gap:4,marginBottom:8,overflowX:"auto",paddingBottom:4 }}>
            {CATS.filter(c=>c!=="Tous").map(cat=>(
              <button key={cat} onClick={()=>setSelCat(cat)} style={{ padding:"3px 10px",borderRadius:99,border:`1px solid ${selCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#0f2040"}`,background:selCat===cat?(CAT_COLOR[cat]||"#1a6fff")+"22":"transparent",color:selCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer",flexShrink:0 }}>{cat}</button>
            ))}
          </div>
        )}
        {mode==="muscle"&&(
          <div style={{ display:"flex",gap:4,marginBottom:8,overflowX:"auto",paddingBottom:4 }}>
            {Object.keys(MUSCLE_GROUPS).map(mg=>(
              <button key={mg} onClick={()=>setSelMuscle(mg)} style={{ padding:"3px 10px",borderRadius:99,border:`1px solid ${selMuscle===mg?"#22c55e":"#0f2040"}`,background:selMuscle===mg?"#22c55e22":"transparent",color:selMuscle===mg?"#22c55e":"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:9,textTransform:"uppercase",cursor:"pointer",flexShrink:0 }}>{mg}</button>
            ))}
          </div>
        )}
      </>)}
      <div style={{ maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:5,marginBottom:10 }}>
        {filtered.map(ex=>{
          const isSel=selected.find(e=>e.id===ex.id);
          return(
            <div key={ex.id} onClick={()=>toggleEx(ex)}
              style={{ display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:`1px solid ${isSel?"#1a6fff44":"#0f2040"}`,background:isSel?"#1a6fff0a":"transparent",cursor:"pointer" }}>
              <div style={{ width:32,height:16,borderRadius:4,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.id}/></div>
              <div style={{ flex:1,minWidth:0 }}>
                <div style={{ fontWeight:700,fontSize:12,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{ex.name}</div>
                <div style={{ fontSize:9,color:"#3d5278" }}>{ex.muscles}</div>
              </div>
              <Badge label={ex.cat} color={CAT_COLOR[ex.cat]||"#1a6fff"}/>
              <div style={{ width:18,height:18,borderRadius:5,border:`2px solid ${isSel?"#1a6fff":"#0f2040"}`,background:isSel?"#1a6fff":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10,color:"#fff",fontWeight:900 }}>{isSel?"✓":""}</div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{ textAlign:"center",color:"#3d5278",padding:16,fontSize:11 }}>Aucun exercice trouvé</div>}
      </div>
      {selected.length>0&&<Btn small onClick={confirm}>✅ Ajouter {selected.length} exercice{selected.length>1?"s":""}</Btn>}
    </div>
  );
};

const TemplatePicker = ({ onSelect, onClose, allTemplates, allWods }) => {
  const [pickerTab,setPickerTab]=useState("templates");
  const [selCat,setSelCat]=useState("Tous");
  const cats=[...new Set(allTemplates.map(t=>t.cat))];
  const filtered=selCat==="Tous"?allTemplates:allTemplates.filter(t=>t.cat===selCat);
  const wodCategories=["Tous",...new Set(allWods.map(w=>w.category))];
  const [wodCat,setWodCat]=useState("Tous");
  const filteredWods=wodCat==="Tous"?allWods:allWods.filter(w=>w.category===wodCat);
  return(
    <div style={{ background:"#0a1628",border:"1px solid #0f2040",borderRadius:14,padding:14,marginBottom:12 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
        <span style={{ fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:"#e8edf5",textTransform:"uppercase" }}>Choisir un template</span>
        <Btn small ghost onClick={onClose}>✕</Btn>
      </div>
      <div style={{ display:"flex",gap:2,background:"#070d1a",borderRadius:8,padding:3,marginBottom:12 }}>
        {[{id:"templates",label:"📋 Templates"},{id:"wods",label:"🏋️ WODs"}].map(t=>(
          <button key={t.id} onClick={()=>setPickerTab(t.id)} style={{ flex:1,padding:"7px 4px",borderRadius:6,border:"none",cursor:"pointer",background:pickerTab===t.id?"#112240":"transparent",color:pickerTab===t.id?"#e8edf5":"#3d5278",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",borderBottom:pickerTab===t.id?"2px solid #1a6fff":"2px solid transparent" }}>{t.label}</button>
        ))}
      </div>
      {pickerTab==="templates"&&(<>
        <div style={{ display:"flex",gap:5,marginBottom:10,overflowX:"auto",paddingBottom:4 }}>
          {["Tous",...cats].map(cat=>(
            <button key={cat} onClick={()=>setSelCat(cat)} style={{ padding:"4px 12px",borderRadius:99,border:`1px solid ${selCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#0f2040"}`,background:selCat===cat?(CAT_COLOR[cat]||"#1a6fff")+"22":"transparent",color:selCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer",flexShrink:0 }}>{cat}</button>
          ))}
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:8,maxHeight:260,overflowY:"auto" }}>
          {filtered.map(tpl=>(
            <div key={tpl.id} onClick={()=>onSelect(tpl)}
              style={{ background:"#070d1a",border:`1px solid ${tpl.color||"#0f2040"}33`,borderRadius:12,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:4,height:40,borderRadius:99,background:tpl.color||"#1a6fff",flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif" }}>{tpl.name}</div>
                <div style={{ fontSize:11,color:"#3d5278",marginTop:2 }}>{tpl.exercises?.length} exercices</div>
              </div>
              <span style={{ fontSize:18,color:tpl.color||"#1a6fff" }}>→</span>
            </div>
          ))}
        </div>
      </>)}
      {pickerTab==="wods"&&(<>
        <div style={{ display:"flex",gap:5,marginBottom:10,overflowX:"auto",paddingBottom:4 }}>
          {wodCategories.map(cat=>(
            <button key={cat} onClick={()=>setWodCat(cat)} style={{ padding:"4px 12px",borderRadius:99,border:`1px solid ${wodCat===cat?"#e63946":"#0f2040"}`,background:wodCat===cat?"#e6394622":"transparent",color:wodCat===cat?"#e63946":"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer",flexShrink:0 }}>{cat}</button>
          ))}
        </div>
        <div style={{ maxHeight:300,overflowY:"auto",display:"flex",flexDirection:"column",gap:8 }}>
          {filteredWods.map(wod=>(
            <div key={wod.id} onClick={()=>onSelect(wod)}
              style={{ background:"#070d1a",border:`1px solid ${wod.color||"#e63946"}33`,borderRadius:12,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12 }}>
              <div style={{ width:4,height:40,borderRadius:99,background:wod.color||"#e63946",flexShrink:0 }}/>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",color:wod.color||"#e63946" }}>{wod.name}</div>
                <div style={{ fontSize:11,color:"#3d5278" }}>{wod.description}</div>
              </div>
              <span style={{ fontSize:18,color:wod.color||"#e63946" }}>→</span>
            </div>
          ))}
        </div>
      </>)}
    </div>
  );
};

const WodCreator = ({ onSave, onClose }) => {
  const [format,setFormat]=useState("amrap");
  const [name,setName]=useState("");
  const [duration,setDuration]=useState("20");
  const [rounds,setRounds]=useState("3");
  const [timecap,setTimecap]=useState("20");
  const [minutes,setMinutes]=useState("20");
  const [score,setScore]=useState("");
  const [movements,setMovements]=useState([]);
  const [search,setSearch]=useState("");
  const [showSearch,setShowSearch]=useState(false);
  const [selCat,setSelCat]=useState("Functional");
  const fmt=WOD_FORMATS.find(f=>f.id===format);
  function addMovement(ex){setMovements(p=>[...p,{name:ex.name,reps:"",libId:ex.id}]);setSearch("");setShowSearch(false);}
  function saveWod(){
    if(!movements.length)return;
    onSave({id:"wod_custom_"+Date.now(),name:name||fmt?.name||"WOD Custom",type:"wod",format,color:fmt?.color||"#e63946",description:fmt?.desc||"",category:"Mes WODs",movements,scoreType:["amrap","emom","timecap"].includes(format)?"rounds":"time",duration:+duration,rounds:+rounds,timecap:+timecap,minutes:+minutes,score});
  }
  const filtered=LIBRARY.filter(ex=>search?ex.name.toLowerCase().includes(search.toLowerCase()):ex.cat===selCat);
  return(
    <div style={{ background:"#070d1a",border:"1px solid #f9741644",borderRadius:14,padding:14,marginBottom:14 }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
        <div style={{ fontSize:16,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",color:"#f97316" }}>🏋️ CRÉER UN WOD</div>
        <Btn small ghost onClick={onClose}>✕</Btn>
      </div>
      <Field label="Nom du WOD" value={name} onChange={setName} placeholder="ex. Mon WOD du vendredi..."/>
      <div style={{ height:10 }}/>
      <label style={{ fontSize:9,fontWeight:700,color:"#3d5278",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:8 }}>Format</label>
      <div style={{ display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4 }}>
        {WOD_FORMATS.map(f=>(
          <button key={f.id} onClick={()=>setFormat(f.id)} style={{ padding:"8px 12px",borderRadius:10,border:`1px solid ${format===f.id?f.color:"#0f2040"}`,background:format===f.id?f.color+"22":"transparent",color:format===f.id?f.color:"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:2 }}>
            <span style={{ fontSize:16 }}>{f.icon}</span><span>{f.name}</span>
          </button>
        ))}
      </div>
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14 }}>
        {(format==="amrap"||format==="timecap")&&<Field label="Durée (min)" type="number" value={duration} onChange={setDuration} placeholder="20" half/>}
        {format==="emom"&&<Field label="Durée totale (min)" type="number" value={minutes} onChange={setMinutes} placeholder="20" half/>}
        {(format==="fortime"||format==="metcon")&&<><Field label="Rounds" type="number" value={rounds} onChange={setRounds} placeholder="3" half/><Field label="Timecap (min)" type="number" value={timecap} onChange={setTimecap} placeholder="20" half/></>}
        <Field label="Score" value={score} onChange={setScore} placeholder="ex. 18 rounds" half/>
      </div>
      <label style={{ fontSize:9,fontWeight:700,color:"#3d5278",letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:8 }}>Mouvements</label>
      {movements.map((mv,i)=>(
        <div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#0a1628",borderRadius:8,marginBottom:6,border:"1px solid #0f2040" }}>
          <div style={{ width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={mv.libId}/></div>
          <span style={{ flex:1,fontSize:12,fontWeight:700 }}>{mv.name}</span>
          <input type="text" value={mv.reps} onChange={e=>setMovements(p=>p.map((x,j)=>j===i?{...x,reps:e.target.value}:x))} placeholder="Reps" style={{ width:70,background:"#000",border:"1px solid #0f2040",borderRadius:6,padding:"4px 8px",color:"#e8edf5",fontSize:12,colorScheme:"dark",textAlign:"center" }}/>
          <button onClick={()=>setMovements(p=>p.filter((_,j)=>j!==i))} style={{ background:"none",border:"none",color:"#e63946",cursor:"pointer",fontSize:14,padding:0 }}>✕</button>
        </div>
      ))}
      <button onClick={()=>setShowSearch(!showSearch)} style={{ width:"100%",background:"#0a1628",border:"1px solid #f9741644",borderRadius:8,padding:"8px 14px",color:"#f97316",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:showSearch?10:14 }}>+ Ajouter un mouvement</button>
      {showSearch&&(
        <div style={{ background:"#000",borderRadius:10,padding:10,marginBottom:14,border:"1px solid #0f2040" }}>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..."
            style={{ width:"100%",background:"#070d1a",border:"1.5px solid #0f2040",borderRadius:8,padding:"7px 10px",color:"#e8edf5",fontSize:12,fontFamily:"'Barlow',sans-serif",outline:"none",marginBottom:8,colorScheme:"dark",boxSizing:"border-box" }}
            onFocus={e=>e.target.style.borderColor="#f97316"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
          {!search&&(
            <div style={{ display:"flex",gap:4,marginBottom:8,overflowX:"auto",paddingBottom:4 }}>
              {CATS.filter(c=>c!=="Tous").map(cat=>(
                <button key={cat} onClick={()=>setSelCat(cat)} style={{ padding:"3px 8px",borderRadius:99,border:`1px solid ${selCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#0f2040"}`,background:selCat===cat?(CAT_COLOR[cat]||"#1a6fff")+"22":"transparent",color:selCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:9,textTransform:"uppercase",cursor:"pointer",flexShrink:0 }}>{cat}</button>
              ))}
            </div>
          )}
          <div style={{ maxHeight:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:4 }}>
            {filtered.map(ex=>(
              <div key={ex.id} onClick={()=>addMovement(ex)} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:8,border:"1px solid #0f2040",cursor:"pointer" }}>
                <div style={{ width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.id}/></div>
                <span style={{ flex:1,fontSize:11,fontWeight:600 }}>{ex.name}</span>
                <Badge label={ex.cat} color={CAT_COLOR[ex.cat]||"#1a6fff"}/>
              </div>
            ))}
          </div>
        </div>
      )}
      {movements.length>0&&<div style={{ display:"flex",gap:8 }}><Btn onClick={saveWod} color={fmt?.color||"#f97316"}>💾 Sauvegarder</Btn><Btn ghost small onClick={onClose}>Annuler</Btn></div>}
    </div>
  );
};

const CalendarTab = ({ client, allTemplates, allWods, onUpdate, onSaveWod }) => {
  const today=todayStr();
  const [calYear,setCalYear]=useState(new Date().getFullYear());
  const [calMonth,setCalMonth]=useState(new Date().getMonth());
  const [dayModal,setDayModal]=useState(null);
  const [planMode,setPlanMode]=useState("choose");
  const [selTemplate,setSelTemplate]=useState(null);
  const [selWod,setSelWod]=useState(null);
  const [planNote,setPlanNote]=useState("");
  const [planName,setPlanName]=useState("");
  const [wodTab,setWodTab]=useState("benchmarks");
  const [customExercises,setCustomExercises]=useState([]);
  const [showExPicker,setShowExPicker]=useState(false);
  const planned=client.planned||[];
  const sessions=client.sessions||[];
  const firstDay=new Date(calYear,calMonth,1);
  const lastDay=new Date(calYear,calMonth+1,0);
  const startDow=(firstDay.getDay()+6)%7;
  const daysInMonth=lastDay.getDate();
  const formatDate=(y,m,d)=>`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const getDayInfo=(dateStr)=>({sess:sessions.find(s=>s.date===dateStr),plan:planned.find(p=>p.date===dateStr)});
  const getDayColor=(dateStr)=>{const{sess,plan}=getDayInfo(dateStr);if(sess){if(!sess.present)return"#e63946";if(sess.isWod)return"#f97316";return"#22c55e";}if(plan)return plan.type==="wod"?"#f9741666":"#1a6fff66";return null;};
  function openDay(dateStr){setDayModal({dateStr,...getDayInfo(dateStr)});setPlanMode("choose");setSelTemplate(null);setSelWod(null);setPlanNote("");setPlanName("");setCustomExercises([]);setShowExPicker(false);}
  function addCustomExercises(exs){setCustomExercises(p=>[...p,...exs.map(ex=>{const libEx=LIBRARY.find(l=>l.id===ex.id);const isCardio=libEx?.cat==="Cardio";return{id:"pe"+Date.now()+Math.random(),libId:ex.id,name:ex.name,cardioType:libEx?.cardioType||"",...(isCardio?{duration:"",speed:"",watts:"",zone:""}:{sets:"3",reps:"10",load:"",rest:"60",rpe:"",note:""})};})]);setShowExPicker(false);}
  function updateCustomEx(idx,field,val){setCustomExercises(p=>p.map((ex,i)=>i===idx?{...ex,[field]:val}:ex));}
  function removeCustomEx(idx){setCustomExercises(p=>p.filter((_,i)=>i!==idx));}
  function savePlan(){
    let newPlan;
    if(planMode==="template"&&selTemplate){const exercises=applyTemplate(selTemplate,sessions);newPlan={id:"pl"+Date.now(),date:dayModal.dateStr,type:"template",templateId:selTemplate.id,name:selTemplate.name,color:selTemplate.color,note:planNote,exercises};}
    else if(planMode==="wod"&&selWod){const exercises=(selWod.movements||[]).map(mv=>({id:"pe"+Date.now()+Math.random(),libId:mv.libId||"",name:mv.name,reps:mv.reps,isWodMovement:true}));newPlan={id:"pl"+Date.now(),date:dayModal.dateStr,type:"wod",templateId:selWod.id,name:selWod.name,color:selWod.color,note:planNote,wodFormat:selWod.format,duration:selWod.duration,minutes:selWod.minutes,rounds:selWod.rounds,timecap:selWod.timecap,exercises};}
    else if(planMode==="custom"&&customExercises.length>0){newPlan={id:"pl"+Date.now(),date:dayModal.dateStr,type:"template",templateId:null,name:planName||"Séance sur mesure",color:"#1a6fff",note:planNote,exercises:customExercises};}
    else return;
    onUpdate({planned:[...planned.filter(p=>p.date!==dayModal.dateStr),newPlan]});
    setDayModal(null);
  }
  function removePlan(id){onUpdate({planned:planned.filter(p=>p.id!==id)});setDayModal(null);}
  const prevMonth=()=>{if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1);};
  const nextMonth=()=>{if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1);};
  const cells=[];for(let i=0;i<startDow;i++)cells.push(null);for(let d=1;d<=daysInMonth;d++)cells.push(d);
  return(
    <div className="fu">
      <div style={{ display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,padding:"10px 12px",background:"#070d1a",borderRadius:12,border:"1px solid #0f2040" }}>
        {[{color:"#22c55e",label:"Séance ✓"},{color:"#f97316",label:"WOD ✓"},{color:"#e63946",label:"Absence"},{color:"#1a6fff66",label:"Planifiée"},{color:"#f9741666",label:"WOD planifié"}].map(l=>(
          <div key={l.label} style={{ display:"flex",alignItems:"center",gap:5 }}>
            <div style={{ width:8,height:8,borderRadius:"50%",background:l.color,flexShrink:0 }}/>
            <span style={{ fontSize:10,color:"#7a90b8" }}>{l.label}</span>
          </div>
        ))}
      </div>
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14 }}>
        <button onClick={prevMonth} style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:8,padding:"8px 14px",color:"#7a90b8",cursor:"pointer",fontSize:16 }}>‹</button>
        <div style={{ fontWeight:900,fontSize:18,fontFamily:"'Barlow Condensed',sans-serif" }}>{MONTH_NAMES[String(calMonth+1).padStart(2,"0")]} {calYear}</div>
        <button onClick={nextMonth} style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:8,padding:"8px 14px",color:"#7a90b8",cursor:"pointer",fontSize:16 }}>›</button>
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4 }}>
        {DAY_NAMES.map(d=><div key={d} style={{ textAlign:"center",fontSize:9,fontWeight:700,color:"#3d5278",letterSpacing:"0.08em",textTransform:"uppercase",padding:"4px 0" }}>{d}</div>)}
      </div>
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:20 }}>
        {cells.map((d,i)=>{
          if(!d)return<div key={i}/>;
          const dateStr=formatDate(calYear,calMonth,d);
          const{sess,plan}=getDayInfo(dateStr);
          const dotColor=getDayColor(dateStr);
          const isToday=dateStr===today;
          const isFut=dateStr>today;
          const sTpl=sess?.templateId?[...allTemplates,...allWods].find(t=>t.id===sess.templateId):null;
          return(
            <div key={i} onClick={()=>openDay(dateStr)}
              style={{ background:isToday?"#112240":dotColor?"#070d1a":"#04080f",border:`1px solid ${isToday?"#1a6fff":dotColor?dotColor+"88":"#0f2040"}`,borderRadius:10,padding:"6px 4px",cursor:"pointer",minHeight:52,display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all .15s" }}>
              <div style={{ fontSize:12,fontWeight:isToday?900:600,color:isToday?"#1a6fff":isFut?"#7a90b8":"#e8edf5",fontFamily:"'Barlow Condensed',sans-serif" }}>{d}</div>
              {dotColor&&<div style={{ width:7,height:7,borderRadius:"50%",background:dotColor,boxShadow:`0 0 5px ${dotColor}` }}/>}
              {(sess||plan)&&(
                <div style={{ fontSize:7,color:dotColor||"#3d5278",fontWeight:700,textAlign:"center",lineHeight:1.2,maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",padding:"0 2px" }}>
                  {sess?(sess.isWod?"WOD":sTpl?.name?.split(" ").slice(0,2).join(" ")||"💪"):(plan.type==="wod"?"WOD":plan.name?.split(" ").slice(0,2).join(" ")||"📋")}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {planned.filter(p=>p.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).length>0&&(
        <div>
          <SecTitle c="📅 Prochaines séances planifiées"/>
          {planned.filter(p=>p.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).map(plan=>(
            <SwipeToDelete key={plan.id} onDelete={()=>removePlan(plan.id)}>
              <div style={{ background:"#070d1a",border:`1px solid ${plan.color||"#1a6fff"}44`,borderRadius:12,padding:"12px 14px" }}>
                <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                  <div style={{ width:4,height:36,borderRadius:99,background:plan.color||"#1a6fff",flexShrink:0 }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif" }}>{plan.date}</div>
                    <div style={{ fontSize:11,color:plan.color||"#1a6fff",fontWeight:700 }}>{plan.type==="wod"?"🏋️ ":""}{plan.name}</div>
                    {plan.note&&<div style={{ fontSize:11,color:"#3d5278",marginTop:2 }}>📝 {plan.note}</div>}
                  </div>
                  <Badge label={plan.type==="wod"?"WOD":"Séance"} color={plan.color||"#1a6fff"}/>
                </div>
              </div>
            </SwipeToDelete>
          ))}
        </div>
      )}
      {dayModal&&(
        <div style={{ position:"fixed",inset:0,background:"#000d",display:"flex",alignItems:"flex-end",zIndex:99 }} onClick={()=>setDayModal(null)}>
          <div onClick={e=>e.stopPropagation()} className="fu" style={{ background:"#0a1628",border:"1px solid #0f2040",borderRadius:"20px 20px 0 0",padding:"20px 18px 40px",width:"100%",maxHeight:"92vh",overflowY:"auto" }}>
            <div style={{ width:36,height:4,borderRadius:99,background:"#0f2040",margin:"0 auto 16px" }}/>
            <div style={{ fontSize:22,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:16 }}>
              {(()=>{const[y,m,d]=dayModal.dateStr.split("-");const date=new Date(+y,+m-1,+d);return`${DAY_FULL[date.getDay()]} ${+d} ${MONTH_NAMES[m]} ${y}`;})()}
            </div>
            {dayModal.sess&&(
              <div style={{ background:dayModal.sess.isWod?"#f9741611":"#22c55e11",border:`1px solid ${dayModal.sess.isWod?"#f9741644":"#22c55e44"}`,borderRadius:12,padding:12,marginBottom:12 }}>
                <div style={{ fontSize:12,fontWeight:700,color:dayModal.sess.isWod?"#f97316":"#22c55e",marginBottom:4 }}>{dayModal.sess.isWod?"🏋️ WOD effectué":"✅ Séance effectuée"}</div>
                {dayModal.sess.templateId&&<div style={{ fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif" }}>{[...allTemplates,...allWods].find(t=>t.id===dayModal.sess.templateId)?.name||"Séance libre"}</div>}
                {dayModal.sess.isWod&&dayModal.sess.wodScore&&<div style={{ fontSize:11,color:"#f97316",marginTop:4 }}>🏆 Score : {dayModal.sess.wodScore}</div>}
                <div style={{ marginTop:6 }}><Badge label={dayModal.sess.present?"Présent":"Absent"} color={dayModal.sess.present?"#22c55e":"#e63946"}/></div>
              </div>
            )}
            {dayModal.plan&&!dayModal.sess&&(
              <div style={{ background:"#1a6fff11",border:"1px solid #1a6fff44",borderRadius:12,padding:12,marginBottom:12 }}>
                <div style={{ fontSize:12,fontWeight:700,color:"#1a6fff",marginBottom:4 }}>📋 Déjà planifié</div>
                <div style={{ fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif" }}>{dayModal.plan.name}</div>
                {dayModal.plan.note&&<div style={{ fontSize:11,color:"#7a90b8",marginTop:4 }}>📝 {dayModal.plan.note}</div>}
                <div style={{ display:"flex",gap:8,marginTop:10 }}><Btn small danger onClick={()=>removePlan(dayModal.plan.id)}>🗑️ Supprimer</Btn></div>
              </div>
            )}
            {!dayModal.sess&&(
              <>
                {planMode==="choose"&&(
                  <div style={{ display:"flex",flexDirection:"column",gap:8 }}>
                    <div style={{ fontSize:12,color:"#7a90b8",marginBottom:4 }}>Que veux-tu planifier ?</div>
                    {[
                      {mode:"template",icon:"📋",label:"Depuis un template",sub:"Push Day, Back Day, Leg Day...",color:"#1a6fff"},
                      {mode:"wod",icon:"🏋️",label:"Un WOD",sub:"Benchmarks ou WOD custom",color:"#f97316"},
                      {mode:"custom",icon:"💪",label:"Séance sur mesure",sub:"Choisir les exercices librement",color:"#22c55e"},
                    ].map(opt=>(
                      <button key={opt.mode} onClick={()=>setPlanMode(opt.mode)}
                        style={{ background:opt.color+"11",border:`1px solid ${opt.color}44`,borderRadius:12,padding:"14px 16px",color:opt.color,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,textTransform:"uppercase",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12 }}>
                        <span style={{ fontSize:24 }}>{opt.icon}</span>
                        <div><div>{opt.label}</div><div style={{ fontSize:10,fontWeight:400,color:opt.color+"88",textTransform:"none",marginTop:2 }}>{opt.sub}</div></div>
                        <span style={{ marginLeft:"auto",fontSize:18 }}>→</span>
                      </button>
                    ))}
                  </div>
                )}
                {planMode==="template"&&(
                  <div>
                    <button onClick={()=>setPlanMode("choose")} style={{ background:"none",border:"none",color:"#3d5278",cursor:"pointer",fontSize:11,fontFamily:"'Barlow',sans-serif",padding:0,marginBottom:12 }}>← Retour</button>
                    <div style={{ display:"flex",flexDirection:"column",gap:6,maxHeight:220,overflowY:"auto",marginBottom:12 }}>
                      {allTemplates.map(tpl=>(
                        <div key={tpl.id} onClick={()=>setSelTemplate(selTemplate?.id===tpl.id?null:tpl)}
                          style={{ background:selTemplate?.id===tpl.id?tpl.color+"22":"#070d1a",border:`1px solid ${selTemplate?.id===tpl.id?tpl.color:"#0f2040"}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:10 }}>
                          <div style={{ width:4,height:32,borderRadius:99,background:tpl.color,flexShrink:0 }}/>
                          <div style={{ flex:1 }}><div style={{ fontWeight:800,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif" }}>{tpl.name}</div><div style={{ fontSize:10,color:"#3d5278" }}>{tpl.exercises?.length} exercices</div></div>
                          {selTemplate?.id===tpl.id&&<span style={{ color:tpl.color,fontSize:16 }}>✓</span>}
                        </div>
                      ))}
                    </div>
                    <Field label="Note (optionnel)" value={planNote} onChange={setPlanNote} placeholder="ex. Apporter sa ceinture..."/>
                    <div style={{ marginTop:12,display:"flex",gap:8 }}><Btn onClick={savePlan} color="#1a6fff">📋 Planifier</Btn><Btn ghost small onClick={()=>setDayModal(null)}>Annuler</Btn></div>
                  </div>
                )}
                {planMode==="wod"&&(
                  <div>
                    <button onClick={()=>setPlanMode("choose")} style={{ background:"none",border:"none",color:"#3d5278",cursor:"pointer",fontSize:11,fontFamily:"'Barlow',sans-serif",padding:0,marginBottom:12 }}>← Retour</button>
                    <div style={{ display:"flex",gap:2,background:"#070d1a",borderRadius:8,padding:3,marginBottom:12 }}>
                      {[{id:"benchmarks",label:"Benchmarks"},{id:"custom",label:"Mes WODs"},{id:"create",label:"✏️ Créer"}].map(t=>(
                        <button key={t.id} onClick={()=>setWodTab(t.id)} style={{ flex:1,padding:"6px 4px",borderRadius:6,border:"none",cursor:"pointer",background:wodTab===t.id?"#112240":"transparent",color:wodTab===t.id?"#f97316":"#3d5278",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",borderBottom:wodTab===t.id?"2px solid #f97316":"2px solid transparent" }}>{t.label}</button>
                      ))}
                    </div>
                    {(wodTab==="benchmarks"||wodTab==="custom")&&(<>
                      <div style={{ display:"flex",flexDirection:"column",gap:6,maxHeight:220,overflowY:"auto",marginBottom:12 }}>
                        {(wodTab==="benchmarks"?WOD_BENCHMARKS:allWods.filter(w=>w.category==="Mes WODs")).map(wod=>(
                          <div key={wod.id} onClick={()=>setSelWod(selWod?.id===wod.id?null:wod)}
                            style={{ background:selWod?.id===wod.id?wod.color+"22":"#070d1a",border:`1px solid ${selWod?.id===wod.id?wod.color:"#0f2040"}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:10 }}>
                            <div style={{ width:4,height:32,borderRadius:99,background:wod.color,flexShrink:0 }}/>
                            <div style={{ flex:1 }}><div style={{ fontWeight:800,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",color:wod.color }}>{wod.name}</div><div style={{ fontSize:10,color:"#3d5278" }}>{wod.description}</div></div>
                            {selWod?.id===wod.id&&<span style={{ color:wod.color,fontSize:16 }}>✓</span>}
                          </div>
                        ))}
                        {wodTab==="custom"&&allWods.filter(w=>w.category==="Mes WODs").length===0&&<div style={{ textAlign:"center",color:"#3d5278",padding:20,fontSize:12 }}>Aucun WOD custom</div>}
                      </div>
                      <Field label="Note (optionnel)" value={planNote} onChange={setPlanNote} placeholder="ex. Gilet 10kg..."/>
                      <div style={{ marginTop:12,display:"flex",gap:8 }}><Btn onClick={savePlan} color="#f97316">🏋️ Planifier le WOD</Btn><Btn ghost small onClick={()=>setDayModal(null)}>Annuler</Btn></div>
                    </>)}
                    {wodTab==="create"&&<WodCreator onSave={(wod)=>{onSaveWod(wod);setSelWod(wod);setWodTab("custom");}} onClose={()=>setWodTab("benchmarks")}/>}
                  </div>
                )}
                {planMode==="custom"&&(
                  <div>
                    <button onClick={()=>setPlanMode("choose")} style={{ background:"none",border:"none",color:"#3d5278",cursor:"pointer",fontSize:11,fontFamily:"'Barlow',sans-serif",padding:0,marginBottom:12 }}>← Retour</button>
                    <Field label="Nom de la séance" value={planName} onChange={setPlanName} placeholder="ex. Upper Body..."/>
                    <div style={{ height:10 }}/>
                    <button onClick={()=>setShowExPicker(!showExPicker)} style={{ width:"100%",background:"#0a1628",border:"1px solid #22c55e44",borderRadius:8,padding:"8px 14px",color:"#22c55e",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:showExPicker?10:12 }}>
                      💪 {showExPicker?"Fermer":"Ajouter des exercices"}
                    </button>
                    {showExPicker&&<SessionExercisePicker onAdd={addCustomExercises} onClose={()=>setShowExPicker(false)}/>}
                    {customExercises.map((ex,i)=>(
                      <ExerciseFields key={i} ex={ex} idx={i} onChange={(idx,field,val)=>updateCustomEx(idx,field,val)} onRemove={()=>removeCustomEx(i)}/>
                    ))}
                    <Field label="Note (optionnel)" value={planNote} onChange={setPlanNote} placeholder="Observations..."/>
                    <div style={{ marginTop:12,display:"flex",gap:8 }}><Btn onClick={savePlan} color="#22c55e">💪 Planifier la séance</Btn><Btn ghost small onClick={()=>setDayModal(null)}>Annuler</Btn></div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ProgressionCharts = ({ metrics }) => {
  if(!metrics||metrics.length<2)return(<div style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:16,marginBottom:14,textAlign:"center",color:"#3d5278",fontSize:12 }}>Ajoute au moins 2 mesures pour voir les graphiques 📈</div>);
  const sorted=[...metrics].reverse();
  const MiniChart=({data,label,color,unit=""})=>{
    const vals=data.filter(v=>v>0);if(vals.length<2)return null;
    const min=Math.min(...vals)-1,max=Math.max(...vals)+1,W=260,H=60;
    const pts=data.map((v,i)=>({x:(i/(data.length-1))*(W-20)+10,y:v>0?H-((v-min)/(max-min))*(H-16)-4:null})).filter(p=>p.y!==null);
    const path=pts.map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
    const area=`${path} L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`;
    const delta=vals[vals.length-1]-vals[0];
    const isGood=(label==="Poids"||label==="MG %")?delta<=0:delta>=0;
    return(<div style={{ background:"#04080f",borderRadius:10,padding:"12px 14px",marginBottom:10,border:"1px solid #0f2040" }}>
      <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8 }}>
        <span style={{ fontSize:11,fontWeight:700,color:"#7a90b8",textTransform:"uppercase",letterSpacing:"0.06em" }}>{label}</span>
        <div style={{ display:"flex",gap:10,alignItems:"center" }}>
          <span style={{ fontSize:11,color:"#3d5278" }}>{vals[0]}{unit}</span>
          <span style={{ fontSize:11,color:isGood?"#22c55e":"#e63946",fontWeight:700 }}>{delta>0?"+":""}{delta.toFixed(1)}{unit}</span>
          <span style={{ fontSize:14,fontWeight:900,color,fontFamily:"'Barlow Condensed',sans-serif" }}>{vals[vals.length-1]}{unit}</span>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {[0,1,2].map(i=>(<line key={i} x1="10" y1={H-i*(H-16)/2-4} x2={W-10} y2={H-i*(H-16)/2-4} stroke="#0f2040" strokeWidth="1" strokeDasharray="4,4"/>))}
        <path d={area} fill={color} opacity="0.08"/>
        <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke="#000" strokeWidth="1.5"/>))}
      </svg>
    </div>);
  };
  return(<div style={{ marginBottom:14 }}>
    <div style={{ fontSize:11,fontWeight:700,color:"#1a6fff",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
      <div style={{ width:3,height:16,borderRadius:99,background:"#1a6fff" }}/>TABLEAUX DE PROGRESSION
    </div>
    <MiniChart data={sorted.map(m=>m.weight)} label="Poids" color="#1a6fff" unit="kg"/>
    <MiniChart data={sorted.map(m=>m.fatPct)} label="MG %" color="#e63946" unit="%"/>
    <MiniChart data={sorted.map(m=>m.waist)} label="Taille" color="#f59e0b" unit="cm"/>
    <MiniChart data={sorted.map(m=>m.chest)} label="Poitrine" color="#8b5cf6" unit="cm"/>
    <MiniChart data={sorted.map(m=>m.hips)} label="Hanches" color="#22c55e" unit="cm"/>
  </div>);
};

const ChargesTab = ({ sessions }) => {
  const bestPerEx={};
  sessions.forEach(s=>{(s.exercises||[]).forEach(ex=>{
    const libEx=LIBRARY.find(l=>l.id===ex.libId);
    if(!ex.libId||libEx?.cat==="Cardio"||ex.isWodMovement)return;
    if(!ex.load||+ex.load<=0)return;
    if(!bestPerEx[ex.libId]||+ex.load>bestPerEx[ex.libId].load)bestPerEx[ex.libId]={libId:ex.libId,name:ex.name,load:+ex.load,reps:+ex.reps||0,date:s.date,rpe:ex.rpe};
  });});
  const loadHistory={};
  sessions.forEach(s=>{(s.exercises||[]).forEach(ex=>{
    if(!ex.libId||!ex.load||+ex.load<=0||ex.isWodMovement)return;
    if(!loadHistory[ex.libId])loadHistory[ex.libId]=[];
    loadHistory[ex.libId].push({date:s.date,load:+ex.load});
  });});
  const entries=Object.values(bestPerEx).sort((a,b)=>b.load-a.load);
  const maxLoad=entries.length?Math.max(...entries.map(e=>e.load)):1;
  if(!entries.length)return(<div style={{ textAlign:"center",color:"#3d5278",padding:60 }}><div style={{ fontSize:32,marginBottom:12 }}>🏋️</div><div style={{ fontSize:14,fontWeight:700 }}>Aucune charge enregistrée</div></div>);
  return(<div className="fu">
    <div style={{ fontSize:11,fontWeight:700,color:"#1a6fff",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:14,display:"flex",alignItems:"center",gap:8 }}>
      <div style={{ width:3,height:16,borderRadius:99,background:"#1a6fff" }}/>RECORDS & 1RM ESTIMÉS
    </div>
    {entries.map((ex,i)=>{
      const libEx=LIBRARY.find(l=>l.id===ex.libId);
      const orm=calc1RM(ex.load,ex.reps);
      const history=(loadHistory[ex.libId]||[]).sort((a,b)=>a.date.localeCompare(b.date));
      const sparkLoads=history.map(h=>h.load);
      const sparkMin=sparkLoads.length>1?Math.min(...sparkLoads)-2:0;
      const sparkMax=sparkLoads.length>1?Math.max(...sparkLoads)+2:ex.load+10;
      const SW=200,SH=30;
      const sparkPts=sparkLoads.map((l,idx)=>({x:sparkLoads.length>1?(idx/(sparkLoads.length-1))*(SW-10)+5:SW/2,y:SH-((l-sparkMin)/(sparkMax-sparkMin||1))*(SH-6)-3}));
      const sparkPath=sparkPts.map((p,idx)=>`${idx===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
      return(<div key={ex.libId} className="ch fu" style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14,marginBottom:10,animationDelay:`${i*.04}s` }}>
        <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
          <div style={{ width:48,height:24,borderRadius:8,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.libId}/></div>
          <div style={{ flex:1,minWidth:0 }}>
            <div style={{ fontWeight:800,fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{ex.name}</div>
            {libEx&&<div style={{ fontSize:10,color:"#3d5278" }}>{libEx.muscles}</div>}
          </div>
          <div style={{ textAlign:"right",flexShrink:0 }}>
            <div style={{ fontSize:26,fontWeight:900,color:"#f59e0b",fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1 }}>{ex.load}<span style={{ fontSize:12 }}>kg</span></div>
            <div style={{ fontSize:11,color:"#7a90b8" }}>× {ex.reps} reps</div>
          </div>
        </div>
        {orm&&<div style={{ background:"#0a1628",borderRadius:10,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #1a6fff22" }}>
          <span style={{ fontSize:11,color:"#7a90b8",fontWeight:600 }}>1RM estimé (Epley)</span>
          <span style={{ fontSize:18,fontWeight:900,color:"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif" }}>{orm} kg</span>
        </div>}
        {sparkLoads.length>1&&<svg width="100%" viewBox={`0 0 ${SW} ${SH}`} style={{ marginBottom:8 }}>
          <path d={sparkPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
          {sparkPts.map((p,idx)=>(<circle key={idx} cx={p.x} cy={p.y} r="2.5" fill="#f59e0b" opacity="0.8"/>))}
        </svg>}
        <Bar value={(ex.load/maxLoad)*100} color="#f59e0b" h={3}/>
      </div>);
    })}
  </div>);
};

const MonthlyReport = ({ sessions, metrics }) => {
  const now=new Date();
  const currentMonth=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const prevMonth=now.getMonth()===0?`${now.getFullYear()-1}-12`:`${now.getFullYear()}-${String(now.getMonth()).padStart(2,"0")}`;
  const thisSessions=sessions.filter(s=>s.date?.startsWith(currentMonth));
  const prevSessions=sessions.filter(s=>s.date?.startsWith(prevMonth));
  const thisPresent=thisSessions.filter(s=>s.present).length;
  const prevPresent=prevSessions.filter(s=>s.present).length;
  const thisMetrics=metrics.filter(m=>m.date?.startsWith(currentMonth));
  const prevMetrics=metrics.filter(m=>m.date?.startsWith(prevMonth));
  const lastWeight=thisMetrics[0]?.weight||prevMetrics[0]?.weight;
  const firstWeight=thisMetrics[thisMetrics.length-1]?.weight||prevMetrics[prevMetrics.length-1]?.weight;
  const weightDelta=lastWeight&&firstWeight?+(lastWeight-firstWeight).toFixed(1):null;
  const monthLabel=MONTH_NAMES[String(now.getMonth()+1).padStart(2,"0")];
  const wodCount=thisSessions.filter(s=>s.isWod).length;
  return(<div style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14,marginBottom:14 }}>
    <div style={{ fontSize:11,fontWeight:700,color:"#1a6fff",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:12,display:"flex",alignItems:"center",gap:8 }}>
      <div style={{ width:3,height:16,borderRadius:99,background:"#1a6fff" }}/>BILAN {monthLabel}
    </div>
    <div style={{ display:"flex",gap:8,flexWrap:"wrap" }}>
      {[{l:"Séances",v:thisPresent,prev:prevPresent,c:"#1a6fff"},{l:"WODs",v:wodCount,c:"#f97316",noDelta:true},{l:"Δ Poids",v:weightDelta!==null?`${weightDelta>0?"+":""}${weightDelta}kg`:"—",c:weightDelta!==null?(weightDelta<=0?"#22c55e":"#e63946"):"#3d5278",noDelta:true}].map(s=>(
        <div key={s.l} style={{ flex:1,background:"#04080f",borderRadius:10,padding:"10px 12px",border:"1px solid #0f2040",minWidth:70 }}>
          <div style={{ fontSize:9,color:"#3d5278",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4 }}>{s.l}</div>
          <div style={{ fontSize:20,fontWeight:900,color:s.c,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1 }}>{s.v}</div>
          {!s.noDelta&&<div style={{ fontSize:9,color:"#3d5278",marginTop:2 }}>vs {s.prev} mois préc.</div>}
        </div>
      ))}
    </div>
  </div>);
};

const TemplatesView = ({ templates, customWods, onBack, onSave, onSaveWod }) => {
  const [tplTab,setTplTab]=useState("templates");
  const [showNew,setShowNew]=useState(false);
  const [newTpl,setNewTpl]=useState({name:"",cat:"Push",color:"#1a6fff",exercises:[]});
  const [pickingEx,setPickingEx]=useState(false);
  const [search,setSearch]=useState("");
  const [selCat,setSelCat]=useState("Push");
  const [showWodCreator,setShowWodCreator]=useState(false);
  const [wodFilter,setWodFilter]=useState("Tous");
  function addExToNewTpl(ex){setNewTpl(p=>({...p,exercises:[...p.exercises,{libId:ex.id,name:ex.name,sets:3,reps:10,rest:60}]}));setPickingEx(false);setSearch("");}
  function saveNewTpl(){if(!newTpl.name.trim()||!newTpl.exercises.length)return;onSave([...templates,{...newTpl,id:"tpl_"+Date.now()}]);setNewTpl({name:"",cat:"Push",color:"#1a6fff",exercises:[]});setShowNew(false);}
  const allWodsList=[...WOD_BENCHMARKS,...customWods];
  const wodCats=["Tous",...new Set(allWodsList.map(w=>w.category))];
  const filteredWods=wodFilter==="Tous"?allWodsList:allWodsList.filter(w=>w.category===wodFilter);
  return(<div style={{ minHeight:"100vh",background:"#000",color:"#e8edf5",fontFamily:"'Barlow',sans-serif",paddingBottom:48 }}>
    <div style={{ padding:"16px" }}>
      <button onClick={onBack} style={{ background:"none",border:"none",color:"#7a90b8",cursor:"pointer",fontSize:12,marginBottom:14,fontFamily:"'Barlow',sans-serif",padding:0 }}>← Retour</button>
      <div style={{ fontSize:32,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:16 }}>TEMPLATES & WODs</div>
      <div style={{ display:"flex",gap:2,background:"#070d1a",borderRadius:10,padding:3,border:"1px solid #0f2040",marginBottom:20 }}>
        {[{id:"templates",label:"📋 Templates"},{id:"wods",label:"🏋️ WODs"}].map(t=>(
          <button key={t.id} onClick={()=>setTplTab(t.id)} style={{ flex:1,padding:"10px 4px",borderRadius:8,border:"none",cursor:"pointer",background:tplTab===t.id?"#112240":"transparent",color:tplTab===t.id?"#e8edf5":"#3d5278",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,textTransform:"uppercase",borderBottom:tplTab===t.id?"2px solid #1a6fff":"2px solid transparent" }}>{t.label}</button>
        ))}
      </div>
      {tplTab==="templates"&&(<>
        <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:14 }}><Btn small onClick={()=>setShowNew(!showNew)}>+ Nouveau</Btn></div>
        {showNew&&(<div style={{ background:"#070d1a",border:"1px solid #1a6fff44",borderRadius:14,padding:14,marginBottom:20 }}>
          <SecTitle c="Nouveau template"/>
          <Field label="Nom" value={newTpl.name} onChange={v=>setNewTpl(p=>({...p,name:v}))} placeholder="ex. Push Day C"/>
          <div style={{ height:8 }}/>
          <div style={{ display:"flex",gap:5,flexWrap:"wrap",marginBottom:10 }}>
            {["Push","Pull","Legs","Functional","Abdos","Mobilité"].map(cat=>(
              <button key={cat} onClick={()=>setNewTpl(p=>({...p,cat,color:CAT_COLOR[cat]||"#1a6fff"}))} style={{ padding:"5px 10px",borderRadius:8,border:`1px solid ${newTpl.cat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#0f2040"}`,background:newTpl.cat===cat?(CAT_COLOR[cat]||"#1a6fff")+"22":"transparent",color:newTpl.cat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer" }}>{cat}</button>
            ))}
          </div>
          <button onClick={()=>setPickingEx(!pickingEx)} style={{ width:"100%",background:"#0a1628",border:"1px solid #1a6fff44",borderRadius:8,padding:"8px 14px",color:"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:10 }}>💪 {pickingEx?"Fermer":"Ajouter des exercices"}</button>
          {pickingEx&&(<div style={{ background:"#000",borderRadius:10,padding:10,marginBottom:10 }}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..." style={{ width:"100%",background:"#070d1a",border:"1.5px solid #0f2040",borderRadius:8,padding:"7px 10px",color:"#e8edf5",fontSize:12,fontFamily:"'Barlow',sans-serif",outline:"none",marginBottom:8,colorScheme:"dark",boxSizing:"border-box" }} onFocus={e=>e.target.style.borderColor="#1a6fff"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
            <div style={{ display:"flex",gap:4,marginBottom:8,overflowX:"auto",paddingBottom:4 }}>
              {CATS.filter(c=>c!=="Tous").map(cat=>(<button key={cat} onClick={()=>setSelCat(cat)} style={{ padding:"3px 8px",borderRadius:99,border:`1px solid ${selCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#0f2040"}`,background:selCat===cat?(CAT_COLOR[cat]||"#1a6fff")+"22":"transparent",color:selCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:9,textTransform:"uppercase",cursor:"pointer",flexShrink:0 }}>{cat}</button>))}
            </div>
            <div style={{ maxHeight:180,overflowY:"auto",display:"flex",flexDirection:"column",gap:4 }}>
              {LIBRARY.filter(ex=>{const mc=!search?ex.cat===selCat:true;const ms=search?ex.name.toLowerCase().includes(search.toLowerCase()):true;return mc&&ms;}).map(ex=>(<div key={ex.id} onClick={()=>addExToNewTpl(ex)} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:8,border:"1px solid #0f2040",cursor:"pointer" }}><div style={{ width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.id}/></div><span style={{ flex:1,fontSize:11,fontWeight:600 }}>{ex.name}</span><Badge label={ex.cat} color={CAT_COLOR[ex.cat]||"#1a6fff"}/></div>))}
            </div>
          </div>)}
          {newTpl.exercises.map((ex,i)=>(<div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:"#0a1628",borderRadius:8,marginBottom:6,border:"1px solid #0f2040" }}><div style={{ width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.libId}/></div><span style={{ flex:1,fontSize:12,fontWeight:600 }}>{ex.name}</span><input type="number" value={ex.sets||""} onChange={e=>setNewTpl(p=>({...p,exercises:p.exercises.map((x,j)=>j===i?{...x,sets:e.target.value}:x)}))} placeholder="S" style={{ width:36,background:"#000",border:"1px solid #0f2040",borderRadius:6,padding:"4px",color:"#e8edf5",fontSize:11,colorScheme:"dark",textAlign:"center" }}/><input type="text" value={ex.reps||""} onChange={e=>setNewTpl(p=>({...p,exercises:p.exercises.map((x,j)=>j===i?{...x,reps:e.target.value}:x)}))} placeholder="R" style={{ width:36,background:"#000",border:"1px solid #0f2040",borderRadius:6,padding:"4px",color:"#e8edf5",fontSize:11,colorScheme:"dark",textAlign:"center" }}/><button onClick={()=>setNewTpl(p=>({...p,exercises:p.exercises.filter((_,j)=>j!==i)}))} style={{ background:"none",border:"none",color:"#e63946",cursor:"pointer",fontSize:14,padding:0 }}>✕</button></div>))}
          {newTpl.exercises.length>0&&<div style={{ display:"flex",gap:8,marginTop:12 }}><Btn small onClick={saveNewTpl}>💾 Sauvegarder</Btn><Btn small ghost onClick={()=>{setShowNew(false);setNewTpl({name:"",cat:"Push",color:"#1a6fff",exercises:[]});}}>Annuler</Btn></div>}
        </div>)}
        <div style={{ fontSize:11,fontWeight:700,color:"#3d5278",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:8 }}><div style={{ flex:1,height:1,background:"#0f2040" }}/>Templates de base<div style={{ flex:1,height:1,background:"#0f2040" }}/></div>
        {DEFAULT_TEMPLATES.map((tpl,i)=>(<div key={tpl.id} className="ch fu" style={{ background:"#070d1a",border:`1px solid ${tpl.color}33`,borderRadius:14,padding:14,marginBottom:10,animationDelay:`${i*.04}s` }}>
          <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:8 }}><div style={{ width:4,height:44,borderRadius:99,background:tpl.color,flexShrink:0 }}/><div style={{ flex:1 }}><div style={{ fontWeight:900,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif" }}>{tpl.name}</div><div style={{ fontSize:11,color:"#3d5278" }}>{tpl.exercises.length} exercices · <Badge label={tpl.cat} color={tpl.color}/></div></div></div>
          {tpl.exercises.map((ex,j)=>(<div key={j} style={{ display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:j<tpl.exercises.length-1?"1px solid #0f204044":"none" }}><div style={{ width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.libId}/></div><span style={{ flex:1,fontSize:12,color:"#e8edf5" }}>{ex.name}</span><Badge label={`${ex.sets}×${ex.reps}`} color={tpl.color}/></div>))}
        </div>))}
        {templates.length>0&&(<>
          <div style={{ fontSize:11,fontWeight:700,color:"#3d5278",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,marginTop:20,display:"flex",alignItems:"center",gap:8 }}><div style={{ flex:1,height:1,background:"#0f2040" }}/>Mes templates<div style={{ flex:1,height:1,background:"#0f2040" }}/></div>
          {templates.map(tpl=>(<SwipeToDelete key={tpl.id} onDelete={()=>onSave(templates.filter(t=>t.id!==tpl.id))}><div className="ch fu" style={{ background:"#070d1a",border:`1px solid ${tpl.color||"#1a6fff"}33`,borderRadius:14,padding:14 }}><div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:8 }}><div style={{ width:4,height:44,borderRadius:99,background:tpl.color||"#1a6fff",flexShrink:0 }}/><div style={{ flex:1 }}><div style={{ fontWeight:900,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif" }}>{tpl.name}</div></div></div>{tpl.exercises.map((ex,j)=>(<div key={j} style={{ display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:j<tpl.exercises.length-1?"1px solid #0f204044":"none" }}><div style={{ width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.libId}/></div><span style={{ flex:1,fontSize:12,color:"#e8edf5" }}>{ex.name}</span><Badge label={`${ex.sets}×${ex.reps}`} color={tpl.color||"#1a6fff"}/></div>))}</div></SwipeToDelete>))}
        </>)}
      </>)}
      {tplTab==="wods"&&(<>
        <div style={{ display:"flex",justifyContent:"flex-end",marginBottom:14 }}><Btn small color="#f97316" onClick={()=>setShowWodCreator(!showWodCreator)}>🏋️ Créer un WOD</Btn></div>
        {showWodCreator&&<WodCreator onSave={(wod)=>{onSaveWod([...customWods,wod]);setShowWodCreator(false);}} onClose={()=>setShowWodCreator(false)}/>}
        <div style={{ display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:4 }}>
          {wodCats.map(cat=>(<button key={cat} onClick={()=>setWodFilter(cat)} style={{ padding:"5px 12px",borderRadius:99,border:`1px solid ${wodFilter===cat?"#e63946":"#0f2040"}`,background:wodFilter===cat?"#e6394622":"transparent",color:wodFilter===cat?"#e63946":"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer",flexShrink:0 }}>{cat}</button>))}
        </div>
        {filteredWods.map(wod=>(<div key={wod.id} className="ch fu" style={{ background:"#070d1a",border:`1px solid ${wod.color||"#e63946"}33`,borderRadius:14,padding:14,marginBottom:10 }}>
          <div style={{ display:"flex",alignItems:"flex-start",gap:12,marginBottom:8 }}><div style={{ width:4,minHeight:40,borderRadius:99,background:wod.color||"#e63946",flexShrink:0 }}/><div style={{ flex:1 }}><div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap" }}><div style={{ fontSize:18,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",color:wod.color||"#e63946" }}>{wod.name}</div><Badge label={wod.format?.toUpperCase()||""} color={wod.color||"#e63946"}/></div>{wod.tip&&<div style={{ fontSize:11,color:"#3d5278",marginBottom:8,fontStyle:"italic" }}>💡 {wod.tip}</div>}{wod.movements.map((mv,i)=>(<div key={i} style={{ display:"flex",alignItems:"center",gap:8 }}><div style={{ width:24,height:12,borderRadius:3,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={mv.libId}/></div><span style={{ fontSize:12,color:"#e8edf5",flex:1 }}>{mv.name}</span>{mv.reps&&<span style={{ fontSize:11,color:wod.color||"#e63946",fontWeight:700 }}>× {mv.reps}</span>}</div>))}</div></div>
        </div>))}
        {customWods.length>0&&(<>
          <div style={{ fontSize:11,fontWeight:700,color:"#3d5278",letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,marginTop:10,display:"flex",alignItems:"center",gap:8 }}><div style={{ flex:1,height:1,background:"#0f2040" }}/>Mes WODs<div style={{ flex:1,height:1,background:"#0f2040" }}/></div>
          {customWods.map(wod=>(<SwipeToDelete key={wod.id} onDelete={()=>onSaveWod(customWods.filter(w=>w.id!==wod.id))}><div className="ch fu" style={{ background:"#070d1a",border:`1px solid ${wod.color||"#e63946"}33`,borderRadius:14,padding:14 }}><div style={{ fontWeight:800,fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",color:wod.color||"#e63946" }}>{wod.name}</div><div style={{ fontSize:11,color:"#3d5278" }}>{wod.description}</div></div></SwipeToDelete>))}
        </>)}
      </>)}
    </div>
  </div>);
};

const PPLGenerator = ({ onAdd }) => {
  const [type,setType]=useState("Push");
  const [generated,setGenerated]=useState([]);
  const TYPES={Push:["bench_press","overhead_press","incline_press","dips","lateral_raise","tricep_pushdown","pushup"],Pull:["pullup","barbell_row","deadlift","lat_pulldown","face_pull","bicep_curl","hammer_curl"],Legs:["squat","back_squat","front_squat","rdl","lunge","bulgarian_split","leg_press","hip_thrust","crab_walk","kickback"],Abdos:["ab_crunch","ab_wheel","leg_raise","russian_twist","hollow_body","sit_up","pallof_press"],Cardio:["run","bike","rowing_machine","assault_bike","skierg","jump_rope"],Functional:["kb_russian_swing","kb_american_swing","kb_snatch","gorilla_row","farmer_walk","wall_ball","thruster","box_jump"],Mobilité:["hip90","pigeon","catcow","worldsgreatest","thoracic_rot","hip_flexor","ankle_mob","foam_roll"]};
  function generate(){const pool=TYPES[type]||[];const shuffled=[...pool].sort(()=>Math.random()-.5);const count=type==="Cardio"?4:type==="Mobilité"?5:6;setGenerated(shuffled.slice(0,count).map(id=>{const ex=LIBRARY.find(l=>l.id===id);if(!ex)return null;if(ex.cat==="Cardio")return{...ex,duration:"20",zone:"2",cardioType:ex.cardioType||"duration"};return{...ex,sets:"4",reps:type==="Mobilité"?"60s":"8-12",load:"",rest:"60",rpe:""};}).filter(Boolean));}
  return(<div style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14,marginBottom:14 }}>
    <SecTitle c="🎲 Générateur de séance"/>
    <div style={{ display:"flex",gap:5,marginBottom:12,overflowX:"auto",paddingBottom:4 }}>
      {Object.keys(TYPES).map(t=>(<button key={t} onClick={()=>{setType(t);setGenerated([]);}} style={{ padding:"5px 12px",borderRadius:99,border:`1px solid ${type===t?(CAT_COLOR[t]||"#1a6fff"):"#0f2040"}`,background:type===t?(CAT_COLOR[t]||"#1a6fff")+"22":"transparent",color:type===t?(CAT_COLOR[t]||"#1a6fff"):"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer",flexShrink:0 }}>{t}</button>))}
    </div>
    <Btn small onClick={generate}>🎲 Générer {type}</Btn>
    {generated.length>0&&(<div style={{ marginTop:12 }}>
      {generated.map((ex,i)=>(<div key={i} style={{ display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<generated.length-1?"1px solid #0f2040":"none" }}><div style={{ width:36,height:18,borderRadius:6,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.id}/></div><div style={{ flex:1 }}><div style={{ fontWeight:700,fontSize:13 }}>{ex.name}</div><div style={{ fontSize:10,color:"#3d5278" }}>{ex.muscles}</div></div><Badge label={ex.cat} color={CAT_COLOR[ex.cat]||"#1a6fff"}/></div>))}
      <div style={{ marginTop:12,display:"flex",gap:8 }}><Btn small onClick={()=>onAdd(generated)}>✅ Ajouter au programme</Btn><Btn small ghost onClick={generate}>🔄 Regénérer</Btn></div>
    </div>)}
  </div>);
};
export default function App() {
  const [clients, setClients] = useState(SAMPLE_CLIENTS);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [customWods, setCustomWods] = useState([]);
  const [fbStatus, setFbStatus] = useState("connecting");
  const [view, setView] = useState("dash");
  const [selId, setSelId] = useState(null);
  const [tab, setTab] = useState("sessions");
  const [libCat, setLibCat] = useState("Tous");
  const [libSel, setLibSel] = useState(null);
  const [libSearch, setLibSearch] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [showNewSession, setShowNewSession] = useState(false);
  const [showExPicker, setShowExPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [showWodCreator, setShowWodCreator] = useState(false);
  const [editingClient, setEditingClient] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [newC, setNewC] = useState({ name:"", age:"", sport:"", objective:"", notes:"" });
  const [editC, setEditC] = useState(null);
  const [newS, setNewS] = useState({ date:"", present:true, duration:"", note:"" });
  const [newM, setNewM] = useState({ date:"", weight:"", chest:"", waist:"", hips:"", fatPct:"" });
  const [newG, setNewG] = useState({ label:"", deadline:"" });
  const [newP, setNewP] = useState({ name:"", weeks:"8", startDate:"" });
  const [newEx, setNewEx] = useState({ name:"", sets:"", reps:"", load:"", note:"", libId:"" });
  const [addingExTo, setAddingExTo] = useState(null);
  const [pickingEx, setPickingEx] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorPid, setGeneratorPid] = useState(null);
  const [pendingSession, setPendingSession] = useState({ exercises:[] });
  const [pendingWod, setPendingWod] = useState(null);
  const [sessionMode, setSessionMode] = useState("normal");
  const [liveSession, setLiveSession] = useState(null);

  const cl = clients.find(c=>c.id===selId);
  const allTemplates = [...DEFAULT_TEMPLATES, ...customTemplates];
  const allWods = [...WOD_BENCHMARKS, ...customWods];

  useEffect(()=>{
    const unsub=onSnapshot(doc(db,"coach","data"),snap=>{
      if(snap.exists()){
        const data=snap.data();
        setClients(data.clients||[]);
        setCustomTemplates(data.customTemplates||[]);
        setCustomWods(data.customWods||[]);
      } else { saveToFirebase(SAMPLE_CLIENTS,[],[]); }
      setFbStatus("live");
    },()=>setFbStatus("local"));
    return unsub;
  },[]);

  const saveToFirebase = useCallback(async(c,t,w)=>{
    try { await setDoc(doc(db,"coach","data"),{clients:c,customTemplates:t,customWods:w,updatedAt:Date.now()}); }
    catch(e){ console.error(e); }
  },[]);

  const sync = useCallback((uc,ut,uw)=>{
    const c=uc||clients; const t=ut||customTemplates; const w=uw||customWods;
    setClients(c); setCustomTemplates(t); setCustomWods(w);
    saveToFirebase(c,t,w);
  },[clients,customTemplates,customWods,saveToFirebase]);

  const up = (id,patch) => sync(clients.map(c=>c.id===id?{...c,...patch}:c),null,null);
  const saveTemplates = (tpls) => sync(null,tpls,null);
  const saveWods = (wods) => sync(null,null,wods);
  const saveOneWod = (wod) => sync(null,null,[...customWods,wod]);

  const openClient = (id) => {
    setSelId(id); setView("client"); setTab("sessions");
    setShowNewSession(false); setEditingClient(false); setEditingSession(null);
    setNewS({date:"",present:true,duration:"",note:""});
    setPendingSession({exercises:[]}); setPendingWod(null);
    setShowExPicker(false); setShowTemplatePicker(false);
    setShowWodCreator(false); setSessionMode("normal"); setLiveSession(null);
  };

  function doAddClient(){
    if(!newC.name.trim())return;
    sync([...clients,{id:"c"+Date.now(),...newC,age:+newC.age,since:new Date().toISOString().slice(0,7),status:"actif",progress:0,sessions:[],metrics:[],programs:[],goals:[],planned:[]}],null,null);
    setNewC({name:"",age:"",sport:"",objective:"",notes:""}); setAddOpen(false);
  }

  function doSaveEditClient(){
    if(!editC||!cl)return;
    up(selId,{...editC,age:+editC.age});
    setEditingClient(false); setEditC(null);
  }

  function doDeleteClient(id){
    sync(clients.filter(c=>c.id!==id),null,null);
    setView("dash"); setConfirmDelete(null);
  }

  function doArchiveClient(id){ up(id,{status:"inactif"}); setView("dash"); }

  function doAddSession(){
    if(!newS.date||!cl)return;
    let sess;
    if(sessionMode==="wod"&&pendingWod){
      sess={id:"s"+Date.now(),...newS,present:newS.present===true,duration:+newS.duration,
        isWod:true,templateId:pendingWod.id,wodFormat:pendingWod.format,wodDuration:pendingWod.duration,
        wodScore:pendingWod.score||"",wodName:pendingWod.name,wodColor:pendingWod.color,
        exercises:(pendingWod.movements||[]).map(mv=>({id:"se"+Date.now()+Math.random(),libId:mv.libId||"",name:mv.name,reps:mv.reps,sets:"1",load:"",rest:"",rpe:"",isWodMovement:true}))};
    } else {
      sess={id:"s"+Date.now(),...newS,present:newS.present===true,duration:+newS.duration,exercises:pendingSession.exercises||[],templateId:pendingSession.templateId||null};
    }
    const updatedPlanned=(cl.planned||[]).filter(p=>p.date!==newS.date);
    up(selId,{sessions:[sess,...cl.sessions],planned:updatedPlanned});
    setNewS({date:"",present:true,duration:"",note:""});
    setPendingSession({exercises:[]}); setPendingWod(null);
    setShowExPicker(false); setShowNewSession(false);
    setShowTemplatePicker(false); setShowWodCreator(false); setSessionMode("normal");
  }

  function doSaveEditSession(){
    if(!editingSession||!cl)return;
    up(selId,{sessions:cl.sessions.map(s=>s.id===editingSession.id?editingSession:s)});
    setEditingSession(null);
  }

  function saveLiveSession(sess){
    if(!cl)return;
    const updatedPlanned=(cl.planned||[]).filter(p=>p.date!==sess.date);
    up(selId,{sessions:[sess,...cl.sessions],planned:updatedPlanned});
    setLiveSession(null);
  }

  function applyTemplateToSession(tpl){
    if(tpl.type==="wod"){
      setPendingWod({...tpl,score:""});
      setSessionMode("wod"); setShowTemplatePicker(false);
    } else {
      const exercises=applyTemplate(tpl,cl.sessions);
      setPendingSession({exercises,templateId:tpl.id});
      setSessionMode("normal"); setShowTemplatePicker(false);
    }
  }

  function addExercisesToSession(exs){
    setPendingSession(p=>({...p,exercises:[...p.exercises,...exs.map(ex=>{
      const libEx=LIBRARY.find(l=>l.id===ex.id);
      const isCardio=libEx?.cat==="Cardio";
      return{id:"se"+Date.now()+Math.random(),libId:ex.id,name:ex.name,cardioType:libEx?.cardioType||"",
        ...(isCardio?{duration:"",speed:"",watts:"",zone:""}:{sets:"3",reps:"10",load:"",rest:"60",rpe:"",note:""})};
    })]}));
  }

  function updatePendingEx(idx,field,val){ setPendingSession(p=>({...p,exercises:p.exercises.map((ex,i)=>i===idx?{...ex,[field]:val}:ex)})); }
  function updateEditSessionEx(idx,field,val){ setEditingSession(p=>({...p,exercises:p.exercises.map((ex,i)=>i===idx?{...ex,[field]:val}:ex)})); }
  function removeSessionEx(idx){ setPendingSession(p=>({...p,exercises:p.exercises.filter((_,i)=>i!==idx)})); }
  function removeEditSessionEx(idx){ setEditingSession(p=>({...p,exercises:p.exercises.filter((_,i)=>i!==idx)})); }

  function doAddMetric(){
    if(!newM.date||!newM.weight||!cl)return;
    up(selId,{metrics:[{...newM,weight:+newM.weight,chest:+newM.chest,waist:+newM.waist,hips:+newM.hips,fatPct:+newM.fatPct},...cl.metrics]});
    setNewM({date:"",weight:"",chest:"",waist:"",hips:"",fatPct:""});
  }

  function doAddGoal(){
    if(!newG.label.trim()||!cl)return;
    up(selId,{goals:[...cl.goals,{id:"g"+Date.now(),...newG,done:false}]});
    setNewG({label:"",deadline:""});
  }

  function doAddProgram(){
    if(!newP.name.trim()||!cl)return;
    up(selId,{programs:[...cl.programs,{id:"p"+Date.now(),...newP,weeks:+newP.weeks,exercises:[]}]});
    setNewP({name:"",weeks:"8",startDate:""});
  }

  function doAddExercise(pid){
    if(!newEx.name.trim()||!cl)return;
    up(selId,{programs:cl.programs.map(p=>p.id===pid?{...p,exercises:[...p.exercises,{id:"e"+Date.now(),...newEx}]}:p)});
    setNewEx({name:"",sets:"",reps:"",load:"",note:"",libId:""}); setAddingExTo(null); setPickingEx(false);
  }

  function doAddGeneratedExercises(pid,exercises){
    if(!cl)return;
    const newExs=exercises.map(ex=>({id:"e"+Date.now()+Math.random(),name:ex.name,sets:ex.sets||"",reps:ex.reps||"",load:"",rest:"60",rpe:"",note:"",libId:ex.id,cardioType:ex.cardioType||""}));
    up(selId,{programs:cl.programs.map(p=>p.id===pid?{...p,exercises:[...p.exercises,...newExs]}:p)});
    setShowGenerator(false); setGeneratorPid(null);
  }

  const wrap = (children) => (
    <div style={{ minHeight:"100vh",background:"#000",color:"#e8edf5",fontFamily:"'Barlow',sans-serif",paddingBottom:48 }}>
      <style>{GLOBAL_CSS}</style><StatusDot status={fbStatus}/>{children}
    </div>
  );

  // Live session overlay
  if(liveSession&&cl){
    return wrap(
      <SessionLiveMode
        plan={liveSession}
        allTemplates={allTemplates}
        allWods={allWods}
        onSave={saveLiveSession}
        onClose={()=>setLiveSession(null)}
      />
    );
  }

  if(view==="templates") return wrap(
    <TemplatesView templates={customTemplates} customWods={customWods}
      onBack={()=>setView("dash")} onSave={saveTemplates} onSaveWod={saveWods}/>
  );

  if(view==="library"){
    const filtered=LIBRARY.filter(e=>{
      const matchCat=libCat==="Tous"||e.cat===libCat;
      const matchSearch=libSearch===""||e.name.toLowerCase().includes(libSearch.toLowerCase())||e.muscles.toLowerCase().includes(libSearch.toLowerCase());
      return matchCat&&matchSearch;
    });
    return wrap(
      <div style={{ padding:"16px" }}>
        <button onClick={()=>setView("dash")} style={{ background:"none",border:"none",color:"#7a90b8",cursor:"pointer",fontSize:12,marginBottom:14,fontFamily:"'Barlow',sans-serif",padding:0 }}>← Retour</button>
        <div style={{ fontSize:32,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:14 }}>BIBLIOTHÈQUE</div>
        <input value={libSearch} onChange={e=>setLibSearch(e.target.value)} placeholder="🔍 Rechercher un exercice ou muscle..."
          style={{ width:"100%",background:"#070d1a",border:"1.5px solid #0f2040",borderRadius:10,padding:"10px 14px",color:"#e8edf5",fontSize:14,fontFamily:"'Barlow',sans-serif",outline:"none",marginBottom:12,colorScheme:"dark",boxSizing:"border-box" }}
          onFocus={e=>e.target.style.borderColor="#1a6fff"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
        <div style={{ display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4 }}>
          {CATS.map(cat=>(
            <button key={cat} onClick={()=>setLibCat(cat)} style={{ padding:"6px 14px",borderRadius:99,border:`1px solid ${libCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#0f2040"}`,background:libCat===cat?(CAT_COLOR[cat]||"#1a6fff")+"22":"transparent",color:libCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",flexShrink:0 }}>{cat}</button>
          ))}
        </div>
        <div style={{ fontSize:11,color:"#3d5278",marginBottom:12 }}>{filtered.length} exercice{filtered.length>1?"s":""}</div>
        <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
          {filtered.map(ex=>(
            <div key={ex.id} className="ch fu" onClick={()=>setLibSel(libSel===ex.id?null:ex.id)}
              style={{ background:"#070d1a",border:`1px solid ${libSel===ex.id?(CAT_COLOR[ex.cat]||"#1a6fff")+"66":"#0f2040"}`,borderRadius:16,overflow:"hidden",cursor:"pointer" }}>
              <AnatomySVG id={ex.id}/>
              <div style={{ padding:"10px 12px" }}>
                <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4,gap:4 }}>
                  <div style={{ fontWeight:800,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1.2 }}>{ex.name}</div>
                  <Badge label={ex.cat} color={CAT_COLOR[ex.cat]||"#1a6fff"}/>
                </div>
                <div style={{ fontSize:10,color:"#7a90b8",marginBottom:4 }}>{ex.muscles}</div>
                {libSel===ex.id&&<div style={{ marginTop:8,padding:"8px 10px",background:"#000",borderRadius:8,border:"1px solid #0f2040" }}><div style={{ fontSize:11,color:"#e8edf5" }}>💡 {ex.tip}</div></div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if(view==="dash"){
    const total=clients.reduce((a,c)=>a+c.sessions.filter(s=>s.present).length,0);
    const actif=clients.filter(c=>c.status==="actif").length;
    const activeClients=clients.filter(c=>c.status!=="inactif");
    const att=activeClients.length?Math.round(activeClients.reduce((a,c)=>{ if(!c.sessions.length)return a; return a+c.sessions.filter(s=>s.present).length/c.sessions.length; },0)/activeClients.length*100):0;
    return wrap(<>
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:4 }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:"#1a6fff",boxShadow:"0 0 8px #1a6fff" }}/>
          <span style={{ fontSize:10,color:"#1a6fff",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase" }}>Logan Lagarde · Coaching Individuel</span>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16 }}>
          <div style={{ fontSize:34,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:-0.5,lineHeight:1 }}>MES CLIENTS</div>
          <div style={{ display:"flex",gap:6 }}>
            <Btn ghost small onClick={()=>setView("templates")}>📋 Templates</Btn>
            <Btn ghost small onClick={()=>setView("library")}>📚 Biblio</Btn>
            <Btn small onClick={()=>setAddOpen(true)}>+ Client</Btn>
          </div>
        </div>
        <div style={{ display:"flex",gap:8,marginBottom:16 }}>
          {[{l:"Actifs",v:actif,c:"#1a6fff",i:"⚡"},{l:"Séances",v:total,c:"#e8edf5",i:"📋"},{l:"Assiduité",v:att+"%",c:"#22c55e",i:"🎯"}].map(s=>(
            <div key={s.l} style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:12,padding:"12px 14px",flex:1 }}>
              <div style={{ fontSize:9,color:"#3d5278",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6 }}>{s.i} {s.l}</div>
              <div style={{ fontSize:22,fontWeight:900,color:s.c,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1 }}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{ height:1,background:"linear-gradient(90deg,#1a6fff44,transparent)",marginBottom:14 }}/>
      </div>
      <div style={{ padding:"0 16px" }}>
        {clients.map((c,i)=>{
          const a2=c.sessions.length?Math.round(c.sessions.filter(s=>s.present).length/c.sessions.length*100):0;
          const lw=c.metrics[0];
          const today2=todayStr();
          const nextPlanned=(c.planned||[]).filter(p=>p.date>=today2).sort((a,b)=>a.date.localeCompare(b.date))[0];
          return(
            <div key={c.id} className="ch fu" onClick={()=>openClient(c.id)}
              style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:15,marginBottom:10,cursor:"pointer",animationDelay:`${i*.05}s`,opacity:c.status==="inactif"?0.5:1 }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
                <Avatar name={c.name}/>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:900,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{c.name.toUpperCase()}</div>
                  <div style={{ color:"#7a90b8",fontSize:12,marginTop:1 }}>{c.sport} · {c.objective}</div>
                  {nextPlanned&&(
                    <div style={{ fontSize:10,color:nextPlanned.color||"#1a6fff",marginTop:2,fontWeight:700 }}>
                      📅 {nextPlanned.date} — {nextPlanned.type==="wod"?"🏋️ ":""}{nextPlanned.name}
                    </div>
                  )}
                </div>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0 }}>
                  <Badge label={c.status} color={STATUS_COLOR[c.status]||"#3d5278"}/>
                  {lw&&<span style={{ fontSize:13,fontWeight:800,color:"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif" }}>{lw.weight}kg</span>}
                </div>
              </div>
              <div style={{ display:"flex",gap:14,fontSize:11,color:"#3d5278",marginBottom:8 }}>
                <span>📅 <b style={{ color:"#7a90b8" }}>{c.sessions.length}</b></span>
                <span>✅ <b style={{ color:a2>=80?"#22c55e":"#f59e0b" }}>{a2}%</b></span>
                <span>🎯 <b style={{ color:"#7a90b8" }}>{c.goals.filter(g=>g.done).length}/{c.goals.length}</b></span>
                <span>📆 <b style={{ color:"#7a90b8" }}>{(c.planned||[]).length}</b></span>
              </div>
              <Bar value={c.progress} color="#1a6fff"/>
            </div>
          );
        })}
        {!clients.length&&<div style={{ textAlign:"center",color:"#3d5278",padding:60 }}>Aucun client — ajoutes-en un !</div>}
      </div>

      {addOpen&&(
        <div style={{ position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"flex-end",zIndex:99 }} onClick={()=>setAddOpen(false)}>
          <div onClick={e=>e.stopPropagation()} className="fu" style={{ background:"#0a1628",border:"1px solid #0f2040",borderRadius:"20px 20px 0 0",padding:"24px 18px 40px",width:"100%",maxHeight:"90vh",overflowY:"auto" }}>
            <div style={{ width:36,height:4,borderRadius:99,background:"#0f2040",margin:"0 auto 18px" }}/>
            <div style={{ fontSize:22,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:16 }}>NOUVEAU CLIENT</div>
            <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
              <Field label="Nom complet" value={newC.name} onChange={v=>setNewC(p=>({...p,name:v}))} placeholder="ex. Thomas Dupont"/>
              <div style={{ display:"flex",gap:8 }}>
                <Field label="Âge" type="number" value={newC.age} onChange={v=>setNewC(p=>({...p,age:v}))} placeholder="30" half/>
                <Field label="Sport" value={newC.sport} onChange={v=>setNewC(p=>({...p,sport:v}))} placeholder="Basketball..." half/>
              </div>
              <Field label="Objectif" value={newC.objective} onChange={v=>setNewC(p=>({...p,objective:v}))} placeholder="Perte de poids, Performance..."/>
              <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
                <label style={{ fontSize:9,fontWeight:700,color:"#3d5278",letterSpacing:"0.12em",textTransform:"uppercase" }}>Notes</label>
                <textarea value={newC.notes||""} onChange={e=>setNewC(p=>({...p,notes:e.target.value}))} placeholder="Blessures, préférences..."
                  style={{ background:"#000",border:"1.5px solid #0f2040",borderRadius:8,padding:"9px 10px",color:"#e8edf5",fontSize:13,fontFamily:"'Barlow',sans-serif",outline:"none",width:"100%",colorScheme:"dark",boxSizing:"border-box",resize:"none",minHeight:70 }}
                  onFocus={e=>e.target.style.borderColor="#1a6fff"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
              </div>
            </div>
            <div style={{ display:"flex",gap:10,marginTop:16 }}>
              <Btn onClick={doAddClient}>Ajouter</Btn>
              <Btn ghost onClick={()=>setAddOpen(false)}>Annuler</Btn>
            </div>
          </div>
        </div>
      )}
      {confirmDelete&&(
        <div style={{ position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99,padding:24 }} onClick={()=>setConfirmDelete(null)}>
          <div onClick={e=>e.stopPropagation()} className="fu" style={{ background:"#0a1628",border:"1px solid #e6394644",borderRadius:20,padding:24,width:"100%",maxWidth:360 }}>
            <div style={{ fontSize:20,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:8,color:"#e63946" }}>⚠️ Supprimer ce client ?</div>
            <div style={{ fontSize:13,color:"#7a90b8",marginBottom:20 }}>Toutes les données de <b style={{ color:"#e8edf5" }}>{confirmDelete.name}</b> seront supprimées.</div>
            <div style={{ display:"flex",gap:10 }}>
              <Btn danger onClick={()=>doDeleteClient(confirmDelete.id)}>Supprimer</Btn>
              <Btn ghost onClick={()=>setConfirmDelete(null)}>Annuler</Btn>
            </div>
          </div>
        </div>
      )}
    </>);
  }

  if(view==="client"&&cl){
    const att=cl.sessions.length?Math.round(cl.sessions.filter(s=>s.present).length/cl.sessions.length*100):0;
    const lw=cl.metrics[0],pw=cl.metrics[1];
    const wd=lw&&pw?+(lw.weight-pw.weight).toFixed(1):null;
    const done=cl.goals.filter(g=>g.done).length;
    const gPct=cl.goals.length?Math.round(done/cl.goals.length*100):0;
    const TABS=[{id:"sessions",label:"Séances"},{id:"calendar",label:"📅 Planning"},{id:"metrics",label:"Métriques"},{id:"programs",label:"Programme"},{id:"goals",label:"Objectifs"},{id:"charges",label:"Charges"}];
    const sessionsByMonth=cl.sessions.reduce((acc,s)=>{
      const month=s.date?s.date.slice(0,7):"inconnu";
      if(!acc[month])acc[month]=[];
      acc[month].push(s); return acc;
    },{});
    const sortedMonths=Object.keys(sessionsByMonth).sort((a,b)=>b.localeCompare(a));
    const lastTplId=cl.sessions.find(s=>s.templateId)?.templateId;
    const lastTpl=lastTplId?[...allTemplates,...allWods].find(t=>t.id===lastTplId):null;
    const suggestedTpl=lastTpl
      ?(lastTpl.type==="wod"?allWods.find(w=>w.category===lastTpl.category&&w.id!==lastTpl.id)||allWods[0]:allTemplates.find(t=>t.cat===lastTpl.cat&&t.id!==lastTpl.id)||allTemplates[0])
      :allTemplates[0];

    if(editingClient&&editC) return wrap(<>
      <div style={{ padding:"16px" }}>
        <button onClick={()=>{ setEditingClient(false); setEditC(null); }} style={{ background:"none",border:"none",color:"#7a90b8",cursor:"pointer",fontSize:12,marginBottom:14,fontFamily:"'Barlow',sans-serif",padding:0 }}>← Retour</button>
        <div style={{ fontSize:28,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:20 }}>MODIFIER LE PROFIL</div>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          <Field label="Nom complet" value={editC.name} onChange={v=>setEditC(p=>({...p,name:v}))} placeholder="ex. Tony Parker"/>
          <div style={{ display:"flex",gap:8 }}>
            <Field label="Âge" type="number" value={String(editC.age||"")} onChange={v=>setEditC(p=>({...p,age:v}))} placeholder="30" half/>
            <Field label="Sport" value={editC.sport} onChange={v=>setEditC(p=>({...p,sport:v}))} placeholder="Basketball..." half/>
          </div>
          <Field label="Objectif" value={editC.objective} onChange={v=>setEditC(p=>({...p,objective:v}))} placeholder="Objectif principal..."/>
          <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
            <label style={{ fontSize:9,fontWeight:700,color:"#3d5278",letterSpacing:"0.12em",textTransform:"uppercase" }}>Statut</label>
            <div style={{ display:"flex",gap:6 }}>
              {STATUS_OPTIONS.map(s=>(
                <button key={s} onClick={()=>setEditC(p=>({...p,status:s}))} style={{ flex:1,padding:"8px",borderRadius:8,border:`1px solid ${editC.status===s?(STATUS_COLOR[s]||"#1a6fff"):"#0f2040"}`,background:editC.status===s?(STATUS_COLOR[s]||"#1a6fff")+"22":"transparent",color:editC.status===s?(STATUS_COLOR[s]||"#1a6fff"):"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer" }}>{s}</button>
              ))}
            </div>
          </div>
          <div style={{ display:"flex",flexDirection:"column",gap:4 }}>
            <label style={{ fontSize:9,fontWeight:700,color:"#3d5278",letterSpacing:"0.12em",textTransform:"uppercase" }}>Notes</label>
            <textarea value={editC.notes||""} onChange={e=>setEditC(p=>({...p,notes:e.target.value}))} placeholder="Blessures, préférences..."
              style={{ background:"#000",border:"1.5px solid #0f2040",borderRadius:8,padding:"9px 10px",color:"#e8edf5",fontSize:13,fontFamily:"'Barlow',sans-serif",outline:"none",width:"100%",colorScheme:"dark",boxSizing:"border-box",resize:"none",minHeight:90 }}
              onFocus={e=>e.target.style.borderColor="#1a6fff"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
          </div>
        </div>
        <div style={{ display:"flex",gap:10,marginTop:20 }}>
          <Btn onClick={doSaveEditClient}>💾 Enregistrer</Btn>
          <Btn ghost onClick={()=>{ setEditingClient(false); setEditC(null); }}>Annuler</Btn>
        </div>
        <div style={{ marginTop:24,paddingTop:20,borderTop:"1px solid #0f2040" }}>
          <div style={{ fontSize:12,color:"#3d5278",marginBottom:12 }}>Zone dangereuse</div>
          <div style={{ display:"flex",gap:8 }}>
            <Btn small ghost onClick={()=>doArchiveClient(selId)}>📦 Archiver</Btn>
            <Btn small danger onClick={()=>setConfirmDelete(cl)}>🗑️ Supprimer</Btn>
          </div>
        </div>
      </div>
      {confirmDelete&&(
        <div style={{ position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99,padding:24 }} onClick={()=>setConfirmDelete(null)}>
          <div onClick={e=>e.stopPropagation()} className="fu" style={{ background:"#0a1628",border:"1px solid #e6394644",borderRadius:20,padding:24,width:"100%",maxWidth:360 }}>
            <div style={{ fontSize:20,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:8,color:"#e63946" }}>⚠️ Supprimer ?</div>
            <div style={{ display:"flex",gap:10 }}>
              <Btn danger onClick={()=>doDeleteClient(cl.id)}>Supprimer</Btn>
              <Btn ghost onClick={()=>setConfirmDelete(null)}>Annuler</Btn>
            </div>
          </div>
        </div>
      )}
    </>);

    return wrap(<>
      <div style={{ background:"linear-gradient(170deg,#112240 0%,#000 100%)",padding:"16px 16px 14px",borderBottom:"1px solid #0f2040" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12 }}>
          <button onClick={()=>setView("dash")} style={{ background:"none",border:"none",color:"#3d5278",cursor:"pointer",fontSize:12,fontFamily:"'Barlow',sans-serif",padding:0 }}>← Tableau de bord</button>
          <button onClick={()=>{ setEditingClient(true); setEditC({...cl}); }} style={{ background:"#112240",border:"1px solid #0f2040",borderRadius:8,padding:"5px 12px",color:"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer" }}>✏️ Modifier</button>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
          <Avatar name={cl.name} size={54}/>
          <div>
            <div style={{ fontSize:24,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1 }}>{cl.name.toUpperCase()}</div>
            <div style={{ color:"#7a90b8",fontSize:12,marginTop:3 }}>{cl.sport} · {cl.age} ans · depuis {cl.since}</div>
            <div style={{ display:"flex",gap:6,marginTop:5,flexWrap:"wrap",alignItems:"center" }}>
              <Badge label={cl.status} color={STATUS_COLOR[cl.status]||"#3d5278"}/>
              {cl.notes&&<span style={{ fontSize:10,color:"#3d5278",fontStyle:"italic" }}>{cl.notes.slice(0,40)}{cl.notes.length>40?"...":""}</span>}
            </div>
          </div>
        </div>
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:2 }}>
          {[
            {l:"Présences",v:cl.sessions.filter(s=>s.present).length,c:"#e8edf5"},
            {l:"Assiduité",v:`${att}%`,c:att>=80?"#22c55e":"#f59e0b"},
            {l:"WODs",v:cl.sessions.filter(s=>s.isWod).length,c:"#f97316"},
            {l:"Planifiées",v:(cl.planned||[]).length,c:"#1a6fff"},
            {l:"Poids",v:lw?`${lw.weight}kg`:"—",c:"#1a6fff"},
            {l:"Δ",v:wd!==null?`${wd>0?"+":""}${wd}kg`:"—",c:wd!==null?(wd<=0?"#22c55e":"#e63946"):"#3d5278"},
          ].map(s=>(
            <div key={s.l} style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:10,padding:"8px 12px",flexShrink:0 }}>
              <div style={{ fontSize:8,color:"#3d5278",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3 }}>{s.l}</div>
              <div style={{ fontSize:16,fontWeight:900,color:s.c,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"10px 14px",background:"#04080f",borderBottom:"1px solid #0f2040" }}>
        <div style={{ display:"flex",gap:2,background:"#070d1a",borderRadius:10,padding:3,border:"1px solid #0f2040",overflowX:"auto" }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1,padding:"8px 4px",borderRadius:8,border:"none",cursor:"pointer",background:tab===t.id?"#112240":"transparent",color:tab===t.id?"#e8edf5":"#3d5278",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",transition:"all .2s",borderBottom:tab===t.id?"2px solid #1a6fff":"2px solid transparent",flexShrink:0,whiteSpace:"nowrap" }}>{t.label}</button>
          ))}
        </div>
      </div>

      {/* ── NEXT SESSION WIDGET — visible sur tous les onglets ── */}
      <div style={{ padding:"12px 14px 0" }}>
        <NextSessionWidget
          client={cl}
          allTemplates={allTemplates}
          allWods={allWods}
          onStartSession={(plan)=>setLiveSession(plan)}
        />
      </div>

      <div style={{ padding:"0 14px 14px" }}>

        {tab==="calendar"&&(
          <CalendarTab
            client={cl}
            allTemplates={allTemplates}
            allWods={allWods}
            onUpdate={(patch)=>up(selId,patch)}
            onSaveWod={saveOneWod}
          />
        )}

        {tab==="sessions"&&<div className="fu">
          <MonthlyReport sessions={cl.sessions} metrics={cl.metrics}/>
          {!showNewSession?(
            <div style={{ marginBottom:16 }}>
              {suggestedTpl&&(
                <div style={{ background:`${suggestedTpl.color||"#1a6fff"}11`,border:`1px solid ${suggestedTpl.color||"#1a6fff"}44`,borderRadius:14,padding:12,marginBottom:10 }}>
                  <div style={{ fontSize:10,color:"#7a90b8",marginBottom:6 }}>{suggestedTpl.type==="wod"?"🏋️ WOD suggéré":"💡 Suggestion basée sur l'historique"}</div>
                  <div style={{ display:"flex",alignItems:"center",gap:10 }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",color:suggestedTpl.color||"#1a6fff" }}>{suggestedTpl.name}</div>
                      <div style={{ fontSize:11,color:"#3d5278" }}>{suggestedTpl.type==="wod"?`${suggestedTpl.description} · ${suggestedTpl.movements?.length} mouvements`:`${suggestedTpl.exercises?.length} exercices`}</div>
                    </div>
                    <Btn small onClick={()=>{ setShowNewSession(true); applyTemplateToSession(suggestedTpl); }} color={suggestedTpl.color||"#1a6fff"}>Utiliser →</Btn>
                  </div>
                </div>
              )}
              <div style={{ display:"flex",gap:8 }}>
                <button onClick={()=>{ setShowNewSession(true); setSessionMode("normal"); }} style={{ flex:1,background:"#070d1a",border:"2px dashed #1a6fff44",borderRadius:14,padding:"14px",color:"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                  💪 Séance
                </button>
                <button onClick={()=>{ setShowNewSession(true); setSessionMode("wod"); }} style={{ flex:1,background:"#070d1a",border:"2px dashed #f9741644",borderRadius:14,padding:"14px",color:"#f97316",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
                  🏋️ WOD
                </button>
              </div>
            </div>
          ):(
            <div style={{ background:"#070d1a",border:`1px solid ${sessionMode==="wod"?"#f9741644":"#1a6fff44"}`,borderRadius:14,padding:14,marginBottom:16 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                <SecTitle c={sessionMode==="wod"?"🏋️ Nouveau WOD":"💪 Nouvelle séance"}/>
                <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                  <div style={{ display:"flex",gap:2,background:"#0a1628",borderRadius:8,padding:2 }}>
                    <button onClick={()=>{ setSessionMode("normal"); setPendingWod(null); }} style={{ padding:"4px 10px",borderRadius:6,border:"none",cursor:"pointer",background:sessionMode==="normal"?"#1a6fff":"transparent",color:sessionMode==="normal"?"#fff":"#3d5278",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase" }}>💪</button>
                    <button onClick={()=>{ setSessionMode("wod"); setPendingSession({exercises:[]}); }} style={{ padding:"4px 10px",borderRadius:6,border:"none",cursor:"pointer",background:sessionMode==="wod"?"#f97316":"transparent",color:sessionMode==="wod"?"#fff":"#3d5278",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase" }}>🏋️</button>
                  </div>
                  <button onClick={()=>{ setShowNewSession(false); setNewS({date:"",present:true,duration:"",note:""}); setPendingSession({exercises:[]}); setPendingWod(null); setShowExPicker(false); setShowTemplatePicker(false); setShowWodCreator(false); setSessionMode("normal"); }} style={{ background:"none",border:"none",color:"#3d5278",cursor:"pointer",fontSize:18,padding:0 }}>✕</button>
                </div>
              </div>
              <button onClick={()=>setShowTemplatePicker(!showTemplatePicker)} style={{ width:"100%",background:"#0a1628",border:`1px solid ${sessionMode==="wod"?"#f9741644":"#1a6fff44"}`,borderRadius:8,padding:"8px 14px",color:sessionMode==="wod"?"#f97316":"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                {sessionMode==="wod"?"🏋️":"📋"} {showTemplatePicker?"Fermer":sessionMode==="wod"?"Choisir un WOD":"Choisir un template"}
              </button>
              {showTemplatePicker&&<TemplatePicker allTemplates={allTemplates} allWods={allWods} onSelect={applyTemplateToSession} onClose={()=>setShowTemplatePicker(false)}/>}
              {sessionMode==="wod"&&(<>
                {pendingWod?(
                  <div style={{ marginBottom:10 }}>
                    <div style={{ background:pendingWod.color+"11",border:`1px solid ${pendingWod.color}33`,borderRadius:12,padding:12,marginBottom:10 }}>
                      <div style={{ fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",color:pendingWod.color }}>{pendingWod.name}</div>
                      <div style={{ fontSize:11,color:"#3d5278" }}>{pendingWod.description}</div>
                    </div>
                    <Field label="Score / Résultat" value={pendingWod.score||""} onChange={v=>setPendingWod(p=>({...p,score:v}))} placeholder="ex. 18 rounds ou 12:34"/>
                    <div style={{ marginTop:8 }}><button onClick={()=>setPendingWod(null)} style={{ background:"none",border:"none",color:"#3d5278",cursor:"pointer",fontSize:11,fontFamily:"'Barlow',sans-serif",padding:0 }}>← Changer de WOD</button></div>
                  </div>
                ):(
                  !showTemplatePicker&&(
                    <div style={{ marginBottom:10 }}>
                      <button onClick={()=>setShowWodCreator(!showWodCreator)} style={{ width:"100%",background:"#0a1628",border:"1px solid #f9741644",borderRadius:8,padding:"8px 14px",color:"#f97316",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:10 }}>
                        ✏️ {showWodCreator?"Fermer":"Créer un WOD personnalisé"}
                      </button>
                      {showWodCreator&&<WodCreator onSave={(wod)=>{ setPendingWod({...wod,score:""}); setShowWodCreator(false); saveOneWod(wod); }} onClose={()=>setShowWodCreator(false)}/>}
                    </div>
                  )
                )}
              </>)}
              {sessionMode==="normal"&&pendingSession.templateId&&(
                <div style={{ background:"#f9741611",border:"1px solid #f9741633",borderRadius:8,padding:"6px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8 }}>
                  <span style={{ fontSize:11,color:"#f97316" }}>📋 Template : <b>{allTemplates.find(t=>t.id===pendingSession.templateId)?.name||"Custom"}</b></span>
                  <button onClick={()=>setPendingSession(p=>({...p,templateId:null}))} style={{ background:"none",border:"none",color:"#3d5278",cursor:"pointer",fontSize:12,padding:0,marginLeft:"auto" }}>✕</button>
                </div>
              )}
              <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:10 }}>
                <Field label="Date" type="date" value={newS.date} onChange={v=>setNewS(p=>({...p,date:v}))} half/>
                <Field label="Durée min" type="number" value={newS.duration} onChange={v=>setNewS(p=>({...p,duration:v}))} placeholder="60" half/>
                <div style={{ width:"100%",display:"flex",alignItems:"center",gap:8 }}>
                  <input type="checkbox" checked={newS.present} onChange={e=>setNewS(p=>({...p,present:e.target.checked}))} style={{ accentColor:"#22c55e",width:16,height:16 }}/>
                  <span style={{ fontSize:13,color:"#7a90b8",fontWeight:600 }}>Client présent(e)</span>
                </div>
                <Field label="Notes" value={newS.note} onChange={v=>setNewS(p=>({...p,note:v}))} placeholder="Observations..."/>
              </div>
              {sessionMode==="normal"&&(<>
                <button onClick={()=>setShowExPicker(!showExPicker)} style={{ width:"100%",background:"#0a1628",border:"1px solid #1a6fff44",borderRadius:8,padding:"8px 14px",color:"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:showExPicker?10:0,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                  💪 {showExPicker?"Fermer":"Ajouter des exercices manuellement"}
                </button>
                {showExPicker&&<SessionExercisePicker onAdd={addExercisesToSession} onClose={()=>setShowExPicker(false)}/>}
                {pendingSession.exercises.length>0&&(
                  <div style={{ marginTop:10,marginBottom:10 }}>
                    <div style={{ fontSize:10,color:"#3d5278",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8 }}>Exercices ({pendingSession.exercises.length})</div>
                    {pendingSession.exercises.map((ex,i)=>(
                      <ExerciseFields key={i} ex={ex} idx={i} onChange={updatePendingEx} onRemove={()=>removeSessionEx(i)}/>
                    ))}
                  </div>
                )}
              </>)}
              <div style={{ marginTop:12 }}><Btn onClick={doAddSession} color={sessionMode==="wod"?"#f97316":undefined}>{sessionMode==="wod"?"🏋️ Enregistrer le WOD":"💪 Enregistrer la séance"}</Btn></div>
            </div>
          )}

          {editingSession&&(
            <div style={{ position:"fixed",inset:0,background:"#000e",display:"flex",alignItems:"flex-end",zIndex:99 }} onClick={()=>setEditingSession(null)}>
              <div onClick={e=>e.stopPropagation()} className="fu" style={{ background:"#0a1628",border:"1px solid #0f2040",borderRadius:"20px 20px 0 0",padding:"24px 18px 40px",width:"100%",maxHeight:"90vh",overflowY:"auto" }}>
                <div style={{ width:36,height:4,borderRadius:99,background:"#0f2040",margin:"0 auto 18px" }}/>
                <SecTitle c="Modifier la séance"/>
                <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:12 }}>
                  <Field label="Date" type="date" value={editingSession.date} onChange={v=>setEditingSession(p=>({...p,date:v}))} half/>
                  <Field label="Durée min" type="number" value={String(editingSession.duration||"")} onChange={v=>setEditingSession(p=>({...p,duration:+v}))} placeholder="60" half/>
                  <div style={{ width:"100%",display:"flex",alignItems:"center",gap:8 }}>
                    <input type="checkbox" checked={editingSession.present} onChange={e=>setEditingSession(p=>({...p,present:e.target.checked}))} style={{ accentColor:"#22c55e",width:16,height:16 }}/>
                    <span style={{ fontSize:13,color:"#7a90b8",fontWeight:600 }}>Client présent(e)</span>
                  </div>
                  <Field label="Notes" value={editingSession.note||""} onChange={v=>setEditingSession(p=>({...p,note:v}))} placeholder="Observations..."/>
                  {editingSession.isWod&&<Field label="Score WOD" value={editingSession.wodScore||""} onChange={v=>setEditingSession(p=>({...p,wodScore:v}))} placeholder="ex. 18 rounds"/>}
                </div>
                {!editingSession.isWod&&(editingSession.exercises||[]).map((ex,i)=>(
                  <ExerciseFields key={i} ex={ex} idx={i} onChange={updateEditSessionEx} onRemove={()=>removeEditSessionEx(i)}/>
                ))}
                <div style={{ display:"flex",gap:10,marginTop:14 }}>
                  <Btn onClick={doSaveEditSession}>💾 Enregistrer</Btn>
                  <Btn ghost onClick={()=>setEditingSession(null)}>Annuler</Btn>
                </div>
              </div>
            </div>
          )}

          {sortedMonths.length===0?(
            <div style={{ textAlign:"center",color:"#3d5278",padding:40 }}>Aucune séance enregistrée</div>
          ):sortedMonths.map(month=>{
            const [year,m]=month.split("-");
            const label=`${MONTH_NAMES[m]||m} ${year}`;
            const sessions=[...sessionsByMonth[month]].sort((a,b)=>b.date.localeCompare(a.date));
            return(
              <div key={month} style={{ marginBottom:20 }}>
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <div style={{ flex:1,height:1,background:"#0f2040" }}/>
                  <span style={{ fontSize:10,fontWeight:700,color:"#3d5278",letterSpacing:"0.1em",textTransform:"uppercase",flexShrink:0 }}>{label}</span>
                  <div style={{ flex:1,height:1,background:"#0f2040" }}/>
                </div>
                {sessions.map((s,i)=>{
                  const sTpl=s.templateId?[...allTemplates,...allWods].find(t=>t.id===s.templateId):null;
                  const fmt=s.isWod?WOD_FORMATS.find(f=>f.id===s.wodFormat):null;
                  return(
                    <SwipeToDelete key={s.id} onDelete={()=>up(selId,{sessions:cl.sessions.filter(ss=>ss.id!==s.id)})}>
                      <div className="ch fu" style={{ background:"#070d1a",border:`1px solid ${s.isWod?"#f9741633":"#0f2040"}`,borderRadius:12,padding:"12px 14px" }}>
                        <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                          <div style={{ width:8,height:8,borderRadius:"50%",background:s.present?"#22c55e":"#e63946",marginTop:5,flexShrink:0 }}/>
                          <div style={{ flex:1 }}>
                            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4 }}>
                              <div>
                                <span style={{ fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",fontSize:15 }}>{s.date}</span>
                                {s.isWod&&<span style={{ marginLeft:6,fontSize:11,color:"#f97316",fontWeight:700 }}>🏋️ WOD</span>}
                                {sTpl&&<span style={{ marginLeft:6,fontSize:10,color:sTpl.color||"#1a6fff",fontWeight:700 }}>{sTpl.name}</span>}
                              </div>
                              <div style={{ display:"flex",gap:6,alignItems:"center" }}>
                                {s.duration>0&&<span style={{ fontSize:11,color:"#3d5278" }}>{s.duration}min</span>}
                                <Badge label={s.present?"Présent":"Absent"} color={s.present?"#22c55e":"#e63946"}/>
                                <button onClick={e=>{ e.stopPropagation(); setEditingSession({...s,exercises:[...(s.exercises||[])]}); }} style={{ background:"#112240",border:"1px solid #0f2040",borderRadius:6,padding:"3px 8px",color:"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,cursor:"pointer" }}>✏️</button>
                              </div>
                            </div>
                            {s.note&&<div style={{ color:"#7a90b8",fontSize:12,marginTop:3 }}>{s.note}</div>}
                            {s.isWod&&(
                              <div style={{ marginTop:8,background:"#f9741611",borderRadius:8,padding:"8px 10px",border:"1px solid #f9741633" }}>
                                {fmt&&<div style={{ fontSize:11,fontWeight:800,color:"#f97316",marginBottom:4 }}>{fmt.icon} {s.wodFormat?.toUpperCase()} {s.wodDuration?`— ${s.wodDuration} min`:""}</div>}
                                {s.exercises?.map((ex,j)=>(
                                  <div key={j} style={{ display:"flex",alignItems:"center",gap:6,padding:"3px 0" }}>
                                    <span style={{ color:"#f97316",fontSize:10 }}>•</span>
                                    <span style={{ fontSize:11,color:"#e8edf5",flex:1 }}>{ex.name}</span>
                                    {ex.reps&&<span style={{ fontSize:10,color:"#f97316",fontWeight:700 }}>× {ex.reps}</span>}
                                  </div>
                                ))}
                                {s.wodScore&&<div style={{ marginTop:6,padding:"4px 8px",background:"#f9741622",borderRadius:6,fontSize:11,color:"#f97316",fontWeight:700 }}>🏆 Score : {s.wodScore}</div>}
                              </div>
                            )}
                            {!s.isWod&&s.exercises&&s.exercises.length>0&&(
                              <div style={{ marginTop:8 }}>
                                {s.exercises.map((ex,j)=>{
                                  const libEx=LIBRARY.find(l=>l.id===ex.libId);
                                  const isCardio=libEx?.cat==="Cardio";
                                  return(
                                    <div key={j} style={{ display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:j<s.exercises.length-1?"1px solid #0f204044":"none" }}>
                                      <div style={{ width:24,height:12,borderRadius:3,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.libId}/></div>
                                      <span style={{ fontSize:11,color:"#e8edf5",fontWeight:600,flex:1 }}>{ex.name}</span>
                                      <div style={{ display:"flex",gap:4,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end" }}>
                                        {isCardio?<>
                                          {ex.duration&&<Badge label={`${ex.duration}min`} color="#f59e0b"/>}
                                          {ex.speed&&<Badge label={`${ex.speed}km/h`} color="#22c55e"/>}
                                          {ex.watts&&<Badge label={`${ex.watts}W`} color="#8b5cf6"/>}
                                          {ex.zone&&<Badge label={`Z${ex.zone}`} color={zoneColor(ex.zone)}/>}
                                        </>:<>
                                          {ex.sets&&ex.reps&&<Badge label={`${ex.sets}×${ex.reps}`} color="#1a6fff"/>}
                                          {ex.load&&+ex.load>0&&<Badge label={`${ex.load}kg`} color="#f59e0b"/>}
                                          {ex.rpe&&<Badge label={`RPE${ex.rpe}`} color={rpeColor(ex.rpe)}/>}
                                          {ex.note&&ex.note.includes("↑")&&<Badge label="↑ Prog." color="#22c55e"/>}
                                        </>}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </SwipeToDelete>
                  );
                })}
              </div>
            );
          })}
        </div>}

        {tab==="metrics"&&<div className="fu">
          <ProgressionCharts metrics={cl.metrics}/>
          <div style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14,marginBottom:14 }}>
            <SecTitle c="Nouvelle mesure"/>
            <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
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
            return<SwipeToDelete key={m.date+i} onDelete={()=>up(selId,{metrics:cl.metrics.filter((_,idx)=>idx!==i)})}>
              <div className="ch fu" style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14 }}>
                <div style={{ display:"flex",justifyContent:"space-between",marginBottom:10 }}>
                  <span style={{ fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:"#7a90b8" }}>{m.date}</span>
                  <div style={{ textAlign:"right" }}>
                    <div style={{ fontSize:24,fontWeight:900,color:"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1 }}>{m.weight} kg</div>
                    {d!==null&&<div style={{ fontSize:11,color:d<=0?"#22c55e":"#e63946" }}>{d>0?"+":""}{d} kg</div>}
                  </div>
                </div>
                <div style={{ display:"flex",gap:12,flexWrap:"wrap" }}>
                  {m.chest>0&&<span style={{ fontSize:12,color:"#3d5278" }}>Poitrine <b style={{ color:"#e8edf5" }}>{m.chest}cm</b></span>}
                  {m.waist>0&&<span style={{ fontSize:12,color:"#3d5278" }}>Taille <b style={{ color:"#e8edf5" }}>{m.waist}cm</b></span>}
                  {m.hips>0&&<span style={{ fontSize:12,color:"#3d5278" }}>Hanches <b style={{ color:"#e8edf5" }}>{m.hips}cm</b></span>}
                  {m.fatPct>0&&<span style={{ fontSize:12,color:"#3d5278" }}>MG <b style={{ color:"#e8edf5" }}>{m.fatPct}%</b></span>}
                </div>
              </div>
            </SwipeToDelete>;
          })}
          {!cl.metrics.length&&<div style={{ textAlign:"center",color:"#3d5278",padding:40 }}>Aucune mesure enregistrée</div>}
        </div>}

        {tab==="programs"&&<div className="fu">
          <div style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14,marginBottom:14 }}>
            <SecTitle c="Nouveau programme"/>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <Field label="Nom" value={newP.name} onChange={v=>setNewP(p=>({...p,name:v}))} placeholder="ex. Push Day A"/>
              <div style={{ display:"flex",gap:8 }}>
                <Field label="Semaines" type="number" value={newP.weeks} onChange={v=>setNewP(p=>({...p,weeks:v}))} placeholder="8" half/>
                <Field label="Date début" type="date" value={newP.startDate} onChange={v=>setNewP(p=>({...p,startDate:v}))} half/>
              </div>
            </div>
            <div style={{ marginTop:12 }}><Btn onClick={doAddProgram}>Créer</Btn></div>
          </div>
          {cl.programs.map((prog,i)=>(
            <div key={prog.id} className="fu" style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,marginBottom:14,overflow:"hidden" }}>
              <div style={{ background:"#112240",padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #0f2040" }}>
                <div>
                  <div style={{ fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",fontSize:15 }}>{prog.name.toUpperCase()}</div>
                  <div style={{ fontSize:10,color:"#3d5278" }}>{prog.weeks} sem · {prog.startDate}</div>
                </div>
                <div style={{ display:"flex",gap:6 }}>
                  <Btn small ghost onClick={()=>{ setShowGenerator(!showGenerator); setGeneratorPid(prog.id); }}>🎲 Auto</Btn>
                  <Btn small onClick={()=>{ setAddingExTo(addingExTo===prog.id?null:prog.id); setPickingEx(false); }}>+ Ex.</Btn>
                </div>
              </div>
              {showGenerator&&generatorPid===prog.id&&(
                <div style={{ padding:14,background:"#000",borderBottom:"1px solid #0f2040" }}>
                  <PPLGenerator onAdd={(exs)=>doAddGeneratedExercises(prog.id,exs)}/>
                </div>
              )}
              {addingExTo===prog.id&&(
                <div style={{ padding:14,background:"#000",borderBottom:"1px solid #0f2040" }}>
                  <button onClick={()=>setPickingEx(!pickingEx)} style={{ background:"#112240",border:"1px solid #1a6fff44",borderRadius:8,padding:"7px 14px",color:"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:12,width:"100%" }}>
                    📚 {pickingEx?"Fermer":"Choisir dans la bibliothèque"}
                  </button>
                  {pickingEx&&(
                    <div>
                      <input value={libSearch} onChange={e=>setLibSearch(e.target.value)} placeholder="🔍 Rechercher..."
                        style={{ width:"100%",background:"#070d1a",border:"1.5px solid #0f2040",borderRadius:8,padding:"8px 12px",color:"#e8edf5",fontSize:13,fontFamily:"'Barlow',sans-serif",outline:"none",marginBottom:10,colorScheme:"dark",boxSizing:"border-box" }}
                        onFocus={e=>e.target.style.borderColor="#1a6fff"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
                      <div style={{ display:"flex",gap:5,marginBottom:10,overflowX:"auto",paddingBottom:4 }}>
                        {CATS.map(cat=>(
                          <button key={cat} onClick={()=>setLibCat(cat)} style={{ padding:"4px 10px",borderRadius:99,border:`1px solid ${libCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#0f2040"}`,background:libCat===cat?(CAT_COLOR[cat]||"#1a6fff")+"22":"transparent",color:libCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#7a90b8",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer",flexShrink:0 }}>{cat}</button>
                        ))}
                      </div>
                      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12,maxHeight:220,overflowY:"auto" }}>
                        {LIBRARY.filter(e=>{ const mc=libCat==="Tous"||e.cat===libCat; const ms=libSearch===""||e.name.toLowerCase().includes(libSearch.toLowerCase()); return mc&&ms; }).map(ex=>(
                          <div key={ex.id} onClick={()=>{ setNewEx(p=>({...p,name:ex.name,libId:ex.id})); setPickingEx(false); setLibSearch(""); }}
                            style={{ background:"#070d1a",border:`1px solid ${newEx.libId===ex.id?"#1a6fff":"#0f2040"}`,borderRadius:10,overflow:"hidden",cursor:"pointer" }}>
                            <AnatomySVG id={ex.id}/>
                            <div style={{ padding:"4px 6px",fontSize:9,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",color:"#7a90b8",lineHeight:1.2 }}>{ex.name}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div style={{ display:"flex",flexWrap:"wrap",gap:8 }}>
                    <Field label="Exercice" value={newEx.name} onChange={v=>setNewEx(p=>({...p,name:v}))} placeholder="ex. Squat"/>
                    <Field label="Séries" value={newEx.sets||""} onChange={v=>setNewEx(p=>({...p,sets:v}))} placeholder="4" third/>
                    <Field label="Reps" value={newEx.reps||""} onChange={v=>setNewEx(p=>({...p,reps:v}))} placeholder="8" third/>
                    <Field label="Charge" value={newEx.load||""} onChange={v=>setNewEx(p=>({...p,load:v}))} placeholder="70kg" third/>
                    <Field label="Note" value={newEx.note||""} onChange={v=>setNewEx(p=>({...p,note:v}))} placeholder="Indication..."/>
                  </div>
                  <div style={{ display:"flex",gap:8,marginTop:10 }}>
                    <Btn small onClick={()=>doAddExercise(prog.id)}>Ajouter</Btn>
                    <Btn small ghost onClick={()=>{ setAddingExTo(null); setPickingEx(false); setLibSearch(""); }}>Annuler</Btn>
                  </div>
                </div>
              )}
              {prog.exercises.map((ex,j)=>{
                const lib=LIBRARY.find(l=>l.id===ex.libId);
                const orm=calc1RM(ex.load,ex.reps);
                return(
                  <div key={j} style={{ display:"flex",alignItems:"center",padding:"11px 14px",gap:10,borderBottom:j<prog.exercises.length-1?"1px solid #0f2040":"none" }}>
                    {lib?<div style={{ width:44,height:22,borderRadius:6,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={lib.id}/></div>
                    :<div style={{ width:24,height:24,borderRadius:6,background:"#1a6fff1a",border:"1px solid #1a6fff44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#1a6fff",flexShrink:0 }}>{j+1}</div>}
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700,fontSize:14 }}>{ex.name}</div>
                      {orm&&<div style={{ fontSize:10,color:"#3d5278" }}>1RM estimé : <b style={{ color:"#1a6fff" }}>{orm}kg</b></div>}
                    </div>
                    <div style={{ display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end" }}>
                      {ex.sets&&ex.reps&&<Badge label={`${ex.sets}×${ex.reps}`} color="#1a6fff"/>}
                      {ex.load&&<Badge label={ex.load} color="#f59e0b"/>}
                    </div>
                  </div>
                );
              })}
              {!prog.exercises.length&&<div style={{ padding:"14px",color:"#3d5278",fontSize:12 }}>Aucun exercice — utilise le générateur !</div>}
            </div>
          ))}
          {!cl.programs.length&&<div style={{ textAlign:"center",color:"#3d5278",padding:40 }}>Aucun programme créé</div>}
        </div>}

        {tab==="goals"&&<div className="fu">
          <div style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14,marginBottom:14 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <span style={{ fontSize:12,fontWeight:700,color:"#7a90b8" }}>Progression globale</span>
              <span style={{ fontSize:22,fontWeight:900,color:gPct===100?"#22c55e":"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif" }}>{gPct}%</span>
            </div>
            <Bar value={gPct} color={gPct===100?"#22c55e":"#1a6fff"} h={8}/>
          </div>
          <div style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14,marginBottom:14 }}>
            <SecTitle c="Nouvel objectif"/>
            <div style={{ display:"flex",flexDirection:"column",gap:10 }}>
              <Field label="Objectif" value={newG.label} onChange={v=>setNewG(p=>({...p,label:v}))} placeholder="ex. Descendre à 85 kg"/>
              <Field label="Échéance" type="date" value={newG.deadline} onChange={v=>setNewG(p=>({...p,deadline:v}))}/>
            </div>
            <div style={{ marginTop:12 }}><Btn onClick={doAddGoal}>Ajouter</Btn></div>
          </div>
          {cl.goals.map((g,i)=>(
            <SwipeToDelete key={g.id} onDelete={()=>up(selId,{goals:cl.goals.filter(x=>x.id!==g.id)})}>
              <div className="ch fu" onClick={()=>up(selId,{goals:cl.goals.map(x=>x.id===g.id?{...x,done:!x.done}:x)})}
                style={{ background:g.done?"#22c55e0e":"#070d1a",border:`1px solid ${g.done?"#22c55e44":"#0f2040"}`,borderRadius:12,padding:"13px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12 }}>
                <div style={{ width:22,height:22,borderRadius:6,flexShrink:0,background:g.done?"#22c55e":"transparent",border:`2px solid ${g.done?"#22c55e":"#0f2040"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#000",fontWeight:900 }}>{g.done?"✓":""}</div>
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700,fontSize:14,textDecoration:g.done?"line-through":"none",color:g.done?"#7a90b8":"#e8edf5" }}>{g.label}</div>
                  {g.deadline&&<div style={{ fontSize:11,color:"#3d5278",marginTop:2 }}>Échéance : {g.deadline}</div>}
                </div>
                <Badge label={g.done?"Atteint ✓":"En cours"} color={g.done?"#22c55e":"#f59e0b"}/>
              </div>
            </SwipeToDelete>
          ))}
          {!cl.goals.length&&<div style={{ textAlign:"center",color:"#3d5278",padding:40 }}>Aucun objectif défini</div>}
        </div>}

        {tab==="charges"&&<ChargesTab sessions={cl.sessions}/>}

      </div>
    </>);
  }
  return null;
}
