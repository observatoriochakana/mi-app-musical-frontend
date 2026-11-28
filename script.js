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

    { id: 1, nombre: "Afro-Cuban Electro-Mambo & Bongó", bpm_base: 115, escala_cuantizacion: "Mixolidia", compas: "4/4", swing_porcentaje: 20, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8", reverb: "Sala" }, plantilla_pistas: ["Bongó", "Cuatro Venezolano", "Contrabajo Pizzicato", "Kalimba (Mbira)"] },
    { id: 2, nombre: "Afro-Dubstep & Kalimba Sub", bpm_base: 140, escala_cuantizacion: "Pentatónica Menor", compas: "4/4", swing_porcentaje: 10, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8d", reverb: "Templo" }, plantilla_pistas: ["Kalimba (Mbira)", "Udú (Udu Drum)", "Djembe", "Contrabajo Pizzicato"] },
    { id: 3, nombre: "Afro-House & Djembe Club", bpm_base: 123, escala_cuantizacion: "Dórica", compas: "4/4", swing_porcentaje: 16, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8", reverb: "Sala" }, plantilla_pistas: ["Djembe", "Balafón", "Bongó", "Contrabajo Pizzicato"] },
    { id: 4, nombre: "Afro-Peruvian Electro-Landó (6/8)", bpm_base: 98, escala_cuantizacion: "Dórica", compas: "6/8", swing_porcentaje: 22, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8d", reverb: "Sala" }, plantilla_pistas: ["Cajón Peruano", "Charango", "Quena", "Contrabajo Pizzicato"] },
    { id: 5, nombre: "Afro-Psychedelic Groove", bpm_base: 112, escala_cuantizacion: "Pentatónica Mayor", compas: "4/4", swing_porcentaje: 20, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8d", reverb: "Sala" }, plantilla_pistas: ["Balafón", "Udú (Udu Drum)", "Kora"] },
    { id: 6, nombre: "Afro-Tech & Balafón Eléctrico", bpm_base: 125, escala_cuantizacion: "Pentatónica Mayor", compas: "4/4", swing_porcentaje: 14, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8", reverb: "Sala" }, plantilla_pistas: ["Balafón", "Djembe", "Kora", "Contrabajo Pizzicato"] },
    { id: 7, nombre: "Amazonian Rainforest Downtempo", bpm_base: 88, escala_cuantizacion: "Pentatónica Mayor", compas: "4/4", swing_porcentaje: 14, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8d", reverb: "Cañón" }, plantilla_pistas: ["Ocarina de Barro", "Udú (Udu Drum)", "Kalimba (Mbira)", "Quena"] },
    { id: 8, nombre: "Ambient Orgánico Tiny Desk", bpm_base: 80, escala_cuantizacion: "Dórica", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: false, flanger: false, delay: "1/4", reverb: "Sala" }, plantilla_pistas: ["Kalimba (Mbira)", "Koto", "Cajón Peruano"] },
    { id: 9, nombre: "Anatolian Psy-Rock & Oud Eléctrico", bpm_base: 114, escala_cuantizacion: "Maqam Hijaz", compas: "4/4", swing_porcentaje: 10, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8d", reverb: "Cueva" }, plantilla_pistas: ["Oud (Laúd Árabe)", "Duduk", "Tabla (Baya y Dayan)", "Contrabajo Pizzicato"] },
    { id: 10, nombre: "Andean Downtempo / Folktrónica", bpm_base: 96, escala_cuantizacion: "Pentatónica Menor", compas: "4/4", swing_porcentaje: 12, fx_sugeridos: { autowah: false, flanger: true, delay: "1/8d", reverb: "Cañón" }, plantilla_pistas: ["Quena", "Charango", "Bombo Legüero", "Contrabajo Pizzicato"] },
    { id: 11, nombre: "Asian Chillhop & Shakuhachi", bpm_base: 88, escala_cuantizacion: "Pelog", compas: "4/4", swing_porcentaje: 22, fx_sugeridos: { autowah: false, flanger: false, delay: "1/8", reverb: "Sala" }, plantilla_pistas: ["Shakuhachi", "Koto", "Erhu", "Cajón Peruano"] },
    { id: 12, nombre: "Atacama Desert Dub & Zampoña", bpm_base: 86, escala_cuantizacion: "Pentatónica Menor", compas: "4/4", swing_porcentaje: 20, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8d", reverb: "Cañón" }, plantilla_pistas: ["Zampoña (Siku)", "Bombo Legüero", "Ocarina de Barro", "Contrabajo Pizzicato"] },
    { id: 13, nombre: "Aymara Synth-Folk (Altiplano 432Hz)", bpm_base: 108, escala_cuantizacion: "Pentatónica Menor", compas: "4/4", swing_porcentaje: 6, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Quena", "Zampoña (Siku)", "Charango", "Bombo Legüero"] },
    { id: 14, nombre: "Balkan Electro-Swing & Gaita", bpm_base: 128, escala_cuantizacion: "Maqam Hijaz", compas: "4/4", swing_porcentaje: 24, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8", reverb: "Sala" }, plantilla_pistas: ["Gaita Gallega / Celta", "Duduk", "Bombo Legüero", "Contrabajo Pizzicato"] },
    { id: 15, nombre: "Capoeira Electro-Breakbeat", bpm_base: 116, escala_cuantizacion: "Mixolidia", compas: "4/4", swing_porcentaje: 16, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8", reverb: "Cueva" }, plantilla_pistas: ["Berimbau", "Djembe", "Bongó", "Contrabajo Pizzicato"] },
    { id: 16, nombre: "Celta / Folk Psicodélico", bpm_base: 120, escala_cuantizacion: "Mixolidia", compas: "6/8", swing_porcentaje: 15, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8", reverb: "Cueva" }, plantilla_pistas: ["Gaita Gallega / Celta", "Hang Drum (Handpan)", "Bongó"] },
    { id: 17, nombre: "Celtic Psy-Trance & Gaita", bpm_base: 136, escala_cuantizacion: "Mixolidia", compas: "6/8", swing_porcentaje: 4, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8d", reverb: "Templo" }, plantilla_pistas: ["Gaita Gallega / Celta", "Trompe (Arpa de Boca)", "Bombo Legüero", "Contrabajo Pizzicato"] },
    { id: 18, nombre: "Chakana Ceremonial Fusion (All-Star)", bpm_base: 100, escala_cuantizacion: "Pentatónica Menor", compas: "4/4", swing_porcentaje: 10, fx_sugeridos: { autowah: false, flanger: true, delay: "1/8d", reverb: "Cañón" }, plantilla_pistas: ["Quena", "Kultrún", "Hang Drum (Handpan)", "Contrabajo Pizzicato"] },
    { id: 19, nombre: "Cumbia Digital Psicodélica", bpm_base: 94, escala_cuantizacion: "Dórica", compas: "4/4", swing_porcentaje: 16, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8d", reverb: "Sala" }, plantilla_pistas: ["Zampoña (Siku)", "Bongó", "Cuatro Venezolano", "Contrabajo Pizzicato"] },
    { id: 20, nombre: "Desert Techno / Maqam Electrónico", bpm_base: 124, escala_cuantizacion: "Maqam Hijaz", compas: "4/4", swing_porcentaje: 6, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8d", reverb: "Templo" }, plantilla_pistas: ["Oud (Laúd Árabe)", "Duduk", "Tabla (Baya y Dayan)", "Contrabajo Pizzicato"] },
    { id: 21, nombre: "Diaguita Clay & Synth Ritual", bpm_base: 90, escala_cuantizacion: "Pentatónica Menor", compas: "6/8", swing_porcentaje: 10, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8d", reverb: "Cueva" }, plantilla_pistas: ["Metawe (Cántaro Ceremonial)", "Ocarina de Barro", "Pifilka", "Kultrún"] },
    { id: 22, nombre: "Dub / Reggae Étnico", bpm_base: 84, escala_cuantizacion: "Dórica", compas: "4/4", swing_porcentaje: 18, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8d", reverb: "Templo" }, plantilla_pistas: ["Udú (Udu Drum)", "Kalimba (Mbira)", "Contrabajo Pizzicato"] },
    { id: 23, nombre: "Electro-Chicha Amazónica", bpm_base: 102, escala_cuantizacion: "Pentatónica Mayor", compas: "4/4", swing_porcentaje: 18, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8d", reverb: "Sala" }, plantilla_pistas: ["Charango", "Bongó", "Cuatro Venezolano", "Contrabajo Pizzicato"] },
    { id: 24, nombre: "Electro-Cueca & Folk Urbano (6/8)", bpm_base: 118, escala_cuantizacion: "Mixolidia", compas: "6/8", swing_porcentaje: 14, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8", reverb: "Sala" }, plantilla_pistas: ["Cuatro Venezolano", "Charango", "Cajón Peruano", "Contrabajo Pizzicato"] },
    { id: 25, nombre: "Electro-Wallmapu (Trutruka Bass)", bpm_base: 110, escala_cuantizacion: "Pentatónica Menor", compas: "6/8", swing_porcentaje: 8, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8d", reverb: "Cañón" }, plantilla_pistas: ["Trutruka", "Trompe (Arpa de Boca)", "Kultrún", "Metawe (Cántaro Ceremonial)"] },
    { id: 26, nombre: "Elqui Cosmic Ambient (432 Hz)", bpm_base: 72, escala_cuantizacion: "Dórica", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Ocarina de Barro", "Hang Drum (Handpan)", "Quena", "Contrabajo Pizzicato"] },
    { id: 27, nombre: "Folclore Progresivo Suramericano", bpm_base: 98, escala_cuantizacion: "Pentatónica Menor", compas: "3/4", swing_porcentaje: 8, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Bombo Legüero", "Charango", "Quena", "Ocarina de Barro"] },
    { id: 28, nombre: "Free Jazz Tribal", bpm_base: 148, escala_cuantizacion: "Cromática", compas: "4/4", swing_porcentaje: 15, fx_sugeridos: { autowah: false, flanger: false, delay: "off", reverb: "Cueva" }, plantilla_pistas: ["Bongó", "Contrabajo Pizzicato", "Didgeridoo"] },
    { id: 29, nombre: "Funk Psicodélico Étnico", bpm_base: 105, escala_cuantizacion: "Mixolidia", compas: "4/4", swing_porcentaje: 25, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8d", reverb: "Sala" }, plantilla_pistas: ["Trompe (Arpa de Boca)", "Bongó", "Contrabajo Pizzicato"] },
    { id: 30, nombre: "Fusión Andina Electrónica", bpm_base: 118, escala_cuantizacion: "Pentatónica Menor", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Quena", "Charango", "Kultrún"] },
    { id: 31, nombre: "Fusión Mapuche-Ambient (Wallmapu)", bpm_base: 76, escala_cuantizacion: "Pentatónica Menor", compas: "6/8", swing_porcentaje: 5, fx_sugeridos: { autowah: false, flanger: false, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Metawe (Cántaro Ceremonial)", "Pifilka", "Trompe (Arpa de Boca)", "Kultrún"] },
    { id: 32, nombre: "Gamelán Glitch & Balafón", bpm_base: 130, escala_cuantizacion: "Pelog", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: false, flanger: true, delay: "1/8", reverb: "Templo" }, plantilla_pistas: ["Balafón", "Kalimba (Mbira)", "Koto", "Udú (Udu Drum)"] },
    { id: 33, nombre: "Jazz Oriental / Maqam Fusión", bpm_base: 126, escala_cuantizacion: "Maqam Hijaz", compas: "7/8", swing_porcentaje: 12, fx_sugeridos: { autowah: false, flanger: false, delay: "1/8", reverb: "Sala" }, plantilla_pistas: ["Oud (Laúd Árabe)", "Duduk", "Tabla (Baya y Dayan)"] },
    { id: 34, nombre: "Kora & Deep Lo-Fi Beats", bpm_base: 82, escala_cuantizacion: "Pentatónica Mayor", compas: "4/4", swing_porcentaje: 28, fx_sugeridos: { autowah: false, flanger: false, delay: "1/8", reverb: "Sala" }, plantilla_pistas: ["Kora", "Balafón", "Cajón Peruano", "Contrabajo Pizzicato"] },
    { id: 35, nombre: "Nordic Shamanic Drone & Gaita", bpm_base: 78, escala_cuantizacion: "Frigia", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Cueva" }, plantilla_pistas: ["Gaita Gallega / Celta", "Didgeridoo", "Bombo Legüero", "Trompe (Arpa de Boca)"] },
    { id: 36, nombre: "Organic House & Handpan", bpm_base: 120, escala_cuantizacion: "Dórica", compas: "4/4", swing_porcentaje: 10, fx_sugeridos: { autowah: false, flanger: false, delay: "1/8d", reverb: "Templo" }, plantilla_pistas: ["Hang Drum (Handpan)", "Udú (Udu Drum)", "Kalimba (Mbira)", "Contrabajo Pizzicato"] },
    { id: 37, nombre: "Paiguano Starlight Ambient (432 Hz)", bpm_base: 68, escala_cuantizacion: "Dórica", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Hang Drum (Handpan)", "Ocarina de Barro", "Quena", "Kora"] },
    { id: 38, nombre: "Patagonia Glacial IDM", bpm_base: 90, escala_cuantizacion: "Pentatónica Menor", compas: "6/8", swing_porcentaje: 8, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Pifilka", "Kultrún", "Trutruka", "Hang Drum (Handpan)"] },
    { id: 39, nombre: "Psy-Trance Tribal & Didgeridoo", bpm_base: 138, escala_cuantizacion: "Frigia", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8", reverb: "Cueva" }, plantilla_pistas: ["Didgeridoo", "Trompe (Arpa de Boca)", "Tabla (Baya y Dayan)", "Contrabajo Pizzicato"] },
    { id: 40, nombre: "Psybient & Sitar Cósmico", bpm_base: 86, escala_cuantizacion: "Raga Bhairav", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Templo" }, plantilla_pistas: ["Sitar", "Tabla (Baya y Dayan)", "Hang Drum (Handpan)"] },
    { id: 41, nombre: "Raga Deep House & Tabla", bpm_base: 122, escala_cuantizacion: "Raga Bhairav", compas: "4/4", swing_porcentaje: 12, fx_sugeridos: { autowah: false, flanger: true, delay: "1/8d", reverb: "Templo" }, plantilla_pistas: ["Sitar", "Tabla (Baya y Dayan)", "Hang Drum (Handpan)", "Contrabajo Pizzicato"] },
    { id: 42, nombre: "Rapa Nui / Polinesia Ocean Ambient", bpm_base: 74, escala_cuantizacion: "Pentatónica Mayor", compas: "4/4", swing_porcentaje: 0, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Cañón" }, plantilla_pistas: ["Hang Drum (Handpan)", "Ocarina de Barro", "Udú (Udu Drum)", "Kora"] },
    { id: 43, nombre: "Shamanic Bass & Metawe Acuático", bpm_base: 95, escala_cuantizacion: "Frigia", compas: "4/4", swing_porcentaje: 15, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8d", reverb: "Cueva" }, plantilla_pistas: ["Metawe (Cántaro Ceremonial)", "Kultrún", "Didgeridoo", "Pifilka"] },
    { id: 44, nombre: "Silk Road Psy-Chill (Erhu & Oud)", bpm_base: 85, escala_cuantizacion: "Pelog", compas: "4/4", swing_porcentaje: 6, fx_sugeridos: { autowah: false, flanger: true, delay: "1/4", reverb: "Templo" }, plantilla_pistas: ["Erhu", "Oud (Laúd Árabe)", "Koto", "Udú (Udu Drum)"] },
    { id: 45, nombre: "Sitar Trap / Global Bass", bpm_base: 132, escala_cuantizacion: "Raga Bhairav", compas: "4/4", swing_porcentaje: 12, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8d", reverb: "Templo" }, plantilla_pistas: ["Sitar", "Tabla (Baya y Dayan)", "Bongó", "Contrabajo Pizzicato"] },
    { id: 46, nombre: "Sufi Trance Techno & Duduk", bpm_base: 127, escala_cuantizacion: "Maqam Hijaz", compas: "4/4", swing_porcentaje: 5, fx_sugeridos: { autowah: false, flanger: true, delay: "1/8d", reverb: "Templo" }, plantilla_pistas: ["Duduk", "Oud (Laúd Árabe)", "Tabla (Baya y Dayan)", "Contrabajo Pizzicato"] },
    { id: 47, nombre: "Tokyo Shamisen & Koto Breaks", bpm_base: 134, escala_cuantizacion: "Pelog", compas: "4/4", swing_porcentaje: 12, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8", reverb: "Sala" }, plantilla_pistas: ["Koto", "Shakuhachi", "Erhu", "Bongó"] },
    { id: 48, nombre: "Trance Aborigen / Ritual", bpm_base: 92, escala_cuantizacion: "Frigia", compas: "6/8", swing_porcentaje: 10, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8", reverb: "Templo" }, plantilla_pistas: ["Didgeridoo", "Kultrún", "Trutruka"] },
    { id: 49, nombre: "Tribal Drum & Bass (Tabla & Didgeridoo)", bpm_base: 172, escala_cuantizacion: "Frigia", compas: "4/4", swing_porcentaje: 5, fx_sugeridos: { autowah: true, flanger: false, delay: "1/8", reverb: "Cueva" }, plantilla_pistas: ["Didgeridoo", "Tabla (Baya y Dayan)", "Trompe (Arpa de Boca)", "Contrabajo Pizzicato"] },
    { id: 50, nombre: "Varanasi Psy-Dub & Sitar", bpm_base: 84, escala_cuantizacion: "Raga Bhairav", compas: "4/4", swing_porcentaje: 16, fx_sugeridos: { autowah: true, flanger: true, delay: "1/8d", reverb: "Templo" }, plantilla_pistas: ["Sitar", "Tabla (Baya y Dayan)", "Udú (Udu Drum)", "Contrabajo Pizzicato"] }

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
  timeSignature: "4/4",
  tracks: [],
  activeTrackId: null,
  micClips: [],
  importedAudioTracks: [],
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
    // SI EL INSTRUMENTO TIENE SAMPLES REALES CARGADOS, USAR MULTISAMPLER AFINADO
  if (Array.isArray(instrument.customSamples) && instrument.customSamples.length > 0 && instrument._decodedBuffers) {
    const validSamples = instrument.customSamples
      .map((s, idx) => ({ ...s, buffer: instrument._decodedBuffers[idx] }))
      .filter(s => s.buffer);

    if (validSamples.length > 0) {
      // Buscar la muestra grabada más cercana a la nota MIDI solicitada
      let closest = validSamples[0];
      let minDiff = Math.abs(midiNote - closest.midi);
      for (const s of validSamples) {
        const diff = Math.abs(midiNote - s.midi);
        if (diff < minDiff) {
          minDiff = diff;
          closest = s;
        }
      }

      const source = ctx.createBufferSource();
      source.buffer = closest.buffer;

      // Ajustar afinación exacta: compensar desviación en cents del instrumento artesanal + distancia MIDI + afinación global Hz
      const targetFreq = midiToFreq(midiNote);
      const ratio = targetFreq / closest.freq;
      source.playbackRate.setValueAtTime(ratio, startTime);

      const adsr = instrument.envolvente_adsr || { attack: 0.01, decay: 0.3, sustain: 0.8, release: 0.35 };
      const envGain = ctx.createGain();
      const panner = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      if (panner) panner.pan.setValueAtTime(pan, startTime);

      const peakGain = Math.max(0.05, volume * 0.9);
      const releaseStart = startTime + Math.max(durationSec, 0.15);
      const endRelease = releaseStart + adsr.release;

      envGain.gain.setValueAtTime(0.0001, startTime);
      envGain.gain.linearRampToValueAtTime(peakGain, startTime + Math.min(adsr.attack, 0.05));
      envGain.gain.setValueAtTime(peakGain, releaseStart);
      envGain.gain.exponentialRampToValueAtTime(0.0001, endRelease);

      source.connect(envGain);
      if (panner) {
        envGain.connect(panner);
        panner.connect(destNode);
      } else {
        envGain.connect(destNode);
      }

      source.start(startTime);
      source.stop(endRelease + 0.05);
      return;
    }
  }

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
    pauseImportedAudios();
    document.getElementById("btn-play-pause").textContent = "▶ Play";
    document.getElementById("btn-play-pause").classList.remove("active-play");
  } else {
    state.isPlaying = true;
    document.getElementById("btn-play-pause").textContent = "⏸ Pausa";
    document.getElementById("btn-play-pause").classList.add("active-play");
    syncAndPlayVideos();
    syncAndPlayImportedAudios();
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
    const anySolo = isAnyTrackSoloed();
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
    const anySolo = isAnyTrackSoloed();
    const div = document.createElement("div");
    const isEffectivelyMuted = track.muted || (anySolo && !track.solo);
    div.className = `track-tcp ${track.id === state.activeTrackId ? "selected" : ""}`;
    div.style.opacity = isEffectivelyMuted ? "0.52" : "1";
    div.onclick = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT" || e.target.tagName === "BUTTON") return;
      state.activeTrackId = track.id;
      syncTrackADSRSliders();
      renderTracksTCP();
      renderPianoRoll();
    };

    const sortedInsts = [...state.catalog.instrumentos].sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    const optionsHtml = sortedInsts.map(i =>

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
  if (!t) return;
  t.muted = !t.muted;
  // Si activas Mute en una pista que estaba en Solo, quita su Solo
  if (t.muted && t.solo) t.solo = false;
  renderTracksTCP(); refreshLiveAudioMuting(); renderImportedAudioList();
  showToast(`${t.muted ? "🔇 Mute ON" : "🔊 Mute OFF"}: ${t.name}`);
}

function toggleTrackSolo(id) {
  const t = state.tracks.find(tr => tr.id === id);
  if (!t) return;
  t.solo = !t.solo;
  // Al activar Solo en una o varias pistas, asegúrate de quitarles Mute
  if (t.solo && t.muted) t.muted = false;
  renderTracksTCP(); refreshLiveAudioMuting(); renderImportedAudioList();
  const soloCount = state.tracks.filter(tr => tr.solo).length;
  showToast(
    t.solo
      ? `🎧 Solo ON: ${t.name} (${soloCount} pista${soloCount > 1 ? "s" : ""} en Solo)`
      : `🎧 Solo OFF: ${t.name}`
  );
}

function unmuteAllTracks() {
  state.tracks.forEach(t => t.muted = false);
  renderTracksTCP();
  showToast("🔊 Todas las pistas activadas (Unmute)");
  state.importedAudioTracks.forEach(a => a.muted = false); 
  refreshLiveAudioMuting(); 
  renderImportedAudioList();
}
function unsoloAllTracks() {
  state.tracks.forEach(t => t.solo = false);
  renderTracksTCP();
  showToast("🎧 Solo desactivado en todas las pistas");
  state.importedAudioTracks.forEach(a => a.solo = false); 
  refreshLiveAudioMuting(); 
  renderImportedAudioList();
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
        micRecorder.onstop = async () => {
      const blob = new Blob(micChunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      const arrayBuffer = await blob.arrayBuffer();
      state.micClips.push({
        id: Date.now(),
        name: `Toma Mic #${state.micClips.length + 1}`,
        url,
        arrayBuffer,
        volume: 0.9,
        muted: false
      });
      renderMicClips();
      document.getElementById("mic-status-bar").textContent = "Toma lista para mezcla y WAV";
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
  box.innerHTML = state.micClips.map(c => `
    <div class="mic-clip-item" style="opacity:${c.muted ? "0.5" : "1"};">
      <span>🎙 ${c.name}</span>
      <div style="display:flex; gap:0.25rem;">
        <button class="btn-xs btn-secondary-warm" onclick="new Audio('${c.url}').play()" title="Escuchar toma">▶</button>
        <button class="ms-btn ${c.muted ? "mute-on" : ""}" onclick="toggleMicClipMute(${c.id})" title="Silenciar en mezcla">M</button>
        <a class="btn-xs btn-primary-warm" href="${c.url}" download="${c.name}.webm" title="Descargar toma suelta">⬇</a>
      </div>
    </div>
  `).join("");
}

function toggleMicClipMute(id) {
  const clip = state.micClips.find(c => c.id === id);
  if (!clip) return;
  clip.muted = !clip.muted;
  renderMicClips();
}

async function importLocalAudioFiles(fileList) {
  if (!fileList || fileList.length === 0) return;
  for (const file of Array.from(fileList)) {
    const url = URL.createObjectURL(file);
    const arrayBuffer = await file.arrayBuffer();
    const audioEl = new Audio(url);
    audioEl.preload = "auto";
    state.importedAudioTracks.push({
      id: Date.now() + Math.floor(Math.random() * 9999),
      name: file.name,
      url,
      arrayBuffer,
      audioEl,
      volume: 0.85,
      muted: false,
      solo: false
    });
  }
  renderImportedAudioList();
  showToast(`📂 ${fileList.length} pista(s) de audio importada(s)`);
}

function isAnyTrackSoloed() {
  return state.tracks.some(t => t.solo) || state.importedAudioTracks.some(a => a.solo);
}

function refreshLiveAudioMuting() {
  const anySolo = isAnyTrackSoloed();
  state.importedAudioTracks.forEach(item => {
    const effectivelyMuted = item.muted || (anySolo && !item.solo);
    item.audioEl.muted = effectivelyMuted;
    item.audioEl.volume = item.volume;
  });
}

function renderImportedAudioList() {
  const container = document.getElementById("imported-audio-list");
  if (!container) return;
  const anySolo = isAnyTrackSoloed();

  container.innerHTML = state.importedAudioTracks.map(item => {
    const isEffectivelyMuted = item.muted || (anySolo && !item.solo);
    return `
    <div class="mic-clip-item" style="flex-direction:column; align-items:stretch; gap:0.3rem; margin-top:0.4rem; opacity:${isEffectivelyMuted ? "0.52" : "1"};">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:130px;" title="${item.name}">🎵 ${item.name}</span>
        <div style="display:flex; gap:0.25rem;">
          <button class="ms-btn ${item.muted ? "mute-on" : ""}" onclick="toggleImportedAudioMute(${item.id})" title="Mute (M)">M</button>
          <button class="ms-btn ${item.solo ? "solo-on" : ""}" onclick="toggleImportedAudioSolo(${item.id})" title="Solo (S)">S</button>
          <button class="ms-btn" onclick="removeImportedAudio(${item.id})" title="Quitar">✕</button>
        </div>
      </div>
      <input type="range" min="0" max="1" step="0.05" value="${item.volume}" oninput="setImportedAudioVolume(${item.id}, this.value)" style="width:100%; accent-color:var(--amber-primary);" />
    </div>`;
  }).join("");
}

function toggleImportedAudioMute(id) {
  const item = state.importedAudioTracks.find(a => a.id === id);
  if (!item) return;
  item.muted = !item.muted;
  if (item.muted && item.solo) item.solo = false;
  refreshLiveAudioMuting();
  renderTracksTCP();
  renderImportedAudioList();
}

function toggleImportedAudioSolo(id) {
  const item = state.importedAudioTracks.find(a => a.id === id);
  if (!item) return;
  item.solo = !item.solo;
  if (item.solo && item.muted) item.muted = false;
  refreshLiveAudioMuting();
  renderTracksTCP();
  renderImportedAudioList();
}

function setImportedAudioVolume(id, val) {
  const item = state.importedAudioTracks.find(a => a.id === id);
  if (!item) return;
  item.volume = Number(val);
  item.audioEl.volume = item.volume;
}

function removeImportedAudio(id) {
  const item = state.importedAudioTracks.find(a => a.id === id);
  if (item) {
    item.audioEl.pause();
    URL.revokeObjectURL(item.url);
  }
  state.importedAudioTracks = state.importedAudioTracks.filter(a => a.id !== id);
  refreshLiveAudioMuting();
  renderTracksTCP();
  renderImportedAudioList();
}

function syncAndPlayImportedAudios() {
  const stepSec = 60 / state.bpm / 4;
  const targetTime = state.currentStep * stepSec;
  refreshLiveAudioMuting();
  state.importedAudioTracks.forEach(item => {
    if (isFinite(item.audioEl.duration) && targetTime < item.audioEl.duration) {
      item.audioEl.currentTime = targetTime;
      item.audioEl.play().catch(() => {});
    } else if (!isFinite(item.audioEl.duration)) {
      item.audioEl.play().catch(() => {});
    }
  });
}

function pauseImportedAudios() {
  state.importedAudioTracks.forEach(item => item.audioEl.pause());
}

function stopAndResetImportedAudios() {
  state.importedAudioTracks.forEach(item => {
    item.audioEl.pause();
    item.audioEl.currentTime = 0;
  });
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

let videoMixRecorder = null;
let videoMixChunks = [];
let videoMixAnimFrame = null;

function toggleTinyDeskVideoExport() {
  const btn = document.getElementById("btn-export-tinydesk-video");
  if (videoMixRecorder && videoMixRecorder.state === "recording") {
    videoMixRecorder.stop();
    cancelAnimationFrame(videoMixAnimFrame);
    btn.textContent = "🎬 Grabar y Exportar Video Tiny Desk (.webm)";
    btn.classList.remove("btn-danger");
    return;
  }

  initAudioEngine();
  const canvas = document.createElement("canvas");
  canvas.width = 1280;
  canvas.height = 720;
  const ctx = canvas.getContext("2d");

  // Conectar el bus master de audio del DAW al stream del video
  const audioDest = audioCtx.createMediaStreamDestination();
  masterGain.connect(audioDest);

  const canvasStream = canvas.captureStream(30);
  const combinedTracks = [
    ...canvasStream.getVideoTracks(),
    ...audioDest.stream.getAudioTracks()
  ];
  const combinedStream = new MediaStream(combinedTracks);

  videoMixChunks = [];
  videoMixRecorder = new MediaRecorder(combinedStream, { mimeType: "video/webm" });
  videoMixRecorder.ondataavailable = e => { if (e.data.size > 0) videoMixChunks.push(e.data); };
  videoMixRecorder.onstop = () => {
    const blob = new Blob(videoMixChunks, { type: "video/webm" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `TinyDesk_EthnoReaper_${Date.now()}.webm`;
    a.click();
    showToast("✅ Video Tiny Desk exportado con audio masterizado");
  };

  // Bucle de renderizado visual (Cámara activa + Filtro Cálido + Lower Third)
  function drawVideoFrame() {
    ctx.fillStyle = "#14110f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const activeVideo = document.getElementById(`video-player-${state.activeVideoCam + 1}`);
    const useLut = document.getElementById("tinydesk-lut-toggle")?.checked;
    ctx.filter = useLut ? "contrast(1.08) saturate(1.18) sepia(0.14) brightness(1.03)" : "none";

    if (activeVideo && (activeVideo.readyState >= 2 || activeVideo.srcObject)) {
      ctx.drawImage(activeVideo, 0, 0, canvas.width, canvas.height);
    } else {
      // Fondo visualizador si no hay cámara conectada
      ctx.fillStyle = "#26201c";
      ctx.fillRect(60, 60, canvas.width - 120, canvas.height - 120);
      ctx.fillStyle = "#e88d38";
      ctx.font = "bold 36px sans-serif";
      ctx.fillText("ETHNOREAPER STUDIO • LIVE SESSION", 110, 340);
    }
    ctx.filter = "none";

    // Dibujar rótulo inferior (Lower Third) estilo Tiny Desk
    const artist = document.getElementById("credit-artist-input")?.value || "Ensamble EthnoReaper";
    const song = document.getElementById("credit-song-input")?.value || "Sesión en Vivo • Toma 1";

    ctx.fillStyle = "rgba(20, 17, 15, 0.86)";
    ctx.fillRect(48, canvas.height - 155, 560, 105);
    ctx.fillStyle = "#e88d38";
    ctx.fillRect(48, canvas.height - 155, 8, 105);

    ctx.font = "bold 15px monospace";
    ctx.fillText("TINY DESK SESSION • LIVE", 72, canvas.height - 126);

    ctx.fillStyle = "#f5efe6";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(artist, 72, canvas.height - 92);

    ctx.fillStyle = "#b8aba0";
    ctx.font = "20px sans-serif";
    ctx.fillText(song, 72, canvas.height - 64);

    if (videoMixRecorder && videoMixRecorder.state === "recording") {
      videoMixAnimFrame = requestAnimationFrame(drawVideoFrame);
    }
  }

  videoMixRecorder.start();
  drawVideoFrame();
  if (!state.isPlaying) togglePlayPause();

  btn.textContent = "⏹ Detener y Descargar Video (.webm)";
  btn.classList.add("btn-danger");
  showToast("🔴 Grabando mezcla de Video + Audio Tiny Desk (cambia cámaras con Cam 1/2/3 o tecla S)");
}

// 13. EXPORTACIÓN MAESTRA WAV OFFLINE (16-BIT PCM + COLA DE 2s)
function generateGrooveForCurrentTracks(isVariation = false) {
  const scaleObj = SCALES_MAP[state.scale] || SCALES_MAP["Pentatónica Menor"];
  const scaleIntervals = Array.from(scaleObj.intervals);
  if (scaleIntervals.length === 0) scaleIntervals.push(0, 3, 5, 7, 10);

  const isCompound68 = state.timeSignature === "6/8" || state.timeSignature === "3/4";
  const isOdd78 = state.timeSignature === "7/8";
  const stepUnit = isCompound68 ? 3 : 4; // Acento ternario en 6/8 vs binario en 4/4

  state.tracks.forEach((track, idx) => {
    const inst = state.catalog.instrumentos.find(i => i.id === track.instrumentId) || state.catalog.instrumentos;
    const rootMidi = noteNameToMidi(inst?.nota_raiz || "C3");
    const isPerc = ["drum_deep", "drum_slap", "udu_pot"].includes(inst?.timbre);
    track.notes = [];

    for (let step = 0; step < state.totalSteps; step += (isCompound68 ? 3 : 2)) {
      if (isPerc || idx === 1) {
        // Patrón rítmico adaptado al compás (6/8 ternario, 7/8 asimétrico, 4/4 binario)
        const isAccent = isCompound68 ? (step % 6 === 0 || step % 6 === 3) : isOdd78 ? (step % 14 === 0 || step % 14 === 6 || step % 14 === 10) : (step % 4 === 0);
        if (isAccent || (isVariation && Math.random() > 0.65)) {
          const offset = (step % (stepUnit * 2) === stepUnit) ? 5 : 0;
          track.notes.push({ midi: rootMidi + offset, step, len: 1 });
        }
      } else if (idx === 0) {
        // Melodía principal en la escala activa
        if (step % stepUnit === 0 || (isVariation && Math.random() > 0.55)) {
          const degIdx = isVariation
            ? Math.floor(Math.random() * scaleIntervals.length)
            : Math.floor(step / stepUnit) % scaleIntervals.length;
          const octBoost = (isVariation && Math.random() > 0.8) ? 12 : 0;
          track.notes.push({ midi: rootMidi + scaleIntervals[degIdx] + octBoost, step, len: isCompound68 ? 3 : 2 });
        }
      } else {
        // Bajo / Bordón grave
        const bassCycle = stepUnit * 2;
        if (step % bassCycle === 0 || (isVariation && step % bassCycle === stepUnit && Math.random() > 0.5)) {
          const deg = (step % (bassCycle * 2) === bassCycle && scaleIntervals.length > 2) ? scaleIntervals[2] : 0;
          track.notes.push({ midi: rootMidi + deg, step, len: stepUnit });
        }
      }
    }
  });

  renderPianoRoll();
  if (isVariation) showToast(`🎲 Nuevo Groove (${state.timeSignature}) generado`);
}

function buildOfflineImpulse(ctx, durationSec, decayRate) {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * durationSec);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decayRate);
    }
  }
  return impulse;
}

async function exportMasterWav() {
  const totalNotes = state.tracks.reduce((sum, t) => sum + t.notes.length, 0);
  const activeMicClips = state.micClips.filter(c => !c.muted && c.arrayBuffer);
  if (totalNotes === 0 && state.importedAudioTracks.length === 0 && activeMicClips.length === 0) {
    generateGrooveForCurrentTracks(false);
  }

  showToast("⏳ Masterizando WAV con Reverb, Delay y Tomas Acústicas...");
  const stepSec = 60 / state.bpm / 4;
  const seqDuration = (state.totalSteps * stepSec) + 2.5;

  const anySolo = isAnyTrackSoloed();
  const activeImported = state.importedAudioTracks.filter(a => !a.muted && (!anySolo || a.solo));
  let maxAudioDuration = seqDuration;
  activeImported.forEach(a => {
    if (isFinite(a.audioEl.duration) && a.audioEl.duration > maxAudioDuration) {
      maxAudioDuration = Math.min(a.audioEl.duration + 1.5, 300);
    }
  });

  const sampleRate = 44100;
  const offlineCtx = new OfflineAudioContext(2, Math.ceil(maxAudioDuration * sampleRate), sampleRate);

  // Bus de mezcla pre-FX
  const fxBus = offlineCtx.createGain();
  fxBus.gain.value = 1.0;

  // Limitador Brickwall Master (-0.3 dBFS)
  const limiter = offlineCtx.createDynamicsCompressor();
  limiter.threshold.value = -0.3;
  limiter.knee.value = 0.0;
  limiter.ratio.value = 20.0;
  limiter.attack.value = 0.001;
  limiter.release.value = 0.08;

  const masterOutGain = offlineCtx.createGain();
  masterOutGain.gain.value = (Number(document.getElementById("master-volume")?.value || 90)) / 100;

  // Señal directa (Dry) -> Limiter
  fxBus.connect(limiter);

  // Reverb de Convolución Offline
  const revMix = Number(document.getElementById("fx-reverb-mix")?.value || 25) / 100;
  if (revMix > 0) {
    const revSpace = document.getElementById("fx-reverb-space")?.value || "Sala";
    const spaceMap = { "Sala": [1.2, 3.0], "Templo": [3.2, 1.8], "Cueva": [2.6, 2.0], "Cañón": [4.0, 1.5] };
    const [dur, dec] = spaceMap[revSpace] || [1.5, 2.5];
    const offlineConv = offlineCtx.createConvolver();
    offlineConv.buffer = buildOfflineImpulse(offlineCtx, dur, dec);
    const offlineRevGain = offlineCtx.createGain();
    offlineRevGain.gain.value = revMix;
    fxBus.connect(offlineConv);
    offlineConv.connect(offlineRevGain);
    offlineRevGain.connect(limiter);
  }

  // Delay Sincronizado Offline
  const delDiv = document.getElementById("fx-delay-div")?.value || "off";
  const delMix = Number(document.getElementById("fx-delay-mix")?.value || 15) / 100;
  if (delDiv !== "off" && delMix > 0) {
    const mult = delDiv === "1/4" ? 1 : delDiv === "1/8" ? 0.5 : 0.75;
    const offlineDelay = offlineCtx.createDelay(2.0);
    offlineDelay.delayTime.value = (60 / state.bpm) * mult;
    const offlineFb = offlineCtx.createGain();
    offlineFb.gain.value = 0.35;
    const offlineDelGain = offlineCtx.createGain();
    offlineDelGain.gain.value = delMix;

    fxBus.connect(offlineDelay);
    offlineDelay.connect(offlineFb);
    offlineFb.connect(offlineDelay);
    offlineDelay.connect(offlineDelGain);
    offlineDelGain.connect(limiter);
  }

  limiter.connect(masterOutGain);
  masterOutGain.connect(offlineCtx.destination);

  // 1. Renderizar pistas de instrumentos étnicos
  state.tracks.forEach(track => {
    if (track.muted || (anySolo && !track.solo)) return;
    const inst = state.catalog.instrumentos.find(i => i.id === track.instrumentId) || state.catalog.instrumentos;
    track.notes.forEach(n => {
      triggerInstrumentVoice(offlineCtx, fxBus, inst, n.midi, n.step * stepSec, stepSec * (n.len || 1), track.volume, track.pan);
    });
  });

  // 2. Renderizar tomas acústicas grabadas con micrófono
  for (const clip of activeMicClips) {
    try {
      const decodedMic = await offlineCtx.decodeAudioData(clip.arrayBuffer.slice(0));
      const src = offlineCtx.createBufferSource();
      const g = offlineCtx.createGain();
      src.buffer = decodedMic;
      g.gain.value = clip.volume || 0.9;
      src.connect(g);
      g.connect(fxBus);
      src.start(0);
    } catch (err) {
      console.warn("Error decodificando toma de micrófono:", err);
    }
  }

  // 3. Renderizar pistas de audio importadas desde el dispositivo
  for (const item of activeImported) {
    try {
      const decodedImp = await offlineCtx.decodeAudioData(item.arrayBuffer.slice(0));
      const src = offlineCtx.createBufferSource();
      const g = offlineCtx.createGain();
      src.buffer = decodedImp;
      g.gain.value = item.volume;
      src.connect(g);
      g.connect(limiter);
      src.start(0);
    } catch (err) {
      console.warn("Error decodificando audio importado:", item.name, err);
    }
  }

  const renderedBuffer = await offlineCtx.startRendering();
  const wavBlob = audioBufferToWav(renderedBuffer);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(wavBlob);
  a.download = `EthnoReaper_Master_${state.bpm}BPM.wav`;
  a.click();
  showToast("✅ Master WAV exportado con FX y Tomas Acústicas (-0.3 dBFS)");
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

  filtered.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));
    grid.innerHTML = filtered.map(inst => {
    const sampleCount = Array.isArray(inst.customSamples) ? inst.customSamples.length : 0;
    const sampleBadge = sampleCount > 0
      ? `<span class="inst-badge" style="background:var(--sage-green); color:#fff;">🎙 ${sampleCount} Sample${sampleCount > 1 ? "s" : ""}</span>`
      : `<span class="inst-badge">${inst.categoria}</span>`;

    return `
    <article class="inst-card">
      <div>
        <div class="inst-card-top"><h4>${inst.nombre}</h4>${sampleBadge}</div>
        <div class="inst-origin">${inst.origen_cultural} • Raíz: ${inst.nota_raiz}</div>
        <p class="inst-desc mt-sm">${inst.descripcion_corta || ""}</p>
      </div>
      <div class="inst-actions" style="gap:0.35rem;">
        <button class="btn-secondary-warm btn-xs" onclick="auditionInstrument(${inst.id})" title="Escuchar nota raíz">🔊 Audicionar</button>
        <button class="btn-secondary-warm btn-xs" onclick="openSamplerModal(${inst.id})" title="Subir audios reales y afinar notas">🎙 Samples</button>
        <button class="btn-primary-warm btn-xs" onclick="sendInstrumentToStudio(${inst.id})" title="Crear pista en el estudio">+ Al Estudio</button>
      </div>
    </article>`;
  }).join("");

}

function renderStylesSelectors() {
  const landingGrid = document.getElementById("landing-styles-grid");
  const studioSelect = document.getElementById("studio-style-select");

  // Asegurar que siempre sea un Array válido
  const rawCatalogStyles = state.catalog?.estilos_musicales;
  const rawDefaultStyles = DEFAULT_SEED_DATA?.estilos_musicales;
  const sourceStyles = Array.isArray(rawCatalogStyles) && rawCatalogStyles.length > 0
    ? rawCatalogStyles
    : (Array.isArray(rawDefaultStyles) ? rawDefaultStyles : Object.values(rawDefaultStyles || {}));

  const sortedStyles = [...sourceStyles]
    .filter(st => st && st.nombre)
    .sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

  if (landingGrid) {
    landingGrid.innerHTML = sortedStyles.map(st =>
      `<button class="style-preset-btn" onclick="loadStyleAndOpenStudio(${st.id})"><strong>${st.nombre}</strong><span>${st.bpm_base} BPM • ${st.escala_cuantizacion}</span></button>`
    ).join("");
  }
  if (studioSelect) {
    const currentVal = studioSelect.value;
    studioSelect.innerHTML = `<option value="">-- Elegir Estilo (${sortedStyles.length}) --</option>` +
      sortedStyles.map(st => `<option value="${st.id}">${st.nombre} (${st.bpm_base} BPM)</option>`).join("");
    if (currentVal) studioSelect.value = currentVal;
  }
}

function cycleMusicalStyle(direction) {
  const select = document.getElementById("studio-style-select");
  if (!select || select.options.length <= 1) return;
  let nextIdx = select.selectedIndex + direction;
  if (nextIdx < 1) nextIdx = select.options.length - 1;
  if (nextIdx >= select.options.length) nextIdx = 1;
  select.selectedIndex = nextIdx;
  applyMusicalStyle(select.value);
}

function loadStyleAndOpenStudio(styleId) { switchView("studio"); applyMusicalStyle(styleId); }

function applyMusicalStyle(styleId) {
  const st = state.catalog.estilos_musicales.find(s => s.id === Number(styleId));
  if (!st) return;
  document.getElementById("studio-style-select").value = st.id;
  updateBpm(st.bpm_base);
  state.timeSignature = st.compas || "4/4";
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

    generateGrooveForCurrentTracks(false);

  showToast(`✨ Plantilla cargada: ${st.nombre}`);
}

function saveCatalogToLocalBackup() {
  try {
    localStorage.setItem("ethnoreaper_custom_catalog", JSON.stringify(state.catalog));
  } catch (e) {}
}

function loadCatalogFromLocalBackup() {
  try {
    const saved = localStorage.getItem("ethnoreaper_custom_catalog");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed.instrumentos) && parsed.instrumentos.length > 0) {
        state.catalog.instrumentos = parsed.instrumentos;
      }
      if (Array.isArray(parsed.estilos_musicales) && parsed.estilos_musicales.length > 0) {
        state.catalog.estilos_musicales = parsed.estilos_musicales;
      }
    }
  } catch (e) {}
}

async function syncWithBackend() {
  loadCatalogFromLocalBackup();
  const pill = document.getElementById("backend-status");
  const text = document.getElementById("backend-status-text");
  try {
    const res = await fetch(`${BACKEND_URL}/api/catalogo`);
    if (!res.ok) throw new Error("Offline");
    const data = await res.json();

    // Fusionar instrumentos de Render que no estén aún en el dispositivo (por nombre)
    if (Array.isArray(data.instrumentos)) {
      data.instrumentos.forEach(remoteInst => {
        const exists = state.catalog.instrumentos.some(
          localInst => localInst.nombre.toLowerCase() === remoteInst.nombre.toLowerCase()
        );
        if (!exists) {
          state.catalog.instrumentos.push(remoteInst);
        }
      });
    }

    if (Array.isArray(data.estilos_musicales) && data.estilos_musicales.length > state.catalog.estilos_musicales.length) {
      state.catalog.estilos_musicales = data.estilos_musicales;
    }

    saveCatalogToLocalBackup();
    pill.className = "status-pill status-online";
    text.textContent = "Render Online";
  } catch (e) {
    pill.className = "status-pill status-offline";
    text.textContent = "Modo Local";
  }
  renderCatalog();
  renderStylesSelectors();
  if (state.tracks.length === 0) { addNewTrack(1); addNewTrack(2); }
}

async function pushInstrumentToCloud(instObj) {
  try {
    const cleanInst = { ...instObj };
    delete cleanInst._decodedBuffers; // No enviar buffers binarios pesados al JSON
    await fetch(`${BACKEND_URL}/api/catalogo/importar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ instrumentos: [cleanInst] })
    });
  } catch (e) {
    console.warn("Sincronización pendiente con Render:", e);
  }
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

// ==========================================================================
// 15. AFINADOR DSP (AUTOCORRELACIÓN), MULTISAMPLER Y NUEVOS INSTRUMENTOS
// ==========================================================================
let currentSamplerInstrumentId = null;

function openSamplerModal(instId) {
  currentSamplerInstrumentId = instId;
  const inst = state.catalog.instrumentos.find(i => i.id === instId);
  if (!inst) return;
  document.getElementById("sampler-modal-title").textContent = `🎙 Samples & Afinador: ${inst.nombre}`;
  document.getElementById("edit-sampler-inst-name").value = inst.nombre;
  document.getElementById("tuner-live-readout").textContent = `Instrumento: ${inst.nombre} • Nota raíz: ${inst.nota_raiz}`;
  document.getElementById("sampler-modal").classList.remove("hidden");
  renderSamplerNotesList();
}

function renderSamplerNotesList() {
  const list = document.getElementById("sampler-notes-list");
  const inst = state.catalog.instrumentos.find(i => i.id === currentSamplerInstrumentId);
  if (!list || !inst) return;

  const samples = inst.customSamples || [];
  if (samples.length === 0) {
    list.innerHTML = `<p class="muted-text">Este instrumento usa síntesis física actualmente. Graba en vivo o sube notas para reemplazarla.</p>`;
    return;
  }

  list.innerHTML = samples.map((s, idx) => `
    <div class="fs-item" style="flex-wrap:wrap;">
      <div>
        <strong>Nota: <span style="color:var(--amber-primary);">${s.noteName}</span> (${s.freq} Hz)</strong>
        <div class="muted-text">${s.fileName} • ${s.cents >= 0 ? "+" : ""}${s.cents} cents</div>
      </div>
      <div style="display:flex; gap:0.35rem; align-items:center; flex-wrap:wrap;">
        <button class="btn-xs btn-secondary-warm" onclick="shiftSampleSemitone(${inst.id}, ${idx}, -1)" title="Bajar 1 semitono">-1 st</button>
        <button class="btn-xs btn-secondary-warm" onclick="shiftSampleSemitone(${inst.id}, ${idx}, 1)" title="Subir 1 semitono">+1 st</button>
        <button class="btn-xs btn-secondary-warm" onclick="editSampleNotePrompt(${inst.id}, ${idx})" title="Escribir nota exacta (ej: D4, F#3)">✏ Nota</button>
        <button class="btn-xs btn-primary-warm" onclick="previewCustomSample(${inst.id}, ${idx})">▶</button>
        <button class="btn-xs btn-danger" onclick="removeSingleCustomSample(${inst.id}, ${idx})">✕</button>
      </div>
    </div>
  `).join("");
}

function shiftSampleSemitone(instId, idx, delta) {
  const inst = state.catalog.instrumentos.find(i => i.id === instId);
  const s = inst?.customSamples?.[idx];
  if (!s) return;
  const newMidi = Math.max(24, Math.min(108, s.midi + delta));
  const newFreq = 440 * Math.pow(2, (newMidi - 69) / 12);
  const info = freqToNoteDetails(newFreq);
  s.midi = info.midi;
  s.noteName = info.noteName;
  s.freq = info.freq;
  s.cents = 0;
  renderSamplerNotesList();
}

function editSampleNotePrompt(instId, idx) {
  const inst = state.catalog.instrumentos.find(i => i.id === instId);
  const s = inst?.customSamples?.[idx];
  if (!s) return;
  const input = prompt(`Escribe la nota correcta para "${s.fileName}" (ej: C3, D#4, G2):`, s.noteName);
  if (!input) return;
  const clean = input.trim().toUpperCase();
  const midi = noteNameToMidi(clean);
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  s.midi = midi;
  s.noteName = clean;
  s.freq = Number(freq.toFixed(2));
  s.cents = 0;
  renderSamplerNotesList();
}

async function saveSamplerAndInstrumentChanges() {
  const inst = state.catalog.instrumentos.find(i => i.id === currentSamplerInstrumentId);
  if (!inst) return;

  const newName = document.getElementById("edit-sampler-inst-name").value.trim();
  if (newName) {
    inst.nombre = newName;
    // Actualizar también las pistas abiertas en el estudio que usen este instrumento
    state.tracks.forEach(t => { if (t.instrumentId === inst.id) t.name = newName; });
  }

  if (Array.isArray(inst.customSamples) && inst.customSamples.length > 0) {
    inst.nota_raiz = inst.customSamples.noteName;
  }

  saveCatalogToLocalBackup();
  renderCatalog();
  renderTracksTCP();
  await pushInstrumentToCloud(inst);
  closeSamplerModal();
  showToast(`💾 Cambios guardados y sincronizados: ${inst.nombre}`);
}

function deleteCurrentSamplerInstrument() {
  const inst = state.catalog.instrumentos.find(i => i.id === currentSamplerInstrumentId);
  if (!inst) return;
  if (!confirm(`¿Seguro que deseas eliminar "${inst.nombre}" del catálogo?`)) return;

  state.catalog.instrumentos = state.catalog.instrumentos.filter(i => i.id !== inst.id);
  saveCatalogToLocalBackup();
  renderCatalog();
  renderTracksTCP();
  closeSamplerModal();
  showToast(`🗑 Instrumento "${inst.nombre}" eliminado`);
}

async function createCustomInstrument() {
  const nombre = document.getElementById("custom-inst-name").value.trim();
  if (!nombre) return showToast("Escribe el nombre del instrumento");

  const newInst = {
    id: Date.now(),
    nombre,
    categoria: document.getElementById("custom-inst-cat").value,
    origen_cultural: document.getElementById("custom-inst-origin").value.trim() || "Artesanal / Personalizado",
    nota_raiz: document.getElementById("custom-inst-root").value.trim().toUpperCase() || "C4",
    timbre: document.getElementById("custom-inst-timbre").value,
    envolvente_adsr: { attack: 0.01, decay: 0.3, sustain: 0.8, release: 0.35 },
    descripcion_corta: document.getElementById("custom-inst-desc").value.trim() || "Instrumento personalizado creado en EthnoReaper Studio.",
    customSamples: []
  };

  state.catalog.instrumentos.push(newInst);
  saveCatalogToLocalBackup();
  renderCatalog();
  renderTracksTCP();
  closeNewInstrumentModal();
  await pushInstrumentToCloud(newInst);
  showToast(`🪕 "${nombre}" guardado y sincronizado en la nube.`);
  openSamplerModal(newInst.id);
}


function closeSamplerModal() {
  document.getElementById("sampler-modal").classList.add("hidden");
  currentSamplerInstrumentId = null;
}

// ==========================================================================
// GRABACIÓN EN VIVO Y SEPARACIÓN AUTOMÁTICA DE SERIE DE NOTAS (AUTO-SLICING)
// ==========================================================================
let samplerStream = null;
let samplerRecorder = null;
let samplerRecChunks = [];
let samplerLiveAnalyser = null;
let samplerTunerLoop = null;

async function toggleSamplerLiveRecording() {
  const btn = document.getElementById("btn-sampler-mic-rec");
  const readout = document.getElementById("tuner-live-readout");

  // SI YA ESTÁ GRABANDO -> DETENER Y PROCESAR SERIE DE NOTAS
  if (samplerRecorder && samplerRecorder.state === "recording") {
    samplerRecorder.stop();
    cancelAnimationFrame(samplerTunerLoop);
    if (samplerStream) samplerStream.getTracks().forEach(t => t.stop());
    btn.textContent = "🔴 Grabar Nota(s) en Vivo";
    readout.textContent = "⏳ Separando notas y analizando afinación de cada una...";
    return;
  }

  // INICIAR GRABACIÓN CON AFINADOR EN TIEMPO REAL
  try {
    initAudioEngine();
    samplerStream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false }
    });

    const micSource = audioCtx.createMediaStreamSource(samplerStream);
    samplerLiveAnalyser = audioCtx.createAnalyser();
    samplerLiveAnalyser.fftSize = 4096;
    micSource.connect(samplerLiveAnalyser);

    samplerRecChunks = [];
    samplerRecorder = new MediaRecorder(samplerStream);
    samplerRecorder.ondataavailable = e => { if (e.data.size > 0) samplerRecChunks.push(e.data); };

    samplerRecorder.onstop = async () => {
      const blob = new Blob(samplerRecChunks, { type: "audio/webm" });
      const arrayBuffer = await blob.arrayBuffer();
      const fullBuffer = await audioCtx.decodeAudioData(arrayBuffer);
      await sliceAndRegisterNotesFromBuffer(fullBuffer, "Toma_Vivo");
    };

    samplerRecorder.start();
    btn.textContent = "⏹ Detener y Reconocer Notas";
    readout.textContent = "🎙 Escuchando... Toca una nota o una serie de notas separadas por una breve pausa.";

    // Bucle de lectura del afinador en tiempo real mientras tocas
    const liveBuf = new Float32Array(samplerLiveAnalyser.fftSize);
    function liveTunerTick() {
      if (!samplerRecorder || samplerRecorder.state !== "recording") return;
      samplerLiveAnalyser.getFloatTimeDomainData(liveBuf);
      let rms = 0;
      for (let i = 0; i < liveBuf.length; i++) rms += liveBuf[i] * liveBuf[i];
      rms = Math.sqrt(rms / liveBuf.length);

      if (rms > 0.015) {
        const fakeAudioBuf = { sampleRate: audioCtx.sampleRate, getChannelData: () => liveBuf };
        const hz = detectPitchHz(fakeAudioBuf);
        const info = freqToNoteDetails(hz);
        readout.textContent = `🔴 GRABANDO | Afinador: ${info.noteName} (${info.freq} Hz | ${info.cents >= 0 ? "+" : ""}${info.cents} cents)`;
      }
      samplerTunerLoop = requestAnimationFrame(liveTunerTick);
    }
    liveTunerTick();
  } catch (err) {
    showToast("⚠ No se pudo acceder al micrófono. Revisa permisos.");
  }
}

// Separa automáticamente una grabación con múltiples notas en clips individuales
function splitAudioBufferIntoNotes(audioBuffer) {
  const sr = audioBuffer.sampleRate;
  const data = audioBuffer.getChannelData(0);
  const hop = Math.floor(sr * 0.02); // Ventanas de 20 ms
  const energies = [];

  for (let i = 0; i < data.length; i += hop) {
    let sum = 0;
    const end = Math.min(i + hop, data.length);
    for (let j = i; j < end; j++) sum += data[j] * data[j];
    energies.push(Math.sqrt(sum / (end - i)));
  }

  const maxEnergy = Math.max(...energies, 0.001);
  const startThresh = Math.max(0.015, maxEnergy * 0.14); // Umbral de ataque de nota
  const stopThresh = Math.max(0.006, maxEnergy * 0.05);  // Umbral de silencio entre notas

  const segments = [];
  let inNote = false;
  let noteStartSample = 0;
  let silenceFrames = 0;
  const minNoteSamples = Math.floor(sr * 0.12);   // Mínimo 120 ms para ser nota válida
  const minSilenceFrames = 6;                      // ~120 ms de pausa separa dos notas

  for (let f = 0; f < energies.length; f++) {
    const e = energies[f];
    if (!inNote && e >= startThresh) {
      inNote = true;
      noteStartSample = Math.max(0, f * hop - Math.floor(sr * 0.015)); // 15 ms de pre-ataque
      silenceFrames = 0;
    } else if (inNote) {
      if (e < stopThresh) {
        silenceFrames++;
        if (silenceFrames >= minSilenceFrames) {
          const noteEndSample = Math.min(data.length, (f - silenceFrames + 2) * hop);
          if (noteEndSample - noteStartSample >= minNoteSamples) {
            segments.push([noteStartSample, noteEndSample]);
          }
          inNote = false;
        }
      } else {
        silenceFrames = 0;
      }
    }
  }

  if (inNote && data.length - noteStartSample >= minNoteSamples) {
    segments.push([noteStartSample, data.length]);
  }

  // Si todo fue continuo sin pausas, devolver el buffer completo como 1 nota
  if (segments.length === 0) {
    segments.push([0, data.length]);
  }

  // Crear un AudioBuffer recortado y normalizado por cada nota detectada
  return segments.map(([start, end]) => {
    const len = end - start;
    const sliceBuf = audioCtx.createBuffer(audioBuffer.numberOfChannels, len, sr);
    const fadeSamples = Math.min(Math.floor(sr * 0.01), Math.floor(len / 4));

    for (let ch = 0; ch < audioBuffer.numberOfChannels; ch++) {
      const srcCh = audioBuffer.getChannelData(ch);
      const dstCh = sliceBuf.getChannelData(ch);
      let peak = 0.001;
      for (let i = 0; i < len; i++) {
        const abs = Math.abs(srcCh[start + i]);
        if (abs > peak) peak = abs;
      }
      const normGain = Math.min(2.5, 0.9 / peak); // Normalizar volumen de cada nota

      for (let i = 0; i < len; i++) {
        let env = 1.0;
        if (i < fadeSamples) env = i / fadeSamples;
        else if (i > len - fadeSamples) env = (len - i) / fadeSamples;
        dstCh[i] = srcCh[start + i] * normGain * env;
      }
    }
    return sliceBuf;
  });
}

async function sliceAndRegisterNotesFromBuffer(fullBuffer, baseLabel) {
  const inst = state.catalog.instrumentos.find(i => i.id === currentSamplerInstrumentId);
  if (!inst) return;
  if (!Array.isArray(inst.customSamples)) inst.customSamples = [];
  if (!Array.isArray(inst._decodedBuffers)) inst._decodedBuffers = [];

  const noteSlices = splitAudioBufferIntoNotes(fullBuffer);
  const readout = document.getElementById("tuner-live-readout");

  noteSlices.forEach((sliceBuf, idx) => {
    const detectedHz = detectPitchHz(sliceBuf);
    const info = freqToNoteDetails(detectedHz);
    const wavBlob = audioBufferToWav(sliceBuf);
    const dataUrl = URL.createObjectURL(wavBlob);

    // Convertir a Base64 para persistencia permanente en localStorage
    const reader = new FileReader();
    reader.onload = () => {
      const sampleObj = inst.customSamples.find(s => s._tempUrl === dataUrl);
      if (sampleObj) {
        sampleObj.dataUrl = reader.result;
        delete sampleObj._tempUrl;
        saveCatalogToLocalBackup();
      }
    };
    reader.readAsDataURL(wavBlob);

    inst.customSamples.push({
      id: Date.now() + idx + Math.floor(Math.random() * 999),
      fileName: `${baseLabel}_Nota${idx + 1}_${info.noteName}.wav`,
      freq: info.freq,
      midi: info.midi,
      noteName: info.noteName,
      cents: info.cents,
      dataUrl,
      _tempUrl: dataUrl
    });
    inst._decodedBuffers.push(sliceBuf);
  });

  if (inst.customSamples.length > 0) {
    inst.nota_raiz = inst.customSamples[0].noteName;
  }

  saveCatalogToLocalBackup();
  renderSamplerNotesList();
  renderCatalog();
  readout.textContent = `✅ ¡${noteSlices.length} nota(s) separada(s) y reconocida(s) automáticamente!`;
  showToast(`🎯 ${noteSlices.length} nota(s) detectada(s) en ${inst.nombre}`);
}

// Algoritmo de detección de frecuencia fundamental (Hz) por Autocorrelación
function detectPitchHz(audioBuffer) {
  const sampleRate = audioBuffer.sampleRate;
  const channel = audioBuffer.getChannelData(0);

  // Buscar ventana donde haya mayor energía (evitar silencio inicial)
  let bestStart = 0;
  let maxRms = 0;
  const winSize = Math.min(4096, Math.floor(channel.length / 2));
  if (winSize < 512) return 440;

  for (let i = 0; i < channel.length - winSize; i += 1024) {
    let sum = 0;
    for (let j = 0; j < winSize; j++) sum += channel[i + j] * channel[i + j];
    const rms = Math.sqrt(sum / winSize);
    if (rms > maxRms) {
      maxRms = rms;
      bestStart = i;
    }
  }

  const buf = channel.slice(bestStart, bestStart + winSize);
  const minPeriod = Math.floor(sampleRate / 1400); // Máx ~1400 Hz
  const maxPeriod = Math.floor(sampleRate / 45);   // Mín ~45 Hz
  let bestPeriod = -1;
  let bestCorr = 0;

  for (let period = minPeriod; period <= maxPeriod; period++) {
    let corr = 0;
    let norm1 = 0;
    let norm2 = 0;
    for (let i = 0; i < winSize - period; i++) {
      corr += buf[i] * buf[i + period];
      norm1 += buf[i] * buf[i];
      norm2 += buf[i + period] * buf[i + period];
    }
    const denom = Math.sqrt(norm1 * norm2);
    const normalizedCorr = denom > 0 ? corr / denom : 0;
    if (normalizedCorr > bestCorr) {
      bestCorr = normalizedCorr;
      bestPeriod = period;
    }
  }

  return bestPeriod > 0 ? sampleRate / bestPeriod : 440;
}

function freqToNoteDetails(freq) {
  const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const midiFloat = 69 + 12 * Math.log2(freq / 440);
  const midiRound = Math.round(midiFloat);
  const cents = Math.round((midiFloat - midiRound) * 100);
  const name = noteNames[((midiRound % 12) + 12) % 12];
  const octave = Math.floor(midiRound / 12) - 1;
  return {
    midi: midiRound,
    noteName: `${name}${octave}`,
    cents,
    freq: Number(freq.toFixed(2))
  };
}

async function handleInstrumentSamplesUpload(fileList) {
  if (!fileList || fileList.length === 0 || !currentSamplerInstrumentId) return;
  initAudioEngine();
  const inst = state.catalog.instrumentos.find(i => i.id === currentSamplerInstrumentId);
  if (!inst) return;

  if (!Array.isArray(inst.customSamples)) inst.customSamples = [];
  if (!Array.isArray(inst._decodedBuffers)) inst._decodedBuffers = [];

  const readout = document.getElementById("tuner-live-readout");
  readout.textContent = "⏳ Analizando frecuencias con el afinador DSP...";

    for (const file of Array.from(fileList)) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
      const cleanName = file.name.replace(/\.[^/.]+$/, "");
      await sliceAndRegisterNotesFromBuffer(decodedBuffer, cleanName);
    } catch (err) {
      readout.textContent = `⚠ Error al procesar ${file.name}`;
    }
  }
}

function renderSamplerNotesList() {
  const list = document.getElementById("sampler-notes-list");
  const inst = state.catalog.instrumentos.find(i => i.id === currentSamplerInstrumentId);
  if (!list || !inst) return;

  const samples = inst.customSamples || [];
  if (samples.length === 0) {
    list.innerHTML = `<p class="muted-text">Este instrumento usa síntesis física actualmente. Sube notas grabadas para reemplazarla con sonido real.</p>`;
    return;
  }

  list.innerHTML = samples.map((s, idx) => `
    <div class="fs-item">
      <div>
        <strong>Nota: ${s.noteName} (${s.freq} Hz)</strong>
        <div class="muted-text">${s.fileName} • Desviación: ${s.cents >= 0 ? "+" : ""}${s.cents} cents</div>
      </div>
      <div style="display:flex; gap:0.4rem; align-items:center;">
        <button class="btn-xs btn-secondary-warm" onclick="previewCustomSample(${inst.id}, ${idx})">▶ Probar</button>
        <button class="btn-xs btn-danger" onclick="removeSingleCustomSample(${inst.id}, ${idx})">✕</button>
      </div>
    </div>
  `).join("");
}

function previewCustomSample(instId, idx) {
  initAudioEngine();
  const inst = state.catalog.instrumentos.find(i => i.id === instId);
  const sample = inst?.customSamples?.[idx];
  if (!sample) return;
  triggerInstrumentVoice(audioCtx, autoWahFilter, inst, sample.midi, audioCtx.currentTime, 0.8, 0.9, 0);
}

function removeSingleCustomSample(instId, idx) {
  const inst = state.catalog.instrumentos.find(i => i.id === instId);
  if (!inst) return;
  inst.customSamples.splice(idx, 1);
  if (inst._decodedBuffers) inst._decodedBuffers.splice(idx, 1);
  saveCatalogToLocalBackup();
  renderSamplerNotesList();
  renderCatalog();
}

function clearInstrumentSamples() {
  const inst = state.catalog.instrumentos.find(i => i.id === currentSamplerInstrumentId);
  if (!inst) return;
  inst.customSamples = [];
  inst._decodedBuffers = [];
  saveCatalogToLocalBackup();
  renderSamplerNotesList();
  renderCatalog();
  document.getElementById("tuner-live-readout").textContent = "Muestras eliminadas. Restaurada síntesis física.";
}

// Rehidratar buffers de audio al cargar desde localStorage
async function rehydrateAllCustomSamples() {
  const decodeCtx = new OfflineAudioContext(1, 1, 44100);
  for (const inst of state.catalog.instrumentos) {
    if (Array.isArray(inst.customSamples) && inst.customSamples.length > 0) {
      inst._decodedBuffers = [];
      for (const s of inst.customSamples) {
        try {
          const res = await fetch(s.dataUrl);
          const arrBuf = await res.arrayBuffer();
          const decBuf = await decodeCtx.decodeAudioData(arrBuf);
          inst._decodedBuffers.push(decBuf);
        } catch (e) {
          inst._decodedBuffers.push(null);
        }
      }
    }
  }
}


// CREACIÓN DE NUEVOS INSTRUMENTOS DESDE EL FRONTEND
function openNewInstrumentModal() {
  document.getElementById("new-inst-modal").classList.remove("hidden");
}

function closeNewInstrumentModal() {
  document.getElementById("new-inst-modal").classList.add("hidden");
}

function createCustomInstrument() {
  const nombre = document.getElementById("custom-inst-name").value.trim();
  if (!nombre) return showToast("Escribe el nombre del instrumento");

  const newInst = {
    id: Date.now(),
    nombre,
    categoria: document.getElementById("custom-inst-cat").value,
    origen_cultural: document.getElementById("custom-inst-origin").value.trim() || "Artesanal / Personalizado",
    nota_raiz: document.getElementById("custom-inst-root").value.trim().toUpperCase() || "C4",
    timbre: document.getElementById("custom-inst-timbre").value,
    envolvente_adsr: { attack: 0.01, decay: 0.3, sustain: 0.8, release: 0.35 },
    descripcion_corta: document.getElementById("custom-inst-desc").value.trim() || "Instrumento personalizado creado en EthnoReaper Studio.",
    customSamples: []
  };

  state.catalog.instrumentos.push(newInst);
  saveCatalogToLocalBackup();
  renderCatalog();
  renderTracksTCP();
  closeNewInstrumentModal();
  showToast(`🪕 "${nombre}" creado. Ahora puedes subirle tus grabaciones.`);
  openSamplerModal(newInst.id);
}


window.addEventListener("DOMContentLoaded", () => {
 rehydrateAllCustomSamples()
 renderCatalog();
  renderStylesSelectors();
  renderPcKeyboardVisual();
  syncWithBackend();
    // Registrar PWA Service Worker
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  }

  // Inicializar Web MIDI API (Teclados / Controladores USB)
  if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess().then(midiAccess => {
      for (const input of midiAccess.inputs.values()) {
        input.onmidimessage = (msg) => {
          const [status, note, velocity] = msg.data;
          if ((status & 0xf0) === 0x90 && velocity > 0) {
            initAudioEngine();
            const activeTrack = state.tracks.find(t => t.id === state.activeTrackId);
            if (!activeTrack) return;
            const inst = state.catalog.instrumentos.find(i => i.id === activeTrack.instrumentId) || state.catalog.instrumentos;
            triggerInstrumentVoice(audioCtx, autoWahFilter, inst, note, audioCtx.currentTime, 0.35, (velocity / 127) * activeTrack.volume, activeTrack.pan);
            if (state.isRecordingMidi && state.isPlaying) {
              activeTrack.notes.push({ midi: note, step: state.currentStep, len: 2 });
              renderPianoRoll();
            }
          }
        };
      }
    }).catch(() => {});
  }

});
