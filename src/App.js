import { useState, useEffect, useCallback, useRef, createContext, useContext } from "react";
import { db } from "./firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";

// ── TRANSLATIONS ──────────────────────────────────────────────────────────────
const TRANSLATIONS = {
  fr: {
    myClients:"Mes clients", active:"Actifs", sessions:"Séances", attendance:"Assiduité",
    addClient:"+ Client", templates:"Templates", library:"Bibliothèque",
    noClients:"Aucun client — ajoutes-en un !",
    newClient:"Nouveau client", fullName:"Nom complet", age:"Âge", sport:"Sport",
    objective:"Objectif", notes:"Notes", add:"Ajouter", cancel:"Annuler",
    namePlaceholder:"ex. Thomas Dupont", agePlaceholder:"30",
    sportPlaceholder:"Basketball...", objectivePlaceholder:"Perte de poids, Performance...",
    notesPlaceholder:"Blessures, préférences...",
    back:"← Tableau de bord", edit:"✏️ Modifier", since:"depuis",
    presences:"Présences", assiduity:"Assiduité", wods:"WODs", weight:"Poids",
    tabSessions:"Séances", tabCalendar:"📅 Planning", tabMetrics:"Métriques",
    tabPrograms:"Programme", tabGoals:"Objectifs", tabCharges:"Charges",
    newSession:"+ Nouvelle séance", sessionTitle:"Nouvelle séance",
    sessionWod:"Nouveau WOD", date:"Date", duration:"Durée min",
    present:"Client présent(e)", sessionNotes:"Observations...",
    chooseTemplate:"Choisir un template", chooseWod:"Choisir un WOD",
    addExercises:"Choisir des exercices", addExercisesManual:"Ajouter des exercices manuellement",
    saveSession:"💪 Enregistrer la séance", saveWod:"🏋️ Enregistrer le WOD",
    noSessions:"Aucune séance enregistrée",
    present_badge:"Présent", absent_badge:"Absent",
    score:"Score / Résultat", changeWod:"← Changer de WOD",
    createCustomWod:"✏️ Créer un WOD personnalisé",
    exercises:"Exercices", sets:"Séries", reps:"Reps", loadKg:"Charge kg",
    restSec:"Repos sec", note:"Note", remark:"Remarque...",
    monthlyReport:"Bilan", weightDelta:"Δ Poids", vsPrev:"vs mois préc.",
    newMeasure:"Nouvelle mesure", weightKg:"Poids (kg)", chest:"Poitrine cm",
    waist:"Taille cm", hips:"Hanches cm", fatPct:"Masse grasse %", save:"Enregistrer",
    noMetrics:"Aucune mesure enregistrée", progressCharts:"Tableaux de progression",
    newProgram:"Nouveau programme", weeks:"Semaines", startDate:"Date début",
    create:"Créer", noPrograms:"Aucun programme créé",
    auto:"🎲 Auto", addExercise:"+ Ex.", chooseLib:"Choisir dans la bibliothèque",
    exercise:"Exercice", load:"Charge", indication:"Indication...",
    oneRm:"1RM estimé", noExercises:"Aucun exercice — utilise le générateur !",
    globalProgress:"Progression globale", newGoal:"Nouvel objectif",
    goal:"Objectif", deadline:"Échéance", goalPlaceholder:"ex. Descendre à 85 kg",
    achieved:"Atteint ✓", inProgress:"En cours", noGoals:"Aucun objectif défini",
    recordsTitle:"Records & 1RM estimés", noCharges:"Aucune charge enregistrée",
    noChargesSub:"Ajoute des exercices avec charges dans tes séances",
    libraryTitle:"Bibliothèque", searchLib:"🔍 Rechercher un exercice ou muscle...",
    plannedSessions:"📅 Prochaines séances planifiées", planWhat:"Que veux-tu planifier ?",
    planTemplate:"Depuis un template", planTemplateSub:"Push Day, Back Day, Leg Day...",
    planWod:"Un WOD", planWodSub:"Benchmarks ou WOD custom",
    planCustom:"Séance sur mesure", planCustomSub:"Choisir les exercices librement",
    planNote:"Note (optionnel)", plan:"📋 Planifier", planWodBtn:"🏋️ Planifier le WOD",
    planCustomBtn:"💪 Planifier la séance", alreadyPlanned:"📋 Déjà planifié",
    deleteplan:"🗑️ Supprimer", sessionDone:"✅ Séance effectuée", wodDone:"🏋️ WOD effectué",
    scoreLabel:"🏆 Score :", sessionName:"Nom de la séance", sessionNamePh:"ex. Upper Body...",
    back_simple:"← Retour", benchmarks:"Benchmarks", myWods:"Mes WODs", createWodBtn:"✏️ Créer",
    noCustomWods:"Aucun WOD custom — créés-en un !",
    thisWeek:"CETTE SEMAINE", noSessionWeek:"Aucune séance cette semaine",
    noSessionWeekSub:"Va dans Planning pour en planifier une",
    startSession:"▶ DÉMARRER LA SÉANCE", today:"AUJOURD'HUI",
    inProgress_label:"EN COURS", close:"✕ Fermer", finalScore:"Score final",
    sessionInfos:"Infos de la séance", finish:"✅ TERMINER & ENREGISTRER",
    editProfile:"Modifier le profil", saveProfile:"💾 Enregistrer",
    status:"Statut", dangerZone:"Zone dangereuse", archive:"📦 Archiver",
    delete:"🗑️ Supprimer", deleteClient:"⚠️ Supprimer ce client ?",
    deleteConfirm:"Toutes les données de", deleteConfirm2:"seront définitivement supprimées.",
    templatesWods:"Templates & WODs", newTemplate:"+ Nouveau", baseTemplates:"Templates de base",
    myTemplates:"Mes templates", templateName:"Nom", createWod:"🏋️ Créer un WOD",
    wodName:"Nom du WOD", wodNamePh:"ex. Mon WOD du vendredi...", format:"Format",
    movements:"Mouvements", addMovement:"+ Ajouter un mouvement", savePh:"ex. 18 rounds",
    generatorTitle:"🎲 Générateur de séance", generate:"🎲 Générer",
    addToProgram:"✅ Ajouter au programme", regenerate:"🔄 Regénérer",
    suggestionWod:"🏋️ WOD suggéré", suggestionSession:"💡 Suggestion basée sur l'historique",
    use:"Utiliser →", swipeDelete:"Supprimer", swipeCancel:"Annuler",
    syncLive:"Sync temps réel active", syncConnecting:"Connexion Firebase...", syncLocal:"Mode local",
    menuCoach:"Profil Coach", menuTheme:"Thème", menuLang:"Langue", menuStats:"Stats globales",
    menuAchievements:"Succès", menuLexicon:"Lexique", menuDisciplines:"Disciplines",
    darkMode:"🌙 Sombre", lightMode:"☀️ Clair",
    coachName:"Nom du coach", specialty:"Spécialité", specialtyPh:"ex. Coach CrossFit",
    uploadPhoto:"📷 Changer la photo", saveChanges:"💾 Sauvegarder",
    statsTitle:"Statistiques globales", totalClients:"Clients actifs",
    totalSessions:"Séances totales", totalWods:"WODs totaux", avgAttendance:"Assiduité moyenne",
    bestMonth:"Meilleur mois", goalsCompleted:"Objectifs atteints",
    achievementsTitle:"Mes Succès", achievementsProgress:"succès débloqués",
    unlockedOn:"Débloqué le", locked:"Non débloqué",
    rpeEasy:"Facile", rpeMod:"Modéré", rpeHard:"Difficile", rpeVeryHard:"Très dur", rpeMax:"Maximal",
    zoneRecup:"Récup", zoneAero:"Aérobie", zoneTempo:"Tempo", zoneSeuil:"Seuil", zoneVo2:"VO2max",
    // Chrono
    chronoTitle:"Chronomètre", chronoRest:"Repos", chronoWork:"Effort", chronoRound:"Round",
    chronoStart:"▶ Démarrer", chronoStop:"⏸ Pause", chronoReset:"↺ Reset",
    chronoTabata:"⚡ Tabata", chronoCustom:"⏱ Libre", chronoInterval:"🔁 Intervalles",
    // Lexique
    lexiconTitle:"Lexique", lexiconRpe:"RPE — Rate of Perceived Exertion",
    lexiconZone:"Zones cardio", lexiconRm:"1RM — One Rep Max",
    lexiconAmrap:"AMRAP", lexiconEmom:"EMOM", lexiconForTime:"For Time",
    lexiconWod:"WOD", lexiconRx:"Rx / Scaled",
    // Disciplines  
    disciplinesTitle:"Disciplines", discCrossfit:"CrossFit",
    discHyrox:"Hyrox", discAthx:"ATHX", discWeightlifting:"Haltérophilie",
    planned:"Planifiées",
  },
  en: {
    myClients:"My clients", active:"Active", sessions:"Sessions", attendance:"Attendance",
    addClient:"+ Client", templates:"Templates", library:"Library",
    noClients:"No clients yet — add one!",
    newClient:"New client", fullName:"Full name", age:"Age", sport:"Sport",
    objective:"Objective", notes:"Notes", add:"Add", cancel:"Cancel",
    namePlaceholder:"e.g. John Smith", agePlaceholder:"30",
    sportPlaceholder:"Basketball...", objectivePlaceholder:"Weight loss, Performance...",
    notesPlaceholder:"Injuries, preferences...",
    back:"← Dashboard", edit:"✏️ Edit", since:"since",
    presences:"Presences", assiduity:"Attendance", wods:"WODs", weight:"Weight",
    tabSessions:"Sessions", tabCalendar:"📅 Planning", tabMetrics:"Metrics",
    tabPrograms:"Program", tabGoals:"Goals", tabCharges:"Records",
    newSession:"+ New session", sessionTitle:"New session",
    sessionWod:"New WOD", date:"Date", duration:"Duration min",
    present:"Client present", sessionNotes:"Observations...",
    chooseTemplate:"Choose a template", chooseWod:"Choose a WOD",
    addExercises:"Choose exercises", addExercisesManual:"Add exercises manually",
    saveSession:"💪 Save session", saveWod:"🏋️ Save WOD",
    noSessions:"No sessions recorded",
    present_badge:"Present", absent_badge:"Absent",
    score:"Score / Result", changeWod:"← Change WOD",
    createCustomWod:"✏️ Create custom WOD",
    exercises:"Exercises", sets:"Sets", reps:"Reps", loadKg:"Weight kg",
    restSec:"Rest sec", note:"Note", remark:"Remark...",
    monthlyReport:"Monthly report", weightDelta:"Δ Weight", vsPrev:"vs prev. month",
    newMeasure:"New measurement", weightKg:"Weight (kg)", chest:"Chest cm",
    waist:"Waist cm", hips:"Hips cm", fatPct:"Body fat %", save:"Save",
    noMetrics:"No measurements recorded", progressCharts:"Progress charts",
    newProgram:"New program", weeks:"Weeks", startDate:"Start date",
    create:"Create", noPrograms:"No program created",
    auto:"🎲 Auto", addExercise:"+ Ex.", chooseLib:"Choose from library",
    exercise:"Exercise", load:"Load", indication:"Indication...",
    oneRm:"Estimated 1RM", noExercises:"No exercises — use the generator!",
    globalProgress:"Global progress", newGoal:"New goal",
    goal:"Goal", deadline:"Deadline", goalPlaceholder:"e.g. Reach 85 kg",
    achieved:"Achieved ✓", inProgress:"In progress", noGoals:"No goals defined",
    recordsTitle:"Records & Estimated 1RM", noCharges:"No weights recorded",
    noChargesSub:"Add exercises with weights in your sessions",
    libraryTitle:"Library", searchLib:"🔍 Search exercise or muscle...",
    plannedSessions:"📅 Upcoming planned sessions", planWhat:"What do you want to plan?",
    planTemplate:"From a template", planTemplateSub:"Push Day, Back Day, Leg Day...",
    planWod:"A WOD", planWodSub:"Benchmarks or custom WOD",
    planCustom:"Custom session", planCustomSub:"Choose exercises freely",
    planNote:"Note (optional)", plan:"📋 Plan", planWodBtn:"🏋️ Plan the WOD",
    planCustomBtn:"💪 Plan the session", alreadyPlanned:"📋 Already planned",
    deleteplan:"🗑️ Delete", sessionDone:"✅ Session completed", wodDone:"🏋️ WOD completed",
    scoreLabel:"🏆 Score:", sessionName:"Session name", sessionNamePh:"e.g. Upper Body...",
    back_simple:"← Back", benchmarks:"Benchmarks", myWods:"My WODs", createWodBtn:"✏️ Create",
    noCustomWods:"No custom WOD — create one!",
    thisWeek:"THIS WEEK", noSessionWeek:"No session this week",
    noSessionWeekSub:"Go to Planning to schedule one",
    startSession:"▶ START SESSION", today:"TODAY",
    inProgress_label:"IN PROGRESS", close:"✕ Close", finalScore:"Final score",
    sessionInfos:"Session info", finish:"✅ FINISH & SAVE",
    editProfile:"Edit profile", saveProfile:"💾 Save",
    status:"Status", dangerZone:"Danger zone", archive:"📦 Archive",
    delete:"🗑️ Delete", deleteClient:"⚠️ Delete this client?",
    deleteConfirm:"All data for", deleteConfirm2:"will be permanently deleted.",
    templatesWods:"Templates & WODs", newTemplate:"+ New", baseTemplates:"Base templates",
    myTemplates:"My templates", templateName:"Name", createWod:"🏋️ Create WOD",
    wodName:"WOD name", wodNamePh:"e.g. Friday WOD...", format:"Format",
    movements:"Movements", addMovement:"+ Add movement", savePh:"e.g. 18 rounds",
    generatorTitle:"🎲 Session generator", generate:"🎲 Generate",
    addToProgram:"✅ Add to program", regenerate:"🔄 Regenerate",
    suggestionWod:"🏋️ Suggested WOD", suggestionSession:"💡 Suggestion based on history",
    use:"Use →", swipeDelete:"Delete", swipeCancel:"Cancel",
    syncLive:"Real-time sync active", syncConnecting:"Connecting...", syncLocal:"Local mode",
    menuCoach:"Coach Profile", menuTheme:"Theme", menuLang:"Language", menuStats:"Global stats",
    menuAchievements:"Achievements", menuLexicon:"Lexicon", menuDisciplines:"Disciplines",
    darkMode:"🌙 Dark", lightMode:"☀️ Light",
    coachName:"Coach name", specialty:"Specialty", specialtyPh:"e.g. CrossFit Coach",
    uploadPhoto:"📷 Change photo", saveChanges:"💾 Save changes",
    statsTitle:"Global statistics", totalClients:"Active clients",
    totalSessions:"Total sessions", totalWods:"Total WODs", avgAttendance:"Average attendance",
    bestMonth:"Best month", goalsCompleted:"Goals completed",
    achievementsTitle:"My Achievements", achievementsProgress:"achievements unlocked",
    unlockedOn:"Unlocked on", locked:"Not unlocked",
    rpeEasy:"Easy", rpeMod:"Moderate", rpeHard:"Hard", rpeVeryHard:"Very hard", rpeMax:"Maximum",
    zoneRecup:"Recovery", zoneAero:"Aerobic", zoneTempo:"Tempo", zoneSeuil:"Threshold", zoneVo2:"VO2max",
    chronoTitle:"Stopwatch", chronoRest:"Rest", chronoWork:"Work", chronoRound:"Round",
    chronoStart:"▶ Start", chronoStop:"⏸ Pause", chronoReset:"↺ Reset",
    chronoTabata:"⚡ Tabata", chronoCustom:"⏱ Free", chronoInterval:"🔁 Intervals",
    lexiconTitle:"Lexicon", lexiconRpe:"RPE — Rate of Perceived Exertion",
    lexiconZone:"Cardio Zones", lexiconRm:"1RM — One Rep Max",
    lexiconAmrap:"AMRAP", lexiconEmom:"EMOM", lexiconForTime:"For Time",
    lexiconWod:"WOD", lexiconRx:"Rx / Scaled",
    disciplinesTitle:"Disciplines", discCrossfit:"CrossFit",
    discHyrox:"Hyrox", discAthx:"ATHX", discWeightlifting:"Weightlifting",
    planned:"Planned",
  }
};

// ── THEMES ────────────────────────────────────────────────────────────────────
const THEMES = {
  dark: {
    bg:"#020818", surface:"#061228", card:"#0a1e3d", cardAlt:"#0d2448",
    border:"#1a3a6e", accent:"#2d7fff", navyLight:"#132952",
    text:"#e8f0ff", muted:"#4a6fa5", mutedLight:"#8ab0e0",
    red:"#e63946", green:"#22c55e", gold:"#f59e0b", orange:"#f97316",
    purple:"#8b5cf6", inputBg:"#061228",
    gradientHeader:"linear-gradient(170deg,#132952 0%,#020818 100%)",
    gradientDash:"linear-gradient(135deg,#0d2448,#020818)",
  },
  light: {
    bg:"#f0f4ff", surface:"#e4ecff", card:"#ffffff", cardAlt:"#f5f8ff",
    border:"#c0d0f0", accent:"#1a6fff", navyLight:"#dde8ff",
    text:"#0a1628", muted:"#7a90b8", mutedLight:"#3d5278",
    red:"#e63946", green:"#22c55e", gold:"#f59e0b", orange:"#f97316",
    purple:"#8b5cf6", inputBg:"#ffffff",
    gradientHeader:"linear-gradient(170deg,#dde8ff 0%,#f0f4ff 100%)",
    gradientDash:"linear-gradient(135deg,#dde8ff,#f0f4ff)",
  }
};

// ── ACHIEVEMENTS ──────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [
  { id:"first_client",   icon:"🥇", nameF:"Premier client",     nameE:"First client",      descF:"Ajouter votre 1er client",     descE:"Add your 1st client",       check:(s)=>s.clientCount>=1,   color:"#f59e0b" },
  { id:"ten_clients",    icon:"👥", nameF:"Coach confirmé",      nameE:"Confirmed coach",   descF:"10 clients enregistrés",       descE:"10 clients registered",     check:(s)=>s.clientCount>=10,  color:"#2d7fff" },
  { id:"25_clients",     icon:"🏆", nameF:"Coach élite",         nameE:"Elite coach",       descF:"25 clients enregistrés",       descE:"25 clients registered",     check:(s)=>s.clientCount>=25,  color:"#f97316" },
  { id:"first_session",  icon:"💪", nameF:"Première séance",     nameE:"First session",     descF:"Enregistrer votre 1ère séance",descE:"Record your 1st session",   check:(s)=>s.sessionCount>=1,  color:"#22c55e" },
  { id:"fifty_sessions", icon:"🔥", nameF:"En rythme",           nameE:"In the zone",       descF:"50 séances enregistrées",      descE:"50 sessions recorded",      check:(s)=>s.sessionCount>=50, color:"#e63946" },
  { id:"100_sessions",   icon:"⚡", nameF:"Machine de guerre",   nameE:"War machine",       descF:"100 séances enregistrées",     descE:"100 sessions recorded",     check:(s)=>s.sessionCount>=100,color:"#8b5cf6" },
  { id:"first_wod",      icon:"🏋️", nameF:"WOD addict",          nameE:"WOD addict",        descF:"Enregistrer votre 1er WOD",    descE:"Record your 1st WOD",       check:(s)=>s.wodCount>=1,      color:"#f97316" },
  { id:"ten_wods",       icon:"🎯", nameF:"CrossFit ready",      nameE:"CrossFit ready",    descF:"10 WODs enregistrés",          descE:"10 WODs recorded",          check:(s)=>s.wodCount>=10,     color:"#e63946" },
  { id:"25_wods",        icon:"🔴", nameF:"Murph survivor",      nameE:"Murph survivor",    descF:"25 WODs enregistrés",          descE:"25 WODs recorded",          check:(s)=>s.wodCount>=25,     color:"#e63946" },
  { id:"first_goal",     icon:"🎯", nameF:"Objectif atteint",    nameE:"Goal achieved",     descF:"1er objectif client complété", descE:"1st client goal completed", check:(s)=>s.goalsCount>=1,    color:"#22c55e" },
  { id:"ten_goals",      icon:"🌟", nameF:"Motivateur",          nameE:"Motivator",         descF:"10 objectifs atteints",        descE:"10 goals achieved",         check:(s)=>s.goalsCount>=10,   color:"#f59e0b" },
  { id:"first_plan",     icon:"📅", nameF:"Planificateur",       nameE:"Planner",           descF:"Planifier votre 1ère séance",  descE:"Plan your 1st session",     check:(s)=>s.plannedCount>=1,  color:"#2d7fff" },
  { id:"twenty_plans",   icon:"📆", nameF:"Maître du planning",  nameE:"Planning master",   descF:"20 séances planifiées",        descE:"20 sessions planned",       check:(s)=>s.plannedCount>=20, color:"#8b5cf6" },
  { id:"streak_week",    icon:"🚀", nameF:"Semaine de feu",      nameE:"Fire week",         descF:"4 séances dans une semaine",   descE:"4 sessions in one week",    check:(s)=>s.weekStreak>=4,    color:"#f97316" },
  { id:"first_template", icon:"📋", nameF:"Structuré",           nameE:"Structured",        descF:"Créer votre 1er template",     descE:"Create your 1st template",  check:(s)=>s.templateCount>=1, color:"#2d7fff" },
];

// ── LEXICON DATA ──────────────────────────────────────────────────────────────
const LEXICON = [
  { id:"rpe", icon:"💪", titleF:"RPE — Effort Perçu", titleE:"RPE — Rate of Perceived Exertion",
    contentF:`Le RPE (Rate of Perceived Exertion) est une échelle de 1 à 10 qui mesure l'intensité subjective de l'effort.\n\n• RPE 1-3 : Très facile, récupération active\n• RPE 4-5 : Modéré, conversation possible\n• RPE 6-7 : Difficile, quelques mots seulement\n• RPE 8-9 : Très difficile, quasi impossible de parler\n• RPE 10 : Effort maximal absolu\n\nUtiliser le RPE permet d'adapter l'entraînement à l'état du jour du client, indépendamment des charges absolues.`,
    contentE:`RPE (Rate of Perceived Exertion) is a scale from 1 to 10 measuring subjective exercise intensity.\n\n• RPE 1-3: Very easy, active recovery\n• RPE 4-5: Moderate, conversation possible\n• RPE 6-7: Hard, only a few words\n• RPE 8-9: Very hard, barely talking\n• RPE 10: Absolute maximum effort\n\nUsing RPE allows adapting training to the client's daily condition, regardless of absolute loads.`,
    color:"#e63946" },
  { id:"zones", icon:"❤️", titleF:"Zones Cardio (1-5)", titleE:"Cardio Zones (1-5)",
    contentF:`Les 5 zones cardio sont basées sur le % de la fréquence cardiaque maximale (FCmax).\n\n• Zone 1 — Récupération (50-60% FCmax) : Très légère, régénération\n• Zone 2 — Aérobie (60-70% FCmax) : Base endurance, brûle les graisses\n• Zone 3 — Tempo (70-80% FCmax) : Seuil aérobie, conversation difficile\n• Zone 4 — Seuil (80-90% FCmax) : Seuil lactique, effort intense\n• Zone 5 — VO2max (90-100% FCmax) : Effort maximal, anaérobie\n\nLa Zone 2 est la base de tout programme d'endurance sérieux.`,
    contentE:`The 5 cardio zones are based on % of maximum heart rate (MHR).\n\n• Zone 1 — Recovery (50-60% MHR): Very light, regeneration\n• Zone 2 — Aerobic (60-70% MHR): Endurance base, fat burning\n• Zone 3 — Tempo (70-80% MHR): Aerobic threshold, talking is hard\n• Zone 4 — Threshold (80-90% MHR): Lactate threshold, intense effort\n• Zone 5 — VO2max (90-100% MHR): Maximum effort, anaerobic\n\nZone 2 is the foundation of any serious endurance program.`,
    color:"#e63946" },
  { id:"1rm", icon:"🏋️", titleF:"1RM — Répétition Maximale", titleE:"1RM — One Rep Max",
    contentF:`Le 1RM est la charge maximale qu'un athlète peut soulever une seule fois avec une technique correcte.\n\n📐 Formule d'Epley (estimée) :\n1RM = Charge × (1 + Reps/30)\n\nExemple : 100kg × 5 reps → 1RM ≈ 117kg\n\n• 90-95% du 1RM : Force maximale (1-3 reps)\n• 75-85% du 1RM : Hypertrophie (6-12 reps)\n• 60-75% du 1RM : Endurance-force (12-20 reps)\n\nL'app calcule automatiquement le 1RM estimé dans l'onglet Charges.`,
    contentE:`The 1RM is the maximum weight an athlete can lift once with correct technique.\n\n📐 Epley Formula (estimated):\n1RM = Weight × (1 + Reps/30)\n\nExample: 100kg × 5 reps → 1RM ≈ 117kg\n\n• 90-95% of 1RM: Maximum strength (1-3 reps)\n• 75-85% of 1RM: Hypertrophy (6-12 reps)\n• 60-75% of 1RM: Strength-endurance (12-20 reps)\n\nThe app automatically calculates estimated 1RM in the Records tab.`,
    color:"#f59e0b" },
  { id:"amrap", icon:"🔄", titleF:"AMRAP", titleE:"AMRAP",
    contentF:`AMRAP = As Many Rounds As Possible\n\nCompléter le maximum de rounds d'un circuit dans un temps imparti.\n\nExemple — AMRAP 20 min :\n• 5 Pull-ups\n• 10 Push-ups\n• 15 Air Squats\n\nLe score est le nombre total de rounds + reps supplémentaires complétés. Un bon score pour CINDY (benchmark) est 20+ rounds.`,
    contentE:`AMRAP = As Many Rounds As Possible\n\nComplete as many rounds of a circuit as possible within a set time.\n\nExample — AMRAP 20 min:\n• 5 Pull-ups\n• 10 Push-ups\n• 15 Air Squats\n\nThe score is the total number of rounds + additional reps completed. A good score for CINDY (benchmark) is 20+ rounds.`,
    color:"#e63946" },
  { id:"emom", icon:"⏰", titleF:"EMOM", titleE:"EMOM",
    contentF:`EMOM = Every Minute On the Minute\n\nEffectuer un exercice (ou circuit) au début de chaque minute. Le temps restant dans la minute est ton repos.\n\nExemple — EMOM 10 min :\n• Minute impaire : 10 Thrusters\n• Minute paire : 15 Box Jumps\n\nPlus les reps sont faites vite, plus le repos est long. C'est un format excellent pour développer la puissance et la capacité aérobie.`,
    contentE:`EMOM = Every Minute On the Minute\n\nPerform an exercise (or circuit) at the start of each minute. Remaining time in the minute is your rest.\n\nExample — EMOM 10 min:\n• Odd minute: 10 Thrusters\n• Even minute: 15 Box Jumps\n\nThe faster you complete the reps, the more rest you get. Excellent format for developing power and aerobic capacity.`,
    color:"#f97316" },
  { id:"fortime", icon:"🏁", titleF:"For Time", titleE:"For Time",
    contentF:`For Time = Finir le plus vite possible\n\nCompléter un nombre fixe de reps/rounds le plus rapidement possible. Le score est le temps total.\n\nExemple — For Time :\n• 21-15-9 Thrusters (43kg)\n• 21-15-9 Pull-ups\n\nC'est le format du WOD benchmark FRAN. Le record mondial est sous 2 minutes. Pour la plupart des athlètes, sub-5min est excellent.`,
    contentE:`For Time = Finish as fast as possible\n\nComplete a fixed number of reps/rounds as quickly as possible. Score is total time.\n\nExample — For Time:\n• 21-15-9 Thrusters (43kg)\n• 21-15-9 Pull-ups\n\nThis is the format for the FRAN benchmark WOD. The world record is under 2 minutes. For most athletes, sub-5min is excellent.`,
    color:"#2d7fff" },
  { id:"rx", icon:"⭐", titleF:"Rx / Scaled / Masters", titleE:"Rx / Scaled / Masters",
    contentF:`• Rx (As Prescribed) : Effectuer le WOD avec les charges et mouvements exacts prescrits. C'est le standard de référence.\n\n• Scaled : Modifier les charges, les mouvements ou le volume pour les adapter au niveau de l'athlète. Aucune honte — c'est de l'intelligence.\n\n• Masters : Catégorie pour les athlètes de 35 ans et plus, avec des standards adaptés.\n\n• Rx+ : Version plus difficile que le Rx standard, pour les athlètes de haut niveau.`,
    contentE:`• Rx (As Prescribed): Perform the WOD with the exact prescribed weights and movements. This is the reference standard.\n\n• Scaled: Modify weights, movements or volume to adapt to the athlete's level. No shame — it's smart training.\n\n• Masters: Category for athletes 35 and older, with adapted standards.\n\n• Rx+: Harder version than standard Rx, for high-level athletes.`,
    color:"#22c55e" },
  { id:"tabata", icon:"⚡", titleF:"Tabata", titleE:"Tabata",
    contentF:`Le Tabata est un protocole d'entraînement HIIT créé par le Dr Izumi Tabata (1996).\n\nProtocole classique :\n• 20 secondes d'effort maximal\n• 10 secondes de repos\n• 8 rounds = 4 minutes totales\n\nVariantes disponibles dans l'app :\n• 30-30 : 30s effort / 30s repos\n• 15-15 : 15s effort / 15s repos\n• 20-40 : 20s effort / 40s repos\n• 15-30 : 15s effort / 30s repos\n\nLe score Tabata est le nombre minimum de reps effectué sur un round.`,
    contentE:`Tabata is a HIIT training protocol created by Dr. Izumi Tabata (1996).\n\nClassic protocol:\n• 20 seconds maximum effort\n• 10 seconds rest\n• 8 rounds = 4 minutes total\n\nVariants available in the app:\n• 30-30: 30s work / 30s rest\n• 15-15: 15s work / 15s rest\n• 20-40: 20s work / 40s rest\n• 15-30: 15s work / 30s rest\n\nThe Tabata score is the minimum number of reps performed in any round.`,
    color:"#22c55e" },
  { id:"prmax", icon:"📈", titleF:"PR / Max / Total", titleE:"PR / Max / Total",
    contentF:`• PR (Personal Record) : Meilleure performance personnelle sur un exercice ou WOD.\n\n• Max : Charge maximale soulevée sur un exercice donné.\n\n• Total Olympique : Back Squat + Press + Deadlift (powerlifting) ou Snatch + Clean & Jerk (haltérophilie).\n\n• Total CrossFit : Snatch + Clean & Jerk + Back Squat.\n\nSuivre ses PR est essentiel pour mesurer la progression sur le long terme.`,
    contentE:`• PR (Personal Record): Best personal performance on an exercise or WOD.\n\n• Max: Maximum weight lifted on a given exercise.\n\n• Olympic Total: Back Squat + Press + Deadlift (powerlifting) or Snatch + Clean & Jerk (weightlifting).\n\n• CrossFit Total: Snatch + Clean & Jerk + Back Squat.\n\nTracking PRs is essential for measuring long-term progress.`,
    color:"#8b5cf6" },
];

// ── DISCIPLINES DATA ──────────────────────────────────────────────────────────
const DISCIPLINES = [
  { id:"crossfit", icon:"🏋️", color:"#e63946",
    nameF:"CrossFit", nameE:"CrossFit",
    subtitleF:"Fitness fonctionnel à haute intensité", subtitleE:"High-intensity functional fitness",
    descF:`Le CrossFit est une méthodologie d'entraînement créée par Greg Glassman en 2000, basée sur des mouvements fonctionnels variés exécutés à haute intensité.\n\n🎯 Principes fondamentaux :\n• Mouvements constamment variés\n• Haute intensité relative\n• Mouvements fonctionnels (naturels)\n\n📊 Les 10 composantes fitness CrossFit :\nEndurance cardio, Stamina, Force, Flexibilité, Puissance, Vitesse, Coordination, Agilité, Équilibre, Précision\n\n🏆 Compétitions :\n• CrossFit Open : Compétition mondiale annuelle en ligne (février-mars)\n• CrossFit Games : Championnat du monde à Madison, Wisconsin\n• Sanctionals : Compétitions qualificatives régionales`,
    descE:`CrossFit is a training methodology created by Greg Glassman in 2000, based on varied functional movements performed at high intensity.\n\n🎯 Core principles:\n• Constantly varied movements\n• Relative high intensity\n• Functional movements (natural)\n\n📊 The 10 CrossFit fitness components:\nCardio endurance, Stamina, Strength, Flexibility, Power, Speed, Coordination, Agility, Balance, Accuracy\n\n🏆 Competitions:\n• CrossFit Open: Annual worldwide online competition (Feb-Mar)\n• CrossFit Games: World championship in Madison, Wisconsin\n• Sanctionals: Regional qualifying competitions`,
  },
  { id:"hyrox", icon:"🏃", color:"#f97316",
    nameF:"Hyrox", nameE:"Hyrox",
    subtitleF:"Fitness racing — 1km run + 8 stations", subtitleE:"Fitness racing — 1km run + 8 stations",
    descF:`Hyrox est une compétition de fitness racing créée en 2017 à Hambourg. Elle combine course à pied et stations de fitness fonctionnel.\n\n📋 Format standard :\n8× (1km run + 1 station fitness)\nTotal : 8km de course + 8 stations\n\n🏋️ Les 8 stations (dans l'ordre) :\n1. SkiErg — 1000m\n2. Sled Push — 50m (lourde)\n3. Sled Pull — 50m (légère)\n4. Burpees Broad Jump — 80m\n5. Rowing — 1000m\n6. Farmers Carry — 200m\n7. Sandbag Lunges — 100m\n8. Wall Ball Shots — 75-100 reps\n\n🏆 Catégories :\n• Hyrox Men / Women (Rx)\n• Hyrox Pro Men / Women (+ charges)\n• Doubles (2 athlètes alternent)\n• Relay (4 athlètes, 1 station chacun)`,
    descE:`Hyrox is a fitness racing competition created in 2017 in Hamburg. It combines running and functional fitness stations.\n\n📋 Standard format:\n8× (1km run + 1 fitness station)\nTotal: 8km running + 8 stations\n\n🏋️ The 8 stations (in order):\n1. SkiErg — 1000m\n2. Sled Push — 50m (heavy)\n3. Sled Pull — 50m (light)\n4. Burpees Broad Jump — 80m\n5. Rowing — 1000m\n6. Farmers Carry — 200m\n7. Sandbag Lunges — 100m\n8. Wall Ball Shots — 75-100 reps\n\n🏆 Categories:\n• Hyrox Men / Women (Rx)\n• Hyrox Pro Men / Women (+ weights)\n• Doubles (2 athletes alternate)\n• Relay (4 athletes, 1 station each)`,
  },
  { id:"athx", icon:"⚡", color:"#8b5cf6",
    nameF:"ATHX", nameE:"ATHX",
    subtitleF:"Athletic X — Athlétisme fonctionnel", subtitleE:"Athletic X — Functional athletics",
    descF:`ATHX (Athletic X) est un système de compétition de fitness fonctionnel combinant haltérophilie, gymnastique, cardio et athlétisme.\n\n🎯 Philosophie :\nDévelopper un athlète complet, capable de performer dans toutes les disciplines physiques sans spécialisation excessive.\n\n📋 Format des épreuves :\nLes épreuves ATHX combinent généralement :\n• Mouvements olympiques (Snatch, C&J)\n• Gymnastic skills (Muscle-up, HSPU)\n• Cardio fonctionnel (SkiErg, Assault Bike)\n• Athlétisme (Sprint, Saut)\n\n🏆 Catégories :\n• Individual Men / Women\n• Team (2-4 athlètes)\n• Age groups (35+, 45+, 55+)\n\nL'ATHX se développe rapidement en France et en Europe comme alternative au CrossFit traditionnel.`,
    descE:`ATHX (Athletic X) is a functional fitness competition system combining weightlifting, gymnastics, cardio and athletics.\n\n🎯 Philosophy:\nDevelop a complete athlete, capable of performing in all physical disciplines without excessive specialization.\n\n📋 Event format:\nATHX events generally combine:\n• Olympic movements (Snatch, C&J)\n• Gymnastic skills (Muscle-up, HSPU)\n• Functional cardio (SkiErg, Assault Bike)\n• Athletics (Sprint, Jump)\n\n🏆 Categories:\n• Individual Men / Women\n• Team (2-4 athletes)\n• Age groups (35+, 45+, 55+)\n\nATHX is rapidly growing in France and Europe as an alternative to traditional CrossFit.`,
  },
  { id:"weightlifting", icon:"🥇", color:"#f59e0b",
    nameF:"Haltérophilie", nameE:"Weightlifting",
    subtitleF:"Sport olympique — Arraché & Épaulé-Jeté", subtitleE:"Olympic sport — Snatch & Clean & Jerk",
    descF:`L'haltérophilie est un sport olympique depuis 1896, consistant à soulever une barre chargée au-dessus de la tête en deux mouvements distincts.\n\n🏋️ Les 2 mouvements de compétition :\n\n1. Arraché (Snatch) :\nSoulever la barre du sol au-dessus de la tête en un seul mouvement continu. Le mouvement le plus technique du sport.\n\n2. Épaulé-Jeté (Clean & Jerk) :\n• Clean : Amener la barre sur les épaules\n• Jerk : Pousser la barre au-dessus de la tête\n\n📊 Total olympique = Meilleur Arraché + Meilleur Épaulé-Jeté\n\n💡 Standards de référence (hommes) :\n• Débutant : Snatch 1× poids du corps\n• Intermédiaire : Snatch 1.25× poids du corps\n• Élite : Snatch 1.5×+ poids du corps`,
    descE:`Weightlifting is an Olympic sport since 1896, consisting of lifting a loaded barbell overhead in two distinct movements.\n\n🏋️ The 2 competition lifts:\n\n1. Snatch:\nLift the bar from the floor to overhead in one continuous movement. The most technical lift in sport.\n\n2. Clean & Jerk:\n• Clean: Bring the bar to the shoulders\n• Jerk: Push the bar overhead\n\n📊 Olympic Total = Best Snatch + Best Clean & Jerk\n\n💡 Reference standards (men):\n• Beginner: Snatch 1× bodyweight\n• Intermediate: Snatch 1.25× bodyweight\n• Elite: Snatch 1.5×+ bodyweight`,
  },
];

// ── APP CONTEXT ───────────────────────────────────────────────────────────────
const AppContext = createContext({});
const useApp = () => useContext(AppContext);

// ── MUSCLE GROUPS ─────────────────────────────────────────────────────────────
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
  { id:"devil_press",      name:"Devil Press",           cat:"Functional", muscles:"Full body, Épaules, Cardio",         tip:"Burpee avec haltères + snatch au-dessus." },
  { id:"rope_climb",       name:"Corde lisse",           cat:"Functional", muscles:"Grand dorsal, Biceps, Core",         tip:"Technique L-sit pour économiser l'énergie." },
  { id:"ghd_situp",        name:"GHD Sit-up",            cat:"Functional", muscles:"Abdominaux, Fléchisseurs hanche",    tip:"Amplitude complète, contrôle en descente." },
  { id:"bar_muscle_up",    name:"Bar Muscle Up",         cat:"Functional", muscles:"Grand dorsal, Triceps, Core",        tip:"Kipping explosif, transition rapide." },
  { id:"pistol_squat",     name:"Pistol Squat",          cat:"Functional", muscles:"Quadriceps, Fessiers, Stabilité",    tip:"Talon au sol, genou dans l'axe." },
  { id:"burpee",           name:"Burpee",                cat:"Functional", muscles:"Full body, Cardio, Explosivité",     tip:"Planche stricte en bas, saut explosif." },
  { id:"push_jerk",        name:"Push Jerk",             cat:"Functional", muscles:"Épaules, Triceps, Jambes",           tip:"Dip rapide, extension explosive, réception en squat partiel." },
  { id:"hang_power_clean", name:"Hang Power Clean",      cat:"Functional", muscles:"Full body, Ischio, Épaules",         tip:"Départ genoux fléchis, triple extension explosive." },
  { id:"sandbag_lunge",    name:"Sandbag Lunge",         cat:"Functional", muscles:"Quadriceps, Fessiers, Core",         tip:"Sac sur l'épaule, fente contrôlée." },
  { id:"sled_push",        name:"Sled Push",             cat:"Functional", muscles:"Quadriceps, Fessiers, Épaules",      tip:"Inclinaison du corps vers l'avant, pas explosifs." },
  { id:"ski_erg_sprint",   name:"SkiErg Sprint",         cat:"Functional", muscles:"Dorsaux, Core, Cardio",              tip:"Double bras simultané, utiliser le poids du corps." },
];

const CATS = ["Tous","Push","Pull","Legs","Musculation","Abdos","Mobilité","Cardio","Functional"];
const CAT_COLOR = { Push:"#2d7fff",Pull:"#8b5cf6",Legs:"#22c55e",Musculation:"#2d7fff",Abdos:"#e63946",Mobilité:"#22c55e",Cardio:"#f59e0b",Functional:"#f97316" };
const MONTH_NAMES = {"01":"Janvier","02":"Février","03":"Mars","04":"Avril","05":"Mai","06":"Juin","07":"Juillet","08":"Août","09":"Septembre","10":"Octobre","11":"Novembre","12":"Décembre"};
const MONTH_NAMES_EN = {"01":"January","02":"February","03":"March","04":"April","05":"May","06":"June","07":"July","08":"August","09":"September","10":"October","11":"November","12":"December"};
const DAY_NAMES_FR = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
const DAY_NAMES_EN = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_FULL_FR = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
const DAY_FULL_EN = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const STATUS_OPTIONS = ["actif","pause","inactif"];
const STATUS_COLOR = { actif:"#22c55e",pause:"#f59e0b",inactif:"#4a6fa5" };

const WOD_FORMATS = [
  { id:"amrap",   name:"AMRAP",    desc:"As Many Rounds As Possible", color:"#e63946", icon:"🔄" },
  { id:"emom",    name:"EMOM",     desc:"Every Minute On the Minute", color:"#f97316", icon:"⏰" },
  { id:"fortime", name:"For Time", desc:"Finir le plus vite possible",color:"#2d7fff", icon:"🏁" },
  { id:"timecap", name:"Timecap",  desc:"Maximum dans le temps imparti",color:"#8b5cf6",icon:"⏱️" },
  { id:"metcon",  name:"MetCon",   desc:"Metabolic Conditioning",     color:"#f59e0b", icon:"💪" },
  { id:"tabata",  name:"Tabata",   desc:"Effort / Repos × rounds",    color:"#22c55e", icon:"⚡" },
];

const TABATA_FORMATS = [
  { id:"20-10", work:20, rest:10, rounds:8,  label:"20s / 10s × 8 (Classique)" },
  { id:"30-30", work:30, rest:30, rounds:6,  label:"30s / 30s × 6" },
  { id:"15-15", work:15, rest:15, rounds:10, label:"15s / 15s × 10" },
  { id:"20-40", work:20, rest:40, rounds:6,  label:"20s / 40s × 6" },
  { id:"15-30", work:15, rest:30, rounds:8,  label:"15s / 30s × 8" },
  { id:"30-15", work:30, rest:15, rounds:8,  label:"30s / 15s × 8" },
  { id:"40-20", work:40, rest:20, rounds:6,  label:"40s / 20s × 6" },
  { id:"10-20", work:10, rest:20, rounds:12, label:"10s / 20s × 12 (Sprint)" },
];

const WOD_BENCHMARKS = [
  // THE GIRLS
  { id:"wod_cindy",   name:"CINDY",   type:"wod", format:"amrap",   duration:20, color:"#e63946", description:"AMRAP 20 min", category:"The Girls",
    movements:[{name:"Pull-ups",reps:"5",libId:"pullup"},{name:"Push-ups",reps:"10",libId:"pushup"},{name:"Air Squats",reps:"15",libId:"squat"}],
    scoreType:"rounds", tip:"Pace-toi dès le départ. 20+ rounds = excellent." },
  { id:"wod_annie",   name:"ANNIE",   type:"wod", format:"fortime", timecap:15,  color:"#f97316", description:"For Time", category:"The Girls",
    movements:[{name:"Double Unders",reps:"50-40-30-20-10",libId:"double_under"},{name:"Sit-ups",reps:"50-40-30-20-10",libId:"sit_up"}], scoreType:"time" },
  { id:"wod_angie",   name:"ANGIE",   type:"wod", format:"fortime", timecap:30,  color:"#8b5cf6", description:"For Time", category:"The Girls",
    movements:[{name:"Pull-ups",reps:"100",libId:"pullup"},{name:"Push-ups",reps:"100",libId:"pushup"},{name:"Sit-ups",reps:"100",libId:"sit_up"},{name:"Air Squats",reps:"100",libId:"squat"}], scoreType:"time" },
  { id:"wod_barbara", name:"BARBARA", type:"wod", format:"fortime", timecap:40,  color:"#2d7fff", description:"5 rounds For Time", category:"The Girls",
    movements:[{name:"Pull-ups",reps:"20",libId:"pullup"},{name:"Push-ups",reps:"30",libId:"pushup"},{name:"Sit-ups",reps:"40",libId:"sit_up"},{name:"Air Squats",reps:"50",libId:"squat"}], scoreType:"time", tip:"3 min repos entre chaque round." },
  { id:"wod_fran",    name:"FRAN",    type:"wod", format:"fortime", timecap:10,  color:"#e63946", description:"21-15-9 For Time", category:"The Girls",
    movements:[{name:"Thrusters (43kg)",reps:"21-15-9",libId:"thruster"},{name:"Pull-ups",reps:"21-15-9",libId:"pullup"}], scoreType:"time", tip:"Sub-5min = excellent." },
  { id:"wod_grace",   name:"GRACE",   type:"wod", format:"fortime", timecap:10,  color:"#f59e0b", description:"30 reps For Time", category:"The Girls",
    movements:[{name:"Clean & Jerk (60kg)",reps:"30",libId:"clean_jerk"}], scoreType:"time" },
  { id:"wod_chelsea", name:"CHELSEA", type:"wod", format:"emom",    minutes:30,  color:"#22c55e", description:"EMOM 30 min", category:"The Girls",
    movements:[{name:"Pull-ups",reps:"5",libId:"pullup"},{name:"Push-ups",reps:"10",libId:"pushup"},{name:"Air Squats",reps:"15",libId:"squat"}], scoreType:"rounds" },
  { id:"wod_karen",   name:"KAREN",   type:"wod", format:"fortime", timecap:15,  color:"#f59e0b", description:"For Time", category:"The Girls",
    movements:[{name:"Wall Ball Shot (9kg)",reps:"150",libId:"wall_ball"}], scoreType:"time" },
  { id:"wod_helen",   name:"HELEN",   type:"wod", format:"fortime", timecap:15,  color:"#22c55e", description:"3 rounds For Time", category:"The Girls",
    movements:[{name:"Run 400m",reps:"400m",libId:"run"},{name:"KB Swing (24kg)",reps:"21",libId:"kb_russian_swing"},{name:"Pull-ups",reps:"12",libId:"pullup"}], scoreType:"time" },
  // THE HEROES
  { id:"wod_murph",   name:"MURPH",   type:"wod", format:"fortime", timecap:60,  color:"#e63946", description:"For Time (gilet 20lbs)", category:"The Heroes",
    movements:[{name:"Run",reps:"1 mile",libId:"run"},{name:"Pull-ups",reps:"100",libId:"pullup"},{name:"Push-ups",reps:"200",libId:"pushup"},{name:"Air Squats",reps:"300",libId:"squat"},{name:"Run",reps:"1 mile",libId:"run"}],
    scoreType:"time", tip:"Partition : 20 rounds de 5/10/15." },
  { id:"wod_dt",      name:"DT",      type:"wod", format:"fortime", timecap:20,  color:"#8b5cf6", description:"5 rounds For Time (70kg)", category:"The Heroes",
    movements:[{name:"Deadlift",reps:"12",libId:"deadlift"},{name:"Hang Power Clean",reps:"9",libId:"hang_power_clean"},{name:"Push Jerk",reps:"6",libId:"push_jerk"}], scoreType:"time" },
  { id:"wod_jt",      name:"JT",      type:"wod", format:"fortime", timecap:20,  color:"#f97316", description:"21-15-9 For Time", category:"The Heroes",
    movements:[{name:"Handstand Push-ups",reps:"21-15-9",libId:"handstand_pushup"},{name:"Ring Dips",reps:"21-15-9",libId:"ring_dip"},{name:"Push-ups",reps:"21-15-9",libId:"pushup"}], scoreType:"time" },
  { id:"wod_loredo",  name:"LOREDO",  type:"wod", format:"fortime", timecap:30,  color:"#2d7fff", description:"6 rounds For Time", category:"The Heroes",
    movements:[{name:"Run 400m",reps:"400m",libId:"run"},{name:"Air Squats",reps:"24",libId:"squat"},{name:"Push-ups",reps:"24",libId:"pushup"},{name:"Walking Lunges",reps:"24",libId:"lunge"}], scoreType:"time" },
  // CROSSFIT OPEN 2020
  { id:"open_20_1",  name:"20.1",  type:"wod", format:"amrap",   duration:15, color:"#e63946", description:"AMRAP 15 min", category:"Open 2020",
    movements:[{name:"Ground-to-Overhead (35kg)",reps:"10",libId:"barbell_snatch"},{name:"Bar-facing Burpees",reps:"10",libId:"burpee"}], scoreType:"rounds" },
  { id:"open_20_2",  name:"20.2",  type:"wod", format:"amrap",   duration:20, color:"#f97316", description:"AMRAP 20 min", category:"Open 2020",
    movements:[{name:"DB Thrusters (2×22.5kg)",reps:"4",libId:"thruster"},{name:"Toes-to-Bar",reps:"6",libId:"toes_to_bar"},{name:"Box Jumps (60cm)",reps:"6",libId:"box_jump"}], scoreType:"rounds" },
  { id:"open_20_3",  name:"20.3",  type:"wod", format:"fortime", timecap:18,  color:"#8b5cf6", description:"For Time / Timecap 18min", category:"Open 2020",
    movements:[{name:"Deadlift (100kg)",reps:"21",libId:"deadlift"},{name:"Handstand Walk",reps:"50 pieds",libId:"handstand_pushup"},{name:"Deadlift (120kg)",reps:"15",libId:"deadlift"},{name:"Handstand Walk",reps:"50 pieds",libId:"handstand_pushup"},{name:"Deadlift (147.5kg)",reps:"9",libId:"deadlift"},{name:"Handstand Walk",reps:"50 pieds",libId:"handstand_pushup"}], scoreType:"time" },
  // CROSSFIT OPEN 2021
  { id:"open_21_1",  name:"21.1",  type:"wod", format:"amrap",   duration:15, color:"#e63946", description:"AMRAP 15 min", category:"Open 2021",
    movements:[{name:"Double Unders",reps:"3-6-9-12...",libId:"double_under"},{name:"Wall Walk",reps:"1-2-3-4...",libId:"handstand_pushup"}], scoreType:"rounds" },
  { id:"open_21_2",  name:"21.2",  type:"wod", format:"amrap",   duration:20, color:"#f97316", description:"AMRAP 20 min", category:"Open 2021",
    movements:[{name:"DB Snatches (22.5kg)",reps:"10",libId:"kb_snatch"},{name:"Box Jump Over (60cm)",reps:"10",libId:"box_jump"}], scoreType:"rounds" },
  { id:"open_21_3",  name:"21.3",  type:"wod", format:"fortime", timecap:15,  color:"#2d7fff", description:"For Time", category:"Open 2021",
    movements:[{name:"Thrusters (40kg)",reps:"95",libId:"thruster"},{name:"Pull-ups",reps:"95",libId:"pullup"}], scoreType:"time", tip:"Version 21.3 = FRAN revisité." },
  // CROSSFIT OPEN 2022
  { id:"open_22_1",  name:"22.1",  type:"wod", format:"amrap",   duration:15, color:"#22c55e", description:"AMRAP 15 min", category:"Open 2022",
    movements:[{name:"Burpee Box Jump Over (60cm)",reps:"3-6-9-12...",libId:"burpee"},{name:"DB Snatches (22.5kg)",reps:"3-6-9-12...",libId:"kb_snatch"}], scoreType:"rounds" },
  { id:"open_22_2",  name:"22.2",  type:"wod", format:"amrap",   duration:20, color:"#e63946", description:"AMRAP 20 min", category:"Open 2022",
    movements:[{name:"Deadlift (102.5kg)",reps:"24",libId:"deadlift"},{name:"Bar Muscle-ups",reps:"24",libId:"bar_muscle_up"},{name:"Deadlift (102.5kg)",reps:"24",libId:"deadlift"},{name:"Chest-to-Bar Pull-ups",reps:"24",libId:"pullup"}], scoreType:"rounds" },
  { id:"open_22_3",  name:"22.3",  type:"wod", format:"amrap",   duration:20, color:"#8b5cf6", description:"AMRAP 20 min", category:"Open 2022",
    movements:[{name:"Wall Walks",reps:"10",libId:"handstand_pushup"},{name:"Thrusters (40kg)",reps:"10",libId:"thruster"},{name:"Bar Muscle-ups",reps:"10",libId:"bar_muscle_up"}], scoreType:"rounds" },
  // CROSSFIT OPEN 2023
  { id:"open_23_1",  name:"23.1",  type:"wod", format:"amrap",   duration:14, color:"#f59e0b", description:"AMRAP 14 min", category:"Open 2023",
    movements:[{name:"Burpees to Pull-up Bar",reps:"60",libId:"burpee"},{name:"Wall Walks",reps:"50",libId:"handstand_pushup"},{name:"Hang Power Snatches (35kg)",reps:"40",libId:"barbell_snatch"},{name:"Chest-to-Bar Pull-ups",reps:"30",libId:"pullup"},{name:"Squat Snatches (61kg)",reps:"20",libId:"barbell_snatch"},{name:"Bar Muscle-ups",reps:"10",libId:"bar_muscle_up"}], scoreType:"rounds" },
  { id:"open_23_2",  name:"23.2",  type:"wod", format:"amrap",   duration:12, color:"#f97316", description:"AMRAP 12 min", category:"Open 2023",
    movements:[{name:"Alternating DB Snatches (22.5kg)",reps:"5",libId:"kb_snatch"},{name:"Lateral Burpees over DB",reps:"5",libId:"burpee"},{name:"Pull-ups",reps:"5",libId:"pullup"}], scoreType:"rounds" },
  { id:"open_23_3",  name:"23.3",  type:"wod", format:"fortime", timecap:15,  color:"#e63946", description:"For Time", category:"Open 2023",
    movements:[{name:"Kettlebell Swings (32kg)",reps:"50",libId:"kb_american_swing"},{name:"Pull-ups",reps:"50",libId:"pullup"},{name:"Wall Walks",reps:"3",libId:"handstand_pushup"}], scoreType:"time" },
  // CROSSFIT OPEN 2024
  { id:"open_24_1",  name:"24.1",  type:"wod", format:"amrap",   duration:15, color:"#2d7fff", description:"AMRAP 15 min", category:"Open 2024",
    movements:[{name:"DB Snatches (22.5kg H / 15kg F)",reps:"3-6-9-12...",libId:"kb_snatch"},{name:"Burpees over DB",reps:"3-6-9-12...",libId:"burpee"}], scoreType:"rounds" },
  { id:"open_24_2",  name:"24.2",  type:"wod", format:"amrap",   duration:20, color:"#22c55e", description:"AMRAP 20 min", category:"Open 2024",
    movements:[{name:"Rope Climbs (4.5m)",reps:"4",libId:"rope_climb"},{name:"Thrusters (40kg)",reps:"10",libId:"thruster"},{name:"Chest-to-Bar Pull-ups",reps:"16",libId:"pullup"}], scoreType:"rounds" },
  { id:"open_24_3",  name:"24.3",  type:"wod", format:"fortime", timecap:20,  color:"#f97316", description:"For Time + AMRAP Bonus", category:"Open 2024",
    movements:[{name:"Run 400m",reps:"400m",libId:"run"},{name:"Hang Power Cleans (61kg)",reps:"15",libId:"hang_power_clean"},{name:"Push Jerks (61kg)",reps:"15",libId:"push_jerk"},{name:"Toes-to-Bar",reps:"15",libId:"toes_to_bar"},{name:"Double Unders",reps:"60",libId:"double_under"}], scoreType:"time" },
  // CROSSFIT OPEN 2025
  { id:"open_25_1",  name:"25.1",  type:"wod", format:"amrap",   duration:15, color:"#e63946", description:"AMRAP 15 min", category:"Open 2025",
    movements:[{name:"Synchro Burpees",reps:"5",libId:"burpee"},{name:"Pull-ups",reps:"10",libId:"pullup"},{name:"Air Squats",reps:"15",libId:"squat"}], scoreType:"rounds", tip:"WOD de l'Open 2025, vérifier les standards officiels." },
  { id:"open_25_2",  name:"25.2",  type:"wod", format:"fortime", timecap:10,  color:"#f97316", description:"For Time", category:"Open 2025",
    movements:[{name:"Thrusters (43kg)",reps:"21-15-9",libId:"thruster"},{name:"Bar Muscle-ups",reps:"21-15-9",libId:"bar_muscle_up"}], scoreType:"time" },
  { id:"open_25_3",  name:"25.3",  type:"wod", format:"amrap",   duration:20, color:"#8b5cf6", description:"AMRAP 20 min", category:"Open 2025",
    movements:[{name:"Deadlifts (100kg)",reps:"5",libId:"deadlift"},{name:"Hang Power Cleans (70kg)",reps:"5",libId:"hang_power_clean"},{name:"Push Jerks (70kg)",reps:"5",libId:"push_jerk"},{name:"Toes-to-Bar",reps:"10",libId:"toes_to_bar"},{name:"Double Unders",reps:"50",libId:"double_under"}], scoreType:"rounds" },
  // HYROX
  { id:"hyrox_men",   name:"HYROX Men",   type:"wod", format:"fortime", timecap:90, color:"#f97316", description:"8×(1km Run + Station)", category:"Hyrox",
    movements:[{name:"Run 1km",reps:"1km",libId:"run"},{name:"SkiErg",reps:"1000m",libId:"skierg"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Sled Push (152kg)",reps:"50m",libId:"sled_push"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Sled Pull (103kg)",reps:"50m",libId:"sled_push"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Burpees Broad Jump",reps:"80m",libId:"burpee"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Rowing",reps:"1000m",libId:"rowing_machine"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Farmers Carry (2×24kg)",reps:"200m",libId:"farmer_walk"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Sandbag Lunges (20kg)",reps:"100m",libId:"sandbag_lunge"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Wall Ball Shot (9kg/4.5m)",reps:"100",libId:"wall_ball"}],
    scoreType:"time", tip:"Temps moyen finisher : 75-90 min. Elite sub-60min." },
  { id:"hyrox_women", name:"HYROX Women", type:"wod", format:"fortime", timecap:90, color:"#f59e0b", description:"8×(1km Run + Station)", category:"Hyrox",
    movements:[{name:"Run 1km",reps:"1km",libId:"run"},{name:"SkiErg",reps:"1000m",libId:"skierg"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Sled Push (102kg)",reps:"50m",libId:"sled_push"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Sled Pull (78kg)",reps:"50m",libId:"sled_push"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Burpees Broad Jump",reps:"80m",libId:"burpee"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Rowing",reps:"1000m",libId:"rowing_machine"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Farmers Carry (2×16kg)",reps:"200m",libId:"farmer_walk"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Sandbag Lunges (10kg)",reps:"100m",libId:"sandbag_lunge"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Wall Ball Shot (6kg/4.5m)",reps:"100",libId:"wall_ball"}],
    scoreType:"time" },
  { id:"hyrox_pro_men",   name:"HYROX Pro Men",   type:"wod", format:"fortime", timecap:90, color:"#e63946", description:"Version Pro (+ charges)", category:"Hyrox",
    movements:[{name:"Run 1km",reps:"1km",libId:"run"},{name:"SkiErg",reps:"1000m",libId:"skierg"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Sled Push (202kg)",reps:"50m",libId:"sled_push"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Sled Pull (153kg)",reps:"50m",libId:"sled_push"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Burpees Broad Jump",reps:"80m",libId:"burpee"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Rowing",reps:"1000m",libId:"rowing_machine"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Farmers Carry (2×32kg)",reps:"200m",libId:"farmer_walk"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Sandbag Lunges (30kg)",reps:"100m",libId:"sandbag_lunge"},{name:"Run 1km",reps:"1km",libId:"run"},{name:"Wall Ball Shot (11kg/6m)",reps:"100",libId:"wall_ball"}],
    scoreType:"time", tip:"Pro division — pour les athlètes d'élite seulement." },
  { id:"hyrox_doubles_men", name:"HYROX Doubles Men", type:"wod", format:"fortime", timecap:90, color:"#2d7fff", description:"2 athlètes, alternance", category:"Hyrox",
    movements:[{name:"Run 1km (chacun)",reps:"1km",libId:"run"},{name:"SkiErg (2000m alternés)",reps:"2000m",libId:"skierg"},{name:"Sled Push (152kg alternés)",reps:"50m",libId:"sled_push"},{name:"Burpees Broad Jump (160m alternés)",reps:"160m",libId:"burpee"},{name:"Rowing (2000m alternés)",reps:"2000m",libId:"rowing_machine"},{name:"Farmers Carry (2×24kg)",reps:"200m",libId:"farmer_walk"},{name:"Sandbag Lunges (20kg alternés)",reps:"100m",libId:"sandbag_lunge"},{name:"Wall Ball Shot (9kg) — 150 reps",reps:"150",libId:"wall_ball"}],
    scoreType:"time" },
];

const calc1RM=(load,reps)=>{if(!load||!reps||+reps===0||+reps>30)return null;return Math.round(+load*(1+ +reps/30));};
const rpeColor=(rpe)=>{if(!rpe)return"#4a6fa5";const r=+rpe;if(r<=4)return"#22c55e";if(r<=6)return"#f59e0b";if(r<=8)return"#f97316";return"#e63946";};
const rpeLabel=(rpe,lang)=>{if(!rpe)return"";const r=+rpe;const t=TRANSLATIONS[lang];if(r<=3)return t.rpeEasy;if(r<=5)return t.rpeMod;if(r<=7)return t.rpeHard;if(r<=9)return t.rpeVeryHard;return t.rpeMax;};
const zoneColor=(z)=>({"1":"#3b82f6","2":"#22c55e","3":"#f59e0b","4":"#f97316","5":"#e63946"}[z]||"#4a6fa5");
const zoneLabel=(z,lang)=>{const t=TRANSLATIONS[lang];return({"1":t.zoneRecup,"2":t.zoneAero,"3":t.zoneTempo,"4":t.zoneSeuil,"5":t.zoneVo2}[z]||"");};
const todayStr=()=>{const t=new Date();return`${t.getFullYear()}-${String(t.getMonth()+1).padStart(2,"0")}-${String(t.getDate()).padStart(2,"0")}`;};
const getWeekDates=()=>{const today=new Date();const dow=(today.getDay()+6)%7;const monday=new Date(today);monday.setDate(today.getDate()-dow);return Array.from({length:7},(_,i)=>{const d=new Date(monday);d.setDate(monday.getDate()+i);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;});};

const DEFAULT_TEMPLATES = [
  {id:"tpl_push_a",name:"Push Day A",cat:"Push",color:"#2d7fff",exercises:[{libId:"bench_press",name:"Développé couché",sets:"4",reps:"6",rest:"150"},{libId:"incline_press",name:"Développé incliné",sets:"3",reps:"10",rest:"90"},{libId:"incline_fly",name:"Écarté incliné",sets:"3",reps:"12",rest:"60"},{libId:"dips",name:"Dips",sets:"3",reps:"12",rest:"60"},{libId:"pushup",name:"Pompes",sets:"3",reps:"15",rest:"60"}]},
  {id:"tpl_push_b",name:"Push Day B",cat:"Push",color:"#2d7fff",exercises:[{libId:"overhead_press",name:"Développé militaire",sets:"4",reps:"8",rest:"120"},{libId:"bench_dumbbell",name:"Développé haltères",sets:"3",reps:"10",rest:"90"},{libId:"lateral_raise",name:"Élévations latérales",sets:"3",reps:"15",rest:"60"},{libId:"skull_crusher",name:"Skull crusher",sets:"3",reps:"12",rest:"60"},{libId:"tricep_pushdown",name:"Pushdown triceps",sets:"3",reps:"15",rest:"60"}]},
  {id:"tpl_back_a",name:"Back Day A",cat:"Pull",color:"#8b5cf6",exercises:[{libId:"barbell_row",name:"Rowing barre",sets:"4",reps:"8",rest:"120"},{libId:"dumbbell_row",name:"Rowing haltère",sets:"3",reps:"10",rest:"90"},{libId:"lateral_raise",name:"Élévations latérales",sets:"3",reps:"15",rest:"60"},{libId:"pullup",name:"Traction",sets:"4",reps:"8",rest:"120"},{libId:"face_pull",name:"Face pull",sets:"3",reps:"15",rest:"60"}]},
  {id:"tpl_back_b",name:"Back Day B",cat:"Pull",color:"#8b5cf6",exercises:[{libId:"lat_pulldown",name:"Tirage poulie haute",sets:"4",reps:"10",rest:"90"},{libId:"gorilla_row",name:"Gorilla Row",sets:"3",reps:"10",rest:"90"},{libId:"face_pull",name:"Face pull",sets:"3",reps:"15",rest:"60"},{libId:"bicep_curl",name:"Curl biceps",sets:"3",reps:"12",rest:"60"},{libId:"hammer_curl",name:"Curl marteau",sets:"3",reps:"12",rest:"60"}]},
  {id:"tpl_leg_a",name:"Leg Day A",cat:"Legs",color:"#22c55e",exercises:[{libId:"back_squat",name:"Back Squat",sets:"4",reps:"6",rest:"180"},{libId:"hip_thrust",name:"Hip Thrust",sets:"4",reps:"10",rest:"90"},{libId:"bulgarian_split",name:"Fente bulgare",sets:"3",reps:"10",rest:"90"},{libId:"rdl",name:"Romanian Deadlift",sets:"3",reps:"10",rest:"90"},{libId:"crab_walk",name:"Marche crabe élastique",sets:"3",reps:"20",rest:"60"},{libId:"kickback",name:"Kickback fessier",sets:"3",reps:"15",rest:"60"}]},
  {id:"tpl_leg_b",name:"Leg Day B",cat:"Legs",color:"#22c55e",exercises:[{libId:"front_squat",name:"Front Squat",sets:"4",reps:"6",rest:"180"},{libId:"leg_press",name:"Presse à cuisses",sets:"3",reps:"12",rest:"90"},{libId:"leg_curl",name:"Leg curl",sets:"3",reps:"12",rest:"60"},{libId:"glute_bridge",name:"Pont fessier",sets:"3",reps:"15",rest:"60"},{libId:"calf_raise",name:"Mollets debout",sets:"4",reps:"20",rest:"45"}]},
  {id:"tpl_functional",name:"WOD Functional",cat:"Functional",color:"#f97316",exercises:[{libId:"kb_russian_swing",name:"KB Russian Swing",sets:"5",reps:"15",rest:"60"},{libId:"thruster",name:"Thruster",sets:"4",reps:"10",rest:"90"},{libId:"box_jump",name:"Box Jump",sets:"4",reps:"10",rest:"60"},{libId:"farmer_walk",name:"Farmer Walk",sets:"4",reps:"30m",rest:"90"},{libId:"wall_ball",name:"Wall Ball Shot",sets:"4",reps:"15",rest:"60"}]},
  {id:"tpl_fullbody",name:"Full Body",cat:"Musculation",color:"#2d7fff",exercises:[{libId:"deadlift",name:"Deadlift",sets:"4",reps:"5",rest:"180"},{libId:"overhead_press",name:"Développé militaire",sets:"3",reps:"8",rest:"120"},{libId:"pullup",name:"Traction",sets:"3",reps:"8",rest:"120"},{libId:"back_squat",name:"Back Squat",sets:"3",reps:"8",rest:"150"},{libId:"plank",name:"Gainage planche",sets:"3",reps:"60s",rest:"60"}]},
];

const applyTemplate=(template,clientSessions)=>{
  if(template.type==="wod"){return template.movements.map(mv=>({id:"se"+Date.now()+Math.random(),libId:mv.libId||"",name:mv.name,reps:mv.reps,sets:"1",load:"",rest:"",rpe:"",note:"",isWodMovement:true}));}
  return template.exercises.map(tplEx=>{
    let lastLoad="",lastReps=tplEx.reps,lastRpe="";
    for(const s of [...clientSessions].sort((a,b)=>b.date.localeCompare(a.date))){const found=(s.exercises||[]).find(e=>e.libId===tplEx.libId);if(found){lastLoad=found.load||"";lastReps=found.reps||tplEx.reps;lastRpe=found.rpe||"";break;}}
    let suggestedLoad=lastLoad;
    if(lastLoad&&+lastLoad>0&&lastRpe&&+lastRpe<=7)suggestedLoad=String(+lastLoad+2.5);
    return{id:"se"+Date.now()+Math.random(),libId:tplEx.libId,name:tplEx.name,sets:tplEx.sets,reps:lastReps,load:suggestedLoad,rest:tplEx.rest,rpe:"",
      note:lastLoad&&suggestedLoad!==lastLoad?`↑ +2.5kg vs dernière fois (${lastLoad}kg)`:lastLoad?`Dernière fois: ${lastLoad}kg`:"",
      cardioType:LIBRARY.find(l=>l.id===tplEx.libId)?.cardioType||""};
  });
};

const AnatomySVG=({id,th})=>{
  const app=useApp();const theme=th||app?.th;
  const BodyColor=theme===THEMES.light?"#c8d5f0":"#1a3a6e";
  const BodyStroke=theme===THEMES.light?"#a0b4d8":"#2d5fa0";
  const s={width:"100%",height:"100%"};
  const body={fill:BodyColor,stroke:BodyStroke,strokeWidth:1.5};
  const bg=theme===THEMES.light?"#e8eef8":"#061228";
  return(<div style={{width:"100%",aspectRatio:"2/1",background:bg,borderRadius:10,overflow:"hidden",display:"flex",alignItems:"center",justifyContent:"center",padding:6}}>
    <svg style={s} viewBox="0 0 200 120" fill="none">
      <line x1="100" y1="4" x2="100" y2="116" stroke={theme===THEMES.light?"#c8d5f0":"#1a3a6e"} strokeWidth="1"/>
      <circle cx="50" cy="24" r="8" {...body}/><rect x="44" y="32" width="12" height="22" rx="4" {...body}/><rect x="36" y="36" width="8" height="18" rx="3" {...body}/><rect x="56" y="36" width="8" height="18" rx="3" {...body}/><rect x="42" y="54" width="7" height="24" rx="3" {...body}/><rect x="51" y="54" width="7" height="24" rx="3" {...body}/><rect x="41" y="78" width="6" height="20" rx="2" {...body}/><rect x="50" y="78" width="6" height="20" rx="2" {...body}/>
      <circle cx="150" cy="24" r="8" {...body}/><rect x="144" y="32" width="12" height="22" rx="4" fill="#e63946" stroke="#ff6b7a" strokeWidth="1"/><rect x="136" y="36" width="8" height="18" rx="3" fill="#e63946" stroke="#ff6b7a" strokeWidth="1"/><rect x="156" y="36" width="8" height="18" rx="3" fill="#e63946" stroke="#ff6b7a" strokeWidth="1"/><rect x="142" y="54" width="7" height="24" rx="3" {...body}/><rect x="151" y="54" width="7" height="24" rx="3" {...body}/><rect x="141" y="78" width="6" height="20" rx="2" {...body}/><rect x="150" y="78" width="6" height="20" rx="2" {...body}/>
    </svg>
  </div>);
};

const SAMPLE_CLIENTS=[{
  id:"tony",name:"Tony Parker",age:41,sport:"Basketball",since:"2024-01",status:"actif",
  objective:"Maintien forme & mobilité",progress:78,notes:"Attention genou droit.",
  sessions:[
    {id:"s1",date:"2026-04-15",present:true,duration:90,note:"Push Day",templateId:"tpl_push_a",exercises:[{id:"se1",libId:"bench_press",name:"Développé couché",sets:"4",reps:"6",load:"90",rest:"150",rpe:"7"},{id:"se2",libId:"incline_press",name:"Développé incliné",sets:"3",reps:"10",load:"70",rest:"90",rpe:"6"}]},
    {id:"s2",date:"2026-04-10",present:true,duration:30,note:"WOD Cindy",templateId:"wod_cindy",isWod:true,wodFormat:"amrap",wodDuration:20,wodScore:"18 rounds + 5 pull-ups",exercises:[{id:"se3",libId:"pullup",name:"Pull-ups",reps:"5",isWodMovement:true},{id:"se4",libId:"pushup",name:"Push-ups",reps:"10",isWodMovement:true}]},
    {id:"s3",date:"2026-03-28",present:false,duration:0,note:"Absent",exercises:[]},
  ],
  planned:[
    {id:"pl1",date:"2026-04-22",type:"template",templateId:"tpl_leg_a",name:"Leg Day A",color:"#22c55e",note:"Apporter sa ceinture",exercises:[{id:"pe1",libId:"back_squat",name:"Back Squat",sets:"4",reps:"6",load:"100",rest:"180",rpe:"",note:""},{id:"pe2",libId:"hip_thrust",name:"Hip Thrust",sets:"4",reps:"10",load:"80",rest:"90",rpe:"",note:""}]},
    {id:"pl2",date:"2026-04-24",type:"wod",templateId:"wod_murph",name:"MURPH",color:"#e63946",note:"Gilet 10kg",exercises:[{id:"pw1",libId:"pullup",name:"Pull-ups",reps:"100",isWodMovement:true}]},
  ],
  metrics:[{date:"2026-04-01",weight:92.0,chest:104,waist:86,hips:98,fatPct:14.2},{date:"2026-03-01",weight:93.5,chest:105,waist:87,hips:99,fatPct:14.8}],
  programs:[{id:"p1",name:"Mobilité & Renforcement",weeks:8,startDate:"2026-03-01",exercises:[{id:"e1",name:"Hip 90/90",sets:"3",reps:"45s",load:"",note:"Chaque côté",libId:"hip90"},{id:"e2",name:"Back Squat",sets:"4",reps:"6",load:"100",note:"",libId:"back_squat"}]}],
  goals:[{id:"g1",label:"Descendre à 90 kg",done:false,deadline:"2026-06-01"},{id:"g2",label:"Masse grasse < 13%",done:false,deadline:"2026-07-01"},{id:"g3",label:"30 min course genou ✓",done:true,deadline:"2026-03-01"}]
}];
const makeGlobalCSS=(th)=>`
  @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { background: ${th.bg}; color: ${th.text}; font-family: 'Barlow', sans-serif; }
  ::-webkit-scrollbar { width: 4px; background: ${th.bg}; }
  ::-webkit-scrollbar-thumb { background: ${th.border}; border-radius: 4px; }
  input, textarea, select { color-scheme: ${th===THEMES.light?"light":"dark"}; }
  input::placeholder, textarea::placeholder { color: ${th.muted}; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
  .fu { animation: fadeUp .28s ease both; }
  .ch { transition: border-color .2s, transform .18s, box-shadow .2s; }
  .ch:hover { border-color: ${th.accent}66 !important; transform: translateY(-2px); box-shadow: 0 8px 32px rgba(0,60,180,.18); }
  button:active { transform: scale(.97); }
`;

const Avatar=({name,size=44})=>{
  const initials=name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();
  const hue=name.split("").reduce((a,c)=>a+c.charCodeAt(0),0)%60+200;
  return <div style={{width:size,height:size,borderRadius:"50%",background:`linear-gradient(135deg,hsl(${hue},70%,18%),hsl(${hue},70%,30%))`,border:`2px solid hsl(${hue},65%,40%)`,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:size*.36,color:`hsl(${hue},80%,72%)`,flexShrink:0}}>{initials}</div>;
};

const CoachAvatar=({photo,name,size=44})=>{
  const{th}=useApp();
  if(photo)return <div style={{width:size,height:size,borderRadius:"50%",overflow:"hidden",flexShrink:0,border:`2px solid ${th.accent}`}}><img src={photo} alt="coach" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>;
  return <Avatar name={name||"Coach"} size={size}/>;
};

const Badge=({label,color})=><span style={{padding:"2px 9px",borderRadius:20,background:color+"22",color,border:`1px solid ${color}44`,fontSize:10,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:"0.08em",textTransform:"uppercase",flexShrink:0}}>{label}</span>;

const Bar=({value,color})=>{
  const{th}=useApp();
  return(<div style={{background:th.border,borderRadius:99,height:5,overflow:"hidden"}}>
    <div style={{height:"100%",borderRadius:99,background:color||th.accent,width:`${Math.min(100,Math.max(0,value))}%`,transition:"width .7s",boxShadow:`0 0 10px ${color||th.accent}66`}}/>
  </div>);
};

const Field=({label,value,onChange,type="text",placeholder,half,third})=>{
  const{th}=useApp();
  let width="100%";if(half)width="calc(50% - 4px)";if(third)width="calc(33% - 4px)";
  return(<div style={{display:"flex",flexDirection:"column",gap:4,width,flexShrink:0}}>
    {label&&<label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>{label}</label>}
    <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
      style={{background:th.inputBg,border:`1.5px solid ${th.border}`,borderRadius:8,padding:"9px 10px",color:th.text,fontSize:13,fontFamily:"'Barlow',sans-serif",outline:"none",width:"100%",colorScheme:th===THEMES.light?"light":"dark",boxSizing:"border-box"}}
      onFocus={e=>e.target.style.borderColor=th.accent} onBlur={e=>e.target.style.borderColor=th.border}/>
  </div>);
};

const Btn=({children,onClick,ghost,small,danger,color})=>{
  const{th}=useApp();
  return(<button onClick={onClick} style={{padding:small?"6px 14px":"10px 22px",borderRadius:8,cursor:"pointer",border:ghost?`1.5px solid ${th.border}`:danger?"1.5px solid #e6394644":"none",background:ghost?"transparent":danger?"#e6394618":color||th.accent,color:ghost?th.mutedLight:danger?"#e63946":"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:small?11:14,letterSpacing:"0.06em",textTransform:"uppercase",transition:"all .15s"}}>{children}</button>);
};

const SecTitle=({c})=>{
  const{th}=useApp();
  return(<div style={{display:"flex",alignItems:"center",gap:8,marginBottom:14}}>
    <div style={{width:3,height:16,borderRadius:99,background:th.accent}}/>
    <span style={{fontSize:11,fontWeight:700,color:th.accent,letterSpacing:"0.1em",textTransform:"uppercase",fontFamily:"'Barlow Condensed',sans-serif"}}>{c}</span>
  </div>);
};

const SwipeToDelete=({children,onDelete,label="Supprimer"})=>{
  const[startX,setStartX]=useState(null);
  const[offsetX,setOffsetX]=useState(0);
  const[revealed,setRevealed]=useState(false);
  const[confirming,setConfirming]=useState(false);
  function onTouchStart(e){setStartX(e.touches[0].clientX);}
  function onTouchMove(e){if(startX===null||confirming)return;const diff=e.touches[0].clientX-startX;if(diff<0)setOffsetX(Math.max(diff,-100));else if(revealed)setOffsetX(Math.min(diff-100,0));}
  function onTouchEnd(){setStartX(null);if(offsetX<-75){setOffsetX(-100);setRevealed(true);}else{setOffsetX(0);setRevealed(false);}}
  function handleDelete(){setConfirming(true);setTimeout(()=>{onDelete();setConfirming(false);setOffsetX(0);setRevealed(false);},300);}
  function handleCancel(){setOffsetX(0);setRevealed(false);}
  return(<div style={{position:"relative",overflow:"hidden",borderRadius:14,marginBottom:10}}>
    <div style={{position:"absolute",right:0,top:0,bottom:0,width:100,display:"flex",flexDirection:"column",borderRadius:"0 14px 14px 0",overflow:"hidden"}}>
      <button onClick={handleDelete} style={{flex:1,background:"#e63946",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2}}>
        <span style={{fontSize:16}}>🗑️</span><span style={{color:"#fff",fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:"uppercase"}}>{label}</span>
      </button>
      <button onClick={handleCancel} style={{flex:0.6,background:"#1a3a6e",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <span style={{color:"#8ab0e0",fontSize:9,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,textTransform:"uppercase"}}>✕</span>
      </button>
    </div>
    <div onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd}
      style={{transform:`translateX(${confirming?-120:offsetX}px)`,transition:startX?'none':'transform .3s ease',position:"relative",zIndex:1}}>
      {children}
    </div>
  </div>);
};

const StatusDot=({status})=>{
  const{th,t}=useApp();
  const color=status==="live"?"#22c55e":status==="connecting"?"#f59e0b":th.muted;
  return(<div style={{display:"flex",alignItems:"center",gap:6,padding:"5px 14px",background:th.surface,borderBottom:`1px solid ${th.border}`}}>
    <div style={{width:6,height:6,borderRadius:"50%",background:color,boxShadow:status==="live"?`0 0 8px ${color}`:"none"}}/>
    <span style={{fontSize:10,color:th.muted}}>{status==="live"?t.syncLive:status==="connecting"?t.syncConnecting:t.syncLocal}</span>
  </div>);
};

const RPESelector=({value,onChange})=>{
  const{th,lang}=useApp();
  return(<div style={{width:"100%"}}>
    <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:4}}>RPE {value?`${value}/10 — ${rpeLabel(value,lang)}`:""}</label>
    <div style={{display:"flex",gap:3}}>
      {[1,2,3,4,5,6,7,8,9,10].map(n=>(
        <button key={n} onClick={()=>onChange(value===String(n)?"":String(n))}
          style={{flex:1,padding:"7px 0",borderRadius:6,border:`1px solid ${+value===n?rpeColor(n)+"88":th.border}`,background:+value===n?rpeColor(n)+"22":"transparent",color:+value===n?rpeColor(n):th.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:11,cursor:"pointer",transition:"all .15s"}}>
          {n}
        </button>
      ))}
    </div>
  </div>);
};

const ZoneSelector=({value,onChange})=>{
  const{th,lang}=useApp();
  return(<div style={{width:"100%"}}>
    <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:4}}>Zone {value?`${value} — ${zoneLabel(value,lang)}`:""}</label>
    <div style={{display:"flex",gap:4}}>
      {["1","2","3","4","5"].map(z=>(
        <button key={z} onClick={()=>onChange(value===z?"":z)}
          style={{flex:1,padding:"8px 0",borderRadius:6,border:`1px solid ${value===z?zoneColor(z)+"88":th.border}`,background:value===z?zoneColor(z)+"22":"transparent",color:value===z?zoneColor(z):th.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:12,cursor:"pointer",transition:"all .15s"}}>
          Z{z}
        </button>
      ))}
    </div>
  </div>);
};

const CardioFields=({ex,onChange})=>{
  const type=ex.cardioType||"duration";
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      <Field label="Durée (min)" type="number" value={ex.duration||""} onChange={v=>onChange("duration",v)} placeholder="20" half/>
      {type==="run"&&<Field label="Vitesse km/h" type="number" value={ex.speed||""} onChange={v=>onChange("speed",v)} placeholder="12" half/>}
      {type==="watts"&&<Field label="Watts" type="number" value={ex.watts||""} onChange={v=>onChange("watts",v)} placeholder="200" half/>}
    </div>
    <ZoneSelector value={ex.zone||""} onChange={v=>onChange("zone",v)}/>
  </div>);
};

const ExerciseFields=({ex,onChange,onRemove,idx})=>{
  const{th}=useApp();
  const libEx=LIBRARY.find(l=>l.id===ex.libId);
  const isCardio=libEx?.cat==="Cardio";
  const isWod=ex.isWodMovement;
  return(<div style={{background:th.cardAlt,borderRadius:10,padding:10,marginBottom:8,border:`1px solid ${th.border}`}}>
    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
      <div style={{width:32,height:16,borderRadius:4,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.libId}/></div>
      <span style={{flex:1,fontSize:13,fontWeight:700,color:th.text}}>{ex.name}</span>
      {isWod&&<Badge label={`× ${ex.reps}`} color="#f97316"/>}
      {libEx&&<Badge label={libEx.cat} color={CAT_COLOR[libEx.cat]||th.accent}/>}
      {onRemove&&<button onClick={onRemove} style={{background:"none",border:"none",color:"#e63946",cursor:"pointer",fontSize:16,padding:0,flexShrink:0}}>✕</button>}
    </div>
    {!isWod&&(isCardio?(
      <CardioFields ex={ex} onChange={(field,val)=>onChange(idx,field,val)}/>
    ):(
      <div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}>
          <Field label="Séries" type="number" value={ex.sets||""} onChange={v=>onChange(idx,"sets",v)} placeholder="3" third/>
          <Field label="Reps" type="number" value={ex.reps||""} onChange={v=>onChange(idx,"reps",v)} placeholder="10" third/>
          <Field label="Charge kg" type="number" value={ex.load||""} onChange={v=>onChange(idx,"load",v)} placeholder="0" third/>
          <Field label="Repos sec" type="number" value={ex.rest||""} onChange={v=>onChange(idx,"rest",v)} placeholder="60" half/>
          <Field label="Note" value={ex.note||""} onChange={v=>onChange(idx,"note",v)} placeholder="Remarque..." half/>
        </div>
        <RPESelector value={ex.rpe||""} onChange={v=>onChange(idx,"rpe",v)}/>
      </div>
    ))}
  </div>);
};

// ── CHRONOMÈTRE ───────────────────────────────────────────────────────────────
const ChronoWidget=()=>{
  const{th,t}=useApp();
  const[mode,setMode]=useState("free"); // free | tabata | interval
  const[running,setRunning]=useState(false);
  const[time,setTime]=useState(0); // ms
  const[phase,setPhase]=useState("work"); // work | rest
  const[round,setRound]=useState(1);
  const[countdown,setCountdown]=useState(null);
  const[tabataFormat,setTabataFormat]=useState(TABATA_FORMATS[0]);
  const[intervalWork,setIntervalWork]=useState(30);
  const[intervalRest,setIntervalRest]=useState(30);
  const[intervalRounds,setIntervalRounds]=useState(8);
  const[totalRounds,setTotalRounds]=useState(tabataFormat.rounds);
  const[finished,setFinished]=useState(false);
  const intervalRef=useRef(null);
  const audioCtx=useRef(null);

  function beep(freq=880,dur=0.15,vol=0.5){
    try{
      if(!audioCtx.current)audioCtx.current=new(window.AudioContext||window.webkitAudioContext)();
      const osc=audioCtx.current.createOscillator();
      const gain=audioCtx.current.createGain();
      osc.connect(gain);gain.connect(audioCtx.current.destination);
      osc.frequency.value=freq;gain.gain.value=vol;
      osc.start();osc.stop(audioCtx.current.currentTime+dur);
    }catch(e){}
  }

  function doubleBip(){beep(880,0.12);setTimeout(()=>beep(880,0.12),180);}
  function tripleBip(){beep(660,0.1);setTimeout(()=>beep(660,0.1),150);setTimeout(()=>beep(1100,0.2),300);}

  useEffect(()=>{
    if(!running){clearInterval(intervalRef.current);return;}
    intervalRef.current=setInterval(()=>{
      if(mode==="free"){setTime(p=>p+100);return;}
      setCountdown(p=>{
        if(p===null)return p;
        const next=p-0.1;
        if(next<=0.05){
          // Switch phase
          setPhase(ph=>{
            const workSec=mode==="tabata"?tabataFormat.work:intervalWork;
            const restSec=mode==="tabata"?tabataFormat.rest:intervalRest;
            const maxRounds=mode==="tabata"?tabataFormat.rounds:intervalRounds;
            if(ph==="work"){
              doubleBip();
              setRound(r=>{
                if(r>=maxRounds){setRunning(false);setFinished(true);tripleBip();return r;}
                return r;
              });
              return "rest";
            } else {
              doubleBip();
              setRound(r=>r+1);
              return "work";
            }
          });
          const workSec=mode==="tabata"?tabataFormat.work:intervalWork;
          const restSec=mode==="tabata"?tabataFormat.rest:intervalRest;
          return phase==="work"?restSec:workSec;
        }
        if(next<=3.05&&next>2.95)beep(440,0.08,0.3);
        if(next<=2.05&&next>1.95)beep(440,0.08,0.3);
        if(next<=1.05&&next>0.95)beep(660,0.1,0.4);
        return next;
      });
    },100);
    return()=>clearInterval(intervalRef.current);
  },[running,mode,phase,tabataFormat,intervalWork,intervalRest,intervalRounds]);

  function start(){
    setFinished(false);
    if(mode==="free"){setRunning(true);return;}
    const workSec=mode==="tabata"?tabataFormat.work:intervalWork;
    setCountdown(workSec);setPhase("work");setRound(1);setRunning(true);doubleBip();
  }

  function pause(){setRunning(p=>!p);}

  function reset(){
    setRunning(false);setTime(0);setPhase("work");setRound(1);setFinished(false);
    clearInterval(intervalRef.current);
    const workSec=mode==="tabata"?tabataFormat.work:intervalWork;
    setCountdown(mode==="free"?null:workSec);
  }

  function changeMode(m){reset();setMode(m);setCountdown(null);}

  const formatTime=(ms)=>{
    const s=Math.floor(ms/1000);const m=Math.floor(s/60);
    return`${String(m).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;
  };

  const maxRounds=mode==="tabata"?tabataFormat.rounds:intervalRounds;
  const isWork=phase==="work";
  const phaseColor=isWork?"#e63946":"#22c55e";
  const cntDisplay=countdown!==null?Math.ceil(countdown):0;
  const cntPct=countdown!==null?(mode==="tabata"?(isWork?tabataFormat.work:tabataFormat.rest):(isWork?intervalWork:intervalRest)):1;

  return(<div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:16,overflow:"hidden",marginBottom:16}}>
    {/* Mode tabs */}
    <div style={{display:"flex",gap:2,background:th.surface,padding:4,borderBottom:`1px solid ${th.border}`}}>
      {[{id:"free",label:t.chronoCustom},{id:"tabata",label:t.chronoTabata},{id:"interval",label:t.chronoInterval}].map(m=>(
        <button key={m.id} onClick={()=>changeMode(m.id)} style={{flex:1,padding:"8px 4px",borderRadius:8,border:"none",cursor:"pointer",background:mode===m.id?th.accent:"transparent",color:mode===m.id?"#fff":th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",transition:"all .2s"}}>{m.label}</button>
      ))}
    </div>

    <div style={{padding:16}}>
      {/* Settings */}
      {mode==="tabata"&&!running&&!finished&&(
        <div style={{marginBottom:14}}>
          <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:8}}>Format Tabata</label>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {TABATA_FORMATS.map(f=>(
              <button key={f.id} onClick={()=>{setTabataFormat(f);setTotalRounds(f.rounds);}}
                style={{padding:"10px 14px",borderRadius:10,border:`1px solid ${tabataFormat.id===f.id?"#22c55e":th.border}`,background:tabataFormat.id===f.id?"#22c55e22":"transparent",color:tabataFormat.id===f.id?"#22c55e":th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span>{f.label}</span>
                <span style={{fontSize:10,color:tabataFormat.id===f.id?"#22c55e44":th.muted}}>{f.rounds} rounds · {f.work+f.rest}s/cycle</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {mode==="interval"&&!running&&!finished&&(
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
          <div style={{display:"flex",flexDirection:"column",gap:4,flex:1,minWidth:80}}>
            <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>Effort (s)</label>
            <input type="number" value={intervalWork} onChange={e=>setIntervalWork(+e.target.value||30)}
              style={{background:th.inputBg,border:`1.5px solid ${th.border}`,borderRadius:8,padding:"9px 10px",color:th.text,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,outline:"none",textAlign:"center"}}
              onFocus={e=>e.target.style.borderColor="#e63946"} onBlur={e=>e.target.style.borderColor=th.border}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,flex:1,minWidth:80}}>
            <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>Repos (s)</label>
            <input type="number" value={intervalRest} onChange={e=>setIntervalRest(+e.target.value||30)}
              style={{background:th.inputBg,border:`1.5px solid ${th.border}`,borderRadius:8,padding:"9px 10px",color:th.text,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,outline:"none",textAlign:"center"}}
              onFocus={e=>e.target.style.borderColor="#22c55e"} onBlur={e=>e.target.style.borderColor=th.border}/>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,flex:1,minWidth:80}}>
            <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>Rounds</label>
            <input type="number" value={intervalRounds} onChange={e=>setIntervalRounds(+e.target.value||8)}
              style={{background:th.inputBg,border:`1.5px solid ${th.border}`,borderRadius:8,padding:"9px 10px",color:th.text,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,outline:"none",textAlign:"center"}}
              onFocus={e=>e.target.style.borderColor=th.accent} onBlur={e=>e.target.style.borderColor=th.border}/>
          </div>
        </div>
      )}

      {/* Display */}
      {mode==="free"?(
        <div style={{textAlign:"center",padding:"10px 0 16px"}}>
          <div style={{fontSize:72,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",color:running?th.accent:th.mutedLight,letterSpacing:2,lineHeight:1,transition:"color .3s"}}>
            {formatTime(time)}
          </div>
          {running&&<div style={{fontSize:12,color:th.muted,marginTop:8}}>⏱ En cours...</div>}
        </div>
      ):(
        <div style={{textAlign:"center",padding:"8px 0 16px"}}>
          {/* Phase indicator */}
          <div style={{fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:phaseColor,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>
            {finished?"🏁 TERMINÉ !":running?(isWork?"💪 EFFORT":"😮‍💨 REPOS"):"PRÊT"}
          </div>
          {/* Countdown ring */}
          <div style={{position:"relative",width:160,height:160,margin:"0 auto 12px"}}>
            <svg width="160" height="160" style={{transform:"rotate(-90deg)"}}>
              <circle cx="80" cy="80" r="70" fill="none" stroke={th.border} strokeWidth="8"/>
              <circle cx="80" cy="80" r="70" fill="none" stroke={phaseColor} strokeWidth="8"
                strokeDasharray={`${2*Math.PI*70}`}
                strokeDashoffset={`${2*Math.PI*70*(1-(countdown||0)/cntPct)}`}
                strokeLinecap="round" style={{transition:"stroke-dashoffset .1s linear,stroke .3s"}}/>
            </svg>
            <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
              <div style={{fontSize:52,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",color:phaseColor,lineHeight:1}}>{finished?"✅":cntDisplay}</div>
              {!finished&&<div style={{fontSize:11,color:th.muted,marginTop:2}}>sec</div>}
            </div>
          </div>
          {/* Round indicator */}
          {!finished&&(
            <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6,marginBottom:8}}>
              <span style={{fontSize:12,color:th.muted}}>Round</span>
              <span style={{fontSize:20,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",color:th.accent}}>{running||countdown!==null?round:1}</span>
              <span style={{fontSize:12,color:th.muted}}>/ {maxRounds}</span>
            </div>
          )}
          {/* Mini rounds dots */}
          <div style={{display:"flex",gap:4,justifyContent:"center",flexWrap:"wrap",marginBottom:8}}>
            {Array.from({length:Math.min(maxRounds,16)},(_,i)=>(
              <div key={i} style={{width:8,height:8,borderRadius:"50%",background:i<round-1?"#22c55e":i===round-1&&running?phaseColor:th.border,transition:"background .3s"}}/>
            ))}
            {maxRounds>16&&<span style={{fontSize:10,color:th.muted}}>+{maxRounds-16}</span>}
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{display:"flex",gap:8,justifyContent:"center"}}>
        {!running&&!finished&&(
          <button onClick={start} style={{flex:1,padding:"14px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${th.accent},${th.accent}88)`,color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",boxShadow:`0 4px 16px ${th.accent}44`}}>
            {t.chronoStart}
          </button>
        )}
        {running&&(
          <button onClick={pause} style={{flex:1,padding:"14px",borderRadius:12,border:`2px solid ${th.accent}`,background:"transparent",color:th.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,cursor:"pointer"}}>
            {t.chronoStop}
          </button>
        )}
        {(running||time>0||finished||(countdown!==null&&countdown<(mode==="tabata"?tabataFormat.work:intervalWork)))&&(
          <button onClick={reset} style={{padding:"14px 20px",borderRadius:12,border:`1px solid ${th.border}`,background:"transparent",color:th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,cursor:"pointer"}}>
            {t.chronoReset}
          </button>
        )}
      </div>
    </div>
  </div>);
};

// ── LEXICON VIEW ──────────────────────────────────────────────────────────────
const LexiconView=({onBack})=>{
  const{th,t,lang}=useApp();
  const[sel,setSel]=useState(null);
  return(<div style={{minHeight:"100vh",background:th.bg,paddingBottom:48}}>
    <div style={{padding:"16px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:th.mutedLight,cursor:"pointer",fontSize:12,marginBottom:14,fontFamily:"'Barlow',sans-serif",padding:0}}>{t.back_simple}</button>
      <div style={{fontSize:32,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:6,color:th.text}}>📖 {t.lexiconTitle}</div>
      <div style={{fontSize:12,color:th.muted,marginBottom:20}}>Terminologie & concepts fitness</div>
      {LEXICON.map((item,i)=>(
        <div key={item.id} className="fu" style={{animationDelay:`${i*.05}s`,marginBottom:10}}>
          <div onClick={()=>setSel(sel===item.id?null:item.id)}
            style={{background:sel===item.id?item.color+"11":th.card,border:`1px solid ${sel===item.id?item.color+"66":th.border}`,borderRadius:sel===item.id?"14px 14px 0 0":14,padding:"14px 16px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .2s"}}>
            <div style={{width:40,height:40,borderRadius:10,background:item.color+"22",border:`1px solid ${item.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{item.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",color:sel===item.id?item.color:th.text}}>{lang==="fr"?item.titleF:item.titleE}</div>
            </div>
            <span style={{fontSize:18,color:sel===item.id?item.color:th.muted,transition:"transform .2s",transform:sel===item.id?"rotate(180deg)":"none"}}>▼</span>
          </div>
          {sel===item.id&&(
            <div style={{background:th.surface,border:`1px solid ${item.color}44`,borderTop:"none",borderRadius:"0 0 14px 14px",padding:"16px 18px"}}>
              <div style={{fontSize:13,color:th.text,lineHeight:1.8,whiteSpace:"pre-line"}}>{lang==="fr"?item.contentF:item.contentE}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>);
};

// ── DISCIPLINES VIEW ──────────────────────────────────────────────────────────
const DisciplinesView=({onBack})=>{
  const{th,t,lang}=useApp();
  const[sel,setSel]=useState(null);
  return(<div style={{minHeight:"100vh",background:th.bg,paddingBottom:48}}>
    <div style={{padding:"16px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:th.mutedLight,cursor:"pointer",fontSize:12,marginBottom:14,fontFamily:"'Barlow',sans-serif",padding:0}}>{t.back_simple}</button>
      <div style={{fontSize:32,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:6,color:th.text}}>🏅 {t.disciplinesTitle}</div>
      <div style={{fontSize:12,color:th.muted,marginBottom:20}}>Sports & disciplines de fitness</div>
      {DISCIPLINES.map((disc,i)=>(
        <div key={disc.id} className="fu" style={{animationDelay:`${i*.08}s`,marginBottom:12}}>
          <div onClick={()=>setSel(sel===disc.id?null:disc.id)}
            style={{background:sel===disc.id?disc.color+"18":th.card,border:`2px solid ${sel===disc.id?disc.color:th.border}`,borderRadius:sel===disc.id?"16px 16px 0 0":16,padding:"16px 18px",cursor:"pointer",display:"flex",alignItems:"center",gap:14,transition:"all .2s"}}>
            <div style={{width:52,height:52,borderRadius:12,background:disc.color+"22",border:`2px solid ${disc.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{disc.icon}</div>
            <div style={{flex:1}}>
              <div style={{fontWeight:900,fontSize:20,fontFamily:"'Barlow Condensed',sans-serif",color:sel===disc.id?disc.color:th.text}}>{lang==="fr"?disc.nameF:disc.nameE}</div>
              <div style={{fontSize:11,color:th.muted,marginTop:2}}>{lang==="fr"?disc.subtitleF:disc.subtitleE}</div>
            </div>
            <div style={{width:8,height:8,borderRadius:"50%",background:sel===disc.id?disc.color:th.border,boxShadow:sel===disc.id?`0 0 8px ${disc.color}`:"none",transition:"all .3s"}}/>
          </div>
          {sel===disc.id&&(
            <div style={{background:th.surface,border:`2px solid ${disc.color}44`,borderTop:"none",borderRadius:"0 0 16px 16px",padding:"18px 20px"}}>
              <div style={{fontSize:13,color:th.text,lineHeight:1.9,whiteSpace:"pre-line"}}>{lang==="fr"?disc.descF:disc.descE}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  </div>);
};

// ── SIDE MENU ─────────────────────────────────────────────────────────────────
const SideMenu=({open,onClose,coachProfile,onUpdateProfile,clients,customTemplates,onNav})=>{
  const{th,t,theme,setTheme,lang,setLang}=useApp();
  const[menuTab,setMenuTab]=useState("profile");
  const fileRef=useRef(null);
  const[localName,setLocalName]=useState(coachProfile.name);
  const[localSpec,setLocalSpec]=useState(coachProfile.specialty);

  const allSessions=clients.flatMap(c=>c.sessions||[]);
  const allGoals=clients.flatMap(c=>c.goals||[]);
  const allPlanned=clients.flatMap(c=>c.planned||[]);
  const activeClients=clients.filter(c=>c.status==="actif");
  const totalSessions=allSessions.filter(s=>s.present).length;
  const totalWods=allSessions.filter(s=>s.isWod&&s.present).length;
  const avgAtt=activeClients.length?Math.round(activeClients.reduce((a,c)=>{if(!c.sessions.length)return a;return a+c.sessions.filter(s=>s.present).length/c.sessions.length;},0)/activeClients.length*100):0;
  const goalsCompleted=allGoals.filter(g=>g.done).length;
  const monthCount={};
  allSessions.filter(s=>s.present&&s.date).forEach(s=>{const m=s.date.slice(0,7);monthCount[m]=(monthCount[m]||0)+1;});
  const bestMonthKey=Object.keys(monthCount).sort((a,b)=>monthCount[b]-monthCount[a])[0];
  const MN=lang==="fr"?MONTH_NAMES:MONTH_NAMES_EN;
  const bestMonthLabel=bestMonthKey?`${MN[bestMonthKey.slice(5)]} ${bestMonthKey.slice(0,4)} (${monthCount[bestMonthKey]})`:"—";
  const weekDates=getWeekDates();
  const weekSessions=allSessions.filter(s=>s.present&&weekDates.includes(s.date)).length;
  const achievStats={clientCount:clients.length,sessionCount:totalSessions,wodCount:totalWods,goalsCount:goalsCompleted,plannedCount:allPlanned.length,weekStreak:weekSessions,templateCount:customTemplates.length};
  const unlockedAchievements=ACHIEVEMENTS.filter(a=>a.check(achievStats));
  const unlockedIds=new Set(unlockedAchievements.map(a=>a.id));

  function handlePhoto(e){const file=e.target.files[0];if(!file)return;const reader=new FileReader();reader.onload=ev=>onUpdateProfile({...coachProfile,photo:ev.target.result});reader.readAsDataURL(file);}
  function saveProfile(){onUpdateProfile({...coachProfile,name:localName,specialty:localSpec});}

  const mainTabs=[
    {id:"profile",icon:"👤",label:t.menuCoach},
    {id:"stats",icon:"📊",label:t.menuStats},
    {id:"achievements",icon:"🏆",label:t.menuAchievements},
  ];
  const navTabs=[
    {id:"lexicon",icon:"📖",label:t.menuLexicon},
    {id:"disciplines",icon:"🏅",label:t.menuDisciplines},
  ];
  const bottomTabs=[
    {id:"theme",icon:"🎨",label:t.menuTheme},
    {id:"lang",icon:"🌍",label:t.menuLang},
  ];

  return(<>
    {open&&<div onClick={onClose} style={{position:"fixed",inset:0,background:"#000a",zIndex:299,backdropFilter:"blur(3px)"}}/>}
    <div style={{position:"fixed",top:0,left:0,bottom:0,width:300,background:th.card,borderRight:`1px solid ${th.border}`,zIndex:300,transform:open?"translateX(0)":"translateX(-100%)",transition:"transform .3s ease",display:"flex",flexDirection:"column",overflow:"hidden"}}>
      {/* Header */}
      <div style={{padding:"20px 16px 14px",borderBottom:`1px solid ${th.border}`,background:th.navyLight,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:4}}>
          <CoachAvatar photo={coachProfile.photo} name={coachProfile.name} size={48}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:900,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",color:th.text,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{coachProfile.name||"Logan Lagarde"}</div>
            <div style={{fontSize:11,color:th.mutedLight}}>{coachProfile.specialty||"Coach individuel"}</div>
          </div>
          <button onClick={onClose} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:20,padding:0,flexShrink:0}}>✕</button>
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{display:"flex",flexDirection:"column",gap:2,padding:"10px 10px 0",flexShrink:0}}>
        {mainTabs.map(tab=>(
          <button key={tab.id} onClick={()=>setMenuTab(tab.id)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:menuTab===tab.id?th.accent+"22":"transparent",color:menuTab===tab.id?th.accent:th.mutedLight,fontFamily:"'Barlow',sans-serif",fontWeight:menuTab===tab.id?700:500,fontSize:13,textAlign:"left",borderLeft:menuTab===tab.id?`3px solid ${th.accent}`:"3px solid transparent",transition:"all .15s"}}>
            <span style={{fontSize:16}}>{tab.icon}</span>{tab.label}
          </button>
        ))}
        <div style={{height:1,background:th.border,margin:"6px 0"}}/>
        {navTabs.map(tab=>(
          <button key={tab.id} onClick={()=>{onNav(tab.id);onClose();}}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:"transparent",color:th.mutedLight,fontFamily:"'Barlow',sans-serif",fontWeight:500,fontSize:13,textAlign:"left",borderLeft:"3px solid transparent",transition:"all .15s"}}>
            <span style={{fontSize:16}}>{tab.icon}</span>{tab.label}
            <span style={{marginLeft:"auto",fontSize:12,color:th.muted}}>→</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{flex:1,overflowY:"auto",padding:"14px 14px 0"}}>
        {menuTab==="profile"&&(
          <div className="fu">
            <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:12,marginBottom:20}}>
              <CoachAvatar photo={coachProfile.photo} name={coachProfile.name} size={80}/>
              <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={handlePhoto}/>
              <button onClick={()=>fileRef.current?.click()} style={{background:th.accent+"22",border:`1px solid ${th.accent}44`,borderRadius:8,padding:"7px 16px",color:th.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer"}}>
                {t.uploadPhoto}
              </button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <Field label={t.coachName} value={localName} onChange={setLocalName} placeholder="Logan Lagarde"/>
              <Field label={t.specialty} value={localSpec} onChange={setLocalSpec} placeholder={t.specialtyPh}/>
            </div>
            <div style={{marginTop:16}}><Btn onClick={saveProfile}>{t.saveChanges}</Btn></div>
          </div>
        )}
        {menuTab==="stats"&&(
          <div className="fu">
            <div style={{fontSize:13,color:th.mutedLight,marginBottom:14}}>{t.statsTitle}</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
              {[
                {l:t.totalClients,v:activeClients.length,c:th.accent,i:"⚡"},
                {l:t.totalSessions,v:totalSessions,c:"#22c55e",i:"💪"},
                {l:t.totalWods,v:totalWods,c:"#f97316",i:"🏋️"},
                {l:t.avgAttendance,v:avgAtt+"%",c:avgAtt>=80?"#22c55e":"#f59e0b",i:"🎯"},
                {l:t.goalsCompleted,v:goalsCompleted,c:"#22c55e",i:"🎯"},
              ].map(s=>(
                <div key={s.l} style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:12,padding:"12px 14px"}}>
                  <div style={{fontSize:9,color:th.muted,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>{s.i} {s.l}</div>
                  <div style={{fontSize:22,fontWeight:900,color:s.c,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1}}>{s.v}</div>
                </div>
              ))}
              <div style={{background:th.surface,border:`1px solid ${th.border}`,borderRadius:12,padding:"12px 14px",gridColumn:"1/-1"}}>
                <div style={{fontSize:9,color:th.muted,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>🏅 {t.bestMonth}</div>
                <div style={{fontSize:14,fontWeight:800,color:th.text,fontFamily:"'Barlow Condensed',sans-serif"}}>{bestMonthLabel}</div>
              </div>
            </div>
          </div>
        )}
        {menuTab==="achievements"&&(
          <div className="fu">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{fontSize:13,color:th.mutedLight}}>{t.achievementsTitle}</div>
              <div style={{fontSize:12,fontWeight:700,color:th.accent}}>{unlockedAchievements.length}/{ACHIEVEMENTS.length} {t.achievementsProgress}</div>
            </div>
            <div style={{marginBottom:16}}><Bar value={unlockedAchievements.length/ACHIEVEMENTS.length*100} color={th.accent}/></div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {ACHIEVEMENTS.map(a=>{
                const unlocked=unlockedIds.has(a.id);
                return(<div key={a.id} style={{background:unlocked?a.color+"18":th.surface,border:`1px solid ${unlocked?a.color+"55":th.border}`,borderRadius:12,padding:"12px 10px",opacity:unlocked?1:0.45,transition:"all .3s"}}>
                  <div style={{fontSize:24,marginBottom:6,filter:unlocked?"none":"grayscale(1)"}}>{a.icon}</div>
                  <div style={{fontWeight:800,fontSize:11,fontFamily:"'Barlow Condensed',sans-serif",color:unlocked?a.color:th.muted,marginBottom:4,textTransform:"uppercase"}}>{lang==="fr"?a.nameF:a.nameE}</div>
                  <div style={{fontSize:10,color:th.muted,lineHeight:1.3}}>{lang==="fr"?a.descF:a.descE}</div>
                  {unlocked&&<div style={{marginTop:6,fontSize:9,color:a.color,fontWeight:700}}>✓ {t.achieved}</div>}
                </div>);
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom — theme + lang */}
      <div style={{padding:"10px",borderTop:`1px solid ${th.border}`,background:th.surface,flexShrink:0}}>
        {bottomTabs.map(tab=>(
          <button key={tab.id} onClick={()=>setMenuTab(menuTab===tab.id?null:tab.id)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:10,border:"none",cursor:"pointer",background:menuTab===tab.id?th.accent+"22":"transparent",color:menuTab===tab.id?th.accent:th.mutedLight,fontFamily:"'Barlow',sans-serif",fontWeight:menuTab===tab.id?700:500,fontSize:13,textAlign:"left",width:"100%",marginBottom:4,borderLeft:menuTab===tab.id?`3px solid ${th.accent}`:"3px solid transparent",transition:"all .15s"}}>
            <span style={{fontSize:16}}>{tab.icon}</span>{tab.label}
            <span style={{marginLeft:"auto",fontSize:11,color:th.muted}}>{tab.id==="theme"?(theme==="dark"?"🌙 Sombre":"☀️ Clair"):(lang==="fr"?"🇫🇷":"🇬🇧")}</span>
          </button>
        ))}
        {menuTab==="theme"&&(
          <div style={{display:"flex",gap:6,padding:"8px 0 4px"}}>
            {[{id:"dark",label:t.darkMode},{id:"light",label:t.lightMode}].map(opt=>(
              <button key={opt.id} onClick={()=>setTheme(opt.id)} style={{flex:1,padding:"10px",borderRadius:10,border:`2px solid ${theme===opt.id?th.accent:th.border}`,background:theme===opt.id?th.accent+"22":"transparent",color:theme===opt.id?th.accent:th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer",textTransform:"uppercase"}}>
                {opt.label} {theme===opt.id?"✓":""}
              </button>
            ))}
          </div>
        )}
        {menuTab==="lang"&&(
          <div style={{display:"flex",gap:6,padding:"8px 0 4px"}}>
            {[{id:"fr",flag:"🇫🇷",label:"Français"},{id:"en",flag:"🇬🇧",label:"English"}].map(opt=>(
              <button key={opt.id} onClick={()=>setLang(opt.id)} style={{flex:1,padding:"10px",borderRadius:10,border:`2px solid ${lang===opt.id?th.accent:th.border}`,background:lang===opt.id?th.accent+"22":"transparent",color:lang===opt.id?th.accent:th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,cursor:"pointer"}}>
                {opt.flag} {opt.label} {lang===opt.id?"✓":""}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  </>);
};
// ── SESSION LIVE MODE ─────────────────────────────────────────────────────────
const SessionLiveMode=({plan,allTemplates,allWods,onSave,onClose})=>{
  const{th,t}=useApp();
  const fmt=plan.type==="wod"?WOD_FORMATS.find(f=>f.id===plan.wodFormat):null;
  const[exercises,setExercises]=useState((plan.exercises||[]).map(ex=>({...ex,load:ex.load||"",reps:ex.reps||"",sets:ex.sets||"",rpe:"",note:ex.note||"",duration:ex.duration||"",speed:ex.speed||"",watts:ex.watts||"",zone:ex.zone||""})));
  const[duration,setDuration]=useState("");
  const[sessionNote,setSessionNote]=useState(plan.note||"");
  const[wodScore,setWodScore]=useState("");
  const[startTime]=useState(Date.now());
  const[showChrono,setShowChrono]=useState(false);
  function updateEx(idx,field,val){setExercises(p=>p.map((ex,i)=>i===idx?{...ex,[field]:val}:ex));}
  function handleSave(){
    const sess={id:"s"+Date.now(),date:plan.date,present:true,duration:+duration||Math.round((Date.now()-startTime)/60000),note:sessionNote,templateId:plan.templateId,isWod:plan.type==="wod",...(plan.type==="wod"?{wodFormat:plan.wodFormat,wodDuration:plan.duration,wodScore,wodName:plan.name,wodColor:plan.color}:{}),exercises};
    onSave(sess);
  }
  const color=plan.color||th.accent;
  return(<div style={{position:"fixed",inset:0,background:th.bg,zIndex:200,overflowY:"auto",paddingBottom:40}}>
    <div style={{background:`linear-gradient(135deg,${color}22,${th.bg})`,padding:"16px 16px 14px",borderBottom:`1px solid ${color}44`,position:"sticky",top:0,zIndex:10,backdropFilter:"blur(10px)"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <button onClick={onClose} style={{background:"none",border:"none",color:th.mutedLight,cursor:"pointer",fontSize:12,fontFamily:"'Barlow',sans-serif",padding:0}}>{t.close}</button>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <button onClick={()=>setShowChrono(!showChrono)} style={{background:showChrono?th.accent+"22":"transparent",border:`1px solid ${showChrono?th.accent:th.border}`,borderRadius:8,padding:"4px 12px",color:showChrono?th.accent:th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer",textTransform:"uppercase"}}>
            ⏱ Chrono
          </button>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 8px #22c55e"}}/>
            <span style={{fontSize:10,color:"#22c55e",fontWeight:700,letterSpacing:"0.1em"}}>{t.inProgress_label}</span>
          </div>
        </div>
      </div>
      <div style={{fontSize:26,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",color,marginBottom:2}}>{plan.type==="wod"?"🏋️ ":""}{plan.name}</div>
      <div style={{fontSize:12,color:th.mutedLight}}>{plan.date} · {plan.type==="wod"?(fmt?`${fmt.icon} ${fmt.name}${plan.duration?` — ${plan.duration} min`:""}`:""): `${exercises.length} exercices`}</div>
      {plan.note&&<div style={{fontSize:11,color:th.muted,marginTop:4,fontStyle:"italic"}}>📝 {plan.note}</div>}
    </div>
    <div style={{padding:"16px"}}>
      {showChrono&&<ChronoWidget/>}
      {plan.type==="wod"&&(
        <div style={{background:color+"11",border:`1px solid ${color}33`,borderRadius:14,padding:14,marginBottom:16}}>
          <div style={{fontSize:12,fontWeight:700,color,marginBottom:8}}>{fmt?.icon} {fmt?.name} {plan.duration?`— ${plan.duration} min`:""}</div>
          {exercises.map((ex,i)=>(
            <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:i<exercises.length-1?`1px solid ${color}22`:"none"}}>
              <span style={{color,fontSize:11}}>•</span>
              <span style={{flex:1,fontSize:12,fontWeight:600,color:th.text}}>{ex.name}</span>
              <span style={{fontSize:11,color,fontWeight:700}}>× {ex.reps}</span>
            </div>
          ))}
          <div style={{marginTop:12}}><Field label={t.finalScore} value={wodScore} onChange={setWodScore} placeholder={["amrap","emom","timecap"].includes(plan.wodFormat)?"ex. 18 rounds + 5 reps":"ex. 12:34"}/></div>
        </div>
      )}
      {plan.type!=="wod"&&(
        <div style={{marginBottom:16}}>
          <SecTitle c={t.exercises}/>
          {exercises.map((ex,i)=><ExerciseFields key={i} ex={ex} idx={i} onChange={(idx,field,val)=>updateEx(idx,field,val)}/>)}
        </div>
      )}
      <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:14,marginBottom:16}}>
        <SecTitle c={t.sessionInfos}/>
        <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
          <Field label={t.duration} type="number" value={duration} onChange={setDuration} placeholder={`~${Math.round((Date.now()-startTime)/60000)+1} min`} half/>
          <Field label={t.note} value={sessionNote} onChange={setSessionNote} placeholder={t.sessionNotes} half/>
        </div>
      </div>
      <button onClick={handleSave} style={{width:"100%",background:`linear-gradient(135deg,${color},${color}88)`,border:"none",borderRadius:14,padding:"16px",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:18,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",boxShadow:`0 4px 24px ${color}44`}}>
        {t.finish}
      </button>
    </div>
  </div>);
};

// ── NEXT SESSION WIDGET ───────────────────────────────────────────────────────
const NextSessionWidget=({client,allTemplates,allWods,onStartSession})=>{
  const{th,t,lang}=useApp();
  const[expanded,setExpanded]=useState(null);
  const today=todayStr();
  const weekDates=getWeekDates();
  const DAY_FULL=lang==="fr"?DAY_FULL_FR:DAY_FULL_EN;
  const weekPlanned=client.planned.filter(p=>weekDates.includes(p.date)&&p.date>=today).sort((a,b)=>a.date.localeCompare(b.date));
  if(!weekPlanned.length)return(
    <div style={{background:th.card,border:`1px dashed ${th.border}`,borderRadius:14,padding:14,marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:20}}>📅</span>
        <div>
          <div style={{fontSize:13,fontWeight:700,color:th.muted}}>{t.noSessionWeek}</div>
          <div style={{fontSize:11,color:th.muted}}>{t.noSessionWeekSub}</div>
        </div>
      </div>
    </div>
  );
  return(<div style={{marginBottom:14}}>
    <div style={{fontSize:11,fontWeight:700,color:th.accent,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:3,height:16,borderRadius:99,background:th.accent}}/>{t.thisWeek}
    </div>
    {weekPlanned.map((plan,i)=>{
      const color=plan.color||th.accent;
      const isOpen=expanded===plan.id;
      const[y,m,d]=plan.date.split("-");
      const date=new Date(+y,+m-1,+d);
      const dayName=DAY_FULL[date.getDay()];
      const isToday=plan.date===today;
      return(<div key={plan.id} className="fu" style={{animationDelay:`${i*.06}s`}}>
        <div onClick={()=>setExpanded(isOpen?null:plan.id)}
          style={{background:isToday?color+"18":th.card,border:`1px solid ${isToday?color:color+"55"}`,borderRadius:isOpen?"14px 14px 0 0":14,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12,transition:"all .2s"}}>
          <div style={{width:4,minHeight:40,borderRadius:99,background:color,flexShrink:0}}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:2}}>
              <div style={{fontWeight:900,fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",color}}>{isToday?t.today:dayName.toUpperCase()}</div>
              {isToday&&<div style={{width:6,height:6,borderRadius:"50%",background:"#22c55e",boxShadow:"0 0 6px #22c55e"}}/>}
            </div>
            <div style={{fontSize:12,fontWeight:700,color:th.text}}>{plan.type==="wod"?"🏋️ ":""}{plan.name}</div>
            <div style={{fontSize:10,color:th.muted}}>{plan.date} · {plan.type==="wod"?"WOD":`${(plan.exercises||[]).length} exercices`}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:6}}>
            <Badge label={plan.type==="wod"?"WOD":"Séance"} color={color}/>
            <span style={{fontSize:16,color}}>{isOpen?"▲":"▼"}</span>
          </div>
        </div>
        {isOpen&&(
          <div style={{background:th.surface,border:`1px solid ${color}44`,borderTop:"none",borderRadius:"0 0 14px 14px",padding:14}}>
            {(plan.exercises||[]).slice(0,4).map((ex,j)=>(
              <div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:j<Math.min((plan.exercises||[]).length,4)-1?`1px solid ${th.border}44`:"none"}}>
                <div style={{width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.libId}/></div>
                <span style={{flex:1,fontSize:12,fontWeight:600,color:th.text}}>{ex.name}</span>
                <div style={{display:"flex",gap:4}}>
                  {ex.isWodMovement?<Badge label={`× ${ex.reps}`} color={color}/>:<>
                    {ex.sets&&ex.reps&&<Badge label={`${ex.sets}×${ex.reps}`} color={color}/>}
                    {ex.load&&+ex.load>0&&<Badge label={`${ex.load}kg`} color="#f59e0b"/>}
                  </>}
                </div>
              </div>
            ))}
            {(plan.exercises||[]).length>4&&<div style={{fontSize:11,color:th.muted,marginTop:6,textAlign:"center"}}>+ {(plan.exercises||[]).length-4} exercices...</div>}
            {plan.note&&<div style={{fontSize:11,color:th.muted,marginTop:8,fontStyle:"italic"}}>📝 {plan.note}</div>}
            <div style={{marginTop:12}}>
              <button onClick={()=>onStartSession(plan)} style={{width:"100%",background:`linear-gradient(135deg,${color},${color}88)`,border:"none",borderRadius:10,padding:"12px",color:"#fff",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:900,fontSize:15,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",boxShadow:`0 4px 16px ${color}44`}}>
                {t.startSession}
              </button>
            </div>
          </div>
        )}
      </div>);
    })}
  </div>);
};

const SessionExercisePicker=({onAdd,onClose})=>{
  const{th,t}=useApp();
  const[mode,setMode]=useState("cat");
  const[selCat,setSelCat]=useState("Push");
  const[selMuscle,setSelMuscle]=useState("Pectoraux");
  const[search,setSearch]=useState("");
  const[selected,setSelected]=useState([]);
  const filtered=LIBRARY.filter(ex=>{if(search)return ex.name.toLowerCase().includes(search.toLowerCase())||ex.muscles.toLowerCase().includes(search.toLowerCase());if(mode==="cat")return ex.cat===selCat;if(mode==="muscle")return(MUSCLE_GROUPS[selMuscle]||[]).includes(ex.id);return true;});
  function toggleEx(ex){setSelected(prev=>prev.find(e=>e.id===ex.id)?prev.filter(e=>e.id!==ex.id):[...prev,ex]);}
  function confirm(){onAdd(selected);onClose();}
  return(<div style={{background:th.cardAlt,border:`1px solid ${th.border}`,borderRadius:12,padding:12,marginBottom:10}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <span style={{fontSize:11,fontWeight:700,color:th.accent,textTransform:"uppercase",letterSpacing:"0.08em"}}>{t.addExercises}</span>
      <Btn small ghost onClick={onClose}>✕</Btn>
    </div>
    <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..."
      style={{width:"100%",background:th.inputBg,border:`1.5px solid ${th.border}`,borderRadius:8,padding:"7px 10px",color:th.text,fontSize:12,fontFamily:"'Barlow',sans-serif",outline:"none",marginBottom:8,colorScheme:th===THEMES.light?"light":"dark",boxSizing:"border-box"}}
      onFocus={e=>e.target.style.borderColor=th.accent} onBlur={e=>e.target.style.borderColor=th.border}/>
    {!search&&(<>
      <div style={{display:"flex",gap:5,marginBottom:8}}>
        {["cat","muscle"].map(m=>(
          <button key={m} onClick={()=>setMode(m)} style={{padding:"4px 12px",borderRadius:99,border:`1px solid ${mode===m?(m==="cat"?th.accent:"#22c55e"):th.border}`,background:mode===m?(m==="cat"?th.accent+"22":"#22c55e22"):"transparent",color:mode===m?(m==="cat"?th.accent:"#22c55e"):th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer"}}>{m==="cat"?"Type":"Muscle"}</button>
        ))}
      </div>
      {mode==="cat"&&(
        <div style={{display:"flex",gap:4,marginBottom:8,overflowX:"auto",paddingBottom:4}}>
          {CATS.filter(c=>c!=="Tous").map(cat=>(
            <button key={cat} onClick={()=>setSelCat(cat)} style={{padding:"3px 10px",borderRadius:99,border:`1px solid ${selCat===cat?(CAT_COLOR[cat]||th.accent):th.border}`,background:selCat===cat?(CAT_COLOR[cat]||th.accent)+"22":"transparent",color:selCat===cat?(CAT_COLOR[cat]||th.accent):th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer",flexShrink:0}}>{cat}</button>
          ))}
        </div>
      )}
      {mode==="muscle"&&(
        <div style={{display:"flex",gap:4,marginBottom:8,overflowX:"auto",paddingBottom:4}}>
          {Object.keys(MUSCLE_GROUPS).map(mg=>(
            <button key={mg} onClick={()=>setSelMuscle(mg)} style={{padding:"3px 10px",borderRadius:99,border:`1px solid ${selMuscle===mg?"#22c55e":th.border}`,background:selMuscle===mg?"#22c55e22":"transparent",color:selMuscle===mg?"#22c55e":th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:9,textTransform:"uppercase",cursor:"pointer",flexShrink:0}}>{mg}</button>
          ))}
        </div>
      )}
    </>)}
    <div style={{maxHeight:200,overflowY:"auto",display:"flex",flexDirection:"column",gap:5,marginBottom:10}}>
      {filtered.map(ex=>{
        const isSel=selected.find(e=>e.id===ex.id);
        return(<div key={ex.id} onClick={()=>toggleEx(ex)} style={{display:"flex",alignItems:"center",gap:8,padding:"7px 10px",borderRadius:8,border:`1px solid ${isSel?th.accent+"44":th.border}`,background:isSel?th.accent+"0a":"transparent",cursor:"pointer"}}>
          <div style={{width:32,height:16,borderRadius:4,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.id}/></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:12,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:th.text}}>{ex.name}</div>
            <div style={{fontSize:9,color:th.muted}}>{ex.muscles}</div>
          </div>
          <Badge label={ex.cat} color={CAT_COLOR[ex.cat]||th.accent}/>
          <div style={{width:18,height:18,borderRadius:5,border:`2px solid ${isSel?th.accent:th.border}`,background:isSel?th.accent:"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:10,color:"#fff",fontWeight:900}}>{isSel?"✓":""}</div>
        </div>);
      })}
      {filtered.length===0&&<div style={{textAlign:"center",color:th.muted,padding:16,fontSize:11}}>Aucun exercice trouvé</div>}
    </div>
    {selected.length>0&&<Btn small onClick={confirm}>✅ {t.addExercises} ({selected.length})</Btn>}
  </div>);
};

const TemplatePicker=({onSelect,onClose,allTemplates,allWods})=>{
  const{th,t}=useApp();
  const[pickerTab,setPickerTab]=useState("templates");
  const[selCat,setSelCat]=useState("Tous");
  const cats=[...new Set(allTemplates.map(tp=>tp.cat))];
  const filtered=selCat==="Tous"?allTemplates:allTemplates.filter(tp=>tp.cat===selCat);
  const wodCategories=["Tous",...new Set(allWods.map(w=>w.category))];
  const[wodCat,setWodCat]=useState("Tous");
  const filteredWods=wodCat==="Tous"?allWods:allWods.filter(w=>w.category===wodCat);
  return(<div style={{background:th.cardAlt,border:`1px solid ${th.border}`,borderRadius:14,padding:14,marginBottom:12}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <span style={{fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:th.text,textTransform:"uppercase"}}>{t.chooseTemplate}</span>
      <Btn small ghost onClick={onClose}>✕</Btn>
    </div>
    <div style={{display:"flex",gap:2,background:th.surface,borderRadius:8,padding:3,marginBottom:12}}>
      {[{id:"templates",label:`📋 ${t.templates}`},{id:"wods",label:`🏋️ WODs`}].map(tp=>(
        <button key={tp.id} onClick={()=>setPickerTab(tp.id)} style={{flex:1,padding:"7px 4px",borderRadius:6,border:"none",cursor:"pointer",background:pickerTab===tp.id?th.navyLight:"transparent",color:pickerTab===tp.id?th.text:th.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",borderBottom:pickerTab===tp.id?`2px solid ${th.accent}`:"2px solid transparent"}}>{tp.label}</button>
      ))}
    </div>
    {pickerTab==="templates"&&(<>
      <div style={{display:"flex",gap:5,marginBottom:10,overflowX:"auto",paddingBottom:4}}>
        {["Tous",...cats].map(cat=>(
          <button key={cat} onClick={()=>setSelCat(cat)} style={{padding:"4px 12px",borderRadius:99,border:`1px solid ${selCat===cat?(CAT_COLOR[cat]||th.accent):th.border}`,background:selCat===cat?(CAT_COLOR[cat]||th.accent)+"22":"transparent",color:selCat===cat?(CAT_COLOR[cat]||th.accent):th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer",flexShrink:0}}>{cat}</button>
        ))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:8,maxHeight:260,overflowY:"auto"}}>
        {filtered.map(tpl=>(
          <div key={tpl.id} onClick={()=>onSelect(tpl)} style={{background:th.card,border:`1px solid ${tpl.color||th.border}33`,borderRadius:12,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:4,height:40,borderRadius:99,background:tpl.color||th.accent,flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",color:th.text}}>{tpl.name}</div>
              <div style={{fontSize:11,color:th.muted,marginTop:2}}>{tpl.exercises?.length} exercices</div>
            </div>
            <span style={{fontSize:18,color:tpl.color||th.accent}}>→</span>
          </div>
        ))}
      </div>
    </>)}
    {pickerTab==="wods"&&(<>
      <div style={{display:"flex",gap:5,marginBottom:10,overflowX:"auto",paddingBottom:4}}>
        {wodCategories.map(cat=>(
          <button key={cat} onClick={()=>setWodCat(cat)} style={{padding:"4px 12px",borderRadius:99,border:`1px solid ${wodCat===cat?"#e63946":th.border}`,background:wodCat===cat?"#e6394622":"transparent",color:wodCat===cat?"#e63946":th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer",flexShrink:0}}>{cat}</button>
        ))}
      </div>
      <div style={{maxHeight:300,overflowY:"auto",display:"flex",flexDirection:"column",gap:8}}>
        {filteredWods.map(wod=>(
          <div key={wod.id} onClick={()=>onSelect(wod)} style={{background:th.card,border:`1px solid ${wod.color||"#e63946"}33`,borderRadius:12,padding:"12px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:4,height:40,borderRadius:99,background:wod.color||"#e63946",flexShrink:0}}/>
            <div style={{flex:1}}>
              <div style={{fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",color:wod.color||"#e63946"}}>{wod.name}</div>
              <div style={{fontSize:11,color:th.muted}}>{wod.description} · {wod.category}</div>
            </div>
            <span style={{fontSize:18,color:wod.color||"#e63946"}}>→</span>
          </div>
        ))}
      </div>
    </>)}
  </div>);
};

const WodCreator=({onSave,onClose})=>{
  const{th,t}=useApp();
  const[format,setFormat]=useState("amrap");
  const[name,setName]=useState("");
  const[duration,setDuration]=useState("20");
  const[rounds,setRounds]=useState("3");
  const[timecap,setTimecap]=useState("20");
  const[minutes,setMinutes]=useState("20");
  const[score,setScore]=useState("");
  const[tabataFmt,setTabataFmt]=useState(TABATA_FORMATS[0]);
  const[movements,setMovements]=useState([]);
  const[search,setSearch]=useState("");
  const[showSearch,setShowSearch]=useState(false);
  const[selCat,setSelCat]=useState("Functional");
  const fmt=WOD_FORMATS.find(f=>f.id===format);
  function addMovement(ex){setMovements(p=>[...p,{name:ex.name,reps:"",libId:ex.id}]);setSearch("");setShowSearch(false);}
  function saveWod(){
    if(!movements.length)return;
    onSave({id:"wod_custom_"+Date.now(),name:name||fmt?.name||"WOD Custom",type:"wod",format,color:fmt?.color||"#e63946",description:fmt?.desc||"",category:"Mes WODs",movements,scoreType:["amrap","emom","timecap"].includes(format)?"rounds":"time",duration:+duration,rounds:+rounds,timecap:+timecap,minutes:+minutes,score,
      ...(format==="tabata"?{tabataWork:tabataFmt.work,tabataRest:tabataFmt.rest,tabataRounds:tabataFmt.rounds,tabataLabel:tabataFmt.label}:{})});
  }
  const filtered=LIBRARY.filter(ex=>search?ex.name.toLowerCase().includes(search.toLowerCase()):ex.cat===selCat);
  return(<div style={{background:th.card,border:"1px solid #f9741644",borderRadius:14,padding:14,marginBottom:14}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
      <div style={{fontSize:16,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",color:"#f97316"}}>🏋️ {t.createWod}</div>
      <Btn small ghost onClick={onClose}>✕</Btn>
    </div>
    <Field label={t.wodName} value={name} onChange={setName} placeholder={t.wodNamePh}/>
    <div style={{height:10}}/>
    <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:8}}>{t.format}</label>
    <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
      {WOD_FORMATS.map(f=>(
        <button key={f.id} onClick={()=>setFormat(f.id)} style={{padding:"8px 12px",borderRadius:10,border:`1px solid ${format===f.id?f.color:th.border}`,background:format===f.id?f.color+"22":"transparent",color:format===f.id?f.color:th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer",flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <span style={{fontSize:16}}>{f.icon}</span><span>{f.name}</span>
        </button>
      ))}
    </div>
    {format==="tabata"&&(
      <div style={{marginBottom:14}}>
        <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:8}}>Format Tabata</label>
        <div style={{display:"flex",flexDirection:"column",gap:5}}>
          {TABATA_FORMATS.map(f=>(
            <button key={f.id} onClick={()=>setTabataFmt(f)} style={{padding:"8px 12px",borderRadius:8,border:`1px solid ${tabataFmt.id===f.id?"#22c55e":th.border}`,background:tabataFmt.id===f.id?"#22c55e22":"transparent",color:tabataFmt.id===f.id?"#22c55e":th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between"}}>
              <span>{f.label}</span>
              {tabataFmt.id===f.id&&<span>✓</span>}
            </button>
          ))}
        </div>
      </div>
    )}
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14}}>
      {(format==="amrap"||format==="timecap")&&<Field label="Durée (min)" type="number" value={duration} onChange={setDuration} placeholder="20" half/>}
      {format==="emom"&&<Field label="Durée totale (min)" type="number" value={minutes} onChange={setMinutes} placeholder="20" half/>}
      {(format==="fortime"||format==="metcon")&&<><Field label="Rounds" type="number" value={rounds} onChange={setRounds} placeholder="3" half/><Field label="Timecap (min)" type="number" value={timecap} onChange={setTimecap} placeholder="20" half/></>}
      {format!=="tabata"&&<Field label={t.score} value={score} onChange={setScore} placeholder={t.savePh} half/>}
    </div>
    <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase",display:"block",marginBottom:8}}>{t.movements}</label>
    {movements.map((mv,i)=>(
      <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:th.cardAlt,borderRadius:8,marginBottom:6,border:`1px solid ${th.border}`}}>
        <div style={{width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0}}><AnatomySVG id={mv.libId}/></div>
        <span style={{flex:1,fontSize:12,fontWeight:700,color:th.text}}>{mv.name}</span>
        <input type="text" value={mv.reps} onChange={e=>setMovements(p=>p.map((x,j)=>j===i?{...x,reps:e.target.value}:x))} placeholder="Reps" style={{width:70,background:th.inputBg,border:`1px solid ${th.border}`,borderRadius:6,padding:"4px 8px",color:th.text,fontSize:12,textAlign:"center"}}/>
        <button onClick={()=>setMovements(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",color:"#e63946",cursor:"pointer",fontSize:14,padding:0}}>✕</button>
      </div>
    ))}
    <button onClick={()=>setShowSearch(!showSearch)} style={{width:"100%",background:th.cardAlt,border:"1px solid #f9741644",borderRadius:8,padding:"8px 14px",color:"#f97316",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:showSearch?10:14}}>{t.addMovement}</button>
    {showSearch&&(
      <div style={{background:th.bg,borderRadius:10,padding:10,marginBottom:14,border:`1px solid ${th.border}`}}>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..." style={{width:"100%",background:th.card,border:`1.5px solid ${th.border}`,borderRadius:8,padding:"7px 10px",color:th.text,fontSize:12,fontFamily:"'Barlow',sans-serif",outline:"none",marginBottom:8,boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor="#f97316"} onBlur={e=>e.target.style.borderColor=th.border}/>
        {!search&&(<div style={{display:"flex",gap:4,marginBottom:8,overflowX:"auto",paddingBottom:4}}>
          {CATS.filter(c=>c!=="Tous").map(cat=>(<button key={cat} onClick={()=>setSelCat(cat)} style={{padding:"3px 8px",borderRadius:99,border:`1px solid ${selCat===cat?(CAT_COLOR[cat]||th.accent):th.border}`,background:selCat===cat?(CAT_COLOR[cat]||th.accent)+"22":"transparent",color:selCat===cat?(CAT_COLOR[cat]||th.accent):th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:9,textTransform:"uppercase",cursor:"pointer",flexShrink:0}}>{cat}</button>))}
        </div>)}
        <div style={{maxHeight:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
          {filtered.map(ex=>(<div key={ex.id} onClick={()=>addMovement(ex)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:8,border:`1px solid ${th.border}`,cursor:"pointer"}}><div style={{width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.id}/></div><span style={{flex:1,fontSize:11,fontWeight:600,color:th.text}}>{ex.name}</span><Badge label={ex.cat} color={CAT_COLOR[ex.cat]||th.accent}/></div>))}
        </div>
      </div>
    )}
    {movements.length>0&&<div style={{display:"flex",gap:8}}><Btn onClick={saveWod} color={fmt?.color||"#f97316"}>💾 {t.save}</Btn><Btn ghost small onClick={onClose}>{t.cancel}</Btn></div>}
  </div>);
};

const CalendarTab=({client,allTemplates,allWods,onUpdate,onSaveWod})=>{
  const{th,t,lang}=useApp();
  const today=todayStr();
  const[calYear,setCalYear]=useState(new Date().getFullYear());
  const[calMonth,setCalMonth]=useState(new Date().getMonth());
  const[dayModal,setDayModal]=useState(null);
  const[planMode,setPlanMode]=useState("choose");
  const[selTemplate,setSelTemplate]=useState(null);
  const[selWod,setSelWod]=useState(null);
  const[planNote,setPlanNote]=useState("");
  const[planName,setPlanName]=useState("");
  const[wodTab,setWodTab]=useState("benchmarks");
  const[customExercises,setCustomExercises]=useState([]);
  const[showExPicker,setShowExPicker]=useState(false);
  const MONTH_N=lang==="fr"?MONTH_NAMES:MONTH_NAMES_EN;
  const DAY_N=lang==="fr"?DAY_NAMES_FR:DAY_NAMES_EN;
  const DAY_F=lang==="fr"?DAY_FULL_FR:DAY_FULL_EN;
  const planned=client.planned||[];
  const sessions=client.sessions||[];
  const firstDay=new Date(calYear,calMonth,1);
  const lastDay=new Date(calYear,calMonth+1,0);
  const startDow=(firstDay.getDay()+6)%7;
  const daysInMonth=lastDay.getDate();
  const formatDate=(y,m,d)=>`${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
  const getDayInfo=(dateStr)=>({sess:sessions.find(s=>s.date===dateStr),plan:planned.find(p=>p.date===dateStr)});
  const getDayColor=(dateStr)=>{const{sess,plan}=getDayInfo(dateStr);if(sess){if(!sess.present)return"#e63946";if(sess.isWod)return"#f97316";return"#22c55e";}if(plan)return plan.type==="wod"?"#f9741666":"#2d7fff66";return null;};
  function openDay(dateStr){setDayModal({dateStr,...getDayInfo(dateStr)});setPlanMode("choose");setSelTemplate(null);setSelWod(null);setPlanNote("");setPlanName("");setCustomExercises([]);setShowExPicker(false);}
  function addCustomExercises(exs){setCustomExercises(p=>[...p,...exs.map(ex=>{const libEx=LIBRARY.find(l=>l.id===ex.id);const isCardio=libEx?.cat==="Cardio";return{id:"pe"+Date.now()+Math.random(),libId:ex.id,name:ex.name,cardioType:libEx?.cardioType||"",...(isCardio?{duration:"",speed:"",watts:"",zone:""}:{sets:"3",reps:"10",load:"",rest:"60",rpe:"",note:""})};})]);setShowExPicker(false);}
  function updateCustomEx(idx,field,val){setCustomExercises(p=>p.map((ex,i)=>i===idx?{...ex,[field]:val}:ex));}
  function removeCustomEx(idx){setCustomExercises(p=>p.filter((_,i)=>i!==idx));}
  function savePlan(){
    let newPlan;
    if(planMode==="template"&&selTemplate){const exercises=applyTemplate(selTemplate,sessions);newPlan={id:"pl"+Date.now(),date:dayModal.dateStr,type:"template",templateId:selTemplate.id,name:selTemplate.name,color:selTemplate.color,note:planNote,exercises};}
    else if(planMode==="wod"&&selWod){const exercises=(selWod.movements||[]).map(mv=>({id:"pe"+Date.now()+Math.random(),libId:mv.libId||"",name:mv.name,reps:mv.reps,isWodMovement:true}));newPlan={id:"pl"+Date.now(),date:dayModal.dateStr,type:"wod",templateId:selWod.id,name:selWod.name,color:selWod.color,note:planNote,wodFormat:selWod.format,duration:selWod.duration,minutes:selWod.minutes,rounds:selWod.rounds,timecap:selWod.timecap,exercises};}
    else if(planMode==="custom"&&customExercises.length>0){newPlan={id:"pl"+Date.now(),date:dayModal.dateStr,type:"template",templateId:null,name:planName||t.planCustom,color:th.accent,note:planNote,exercises:customExercises};}
    else return;
    onUpdate({planned:[...planned.filter(p=>p.date!==dayModal.dateStr),newPlan]});
    setDayModal(null);
  }
  function removePlan(id){onUpdate({planned:planned.filter(p=>p.id!==id)});setDayModal(null);}
  const prevMonth=()=>{if(calMonth===0){setCalMonth(11);setCalYear(y=>y-1);}else setCalMonth(m=>m-1);};
  const nextMonth=()=>{if(calMonth===11){setCalMonth(0);setCalYear(y=>y+1);}else setCalMonth(m=>m+1);};
  const cells=[];for(let i=0;i<startDow;i++)cells.push(null);for(let d=1;d<=daysInMonth;d++)cells.push(d);
  return(<div className="fu">
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:14,padding:"10px 12px",background:th.card,borderRadius:12,border:`1px solid ${th.border}`}}>
      {[{color:"#22c55e",label:"Séance ✓"},{color:"#f97316",label:"WOD ✓"},{color:"#e63946",label:"Absence"},{color:"#2d7fff66",label:"Planifiée"},{color:"#f9741666",label:"WOD planifié"}].map(l=>(
        <div key={l.label} style={{display:"flex",alignItems:"center",gap:5}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:l.color,flexShrink:0}}/>
          <span style={{fontSize:10,color:th.mutedLight}}>{l.label}</span>
        </div>
      ))}
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
      <button onClick={prevMonth} style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:8,padding:"8px 14px",color:th.mutedLight,cursor:"pointer",fontSize:16}}>‹</button>
      <div style={{fontWeight:900,fontSize:18,fontFamily:"'Barlow Condensed',sans-serif",color:th.text}}>{MONTH_N[String(calMonth+1).padStart(2,"0")]} {calYear}</div>
      <button onClick={nextMonth} style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:8,padding:"8px 14px",color:th.mutedLight,cursor:"pointer",fontSize:16}}>›</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:4}}>
      {DAY_N.map(d=><div key={d} style={{textAlign:"center",fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.08em",textTransform:"uppercase",padding:"4px 0"}}>{d}</div>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:3,marginBottom:20}}>
      {cells.map((d,i)=>{
        if(!d)return<div key={i}/>;
        const dateStr=formatDate(calYear,calMonth,d);
        const{sess,plan}=getDayInfo(dateStr);
        const dotColor=getDayColor(dateStr);
        const isToday=dateStr===today;
        const isFut=dateStr>today;
        const sTpl=sess?.templateId?[...allTemplates,...allWods].find(tp=>tp.id===sess.templateId):null;
        return(<div key={i} onClick={()=>openDay(dateStr)}
          style={{background:isToday?th.navyLight:dotColor?th.card:th.surface,border:`1px solid ${isToday?th.accent:dotColor?dotColor+"88":th.border}`,borderRadius:10,padding:"6px 4px",cursor:"pointer",minHeight:52,display:"flex",flexDirection:"column",alignItems:"center",gap:2,transition:"all .15s"}}>
          <div style={{fontSize:12,fontWeight:isToday?900:600,color:isToday?th.accent:isFut?th.mutedLight:th.text,fontFamily:"'Barlow Condensed',sans-serif"}}>{d}</div>
          {dotColor&&<div style={{width:7,height:7,borderRadius:"50%",background:dotColor,boxShadow:`0 0 5px ${dotColor}`}}/>}
          {(sess||plan)&&<div style={{fontSize:7,color:dotColor||th.muted,fontWeight:700,textAlign:"center",lineHeight:1.2,maxWidth:"100%",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",padding:"0 2px"}}>{sess?(sess.isWod?"WOD":sTpl?.name?.split(" ").slice(0,2).join(" ")||"💪"):(plan.type==="wod"?"WOD":plan.name?.split(" ").slice(0,2).join(" ")||"📋")}</div>}
        </div>);
      })}
    </div>
    {planned.filter(p=>p.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).length>0&&(<div>
      <SecTitle c={t.plannedSessions}/>
      {planned.filter(p=>p.date>=today).sort((a,b)=>a.date.localeCompare(b.date)).map(plan=>(
        <SwipeToDelete key={plan.id} onDelete={()=>removePlan(plan.id)} label={t.swipeDelete}>
          <div style={{background:th.card,border:`1px solid ${plan.color||th.accent}44`,borderRadius:12,padding:"12px 14px"}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div style={{width:4,height:36,borderRadius:99,background:plan.color||th.accent,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",color:th.text}}>{plan.date}</div>
                <div style={{fontSize:11,color:plan.color||th.accent,fontWeight:700}}>{plan.type==="wod"?"🏋️ ":""}{plan.name}</div>
                {plan.note&&<div style={{fontSize:11,color:th.muted,marginTop:2}}>📝 {plan.note}</div>}
              </div>
              <Badge label={plan.type==="wod"?"WOD":"Séance"} color={plan.color||th.accent}/>
            </div>
          </div>
        </SwipeToDelete>
      ))}
    </div>)}
    {dayModal&&(
      <div style={{position:"fixed",inset:0,background:"#000d",display:"flex",alignItems:"flex-end",zIndex:99}} onClick={()=>setDayModal(null)}>
        <div onClick={e=>e.stopPropagation()} className="fu" style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:"20px 20px 0 0",padding:"20px 18px 40px",width:"100%",maxHeight:"92vh",overflowY:"auto"}}>
          <div style={{width:36,height:4,borderRadius:99,background:th.border,margin:"0 auto 16px"}}/>
          <div style={{fontSize:22,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:16,color:th.text}}>
            {(()=>{const[y,m,d]=dayModal.dateStr.split("-");const date=new Date(+y,+m-1,+d);return`${DAY_F[date.getDay()]} ${+d} ${MONTH_N[m]} ${y}`;})()}
          </div>
          {dayModal.sess&&(
            <div style={{background:dayModal.sess.isWod?"#f9741611":"#22c55e11",border:`1px solid ${dayModal.sess.isWod?"#f9741644":"#22c55e44"}`,borderRadius:12,padding:12,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:dayModal.sess.isWod?"#f97316":"#22c55e",marginBottom:4}}>{dayModal.sess.isWod?t.wodDone:t.sessionDone}</div>
              {dayModal.sess.templateId&&<div style={{fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:th.text}}>{[...allTemplates,...allWods].find(tp=>tp.id===dayModal.sess.templateId)?.name||"Séance libre"}</div>}
              {dayModal.sess.isWod&&dayModal.sess.wodScore&&<div style={{fontSize:11,color:"#f97316",marginTop:4}}>{t.scoreLabel} {dayModal.sess.wodScore}</div>}
              <div style={{marginTop:6}}><Badge label={dayModal.sess.present?t.present_badge:t.absent_badge} color={dayModal.sess.present?"#22c55e":"#e63946"}/></div>
            </div>
          )}
          {dayModal.plan&&!dayModal.sess&&(
            <div style={{background:th.accent+"11",border:`1px solid ${th.accent}44`,borderRadius:12,padding:12,marginBottom:12}}>
              <div style={{fontSize:12,fontWeight:700,color:th.accent,marginBottom:4}}>{t.alreadyPlanned}</div>
              <div style={{fontSize:13,fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",color:th.text}}>{dayModal.plan.name}</div>
              {dayModal.plan.note&&<div style={{fontSize:11,color:th.mutedLight,marginTop:4}}>📝 {dayModal.plan.note}</div>}
              <div style={{display:"flex",gap:8,marginTop:10}}><Btn small danger onClick={()=>removePlan(dayModal.plan.id)}>{t.deleteplan}</Btn></div>
            </div>
          )}
          {!dayModal.sess&&(<>
            {planMode==="choose"&&(
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                <div style={{fontSize:12,color:th.mutedLight,marginBottom:4}}>{t.planWhat}</div>
                {[{mode:"template",icon:"📋",label:t.planTemplate,sub:t.planTemplateSub,color:th.accent},{mode:"wod",icon:"🏋️",label:t.planWod,sub:t.planWodSub,color:"#f97316"},{mode:"custom",icon:"💪",label:t.planCustom,sub:t.planCustomSub,color:"#22c55e"}].map(opt=>(
                  <button key={opt.mode} onClick={()=>setPlanMode(opt.mode)} style={{background:opt.color+"11",border:`1px solid ${opt.color}44`,borderRadius:12,padding:"14px 16px",color:opt.color,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,textTransform:"uppercase",cursor:"pointer",textAlign:"left",display:"flex",alignItems:"center",gap:12}}>
                    <span style={{fontSize:24}}>{opt.icon}</span>
                    <div><div>{opt.label}</div><div style={{fontSize:10,fontWeight:400,color:opt.color+"88",textTransform:"none",marginTop:2}}>{opt.sub}</div></div>
                    <span style={{marginLeft:"auto",fontSize:18}}>→</span>
                  </button>
                ))}
              </div>
            )}
            {planMode==="template"&&(
              <div>
                <button onClick={()=>setPlanMode("choose")} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:11,fontFamily:"'Barlow',sans-serif",padding:0,marginBottom:12}}>{t.back_simple}</button>
                <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:220,overflowY:"auto",marginBottom:12}}>
                  {allTemplates.map(tpl=>(
                    <div key={tpl.id} onClick={()=>setSelTemplate(selTemplate?.id===tpl.id?null:tpl)} style={{background:selTemplate?.id===tpl.id?tpl.color+"22":th.surface,border:`1px solid ${selTemplate?.id===tpl.id?tpl.color:th.border}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                      <div style={{width:4,height:32,borderRadius:99,background:tpl.color,flexShrink:0}}/>
                      <div style={{flex:1}}><div style={{fontWeight:800,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",color:th.text}}>{tpl.name}</div><div style={{fontSize:10,color:th.muted}}>{tpl.exercises?.length} exercices</div></div>
                      {selTemplate?.id===tpl.id&&<span style={{color:tpl.color,fontSize:16}}>✓</span>}
                    </div>
                  ))}
                </div>
                <Field label={t.planNote} value={planNote} onChange={setPlanNote} placeholder="ex. Apporter sa ceinture..."/>
                <div style={{marginTop:12,display:"flex",gap:8}}><Btn onClick={savePlan} color={th.accent}>{t.plan}</Btn><Btn ghost small onClick={()=>setDayModal(null)}>{t.cancel}</Btn></div>
              </div>
            )}
            {planMode==="wod"&&(
              <div>
                <button onClick={()=>setPlanMode("choose")} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:11,fontFamily:"'Barlow',sans-serif",padding:0,marginBottom:12}}>{t.back_simple}</button>
                <div style={{display:"flex",gap:2,background:th.surface,borderRadius:8,padding:3,marginBottom:12}}>
                  {[{id:"benchmarks",label:t.benchmarks},{id:"custom",label:t.myWods},{id:"create",label:t.createWodBtn}].map(tp=>(
                    <button key={tp.id} onClick={()=>setWodTab(tp.id)} style={{flex:1,padding:"6px 4px",borderRadius:6,border:"none",cursor:"pointer",background:wodTab===tp.id?th.navyLight:"transparent",color:wodTab===tp.id?"#f97316":th.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",borderBottom:wodTab===tp.id?"2px solid #f97316":"2px solid transparent"}}>{tp.label}</button>
                  ))}
                </div>
                {(wodTab==="benchmarks"||wodTab==="custom")&&(<>
                  <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:220,overflowY:"auto",marginBottom:12}}>
                    {(wodTab==="benchmarks"?WOD_BENCHMARKS:allWods.filter(w=>w.category==="Mes WODs")).map(wod=>(
                      <div key={wod.id} onClick={()=>setSelWod(selWod?.id===wod.id?null:wod)} style={{background:selWod?.id===wod.id?wod.color+"22":th.surface,border:`1px solid ${selWod?.id===wod.id?wod.color:th.border}`,borderRadius:10,padding:"10px 12px",cursor:"pointer",display:"flex",alignItems:"center",gap:10}}>
                        <div style={{width:4,height:32,borderRadius:99,background:wod.color,flexShrink:0}}/>
                        <div style={{flex:1}}><div style={{fontWeight:800,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",color:wod.color}}>{wod.name}</div><div style={{fontSize:10,color:th.muted}}>{wod.description} · {wod.category}</div></div>
                        {selWod?.id===wod.id&&<span style={{color:wod.color,fontSize:16}}>✓</span>}
                      </div>
                    ))}
                    {wodTab==="custom"&&allWods.filter(w=>w.category==="Mes WODs").length===0&&<div style={{textAlign:"center",color:th.muted,padding:20,fontSize:12}}>{t.noCustomWods}</div>}
                  </div>
                  <Field label={t.planNote} value={planNote} onChange={setPlanNote} placeholder="ex. Gilet 10kg..."/>
                  <div style={{marginTop:12,display:"flex",gap:8}}><Btn onClick={savePlan} color="#f97316">{t.planWodBtn}</Btn><Btn ghost small onClick={()=>setDayModal(null)}>{t.cancel}</Btn></div>
                </>)}
                {wodTab==="create"&&<WodCreator onSave={(wod)=>{onSaveWod(wod);setSelWod(wod);setWodTab("custom");}} onClose={()=>setWodTab("benchmarks")}/>}
              </div>
            )}
            {planMode==="custom"&&(
              <div>
                <button onClick={()=>setPlanMode("choose")} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:11,fontFamily:"'Barlow',sans-serif",padding:0,marginBottom:12}}>{t.back_simple}</button>
                <Field label={t.sessionName} value={planName} onChange={setPlanName} placeholder={t.sessionNamePh}/>
                <div style={{height:10}}/>
                <button onClick={()=>setShowExPicker(!showExPicker)} style={{width:"100%",background:th.cardAlt,border:"1px solid #22c55e44",borderRadius:8,padding:"8px 14px",color:"#22c55e",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:showExPicker?10:12}}>
                  💪 {showExPicker?"Fermer":t.addExercises}
                </button>
                {showExPicker&&<SessionExercisePicker onAdd={addCustomExercises} onClose={()=>setShowExPicker(false)}/>}
                {customExercises.map((ex,i)=><ExerciseFields key={i} ex={ex} idx={i} onChange={(idx,field,val)=>updateCustomEx(idx,field,val)} onRemove={()=>removeCustomEx(i)}/>)}
                <Field label={t.planNote} value={planNote} onChange={setPlanNote} placeholder={t.sessionNotes}/>
                <div style={{marginTop:12,display:"flex",gap:8}}><Btn onClick={savePlan} color="#22c55e">{t.planCustomBtn}</Btn><Btn ghost small onClick={()=>setDayModal(null)}>{t.cancel}</Btn></div>
              </div>
            )}
          </>)}
        </div>
      </div>
    )}
  </div>);
};
const ProgressionCharts=({metrics})=>{
  const{th}=useApp();
  if(!metrics||metrics.length<2)return(<div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:16,marginBottom:14,textAlign:"center",color:th.muted,fontSize:12}}>Ajoute au moins 2 mesures pour voir les graphiques 📈</div>);
  const sorted=[...metrics].reverse();
  const MiniChart=({data,label,color,unit=""})=>{
    const vals=data.filter(v=>v>0);if(vals.length<2)return null;
    const min=Math.min(...vals)-1,max=Math.max(...vals)+1,W=260,H=60;
    const pts=data.map((v,i)=>({x:(i/(data.length-1))*(W-20)+10,y:v>0?H-((v-min)/(max-min))*(H-16)-4:null})).filter(p=>p.y!==null);
    const path=pts.map((p,i)=>`${i===0?"M":"L"} ${p.x} ${p.y}`).join(" ");
    const area=`${path} L ${pts[pts.length-1].x} ${H} L ${pts[0].x} ${H} Z`;
    const delta=vals[vals.length-1]-vals[0];
    const isGood=(label==="Poids"||label==="MG %")?delta<=0:delta>=0;
    return(<div style={{background:th.surface,borderRadius:10,padding:"12px 14px",marginBottom:10,border:`1px solid ${th.border}`}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <span style={{fontSize:11,fontWeight:700,color:th.mutedLight,textTransform:"uppercase",letterSpacing:"0.06em"}}>{label}</span>
        <div style={{display:"flex",gap:10,alignItems:"center"}}>
          <span style={{fontSize:11,color:th.muted}}>{vals[0]}{unit}</span>
          <span style={{fontSize:11,color:isGood?"#22c55e":"#e63946",fontWeight:700}}>{delta>0?"+":""}{delta.toFixed(1)}{unit}</span>
          <span style={{fontSize:14,fontWeight:900,color,fontFamily:"'Barlow Condensed',sans-serif"}}>{vals[vals.length-1]}{unit}</span>
        </div>
      </div>
      <svg width="100%" viewBox={`0 0 ${W} ${H}`}>
        {[0,1,2].map(i=>(<line key={i} x1="10" y1={H-i*(H-16)/2-4} x2={W-10} y2={H-i*(H-16)/2-4} stroke={th.border} strokeWidth="1" strokeDasharray="4,4"/>))}
        <path d={area} fill={color} opacity="0.1"/>
        <path d={path} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map((p,i)=>(<circle key={i} cx={p.x} cy={p.y} r="3.5" fill={color} stroke={th.bg} strokeWidth="1.5"/>))}
      </svg>
    </div>);
  };
  return(<div style={{marginBottom:14}}>
    <SecTitle c="Tableaux de progression"/>
    <MiniChart data={sorted.map(m=>m.weight)} label="Poids" color={th.accent} unit="kg"/>
    <MiniChart data={sorted.map(m=>m.fatPct)} label="MG %" color="#e63946" unit="%"/>
    <MiniChart data={sorted.map(m=>m.waist)} label="Taille" color="#f59e0b" unit="cm"/>
    <MiniChart data={sorted.map(m=>m.chest)} label="Poitrine" color="#8b5cf6" unit="cm"/>
    <MiniChart data={sorted.map(m=>m.hips)} label="Hanches" color="#22c55e" unit="cm"/>
  </div>);
};

const ChargesTab=({sessions})=>{
  const{th,t}=useApp();
  const bestPerEx={};
  sessions.forEach(s=>{(s.exercises||[]).forEach(ex=>{
    const libEx=LIBRARY.find(l=>l.id===ex.libId);
    if(!ex.libId||libEx?.cat==="Cardio"||ex.isWodMovement)return;
    if(!ex.load||+ex.load<=0)return;
    if(!bestPerEx[ex.libId]||+ex.load>bestPerEx[ex.libId].load)bestPerEx[ex.libId]={libId:ex.libId,name:ex.name,load:+ex.load,reps:+ex.reps||0,date:s.date};
  });});
  const loadHistory={};
  sessions.forEach(s=>{(s.exercises||[]).forEach(ex=>{
    if(!ex.libId||!ex.load||+ex.load<=0||ex.isWodMovement)return;
    if(!loadHistory[ex.libId])loadHistory[ex.libId]=[];
    loadHistory[ex.libId].push({date:s.date,load:+ex.load});
  });});
  const entries=Object.values(bestPerEx).sort((a,b)=>b.load-a.load);
  const maxLoad=entries.length?Math.max(...entries.map(e=>e.load)):1;
  if(!entries.length)return(<div style={{textAlign:"center",color:th.muted,padding:60}}><div style={{fontSize:32,marginBottom:12}}>🏋️</div><div style={{fontSize:14,fontWeight:700,color:th.mutedLight,marginBottom:6}}>{t.noCharges}</div><div style={{fontSize:12,color:th.muted}}>{t.noChargesSub}</div></div>);
  return(<div className="fu">
    <SecTitle c={t.recordsTitle}/>
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
      return(<div key={ex.libId} className="ch fu" style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:14,marginBottom:10,animationDelay:`${i*.04}s`}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <div style={{width:48,height:24,borderRadius:8,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.libId}/></div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:800,fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:th.text}}>{ex.name}</div>
            {libEx&&<div style={{fontSize:10,color:th.muted}}>{libEx.muscles}</div>}
          </div>
          <div style={{textAlign:"right",flexShrink:0}}>
            <div style={{fontSize:26,fontWeight:900,color:"#f59e0b",fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1}}>{ex.load}<span style={{fontSize:12}}>kg</span></div>
            <div style={{fontSize:11,color:th.mutedLight}}>× {ex.reps} reps</div>
          </div>
        </div>
        {orm&&<div style={{background:th.cardAlt,borderRadius:10,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${th.accent}33`}}>
          <span style={{fontSize:11,color:th.mutedLight,fontWeight:600}}>{t.oneRm} (Epley)</span>
          <span style={{fontSize:18,fontWeight:900,color:th.accent,fontFamily:"'Barlow Condensed',sans-serif"}}>{orm} kg</span>
        </div>}
        {sparkLoads.length>1&&<svg width="100%" viewBox={`0 0 ${SW} ${SH}`} style={{marginBottom:8}}>
          <path d={sparkPath} fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
          {sparkPts.map((p,idx)=>(<circle key={idx} cx={p.x} cy={p.y} r="2.5" fill="#f59e0b" opacity="0.9"/>))}
        </svg>}
        <Bar value={(ex.load/maxLoad)*100} color="#f59e0b"/>
      </div>);
    })}
  </div>);
};

const MonthlyReport=({sessions,metrics})=>{
  const{th,t,lang}=useApp();
  const now=new Date();
  const currentMonth=`${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const prevMonth=now.getMonth()===0?`${now.getFullYear()-1}-12`:`${now.getFullYear()}-${String(now.getMonth()).padStart(2,"0")}`;
  const thisSessions=sessions.filter(s=>s.date?.startsWith(currentMonth));
  const prevSessions=sessions.filter(s=>s.date?.startsWith(prevMonth));
  const thisPresent=thisSessions.filter(s=>s.present).length;
  const prevPresent=prevSessions.filter(s=>s.present).length;
  const weightDelta=(()=>{const tm=metrics.filter(m=>m.date?.startsWith(currentMonth));const pm=metrics.filter(m=>m.date?.startsWith(prevMonth));const lw=tm[0]?.weight||pm[0]?.weight;const fw=tm[tm.length-1]?.weight||pm[pm.length-1]?.weight;return lw&&fw?+(lw-fw).toFixed(1):null;})();
  const MN=lang==="fr"?MONTH_NAMES:MONTH_NAMES_EN;
  const monthLabel=MN[String(now.getMonth()+1).padStart(2,"0")];
  const wodCount=thisSessions.filter(s=>s.isWod).length;
  return(<div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:14,marginBottom:14}}>
    <SecTitle c={`${t.monthlyReport} ${monthLabel}`}/>
    <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
      {[{l:t.sessions,v:thisPresent,prev:prevPresent,c:th.accent},{l:"WODs",v:wodCount,c:"#f97316",noDelta:true},{l:t.weightDelta,v:weightDelta!==null?`${weightDelta>0?"+":""}${weightDelta}kg`:"—",c:weightDelta!==null?(weightDelta<=0?"#22c55e":"#e63946"):th.muted,noDelta:true}].map(s=>(
        <div key={s.l} style={{flex:1,background:th.surface,borderRadius:10,padding:"10px 12px",border:`1px solid ${th.border}`,minWidth:70}}>
          <div style={{fontSize:9,color:th.muted,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:4}}>{s.l}</div>
          <div style={{fontSize:20,fontWeight:900,color:s.c,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1}}>{s.v}</div>
          {!s.noDelta&&<div style={{fontSize:9,color:th.muted,marginTop:2}}>{t.vsPrev} {s.prev}</div>}
        </div>
      ))}
    </div>
  </div>);
};

const TemplatesView=({templates,customWods,onBack,onSave,onSaveWod})=>{
  const{th,t}=useApp();
  const[tplTab,setTplTab]=useState("templates");
  const[showNew,setShowNew]=useState(false);
  const[newTpl,setNewTpl]=useState({name:"",cat:"Push",color:"#2d7fff",exercises:[]});
  const[pickingEx,setPickingEx]=useState(false);
  const[search,setSearch]=useState("");
  const[selCat,setSelCat]=useState("Push");
  const[showWodCreator,setShowWodCreator]=useState(false);
  const[wodFilter,setWodFilter]=useState("Tous");
  function addExToNewTpl(ex){setNewTpl(p=>({...p,exercises:[...p.exercises,{libId:ex.id,name:ex.name,sets:3,reps:10,rest:60}]}));setPickingEx(false);setSearch("");}
  function saveNewTpl(){if(!newTpl.name.trim()||!newTpl.exercises.length)return;onSave([...templates,{...newTpl,id:"tpl_"+Date.now()}]);setNewTpl({name:"",cat:"Push",color:"#2d7fff",exercises:[]});setShowNew(false);}
  const allWodsList=[...WOD_BENCHMARKS,...customWods];
  const wodCats=["Tous",...new Set(allWodsList.map(w=>w.category))];
  const filteredWods=wodFilter==="Tous"?allWodsList:allWodsList.filter(w=>w.category===wodFilter);
  return(<div style={{minHeight:"100vh",background:th.bg,color:th.text,fontFamily:"'Barlow',sans-serif",paddingBottom:48}}>
    <div style={{padding:"16px"}}>
      <button onClick={onBack} style={{background:"none",border:"none",color:th.mutedLight,cursor:"pointer",fontSize:12,marginBottom:14,fontFamily:"'Barlow',sans-serif",padding:0}}>{t.back_simple}</button>
      <div style={{fontSize:32,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:16,color:th.text}}>{t.templatesWods}</div>
      <div style={{display:"flex",gap:2,background:th.surface,borderRadius:10,padding:3,border:`1px solid ${th.border}`,marginBottom:20}}>
        {[{id:"templates",label:`📋 ${t.templates}`},{id:"wods",label:`🏋️ WODs`}].map(tp=>(
          <button key={tp.id} onClick={()=>setTplTab(tp.id)} style={{flex:1,padding:"10px 4px",borderRadius:8,border:"none",cursor:"pointer",background:tplTab===tp.id?th.navyLight:"transparent",color:tplTab===tp.id?th.text:th.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:13,textTransform:"uppercase",borderBottom:tplTab===tp.id?`2px solid ${th.accent}`:"2px solid transparent"}}>{tp.label}</button>
        ))}
      </div>
      {tplTab==="templates"&&(<>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}><Btn small onClick={()=>setShowNew(!showNew)}>{t.newTemplate}</Btn></div>
        {showNew&&(<div style={{background:th.card,border:`1px solid ${th.accent}44`,borderRadius:14,padding:14,marginBottom:20}}>
          <SecTitle c="Nouveau template"/>
          <Field label={t.templateName} value={newTpl.name} onChange={v=>setNewTpl(p=>({...p,name:v}))} placeholder="ex. Push Day C"/>
          <div style={{height:8}}/>
          <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:10}}>
            {["Push","Pull","Legs","Functional","Abdos","Mobilité"].map(cat=>(<button key={cat} onClick={()=>setNewTpl(p=>({...p,cat,color:CAT_COLOR[cat]||th.accent}))} style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${newTpl.cat===cat?(CAT_COLOR[cat]||th.accent):th.border}`,background:newTpl.cat===cat?(CAT_COLOR[cat]||th.accent)+"22":"transparent",color:newTpl.cat===cat?(CAT_COLOR[cat]||th.accent):th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer"}}>{cat}</button>))}
          </div>
          <button onClick={()=>setPickingEx(!pickingEx)} style={{width:"100%",background:th.cardAlt,border:`1px solid ${th.accent}44`,borderRadius:8,padding:"8px 14px",color:th.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:10}}>💪 {pickingEx?"Fermer":t.addExercises}</button>
          {pickingEx&&(<div style={{background:th.bg,borderRadius:10,padding:10,marginBottom:10,border:`1px solid ${th.border}`}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="🔍 Rechercher..." style={{width:"100%",background:th.card,border:`1.5px solid ${th.border}`,borderRadius:8,padding:"7px 10px",color:th.text,fontSize:12,fontFamily:"'Barlow',sans-serif",outline:"none",marginBottom:8,boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=th.accent} onBlur={e=>e.target.style.borderColor=th.border}/>
            <div style={{display:"flex",gap:4,marginBottom:8,overflowX:"auto",paddingBottom:4}}>
              {CATS.filter(c=>c!=="Tous").map(cat=>(<button key={cat} onClick={()=>setSelCat(cat)} style={{padding:"3px 8px",borderRadius:99,border:`1px solid ${selCat===cat?(CAT_COLOR[cat]||th.accent):th.border}`,background:selCat===cat?(CAT_COLOR[cat]||th.accent)+"22":"transparent",color:selCat===cat?(CAT_COLOR[cat]||th.accent):th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:9,textTransform:"uppercase",cursor:"pointer",flexShrink:0}}>{cat}</button>))}
            </div>
            <div style={{maxHeight:180,overflowY:"auto",display:"flex",flexDirection:"column",gap:4}}>
              {LIBRARY.filter(ex=>{const mc=!search?ex.cat===selCat:true;const ms=search?ex.name.toLowerCase().includes(search.toLowerCase()):true;return mc&&ms;}).map(ex=>(<div key={ex.id} onClick={()=>addExToNewTpl(ex)} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 8px",borderRadius:8,border:`1px solid ${th.border}`,cursor:"pointer"}}><div style={{width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.id}/></div><span style={{flex:1,fontSize:11,fontWeight:600,color:th.text}}>{ex.name}</span><Badge label={ex.cat} color={CAT_COLOR[ex.cat]||th.accent}/></div>))}
            </div>
          </div>)}
          {newTpl.exercises.map((ex,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:th.cardAlt,borderRadius:8,marginBottom:6,border:`1px solid ${th.border}`}}><div style={{width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.libId}/></div><span style={{flex:1,fontSize:12,fontWeight:600,color:th.text}}>{ex.name}</span><input type="number" value={ex.sets||""} onChange={e=>setNewTpl(p=>({...p,exercises:p.exercises.map((x,j)=>j===i?{...x,sets:e.target.value}:x)}))} placeholder="S" style={{width:36,background:th.inputBg,border:`1px solid ${th.border}`,borderRadius:6,padding:"4px",color:th.text,fontSize:11,textAlign:"center"}}/><input type="text" value={ex.reps||""} onChange={e=>setNewTpl(p=>({...p,exercises:p.exercises.map((x,j)=>j===i?{...x,reps:e.target.value}:x)}))} placeholder="R" style={{width:36,background:th.inputBg,border:`1px solid ${th.border}`,borderRadius:6,padding:"4px",color:th.text,fontSize:11,textAlign:"center"}}/><button onClick={()=>setNewTpl(p=>({...p,exercises:p.exercises.filter((_,j)=>j!==i)}))} style={{background:"none",border:"none",color:"#e63946",cursor:"pointer",fontSize:14,padding:0}}>✕</button></div>))}
          {newTpl.exercises.length>0&&<div style={{display:"flex",gap:8,marginTop:12}}><Btn small onClick={saveNewTpl}>💾 {t.save}</Btn><Btn small ghost onClick={()=>{setShowNew(false);setNewTpl({name:"",cat:"Push",color:"#2d7fff",exercises:[]});}}>{t.cancel}</Btn></div>}
        </div>)}
        <div style={{fontSize:11,fontWeight:700,color:th.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:1,background:th.border}}/>{t.baseTemplates}<div style={{flex:1,height:1,background:th.border}}/></div>
        {DEFAULT_TEMPLATES.map((tpl,i)=>(<div key={tpl.id} className="ch fu" style={{background:th.card,border:`1px solid ${tpl.color}44`,borderRadius:14,padding:14,marginBottom:10,animationDelay:`${i*.04}s`}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}><div style={{width:4,height:44,borderRadius:99,background:tpl.color,flexShrink:0}}/><div style={{flex:1}}><div style={{fontWeight:900,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",color:th.text}}>{tpl.name}</div><div style={{fontSize:11,color:th.muted}}>{tpl.exercises.length} exercices · <Badge label={tpl.cat} color={tpl.color}/></div></div></div>
          {tpl.exercises.map((ex,j)=>(<div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:j<tpl.exercises.length-1?`1px solid ${th.border}44`:"none"}}><div style={{width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.libId}/></div><span style={{flex:1,fontSize:12,color:th.text}}>{ex.name}</span><Badge label={`${ex.sets}×${ex.reps}`} color={tpl.color}/></div>))}
        </div>))}
        {templates.length>0&&(<><div style={{fontSize:11,fontWeight:700,color:th.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,marginTop:20,display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:1,background:th.border}}/>{t.myTemplates}<div style={{flex:1,height:1,background:th.border}}/></div>
          {templates.map(tpl=>(<SwipeToDelete key={tpl.id} onDelete={()=>onSave(templates.filter(tp=>tp.id!==tpl.id))} label={t.swipeDelete}><div className="ch fu" style={{background:th.card,border:`1px solid ${tpl.color||th.accent}44`,borderRadius:14,padding:14}}><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:8}}><div style={{width:4,height:44,borderRadius:99,background:tpl.color||th.accent,flexShrink:0}}/><div style={{flex:1}}><div style={{fontWeight:900,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",color:th.text}}>{tpl.name}</div></div></div>{tpl.exercises.map((ex,j)=>(<div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:j<tpl.exercises.length-1?`1px solid ${th.border}44`:"none"}}><div style={{width:28,height:14,borderRadius:4,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.libId}/></div><span style={{flex:1,fontSize:12,color:th.text}}>{ex.name}</span><Badge label={`${ex.sets}×${ex.reps}`} color={tpl.color||th.accent}/></div>))}</div></SwipeToDelete>))}
        </>)}
      </>)}
      {tplTab==="wods"&&(<>
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:14}}><Btn small color="#f97316" onClick={()=>setShowWodCreator(!showWodCreator)}>{t.createWod}</Btn></div>
        {showWodCreator&&<WodCreator onSave={(wod)=>{onSaveWod([...customWods,wod]);setShowWodCreator(false);}} onClose={()=>setShowWodCreator(false)}/>}
        <div style={{display:"flex",gap:5,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
          {wodCats.map(cat=>(<button key={cat} onClick={()=>setWodFilter(cat)} style={{padding:"5px 12px",borderRadius:99,border:`1px solid ${wodFilter===cat?"#e63946":th.border}`,background:wodFilter===cat?"#e6394622":"transparent",color:wodFilter===cat?"#e63946":th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer",flexShrink:0}}>{cat}</button>))}
        </div>
        {filteredWods.map(wod=>(<div key={wod.id} className="ch fu" style={{background:th.card,border:`1px solid ${wod.color||"#e63946"}44`,borderRadius:14,padding:14,marginBottom:10}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:8}}><div style={{width:4,minHeight:40,borderRadius:99,background:wod.color||"#e63946",flexShrink:0}}/><div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4,flexWrap:"wrap"}}>
              <div style={{fontSize:18,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",color:wod.color||"#e63946"}}>{wod.name}</div>
              <Badge label={wod.category} color={wod.color||"#e63946"}/>
              <Badge label={wod.format?.toUpperCase()||""} color={wod.color||"#e63946"}/>
            </div>
            <div style={{fontSize:11,color:th.muted,marginBottom:8}}>{wod.description}</div>
            {wod.tip&&<div style={{fontSize:11,color:th.muted,marginBottom:8,fontStyle:"italic"}}>💡 {wod.tip}</div>}
            {wod.movements.slice(0,4).map((mv,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"3px 0"}}><div style={{width:24,height:12,borderRadius:3,overflow:"hidden",flexShrink:0}}><AnatomySVG id={mv.libId}/></div><span style={{fontSize:12,color:th.text,flex:1}}>{mv.name}</span>{mv.reps&&<span style={{fontSize:11,color:wod.color||"#e63946",fontWeight:700}}>× {mv.reps}</span>}</div>))}
            {wod.movements.length>4&&<div style={{fontSize:10,color:th.muted,marginTop:4}}>+ {wod.movements.length-4} mouvements...</div>}
          </div></div>
        </div>))}
        {customWods.length>0&&(<><div style={{fontSize:11,fontWeight:700,color:th.muted,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:10,marginTop:10,display:"flex",alignItems:"center",gap:8}}><div style={{flex:1,height:1,background:th.border}}/>Mes WODs<div style={{flex:1,height:1,background:th.border}}/></div>
          {customWods.map(wod=>(<SwipeToDelete key={wod.id} onDelete={()=>onSaveWod(customWods.filter(w=>w.id!==wod.id))} label={t.swipeDelete}><div className="ch fu" style={{background:th.card,border:`1px solid ${wod.color||"#e63946"}44`,borderRadius:14,padding:14}}><div style={{fontWeight:800,fontSize:15,fontFamily:"'Barlow Condensed',sans-serif",color:wod.color||"#e63946"}}>{wod.name}</div><div style={{fontSize:11,color:th.muted}}>{wod.description}</div></div></SwipeToDelete>))}
        </>)}
      </>)}
    </div>
  </div>);
};

const PPLGenerator=({onAdd})=>{
  const{th,t}=useApp();
  const[type,setType]=useState("Push");
  const[generated,setGenerated]=useState([]);
  const TYPES={Push:["bench_press","overhead_press","incline_press","dips","lateral_raise","tricep_pushdown","pushup"],Pull:["pullup","barbell_row","deadlift","lat_pulldown","face_pull","bicep_curl","hammer_curl"],Legs:["squat","back_squat","front_squat","rdl","lunge","bulgarian_split","leg_press","hip_thrust","crab_walk","kickback"],Abdos:["ab_crunch","ab_wheel","leg_raise","russian_twist","hollow_body","sit_up","pallof_press"],Cardio:["run","bike","rowing_machine","assault_bike","skierg","jump_rope"],Functional:["kb_russian_swing","kb_american_swing","kb_snatch","gorilla_row","farmer_walk","wall_ball","thruster","box_jump"],Mobilité:["hip90","pigeon","catcow","worldsgreatest","thoracic_rot","hip_flexor","ankle_mob","foam_roll"]};
  function generate(){const pool=TYPES[type]||[];const shuffled=[...pool].sort(()=>Math.random()-.5);const count=type==="Cardio"?4:type==="Mobilité"?5:6;setGenerated(shuffled.slice(0,count).map(id=>{const ex=LIBRARY.find(l=>l.id===id);if(!ex)return null;if(ex.cat==="Cardio")return{...ex,duration:"20",zone:"2",cardioType:ex.cardioType||"duration"};return{...ex,sets:"4",reps:type==="Mobilité"?"60s":"8-12",load:"",rest:"60",rpe:""};}).filter(Boolean));}
  return(<div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:14,marginBottom:14}}>
    <SecTitle c={t.generatorTitle}/>
    <div style={{display:"flex",gap:5,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
      {Object.keys(TYPES).map(tp=>(<button key={tp} onClick={()=>{setType(tp);setGenerated([]);}} style={{padding:"5px 12px",borderRadius:99,border:`1px solid ${type===tp?(CAT_COLOR[tp]||th.accent):th.border}`,background:type===tp?(CAT_COLOR[tp]||th.accent)+"22":"transparent",color:type===tp?(CAT_COLOR[tp]||th.accent):th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer",flexShrink:0}}>{tp}</button>))}
    </div>
    <Btn small onClick={generate}>{t.generate} {type}</Btn>
    {generated.length>0&&(<div style={{marginTop:12}}>
      {generated.map((ex,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderBottom:i<generated.length-1?`1px solid ${th.border}`:"none"}}><div style={{width:36,height:18,borderRadius:6,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.id}/></div><div style={{flex:1}}><div style={{fontWeight:700,fontSize:13,color:th.text}}>{ex.name}</div><div style={{fontSize:10,color:th.muted}}>{ex.muscles}</div></div><Badge label={ex.cat} color={CAT_COLOR[ex.cat]||th.accent}/></div>))}
      <div style={{marginTop:12,display:"flex",gap:8}}><Btn small onClick={()=>onAdd(generated)}>{t.addToProgram}</Btn><Btn small ghost onClick={generate}>{t.regenerate}</Btn></div>
    </div>)}
  </div>);
};
export default function App() {
  const [theme, setTheme] = useState(() => { try { return localStorage.getItem("coach_theme")||"dark"; } catch { return "dark"; } });
  const [lang, setLang] = useState(() => { try { return localStorage.getItem("coach_lang")||"fr"; } catch { return "fr"; } });
  const [menuOpen, setMenuOpen] = useState(false);
  const [coachProfile, setCoachProfile] = useState(() => { try { return JSON.parse(localStorage.getItem("coach_profile"))||{name:"Logan Lagarde",specialty:"Coach individuel",photo:null}; } catch { return {name:"Logan Lagarde",specialty:"Coach individuel",photo:null}; } });
  const [view, setView] = useState("dash");

  const th = THEMES[theme]||THEMES.dark;
  const t = TRANSLATIONS[lang]||TRANSLATIONS.fr;

  useEffect(()=>{ try { localStorage.setItem("coach_theme",theme); } catch {} },[theme]);
  useEffect(()=>{ try { localStorage.setItem("coach_lang",lang); } catch {} },[lang]);
  useEffect(()=>{ try { localStorage.setItem("coach_profile",JSON.stringify(coachProfile)); } catch {} },[coachProfile]);

  const [clients, setClients] = useState(SAMPLE_CLIENTS);
  const [customTemplates, setCustomTemplates] = useState([]);
  const [customWods, setCustomWods] = useState([]);
  const [fbStatus, setFbStatus] = useState("connecting");
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
  const [newC, setNewC] = useState({name:"",age:"",sport:"",objective:"",notes:""});
  const [editC, setEditC] = useState(null);
  const [newS, setNewS] = useState({date:"",present:true,duration:"",note:""});
  const [newM, setNewM] = useState({date:"",weight:"",chest:"",waist:"",hips:"",fatPct:""});
  const [newG, setNewG] = useState({label:"",deadline:""});
  const [newP, setNewP] = useState({name:"",weeks:"8",startDate:""});
  const [newEx, setNewEx] = useState({name:"",sets:"",reps:"",load:"",note:"",libId:""});
  const [addingExTo, setAddingExTo] = useState(null);
  const [pickingEx, setPickingEx] = useState(false);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generatorPid, setGeneratorPid] = useState(null);
  const [pendingSession, setPendingSession] = useState({exercises:[]});
  const [pendingWod, setPendingWod] = useState(null);
  const [sessionMode, setSessionMode] = useState("normal");
  const [liveSession, setLiveSession] = useState(null);

  const cl = clients.find(c=>c.id===selId);
  const allTemplates = [...DEFAULT_TEMPLATES,...customTemplates];
  const allWods = [...WOD_BENCHMARKS,...customWods];
  const appCtx = { th, t, theme, setTheme, lang, setLang };

  useEffect(()=>{
    const unsub=onSnapshot(doc(db,"coach","data"),snap=>{
      if(snap.exists()){const data=snap.data();setClients(data.clients||[]);setCustomTemplates(data.customTemplates||[]);setCustomWods(data.customWods||[]);}
      else{saveToFirebase(SAMPLE_CLIENTS,[],[]);}
      setFbStatus("live");
    },()=>setFbStatus("local"));
    return unsub;
  },[]);

  const saveToFirebase=useCallback(async(c,tp,w)=>{
    try{await setDoc(doc(db,"coach","data"),{clients:c,customTemplates:tp,customWods:w,updatedAt:Date.now()});}catch(e){console.error(e);}
  },[]);

  const sync=useCallback((uc,ut,uw)=>{
    const c=uc||clients;const tp=ut||customTemplates;const w=uw||customWods;
    setClients(c);setCustomTemplates(tp);setCustomWods(w);saveToFirebase(c,tp,w);
  },[clients,customTemplates,customWods,saveToFirebase]);

  const up=(id,patch)=>sync(clients.map(c=>c.id===id?{...c,...patch}:c),null,null);
  const saveTemplates=(tpls)=>sync(null,tpls,null);
  const saveWods=(wods)=>sync(null,null,wods);
  const saveOneWod=(wod)=>sync(null,null,[...customWods,wod]);

  const openClient=(id)=>{
    setSelId(id);setView("client");setTab("sessions");
    setShowNewSession(false);setEditingClient(false);setEditingSession(null);
    setNewS({date:"",present:true,duration:"",note:""});
    setPendingSession({exercises:[]});setPendingWod(null);
    setShowExPicker(false);setShowTemplatePicker(false);
    setShowWodCreator(false);setSessionMode("normal");setLiveSession(null);
  };

  function doAddClient(){if(!newC.name.trim())return;sync([...clients,{id:"c"+Date.now(),...newC,age:+newC.age,since:new Date().toISOString().slice(0,7),status:"actif",progress:0,sessions:[],metrics:[],programs:[],goals:[],planned:[]}],null,null);setNewC({name:"",age:"",sport:"",objective:"",notes:""});setAddOpen(false);}
  function doSaveEditClient(){if(!editC||!cl)return;up(selId,{...editC,age:+editC.age});setEditingClient(false);setEditC(null);}
  function doDeleteClient(id){sync(clients.filter(c=>c.id!==id),null,null);setView("dash");setConfirmDelete(null);}
  function doArchiveClient(id){up(id,{status:"inactif"});setView("dash");}

  function doAddSession(){
    if(!newS.date||!cl)return;
    let sess;
    if(sessionMode==="wod"&&pendingWod){
      sess={id:"s"+Date.now(),...newS,present:newS.present===true,duration:+newS.duration,isWod:true,templateId:pendingWod.id,wodFormat:pendingWod.format,wodDuration:pendingWod.duration,wodScore:pendingWod.score||"",wodName:pendingWod.name,wodColor:pendingWod.color,exercises:(pendingWod.movements||[]).map(mv=>({id:"se"+Date.now()+Math.random(),libId:mv.libId||"",name:mv.name,reps:mv.reps,sets:"1",load:"",rest:"",rpe:"",isWodMovement:true}))};
    } else {
      sess={id:"s"+Date.now(),...newS,present:newS.present===true,duration:+newS.duration,exercises:pendingSession.exercises||[],templateId:pendingSession.templateId||null};
    }
    const updatedPlanned=(cl.planned||[]).filter(p=>p.date!==newS.date);
    up(selId,{sessions:[sess,...cl.sessions],planned:updatedPlanned});
    setNewS({date:"",present:true,duration:"",note:""});
    setPendingSession({exercises:[]});setPendingWod(null);
    setShowExPicker(false);setShowNewSession(false);
    setShowTemplatePicker(false);setShowWodCreator(false);setSessionMode("normal");
  }

  function doSaveEditSession(){if(!editingSession||!cl)return;up(selId,{sessions:cl.sessions.map(s=>s.id===editingSession.id?editingSession:s)});setEditingSession(null);}

  function saveLiveSession(sess){
    if(!cl)return;
    const updatedPlanned=(cl.planned||[]).filter(p=>p.date!==sess.date);
    up(selId,{sessions:[sess,...cl.sessions],planned:updatedPlanned});
    setLiveSession(null);
  }

  function applyTemplateToSession(tpl){
    if(tpl.type==="wod"){setPendingWod({...tpl,score:""});setSessionMode("wod");setShowTemplatePicker(false);}
    else{const exercises=applyTemplate(tpl,cl.sessions);setPendingSession({exercises,templateId:tpl.id});setSessionMode("normal");setShowTemplatePicker(false);}
  }

  function addExercisesToSession(exs){
    setPendingSession(p=>({...p,exercises:[...p.exercises,...exs.map(ex=>{
      const libEx=LIBRARY.find(l=>l.id===ex.id);const isCardio=libEx?.cat==="Cardio";
      return{id:"se"+Date.now()+Math.random(),libId:ex.id,name:ex.name,cardioType:libEx?.cardioType||"",...(isCardio?{duration:"",speed:"",watts:"",zone:""}:{sets:"3",reps:"10",load:"",rest:"60",rpe:"",note:""})};
    })]}));
  }

  function updatePendingEx(idx,field,val){setPendingSession(p=>({...p,exercises:p.exercises.map((ex,i)=>i===idx?{...ex,[field]:val}:ex)}));}
  function updateEditSessionEx(idx,field,val){setEditingSession(p=>({...p,exercises:p.exercises.map((ex,i)=>i===idx?{...ex,[field]:val}:ex)}));}
  function removeSessionEx(idx){setPendingSession(p=>({...p,exercises:p.exercises.filter((_,i)=>i!==idx)}));}
  function removeEditSessionEx(idx){setEditingSession(p=>({...p,exercises:p.exercises.filter((_,i)=>i!==idx)}));}
  function doAddMetric(){if(!newM.date||!newM.weight||!cl)return;up(selId,{metrics:[{...newM,weight:+newM.weight,chest:+newM.chest,waist:+newM.waist,hips:+newM.hips,fatPct:+newM.fatPct},...cl.metrics]});setNewM({date:"",weight:"",chest:"",waist:"",hips:"",fatPct:""});}
  function doAddGoal(){if(!newG.label.trim()||!cl)return;up(selId,{goals:[...cl.goals,{id:"g"+Date.now(),...newG,done:false}]});setNewG({label:"",deadline:""});}
  function doAddProgram(){if(!newP.name.trim()||!cl)return;up(selId,{programs:[...cl.programs,{id:"p"+Date.now(),...newP,weeks:+newP.weeks,exercises:[]}]});setNewP({name:"",weeks:"8",startDate:""});}
  function doAddExercise(pid){if(!newEx.name.trim()||!cl)return;up(selId,{programs:cl.programs.map(p=>p.id===pid?{...p,exercises:[...p.exercises,{id:"e"+Date.now(),...newEx}]}:p)});setNewEx({name:"",sets:"",reps:"",load:"",note:"",libId:""});setAddingExTo(null);setPickingEx(false);}
  function doAddGeneratedExercises(pid,exercises){if(!cl)return;const newExs=exercises.map(ex=>({id:"e"+Date.now()+Math.random(),name:ex.name,sets:ex.sets||"",reps:ex.reps||"",load:"",rest:"60",rpe:"",note:"",libId:ex.id,cardioType:ex.cardioType||""}));up(selId,{programs:cl.programs.map(p=>p.id===pid?{...p,exercises:[...p.exercises,...newExs]}:p)});setShowGenerator(false);setGeneratorPid(null);}

  const wrap=(children)=>(
    <AppContext.Provider value={appCtx}>
      <div style={{minHeight:"100vh",background:th.bg,color:th.text,fontFamily:"'Barlow',sans-serif",paddingBottom:48}}>
        <style>{makeGlobalCSS(th)}</style>
        <SideMenu open={menuOpen} onClose={()=>setMenuOpen(false)} coachProfile={coachProfile} onUpdateProfile={setCoachProfile} clients={clients} customTemplates={customTemplates} onNav={(v)=>setView(v)}/>
        <StatusDot status={fbStatus}/>
        {children}
      </div>
    </AppContext.Provider>
  );

  if(liveSession&&cl){
    return(<AppContext.Provider value={appCtx}>
      <div style={{minHeight:"100vh",background:th.bg,color:th.text,fontFamily:"'Barlow',sans-serif"}}>
        <style>{makeGlobalCSS(th)}</style>
        <SessionLiveMode plan={liveSession} allTemplates={allTemplates} allWods={allWods} onSave={saveLiveSession} onClose={()=>setLiveSession(null)}/>
      </div>
    </AppContext.Provider>);
  }

  if(view==="lexicon") return wrap(<LexiconView onBack={()=>setView("dash")}/>);
  if(view==="disciplines") return wrap(<DisciplinesView onBack={()=>setView("dash")}/>);
  if(view==="templates") return wrap(<TemplatesView templates={customTemplates} customWods={customWods} onBack={()=>setView("dash")} onSave={saveTemplates} onSaveWod={saveWods}/>);

  if(view==="library"){
    const filtered=LIBRARY.filter(e=>{
      const matchCat=libCat==="Tous"||e.cat===libCat;
      const matchSearch=libSearch===""||e.name.toLowerCase().includes(libSearch.toLowerCase())||e.muscles.toLowerCase().includes(libSearch.toLowerCase());
      return matchCat&&matchSearch;
    });
    return wrap(<div style={{padding:"16px"}}>
      <button onClick={()=>setView("dash")} style={{background:"none",border:"none",color:th.mutedLight,cursor:"pointer",fontSize:12,marginBottom:14,fontFamily:"'Barlow',sans-serif",padding:0}}>{t.back_simple}</button>
      <div style={{fontSize:32,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:14,color:th.text}}>{t.libraryTitle}</div>
      <input value={libSearch} onChange={e=>setLibSearch(e.target.value)} placeholder={t.searchLib}
        style={{width:"100%",background:th.card,border:`1.5px solid ${th.border}`,borderRadius:10,padding:"10px 14px",color:th.text,fontSize:14,fontFamily:"'Barlow',sans-serif",outline:"none",marginBottom:12,boxSizing:"border-box"}}
        onFocus={e=>e.target.style.borderColor=th.accent} onBlur={e=>e.target.style.borderColor=th.border}/>
      <div style={{display:"flex",gap:6,marginBottom:14,overflowX:"auto",paddingBottom:4}}>
        {CATS.map(cat=>(<button key={cat} onClick={()=>setLibCat(cat)} style={{padding:"6px 14px",borderRadius:99,border:`1px solid ${libCat===cat?(CAT_COLOR[cat]||th.accent):th.border}`,background:libCat===cat?(CAT_COLOR[cat]||th.accent)+"22":"transparent",color:libCat===cat?(CAT_COLOR[cat]||th.accent):th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",flexShrink:0}}>{cat}</button>))}
      </div>
      <div style={{fontSize:11,color:th.muted,marginBottom:12}}>{filtered.length} exercice{filtered.length>1?"s":""}</div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        {filtered.map(ex=>(<div key={ex.id} className="ch fu" onClick={()=>setLibSel(libSel===ex.id?null:ex.id)}
          style={{background:th.card,border:`1px solid ${libSel===ex.id?(CAT_COLOR[ex.cat]||th.accent)+"66":th.border}`,borderRadius:16,overflow:"hidden",cursor:"pointer"}}>
          <AnatomySVG id={ex.id}/>
          <div style={{padding:"10px 12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4,gap:4}}>
              <div style={{fontWeight:800,fontSize:13,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1.2,color:th.text}}>{ex.name}</div>
              <Badge label={ex.cat} color={CAT_COLOR[ex.cat]||th.accent}/>
            </div>
            <div style={{fontSize:10,color:th.mutedLight,marginBottom:4}}>{ex.muscles}</div>
            {libSel===ex.id&&<div style={{marginTop:8,padding:"8px 10px",background:th.surface,borderRadius:8,border:`1px solid ${th.border}`}}><div style={{fontSize:11,color:th.text}}>💡 {ex.tip}</div></div>}
          </div>
        </div>))}
      </div>
    </div>);
  }

  if(view==="dash"){
    const total=clients.reduce((a,c)=>a+c.sessions.filter(s=>s.present).length,0);
    const actif=clients.filter(c=>c.status==="actif").length;
    const activeClients=clients.filter(c=>c.status!=="inactif");
    const att=activeClients.length?Math.round(activeClients.reduce((a,c)=>{if(!c.sessions.length)return a;return a+c.sessions.filter(s=>s.present).length/c.sessions.length;},0)/activeClients.length*100):0;
    return wrap(<>
      <div style={{background:th.gradientDash,padding:"20px 16px 0",borderBottom:`1px solid ${th.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <button onClick={()=>setMenuOpen(true)} style={{background:th.navyLight,border:`1px solid ${th.border}`,borderRadius:10,padding:"8px 12px",color:th.text,cursor:"pointer",fontSize:18,flexShrink:0,boxShadow:`0 2px 8px ${th.accent}22`}}>☰</button>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:th.accent,boxShadow:`0 0 10px ${th.accent}`}}/>
              <span style={{fontSize:10,color:th.accent,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase"}}>{coachProfile.name||"Logan Lagarde"} · Coaching</span>
            </div>
          </div>
          <CoachAvatar photo={coachProfile.photo} name={coachProfile.name} size={36}/>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:16}}>
          <div style={{fontSize:34,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:-0.5,lineHeight:1,color:th.text}}>{t.myClients}</div>
          <div style={{display:"flex",gap:6}}>
            <Btn ghost small onClick={()=>setView("templates")}>📋</Btn>
            <Btn ghost small onClick={()=>setView("library")}>📚</Btn>
            <Btn small onClick={()=>setAddOpen(true)}>{t.addClient}</Btn>
          </div>
        </div>
        <div style={{display:"flex",gap:8,marginBottom:16}}>
          {[{l:t.active,v:actif,c:th.accent,i:"⚡"},{l:t.sessions,v:total,c:th.text,i:"💪"},{l:t.attendance,v:att+"%",c:"#22c55e",i:"🎯"}].map(s=>(
            <div key={s.l} style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:12,padding:"12px 14px",flex:1,boxShadow:`0 2px 12px ${th.accent}11`}}>
              <div style={{fontSize:9,color:th.muted,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:6}}>{s.i} {s.l}</div>
              <div style={{fontSize:22,fontWeight:900,color:s.c,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1}}>{s.v}</div>
            </div>
          ))}
        </div>
        <div style={{height:1,background:`linear-gradient(90deg,${th.accent}66,${th.accent}11)`,marginBottom:0}}/>
      </div>
      <div style={{padding:"14px 16px"}}>
        {clients.map((c,i)=>{
          const a2=c.sessions.length?Math.round(c.sessions.filter(s=>s.present).length/c.sessions.length*100):0;
          const lw=c.metrics[0];
          const today2=todayStr();
          const nextPlanned=(c.planned||[]).filter(p=>p.date>=today2).sort((a,b)=>a.date.localeCompare(b.date))[0];
          return(<div key={c.id} className="ch fu" onClick={()=>openClient(c.id)}
            style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:15,marginBottom:10,cursor:"pointer",animationDelay:`${i*.05}s`,opacity:c.status==="inactif"?0.5:1,boxShadow:`0 2px 16px ${th.accent}0a`}}>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
              <Avatar name={c.name}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:900,fontSize:16,fontFamily:"'Barlow Condensed',sans-serif",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",color:th.text}}>{c.name.toUpperCase()}</div>
                <div style={{color:th.mutedLight,fontSize:12,marginTop:1}}>{c.sport} · {c.objective}</div>
                {nextPlanned&&<div style={{fontSize:10,color:nextPlanned.color||th.accent,marginTop:2,fontWeight:700}}>📅 {nextPlanned.date} — {nextPlanned.type==="wod"?"🏋️ ":""}{nextPlanned.name}</div>}
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4,flexShrink:0}}>
                <Badge label={c.status} color={STATUS_COLOR[c.status]||th.muted}/>
                {lw&&<span style={{fontSize:13,fontWeight:800,color:th.accent,fontFamily:"'Barlow Condensed',sans-serif"}}>{lw.weight}kg</span>}
              </div>
            </div>
            <div style={{display:"flex",gap:14,fontSize:11,color:th.muted,marginBottom:8}}>
              <span>📅 <b style={{color:th.mutedLight}}>{c.sessions.length}</b></span>
              <span>✅ <b style={{color:a2>=80?"#22c55e":"#f59e0b"}}>{a2}%</b></span>
              <span>🎯 <b style={{color:th.mutedLight}}>{c.goals.filter(g=>g.done).length}/{c.goals.length}</b></span>
              <span>📆 <b style={{color:th.mutedLight}}>{(c.planned||[]).length}</b></span>
            </div>
            <Bar value={c.progress} color={th.accent}/>
          </div>);
        })}
        {!clients.length&&<div style={{textAlign:"center",color:th.muted,padding:60}}>{t.noClients}</div>}
      </div>

      {addOpen&&(<div style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"flex-end",zIndex:99}} onClick={()=>setAddOpen(false)}>
        <div onClick={e=>e.stopPropagation()} className="fu" style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:"20px 20px 0 0",padding:"24px 18px 40px",width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
          <div style={{width:36,height:4,borderRadius:99,background:th.border,margin:"0 auto 18px"}}/>
          <div style={{fontSize:22,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:16,color:th.text}}>{t.newClient}</div>
          <div style={{display:"flex",flexDirection:"column",gap:11}}>
            <Field label={t.fullName} value={newC.name} onChange={v=>setNewC(p=>({...p,name:v}))} placeholder={t.namePlaceholder}/>
            <div style={{display:"flex",gap:8}}>
              <Field label={t.age} type="number" value={newC.age} onChange={v=>setNewC(p=>({...p,age:v}))} placeholder={t.agePlaceholder} half/>
              <Field label={t.sport} value={newC.sport} onChange={v=>setNewC(p=>({...p,sport:v}))} placeholder={t.sportPlaceholder} half/>
            </div>
            <Field label={t.objective} value={newC.objective} onChange={v=>setNewC(p=>({...p,objective:v}))} placeholder={t.objectivePlaceholder}/>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>{t.notes}</label>
              <textarea value={newC.notes||""} onChange={e=>setNewC(p=>({...p,notes:e.target.value}))} placeholder={t.notesPlaceholder}
                style={{background:th.inputBg,border:`1.5px solid ${th.border}`,borderRadius:8,padding:"9px 10px",color:th.text,fontSize:13,fontFamily:"'Barlow',sans-serif",outline:"none",width:"100%",boxSizing:"border-box",resize:"none",minHeight:70}}
                onFocus={e=>e.target.style.borderColor=th.accent} onBlur={e=>e.target.style.borderColor=th.border}/>
            </div>
          </div>
          <div style={{display:"flex",gap:10,marginTop:16}}><Btn onClick={doAddClient}>{t.add}</Btn><Btn ghost onClick={()=>setAddOpen(false)}>{t.cancel}</Btn></div>
        </div>
      </div>)}
      {confirmDelete&&(<div style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99,padding:24}} onClick={()=>setConfirmDelete(null)}>
        <div onClick={e=>e.stopPropagation()} className="fu" style={{background:th.card,border:"1px solid #e6394644",borderRadius:20,padding:24,width:"100%",maxWidth:360}}>
          <div style={{fontSize:20,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:8,color:"#e63946"}}>{t.deleteClient}</div>
          <div style={{fontSize:13,color:th.mutedLight,marginBottom:20}}>{t.deleteConfirm} <b style={{color:th.text}}>{confirmDelete.name}</b> {t.deleteConfirm2}</div>
          <div style={{display:"flex",gap:10}}><Btn danger onClick={()=>doDeleteClient(confirmDelete.id)}>{t.delete}</Btn><Btn ghost onClick={()=>setConfirmDelete(null)}>{t.cancel}</Btn></div>
        </div>
      </div>)}
    </>);
  }

  if(view==="client"&&cl){
    const att=cl.sessions.length?Math.round(cl.sessions.filter(s=>s.present).length/cl.sessions.length*100):0;
    const lw=cl.metrics[0],pw=cl.metrics[1];
    const wd=lw&&pw?+(lw.weight-pw.weight).toFixed(1):null;
    const done=cl.goals.filter(g=>g.done).length;
    const gPct=cl.goals.length?Math.round(done/cl.goals.length*100):0;
    const TABS=[{id:"sessions",label:t.tabSessions},{id:"calendar",label:t.tabCalendar},{id:"metrics",label:t.tabMetrics},{id:"programs",label:t.tabPrograms},{id:"goals",label:t.tabGoals},{id:"charges",label:t.tabCharges}];
    const sessionsByMonth=cl.sessions.reduce((acc,s)=>{const month=s.date?s.date.slice(0,7):"inconnu";if(!acc[month])acc[month]=[];acc[month].push(s);return acc;},{});
    const sortedMonths=Object.keys(sessionsByMonth).sort((a,b)=>b.localeCompare(a));
    const lastTplId=cl.sessions.find(s=>s.templateId)?.templateId;
    const lastTpl=lastTplId?[...allTemplates,...allWods].find(tp=>tp.id===lastTplId):null;
    const suggestedTpl=lastTpl?(lastTpl.type==="wod"?allWods.find(w=>w.category===lastTpl.category&&w.id!==lastTpl.id)||allWods[0]:allTemplates.find(tp=>tp.cat===lastTpl.cat&&tp.id!==lastTpl.id)||allTemplates[0]):allTemplates[0];
    const MN=lang==="fr"?MONTH_NAMES:MONTH_NAMES_EN;

    if(editingClient&&editC) return wrap(<>
      <div style={{padding:"16px"}}>
        <button onClick={()=>{setEditingClient(false);setEditC(null);}} style={{background:"none",border:"none",color:th.mutedLight,cursor:"pointer",fontSize:12,marginBottom:14,fontFamily:"'Barlow',sans-serif",padding:0}}>{t.back_simple}</button>
        <div style={{fontSize:28,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:20,color:th.text}}>{t.editProfile}</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Field label={t.fullName} value={editC.name} onChange={v=>setEditC(p=>({...p,name:v}))} placeholder="ex. Tony Parker"/>
          <div style={{display:"flex",gap:8}}>
            <Field label={t.age} type="number" value={String(editC.age||"")} onChange={v=>setEditC(p=>({...p,age:v}))} placeholder="30" half/>
            <Field label={t.sport} value={editC.sport} onChange={v=>setEditC(p=>({...p,sport:v}))} placeholder="Basketball..." half/>
          </div>
          <Field label={t.objective} value={editC.objective} onChange={v=>setEditC(p=>({...p,objective:v}))} placeholder="Objectif..."/>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>{t.status}</label>
            <div style={{display:"flex",gap:6}}>
              {STATUS_OPTIONS.map(s=>(<button key={s} onClick={()=>setEditC(p=>({...p,status:s}))} style={{flex:1,padding:"8px",borderRadius:8,border:`1px solid ${editC.status===s?(STATUS_COLOR[s]||th.accent):th.border}`,background:editC.status===s?(STATUS_COLOR[s]||th.accent)+"22":"transparent",color:editC.status===s?(STATUS_COLOR[s]||th.accent):th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer"}}>{s}</button>))}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4}}>
            <label style={{fontSize:9,fontWeight:700,color:th.muted,letterSpacing:"0.12em",textTransform:"uppercase"}}>{t.notes}</label>
            <textarea value={editC.notes||""} onChange={e=>setEditC(p=>({...p,notes:e.target.value}))} placeholder={t.notesPlaceholder}
              style={{background:th.inputBg,border:`1.5px solid ${th.border}`,borderRadius:8,padding:"9px 10px",color:th.text,fontSize:13,fontFamily:"'Barlow',sans-serif",outline:"none",width:"100%",boxSizing:"border-box",resize:"none",minHeight:90}}
              onFocus={e=>e.target.style.borderColor=th.accent} onBlur={e=>e.target.style.borderColor=th.border}/>
          </div>
        </div>
        <div style={{display:"flex",gap:10,marginTop:20}}><Btn onClick={doSaveEditClient}>{t.saveProfile}</Btn><Btn ghost onClick={()=>{setEditingClient(false);setEditC(null);}}>{t.cancel}</Btn></div>
        <div style={{marginTop:24,paddingTop:20,borderTop:`1px solid ${th.border}`}}>
          <div style={{fontSize:12,color:th.muted,marginBottom:12}}>{t.dangerZone}</div>
          <div style={{display:"flex",gap:8}}><Btn small ghost onClick={()=>doArchiveClient(selId)}>{t.archive}</Btn><Btn small danger onClick={()=>setConfirmDelete(cl)}>{t.delete}</Btn></div>
        </div>
      </div>
      {confirmDelete&&(<div style={{position:"fixed",inset:0,background:"#000c",display:"flex",alignItems:"center",justifyContent:"center",zIndex:99,padding:24}} onClick={()=>setConfirmDelete(null)}>
        <div onClick={e=>e.stopPropagation()} className="fu" style={{background:th.card,border:"1px solid #e6394644",borderRadius:20,padding:24,width:"100%",maxWidth:360}}>
          <div style={{fontSize:20,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",marginBottom:8,color:"#e63946"}}>{t.deleteClient}</div>
          <div style={{display:"flex",gap:10}}><Btn danger onClick={()=>doDeleteClient(cl.id)}>{t.delete}</Btn><Btn ghost onClick={()=>setConfirmDelete(null)}>{t.cancel}</Btn></div>
        </div>
      </div>)}
    </>);

    return wrap(<>
      <div style={{background:th.gradientHeader,padding:"16px 16px 14px",borderBottom:`1px solid ${th.border}`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
          <button onClick={()=>setView("dash")} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:12,fontFamily:"'Barlow',sans-serif",padding:0}}>{t.back}</button>
          <button onClick={()=>{setEditingClient(true);setEditC({...cl});}} style={{background:th.navyLight,border:`1px solid ${th.border}`,borderRadius:8,padding:"5px 12px",color:th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:11,textTransform:"uppercase",cursor:"pointer"}}>{t.edit}</button>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:14}}>
          <Avatar name={cl.name} size={54}/>
          <div>
            <div style={{fontSize:24,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1,color:th.text}}>{cl.name.toUpperCase()}</div>
            <div style={{color:th.mutedLight,fontSize:12,marginTop:3}}>{cl.sport} · {cl.age} ans · {t.since} {cl.since}</div>
            <div style={{display:"flex",gap:6,marginTop:5,flexWrap:"wrap",alignItems:"center"}}>
              <Badge label={cl.status} color={STATUS_COLOR[cl.status]||th.muted}/>
              {cl.notes&&<span style={{fontSize:10,color:th.muted,fontStyle:"italic"}}>{cl.notes.slice(0,40)}{cl.notes.length>40?"...":""}</span>}
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2}}>
          {[
            {l:t.presences,v:cl.sessions.filter(s=>s.present).length,c:th.text},
            {l:t.assiduity,v:`${att}%`,c:att>=80?"#22c55e":"#f59e0b"},
            {l:t.wods,v:cl.sessions.filter(s=>s.isWod).length,c:"#f97316"},
            {l:t.planned,v:(cl.planned||[]).length,c:th.accent},
            {l:t.weight,v:lw?`${lw.weight}kg`:"—",c:th.accent},
            {l:"Δ",v:wd!==null?`${wd>0?"+":""}${wd}kg`:"—",c:wd!==null?(wd<=0?"#22c55e":"#e63946"):th.muted},
          ].map(s=>(
            <div key={s.l} style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:10,padding:"8px 12px",flexShrink:0}}>
              <div style={{fontSize:8,color:th.muted,fontWeight:700,letterSpacing:"0.12em",textTransform:"uppercase",marginBottom:3}}>{s.l}</div>
              <div style={{fontSize:16,fontWeight:900,color:s.c,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1}}>{s.v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{padding:"10px 14px",background:th.surface,borderBottom:`1px solid ${th.border}`}}>
        <div style={{display:"flex",gap:2,background:th.card,borderRadius:10,padding:3,border:`1px solid ${th.border}`,overflowX:"auto"}}>
          {TABS.map(tp=>(<button key={tp.id} onClick={()=>setTab(tp.id)} style={{flex:1,padding:"8px 4px",borderRadius:8,border:"none",cursor:"pointer",background:tab===tp.id?th.navyLight:"transparent",color:tab===tp.id?th.text:th.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",transition:"all .2s",borderBottom:tab===tp.id?`2px solid ${th.accent}`:"2px solid transparent",flexShrink:0,whiteSpace:"nowrap"}}>{tp.label}</button>))}
        </div>
      </div>

      <div style={{padding:"14px"}}>
        {tab==="sessions"&&<NextSessionWidget client={cl} allTemplates={allTemplates} allWods={allWods} onStartSession={(plan)=>setLiveSession(plan)}/>}
        {tab==="calendar"&&<CalendarTab client={cl} allTemplates={allTemplates} allWods={allWods} onUpdate={(patch)=>up(selId,patch)} onSaveWod={saveOneWod}/>}

        {tab==="sessions"&&<div className="fu">
          <MonthlyReport sessions={cl.sessions} metrics={cl.metrics}/>
          {!showNewSession?(
            <div style={{marginBottom:16}}>
              {suggestedTpl&&(
                <div style={{background:`${suggestedTpl.color||th.accent}11`,border:`1px solid ${suggestedTpl.color||th.accent}44`,borderRadius:14,padding:12,marginBottom:10}}>
                  <div style={{fontSize:10,color:th.mutedLight,marginBottom:6}}>{suggestedTpl.type==="wod"?t.suggestionWod:t.suggestionSession}</div>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",color:suggestedTpl.color||th.accent}}>{suggestedTpl.name}</div>
                      <div style={{fontSize:11,color:th.muted}}>{suggestedTpl.type==="wod"?`${suggestedTpl.description} · ${suggestedTpl.movements?.length} mouvements`:`${suggestedTpl.exercises?.length} exercices`}</div>
                    </div>
                    <Btn small onClick={()=>{setShowNewSession(true);applyTemplateToSession(suggestedTpl);}} color={suggestedTpl.color||th.accent}>{t.use}</Btn>
                  </div>
                </div>
              )}
              <div style={{display:"flex",gap:8}}>
                <button onClick={()=>{setShowNewSession(true);setSessionMode("normal");}} style={{flex:1,background:th.card,border:`2px dashed ${th.accent}44`,borderRadius:14,padding:"14px",color:th.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  💪 {t.tabSessions}
                </button>
                <button onClick={()=>{setShowNewSession(true);setSessionMode("wod");}} style={{flex:1,background:th.card,border:"2px dashed #f9741644",borderRadius:14,padding:"14px",color:"#f97316",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:13,letterSpacing:"0.06em",textTransform:"uppercase",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                  🏋️ WOD
                </button>
              </div>
            </div>
          ):(
            <div style={{background:th.card,border:`1px solid ${sessionMode==="wod"?"#f9741644":`${th.accent}44`}`,borderRadius:14,padding:14,marginBottom:16}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <SecTitle c={sessionMode==="wod"?`🏋️ ${t.sessionWod}`:`💪 ${t.sessionTitle}`}/>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <div style={{display:"flex",gap:2,background:th.surface,borderRadius:8,padding:2}}>
                    <button onClick={()=>{setSessionMode("normal");setPendingWod(null);}} style={{padding:"4px 10px",borderRadius:6,border:"none",cursor:"pointer",background:sessionMode==="normal"?th.accent:"transparent",color:sessionMode==="normal"?"#fff":th.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase"}}>💪</button>
                    <button onClick={()=>{setSessionMode("wod");setPendingSession({exercises:[]});}} style={{padding:"4px 10px",borderRadius:6,border:"none",cursor:"pointer",background:sessionMode==="wod"?"#f97316":"transparent",color:sessionMode==="wod"?"#fff":th.muted,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase"}}>🏋️</button>
                  </div>
                  <button onClick={()=>{setShowNewSession(false);setNewS({date:"",present:true,duration:"",note:""});setPendingSession({exercises:[]});setPendingWod(null);setShowExPicker(false);setShowTemplatePicker(false);setShowWodCreator(false);setSessionMode("normal");}} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:18,padding:0}}>✕</button>
                </div>
              </div>
              <button onClick={()=>setShowTemplatePicker(!showTemplatePicker)} style={{width:"100%",background:th.surface,border:`1px solid ${sessionMode==="wod"?"#f9741644":`${th.accent}44`}`,borderRadius:8,padding:"8px 14px",color:sessionMode==="wod"?"#f97316":th.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                {sessionMode==="wod"?"🏋️":"📋"} {showTemplatePicker?"Fermer":sessionMode==="wod"?t.chooseWod:t.chooseTemplate}
              </button>
              {showTemplatePicker&&<TemplatePicker allTemplates={allTemplates} allWods={allWods} onSelect={applyTemplateToSession} onClose={()=>setShowTemplatePicker(false)}/>}
              {sessionMode==="wod"&&(<>
                {pendingWod?(
                  <div style={{marginBottom:10}}>
                    <div style={{background:pendingWod.color+"11",border:`1px solid ${pendingWod.color}33`,borderRadius:12,padding:12,marginBottom:10}}>
                      <div style={{fontWeight:800,fontSize:14,fontFamily:"'Barlow Condensed',sans-serif",color:pendingWod.color}}>{pendingWod.name}</div>
                      <div style={{fontSize:11,color:th.muted}}>{pendingWod.description}</div>
                    </div>
                    <Field label={t.score} value={pendingWod.score||""} onChange={v=>setPendingWod(p=>({...p,score:v}))} placeholder="ex. 18 rounds ou 12:34"/>
                    <div style={{marginTop:8}}><button onClick={()=>setPendingWod(null)} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:11,fontFamily:"'Barlow',sans-serif",padding:0}}>{t.changeWod}</button></div>
                  </div>
                ):(!showTemplatePicker&&(
                  <div style={{marginBottom:10}}>
                    <button onClick={()=>setShowWodCreator(!showWodCreator)} style={{width:"100%",background:th.surface,border:"1px solid #f9741644",borderRadius:8,padding:"8px 14px",color:"#f97316",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:10}}>
                      ✏️ {showWodCreator?"Fermer":t.createCustomWod}
                    </button>
                    {showWodCreator&&<WodCreator onSave={(wod)=>{setPendingWod({...wod,score:""});setShowWodCreator(false);saveOneWod(wod);}} onClose={()=>setShowWodCreator(false)}/>}
                  </div>
                ))}
              </>)}
              {sessionMode==="normal"&&pendingSession.templateId&&(
                <div style={{background:"#f9741611",border:"1px solid #f9741633",borderRadius:8,padding:"6px 12px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
                  <span style={{fontSize:11,color:"#f97316"}}>📋 Template : <b>{allTemplates.find(tp=>tp.id===pendingSession.templateId)?.name||"Custom"}</b></span>
                  <button onClick={()=>setPendingSession(p=>({...p,templateId:null}))} style={{background:"none",border:"none",color:th.muted,cursor:"pointer",fontSize:12,padding:0,marginLeft:"auto"}}>✕</button>
                </div>
              )}
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:10}}>
                <Field label={t.date} type="date" value={newS.date} onChange={v=>setNewS(p=>({...p,date:v}))} half/>
                <Field label={t.duration} type="number" value={newS.duration} onChange={v=>setNewS(p=>({...p,duration:v}))} placeholder="60" half/>
                <div style={{width:"100%",display:"flex",alignItems:"center",gap:8}}>
                  <input type="checkbox" checked={newS.present} onChange={e=>setNewS(p=>({...p,present:e.target.checked}))} style={{accentColor:"#22c55e",width:16,height:16}}/>
                  <span style={{fontSize:13,color:th.mutedLight,fontWeight:600}}>{t.present}</span>
                </div>
                <Field label={t.notes} value={newS.note} onChange={v=>setNewS(p=>({...p,note:v}))} placeholder={t.sessionNotes}/>
              </div>
              {sessionMode==="normal"&&(<>
                <button onClick={()=>setShowExPicker(!showExPicker)} style={{width:"100%",background:th.surface,border:`1px solid ${th.accent}44`,borderRadius:8,padding:"8px 14px",color:th.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:showExPicker?10:0,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
                  💪 {showExPicker?"Fermer":t.addExercisesManual}
                </button>
                {showExPicker&&<SessionExercisePicker onAdd={addExercisesToSession} onClose={()=>setShowExPicker(false)}/>}
                {pendingSession.exercises.length>0&&(
                  <div style={{marginTop:10,marginBottom:10}}>
                    <div style={{fontSize:10,color:th.muted,fontWeight:700,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:8}}>{t.exercises} ({pendingSession.exercises.length})</div>
                    {pendingSession.exercises.map((ex,i)=><ExerciseFields key={i} ex={ex} idx={i} onChange={updatePendingEx} onRemove={()=>removeSessionEx(i)}/>)}
                  </div>
                )}
              </>)}
              <div style={{marginTop:12}}><Btn onClick={doAddSession} color={sessionMode==="wod"?"#f97316":undefined}>{sessionMode==="wod"?t.saveWod:t.saveSession}</Btn></div>
            </div>
          )}

          {editingSession&&(<div style={{position:"fixed",inset:0,background:"#000e",display:"flex",alignItems:"flex-end",zIndex:99}} onClick={()=>setEditingSession(null)}>
            <div onClick={e=>e.stopPropagation()} className="fu" style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:"20px 20px 0 0",padding:"24px 18px 40px",width:"100%",maxHeight:"90vh",overflowY:"auto"}}>
              <div style={{width:36,height:4,borderRadius:99,background:th.border,margin:"0 auto 18px"}}/>
              <SecTitle c="Modifier la séance"/>
              <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:12}}>
                <Field label={t.date} type="date" value={editingSession.date} onChange={v=>setEditingSession(p=>({...p,date:v}))} half/>
                <Field label={t.duration} type="number" value={String(editingSession.duration||"")} onChange={v=>setEditingSession(p=>({...p,duration:+v}))} placeholder="60" half/>
                <div style={{width:"100%",display:"flex",alignItems:"center",gap:8}}>
                  <input type="checkbox" checked={editingSession.present} onChange={e=>setEditingSession(p=>({...p,present:e.target.checked}))} style={{accentColor:"#22c55e",width:16,height:16}}/>
                  <span style={{fontSize:13,color:th.mutedLight,fontWeight:600}}>{t.present}</span>
                </div>
                <Field label={t.notes} value={editingSession.note||""} onChange={v=>setEditingSession(p=>({...p,note:v}))} placeholder={t.sessionNotes}/>
                {editingSession.isWod&&<Field label="Score WOD" value={editingSession.wodScore||""} onChange={v=>setEditingSession(p=>({...p,wodScore:v}))} placeholder="ex. 18 rounds"/>}
              </div>
              {!editingSession.isWod&&(editingSession.exercises||[]).map((ex,i)=><ExerciseFields key={i} ex={ex} idx={i} onChange={updateEditSessionEx} onRemove={()=>removeEditSessionEx(i)}/>)}
              <div style={{display:"flex",gap:10,marginTop:14}}><Btn onClick={doSaveEditSession}>💾 {t.save}</Btn><Btn ghost onClick={()=>setEditingSession(null)}>{t.cancel}</Btn></div>
            </div>
          </div>)}

          {sortedMonths.length===0?(
            <div style={{textAlign:"center",color:th.muted,padding:40}}>{t.noSessions}</div>
          ):sortedMonths.map(month=>{
            const[year,m]=month.split("-");
            const label=`${MN[m]||m} ${year}`;
            const sessions=[...sessionsByMonth[month]].sort((a,b)=>b.date.localeCompare(a.date));
            return(<div key={month} style={{marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                <div style={{flex:1,height:1,background:th.border}}/>
                <span style={{fontSize:10,fontWeight:700,color:th.muted,letterSpacing:"0.1em",textTransform:"uppercase",flexShrink:0}}>{label}</span>
                <div style={{flex:1,height:1,background:th.border}}/>
              </div>
              {sessions.map((s,i)=>{
                const sTpl=s.templateId?[...allTemplates,...allWods].find(tp=>tp.id===s.templateId):null;
                const fmt=s.isWod?WOD_FORMATS.find(f=>f.id===s.wodFormat):null;
                return(<SwipeToDelete key={s.id} onDelete={()=>up(selId,{sessions:cl.sessions.filter(ss=>ss.id!==s.id)})} label={t.swipeDelete}>
                  <div className="ch fu" style={{background:th.card,border:`1px solid ${s.isWod?"#f9741633":th.border}`,borderRadius:12,padding:"12px 14px"}}>
                    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                      <div style={{width:8,height:8,borderRadius:"50%",background:s.present?"#22c55e":"#e63946",marginTop:5,flexShrink:0}}/>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:4}}>
                          <div>
                            <span style={{fontWeight:800,fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,color:th.text}}>{s.date}</span>
                            {s.isWod&&<span style={{marginLeft:6,fontSize:11,color:"#f97316",fontWeight:700}}>🏋️ WOD</span>}
                            {sTpl&&<span style={{marginLeft:6,fontSize:10,color:sTpl.color||th.accent,fontWeight:700}}>{sTpl.name}</span>}
                          </div>
                          <div style={{display:"flex",gap:6,alignItems:"center"}}>
                            {s.duration>0&&<span style={{fontSize:11,color:th.muted}}>{s.duration}min</span>}
                            <Badge label={s.present?t.present_badge:t.absent_badge} color={s.present?"#22c55e":"#e63946"}/>
                            <button onClick={e=>{e.stopPropagation();setEditingSession({...s,exercises:[...(s.exercises||[])]});}} style={{background:th.navyLight,border:`1px solid ${th.border}`,borderRadius:6,padding:"3px 8px",color:th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,cursor:"pointer"}}>✏️</button>
                          </div>
                        </div>
                        {s.note&&<div style={{color:th.mutedLight,fontSize:12,marginTop:3}}>{s.note}</div>}
                        {s.isWod&&(
                          <div style={{marginTop:8,background:"#f9741611",borderRadius:8,padding:"8px 10px",border:"1px solid #f9741633"}}>
                            {fmt&&<div style={{fontSize:11,fontWeight:800,color:"#f97316",marginBottom:4}}>{fmt.icon} {s.wodFormat?.toUpperCase()} {s.wodDuration?`— ${s.wodDuration} min`:""}</div>}
                            {s.exercises?.map((ex,j)=>(<div key={j} style={{display:"flex",alignItems:"center",gap:6,padding:"3px 0"}}><span style={{color:"#f97316",fontSize:10}}>•</span><span style={{fontSize:11,color:th.text,flex:1}}>{ex.name}</span>{ex.reps&&<span style={{fontSize:10,color:"#f97316",fontWeight:700}}>× {ex.reps}</span>}</div>))}
                            {s.wodScore&&<div style={{marginTop:6,padding:"4px 8px",background:"#f9741622",borderRadius:6,fontSize:11,color:"#f97316",fontWeight:700}}>{t.scoreLabel} {s.wodScore}</div>}
                          </div>
                        )}
                        {!s.isWod&&s.exercises&&s.exercises.length>0&&(
                          <div style={{marginTop:8}}>
                            {s.exercises.map((ex,j)=>{
                              const libEx=LIBRARY.find(l=>l.id===ex.libId);
                              const isCardio=libEx?.cat==="Cardio";
                              return(<div key={j} style={{display:"flex",alignItems:"center",gap:8,padding:"5px 0",borderBottom:j<s.exercises.length-1?`1px solid ${th.border}44`:"none"}}>
                                <div style={{width:24,height:12,borderRadius:3,overflow:"hidden",flexShrink:0}}><AnatomySVG id={ex.libId}/></div>
                                <span style={{fontSize:11,color:th.text,fontWeight:600,flex:1}}>{ex.name}</span>
                                <div style={{display:"flex",gap:4,flexShrink:0,flexWrap:"wrap",justifyContent:"flex-end"}}>
                                  {isCardio?<>
                                    {ex.duration&&<Badge label={`${ex.duration}min`} color="#f59e0b"/>}
                                    {ex.speed&&<Badge label={`${ex.speed}km/h`} color="#22c55e"/>}
                                    {ex.watts&&<Badge label={`${ex.watts}W`} color="#8b5cf6"/>}
                                    {ex.zone&&<Badge label={`Z${ex.zone}`} color={zoneColor(ex.zone)}/>}
                                  </>:<>
                                    {ex.sets&&ex.reps&&<Badge label={`${ex.sets}×${ex.reps}`} color={th.accent}/>}
                                    {ex.load&&+ex.load>0&&<Badge label={`${ex.load}kg`} color="#f59e0b"/>}
                                    {ex.rpe&&<Badge label={`RPE${ex.rpe}`} color={rpeColor(ex.rpe)}/>}
                                    {ex.note&&ex.note.includes("↑")&&<Badge label="↑ Prog." color="#22c55e"/>}
                                  </>}
                                </div>
                              </div>);
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </SwipeToDelete>);
              })}
            </div>);
          })}
        </div>}

        {tab==="metrics"&&<div className="fu">
          <ProgressionCharts metrics={cl.metrics}/>
          <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:14,marginBottom:14}}>
            <SecTitle c={t.newMeasure}/>
            <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
              <Field label={t.date} type="date" value={newM.date} onChange={v=>setNewM(p=>({...p,date:v}))} half/>
              <Field label={t.weightKg} type="number" value={newM.weight} onChange={v=>setNewM(p=>({...p,weight:v}))} placeholder="88.5" half/>
              <Field label={t.chest} type="number" value={newM.chest} onChange={v=>setNewM(p=>({...p,chest:v}))} placeholder="104" half/>
              <Field label={t.waist} type="number" value={newM.waist} onChange={v=>setNewM(p=>({...p,waist:v}))} placeholder="86" half/>
              <Field label={t.hips} type="number" value={newM.hips} onChange={v=>setNewM(p=>({...p,hips:v}))} placeholder="98" half/>
              <Field label={t.fatPct} type="number" value={newM.fatPct} onChange={v=>setNewM(p=>({...p,fatPct:v}))} placeholder="14.2" half/>
            </div>
            <div style={{marginTop:12}}><Btn onClick={doAddMetric}>{t.save}</Btn></div>
          </div>
          {cl.metrics.map((m,i)=>{
            const prev=cl.metrics[i+1];const d=prev?+(m.weight-prev.weight).toFixed(1):null;
            return<SwipeToDelete key={m.date+i} onDelete={()=>up(selId,{metrics:cl.metrics.filter((_,idx)=>idx!==i)})} label={t.swipeDelete}>
              <div className="ch fu" style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                  <span style={{fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,color:th.mutedLight}}>{m.date}</span>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:24,fontWeight:900,color:th.accent,fontFamily:"'Barlow Condensed',sans-serif",lineHeight:1}}>{m.weight} kg</div>
                    {d!==null&&<div style={{fontSize:11,color:d<=0?"#22c55e":"#e63946"}}>{d>0?"+":""}{d} kg</div>}
                  </div>
                </div>
                <div style={{display:"flex",gap:12,flexWrap:"wrap"}}>
                  {m.chest>0&&<span style={{fontSize:12,color:th.muted}}>Poitrine <b style={{color:th.text}}>{m.chest}cm</b></span>}
                  {m.waist>0&&<span style={{fontSize:12,color:th.muted}}>Taille <b style={{color:th.text}}>{m.waist}cm</b></span>}
                  {m.hips>0&&<span style={{fontSize:12,color:th.muted}}>Hanches <b style={{color:th.text}}>{m.hips}cm</b></span>}
                  {m.fatPct>0&&<span style={{fontSize:12,color:th.muted}}>MG <b style={{color:th.text}}>{m.fatPct}%</b></span>}
                </div>
              </div>
            </SwipeToDelete>;
          })}
          {!cl.metrics.length&&<div style={{textAlign:"center",color:th.muted,padding:40}}>{t.noMetrics}</div>}
        </div>}

        {tab==="programs"&&<div className="fu">
          <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:14,marginBottom:14}}>
            <SecTitle c={t.newProgram}/>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <Field label={t.templateName} value={newP.name} onChange={v=>setNewP(p=>({...p,name:v}))} placeholder="ex. Push Day A"/>
              <div style={{display:"flex",gap:8}}>
                <Field label={t.weeks} type="number" value={newP.weeks} onChange={v=>setNewP(p=>({...p,weeks:v}))} placeholder="8" half/>
                <Field label={t.startDate} type="date" value={newP.startDate} onChange={v=>setNewP(p=>({...p,startDate:v}))} half/>
              </div>
            </div>
            <div style={{marginTop:12}}><Btn onClick={doAddProgram}>{t.create}</Btn></div>
          </div>
          {cl.programs.map((prog,i)=>(
            <div key={prog.id} className="fu" style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,marginBottom:14,overflow:"hidden"}}>
              <div style={{background:th.navyLight,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${th.border}`}}>
                <div>
                  <div style={{fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,color:th.text}}>{prog.name.toUpperCase()}</div>
                  <div style={{fontSize:10,color:th.muted}}>{prog.weeks} sem · {prog.startDate}</div>
                </div>
                <div style={{display:"flex",gap:6}}>
                  <Btn small ghost onClick={()=>{setShowGenerator(!showGenerator);setGeneratorPid(prog.id);}}>{t.auto}</Btn>
                  <Btn small onClick={()=>{setAddingExTo(addingExTo===prog.id?null:prog.id);setPickingEx(false);}}>{t.addExercise}</Btn>
                </div>
              </div>
              {showGenerator&&generatorPid===prog.id&&(<div style={{padding:14,background:th.bg,borderBottom:`1px solid ${th.border}`}}><PPLGenerator onAdd={(exs)=>doAddGeneratedExercises(prog.id,exs)}/></div>)}
              {addingExTo===prog.id&&(
                <div style={{padding:14,background:th.bg,borderBottom:`1px solid ${th.border}`}}>
                  <button onClick={()=>setPickingEx(!pickingEx)} style={{background:th.navyLight,border:`1px solid ${th.accent}44`,borderRadius:8,padding:"7px 14px",color:th.accent,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:12,textTransform:"uppercase",cursor:"pointer",marginBottom:12,width:"100%"}}>📚 {pickingEx?"Fermer":t.chooseLib}</button>
                  {pickingEx&&(<div>
                    <input value={libSearch} onChange={e=>setLibSearch(e.target.value)} placeholder="🔍 Rechercher..."
                      style={{width:"100%",background:th.card,border:`1.5px solid ${th.border}`,borderRadius:8,padding:"8px 12px",color:th.text,fontSize:13,fontFamily:"'Barlow',sans-serif",outline:"none",marginBottom:10,boxSizing:"border-box"}}
                      onFocus={e=>e.target.style.borderColor=th.accent} onBlur={e=>e.target.style.borderColor=th.border}/>
                    <div style={{display:"flex",gap:5,marginBottom:10,overflowX:"auto",paddingBottom:4}}>
                      {CATS.map(cat=>(<button key={cat} onClick={()=>setLibCat(cat)} style={{padding:"4px 10px",borderRadius:99,border:`1px solid ${libCat===cat?(CAT_COLOR[cat]||th.accent):th.border}`,background:libCat===cat?(CAT_COLOR[cat]||th.accent)+"22":"transparent",color:libCat===cat?(CAT_COLOR[cat]||th.accent):th.mutedLight,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,fontSize:10,textTransform:"uppercase",cursor:"pointer",flexShrink:0}}>{cat}</button>))}
                    </div>
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:6,marginBottom:12,maxHeight:220,overflowY:"auto"}}>
                      {LIBRARY.filter(e=>{const mc=libCat==="Tous"||e.cat===libCat;const ms=libSearch===""||e.name.toLowerCase().includes(libSearch.toLowerCase());return mc&&ms;}).map(ex=>(
                        <div key={ex.id} onClick={()=>{setNewEx(p=>({...p,name:ex.name,libId:ex.id}));setPickingEx(false);setLibSearch("");}}
                          style={{background:th.card,border:`1px solid ${newEx.libId===ex.id?th.accent:th.border}`,borderRadius:10,overflow:"hidden",cursor:"pointer"}}>
                          <AnatomySVG id={ex.id}/>
                          <div style={{padding:"4px 6px",fontSize:9,fontWeight:700,fontFamily:"'Barlow Condensed',sans-serif",color:th.mutedLight,lineHeight:1.2}}>{ex.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>)}
                  <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
                    <Field label={t.exercise} value={newEx.name} onChange={v=>setNewEx(p=>({...p,name:v}))} placeholder="ex. Squat"/>
                    <Field label={t.sets} value={newEx.sets||""} onChange={v=>setNewEx(p=>({...p,sets:v}))} placeholder="4" third/>
                    <Field label={t.reps} value={newEx.reps||""} onChange={v=>setNewEx(p=>({...p,reps:v}))} placeholder="8" third/>
                    <Field label={t.load} value={newEx.load||""} onChange={v=>setNewEx(p=>({...p,load:v}))} placeholder="70kg" third/>
                    <Field label={t.note} value={newEx.note||""} onChange={v=>setNewEx(p=>({...p,note:v}))} placeholder={t.indication}/>
                  </div>
                  <div style={{display:"flex",gap:8,marginTop:10}}><Btn small onClick={()=>doAddExercise(prog.id)}>{t.add}</Btn><Btn small ghost onClick={()=>{setAddingExTo(null);setPickingEx(false);setLibSearch("");}}>{t.cancel}</Btn></div>
                </div>
              )}
              {prog.exercises.map((ex,j)=>{
                const lib=LIBRARY.find(l=>l.id===ex.libId);const orm=calc1RM(ex.load,ex.reps);
                return(<div key={j} style={{display:"flex",alignItems:"center",padding:"11px 14px",gap:10,borderBottom:j<prog.exercises.length-1?`1px solid ${th.border}`:"none"}}>
                  {lib?<div style={{width:44,height:22,borderRadius:6,overflow:"hidden",flexShrink:0}}><AnatomySVG id={lib.id}/></div>:<div style={{width:24,height:24,borderRadius:6,background:th.accent+"1a",border:`1px solid ${th.accent}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:th.accent,flexShrink:0}}>{j+1}</div>}
                  <div style={{flex:1}}><div style={{fontWeight:700,fontSize:14,color:th.text}}>{ex.name}</div>{orm&&<div style={{fontSize:10,color:th.muted}}>{t.oneRm} : <b style={{color:th.accent}}>{orm}kg</b></div>}</div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",justifyContent:"flex-end"}}>
                    {ex.sets&&ex.reps&&<Badge label={`${ex.sets}×${ex.reps}`} color={th.accent}/>}
                    {ex.load&&<Badge label={ex.load} color="#f59e0b"/>}
                  </div>
                </div>);
              })}
              {!prog.exercises.length&&<div style={{padding:"14px",color:th.muted,fontSize:12}}>{t.noExercises}</div>}
            </div>
          ))}
          {!cl.programs.length&&<div style={{textAlign:"center",color:th.muted,padding:40}}>{t.noPrograms}</div>}
        </div>}

        {tab==="goals"&&<div className="fu">
          <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:14,marginBottom:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
              <span style={{fontSize:12,fontWeight:700,color:th.mutedLight}}>{t.globalProgress}</span>
              <span style={{fontSize:22,fontWeight:900,color:gPct===100?"#22c55e":th.accent,fontFamily:"'Barlow Condensed',sans-serif"}}>{gPct}%</span>
            </div>
            <Bar value={gPct} color={gPct===100?"#22c55e":th.accent}/>
          </div>
          <div style={{background:th.card,border:`1px solid ${th.border}`,borderRadius:14,padding:14,marginBottom:14}}>
            <SecTitle c={t.newGoal}/>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <Field label={t.goal} value={newG.label} onChange={v=>setNewG(p=>({...p,label:v}))} placeholder={t.goalPlaceholder}/>
              <Field label={t.deadline} type="date" value={newG.deadline} onChange={v=>setNewG(p=>({...p,deadline:v}))}/>
            </div>
            <div style={{marginTop:12}}><Btn onClick={doAddGoal}>{t.add}</Btn></div>
          </div>
          {cl.goals.map((g,i)=>(
            <SwipeToDelete key={g.id} onDelete={()=>up(selId,{goals:cl.goals.filter(x=>x.id!==g.id)})} label={t.swipeDelete}>
              <div className="ch fu" onClick={()=>up(selId,{goals:cl.goals.map(x=>x.id===g.id?{...x,done:!x.done}:x)})}
                style={{background:g.done?"#22c55e0e":th.card,border:`1px solid ${g.done?"#22c55e44":th.border}`,borderRadius:12,padding:"13px 14px",cursor:"pointer",display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:22,height:22,borderRadius:6,flexShrink:0,background:g.done?"#22c55e":"transparent",border:`2px solid ${g.done?"#22c55e":th.border}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,color:"#000",fontWeight:900}}>{g.done?"✓":""}</div>
                <div style={{flex:1}}>
                  <div style={{fontWeight:700,fontSize:14,textDecoration:g.done?"line-through":"none",color:g.done?th.mutedLight:th.text}}>{g.label}</div>
                  {g.deadline&&<div style={{fontSize:11,color:th.muted,marginTop:2}}>{t.deadline} : {g.deadline}</div>}
                </div>
                <Badge label={g.done?t.achieved:t.inProgress} color={g.done?"#22c55e":"#f59e0b"}/>
              </div>
            </SwipeToDelete>
          ))}
          {!cl.goals.length&&<div style={{textAlign:"center",color:th.muted,padding:40}}>{t.noGoals}</div>}
        </div>}

        {tab==="charges"&&<ChargesTab sessions={cl.sessions}/>}
      </div>
    </>);
  }
  return null;
}
