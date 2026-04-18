import { useState, useEffect, useCallback } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

const T = {
  bg:"#000000", surface:"#04080f", card:"#070d1a", cardAlt:"#0a1628",
  border:"#0f2040", borderHover:"#1a3a6e", accent:"#1a6fff", navy:"#0a1628",
  navyLight:"#112240", red:"#e63946", green:"#22c55e", gold:"#f59e0b",
  text:"#e8edf5", muted:"#3d5278", mutedLight:"#7a90b8",
};

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
  const defaultSVG = (<svg style={s} viewBox="0 0 200 120" fill="none"><line x1="100" y1="4" x2="100" y2="116" stroke="#0f2040" strokeWidth="1"/><circle cx="50" cy="24" r="8" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="44" y="32" width="12" height="22" rx="4" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="36" y="36" width="8" height="18" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="56" y="36" width="8" height="18" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="42" y="54" width="7" height="24" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="51" y="54" width="7" height="24" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="41" y="78" width="6" height="20" rx="2" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="50" y="78" width="6" height="20" rx="2" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><circle cx="150" cy="24" r="8" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="144" y="32" width="12" height="22" rx="4" fill={MuscleRed} stroke="#ff6b7a" strokeWidth="1"/><rect x="136" y="36" width="8" height="18" rx="3" fill={MuscleRed} stroke="#ff6b7a" strokeWidth="1"/><rect x="156" y="36" width="8" height="18" rx="3" fill={MuscleRed} stroke="#ff6b7a" strokeWidth="1"/><rect x="142" y="54" width="7" height="24" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="151" y="54" width="7" height="24" rx="3" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="141" y="78" width="6" height="20" rx="2" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/><rect x="150" y="78" width="6" height="20" rx="2" fill={BodyColor} stroke={BodyStroke} strokeWidth="1.5"/></svg>);
  return (<div style={{ width:"100%", aspectRatio:"2/1", background:"#04080f", borderRadius:10, overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", padding:6 }}>{illustrations[id]||defaultSVG}</div>);
};

const MUSCLE_GROUPS = {
  "Pectoraux":["bench_press","incline_press","dips","cable_fly","pushup","bench_dumbbell"],
  "Épaules":["overhead_press","lateral_raise","face_pull","shrug"],
  "Triceps":["overhead_press","dips","tricep_pushdown","skull_crusher","bench_press"],
  "Dorsaux":["pullup","barbell_row","dumbbell_row","lat_pulldown","deadlift"],
  "Biceps":["pullup","bicep_curl","hammer_curl","barbell_row"],
  "Quadriceps":["squat","lunge","leg_press","bulgarian_split","rdl"],
  "Ischio-jamb.":["deadlift","rdl","leg_curl","glute_bridge","lunge"],
  "Fessiers":["squat","rdl","glute_bridge","bulgarian_split","lunge","hip90"],
  "Abdominaux":["plank","ab_crunch","mountainclimber"],
  "Cardio":["run","bike","burpee","jumpingjack","jump_rope","box_jump","battle_rope","rowing_machine","hiit_sprint","assault_bike","kettlebell_swing"],
  "Mobilité":["hip90","pigeon","catcow","worldsgreatest","thoracic_rot","hip_flexor","ankle_mob","foam_roll","shoulder_mob"],
};

const LIBRARY = [
  { id:"squat",           name:"Squat",                cat:"Legs",       muscles:"Quadriceps, Fessiers, Ischio",      tip:"Pieds largeur épaules, genoux dans l'axe." },
  { id:"deadlift",        name:"Deadlift",             cat:"Pull",       muscles:"Ischio-jambiers, Lombaires, Fessiers", tip:"Dos plat, barre proche du corps." },
  { id:"bench_press",     name:"Développé couché",     cat:"Push",       muscles:"Pectoraux, Triceps, Épaules ant.",  tip:"Omoplates rétractées, coudes à 45°." },
  { id:"pullup",          name:"Traction",             cat:"Pull",       muscles:"Grand dorsal, Biceps, Rhomboïdes",  tip:"Dépression scapulaire avant de tirer." },
  { id:"lunge",           name:"Fente avant",          cat:"Legs",       muscles:"Quadriceps, Fessiers, Mollets",     tip:"Genou avant à 90°, genou arrière près du sol." },
  { id:"overhead_press",  name:"Développé militaire",  cat:"Push",       muscles:"Épaules, Triceps, Trapèzes",        tip:"Gainage abdominal, barre dans l'axe." },
  { id:"barbell_row",     name:"Rowing barre",         cat:"Pull",       muscles:"Grand dorsal, Rhomboïdes, Biceps",  tip:"Dos plat, tirage vers le nombril." },
  { id:"hip90",           name:"Hip 90/90",            cat:"Mobilité",   muscles:"Rotateurs hanche, Fessiers",        tip:"Deux jambes à 90°, bascule lente." },
  { id:"burpee",          name:"Burpee",               cat:"Cardio",     muscles:"Full body, Explosivité",            tip:"Planche stricte en bas, saut explosif." },
  { id:"run",             name:"Course / Jogging",     cat:"Cardio",     muscles:"Quadriceps, Ischio, Mollets",       tip:"Foulée médio-pied, 170-180 pas/min." },
  { id:"dips",            name:"Dips",                 cat:"Push",       muscles:"Triceps, Pectoraux inférieurs",     tip:"Légère inclinaison avant pour les pectoraux." },
  { id:"lateral_raise",   name:"Élévations latérales", cat:"Push",       muscles:"Deltoïdes latéraux",                tip:"Coudes légèrement fléchis, jusqu'à l'horizontal." },
  { id:"bicep_curl",      name:"Curl biceps",          cat:"Pull",       muscles:"Biceps, Brachial",                  tip:"Coudes fixes, supination en haut." },
  { id:"lat_pulldown",    name:"Tirage poulie haute",  cat:"Pull",       muscles:"Grand dorsal, Biceps",              tip:"Tirage vers le sternum." },
  { id:"rdl",             name:"Romanian Deadlift",    cat:"Legs",       muscles:"Ischio-jambiers, Fessiers",         tip:"Charnière hanche, dos plat." },
  { id:"leg_press",       name:"Presse à cuisses",     cat:"Legs",       muscles:"Quadriceps, Fessiers",              tip:"Pieds à largeur d'épaules, genoux dans l'axe." },
  { id:"leg_curl",        name:"Leg curl",             cat:"Legs",       muscles:"Ischio-jambiers",                   tip:"Contraction complète, descente contrôlée." },
  { id:"calf_raise",      name:"Mollets debout",       cat:"Legs",       muscles:"Mollets, Soléaire",                 tip:"Amplitude complète, pause en haut." },
  { id:"glute_bridge",    name:"Pont fessier",         cat:"Legs",       muscles:"Fessiers, Ischio-jambiers",         tip:"Poussée sur les talons, contraction en haut." },
  { id:"bulgarian_split", name:"Fente bulgare",        cat:"Legs",       muscles:"Quadriceps, Fessiers",              tip:"Pied arrière surélevé, genou avant à 90°." },
  { id:"pushup",          name:"Pompes",               cat:"Push",       muscles:"Pectoraux, Triceps, Épaules",       tip:"Corps gainé, coudes à 45°." },
  { id:"plank",           name:"Gainage planche",      cat:"Musculation",muscles:"Abdominaux, Lombaires, Épaules",    tip:"Corps aligné, hanches ne tombent pas." },
  { id:"ab_crunch",       name:"Crunch abdominaux",    cat:"Musculation",muscles:"Grand droit abdominal",             tip:"Expiration en montant, ne pas tirer la nuque." },
  { id:"hammer_curl",     name:"Curl marteau",         cat:"Pull",       muscles:"Biceps, Brachioradial",             tip:"Prise neutre, coudes fixes." },
  { id:"face_pull",       name:"Face pull",            cat:"Pull",       muscles:"Deltoïdes post., Rhomboïdes",       tip:"Tirer vers le visage, coudes hauts." },
  { id:"cable_fly",       name:"Écarté poulie",        cat:"Push",       muscles:"Pectoraux, Deltoïdes ant.",         tip:"Légère flexion des coudes, arc de cercle." },
  { id:"skull_crusher",   name:"Skull crusher",        cat:"Push",       muscles:"Triceps long",                      tip:"Coudes fixes, descente vers le front." },
  { id:"shrug",           name:"Haussements épaules",  cat:"Pull",       muscles:"Trapèzes supérieurs",               tip:"Mouvement vertical pur, pas de rotation." },
  { id:"pigeon",          name:"Pigeon yoga",          cat:"Mobilité",   muscles:"Psoas, Rotateurs hanche",           tip:"Hanches au sol, 60-90s par côté." },
  { id:"catcow",          name:"Chat / Vache",         cat:"Mobilité",   muscles:"Rachis, Multifides",                tip:"Mouvement fluide avec la respiration." },
  { id:"worldsgreatest",  name:"World's Greatest",     cat:"Mobilité",   muscles:"Full body, Hanche, Thoracique",     tip:"Rotation thoracique complète." },
  { id:"thoracic_rot",    name:"Rotation thoracique",  cat:"Mobilité",   muscles:"Rachis thoracique, Obliques",       tip:"Regard suit la main, amplitude max." },
  { id:"hip_flexor",      name:"Étirement psoas",      cat:"Mobilité",   muscles:"Psoas, Quadriceps",                 tip:"Bassin en rétroversion, avancer doucement." },
  { id:"ankle_mob",       name:"Mobilité cheville",    cat:"Mobilité",   muscles:"Tibial antérieur, Mollets",         tip:"Genou dans l'axe du pied, talon au sol." },
  { id:"foam_roll",       name:"Foam roll dos",        cat:"Mobilité",   muscles:"Érecteurs, Thoracique",             tip:"Pause 20-30s sur les zones tendues." },
  { id:"bike",            name:"Vélo / Cycling",       cat:"Cardio",     muscles:"Quadriceps, Fessiers, Cardio",      tip:"Selle à hauteur de hanche, 80-90 rpm." },
  { id:"rowing_machine",  name:"Rameur",               cat:"Cardio",     muscles:"Full body, Dos, Cardio",            tip:"Jambes d'abord, puis dos, puis bras." },
  { id:"jumpingjack",     name:"Jumping Jack",         cat:"Cardio",     muscles:"Cardio, Coordination",              tip:"Rythme constant, atterrissage amorti." },
  { id:"mountainclimber", name:"Mountain Climber",     cat:"Cardio",     muscles:"Abdominaux, Cardio, Épaules",       tip:"Hanches basses, genoux qui remontent vite." },
  { id:"jump_rope",       name:"Corde à sauter",       cat:"Cardio",     muscles:"Mollets, Cardio, Coordination",     tip:"Sauts légers, poignets qui tournent." },
  { id:"box_jump",        name:"Box Jump",             cat:"Cardio",     muscles:"Quadriceps, Fessiers, Explosivité", tip:"Atterrissage amorti, hanches en arrière." },
  { id:"battle_rope",     name:"Battle Rope",          cat:"Cardio",     muscles:"Épaules, Bras, Cardio",             tip:"Genoux fléchis, ondulations continues." },
  { id:"kettlebell_swing",name:"Kettlebell Swing",     cat:"Cardio",     muscles:"Fessiers, Ischio, Épaules",         tip:"Charnière hanche, projection des hanches." },
  { id:"hiit_sprint",     name:"Sprint HIIT",          cat:"Cardio",     muscles:"Full body, Explosivité",            tip:"Effort max 20s, récup 40s." },
  { id:"incline_press",   name:"Développé incliné",    cat:"Push",       muscles:"Pectoraux sup., Épaules",           tip:"Inclinaison 30-45°, contrôle en descente." },
  { id:"tricep_pushdown", name:"Pushdown triceps",     cat:"Push",       muscles:"Triceps",                           tip:"Coudes fixes contre le corps." },
  { id:"dumbbell_row",    name:"Rowing haltère",       cat:"Pull",       muscles:"Grand dorsal, Rhomboïdes",          tip:"Coude près du corps, tirage jusqu'à la hanche." },
  { id:"bench_dumbbell",  name:"Développé haltères",   cat:"Push",       muscles:"Pectoraux, Triceps",                tip:"Grande amplitude, coudes à 45°." },
  { id:"assault_bike",    name:"Assault bike",         cat:"Cardio",     muscles:"Full body, Bras, Cardio",           tip:"Push/pull simultané bras et jambes." },
  { id:"shoulder_mob",    name:"Mobilité épaule",      cat:"Mobilité",   muscles:"Coiffe des rotateurs",              tip:"Mouvements lents et contrôlés." },
];

const CATS = ["Tous","Push","Pull","Legs","Musculation","Mobilité","Cardio"];
const CAT_COLOR = { Push:"#1a6fff", Pull:"#8b5cf6", Legs:"#22c55e", Musculation:"#1a6fff", Mobilité:"#22c55e", Cardio:"#f59e0b" };
const MONTH_NAMES = { "01":"Janvier","02":"Février","03":"Mars","04":"Avril","05":"Mai","06":"Juin","07":"Juillet","08":"Août","09":"Septembre","10":"Octobre","11":"Novembre","12":"Décembre" };

const SAMPLE_CLIENTS = [{
  id:"tony", name:"Tony Parker", age:41, sport:"Basketball", since:"2024-01", status:"actif",
  objective:"Maintien forme & mobilité", progress:78,
  sessions:[
    { id:"s1", date:"2026-04-15", present:true,  duration:90, note:"Mobilité hanches + renforcement excentrique", exercises:[] },
    { id:"s2", date:"2026-04-10", present:true,  duration:75, note:"Cardio HIIT", exercises:[] },
    { id:"s3", date:"2026-03-03", present:false, duration:0,  note:"Absent — voyage", exercises:[] },
  ],
  metrics:[
    { date:"2026-04-01", weight:92.0, chest:104, waist:86, hips:98, fatPct:14.2 },
    { date:"2026-03-01", weight:93.5, chest:105, waist:87, hips:99, fatPct:14.8 },
    { date:"2026-02-01", weight:95.0, chest:106, waist:89, hips:100, fatPct:15.5 },
  ],
  programs:[{ id:"p1", name:"Mobilité & Renforcement", weeks:8, startDate:"2026-03-01",
    exercises:[
      { id:"e1", name:"Hip 90/90", sets:"3", reps:"45s", load:"", note:"Chaque côté", libId:"hip90" },
      { id:"e2", name:"Deadlift",  sets:"4", reps:"8",   load:"60kg", note:"", libId:"deadlift" },
    ]
  }],
  goals:[
    { id:"g1", label:"Descendre à 90 kg",               done:false, deadline:"2026-06-01" },
    { id:"g2", label:"Masse grasse < 13%",               done:false, deadline:"2026-07-01" },
    { id:"g3", label:"30 min course sans douleur genou", done:true,  deadline:"2026-03-01" },
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

const Bar = ({ value, color, h=5 }) => (
  <div style={{ background:"#0f2040", borderRadius:99, height:h, overflow:"hidden" }}>
    <div style={{ height:"100%", borderRadius:99, background:color||"#1a6fff", width:`${Math.min(100,Math.max(0,value))}%`, transition:"width .7s", boxShadow:`0 0 8px ${color||"#1a6fff"}55` }}/>
  </div>
);

const Field = ({ label, value, onChange, type="text", placeholder, half }) => (
  <div style={{ display:"flex", flexDirection:"column", gap:4, width:half?"calc(50% - 4px)":"100%", flexShrink:0 }}>
    {label && <label style={{ fontSize:9, fontWeight:700, color:"#3d5278", letterSpacing:"0.12em", textTransform:"uppercase", fontFamily:"'Barlow',sans-serif" }}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{ background:"#000", border:"1.5px solid #0f2040", borderRadius:8, padding:"9px 10px", color:"#e8edf5", fontSize:13, fontFamily:"'Barlow',sans-serif", outline:"none", width:"100%", colorScheme:"dark", boxSizing:"border-box" }}
      onFocus={e=>e.target.style.borderColor="#1a6fff"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
  </div>
);

const Btn = ({ children, onClick, ghost, small, danger }) => (
  <button onClick={onClick} style={{ padding:small?"6px 14px":"10px 22px", borderRadius:8, cursor:"pointer", border:ghost?"1.5px solid #0f2040":danger?"1.5px solid #e6394644":"none", background:ghost?"transparent":danger?"#e6394618":"#1a6fff", color:ghost?"#7a90b8":danger?"#e63946":"#fff", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:800, fontSize:small?11:14, letterSpacing:"0.06em", textTransform:"uppercase", transition:"all .15s" }}>{children}</button>
);

const SecTitle = ({ c }) => (
  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
    <div style={{ width:3, height:16, borderRadius:99, background:"#1a6fff" }}/>
    <span style={{ fontSize:11, fontWeight:700, color:"#1a6fff", letterSpacing:"0.1em", textTransform:"uppercase", fontFamily:"'Barlow Condensed',sans-serif" }}>{c}</span>
  </div>
);

const SwipeToDelete = ({ children, onDelete }) => {
  const [startX, setStartX] = useState(null);
  const [offsetX, setOffsetX] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const threshold = -75;
  function onTouchStart(e) { setStartX(e.touches[0].clientX); }
  function onTouchMove(e) {
    if (startX===null||confirming) return;
    const diff = e.touches[0].clientX - startX;
    if (diff<0) setOffsetX(Math.max(diff,-100));
    else if (revealed) setOffsetX(Math.min(diff-100,0));
  }
  function onTouchEnd() {
    setStartX(null);
    if (offsetX<threshold) { setOffsetX(-100); setRevealed(true); }
    else { setOffsetX(0); setRevealed(false); }
  }
  function handleDelete() {
    setConfirming(true);
    setTimeout(()=>{ onDelete(); setConfirming(false); setOffsetX(0); setRevealed(false); },300);
  }
  function handleCancel() { setOffsetX(0); setRevealed(false); }
  return (
    <div style={{ position:"relative", overflow:"hidden", borderRadius:14, marginBottom:10 }}>
      <div style={{ position:"absolute", right:0, top:0, bottom:0, width:100, display:"flex", flexDirection:"column", borderRadius:"0 14px 14px 0", overflow:"hidden" }}>
        <button onClick={handleDelete} style={{ flex:1, background:"#e63946", border:"none", cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:2 }}>
          <span style={{ fontSize:16 }}>🗑️</span>
          <span style={{ color:"#fff", fontSize:9, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase" }}>Supprimer</span>
        </button>
        <button onClick={handleCancel} style={{ flex:0.6, background:"#0f2040", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ color:"#7a90b8", fontSize:9, fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, letterSpacing:"0.06em", textTransform:"uppercase" }}>Annuler</span>
        </button>
      </div>
      <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
        style={{ transform:`translateX(${confirming?-120:offsetX}px)`, transition:startX?'none':'transform .3s ease', position:"relative", zIndex:1 }}>
        {children}
      </div>
    </div>
  );
};

const StatusDot = ({ status }) => {
  const color = status==="live"?"#22c55e":status==="connecting"?"#f59e0b":"#3d5278";
  const label = status==="live"?"Sync temps réel active":status==="connecting"?"Connexion Firebase...":"Mode local";
  return (
    <div style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 14px", background:"#04080f", borderBottom:"1px solid #0f2040" }}>
      <div style={{ width:6, height:6, borderRadius:"50%", background:color, boxShadow:status==="live"?`0 0 6px ${color}`:"none" }}/>
      <span style={{ fontSize:10, color:"#3d5278", fontFamily:"'Barlow',sans-serif" }}>{label}</span>
    </div>
  );
};

const ProgressionCharts = ({ metrics }) => {
  if (!metrics||metrics.length<2) return (
    <div style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:14, padding:16, marginBottom:14, textAlign:"center", color:"#3d5278", fontSize:12 }}>
      Ajoute au moins 2 mesures pour voir les graphiques 📈
    </div>
  );
  const sorted = [...metrics].reverse();
  const MiniChart = ({ data, label, color, unit="" }) => {
    const vals = data.filter(v=>v>0);
    if (vals.length<2) return null;
    const min = Math.min(...vals)-1;
    const max = Math.max(...vals)+1;
    const W=260, H=60;
    const pts = data.map((v,i)=>({ x:(i/(data.length-1))*(W-20)+10, y:v>0?H-((v-min)/(max-min))*(H-16)-4:null, v })).filter(p=>p.y!==null);
    const path = pts.map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
    const area = `${path} L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`;
    const delta = vals[vals.length-1]-vals[0];
    const isGood = (label==="Poids"||label==="MG %") ? delta<=0 : delta>=0;
    return (
      <div style={{ background:"#04080f", borderRadius:10, padding:"12px 14px", marginBottom:10, border:"1px solid #0f2040" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
          <span style={{ fontSize:11, fontWeight:700, color:"#7a90b8", textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</span>
          <div style={{ display:"flex", gap:10, alignItems:"center" }}>
            <span style={{ fontSize:11, color:"#3d5278" }}>{vals[0]}{unit}</span>
            <span style={{ fontSize:11, color:isGood?"#22c55e":"#e63946", fontWeight:700 }}>{delta>0?"+":""}{delta.toFixed(1)}{unit}</span>
            <span style={{ fontSize:14, fontWeight:900, color, fontFamily:"'Barlow Condensed',sans-serif" }}>{vals[vals.length-1]}{unit}</span>
          </div>
        </div>
        <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
          {[0,1,2].map(i=>(<line key={i} x1="10" y1={H-i*(H-16)/2-4} x2={W-10} y2={H-i*(H-16)/2-4} stroke="#0f2040" strokeWidth="1" strokeDasharray="4,4"/>))}
          <path d={area} fill={color} opacity="0.08"/>
          <path d={path} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          {pts.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke="#000" strokeWidth="1.5"/>))}
        </svg>
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
          <span style={{ fontSize:9, color:"#3d5278" }}>{sorted[0]?.date?.slice(5)}</span>
          <span style={{ fontSize:9, color:"#3d5278" }}>{sorted[sorted.length-1]?.date?.slice(5)}</span>
        </div>
      </div>
    );
  };
  return (
    <div style={{ marginBottom:14 }}>
      <div style={{ fontSize:11, fontWeight:700, color:"#1a6fff", letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:12, display:"flex", alignItems:"center", gap:8 }}>
        <div style={{ width:3, height:16, borderRadius:99, background:"#1a6fff" }}/>TABLEAUX DE PROGRESSION
      </div>
      <MiniChart data={sorted.map(m=>m.weight)} label="Poids" color="#1a6fff" unit="kg"/>
      <MiniChart data={sorted.map(m=>m.fatPct)} label="MG %" color="#e63946" unit="%"/>
      <MiniChart data={sorted.map(m=>m.waist)} label="Taille" color="#f59e0b" unit="cm"/>
      <MiniChart data={sorted.map(m=>m.chest)} label="Poitrine" color="#8b5cf6" unit="cm"/>
      <MiniChart data={sorted.map(m=>m.hips)} label="Hanches" color="#22c55e" unit="cm"/>
    </div>
  );
};

const SessionExercisePicker = ({ onAdd, onClose }) => {
  const [mode, setMode] = useState("cat");
  const [selCat, setSelCat] = useState("Push");
  const [selMuscle, setSelMuscle] = useState("Pectoraux");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState([]);
  const filtered = LIBRARY.filter(ex=>{
    if (search) return ex.name.toLowerCase().includes(search.toLowerCase())||ex.muscles.toLowerCase().includes(search.toLowerCase());
    if (mode==="cat") return ex.cat===selCat;
    if (mode==="muscle") return (MUSCLE_GROUPS[selMuscle]||[]).includes(ex.id);
    return true;
  });
  function toggleEx(ex) { setSelected(prev=>prev.find(e=>e.id===ex.id)?prev.filter(e=>e.id!==ex.id):[...prev,ex]); }
  function confirm() { onAdd(selected); onClose(); }
  return (
    <div style={{ background:"#0a1628", border:"1px solid #0f2040", borderRadius:12, padding:12, marginBottom:10 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10 }}>
        <span style={{ fontSize:11, fontWeight:700, color:"#1a6fff", textTransform:"uppercase", letterSpacing:"0.08em" }}>Choisir des exercices</span>
        <Btn small ghost onClick={onClose}>✕</Btn>
      </div>
      <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..."
        style={{ width:"100%", background:"#000", border:"1.5px solid #0f2040", borderRadius:8, padding:"7px 10px", color:"#e8edf5", fontSize:12, fontFamily:"'Barlow',sans-serif", outline:"none", marginBottom:8, colorScheme:"dark", boxSizing:"border-box" }}
        onFocus={e=>e.target.style.borderColor="#1a6fff"} onBlur={e=>e.target.style.borderColor="#0f2040"}/>
      {!search&&(
        <>
          <div style={{ display:"flex", gap:5, marginBottom:8 }}>
            <button onClick={()=>setMode("cat")} style={{ padding:"4px 12px", borderRadius:99, border:`1px solid ${mode==="cat"?"#1a6fff":"#0f2040"}`, background:mode==="cat"?"#1a6fff22":"transparent", color:mode==="cat"?"#1a6fff":"#7a90b8", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, textTransform:"uppercase", cursor:"pointer" }}>Type</button>
            <button onClick={()=>setMode("muscle")} style={{ padding:"4px 12px", borderRadius:99, border:`1px solid ${mode==="muscle"?"#22c55e":"#0f2040"}`, background:mode==="muscle"?"#22c55e22":"transparent", color:mode==="muscle"?"#22c55e":"#7a90b8", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, textTransform:"uppercase", cursor:"pointer" }}>Muscle</button>
          </div>
          {mode==="cat"&&(
            <div style={{ display:"flex", gap:4, marginBottom:8, overflowX:"auto", paddingBottom:4 }}>
              {["Push","Pull","Legs","Musculation","Mobilité","Cardio"].map(cat=>(
                <button key={cat} onClick={()=>setSelCat(cat)} style={{ padding:"3px 10px", borderRadius:99, border:`1px solid ${selCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#0f2040"}`, background:selCat===cat?(CAT_COLOR[cat]||"#1a6fff")+"22":"transparent", color:selCat===cat?(CAT_COLOR[cat]||"#1a6fff"):"#7a90b8", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:10, textTransform:"uppercase", cursor:"pointer", flexShrink:0 }}>{cat}</button>
              ))}
            </div>
          )}
          {mode==="muscle"&&(
            <div style={{ display:"flex", gap:4, marginBottom:8, overflowX:"auto", paddingBottom:4 }}>
              {Object.keys(MUSCLE_GROUPS).map(mg=>(
                <button key={mg} onClick={()=>setSelMuscle(mg)} style={{ padding:"3px 10px", borderRadius:99, border:`1px solid ${selMuscle===mg?"#22c55e":"#0f2040"}`, background:selMuscle===mg?"#22c55e22":"transparent", color:selMuscle===mg?"#22c55e":"#7a90b8", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:9, textTransform:"uppercase", cursor:"pointer", flexShrink:0 }}>{mg}</button>
              ))}
            </div>
          )}
        </>
      )}
      <div style={{ maxHeight:200, overflowY:"auto", display:"flex", flexDirection:"column", gap:5, marginBottom:10 }}>
        {filtered.map(ex=>{
          const isSel = selected.find(e=>e.id===ex.id);
          return (
            <div key={ex.id} onClick={()=>toggleEx(ex)}
              style={{ display:"flex", alignItems:"center", gap:8, padding:"7px 10px", borderRadius:8, border:`1px solid ${isSel?"#1a6fff44":"#0f2040"}`, background:isSel?"#1a6fff0a":"transparent", cursor:"pointer" }}>
              <div style={{ width:32, height:16, borderRadius:4, overflow:"hidden", flexShrink:0 }}><AnatomySVG id={ex.id}/></div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontWeight:700, fontSize:12, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{ex.name}</div>
                <div style={{ fontSize:9, color:"#3d5278" }}>{ex.muscles}</div>
              </div>
              <div style={{ width:18, height:18, borderRadius:5, border:`2px solid ${isSel?"#1a6fff":"#0f2040"}`, background:isSel?"#1a6fff":"transparent", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontSize:10, color:"#fff", fontWeight:900 }}>{isSel?"✓":""}</div>
            </div>
          );
        })}
        {filtered.length===0&&<div style={{ textAlign:"center", color:"#3d5278", padding:16, fontSize:11 }}>Aucun exercice trouvé</div>}
      </div>
      {selected.length>0&&(
        <Btn small onClick={confirm}>✅ Ajouter {selected.length} exercice{selected.length>1?"s":""}</Btn>
      )}
    </div>
  );
};

const PPLGenerator = ({ onAdd }) => {
  const [type, setType] = useState("Push");
  const [generated, setGenerated] = useState([]);
  const TYPES = {
    Push:["bench_press","overhead_press","incline_press","dips","lateral_raise","tricep_pushdown","cable_fly","pushup","bench_dumbbell"],
    Pull:["pullup","barbell_row","deadlift","lat_pulldown","face_pull","bicep_curl","hammer_curl","dumbbell_row"],
    Legs:["squat","rdl","lunge","bulgarian_split","leg_press","leg_curl","calf_raise","glute_bridge"],
    Cardio:["run","bike","burpee","jumpingjack","mountainclimber","jump_rope","box_jump","battle_rope","kettlebell_swing"],
    Mobilité:["hip90","pigeon","catcow","worldsgreatest","thoracic_rot","hip_flexor","ankle_mob","foam_roll"],
  };
  function generate() {
    const pool=TYPES[type]||[];
    const shuffled=[...pool].sort(()=>Math.random()-.5);
    const count=type==="Cardio"||type==="Mobilité"?5:6;
    setGenerated(shuffled.slice(0,count).map(id=>{ const ex=LIBRARY.find(l=>l.id===id); return ex?{...ex,sets:type==="Cardio"?"4":type==="Mobilité"?"3":"4",reps:type==="Cardio"?"30s":type==="Mobilité"?"60s":"8-12",load:""}:null; }).filter(Boolean));
  }
  return (
    <div style={{ background:"#070d1a", border:"1px solid #0f2040", borderRadius:14, padding:14, marginBottom:14 }}>
      <SecTitle c="🎲 Générateur de séance"/>
      <div style={{ display:"flex", gap:5, marginBottom:12, overflowX:"auto", paddingBottom:4 }}>
        {Object.keys(TYPES).map(t=>(
          <button key={t} onClick={()=>{setType(t);setGenerated([]);}} style={{ padding:"5px 12px", borderRadius:99, border:`1px solid ${type===t?(CAT_COLOR[t]||"#1a6fff"):"#0f2040"}`, background:type===t?(CAT_COLOR[t]||"#1a6fff")+"22":"transparent", color:type===t?(CAT_COLOR[t]||"#1a6fff"):"#7a90b8", fontFamily:"'Barlow Condensed',sans-serif", fontWeight:700, fontSize:11, textTransform:"uppercase", cursor:"pointer", flexShrink:0 }}>{t}</button>
        ))}
      </div>
      <Btn small onClick={generate}>🎲 Générer une séance {type}</Btn>
      {generated.length>0&&(
        <div style={{ marginTop:12 }}>
          {generated.map((ex,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:10, padding:"8px 0", borderBottom:i<generated.length-1?"1px solid #0f2040":"none" }}>
              <div style={{ width:36, height:18, borderRadius:6, overflow:"hidden", flexShrink:0 }}><AnatomySVG id={ex.id}/></div>
              <div style={{ flex:1 }}><div style={{ fontWeight:700, fontSize:13 }}>{ex.name}</div><div style={{ fontSize:10, color:"#3d5278" }}>{ex.muscles}</div></div>
              <Badge label={`${ex.sets}×${ex.reps}`} color={CAT_COLOR[ex.cat]||"#1a6fff"}/>
            </div>
          ))}
          <div style={{ marginTop:12, display:"flex", gap:8 }}>
            <Btn small onClick={()=>onAdd(generated)}>✅ Ajouter au programme</Btn>
            <Btn small ghost onClick={generate}>🔄 Regénérer</Btn>
          </div>
        </div>
      )}
    </div>
  );
};
export default function App() {
  const [clients, setClients] = useState(SAMPLE_CLIENTS);
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
  const [newC, setNewC] = useState({ name:"", age:"", sport:"", objective:"" });
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

  const cl = clients.find(c=>c.id===selId);

  useEffect(()=>{
    const unsub = onSnapshot(doc(db,"coach","data"), snap=>{
      if (snap.exists()) { setClients(snap.data().clients||[]); }
      else { saveToFirebase(SAMPLE_CLIENTS); }
      setFbStatus("live");
    }, ()=>setFbStatus("local"));
    return unsub;
  },[]);

  const saveToFirebase = useCallback(async(data)=>{
    try { await setDoc(doc(db,"coach","data"),{clients:data,updatedAt:Date.now()}); }
    catch(e) { console.error(e); }
  },[]);

  const sync = useCallback((updated)=>{ setClients(updated); saveToFirebase(updated); },[saveToFirebase]);
  const up = (id,patch) => sync(clients.map(c=>c.id===id?{...c,...patch}:c));

  const openClient = (id) => {
    setSelId(id);
    setView("client");
    setTab("sessions");
    setShowNewSession(false);
    setNewS({date:"",present:true,duration:"",note:""});
    setPendingSession({exercises:[]});
    setShowExPicker(false);
  };

  function doAddClient() {
    if (!newC.name.trim()) return;
    sync([...clients,{id:"c"+Date.now(),...newC,age:+newC.age,since:new Date().toISOString().slice(0,7),status:"actif",progress:0,sessions:[],metrics:[],programs:[],goals:[]}]);
    setNewC({name:"",age:"",sport:"",objective:""}); setAddOpen(false);
  }

  function doAddSession() {
    if (!newS.date||!cl) return;
    const sess = { id:"s"+Date.now(), ...newS, present:newS.present===true, duration:+newS.duration, exercises:pendingSession.exercises||[] };
    up(selId,{sessions:[sess,...cl.sessions]});
    setNewS({date:"",present:true,duration:"",note:""});
    setPendingSession({exercises:[]});
    setShowExPicker(false);
    setShowNewSession(false);
  }

  function addExercisesToSession(exs) {
    setPendingSession(p=>({...p,exercises:[...p.exercises,...exs.map(ex=>({id:"se"+Date.now()+Math.random(),libId:ex.id,name:ex.name,sets:"3",reps:"10",load:"",note:""}))]}));
  }

  function removeSessionEx(idx) {
    setPendingSession(p=>({...p,exercises:p.exercises.filter((_,i)=>i!==idx)}));
  }

  function doAddMetric() {
    if (!newM.date||!newM.weight||!cl) return;
    up(selId,{metrics:[{...newM,weight:+newM.weight,chest:+newM.chest,waist:+newM.waist,hips:+newM.hips,fatPct:+newM.fatPct},...cl.metrics]});
    setNewM({date:"",weight:"",chest:"",waist:"",hips:"",fatPct:""});
  }

  function doAddGoal() {
    if (!newG.label.trim()||!cl) return;
    up(selId,{goals:[...cl.goals,{id:"g"+Date.now(),...newG,done:false}]});
    setNewG({label:"",deadline:""});
  }

  function doAddProgram() {
    if (!newP.name.trim()||!cl) return;
    up(selId,{programs:[...cl.programs,{id:"p"+Date.now(),...newP,weeks:+newP.weeks,exercises:[]}]});
    setNewP({name:"",weeks:"8",startDate:""});
  }

  function doAddExercise(pid) {
    if (!newEx.name.trim()||!cl) return;
    up(selId,{programs:cl.programs.map(p=>p.id===pid?{...p,exercises:[...p.exercises,{id:"e"+Date.now(),...newEx}]}:p)});
    setNewEx({name:"",sets:"",reps:"",load:"",note:"",libId:""}); setAddingExTo(null); setPickingEx(false);
  }

  function doAddGeneratedExercises(pid,exercises) {
    if (!cl) return;
    const newExs = exercises.map(ex=>({id:"e"+Date.now()+Math.random(),name:ex.name,sets:ex.sets,reps:ex.reps,load:"",note:"",libId:ex.id}));
    up(selId,{programs:cl.programs.map(p=>p.id===pid?{...p,exercises:[...p.exercises,...newExs]}:p)});
    setShowGenerator(false); setGeneratorPid(null);
  }

  const wrap = (children) => (
    <div style={{ minHeight:"100vh", background:"#000", color:"#e8edf5", fontFamily:"'Barlow',sans-serif", paddingBottom:48 }}>
      <style>{GLOBAL_CSS}</style><StatusDot status={fbStatus}/>{children}
    </div>
  );

  // ── LIBRARY ────────────────────────────────────────────────────────────────
  if (view==="library") {
    const filtered = LIBRARY.filter(e=>{
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
                {libSel===ex.id&&(
                  <div style={{ marginTop:8,padding:"8px 10px",background:"#000",borderRadius:8,border:"1px solid #0f2040" }}>
                    <div style={{ fontSize:11,color:"#e8edf5" }}>💡 {ex.tip}</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        {filtered.length===0&&<div style={{ textAlign:"center",color:"#3d5278",padding:40 }}>Aucun exercice trouvé</div>}
      </div>
    );
  }

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  if (view==="dash") {
    const total=clients.reduce((a,c)=>a+c.sessions.filter(s=>s.present).length,0);
    const actif=clients.filter(c=>c.status==="actif").length;
    const att=clients.length?Math.round(clients.reduce((a,c)=>{ if(!c.sessions.length)return a; return a+c.sessions.filter(s=>s.present).length/c.sessions.length; },0)/clients.length*100):0;
    return wrap(<>
      <div style={{ padding:"20px 16px 0" }}>
        <div style={{ display:"flex",alignItems:"center",gap:7,marginBottom:4 }}>
          <div style={{ width:6,height:6,borderRadius:"50%",background:"#1a6fff",boxShadow:"0 0 8px #1a6fff" }}/>
          <span style={{ fontSize:10,color:"#1a6fff",fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase" }}>Logan Lagarde · Coaching Individuel</span>
        </div>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16 }}>
          <div style={{ fontSize:34,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:-0.5,lineHeight:1 }}>MES CLIENTS</div>
          <div style={{ display:"flex",gap:8 }}>
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
          return (
            <div key={c.id} className="ch fu" onClick={()=>openClient(c.id)}
              style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:15,marginBottom:10,cursor:"pointer",animationDelay:`${i*.05}s` }}>
              <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:10 }}>
                <Avatar name={c.name}/>
                <div style={{ flex:1,minWidth:0 }}>
                  <div style={{ fontWeight:900,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis" }}>{c.name.toUpperCase()}</div>
                  <div style={{ color:"#7a90b8",fontSize:12,marginTop:1 }}>{c.sport} · {c.objective}</div>
                </div>
                <div style={{ display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0 }}>
                  <Badge label={c.status} color={c.status==="actif"?"#22c55e":"#3d5278"}/>
                  {lw&&<span style={{ fontSize:13,fontWeight:800,color:"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif" }}>{lw.weight}kg</span>}
                </div>
              </div>
              <div style={{ display:"flex",gap:14,fontSize:11,color:"#3d5278",marginBottom:8 }}>
                <span>📅 <b style={{ color:"#7a90b8" }}>{c.sessions.length}</b></span>
                <span>✅ <b style={{ color:a2>=80?"#22c55e":"#f59e0b" }}>{a2}%</b></span>
                <span>🎯 <b style={{ color:"#7a90b8" }}>{c.goals.filter(g=>g.done).length}/{c.goals.length}</b></span>
              </div>
              <Bar value={c.progress} color="#1a6fff"/>
            </div>
          );
        })}
        {!clients.length&&<div style={{ textAlign:"center",color:"#3d5278",padding:60 }}>Aucun client — ajoutes-en un !</div>}
      </div>
      {addOpen&&(
        <div style={{ position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"flex-end",zIndex:99 }} onClick={()=>setAddOpen(false)}>
          <div onClick={e=>e.stopPropagation()} className="fu" style={{ background:"#0a1628",border:"1px solid #0f2040",borderRadius:"20px 20px 0 0",padding:"24px 18px 40px",width:"100%",maxHeight:"88vh",overflowY:"auto" }}>
            <div style={{ width:36,height:4,borderRadius:99,background:"#0f2040",margin:"0 auto 18px" }}/>
            <div style={{ fontSize:22,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:16 }}>NOUVEAU CLIENT</div>
            <div style={{ display:"flex",flexDirection:"column",gap:11 }}>
              <Field label="Nom complet" value={newC.name} onChange={v=>setNewC(p=>({...p,name:v}))} placeholder="ex. Thomas Dupont"/>
              <div style={{ display:"flex",gap:8 }}>
                <Field label="Âge" type="number" value={newC.age} onChange={v=>setNewC(p=>({...p,age:v}))} placeholder="30" half/>
                <Field label="Sport" value={newC.sport} onChange={v=>setNewC(p=>({...p,sport:v}))} placeholder="Basketball..." half/>
              </div>
              <Field label="Objectif" value={newC.objective} onChange={v=>setNewC(p=>({...p,objective:v}))} placeholder="Perte de poids, Performance..."/>
            </div>
            <div style={{ display:"flex",gap:10,marginTop:16 }}>
              <Btn onClick={doAddClient}>Ajouter</Btn>
              <Btn ghost onClick={()=>setAddOpen(false)}>Annuler</Btn>
            </div>
          </div>
        </div>
      )}
    </>);
  }

  // ── CLIENT DETAIL ──────────────────────────────────────────────────────────
  if (view==="client"&&cl) {
    const att=cl.sessions.length?Math.round(cl.sessions.filter(s=>s.present).length/cl.sessions.length*100):0;
    const lw=cl.metrics[0],pw=cl.metrics[1];
    const wd=lw&&pw?+(lw.weight-pw.weight).toFixed(1):null;
    const done=cl.goals.filter(g=>g.done).length;
    const gPct=cl.goals.length?Math.round(done/cl.goals.length*100):0;
    const TABS=[{id:"sessions",label:"Séances"},{id:"metrics",label:"Métriques"},{id:"programs",label:"Programme"},{id:"goals",label:"Objectifs"}];

    // Group sessions by month
    const sessionsByMonth = cl.sessions.reduce((acc,s)=>{
      const month = s.date?s.date.slice(0,7):"inconnu";
      if (!acc[month]) acc[month]=[];
      acc[month].push(s);
      return acc;
    },{});
    const sortedMonths = Object.keys(sessionsByMonth).sort((a,b)=>b.localeCompare(a));

    return wrap(<>
      <div style={{ background:"linear-gradient(170deg,#112240 0%,#000 100%)",padding:"16px 16px 14px",borderBottom:"1px solid #0f2040" }}>
        <button onClick={()=>setView("dash")} style={{ background:"none",border:"none",color:"#3d5278",cursor:"pointer",fontSize:12,marginBottom:12,fontFamily:"'Barlow',sans-serif",padding:0 }}>← Tableau de bord</button>
        <div style={{ display:"flex",alignItems:"center",gap:14,marginBottom:14 }}>
          <Avatar name={cl.name} size={54}/>
          <div>
            <div style={{ fontSize:24,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1 }}>{cl.name.toUpperCase()}</div>
            <div style={{ color:"#7a90b8",fontSize:12,marginTop:3 }}>{cl.sport} · {cl.age} ans · depuis {cl.since}</div>
            <div style={{ marginTop:5 }}><Badge label={cl.status} color="#22c55e"/></div>
          </div>
        </div>
        <div style={{ display:"flex",gap:6,overflowX:"auto",paddingBottom:2 }}>
          {[
            {l:"Présences",v:cl.sessions.filter(s=>s.present).length,c:"#e8edf5"},
            {l:"Assiduité",v:`${att}%`,c:att>=80?"#22c55e":"#f59e0b"},
            {l:"Poids",v:lw?`${lw.weight}kg`:"—",c:"#1a6fff"},
            {l:"Δ",v:wd!==null?`${wd>0?"+":""}${wd}kg`:"—",c:wd!==null?(wd<=0?"#22c55e":"#e63946"):"#3d5278"},
            {l:"Objectifs",v:`${done}/${cl.goals.length}`,c:"#1a6fff"},
          ].map(s=>(
            <div key={s.l} style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:10,padding:"8px 12px",flexShrink:0 }}>
              <div style={{ fontSize:8,color:"#3d5278",fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3 }}>{s.l}</div>
              <div style={{ fontSize:16,fontWeight:900,color:s.c,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1 }}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"10px 14px",background:"#04080f",borderBottom:"1px solid #0f2040" }}>
        <div style={{ display:"flex",gap:2,background:"#070d1a",borderRadius:10,padding:3,border:"1px solid #0f2040" }}>
          {TABS.map(t=>(
            <button key={t.id} onClick={()=>setTab(t.id)} style={{ flex:1,padding:"8px 4px",borderRadius:8,border:"none",cursor:"pointer",background:tab===t.id?"#112240":"transparent",color:tab===t.id?"#e8edf5":"#3d5278",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",transition:"all .2s",borderBottom:tab===t.id?"2px solid #1a6fff":"2px solid transparent" }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ padding:"14px" }}>

        {/* ── SESSIONS ── */}
        {tab==="sessions"&&<div className="fu">

          {/* Bouton + Nouvelle séance */}
          {!showNewSession?(
            <button onClick={()=>setShowNewSession(true)} style={{ width:"100%",background:"#070d1a",border:"2px dashed #1a6fff44",borderRadius:14,padding:"14px",color:"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
              + Nouvelle séance
            </button>
          ):(
            <div style={{ background:"#070d1a",border:"1px solid #1a6fff44",borderRadius:14,padding:14,marginBottom:16 }}>
              <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14 }}>
                <SecTitle c="Nouvelle séance"/>
                <button onClick={()=>{ setShowNewSession(false); setNewS({date:"",present:true,duration:"",note:""}); setPendingSession({exercises:[]}); setShowExPicker(false); }} style={{ background:"none",border:"none",color:"#3d5278",cursor:"pointer",fontSize:18,padding:0 }}>✕</button>
              </div>
              <div style={{ display:"flex",flexWrap:"wrap",gap:8,marginBottom:10 }}>
                <Field label="Date" type="date" value={newS.date} onChange={v=>setNewS(p=>({...p,date:v}))} half/>
                <Field label="Durée min" type="number" value={newS.duration} onChange={v=>setNewS(p=>({...p,duration:v}))} placeholder="60" half/>
                <div style={{ width:"100%",display:"flex",alignItems:"center",gap:8 }}>
                  <input type="checkbox" checked={newS.present} onChange={e=>setNewS(p=>({...p,present:e.target.checked}))} style={{ accentColor:"#22c55e",width:16,height:16 }}/>
                  <span style={{ fontSize:13,color:"#7a90b8",fontWeight:600 }}>Client présent(e)</span>
                </div>
                <Field label="Notes" value={newS.note} onChange={v=>setNewS(p=>({...p,note:v}))} placeholder="Observations..."/>
              </div>
              <button onClick={()=>setShowExPicker(!showExPicker)} style={{ width:"100%",background:"#0a1628",border:"1px solid #1a6fff44",borderRadius:8,padding:"8px 14px",color:"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:showExPicker?10:0,display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
                💪 {showExPicker?"Fermer":"Ajouter des exercices"}
              </button>
              {showExPicker&&<SessionExercisePicker onAdd={addExercisesToSession} onClose={()=>setShowExPicker(false)}/>}
              {pendingSession.exercises.length>0&&(
                <div style={{ marginTop:10,marginBottom:10 }}>
                  <div style={{ fontSize:10,color:"#3d5278",fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:6 }}>Exercices sélectionnés ({pendingSession.exercises.length})</div>
                  {pendingSession.exercises.map((ex,i)=>(
                    <div key={i} style={{ display:"flex",alignItems:"center",gap:8,padding:"6px 8px",background:"#0a1628",borderRadius:8,marginBottom:4 }}>
                      <div style={{ width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={ex.libId}/></div>
                      <span style={{ flex:1,fontSize:12,fontWeight:600 }}>{ex.name}</span>
                      <button onClick={()=>removeSessionEx(i)} style={{ background:"none",border:"none",color:"#e63946",cursor:"pointer",fontSize:14,padding:0 }}>✕</button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop:12 }}><Btn onClick={doAddSession}>Enregistrer la séance</Btn></div>
            </div>
          )}

          {/* Sessions groupées par mois */}
          {sortedMonths.length===0?(
            <div style={{ textAlign:"center",color:"#3d5278",padding:40 }}>Aucune séance enregistrée</div>
          ):sortedMonths.map(month=>{
            const [year,m] = month.split("-");
            const label = `${MONTH_NAMES[m]||m} ${year}`;
            const sessions = [...sessionsByMonth[month]].sort((a,b)=>b.date.localeCompare(a.date));
            return (
              <div key={month} style={{ marginBottom:20 }}>
                {/* Month divider */}
                <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:10 }}>
                  <div style={{ flex:1,height:1,background:"#0f2040" }}/>
                  <span style={{ fontSize:10,fontWeight:700,color:"#3d5278",letterSpacing:"0.1em",textTransform:"uppercase",flexShrink:0 }}>{label}</span>
                  <div style={{ flex:1,height:1,background:"#0f2040" }}/>
                </div>
                {sessions.map((s,i)=>(
                  <div key={s.id} className="ch fu" style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:12,padding:"12px 14px",marginBottom:8 }}>
                    <div style={{ display:"flex",gap:10,alignItems:"flex-start" }}>
                      <div style={{ width:8,height:8,borderRadius:"50%",background:s.present?"#22c55e":"#e63946",marginTop:5,flexShrink:0 }}/>
                      <div style={{ flex:1 }}>
                        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center" }}>
                          <span style={{ fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",fontSize:15 }}>{s.date}</span>
                          <div style={{ display:"flex",gap:6 }}>
                            {s.duration>0&&<span style={{ fontSize:11,color:"#3d5278" }}>{s.duration}min</span>}
                            <Badge label={s.present?"Présent":"Absent"} color={s.present?"#22c55e":"#e63946"}/>
                          </div>
                        </div>
                        {s.note&&<div style={{ color:"#7a90b8",fontSize:12,marginTop:3 }}>{s.note}</div>}
                        {s.exercises&&s.exercises.length>0&&(
                          <div style={{ marginTop:8,display:"flex",flexWrap:"wrap",gap:4 }}>
                            {s.exercises.map((ex,j)=>(
                              <div key={j} style={{ display:"flex",alignItems:"center",gap:4,background:"#0a1628",borderRadius:6,padding:"3px 7px" }}>
                                <div style={{ width:20,height:10,borderRadius:3,overflow:"hidden" }}><AnatomySVG id={ex.libId}/></div>
                                <span style={{ fontSize:10,color:"#7a90b8" }}>{ex.name}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>}

        {/* ── METRICS ── */}
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
            return <SwipeToDelete key={m.date+i} onDelete={()=>up(selId,{metrics:cl.metrics.filter((_,idx)=>idx!==i)})}>
              <div className="ch fu" style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14,animationDelay:`${i*.04}s` }}>
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

        {/* ── PROGRAMS ── */}
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
                    <Field label="Séries" value={newEx.sets} onChange={v=>setNewEx(p=>({...p,sets:v}))} placeholder="4" half/>
                    <Field label="Reps" value={newEx.reps} onChange={v=>setNewEx(p=>({...p,reps:v}))} placeholder="8" half/>
                    <Field label="Charge" value={newEx.load} onChange={v=>setNewEx(p=>({...p,load:v}))} placeholder="70kg" half/>
                    <Field label="Note" value={newEx.note} onChange={v=>setNewEx(p=>({...p,note:v}))} placeholder="Indication..." half/>
                  </div>
                  <div style={{ display:"flex",gap:8,marginTop:10 }}>
                    <Btn small onClick={()=>doAddExercise(prog.id)}>Ajouter</Btn>
                    <Btn small ghost onClick={()=>{ setAddingExTo(null); setPickingEx(false); setLibSearch(""); }}>Annuler</Btn>
                  </div>
                </div>
              )}
              {prog.exercises.map((ex,j)=>{
                const lib=LIBRARY.find(l=>l.id===ex.libId);
                return <div key={j} style={{ display:"flex",alignItems:"center",padding:"11px 14px",gap:10,borderBottom:j<prog.exercises.length-1?"1px solid #0f2040":"none" }}>
                  {lib?<div style={{ width:44,height:22,borderRadius:6,overflow:"hidden",flexShrink:0 }}><AnatomySVG id={lib.id}/></div>
                  :<div style={{ width:24,height:24,borderRadius:6,background:"#1a6fff1a",border:"1px solid #1a6fff44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:"#1a6fff",flexShrink:0 }}>{j+1}</div>}
                  <div style={{ flex:1 }}>
                    <div style={{ fontWeight:700,fontSize:14 }}>{ex.name}</div>
                    {ex.note&&<div style={{ fontSize:11,color:"#3d5278" }}>{ex.note}</div>}
                  </div>
                  <div style={{ display:"flex",gap:5 }}>
                    {ex.sets&&<Badge label={`${ex.sets}×${ex.reps}`} color="#1a6fff"/>}
                    {ex.load&&<Badge label={ex.load} color="#f59e0b"/>}
                  </div>
                </div>;
              })}
              {!prog.exercises.length&&<div style={{ padding:"14px",color:"#3d5278",fontSize:12 }}>Aucun exercice — utilise le générateur ou ajoutes-en un !</div>}
            </div>
          ))}
          {!cl.programs.length&&<div style={{ textAlign:"center",color:"#3d5278",padding:40 }}>Aucun programme créé</div>}
        </div>}

        {/* ── GOALS ── */}
        {tab==="goals"&&<div className="fu">
          <div style={{ background:"#070d1a",border:"1px solid #0f2040",borderRadius:14,padding:14,marginBottom:14 }}>
            <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10 }}>
              <span style={{ fontSize:12,fontWeight:700,color:"#7a90b8" }}>Progression globale</span>
              <span style={{ fontSize:22,fontWeight:900,color:gPct===100?"#22c55e":"#1a6fff",fontFamily:"'Barlow Condensed',sans-serif" }}>{gPct}%</span>
            </div>
            <Bar value={gPct} color={gPct===100?"#22c55e":"#1a6fff"} h={8}/>
            <div style={{ marginTop:8,fontSize:11,color:"#3d5278" }}>{done}/{cl.goals.length} objectif{done>1?"s":""} atteint{done>1?"s":""}</div>
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
            <div key={g.id} className="ch fu" onClick={()=>up(selId,{goals:cl.goals.map(x=>x.id===g.id?{...x,done:!x.done}:x)})}
              style={{ background:g.done?"#22c55e0e":"#070d1a",border:`1px solid ${g.done?"#22c55e44":"#0f2040"}`,borderRadius:12,padding:"13px 14px",marginBottom:8,cursor:"pointer",display:"flex",alignItems:"center",gap:12,animationDelay:`${i*.04}s` }}>
              <div style={{ width:22,height:22,borderRadius:6,flexShrink:0,background:g.done?"#22c55e":"transparent",border:`2px solid ${g.done?"#22c55e":"#0f2040"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#000",fontWeight:900 }}>{g.done?"✓":""}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontWeight:700,fontSize:14,textDecoration:g.done?"line-through":"none",color:g.done?"#7a90b8":"#e8edf5" }}>{g.label}</div>
                {g.deadline&&<div style={{ fontSize:11,color:"#3d5278",marginTop:2 }}>Échéance : {g.deadline}</div>}
              </div>
              <Badge label={g.done?"Atteint ✓":"En cours"} color={g.done?"#22c55e":"#f59e0b"}/>
            </div>
          ))}
          {!cl.goals.length&&<div style={{ textAlign:"center",color:"#3d5278",padding:40 }}>Aucun objectif défini</div>}
        </div>}

      </div>
    </>);
  }
  return null;
}
