// ==========================================
// 1. VARIABLES Y ELEMENTOS DEL HTML
// ==========================================
const botonGrabarPiano = document.getElementById('botonGrabarPiano');
const botonDetenerGrabacion = document.getElementById('botonDetenerGrabacion');
const botonLimpiar = document.getElementById('botonLimpiar');
const estadoGrabacion = document.getElementById('estadoGrabacion');
const pianoVirtualContainer = document.getElementById('pianoVirtual');
const botonReproducirMelodia = document.getElementById('botonReproducirMelodia');
const botonExportarAudio = document.getElementById('botonExportarAudio');
const reverbSlider = document.getElementById('reverbSlider');
const delaySlider = document.getElementById('delaySlider');
const selectorInstrumentoUsuario = document.getElementById('selectorInstrumentoUsuario');

// Elementos de Administración
const nuevoNombreEtnicos = document.getElementById('nuevoNombreEtnicos');
const archivoSF2 = document.getElementById('archivoSF2');
const programaSF2 = document.getElementById('programaSF2');
const botonCargarSF2 = document.getElementById('botonCargarSF2');

// Variables de Estado
let notasDetectadas = [];
let grabando = false;
let tiempoInicioGrabacion = 0;
let notasActivas = {}; 

const inicioMidi = 48; 
const finMidi = 72;    
const altoFila = 20;
const pxPorSegundo = 100;

// Variables de Konva
let konvaStage = null;
let konvaLayer = null;

// Variables de Audio
let audioContextGlobal = null;
let masterGain = null;
let efectoEntrada = null;
let synthSpessa = null; 

// ==========================================
// FUNCIÓN PARA LEER LOS ARCHIVOS .SF2
// ==========================================
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('MiAppMusicalDB', 1);
        request.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('sf2files')) {
                db.createObjectStore('sf2files', { keyPath: 'nombre' });
            }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// ==========================================
// 2. CARGAR INSTRUMENTOS DESDE RENDER
// ==========================================
async function cargarInstrumentos() {
    selectorInstrumentoUsuario.innerHTML = '<option value="acoustic_grand_piano">Piano (Por defecto)</option>';
    try {
        const res = await fetch('https://backend-musica-app.onrender.com/instrumentos');
        const archivos = await res.json();
        
        if (archivos.length > 0) {
            archivos.forEach(nombre => {
                const option = document.createElement('option');
                option.value = nombre;
                option.innerText = nombre;
                selectorInstrumentoUsuario.appendChild(option);
            });
            estadoGrabacion.innerText = "Instrumentos cargados.";
        } else {
            estadoGrabacion.innerText = "Servidor conectado, pero vacío.";
        }
    } catch (e) {
        console.error("Error al cargar instrumentos:", e);
        estadoGrabacion.innerText = "Error: Render no responde. Recarga en 30s.";
    }
}
cargarInstrumentos();

// ==========================================
// 3. SUBIR INSTRUMENTO DESDE LA APP
// ==========================================
botonCargarSF2.addEventListener('click', async () => {
    const file = archivoSF2.files[0];
    if (!file) return alert("Selecciona un archivo .sf2");
    if (!nuevoNombreEtnicos.value) return alert("Escribe un nombre");

    const formData = new FormData();
    formData.append('archivo', file);

    estadoGrabacion.innerText = "Subiendo instrumento...";
    try {
        const res = await fetch('https://backend-musica-app.onrender.com/subir-instrumento', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();
        estadoGrabacion.innerText = `¡${data.mensaje}!`;
        cargarInstrumentos(); 
    } catch (e) {
        console.error(e);
        estadoGrabacion.innerText = "Error al subir el archivo.";
    }
});

// ==========================================
// 4. MOTOR DE AUDIO Y EFECTOS
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
// 5. FUNCIÓN MAESTRA PARA TOCAR UNA NOTA
// ==========================================
async function tocarInstrumento(pitchMidi, duracion = 0.5) {
    if (!audioContextGlobal) inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    const instrumentoSeleccionado = selectorInstrumentoUsuario.value;

    if (instrumentoSeleccionado === 'acoustic_grand_piano' || !instrumentoSeleccionado.endsWith('.sf2')) {
        Soundfont.instrument(audioContextGlobal, 'acoustic_grand_piano').then(instrumento => {
            instrumento.play(pitchMidi, audioContextGlobal.currentTime, { duration: duracion, destination: efectoEntrada });
        });
    } else {
        try {
            let data;
            const db = await openDB();
            data = await db.transaction('sf2files', 'readonly').objectStore('sf2files').get(instrumentoSeleccionado);
            
            if (!data || !data.buffer) {
                estadoGrabacion.innerText = `Descargando ${instrumentoSeleccionado}...`;
                const respuesta = await fetch(`https://backend-musica-app.onrender.com/instrumentos/${instrumentoSeleccionado}`);
                if (!respuesta.ok) throw new Error("Error al descargar");
                const arrayBuffer = await respuesta.arrayBuffer();
                
                const txWrite = db.transaction('sf2files', 'readwrite');
                await txWrite.objectStore('sf2files').put({ nombre: instrumentoSeleccionado, buffer: arrayBuffer });
                data = { buffer: arrayBuffer };
            }

            if (!synthSpessa) {
                await audioContextGlobal.audioWorklet.addModule("https://cdn.jsdelivr.net/npm/spessasynth_lib@4.4.7/dist/spessasynth_processor.min.js");
                synthSpessa = new WorkletSynthesizer(audioContextGlobal);
                synthSpessa.connect(efectoEntrada);
            }

            if (synthSpessa.soundBankManager.soundBankCount === 0) {
                await synthSpessa.soundBankManager.addSoundBank(data.buffer, "main");
                await synthSpessa.isReady;
            }

            synthSpessa.noteOn(0, pitchMidi, 127);
            setTimeout(() => {
                if (synthSpessa) synthSpessa.noteOff(0, pitchMidi);
            }, duracion * 1000);

        } catch (error) {
            console.error("Error con SF2:", error);
            estadoGrabacion.innerText = "Error al cargar instrumento.";
        }
    }
}

// ==========================================
// 6. PIANO ROLL Y PIANO VIRTUAL
// ==========================================
function inicializarPianoRoll() {
    const container = document.getElementById('pianoRollContainer');
    if (!container) return;
    if (konvaStage) konvaStage.destroy(); 
    
    konvaStage = new Konva.Stage({ container: 'pianoRollContainer', width: 2000, height: (finMidi - inicioMidi + 1) * altoFila });
    konvaLayer = new Konva.Layer();
    konvaStage.add(konvaLayer);
    
    for (let i = 0; i <= (finMidi - inicioMidi); i++) {
        const y = i * altoFila;
        const esTeclaNegra = [1, 3, 6, 8, 10].includes((finMidi - i) % 12);
        const rect = new Konva.Rect({ x: 0, y: y, width: 2000, height: altoFila, fill: esTeclaNegra ? '#1a252f' : '#2c3e50', stroke: '#34495e', strokeWidth: 1 });
        konvaLayer.add(rect);
    }
    
    konvaStage.on('dblclick dbltap', (e) => {
        const pointerPos = konvaStage.getPointerPosition();
        const tiempo = Math.round(pointerPos.x / pxPorSegundo * 10) / 10;
        const pitch = finMidi - Math.floor(pointerPos.y / altoFila);
        notasDetectadas.push({ startTimeSeconds: tiempo, pitchMidi: pitch, durationSeconds: 0.5, amplitude: 1 });
        actualizarNotasEnPianoRoll(); 
    });
    
    konvaLayer.draw();
}

function actualizarNotasEnPianoRoll() {
    if (!konvaLayer) return;
    konvaLayer.find('.nota-rect').forEach(nodo => nodo.destroy());
    
    notasDetectadas.forEach((nota, index) => {
        const x = nota.startTimeSeconds * pxPorSegundo;
        const ancho = Math.max(10, nota.durationSeconds * pxPorSegundo);
        const y = (finMidi - nota.pitchMidi) * altoFila;
        
        const rectNota = new Konva.Rect({ x: x, y: y, width: ancho, height: altoFila - 2, fill: '#e74c3c', cornerRadius: 3, opacity: 0.9, draggable: true, name: 'nota-rect' });
        
        rectNota.on('click', (e) => { e.cancelBubble = true; notasDetectadas.splice(index, 1); actualizarNotasEnPianoRoll(); });
        rectNota.on('dragend', () => { notasDetectadas[index].startTimeSeconds = rectNota.x() / pxPorSegundo; notasDetectadas[index].pitchMidi = finMidi - Math.round(rectNota.y() / altoFila); });
        
        konvaLayer.add(rectNota);
    });
    konvaLayer.draw();
}

function inicializarPianoVirtual() {
    pianoVirtualContainer.innerHTML = '';
    const notasBlancas = [0, 2, 4, 5, 7, 9, 11]; 
    for (let i = inicioMidi; i <= finMidi; i++) {
        if (notasBlancas.includes(i % 12)) {
            const tecla = document.createElement('div');
            tecla.className = 'tecla-blanca';
            tecla.innerText = i;
            
            // Eventos táctiles y de ratón unificados
            tecla.addEventListener('pointerdown', (e) => { e.preventDefault(); presionarTecla(i); });
            tecla.addEventListener('pointerup', (e) => { e.preventDefault(); soltarTecla(i); });
            tecla.addEventListener('pointerleave', (e) => { e.preventDefault(); soltarTecla(i); });
            
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
    tocarInstrumento(pitchMidi, 0.5);
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
// 7. CONTROLES DE REPRODUCCIÓN
// ==========================================
botonGrabarPiano.addEventListener('click', () => {
    grabando = true;
    tiempoInicioGrabacion = Date.now();
    estadoGrabacion.innerText = "🔴 Grabando...";
    botonGrabarPiano.disabled = true; botonDetenerGrabacion.disabled = false;
});

botonDetenerGrabacion.addEventListener('click', () => {
    grabando = false;
    estadoGrabacion.innerText = "⏹️ Detenido.";
    botonGrabarPiano.disabled = false; botonDetenerGrabacion.disabled = true;
});

botonLimpiar.addEventListener('click', () => {
    if (confirm("¿Borrar todas las notas?")) { notasDetectadas = []; actualizarNotasEnPianoRoll(); }
});

botonReproducirMelodia.addEventListener('click', async () => {
    if (notasDetectadas.length === 0) return alert("Dibuja o graba algunas notas primero.");
    inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();
    const notasOrdenadas = [...notasDetectadas].sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
    notasOrdenadas.forEach(nota => {
        setTimeout(() => { tocarInstrumento(nota.pitchMidi, nota.durationSeconds); }, nota.startTimeSeconds * 1000);
    });
});

// ==========================================
// 8. INICIALIZACIÓN
// ==========================================
inicializarPianoVirtual();
inicializarPianoRoll();