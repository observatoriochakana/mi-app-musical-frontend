// ==========================================
// 1. VARIABLES Y ELEMENTOS DEL HTML
// ==========================================
const botonGrabarPiano = document.getElementById('botonGrabarPiano');
const botonGrabarMicro = document.getElementById('botonGrabarMicro');
const botonDetenerGrabacion = document.getElementById('botonDetenerGrabacion');
const botonLimpiar = document.getElementById('botonLimpiar');
const estadoGrabacion = document.getElementById('estadoGrabacion');
const pianoVirtualContainer = document.getElementById('pianoVirtual');
const botonReproducirMelodia = document.getElementById('botonReproducirMelodia');
const botonExportarAudio = document.getElementById('botonExportarAudio');
const reverbSlider = document.getElementById('reverbSlider');
const delaySlider = document.getElementById('delaySlider');
const flangerSlider = document.getElementById('flangerSlider');
const wahSlider = document.getElementById('wahSlider');
const selectorInstrumentoUsuario = document.getElementById('selectorInstrumentoUsuario');

let notasDetectadas = [];
let grabando = false;
let tiempoInicioGrabacion = 0;
let notasActivas = {}; 

const inicioMidi = 48; 
const finMidi = 72;    
const altoFila = 20;
const pxPorSegundo = 100;

// Variables para Konva (el lienzo)
let konvaStage = null;
let konvaLayer = null;

// Variables para el motor de audio
let audioContextGlobal = null;
let masterGain = null;
let efectoEntrada = null;

// ==========================================
// 2. INICIALIZAR MOTOR DE AUDIO Y EFECTOS
// ==========================================
function inicializarMotorDeAudio() {
    if (audioContextGlobal) return;
    
    audioContextGlobal = new AudioContext();
    masterGain = audioContextGlobal.createGain();
    masterGain.connect(audioContextGlobal.destination);
    efectoEntrada = audioContextGlobal.createGain();

    // Reverb
    const reverbNode = audioContextGlobal.createConvolver();
    const length = audioContextGlobal.sampleRate * 2.5;
    const impulse = audioContextGlobal.createBuffer(2, length, audioContextGlobal.sampleRate);
    for (let i = 0; i < 2; i++) {
        const channel = impulse.getChannelData(i);
        for (let j = 0; j < length; j++) {
            channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
        }
    }
    reverbNode.buffer = impulse;
    const reverbGain = audioContextGlobal.createGain();
    reverbGain.gain.value = parseInt(reverbSlider.value) / 100;

    // Delay
    const delayNode = audioContextGlobal.createDelay();
    delayNode.delayTime.value = 0.3;
    const delayFeedback = audioContextGlobal.createGain();
    delayFeedback.gain.value = 0.4;
    delayNode.connect(delayFeedback); delayFeedback.connect(delayNode);
    const delayGain = audioContextGlobal.createGain();
    delayGain.gain.value = parseInt(delaySlider.value) / 100;

    efectoEntrada.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(reverbNode);
    reverbNode.connect(reverbGain);
    reverbGain.connect(masterGain);

    const dryGain = audioContextGlobal.createGain();
    dryGain.gain.value = 0.5;
    efectoEntrada.connect(dryGain);
    dryGain.connect(masterGain);
}

// ==========================================
// 3. CREAR EL LIENZO (Solo se dibuja la primera vez)
// ==========================================
function inicializarPianoRoll() {
    const container = document.getElementById('pianoRollContainer');
    if (!container) return;
    
    // Si ya existe un lienzo, lo borramos para empezar de cero
    if (konvaStage) konvaStage.destroy(); 
    
    konvaStage = new Konva.Stage({
        container: 'pianoRollContainer',
        width: 2000,
        height: (finMidi - inicioMidi + 1) * altoFila
    });
    
    konvaLayer = new Konva.Layer();
    konvaStage.add(konvaLayer);
    
    // Dibujar el fondo de la cuadrícula (Esto solo pasa UNA VEZ)
    for (let i = 0; i <= (finMidi - inicioMidi); i++) {
        const y = i * altoFila;
        const esTeclaNegra = [1, 3, 6, 8, 10].includes((finMidi - i) % 12);
        const rect = new Konva.Rect({
            x: 0, y: y, width: 2000, height: altoFila,
            fill: esTeclaNegra ? '#1a252f' : '#2c3e50',
            stroke: '#34495e', strokeWidth: 1
        });
        konvaLayer.add(rect);
    }
    
    // Evento: Doble clic para crear una nota
    konvaStage.on('dblclick dbltap', (e) => {
        const pointerPos = konvaStage.getPointerPosition();
        const tiempo = Math.round(pointerPos.x / pxPorSegundo * 10) / 10;
        const pitch = finMidi - Math.floor(pointerPos.y / altoFila);
        notasDetectadas.push({ startTimeSeconds: tiempo, pitchMidi: pitch, durationSeconds: 0.5, amplitude: 1 });
        actualizarNotasEnPianoRoll(); 
    });
    
    konvaLayer.draw();
}

// ==========================================
// 4. ACTUALIZAR NOTAS (Súper rápido)
// ==========================================
function actualizarNotasEnPianoRoll() {
    if (!konvaLayer) return;
    
    // Borramos solo las notas viejas (los rectángulos rojos)
    konvaLayer.find('.nota-rect').forEach(nodo => nodo.destroy());
    
    // Volvemos a dibujar las notas actuales
    notasDetectadas.forEach((nota, index) => {
        const x = nota.startTimeSeconds * pxPorSegundo;
        const ancho = Math.max(10, nota.durationSeconds * pxPorSegundo);
        const y = (finMidi - nota.pitchMidi) * altoFila;
        
        const rectNota = new Konva.Rect({
            x: x, y: y, width: ancho, height: altoFila - 2,
            fill: '#e74c3c', cornerRadius: 3, opacity: 0.9,
            draggable: true,
            name: 'nota-rect' // Identificador para poder borrarlas
        });
        
        rectNota.on('click', (e) => {
            e.cancelBubble = true;
            notasDetectadas.splice(index, 1);
            actualizarNotasEnPianoRoll(); 
        });
        
        rectNota.on('dragend', () => {
            notasDetectadas[index].startTimeSeconds = rectNota.x() / pxPorSegundo;
            notasDetectadas[index].pitchMidi = finMidi - Math.round(rectNota.y() / altoFila);
        });
        
        konvaLayer.add(rectNota);
    });
    
    konvaLayer.draw();
}

// ==========================================
// 5. PIANO VIRTUAL
// ==========================================
function inicializarPianoVirtual() {
    pianoVirtualContainer.innerHTML = '';
    const notasBlancas = [0, 2, 4, 5, 7, 9, 11]; 

    for (let i = inicioMidi; i <= finMidi; i++) {
        if (notasBlancas.includes(i % 12)) {
            const tecla = document.createElement('div');
            tecla.className = 'tecla-blanca';
            tecla.innerText = i;
            
            tecla.addEventListener('mousedown', () => presionarTecla(i));
            tecla.addEventListener('mouseup', () => soltarTecla(i));
            tecla.addEventListener('mouseleave', () => soltarTecla(i));
            tecla.addEventListener('touchstart', (e) => { e.preventDefault(); presionarTecla(i); });
            tecla.addEventListener('touchend', (e) => { e.preventDefault(); soltarTecla(i); });
            
            pianoVirtualContainer.appendChild(tecla);
        }
    }
}

async function presionarTecla(pitchMidi) {
    if (!grabando) return; 
    inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    const tiempoActual = (Date.now() - tiempoInicioGrabacion) / 1000;
    notasActivas[pitchMidi] = { inicio: tiempoActual, pitch: pitchMidi };

    // Sonido simple mientras grabamos
    Soundfont.instrument(audioContextGlobal, 'acoustic_grand_piano').then(instrumento => {
        instrumento.play(pitchMidi, audioContextGlobal.currentTime, { duration: 0.5, destination: efectoEntrada });
    });
}

function soltarTecla(pitchMidi) {
    if (!grabando || !notasActivas[pitchMidi]) return;
    const tiempoActual = (Date.now() - tiempoInicioGrabacion) / 1000;
    const duracion = Math.max(0.1, tiempoActual - notasActivas[pitchMidi].inicio);
    
    notasDetectadas.push({ startTimeSeconds: notasActivas[pitchMidi].inicio, durationSeconds: duracion, pitchMidi: pitchMidi, amplitude: 1 });
    delete notasActivas[pitchMidi];
    actualizarNotasEnPianoRoll(); 
}

// ==========================================
// 6. BOTONES DE GRABACIÓN
// ==========================================
botonGrabarPiano.addEventListener('click', () => {
    grabando = true;
    tiempoInicioGrabacion = Date.now();
    estadoGrabacion.innerText = "🔴 Grabando...";
    botonGrabarPiano.disabled = true; botonGrabarMicro.disabled = true; botonDetenerGrabacion.disabled = false;
});

botonDetenerGrabacion.addEventListener('click', () => {
    grabando = false;
    estadoGrabacion.innerText = "⏹️ Detenido.";
    botonGrabarPiano.disabled = false; botonGrabarMicro.disabled = false; botonDetenerGrabacion.disabled = true;
});

botonLimpiar.addEventListener('click', () => {
    if (confirm("¿Borrar todas las notas?")) { notasDetectadas = []; actualizarNotasEnPianoRoll(); }
});

// ==========================================
// 7. REPRODUCIR LA PISTA
// ==========================================
botonReproducirMelodia.addEventListener('click', async () => {
    if (notasDetectadas.length === 0) return alert("Dibuja o graba algunas notas primero.");
    inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    const instrumento = await Soundfont.instrument(audioContextGlobal, 'acoustic_grand_piano');
    const notasOrdenadas = [...notasDetectadas].sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
    
    notasOrdenadas.forEach(nota => {
        const tiempoInicio = audioContextGlobal.currentTime + nota.startTimeSeconds + 0.1;
        instrumento.play(nota.pitchMidi, tiempoInicio, { duration: nota.durationSeconds, destination: efectoEntrada });
    });
});

// ==========================================
// 8. INICIALIZAR TODO
// ==========================================
inicializarPianoVirtual();
inicializarPianoRoll();