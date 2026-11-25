// ==========================================
// 1. VARIABLES Y ELEMENTOS
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
let stage = null;
let layer = null;

// Variables de grabación
let grabando = false;
let tiempoInicioGrabacion = 0;
let notasActivas = {}; 

const inicioMidi = 48; 
const finMidi = 72;    
const altoFila = 20;
const pxPorSegundo = 100;

// ==========================================
// 2. MOTOR DE AUDIO Y EFECTOS
// ==========================================
let audioContextGlobal = null;
let masterGain = null;
let efectoEntrada = null;

function inicializarMotorDeAudio() {
    if (audioContextGlobal) return;
    
    audioContextGlobal = new AudioContext();
    masterGain = audioContextGlobal.createGain();
    masterGain.connect(audioContextGlobal.destination);
    efectoEntrada = audioContextGlobal.createGain();

    // Efectos básicos
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

    const delayNode = audioContextGlobal.createDelay();
    delayNode.delayTime.value = 0.3;
    const delayFeedback = audioContextGlobal.createGain();
    delayFeedback.gain.value = 0.4;
    delayNode.connect(delayFeedback); delayFeedback.connect(delayNode);
    const delayGain = audioContextGlobal.createGain();
    delayGain.gain.value = parseInt(delaySlider.value) / 100;

    // Conexión: Entrada -> Delay -> Reverb -> Master
    efectoEntrada.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(reverbNode);
    reverbNode.connect(reverbGain);
    reverbGain.connect(masterGain);

    // Señal seca
    const dryGain = audioContextGlobal.createGain();
    dryGain.gain.value = 0.5;
    efectoEntrada.connect(dryGain);
    dryGain.connect(masterGain);
}

// ==========================================
// 3. CARGAR INSTRUMENTOS EN EL SELECTOR
// ==========================================
// Simulamos la carga del backend (debes tener tu backend corriendo con los .sf2)
async function cargarInstrumentos() {
    try {
        const res = await fetch('https://backend-musica-app.onrender.com/instrumentos');
        const archivos = await res.json();
        
        archivos.forEach(nombre => {
            const option = document.createElement('option');
            option.value = nombre;
            option.innerText = nombre;
            selectorInstrumentoUsuario.appendChild(option);
        });
    } catch (e) {
        console.log("No se pudieron cargar los instrumentos de la nube.");
    }
}
cargarInstrumentos();

// ==========================================
// 4. PIANO VIRTUAL Y REPRODUCCIÓN
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

    // Reproducir sonido (Piano básico por ahora)
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
    dibujarPianoRoll(); 
}

// ==========================================
// 5. DIBUJAR EL PIANO ROLL
// ==========================================
function dibujarPianoRoll() {
    const container = document.getElementById('pianoRollContainer');
    if (!container) return;
    container.innerHTML = ''; 
    const anchoTotal = 2000; 
    
    stage = new Konva.Stage({ container: 'pianoRollContainer', width: anchoTotal, height: (finMidi - inicioMidi + 1) * altoFila });
    layer = new Konva.Layer();
    stage.add(layer);

    for (let i = 0; i <= (finMidi - inicioMidi); i++) {
        const y = i * altoFila;
        const esTeclaNegra = [1, 3, 6, 8, 10].includes((finMidi - i) % 12);
        const rect = new Konva.Rect({ x: 0, y: y, width: anchoTotal, height: altoFila, fill: esTeclaNegra ? '#1a252f' : '#2c3e50', stroke: '#34495e', strokeWidth: 1 });
        layer.add(rect);
    }

    notasDetectadas.forEach((nota, index) => {
        const x = nota.startTimeSeconds * pxPorSegundo;
        const ancho = Math.max(10, nota.durationSeconds * pxPorSegundo);
        const y = (finMidi - nota.pitchMidi) * altoFila;

        const rectNota = new Konva.Rect({ x: x, y: y, width: ancho, height: altoFila - 2, fill: '#e74c3c', cornerRadius: 3, opacity: 0.9, draggable: true });

        rectNota.on('click', (e) => { e.cancelBubble = true; notasDetectadas.splice(index, 1); dibujarPianoRoll(); });
        rectNota.on('dragend', () => { notasDetectadas[index].startTimeSeconds = rectNota.x() / pxPorSegundo; notasDetectadas[index].pitchMidi = finMidi - Math.round(rectNota.y() / altoFila); });

        layer.add(rectNota);
    });

    stage.on('dblclick dbltap', (e) => {
        const pointerPos = stage.getPointerPosition();
        const tiempo = Math.round(pointerPos.x / pxPorSegundo * 10) / 10;
        const pitch = finMidi - Math.floor(pointerPos.y / altoFila);
        notasDetectadas.push({ startTimeSeconds: tiempo, pitchMidi: pitch, durationSeconds: 0.5, amplitude: 1 });
        dibujarPianoRoll();
    });

    layer.draw();
}

// ==========================================
// 6. GRABACIÓN Y REPRODUCCIÓN
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
    if (confirm("¿Borrar todas las notas?")) { notasDetectadas = []; dibujarPianoRoll(); }
});

botonReproducirMelodia.addEventListener('click', async () => {
    if (notasDetectadas.length === 0) return alert("Dibuja o graba algunas notas primero.");
    inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    // Aquí iría la lógica para SpessaSynth. Por ahora, Piano básico.
    const instrumento = await Soundfont.instrument(audioContextGlobal, 'acoustic_grand_piano');
    const notasOrdenadas = [...notasDetectadas].sort((a, b) => a.startTimeSeconds - b.startTimeSeconds);
    
    notasOrdenadas.forEach(nota => {
        const tiempoInicio = audioContextGlobal.currentTime + nota.startTimeSeconds + 0.1;
        instrumento.play(nota.pitchMidi, tiempoInicio, { duration: nota.durationSeconds, destination: efectoEntrada });
    });
});

// Actualizar visualmente los sliders
reverbSlider.addEventListener('input', (e) => document.getElementById('valReverb').innerText = e.target.value);
delaySlider.addEventListener('input', (e) => document.getElementById('valDelay').innerText = e.target.value);
flangerSlider.addEventListener('input', (e) => document.getElementById('valFlanger').innerText = e.target.value);
wahSlider.addEventListener('input', (e) => document.getElementById('valWah').innerText = e.target.value);

// Inicializar
inicializarPianoVirtual();
dibujarPianoRoll();

// ==========================================
// FUNCIÓN MAESTRA PARA TOCAR UNA NOTA
// ==========================================
async function tocarInstrumento(pitchMidi, duracion = 0.5) {
    if (!audioContextGlobal) inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    const instrumentoSeleccionado = selectorInstrumentoUsuario.value;

    // Si es un instrumento estándar (piano, flauta, etc.)
    if (instrumentoSeleccionado === 'acoustic_grand_piano' || !instrumentoSeleccionado.endsWith('.sf2')) {
        Soundfont.instrument(audioContextGlobal, instrumentoSeleccionado).then(instrumento => {
            instrumento.play(pitchMidi, audioContextGlobal.currentTime, { duration: duracion, destination: efectoEntrada });
        });
    } 
    // Si es un archivo .sf2 (instrumento étnico)
    else {
        try {
            // 1. Buscamos el archivo en la memoria del navegador (IndexedDB)
            const db = await openDB();
            let data = await db.transaction('sf2files', 'readonly').objectStore('sf2files').get(instrumentoSeleccionado);
            
            // 2. Si no está, lo descargamos de Render
            if (!data || !data.buffer) {
                estadoGrabacion.innerText = `Descargando ${instrumentoSeleccionado}...`;
                const respuesta = await fetch(`https://backend-musica-app.onrender.com/instrumentos/${instrumentoSeleccionado}`);
                if (!respuesta.ok) throw new Error("Error al descargar");
                const arrayBuffer = await respuesta.arrayBuffer();
                
                const txWrite = db.transaction('sf2files', 'readwrite');
                await txWrite.objectStore('sf2files').put({ nombre: instrumentoSeleccionado, buffer: arrayBuffer });
                data = { buffer: arrayBuffer };
            }

            // 3. Cargamos SpessaSynth (esto puede tardar un poco la primera vez)
            await audioContextGlobal.audioWorklet.addModule("https://cdn.jsdelivr.net/npm/spessasynth_lib@4.4.7/dist/spessasynth_processor.min.js");
            
            // Si ya hay un sintetizador cargado con el mismo banco, lo reutilizamos
            if (!window.synthGlobal || window.synthBancoActual !== instrumentoSeleccionado) {
                estadoGrabacion.innerText = `Cargando ${instrumentoSeleccionado}...`;
                window.synthGlobal = new WorkletSynthesizer(audioContextGlobal);
                await window.synthGlobal.soundBankManager.addSoundBank(data.buffer, "main");
                await window.synthGlobal.isReady;
                window.synthGlobal.connect(efectoEntrada);
                window.synthBancoActual = instrumentoSeleccionado;
                estadoGrabacion.innerText = `¡${instrumentoSeleccionado} listo!`;
            }

            // 4. Tocar la nota
            window.synthGlobal.noteOn(0, pitchMidi, 127);
            setTimeout(() => {
                if (window.synthGlobal) window.synthGlobal.noteOff(0, pitchMidi);
            }, duracion * 1000);

        } catch (error) {
            console.error("Error con SF2:", error);
            estadoGrabacion.innerText = "Error al cargar el instrumento.";
        }
    }
}