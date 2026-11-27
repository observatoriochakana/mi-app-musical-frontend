/* ==========================================================================
   ETHNOREAPER STUDIO - MOTOR DAW ULTRALIVIANO & ESTUDIO TINY DESK
   Arquitectura: Web Audio API + Konva Piano Roll + Video Sync + Microtonalidad
   ========================================================================== */

const BACKEND_URL = "https://onrender.com";

// 1. DICCIONARIO MULTILINGÜE (ES / EN / FR)
const I18N = {
  es: {
    nav_home: "Inicio / Tiny Desk",
    nav_studio: "Estudio DAW",
    nav_admin: "Mi Panel",
    hero_tag: "SALA DE ENSAYO ÍNTIMA • LATENCIA CERO",
    hero_title: 'Graba en Vivo. <span class="accent-warm">Fusión Orgánica.</span>',
    hero_subtitle: "Estación de trabajo ultraliviana inspirada en la eficiencia de REAPER y la calidez de un concierto acústico Tiny Desk. Explora 30 instrumentos étnicos, microtonalidad y producción multipista de audio y video en tu navegador.",
    hero_cta_studio: "Abrir Estudio DAW",
    hero_cta_shortcuts: "Atajos REAPER (?)",
    quick_jam_title: "Plantillas de Sesión Instantánea",
    quick_jam_desc: "Elige un estilo para cargar pistas, BPM, escala y efectos automáticamente:",
    catalog_title: "Catálogo de Instrumentos Étnicos y Aborígenes",
    catalog_subtitle: 'Haz clic en "Audicionar" para escuchar la nota raíz o "Enviar al Estudio" para crear una pista.',
    guide_title: "Guía Rápida: Jam Room en 3 Pasos",
    guide_step1_title: "Configura la Sala y Escala",
    guide_step1_desc: "Define el BPM, activa el metrónomo (Tecla C) y selecciona tu escala étnica o microtonal en la barra superior.",
    guide_step2_title: "Graba Multipista y Video",
    guide_step2_desc: "Dibuja en el Piano Roll, toca con el teclado del PC o graba tu micrófono y cámara estilo Tiny Desk en tiempo real.",
    guide_step3_title: "Mezcla, Masteriza y Exporta",
    guide_step3_desc: "Ajusta Pan, Solo/Mute, aplica Auto-Wah, Flanger o Reverb de Convolución con limitador master -0.3 dBFS y descarga tu WAV."
  },
  en: {
    nav_home: "Home / Tiny Desk",
    nav_studio: "DAW Studio",
    nav_admin: "My Panel",
    hero_tag: "INTIMATE JAM ROOM • ZERO LATENCY",
    hero_title: 'Record Live. <span class="accent-warm">Organic Fusion.</span>',
    hero_subtitle: "Ultralight workstation inspired by REAPER efficiency and Tiny Desk warmth. Explore 30 ethnic instruments, microtonality, and multitrack audio/video production right in your browser.",
    hero_cta_studio: "Open DAW Studio",
    hero_cta_shortcuts: "REAPER Shortcuts (?)",
    quick_jam_title: "Instant Session Templates",
    quick_jam_desc: "Pick a style to auto-load tracks, BPM, scale, and studio FX:",
    catalog_title: "Ethnic & Aboriginal Instruments Catalog",
    catalog_subtitle: 'Click "Audition" to preview root note or "Send to Studio" to create a track.',
    guide_title: "Quick Guide: Jam Room in 3 Steps",
    guide_step1_title: "Set Room & Scale",
    guide_step1_desc: "Set BPM, toggle metronome (Key C), and select your ethnic or microtonal scale in the top strip.",
    guide_step2_title: "Multitrack Audio & Video",
    guide_step2_desc: "Draw in Piano Roll, play with PC keyboard, or record microphone and Tiny Desk camera feeds in sync.",
    guide_step3_title: "Mix, Master & Export",
    guide_step3_desc: "Adjust Pan, Solo/Mute, apply Auto-Wah, Flanger, or Convolution Reverb with -0.3 dBFS limiter and export WAV."
  },
  fr: {
    nav_home: "Accueil / Tiny Desk",
    nav_studio: "Studio DAW",
    nav_admin: "Mon Panneau",
    hero_tag: "SALLE DE RÉPÉTITION INTIME • ZÉRO LATENCE",
    hero_title: 'Enregistrez en Direct. <span class="accent-warm">Fusion Organique.</span>',
    hero_subtitle: "Station de travail ultralégère inspirée de REAPER et de la chaleur Tiny Desk. Explorez 30 instruments ethniques, la microtonalité et la production multipiste audio/vidéo.",
    hero_cta_studio: "Ouvrir le Studio DAW",
    hero_cta_shortcuts: "Raccourcis REAPER (?)",
    quick_jam_title: "Modèles de Session Instantanée",
    quick_jam_desc: "Choisissez un style pour charger pistes, BPM, gamme et effets automatiquement :",
    catalog_title: "Catalogue d'Instruments Ethniques et Aborigènes",
    catalog_subtitle: 'Cliquez sur "Écouter" pour la note fondamentale ou "Envoyer au Studio".',
    guide_title: "Guide Rapide : Jam Room en 3 Étapes",
    guide_step1_title: "Configurez la Salle et la Gamme",
    guide_step1_desc: "Définissez le BPM, activez le métronome (Touche C) et choisissez votre gamme microtonale.",
    guide_step2_title: "Enregistrement Multipiste et Vidéo",
    guide_step2_desc: "Dessinez dans le Piano Roll, jouez au clavier PC ou enregistrez micro et caméra Tiny Desk.",
    guide_step3_title: "Mixez, Masterisez et Exportez",
    guide_step3_desc: "Réglez Pan, Solo/Mute, Auto-Wah, Flanger, Réverb à convolution (-0.3 dBFS) et exportez en WAV."
  }
};

// 2. SEED DATA INTEGRADO (30 INSTRUMENTOS + 11 ESTILOS MUSICALES)
const DEFAULT_SEED_DATA = {
  instrumentos: [
    { id: 1, nombre: "Trompe (Arpa de Boca)", categoria: "Aborígenes", origen_cultural: "Mapuche / Sur de Chile", nota_raiz: "D3", timbre: "jawharp", envolvente_adsr: { attack: 0.01, decay: 0.25, sustain: 0.6, release: 0.3 }, descripcion_corta: "Idiófono metálico de armónicos vibrantes, ideal para ritmos hipnóticos y funk psicodélico." },
    { id: 2, nombre: "Kultrún", categoria: "Aborígenes", origen_cultural: "Mapuche / Chile-Argentina", nota_raiz: "G2", timbre: "drum_deep", envolvente_adsr: { attack: 0.005, decay: 0.35, sustain: 0.1, release: 0.4 }, descripcion_corta: "Tambor ceremonial de madera y cuero con resonancia profunda y terrosa." },
    { id: 3, nombre: "Trutruka", categoria: "Aborígenes", origen_cultural: "Mapuche / Sur de Chile", nota_raiz: "C3", timbre: "horn_drone", envolvente_adsr: { attack: 0.08, decay: 0.2, sustain: 0.85, release: 0.5 }, descripcion_corta: "Aerófono largo de caña con sonido potente, grave y expresivo." },
    { id: 4, nombre: "Metawe (Cántaro Ceremonial)", categoria: "Aborígenes", origen_cultural: "Mapuche / Sur de Chile", nota_raiz: "G2", timbre: "udu_pot", envolvente_adsr: { attack: 0.008, decay: 0.38, sustain: 0.12, release: 0.3 }, descripcion_corta: "Cántaro de greda ancestral usado como percusión acuática y resonancia terrosa." },
    { id: 5, nombre: "Pifilka", categoria: "Aborígenes", origen_cultural: "Mapuche / Chile-Argentina", nota_raiz: "E5", timbre: "flute_breath", envolvente_adsr: { attack: 0.02, decay: 0.1, sustain: 0.85, release: 0.15 }, descripcion_corta: "Silbato ceremonial de madera tallada con sonido agudo, penetrante y ritual." },
    { id: 6, nombre: "Quena", categoria: "Étnicos", origen_cultural: "Andino (Perú, Bolivia, Chile)", nota_raiz: "G4", timbre: "flute_breath", envolvente_adsr: { attack: 0.04, decay: 0.15, sustain: 0.85, release: 0.25 }, descripcion_corta: "Flauta vertical de caña o hueso con timbre cálido, aireado y melancólico." },
    { id: 7, nombre: "Zampoña (Siku)", categoria: "Étnicos", origen_cultural: "Altiplano Andino", nota_raiz: "E4", timbre: "flute_breath", envolvente_adsr: { attack: 0.03, decay: 0.2, sustain: 0.8, release: 0.3 }, descripcion_corta: "Flauta de pan de doble hilera con ataque soplado característico." },
    { id: 8, nombre: "Charango", categoria: "Tradicionales", origen_cultural: "Andino", nota_raiz: "E4", timbre: "pluck_bright", envolvente_adsr: { attack: 0.005, decay: 0.4, sustain: 0.2, release: 0.35 }, descripcion_corta: "Instrumento de 10 cuerdas con timbre brillante y percusivo." },
    { id: 9, nombre: "Bombo Legüero", categoria: "Tradicionales", origen_cultural: "Folclore Argentino / Norte de Chile", nota_raiz: "E2", timbre: "drum_deep", envolvente_adsr: { attack: 0.004, decay: 0.42, sustain: 0.08, release: 0.35 }, descripcion_corta: "Tambor tradicional de tronco hueco y parche de cuero con grave profundo." },
    { id: 10, nombre: "Ocarina de Barro", categoria: "Étnicos", origen_cultural: "Mesoamérica / Andino", nota_raiz: "C5", timbre: "flute_warm", envolvente_adsr: { attack: 0.03, decay: 0.15, sustain: 0.85, release: 0.25 }, descripcion_corta: "Flauta globular ancestral de arcilla con timbre dulce y evocador." },
    { id: 11, nombre: "Cuatro Venezolano", categoria: "Tradicionales", origen_cultural: "Venezuela / Colombia", nota_raiz: "A3", timbre: "pluck_bright", envolvente_adsr: { attack: 0.004, decay: 0.35, sustain: 0.2, release: 0.3 }, descripcion_corta: "Guitarra pequeña de cuatro cuerdas con ataque rítmico brillante." },
    { id: 12, nombre: "Didgeridoo", categoria: "Aborígenes", origen_cultural: "Aborigen Australiano", nota_raiz: "C2", timbre: "horn_drone", envolvente_adsr: { attack: 0.06, decay: 0.3, sustain: 0.9, release: 0.6 }, descripcion_corta: "Trompeta natural de eucalipto con bordón grave continuo y ricos armónicos." },
    { id: 13, nombre: "Kalimba (Mbira)", categoria: "Étnicos", origen_cultural: "África Subsahariana", nota_raiz: "C4", timbre: "kalimba_bell", envolvente_adsr: { attack: 0.002, decay: 0.5, sustain: 0.15, release: 0.45 }, descripcion_corta: "Piano de pulgar con lengüetas metálicas de sonido dulce y cristalino." },
    { id: 14, nombre: "Djembe", categoria: "Étnicos", origen_cultural: "África Occidental", nota_raiz: "A2", timbre: "drum_slap", envolvente_adsr: { attack: 0.003, decay: 0.28, sustain: 0.05, release: 0.25 }, descripcion_corta: "Tambor de copa tallado en madera con graves profundos y galletas agudas." },
    { id: 15, nombre: "Balafón", categoria: "Étnicos", origen_cultural: "África Occidental (Malí)", nota_raiz: "C4", timbre: "kalimba_bell", envolvente_adsr: { attack: 0.004, decay: 0.45, sustain: 0.15, release: 0.35 }, descripcion_corta: "Xilófono tradicional africano con resonadores de calabaza." },
{ id: 16, nombre: "Udú (Udu Drum)", categoria: "Étnicos", origen_cultural: "Nigeria (Pueblo Igbo)", nota_raiz: "F2", timbre: "udu_pot", envolvente_adsr: { attack: 0.005, decay: 0.4, sustain: 0.1, release: 0.35 }, descripcion_corta: "Vasija de barro percutida con sonido líquido, grave y resonante." },
{ id: 17, nombre: "Kora", categoria: "Étnicos", origen_cultural: "África Occidental (Mandinga)", nota_raiz: "F3", timbre: "pluck_warm", envolvente_adsr: { attack: 0.006, decay: 0.5, sustain: 0.25, release: 0.45 }, descripcion_corta: "Arpa-laúd africana de 21 cuerdas con resonancia cristalina." },
{ id: 18, nombre: "Berimbau", categoria: "Étnicos", origen_cultural: "Afrobrasileño (Bahía)", nota_raiz: "G2", timbre: "jawharp", envolvente_adsr: { attack: 0.01, decay: 0.45, sustain: 0.35, release: 0.4 }, descripcion_corta: "Arco musical de una cuerda con timbre metálico hipnótico." },
{ id: 19, nombre: "Sitar", categoria: "Étnicos", origen_cultural: "India", nota_raiz: "D3", timbre: "sitar_buzz", envolvente_adsr: { attack: 0.015, decay: 0.6, sustain: 0.45, release: 0.7 }, descripcion_corta: "Laúd clásico indio con cuerdas simpáticas de cola armónica envolvente." },
{ id: 20, nombre: "Tabla (Baya y Dayan)", categoria: "Étnicos", origen_cultural: "India", nota_raiz: "C3", timbre: "drum_slap", envolvente_adsr: { attack: 0.004, decay: 0.3, sustain: 0.1, release: 0.25 }, descripcion_corta: "Par de tambores de mano capaces de producir tonos melódicos modulables." },
{ id: 21, nombre: "Koto", categoria: "Étnicos", origen_cultural: "Japón", nota_raiz: "D4", timbre: "pluck_warm", envolvente_adsr: { attack: 0.008, decay: 0.55, sustain: 0.25, release: 0.5 }, descripcion_corta: "Cítara tradicional japonesa de 13 cuerdas con timbre sedoso." },
{ id: 22, nombre: "Shakuhachi", categoria: "Étnicos", origen_cultural: "Japón", nota_raiz: "D4", timbre: "flute_breath", envolvente_adsr: { attack: 0.06, decay: 0.2, sustain: 0.85, release: 0.35 }, descripcion_corta: "Flauta vertical de bambú con gran expresividad de soplo." },
{ id: 23, nombre: "Erhu", categoria: "Étnicos", origen_cultural: "China", nota_raiz: "D4", timbre: "bowed_warm", envolvente_adsr: { attack: 0.08, decay: 0.2, sustain: 0.9, release: 0.4 }, descripcion_corta: "Violín tradicional chino de dos cuerdas con timbre cercano a la voz." },
{ id: 24, nombre: "Duduk", categoria: "Étnicos", origen_cultural: "Armenia / Cáucaso", nota_raiz: "A3", timbre: "flute_warm", envolvente_adsr: { attack: 0.09, decay: 0.2, sustain: 0.9, release: 0.45 }, descripcion_corta: "Instrumento de madera de albaricoque, cálido y vocal." },
{ id: 25, nombre: "Oud (Laúd Árabe)", categoria: "Tradicionales", origen_cultural: "Medio Oriente / Norte de África", nota_raiz: "D3", timbre: "pluck_warm", envolvente_adsr: { attack: 0.008, decay: 0.5, sustain: 0.3, release: 0.4 }, descripcion_corta: "Laúd sin trastes que permite microtonos y ornamentos expresivos." },
{ id: 26, nombre: "Hang Drum (Handpan)", categoria: "Étnicos", origen_cultural: "Suiza / Fusión Global", nota_raiz: "D3", timbre: "kalimba_bell", envolvente_adsr: { attack: 0.015, decay: 0.7, sustain: 0.4, release: 0.65 }, descripcion_corta: "Idiófono metálico melódico de armónicos etéreos." },
{ id: 27, nombre: "Gaita Gallega / Celta", categoria: "Tradicionales", origen_cultural: "Europa Atlántica", nota_raiz: "C4", timbre: "horn_drone", envolvente_adsr: { attack: 0.04, decay: 0.15, sustain: 0.95, release: 0.25 }, descripcion_corta: "Aerófono tradicional de fuelle con timbre potente." },
{ id: 28, nombre: "Bongó", categoria: "Tradicionales", origen_cultural: "Afrocubano / Caribe", nota_raiz: "C4", timbre: "drum_slap", envolvente_adsr: { attack: 0.002, decay: 0.2, sustain: 0.05, release: 0.18 }, descripcion_corta: "Par de tambores pequeños esenciales para síncopas y funk." },
{ id: 29, nombre: "Cajón Peruano", categoria: "Tradicionales", origen_cultural: "Afroperuano", nota_raiz: "F2", timbre: "drum_slap", envolvente_adsr: { attack: 0.002, decay: 0.22, sustain: 0.05, release: 0.2 }, descripcion_corta: "Instrumento de percusión de madera con graves secos." },
{ id: 30, nombre: "Contrabajo Pizzicato", categoria: "Tradicionales", origen_cultural: "Acústico / Jazz", nota_raiz: "E1", timbre: "bass_upright", envolvente_adsr: { attack: 0.01, decay: 0.45, sustain: 0.3, release: 0.35 }, descripcion_corta: "Base grave acústica con cuerpo orgánico." }
],
estilos_musicales: [
{ id: 1, nombre: "Funk Psicodélico Étnico", bpm_base: 105, escala_cuantizacion: "Mixolidia", compas: "4/4", swing_porcentaje: 25, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8d", reverb: "Sala" }, plantilla_pistas: ["Trompe (Arpa de Boca)", "Bongó", "Contrabajo Pizzicato"] },
{ id: 2, nombre: "Free Jazz Tribal", bpm_base: 148, escala_cuantizacion: "Cromática", compas: "4/4", swing_porcentaje: 15, fx_sugeridos: { autowah: false, flanger: false, delay: "off", reverb: "Cueva" }, plantilla_pistas: ["Bongó", "Contrabajo Pizzicato", "Didgeridoo"] },
{ id: 3, nombre: "Fusión Andina Electrónica", bpm_base: 118, escala_cuantizacion: "Pentatónica Menor", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Quena", "Charango", "Kultrún"] },
{ id: 4, nombre: "Trance Aborigen / Ritual", bpm_base: 92, escala_cuantizacion: "Frigia", compas: "6/8", swing_porcentaje: 10, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8", reverb: "Templo" }, plantilla_pistas: ["Didgeridoo", "Kultrún", "Trutruka"] },
{ id: 5, nombre: "Ambient Orgánico Tiny Desk", bpm_base: 80, escala_cuantizacion: "Dórica", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: false, flanger: false, delay: "1/4", reverb: "Sala" }, plantilla_pistas: ["Kalimba (Mbira)", "Koto", "Cajón Peruano"] },
{ id: 6, nombre: "Afro-Psychedelic Groove", bpm_base: 112, escala_cuantizacion: "Pentatónica Mayor", compas: "4/4", swing_porcentaje: 20, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8d", reverb: "Sala" }, plantilla_pistas: ["Balafón", "Udú (Udu Drum)", "Kora"] },
{ id: 7, nombre: "Fusión Mapuche-Ambient (Wallmapu)", bpm_base: 76, escala_cuantizacion: "Pentatónica Menor", compas: "6/8", swing_porcentaje: 5, fx_sugeridos: { autowah: false, flanger: false, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Metawe (Cántaro Ceremonial)", "Pifilka", "Trompe (Arpa de Boca)", "Kultrún"] },
{ id: 8, nombre: "Dub / Reggae Étnico", bpm_base: 84, escala_cuantizacion: "Dórica", compas: "4/4", swing_porcentaje: 18, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8d", reverb: "Templo" }, plantilla_pistas: ["Udú (Udu Drum)", "Kalimba (Mbira)", "Contrabajo Pizzicato"] },
{ id: 9, nombre: "Jazz Oriental / Maqam Fusión", bpm_base: 126, escala_cuantizacion: "Maqam Hijaz", compas: "7/8", swing_porcentaje: 12, fx_sugeridos: { autowah: false, flanger: false, delay: "1/8", reverb: "Sala" }, plantilla_pistas: ["Oud (Laúd Árabe)", "Duduk", "Tabla (Baya y Dayan)"] },
{ id: 10, nombre: "Folclore Progresivo Suramericano", bpm_base: 98, escala_cuantizacion: "Pentatónica Menor", compas: "3/4", swing_porcentaje: 8, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Bombo Legüero", "Charango", "Quena", "Ocarina de Barro"] },
{ id: 11, nombre: "Celta / Folk Psicodélico", bpm_base: 120, escala_cuantizacion: "Mixolidia", compas: "6/8", swing_porcentaje: 15, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8", reverb: "Cueva" }, plantilla_pistas: ["Gaita Gallega / Celta", "Hang Drum (Handpan)", "Bongó"] }
]
};
// 3. ESCALAS ÉTNICAS Y MICROTONALES (Desviaciones en Cents respecto a 12-TET)
const toScaleSet = str => new Set(str.split(",").map(Number));

const SCALES_MAP = {
  "Cromática": { intervals: toScaleSet("0,1,2,3,4,5,6,7,8,9,10,11"), cents: {} },
  "Pentatónica Menor": { intervals: toScaleSet("0,3,5,7,10"), cents: {} },
  "Pentatónica Mayor": { intervals: toScaleSet("0,2,4,7,9"), cents: {} },
  "Mixolidia": { intervals: toScaleSet("0,2,4,5,7,9,10"), cents: {} },
  "Dórica": { intervals: toScaleSet("0,2,3,5,7,9,10"), cents: {} },
  "Frigia": { intervals: toScaleSet("0,1,3,5,7,8,10"), cents: {} },
  "Maqam Hijaz": { intervals: toScaleSet("0,1,4,5,7,8,10"), cents: { 1: -15, 4: 10, 8: -10 } },
  "Raga Bhairav": { intervals: toScaleSet("0,1,4,5,7,8,11"), cents: { 1: -20, 8: -15 } },
  "Pelog": { intervals: toScaleSet("0,1,3,7,8"), cents: { 1: 25, 3: -18, 8: 15 } }
};


// 4. ESTADO GLOBAL DEL ESTUDIO DAW
let state = {
  lang: "es",
  catalog: JSON.parse(JSON.stringify(DEFAULT_SEED_DATA)),
  bpm: 105,
  gridSnap: 0.25,
  swing: 0,
  scale: "Cromática",
  baseTuning: 440,
  baseOctave: 3,
  isPlaying: false,
  isRecordingMidi: false,
  isLooping: false,
  isMetronomeOn: false,
  currentStep: 0,
  totalSteps: 64, // 4 compases de 16 semicorcheas
  tracks: [],
  activeTrackId: null,
  micClips: [],
  activeVideoCam: 0,
  videoStreams: [null, null, null],
  mediaRecorders: [null, null, null]
};

// 5. MOTOR DE AUDIO WEB AUDIO API + BUS MASTER + FX RACK
let audioCtx = null;
let masterGain = null;
let masterLimiter = null;
let masterAnalyser = null;
let convolverNode = null;
let reverbGain = null;
let delayNode = null;
let delayFeedback = null;
let delayGain = null;
let autoWahFilter = null;
let flangerDelay = null;
let flangerLfo = null;
let flangerGain = null;
let schedulerTimer = null;

function initAudioEngine() {
  if (audioCtx) {
    if (audioCtx.state === "suspended") audioCtx.resume();
    return;
  }
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContextClass();

  // Bus de entrada FX -> AutoWah -> Flanger -> Parallel (Dry + Reverb + Delay) -> Limiter (-0.3 dBFS) -> Master
  autoWahFilter = audioCtx.createBiquadFilter();
  autoWahFilter.type = "allpass";
  autoWahFilter.frequency.value = 1000;

  flangerDelay = audioCtx.createDelay(0.05);
  flangerDelay.delayTime.value = 0.005;
  flangerGain = audioCtx.createGain();
  flangerGain.gain.value = 0;

  flangerLfo = audioCtx.createOscillator();
  flangerLfo.type = "sine";
  flangerLfo.frequency.value = 0.35;
  const lfoDepth = audioCtx.createGain();
  lfoDepth.gain.value = 0.003;
  flangerLfo.connect(lfoDepth);
  lfoDepth.connect(flangerDelay.delayTime);
  flangerLfo.start();

  // Convolución algorítmica (Impulse Response)
  convolverNode = audioCtx.createConvolver();
  convolverNode.buffer = createImpulseResponse(1.6, 2.5);
  reverbGain = audioCtx.createGain();
  reverbGain.gain.value = 0.25;

  // Delay sincronizado
  delayNode = audioCtx.createDelay(2.0);
  delayNode.delayTime.value = (60 / state.bpm) * 0.75;
  delayFeedback = audioCtx.createGain();
  delayFeedback.gain.value = 0.35;
  delayGain = audioCtx.createGain();
  delayGain.gain.value = 0.15;

  delayNode.connect(delayFeedback);
  delayFeedback.connect(delayNode);

  // Limitador Brickwall Master (-0.3 dBFS)
  masterLimiter = audioCtx.createDynamicsCompressor();
  masterLimiter.threshold.value = -0.3;
  masterLimiter.knee.value = 0.0;
  masterLimiter.ratio.value = 20.0;
  masterLimiter.attack.value = 0.001;
  masterLimiter.release.value = 0.08;

  masterGain = audioCtx.createGain();
  masterGain.gain.value = 0.9;

  masterAnalyser = audioCtx.createAnalyser();
  masterAnalyser.fftSize = 256;

  // Enrutamiento
  autoWahFilter.connect(flangerDelay);
  flangerDelay.connect(flangerGain);

  autoWahFilter.connect(masterLimiter);
  flangerGain.connect(masterLimiter);

  autoWahFilter.connect(convolverNode);
  convolverNode.connect(reverbGain);
  reverbGain.connect(masterLimiter);

  autoWahFilter.connect(delayNode);
  delayNode.connect(delayGain);
  delayGain.connect(masterLimiter);

  masterLimiter.connect(masterGain);
  masterGain.connect(masterAnalyser);
  masterAnalyser.connect(audioCtx.destination);

  updateMasterFX();
  startVuMeterLoop();
}

function createImpulseResponse(durationSec, decayRate) {
  const rate = audioCtx.sampleRate;
  const length = rate * durationSec;
  const impulse = audioCtx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decayRate);
    }
  }
  return impulse;
}

function updateMasterFX() {
  if (!audioCtx) return;
  const revMix = Number(document.getElementById("fx-reverb-mix").value);
  const revSpace = document.getElementById("fx-reverb-space").value;
  document.getElementById("fx-reverb-val").textContent = `${revMix}%`;
  reverbGain.gain.setTargetAtTime(revMix / 100, audioCtx.currentTime, 0.02);

  const spaceParams = {
    "Sala": [1.2, 3.0],
    "Templo": [3.2, 1.8],
    "Cueva": [2.6, 2.0],
    "Cañón": [4.0, 1.5]
  };
  const [dur, dec] = spaceParams[revSpace] || [1.5, 2.5];
  convolverNode.buffer = createImpulseResponse(dur, dec);

  const delDiv = document.getElementById("fx-delay-div").value;
  const delMix = Number(document.getElementById("fx-delay-mix").value);
  document.getElementById("fx-delay-val").textContent = `${delMix}%`;
  const beatSec = 60 / state.bpm;
  if (delDiv === "off") {
    delayGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.02);
  } else {
    const mult = delDiv === "1/4" ? 1 : delDiv === "1/8" ? 0.5 : 0.75;
    delayNode.delayTime.setTargetAtTime(beatSec * mult, audioCtx.currentTime, 0.02);
    delayGain.gain.setTargetAtTime(delMix / 100, audioCtx.currentTime, 0.02);
  }

  const wahOn = document.getElementById("fx-autowah-on").checked;
  const wahQ = Number(document.getElementById("fx-autowah-q").value);
  autoWahFilter.type = wahOn ? "bandpass" : "allpass";
  autoWahFilter.Q.value = wahQ;

  const flangerOn = document.getElementById("fx-flanger-on").checked;
  const flangerDepth = Number(document.getElementById("fx-flanger-depth").value);
  flangerGain.gain.setTargetAtTime(flangerOn ? (flangerDepth / 100) * 0.7 : 0, audioCtx.currentTime, 0.02);

  const masterVol = Number(document.getElementById("master-volume").value);
  document.getElementById("master-vol-val").textContent = `${masterVol}%`;
  masterGain.gain.setTargetAtTime(masterVol / 100, audioCtx.currentTime, 0.02);
}

function startVuMeterLoop() {
  const dataArray = new Uint8Array(masterAnalyser.frequencyBinCount);
  const vuBar = document.getElementById("master-vu-bar");
  function tick() {
    if (masterAnalyser && vuBar) {
      masterAnalyser.getByteTimeDomainData(dataArray);
      let peak = 0;
      for (let i = 0; i < dataArray.length; i++) {
        const val = Math.abs(dataArray[i] - 128) / 128;
        if (val > peak) peak = val;
      }
      vuBar.style.width = `${Math.min(100, Math.round(peak * 180))}%`;
    }
    requestAnimationFrame(tick);
  }
  tick();
}

// 6. CONVERSIÓN MIDI A FRECUENCIA CON MICROTONALIDAD Y AFINACIÓN LA4
function midiToFreq(midiNote) {
  const scaleObj = SCALES_MAP[state.scale] || SCALES_MAP["Cromática"];
  const semitoneInOctave = midiNote % 12;
  const microCents = scaleObj.cents[semitoneInOctave] || 0;
  const totalSemitones = (midiNote - 69) + (microCents / 100);
  return state.baseTuning * Math.pow(2, totalSemitones / 12);
}

function noteNameToMidi(noteStr) {
  const map = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };
  const match = String(noteStr).match(/^([A-G]#?b?)(\d)$/);
  if (!match) return 60;
  return (parseInt(match[2], 10) + 1) * 12 + (map[match[1]] ?? 0);
}

// 7. SÍNTESIS FÍSICA ORGÁNICA POR TIMBRE ÉTNICO + ADSR
function triggerInstrumentVoice(ctx, destNode, instrument, midiNote, startTime, durationSec, volume = 0.8, pan = 0) {
  const freq = midiToFreq(midiNote);
  const adsr = instrument.envolvente_adsr || { attack: 0.01, decay: 0.3, sustain: 0.5, release: 0.3 };
  const timbre = instrument.timbre || "pluck_warm";

  const envGain = ctx.createGain();
  const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
  if (panner) panner.pan.setValueAtTime(pan, startTime);

  const peakGain = Math.max(0.05, volume * 0.45);
  const sustainLevel = Math.max(0.001, peakGain * adsr.sustain);
  const endAttack = startTime + adsr.attack;
  const endDecay = endAttack + adsr.decay;
  const releaseStart = Math.max(endDecay, startTime + durationSec);
  const endRelease = releaseStart + adsr.release;

  envGain.gain.setValueAtTime(0.0001, startTime);
  envGain.gain.linearRampToValueAtTime(peakGain, endAttack);
  envGain.gain.exponentialRampToValueAtTime(sustainLevel, endDecay);
  envGain.gain.setValueAtTime(sustainLevel, releaseStart);
  envGain.gain.exponentialRampToValueAtTime(0.0001, endRelease);

  if (panner) {
    envGain.connect(panner);
    panner.connect(destNode);
  } else {
    envGain.connect(destNode);
  }

  // Auto-Wah sweep si está encendido
  if (ctx === audioCtx && document.getElementById("fx-autowah-on")?.checked) {
    autoWahFilter.frequency.setValueAtTime(350, startTime);
    autoWahFilter.frequency.exponentialRampToValueAtTime(2400, startTime + 0.14);
    autoWahFilter.frequency.exponentialRampToValueAtTime(500, endRelease);
  }

  // Motor acústico según familia del instrumento
  if (timbre === "drum_deep" || timbre === "drum_slap" || timbre === "udu_pot") {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const startPitch = timbre === "drum_deep" ? freq * 1.8 : timbre === "udu_pot" ? freq * 1.4 : freq * 2.4;
    osc.frequency.setValueAtTime(startPitch, startTime);
    osc.frequency.exponentialRampToValueAtTime(Math.max(38, freq * 0.65), startTime + 0.12);
    osc.connect(envGain);
    osc.start(startTime);
    osc.stop(endRelease + 0.05);
  } else if (timbre === "jawharp" || timbre === "sitar_buzz") {
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    osc1.type = "sawtooth";
    osc2.type = "square";
    osc1.frequency.setValueAtTime(freq, startTime);
    osc2.frequency.setValueAtTime(freq * 1.006, startTime);
    filter.type = "bandpass";
    filter.Q.value = 7;
    filter.frequency.setValueAtTime(freq * 3, startTime);
    filter.frequency.exponentialRampToValueAtTime(freq * 8, startTime + 0.15);
    filter.frequency.exponentialRampToValueAtTime(freq * 2, endRelease);
    osc1.connect(filter);
    osc2.connect(filter);
filter.connect(envGain);
osc1.start(startTime);
osc2.start(startTime);
osc1.stop(endRelease + 0.05);
osc2.stop(endRelease + 0.05);
} else if (timbre === "flute_breath" || timbre === "flute_warm" || timbre === "horn_drone") {
const osc = ctx.createOscillator();
const filter = ctx.createBiquadFilter();
osc.type = timbre === "horn_drone" ? "sawtooth" : "triangle";
osc.frequency.setValueAtTime(freq, startTime);
filter.type = "lowpass";
filter.frequency.setValueAtTime(timbre === "horn_drone" ? freq * 4.5 : freq * 3.2, startTime);
osc.connect(filter);
filter.connect(envGain);
osc.start(startTime);
osc.stop(endRelease + 0.05);
} else {
// Cuerdas pulsadas, Kalimba, Koto, Charango, Contrabajo
const osc = ctx.createOscillator();
const overtone = ctx.createOscillator();
const overGain = ctx.createGain();
osc.type = timbre === "kalimba_bell" ? "sine" : "triangle";
overtone.type = "sine";
osc.frequency.setValueAtTime(freq, startTime);
overtone.frequency.setValueAtTime(freq * 2, startTime);
overGain.gain.value = 0.25;
osc.connect(envGain);
overtone.connect(overGain);
overGain.connect(envGain);
osc.start(startTime);
overtone.start(startTime);
osc.stop(endRelease + 0.05);
overtone.stop(endRelease + 0.05);
}
}
function auditionInstrument(instId) {
initAudioEngine();
const inst = state.catalog.instrumentos.find(i => i.id === instId);
if (!inst) return;
const midi = noteNameToMidi(inst.nota_raiz || "C4");
triggerInstrumentVoice(audioCtx, autoWahFilter, inst, midi, audioCtx.currentTime, 0.55, 0.85, 0);
showToast(`🔊 Audicionando: ${inst.nombre} (${inst.nota_raiz})`);

}
// 8. TRANSPORTE, METRÓNOMO Y SECUENCIADOR MULTIPISTA
function togglePlayPause() {
  initAudioEngine();
  if (state.isPlaying) {
    state.isPlaying = false;
    clearInterval(schedulerTimer);
    pauseAllVideos();
    document.getElementById("btn-play-pause").textContent = "▶ Play";
    document.getElementById("btn-play-pause").classList.remove("active-play");
  } else {
    state.isPlaying = true;
    document.getElementById("btn-play-pause").textContent = "⏸ Pausa";
    document.getElementById("btn-play-pause").classList.add("active-play");
    syncAndPlayVideos();
    startSequencerLoop();
  }
}

function stopTransport() {
  state.isPlaying = false;
  state.isRecordingMidi = false;
  state.currentStep = 0;
  clearInterval(schedulerTimer);
  stopAndResetVideos();
  document.getElementById("btn-play-pause").textContent = "▶ Play";
  document.getElementById("btn-play-pause").classList.remove("active-play");
  document.getElementById("btn-record-midi").classList.remove("active-rec");
  updateTimecodeUI();
  renderPianoRoll();
}

function toggleLoop() {
  state.isLooping = !state.isLooping;
  const btn = document.getElementById("btn-loop");
  btn.textContent = `🔁 Loop: ${state.isLooping ? "ON" : "OFF"}`;
  btn.classList.toggle("active-loop", state.isLooping);
}

function toggleMetronome() {
  state.isMetronomeOn = !state.isMetronomeOn;
  const btn = document.getElementById("btn-metronome");
  btn.textContent = `⏱ Click: ${state.isMetronomeOn ? "ON" : "OFF"}`;
  btn.classList.toggle("active-loop", state.isMetronomeOn);
}

function toggleMidiRecord() {
  initAudioEngine();
  state.isRecordingMidi = !state.isRecordingMidi;
  document.getElementById("btn-record-midi").classList.toggle("active-rec", state.isRecordingMidi);
  if (state.isRecordingMidi && !state.isPlaying) {
    togglePlayPause();
  }
}

function playMetronomeClick(isAccent) {
  if (!audioCtx || !state.isMetronomeOn) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.frequency.value = isAccent ? 1200 : 800;
  gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.05);
  osc.connect(gain);
  gain.connect(masterGain);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.06);
}

function startSequencerLoop() {
  clearInterval(schedulerTimer);
  const stepDurationMs = (60 / state.bpm / 4) * 1000;

  schedulerTimer = setInterval(() => {
    if (!state.isPlaying) return;

    // Metrónomo en negras (pasos 0, 4, 8, 12...)
    if (state.currentStep % 4 === 0) {
      playMetronomeClick(state.currentStep % 16 === 0);
    }

    // Reproducir notas de pistas activas
    const anySolo = state.tracks.some(t => t.solo);
    const stepSec = 60 / state.bpm / 4;

    state.tracks.forEach(track => {
      if (track.muted) return;
      if (anySolo && !track.solo) return;

      const notesAtStep = track.notes.filter(n => n.step === state.currentStep);
      notesAtStep.forEach(n => {
        const inst = state.catalog.instrumentos.find(i => i.id === track.instrumentId) || state.catalog.instrumentos;
        triggerInstrumentVoice(audioCtx, autoWahFilter, inst, n.midi, audioCtx.currentTime, stepSec * (n.len || 1), track.volume, track.pan);
      });
    });

    updateTimecodeUI();
    renderPianoRoll();

    state.currentStep++;
    if (state.currentStep >= state.totalSteps) {
      if (state.isLooping) {
        state.currentStep = 0;
        syncAndPlayVideos();
      } else {
        stopTransport();
      }
    }
  }, stepDurationMs);
}

function updateTimecodeUI() {
  const stepSec = 60 / state.bpm / 4;
  const totalSec = state.currentStep * stepSec;
  const mins = String(Math.floor(totalSec / 60)).padStart(2, "0");
  const secs = (totalSec % 60).toFixed(1).padStart(4, "0");
  const bar = Math.floor(state.currentStep / 16) + 1;
  const beat = Math.floor((state.currentStep % 16) / 4) + 1;
  const sixteenth = (state.currentStep % 4) + 1;
  document.getElementById("transport-timecode").textContent = `${mins}:${secs} | ${bar}.${beat}.${sixteenth}`;
}

// 9. PISTAS (TCP) Y PIANO ROLL CON KONVA.JS
function addNewTrack(instrumentId = null) {
  const inst = instrumentId
    ? state.catalog.instrumentos.find(i => i.id === instrumentId)
    : state.catalog.instrumentos[state.tracks.length % state.catalog.instrumentos.length];

  const newTrack = {
    id: Date.now() + Math.floor(Math.random() * 999),
    name: inst ? inst.nombre : `Pista ${state.tracks.length + 1}`,
    instrumentId: inst ? inst.id : 1,
    volume: 0.85,
    pan: 0,
    muted: false,
    solo: false,
    notes: []
  };
  state.tracks.push(newTrack);
  state.activeTrackId = newTrack.id;
  renderTracksTCP();
  renderPianoRoll();
  return newTrack;
}

function sendInstrumentToStudio(instId) {
  switchView("studio");
  const track = addNewTrack(instId);
  showToast(`🎹 Pista creada: ${track.name}`);
}

function renderTracksTCP() {
  const container = document.getElementById("tracks-list");
  if (!container) return;
  container.innerHTML = "";

  state.tracks.forEach(track => {
    const div = document.createElement("div");
    div.className = `track-tcp ${track.id === state.activeTrackId ? "selected" : ""}`;
    div.onclick = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "BUTTON") return;
      state.activeTrackId = track.id;
      syncTrackADSRSliders();
      renderTracksTCP();
      renderPianoRoll();
    };

    const optionsHtml = state.catalog.instrumentos.map(i =>
      `<option value="${i.id}" ${i.id === track.instrumentId ? "selected" : ""}>${i.nombre}</option>`
    ).join("");

    div.innerHTML = `
      <div class="track-tcp-top">
        <span class="track-name">${track.name}</span>
        <div class="track-ms-btns">
          <button class="ms-btn ${track.muted ? "mute-on" : ""}" onclick="toggleTrackMute(${track.id})" title="Mute (M)">M</button>
          <button class="ms-btn ${track.solo ? "solo-on" : ""}" onclick="toggleTrackSolo(${track.id})" title="Solo">S</button>
          <button class="ms-btn" onclick="deleteTrack(${track.id})" title="Eliminar pista">✕</button>
        </div>
      </div>
      <select class="warm-select full-width" onchange="changeTrackInstrument(${track.id}, this.value)">${optionsHtml}</select>
      <div class="track-sliders">
        <label>Vol: ${Math.round(track.volume * 100)}%
          <input type="range" min="0" max="1" step="0.05" value="${track.volume}" oninput="updateTrackMix(${track.id}, 'volume', this.value)" />
        </label>
        <label>Pan: ${track.pan}
          <input type="range" min="-1" max="1" step="0.1" value="${track.pan}" oninput="updateTrackMix(${track.id}, 'pan', this.value)" />
        </label>
      </div>
    `;
    container.appendChild(div);
  });
}

function toggleTrackMute(id) {
  const t = state.tracks.find(tr => tr.id === id);
  if (t) { t.muted = !t.muted; renderTracksTCP(); }
}

function toggleTrackSolo(id) {
  const t = state.tracks.find(tr => tr.id === id);
  if (t) { t.solo = !t.solo; renderTracksTCP(); }
}

function unmuteAllTracks() {
  state.tracks.forEach(t => t.muted = false);
  renderTracksTCP();
  showToast("🔊 Todas las pistas activadas (Unmute)");
}

function unsoloAllTracks() {
  state.tracks.forEach(t => t.solo = false);
  renderTracksTCP();
  showToast("🎧 Solo desactivado en todas las pistas");
}

function deleteTrack(id) {
  if (state.tracks.length <= 1) return showToast("Debe haber al menos 1 pista en el estudio.");
  state.tracks = state.tracks.filter(t => t.id !== id);
  if (state.activeTrackId === id) state.activeTrackId = state.tracks.id;
  renderTracksTCP();
  renderPianoRoll();
}

function changeTrackInstrument(trackId, instId) {
  const t = state.tracks.find(tr => tr.id === trackId);
  const inst = state.catalog.instrumentos.find(i => i.id === Number(instId));
  if (t && inst) {
    t.instrumentId = inst.id;
    t.name = inst.nombre;
    syncTrackADSRSliders();
    renderTracksTCP();
  }
}

function updateTrackMix(trackId, prop, val) {
  const t = state.tracks.find(tr => tr.id === trackId);
  if (t) t[prop] = Number(val);
}

function syncTrackADSRSliders() {
  const t = state.tracks.find(tr => tr.id === state.activeTrackId);
  const inst = t ? state.catalog.instrumentos.find(i => i.id === t.instrumentId) : null;
  if (!inst || !inst.envolvente_adsr) return;
  document.getElementById("adsr-a").value = inst.envolvente_adsr.attack;
  document.getElementById("adsr-d").value = inst.envolvente_adsr.decay;
  document.getElementById("adsr-s").value = inst.envolvente_adsr.sustain;
  document.getElementById("adsr-r").value = inst.envolvente_adsr.release;
}

function updateTrackADSR() {
  const t = state.tracks.find(tr => tr.id === state.activeTrackId);
  const inst = t ? state.catalog.instrumentos.find(i => i.id === t.instrumentId) : null;
  if (!inst) return;
  inst.envolvente_adsr = {
    attack: Number(document.getElementById("adsr-a").value),
    decay: Number(document.getElementById("adsr-d").value),
    sustain: Number(document.getElementById("adsr-s").value),
    release: Number(document.getElementById("adsr-r").value)
  };
}

function clearActiveTrackNotes() {
  const t = state.tracks.find(tr => tr.id === state.activeTrackId);
  if (t) { t.notes = []; renderPianoRoll(); showToast("🗑 Notas limpiadas"); }
}

function changeOctave(delta) {
  state.baseOctave = Math.max(1, Math.min(6, state.baseOctave + delta));
  document.getElementById("octave-label").textContent = `Octava Base: C${state.baseOctave}`;
  renderPianoRoll();
  renderPcKeyboardVisual();
}

let konvaStage = null;
function renderPianoRoll() {
  const container = document.getElementById("konva-pianoroll");
  if (!container || typeof Konva === "undefined") return;

const activeTrack = state.tracks.find(t => t.id === state.activeTrackId);
const rows = 14; // 14 notas visibles desde baseOctave
const cols = state.totalSteps;
const cellW = 22;
const cellH = 24;
const leftMargin = 54;
const width = leftMargin + cols * cellW;
const height = rows * cellH;
if (!konvaStage) {
konvaStage = new Konva.Stage({ container: "konva-pianoroll", width, height });
} else {
konvaStage.width(width);
konvaStage.height(height);
konvaStage.destroyChildren();
}
const layer = new Konva.Layer();
const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const baseMidi = (state.baseOctave + 1) * 12;
const scaleObj = SCALES_MAP[state.scale] || SCALES_MAP["Cromática"];
for (let r = 0; r < rows; r++) {
const midi = baseMidi + (rows - 1 - r);
const semitone = midi % 12;
const oct = Math.floor(midi / 12) - 1;
const label = `${noteNames[semitone]}${oct}`;

const inScale = scaleObj.intervals.has(semitone);
const y = r * cellH;
// Tecla izquierda
const keyRect = new Konva.Rect({
x: 0, y, width: leftMargin, height: cellH,
fill: inScale ? "#26201c" : "#161210",
stroke: "#3f342c", strokeWidth: 1
});
const keyText = new Konva.Text({
x: 6, y: y + 6, text: label, fontSize: 11,
fontFamily: "JetBrains Mono",
fill: inScale ? "#e88d38" : "#6c5f55"
});
layer.add(keyRect, keyText);
// Celdas de tiempo
for (let c = 0; c < cols; c++) {
const x = leftMargin + c * cellW;
const isBeat = c % 4 === 0;
const cell = new Konva.Rect({
x, y, width: cellW, height: cellH,
fill: inScale ? (isBeat ? "#1f1a16" : "#181411") : "#120f0d",
stroke: isBeat ? "#4a3d33" : "#2a221c",
strokeWidth: 1
});
cell.on("dblclick dbltap", () => {
if (!activeTrack) return;
initAudioEngine();
activeTrack.notes.push({ midi, step: c, len: 2 });
const inst = state.catalog.instrumentos.find(i => i.id === activeTrack.instrumentId) || state.catalog.instrumentos;
triggerInstrumentVoice(audioCtx, autoWahFilter, inst, midi, audioCtx.currentTime, 0.25, activeTrack.volume, activeTrack.pan);
renderPianoRoll();
});
layer.add(cell);
}
// Notas dibujadas en esta fila
if (activeTrack) {
activeTrack.notes.filter(n => n.midi === midi).forEach((noteObj, idx) => {
const nx = leftMargin + noteObj.step * cellW;
const nw = (noteObj.len || 1) * cellW;
const nRect = new Konva.Rect({
x: nx + 1, y: y + 2, width: nw - 2, height: cellH - 4,
fill: "#e88d38", cornerRadius: 4
});
nRect.on("click tap contextmenu", (e) => {
e.evt.preventDefault();
const realIdx = activeTrack.notes.indexOf(noteObj);
if (realIdx > -1) activeTrack.notes.splice(realIdx, 1);
renderPianoRoll();
});
layer.add(nRect);
});
}
}
// Cursor de reproducción
const cursorX = leftMargin + state.currentStep * cellW;
const cursorLine = new Konva.Line({
points: [cursorX, 0, cursorX, height],
stroke: "#589a70", strokeWidth: 2
});
layer.add(cursorLine);
konvaStage.add(layer);
}
// 10. TECLADO PC EN VIVO (A-L) & ATAJOS REAPER
const PC_KEY_MAP = [
  { key: "a", offset: 0, label: "C" },
  { key: "w", offset: 1, label: "C#", black: true },
  { key: "s", offset: 2, label: "D" },
  { key: "e", offset: 3, label: "D#", black: true },
  { key: "d", offset: 4, label: "E" },
  { key: "f", offset: 5, label: "F" },
  { key: "t", offset: 6, label: "F#", black: true },
  { key: "g", offset: 7, label: "G" },
  { key: "y", offset: 8, label: "G#", black: true },
  { key: "h", offset: 9, label: "A" },
  { key: "u", offset: 10, label: "A#", black: true },
  { key: "j", offset: 11, label: "B" },
  { key: "k", offset: 12, label: "C+" }
];

function renderPcKeyboardVisual() {
  const row = document.getElementById("pc-keys-visual");
  if (!row) return;
  row.innerHTML = PC_KEY_MAP.map(k =>
    `<button class="pc-key-btn ${k.black ? "black-key" : ""}" onclick="playLiveNoteOffset(${k.offset})">${k.label}<br><small>[${k.key.toUpperCase()}]</small></button>`
  ).join("");
}

function playLiveNoteOffset(offset) {
  initAudioEngine();
  const activeTrack = state.tracks.find(t => t.id === state.activeTrackId);
  if (!activeTrack) return;
  const midi = (state.baseOctave + 1) * 12 + offset;
  const inst = state.catalog.instrumentos.find(i => i.id === activeTrack.instrumentId) || state.catalog.instrumentos[0];
  triggerInstrumentVoice(audioCtx, autoWahFilter, inst, midi, audioCtx.currentTime, 0.35, activeTrack.volume, activeTrack.pan);

  if (state.isRecordingMidi && state.isPlaying) {
    activeTrack.notes.push({ midi, step: state.currentStep, len: 2 });
    renderPianoRoll();
  }
}

function splitItemAtCursor() {
  const activeTrack = state.tracks.find(t => t.id === state.activeTrackId);
  if (activeTrack) {
    activeTrack.notes.forEach(n => {
      if (n.step < state.currentStep && (n.step + (n.len || 1)) > state.currentStep) {
        const firstLen = state.currentStep - n.step;
        const secondLen = (n.len || 1) - firstLen;
        n.len = firstLen;
        activeTrack.notes.push({ midi: n.midi, step: state.currentStep, len: secondLen });
      }
    });
    renderPianoRoll();
  }
  const nextCam = (state.activeVideoCam + 1) % 3;
  selectActiveVideoTrack(nextCam);
  showToast(`✂ Corte en cursor (Paso ${state.currentStep + 1}) • Cambio a Cam ${nextCam + 1}`);
}

document.addEventListener("keydown", (e) => {
  if (["INPUT", "TEXTAREA", "SELECT"].includes(e.target.tagName)) return;
  if (e.code === "Space") { e.preventDefault(); togglePlayPause(); }
  else if (e.code === "Enter") { e.preventDefault(); stopTransport(); }
  else if (e.altKey && e.key.toLowerCase() === "m") { e.preventDefault(); unmuteAllTracks(); }
  else if (e.altKey && e.key.toLowerCase() === "s") { e.preventDefault(); unsoloAllTracks(); }
  else if (e.key.toLowerCase() === "l") { toggleLoop(); }
  else if (e.key.toLowerCase() === "c") { toggleMetronome(); }
  else if (e.key.toLowerCase() === "m") { if (state.activeTrackId) toggleTrackMute(state.activeTrackId); }
  else {
    const keyObj = PC_KEY_MAP.find(k => k.key === e.key.toLowerCase());
    if (keyObj && !e.repeat) playLiveNoteOffset(keyObj.offset);
  }
});

// 11. GRABACIÓN DE MICRÓFONO ACÚSTICO
let micRecorder = null;
let micChunks = [];

async function startMicRecording() {
  try {
    initAudioEngine();
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    micRecorder = new MediaRecorder(stream);
    micChunks = [];
    micRecorder.ondataavailable = e => { if (e.data.size > 0) micChunks.push(e.data); };
    micRecorder.onstop = () => {
      const blob = new Blob(micChunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      state.micClips.push({ id: Date.now(), name: `Toma Mic #${state.micClips.length + 1}`, url });
      renderMicClips();
      document.getElementById("mic-status-bar").textContent = "Toma guardada con éxito";
    };
    micRecorder.start();
    document.getElementById("btn-mic-rec").disabled = true;
    document.getElementById("btn-mic-stop").disabled = false;
    document.getElementById("mic-status-bar").textContent = "🔴 Grabando micrófono...";
    if (document.getElementById("mic-monitor-tracks").checked && !state.isPlaying) togglePlayPause();
  } catch (err) {
    showToast("⚠ No se pudo acceder al micrófono. Revisa los permisos.");
  }
}

function stopMicRecording() {
  if (micRecorder && micRecorder.state !== "inactive") {
    micRecorder.stop();
    micRecorder.stream.getTracks().forEach(t => t.stop());
  }
  document.getElementById("btn-mic-rec").disabled = false;
  document.getElementById("btn-mic-stop").disabled = true;
}

function renderMicClips() {
  const box = document.getElementById("mic-clips-container");
  box.innerHTML = state.micClips.map(c => `<div class="mic-clip-item"><span>🎙 ${c.name}</span><div><button class="btn-xs btn-secondary-warm" onclick="new Audio('${c.url}').play()">▶</button><a class="btn-xs btn-primary-warm" href="${c.url}" download="${c.name}.webm">⬇</a></div></div>`).join("");
}

// 12. ESTUDIO DE VIDEO TINY DESK (HASTA 3 PISTAS SINCRONIZADAS)
function selectActiveVideoTrack(index) {
  state.activeVideoCam = index;
  document.querySelectorAll(".stage-video").forEach((v, i) => v.classList.toggle("active-cam", i === index));
  document.querySelectorAll(".cam-btn").forEach((b, i) => b.classList.toggle("active", i === index));
}

function toggleTinyDeskFilter(enabled) {
  document.querySelectorAll(".stage-video").forEach(v => v.classList.toggle("tinydesk-lut", enabled));
}

function loadVideoFile(slotIdx, files) {
  if (!files || !files[0]) return;
  const videoEl = document.getElementById(`video-player-${slotIdx + 1}`);
  videoEl.src = URL.createObjectURL(files[0]);
  videoEl.load();
  toggleTinyDeskFilter(document.getElementById("tinydesk-lut-toggle").checked);
  selectActiveVideoTrack(slotIdx);
  showToast(`🎥 Video cargado en Cam ${slotIdx + 1}`);
}

async function toggleWebcamRecord(slotIdx) {
  const videoEl = document.getElementById(`video-player-${slotIdx + 1}`);
  if (state.mediaRecorders[slotIdx] && state.mediaRecorders[slotIdx].state === "recording") {
    state.mediaRecorders[slotIdx].stop();
    state.videoStreams[slotIdx]?.getTracks().forEach(t => t.stop());
    showToast(`⏹ Webcam Cam ${slotIdx + 1} finalizada`);
    return;
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    state.videoStreams[slotIdx] = stream;
    videoEl.srcObject = stream;
    videoEl.play();
    toggleTinyDeskFilter(document.getElementById("tinydesk-lut-toggle").checked);
    selectActiveVideoTrack(slotIdx);

    const chunks = [];
    const rec = new MediaRecorder(stream);
    rec.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
    rec.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      videoEl.srcObject = null;
      videoEl.src = URL.createObjectURL(blob);
    };
    rec.start();
    state.mediaRecorders[slotIdx] = rec;
    showToast(`🔴 Grabando Webcam en Cam ${slotIdx + 1}`);
  } catch (err) {
    showToast("⚠ No se pudo iniciar la cámara web.");
  }
}

function syncAndPlayVideos() {
  const stepSec = 60 / state.bpm / 4;
  const targetTime = state.currentStep * stepSec;
  document.querySelectorAll(".stage-video").forEach(v => {
    if (v.src && !v.srcObject) {
      v.currentTime = targetTime % (v.duration || 60);
      v.play().catch(() => {});
    }
  });
}

function pauseAllVideos() {
  document.querySelectorAll(".stage-video").forEach(v => { if (!v.srcObject) v.pause(); });
}

function stopAndResetVideos() {
  document.querySelectorAll(".stage-video").forEach(v => { if (!v.srcObject) { v.pause(); v.currentTime = 0; } });
}

function updateLowerThird() {
  document.getElementById("lt-artist-name").textContent = document.getElementById("credit-artist-input").value || "Ensamble EthnoReaper";
  document.getElementById("lt-track-info").textContent = document.getElementById("credit-song-input").value || "Sesión en Vivo • Toma 1";
}

// 13. EXPORTACIÓN MAESTRA WAV OFFLINE (16-BIT PCM + COLA DE 2s)
async function exportMasterWav() {
  // Si todas las pistas están vacías, generar patrón musical automático antes de exportar
  const totalNotes = state.tracks.reduce((sum, t) => sum + t.notes.length, 0);
  if (totalNotes === 0) {
    generateGrooveForCurrentTracks();
  }

  showToast("⏳ Renderizando mezcla maestra WAV...");
  const stepSec = 60 / state.bpm / 4;
  const totalDuration = (state.totalSteps * stepSec) + 2.0; // Cola de 2s para reverb/delay
  const sampleRate = 44100;
  const offlineCtx = new OfflineAudioContext(2, Math.ceil(totalDuration * sampleRate), sampleRate);

  const limiter = offlineCtx.createDynamicsCompressor();
  limiter.threshold.value = -0.3;
  limiter.ratio.value = 20;
  limiter.connect(offlineCtx.destination);

  const anySolo = state.tracks.some(t => t.solo);
  state.tracks.forEach(track => {
    if (track.muted || (anySolo && !track.solo)) return;
    const inst = state.catalog.instrumentos.find(i => i.id === track.instrumentId) || state.catalog.instrumentos;
    track.notes.forEach(n => {
      triggerInstrumentVoice(offlineCtx, limiter, inst, n.midi, n.step * stepSec, stepSec * (n.len || 1), track.volume, track.pan);
    });
  });

  const renderedBuffer = await offlineCtx.startRendering();
  const wavBlob = audioBufferToWav(renderedBuffer);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(wavBlob);
  a.download = `EthnoReaper_TinyDesk_${state.bpm}BPM.wav`;
  a.click();
  showToast("✅ Mezcla maestra WAV descargada (-0.3 dBFS)");
}

function generateGrooveForCurrentTracks() {
  const scaleIntervals = Array.from(SCALES_MAP[state.scale]?.intervals || toScaleSet("0,3,5,7,10"));
  state.tracks.forEach((track, idx) => {
    const inst = state.catalog.instrumentos.find(i => i.id === track.instrumentId) || state.catalog.instrumentos;
    const rootMidi = noteNameToMidi(inst?.nota_raiz || "C3");
    track.notes = [];
    for (let step = 0; step < 64; step += 4) {
      if (idx === 0) {
        const deg = scaleIntervals[(step / 4) % scaleIntervals.length];
        track.notes.push({ midi: rootMidi + deg, step, len: 2 });
      } else if (idx === 1) {
        track.notes.push({ midi: rootMidi, step, len: 1 });
        if (step % 8 === 4) track.notes.push({ midi: rootMidi + 5, step: step + 2, len: 1 });
      } else {
        if (step % 8 === 0) track.notes.push({ midi: rootMidi, step, len: 4 });
      }
    }
  });
  renderPianoRoll();
}


function audioBufferToWav(buffer) {
  const numOfChan = buffer.numberOfChannels;
  const length = buffer.length * numOfChan * 2 + 44;
  const out = new ArrayBuffer(length);
  const view = new DataView(out);
  const channels = [];
  let offset = 0, pos = 0;
  const setUint16 = d => { view.setUint16(pos, d, true); pos += 2; };
  const setUint32 = d => { view.setUint32(pos, d, true); pos += 4; };

  setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
  setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
  setUint32(buffer.sampleRate); setUint32(buffer.sampleRate * 2 * numOfChan);
setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164); setUint32(length - pos - 4);
for (let i = 0; i < numOfChan; i++) channels.push(buffer.getChannelData(i));
while (pos < length) {
for (let i = 0; i < numOfChan; i++) {
let sample = Math.max(-1, Math.min(1, channels[i][offset]));
sample = (sample < 0 ? sample * 0x8000 : sample * 0x7FFF) | 0;
view.setInt16(pos, sample, true);
pos += 2;
}
offset++;
}
return new Blob([out], { type: "audio/wav" });
}
// 14. NAVEGACIÓN, ESTILOS MUSICALES, CONEXIÓN RENDER Y MI PANEL
function switchView(viewName) {
  document.querySelectorAll(".view-section").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".nav-btn").forEach(btn => btn.classList.toggle("active", btn.dataset.view === viewName));
  document.getElementById(`view-${viewName}`).classList.add("active");
  if (viewName === "studio") setTimeout(renderPianoRoll, 50);
}

function switchEditorTab(tabName) {
  document.querySelectorAll(".editor-tab").forEach(b => b.classList.toggle("active", b.dataset.tab === tabName));
  document.querySelectorAll(".editor-tab-content").forEach(c => c.classList.remove("active"));
  document.getElementById(`tab-${tabName}`).classList.add("active");
  if (tabName === "pianoroll") renderPianoRoll();
}

function toggleShortcutsModal(show) {
  document.getElementById("shortcuts-modal").classList.toggle("hidden", !show);
}

function setLanguage(lang) {
  state.lang = lang;
  const dict = I18N[lang] || I18N.es;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.innerHTML = dict[key];
  });
}

function updateBpm(val) {
  state.bpm = Math.max(40, Math.min(240, Number(val) || 105));
  document.getElementById("bpm-input").value = state.bpm;
  updateMasterFX();
  if (state.isPlaying) startSequencerLoop();
}

function updateGridSnap(val) { state.gridSnap = Number(val); }
function updateSwing(val) { state.swing = Number(val); }
function updateScale(val) { state.scale = val; renderPianoRoll(); showToast(`🎼 Escala activa: ${val}`); }
function updateBaseTuning(val) { state.baseTuning = Number(val); showToast(`🎛 Afinación La4 = ${val} Hz`); }

function renderCatalog() {
  const query = (document.getElementById("catalog-search")?.value || "").toLowerCase();
  const cat = document.getElementById("catalog-category-filter")?.value || "ALL";
  const grid = document.getElementById("instruments-grid");
  if (!grid) return;

  const filtered = state.catalog.instrumentos.filter(inst => {
    const matchCat = cat === "ALL" || inst.categoria === cat;
    const matchText = inst.nombre.toLowerCase().includes(query) || (inst.origen_cultural || "").toLowerCase().includes(query);
    return matchCat && matchText;
  });

  grid.innerHTML = filtered.map(inst => `
    <article class="inst-card">
      <div>
        <div class="inst-card-top"><h4>${inst.nombre}</h4><span class="inst-badge">${inst.categoria}</span></div>
        <div class="inst-origin">${inst.origen_cultural} • Raíz: ${inst.nota_raiz}</div>
        <p class="inst-desc mt-sm">${inst.descripcion_corta || ""}</p>
      </div>
      <div class="inst-actions">
        <button class="btn-secondary-warm btn-sm" onclick="auditionInstrument(${inst.id})">🔊 Audicionar</button>
        <button class="btn-primary-warm btn-sm" onclick="sendInstrumentToStudio(${inst.id})">+ Al Estudio</button>
      </div>
    </article>`).join("");
}

function renderStylesSelectors() {
  const landingGrid = document.getElementById("landing-styles-grid");
  const studioSelect = document.getElementById("studio-style-select");
  if (landingGrid) {
    landingGrid.innerHTML = state.catalog.estilos_musicales.map(st =>
      `<button class="style-preset-btn" onclick="loadStyleAndOpenStudio(${st.id})"><strong>${st.nombre}</strong><span>${st.bpm_base} BPM • ${st.escala_cuantizacion}</span></button>`
    ).join("");
  }
  if (studioSelect) {
    studioSelect.innerHTML = `<option value="">-- Personalizado --</option>` +
      state.catalog.estilos_musicales.map(st => `<option value="${st.id}">${st.nombre} (${st.bpm_base} BPM)</option>`).join("");
  }
}

function loadStyleAndOpenStudio(styleId) { switchView("studio"); applyMusicalStyle(styleId); }

function applyMusicalStyle(styleId) {
  const st = state.catalog.estilos_musicales.find(s => s.id === Number(styleId));
  if (!st) return;
  document.getElementById("studio-style-select").value = st.id;
  updateBpm(st.bpm_base);
  document.getElementById("swing-input").value = st.swing_porcentaje || 0;
  if (SCALES_MAP[st.escala_cuantizacion]) {
    document.getElementById("scale-select").value = st.escala_cuantizacion;
    updateScale(st.escala_cuantizacion);
  }
  if (st.fx_sugeridos) {
    document.getElementById("fx-autowah-on").checked = !!st.fx_sugeridos.autowah;
    document.getElementById("fx-flanger-on").checked = !!st.fx_sugeridos.flanger;
    if (st.fx_sugeridos.delay) document.getElementById("fx-delay-div").value = st.fx_sugeridos.delay;
    if (st.fx_sugeridos.reverb) document.getElementById("fx-reverb-space").value = st.fx_sugeridos.reverb;
    updateMasterFX();
  }
  if (Array.isArray(st.plantilla_pistas) && st.plantilla_pistas.length > 0) {
    state.tracks = [];
    st.plantilla_pistas.forEach(instName => {
      const found = state.catalog.instrumentos.find(i => i.nombre.toLowerCase().includes(instName.toLowerCase()));
      addNewTrack(found ? found.id : null);
    });
  }
    generateGrooveForCurrentTracks();

  showToast(`✨ Plantilla cargada: ${st.nombre}`);
}

async function syncWithBackend() {
  const pill = document.getElementById("backend-status");
  const text = document.getElementById("backend-status-text");
  try {
    const res = await fetch(`${BACKEND_URL}/api/catalogo`);
    if (!res.ok) throw new Error("Offline");
    const data = await res.json();
    if (data.instrumentos?.length) state.catalog.instrumentos = data.instrumentos;
    if (data.estilos_musicales?.length) state.catalog.estilos_musicales = data.estilos_musicales;
    pill.className = "status-pill status-online";
    text.textContent = "Render Online";
  } catch (e) {
    pill.className = "status-pill status-offline";
    text.textContent = "Modo Local (30 Inst.)";
  }
  renderCatalog();
  renderStylesSelectors();
  if (state.tracks.length === 0) { addNewTrack(1); addNewTrack(2); }
}

async function importMassJson() {
  const raw = document.getElementById("json-import-textarea").value;
  const feedback = document.getElementById("json-import-feedback");
  try {
    const parsed = JSON.parse(raw);
    const res = await fetch(`${BACKEND_URL}/api/catalogo/importar`, {
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed)
    });
    const data = await res.json();
    if (data.catalogo) state.catalog = data.catalogo;
    renderCatalog(); renderStylesSelectors(); renderTracksTCP();
    feedback.textContent = `✅ Importados: ${data.agregadosInstrumentos || 0} instrumentos y ${data.agregadosEstilos || 0} estilos.`;
  } catch (err) {
    feedback.textContent = "⚠ Error: Verifica que el JSON sea válido y que Render esté activo.";
  }
}

function exportFullCatalogJson() {
  const blob = new Blob([JSON.stringify(state.catalog, null, 2)], { type: "application/json" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "EthnoReaper_Catalogo_Respaldo.json";
  a.click();
}

async function searchFreesoundSamples() {
  const q = document.getElementById("freesound-query-input").value;
  const localKey = document.getElementById("freesound-local-key").value.trim();
  const list = document.getElementById("freesound-results-list");
  list.innerHTML = "<p class='muted-text'>Buscando en Freesound...</p>";
  try {
    const url = `${BACKEND_URL}/api/freesound?q=${encodeURIComponent(q)}${localKey ? `&token=${encodeURIComponent(localKey)}` : ""}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.error) throw new Error(data.error);
    list.innerHTML = (data.instruments || []).map(item => `
      <div class="fs-item">
        <div><strong>${item.nombre}</strong><div class="muted-text">${item.duracion}s • Autor: ${item.autor}</div></div>
        <div style="display:flex; gap:0.4rem;">
          <button class="btn-xs btn-secondary-warm" onclick="new Audio('${item.audioUrlMp3}').play()">▶</button>
          <button class="btn-xs btn-primary-warm" onclick='addFreesoundToCatalog(${JSON.stringify(item).replace(/'/g, "&apos;")})'>+ Añadir</button>
        </div>
      </div>`).join("");
  } catch (err) {
    list.innerHTML = `<p class="feedback-msg">⚠ ${err.message}</p>`;
  }
}

async function addFreesoundToCatalog(item) {
  await fetch(`${BACKEND_URL}/api/catalogo/importar`, {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ instrumentos: [{ nombre: item.nombre, categoria: "Étnicos", origen_cultural: `Freesound (${item.autor})`, nota_raiz: "C4", archivo_audio_url: item.audioUrlMp3, descripcion_corta: `Muestra de Freesound (${item.duracion}s).` }] })
  });
  await syncWithBackend();
  showToast(`✅ "${item.nombre}" añadido al catálogo`);
}

async function uploadSf2ToServer() {
  const input = document.getElementById("sf2-file-input");
  const fb = document.getElementById("upload-feedback");
  if (!input.files[0]) return;
  const formData = new FormData();
  formData.append("archivo", input.files[0]);
  fb.textContent = "⏳ Subiendo .sf2 a Render...";
  const res = await fetch(`${BACKEND_URL}/subir-instrumento`, { method: "POST", body: formData });
  const data = await res.json();
  fb.textContent = data.mensaje || data.error;
}

async function uploadSampleToServer() {
  const input = document.getElementById("sample-file-input");
  const fb = document.getElementById("upload-feedback");
  if (!input.files[0]) return;
  const formData = new FormData();
  formData.append("sample", input.files[0]);
  fb.textContent = "⏳ Subiendo sample a Render...";
  const res = await fetch(`${BACKEND_URL}/api/subir-sample`, { method: "POST", body: formData });
  const data = await res.json();
  fb.textContent = data.mensaje ? `✅ ${data.mensaje}` : data.error;
}

async function createNewMusicalStyle() {
  const nombre = document.getElementById("new-style-name").value.trim();
  if (!nombre) return showToast("Escribe un nombre para el estilo");
  await fetch(`${BACKEND_URL}/api/estilos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      nombre,
      bpm_base: Number(document.getElementById("new-style-bpm").value) || 100,
      escala_cuantizacion: document.getElementById("new-style-scale").value,
      plantilla_pistas: document.getElementById("new-style-tracks").value.split(",").map(s => s.trim()).filter(Boolean)
    })
  });
  await syncWithBackend();
  showToast(`🎼 Estilo "${nombre}" guardado`);
}

async function saveCurrentProject() {
  await fetch(`${BACKEND_URL}/api/proyectos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      titulo: document.getElementById("credit-song-input").value || "Sesión Tiny Desk",
      bpm: state.bpm,
      pistas_audio_midi: state.tracks,
      creditos: { artista: document.getElementById("credit-artist-input").value }
    })
  });
  showToast("💾 Sesión guardada en el servidor");
}

function showToast(msg) {
  const container = document.getElementById("toast-container");
  const el = document.createElement("div");
  el.className = "toast-msg";
  el.textContent = msg;
  container.appendChild(el);
  setTimeout(() => el.remove(), 3500);
}

window.addEventListener("DOMContentLoaded", () => {
  renderPcKeyboardVisual();
  syncWithBackend();
});
