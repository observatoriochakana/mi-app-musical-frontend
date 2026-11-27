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
const botonCargarSF2 = document.getElementById('botonCargarSF2');

// Elementos del Micrófono
const btnGrabarMicrofono = document.getElementById('btnGrabarMicrofono');
const btnDetenerMicrofono = document.getElementById('btnDetenerMicrofono');
const btnReproducirMicrofono = document.getElementById('btnReproducirMicrofono');

// Botones de Octava
const btnOctavaBajar = document.getElementById('btnOctavaBajar');
const btnOctavaSubir = document.getElementById('btnOctavaSubir');

// Variables de Estado MIDI
let notasDetectadas = [];
let grabando = false;
let tiempoInicioGrabacion = 0;
let notasActivas = {};

// Variables de Estado Micrófono
let mediaRecorder = null;
let chunksAudio = [];
let audioGrabadoBuffer = null; // Aquí guardaremos el audio ya decodificado

// Rango MIDI
const inicioMidi = 36; 
const finMidi = 84;    
const altoFila = 20;
const pxPorSegundo = 100;
const anchoTeclaBlanca = 50; 

// Variables de Konva
let konvaStage = null;
let konvaLayer = null;

// Variables de Audio
let audioContextGlobal = null;
let masterGain = null;
let efectoEntrada = null;
let instrumentosCacheados = {};

// ==========================================
// 2. CATÁLOGO DE INSTRUMENTOS
// ==========================================
const CATALOGO_INSTRUMENTOS = [
    { valor: 'banjo', nombre: 'Trompe (Arpa de Boca)' },
    { valor: 'taiko_drum', nombre: 'Kultrún / Bombo' }, 
    { valor: 'french_horn', nombre: 'Trutruka' }, 
    { valor: 'steel_drums', nombre: 'Metawe (Cántaro)' }, 
    { valor: 'recorder', nombre: 'Pifilka' },
    { valor: 'shakuhachi', nombre: 'Shakuhachi (Japón)' },
    { valor: 'didgeridoo', nombre: 'Didgeridoo' },
    { valor: 'pan_flute', nombre: 'Zampoña / Siku' },
    { valor: 'flute', nombre: 'Quena Andina' },
    { valor: 'acoustic_guitar_nylon', nombre: 'Charango / Oud' },
    { valor: 'acoustic_guitar_steel', nombre: 'Cuatro Venezolano' },
    { valor: 'acoustic_bass', nombre: 'Contrabajo Pizzicato' },
    { valor: 'kalimba', nombre: 'Kalimba (Mbira)' },
    { valor: 'sitar', nombre: 'Sitar (India)' },
    { valor: 'koto', nombre: 'Koto (Japón)' },
    { valor: 'shamisen', nombre: 'Shamisen (Japón)' },
    { valor: 'fiddle', nombre: 'Erhu (China)' },
    { valor: 'english_horn', nombre: 'Duduk (Armenia)' },
    { valor: 'bagpipe', nombre: 'Gaita Gallega / Celta' },
    { valor: 'acoustic_grand_piano', nombre: 'Piano (Base)' }
];

function cargarInstrumentosEnSelector() {
    selectorInstrumentoUsuario.innerHTML = '';
    CATALOGO_INSTRUMENTOS.forEach(inst => {
        const option = document.createElement('option');
        option.value = inst.valor;
        option.innerText = inst.nombre;
        selectorInstrumentoUsuario.appendChild(option);
    });
    selectorInstrumentoUsuario.value = 'sitar'; 
    estadoGrabacion.innerText = "Catálogo cargado. ¡Listo para grabar!";
}
cargarInstrumentosEnSelector();

// ==========================================
// 3. MOTOR DE AUDIO Y EFECTOS
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
    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);
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

    reverbSlider.addEventListener('input', () => {
        reverbGain.gain.value = parseInt(reverbSlider.value) / 100;
    });
    delaySlider.addEventListener('input', () => {
        delayGain.gain.value = parseInt(delaySlider.value) / 100;
    });
}

// ==========================================
// 4. FUNCIÓN MAESTRA PARA TOCAR
// ==========================================
async function tocarInstrumento(pitchMidi, duracion = 0.5) {
    if (!audioContextGlobal) inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    const nombreInstrumento = selectorInstrumentoUsuario.value;
    if (!nombreInstrumento) return;

    if (instrumentosCacheados[nombreInstrumento]) {
        instrumentosCacheados[nombreInstrumento].play(pitchMidi, audioContextGlobal.currentTime, { duration: duracion, destination: efectoEntrada });
        return;
    }

    estadoGrabacion.innerText = `Cargando ${nombreInstrumento}...`;
    try {
        const instrumento = await Soundfont.instrument(audioContextGlobal, nombreInstrumento, { soundfont: 'FluidR3_GM' });
        instrumentosCacheados[nombreInstrumento] = instrumento;
        instrumento.play(pitchMidi, audioContextGlobal.currentTime, { duration: duracion, destination: efectoEntrada });
        estadoGrabacion.innerText = `Instrumento listo.`;
    } catch (error) {
        console.error("Error al cargar instrumento:", error);
        estadoGrabacion.innerText = "Error al cargar el instrumento.";
    }
}

// ==========================================
// 5. GRABACIÓN DE MICRÓFONO (NUEVO)
// ==========================================
btnGrabarMicrofono.addEventListener('click', async () => {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        chunksAudio = [];

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunksAudio.push(e.data);
        };

        mediaRecorder.onstop = async () => {
            const blob = new Blob(chunksAudio, { type: 'audio/webm' });
            
            // Convertir a AudioBuffer para poder reproducirlo con efectos
            const arrayBuffer = await blob.arrayBuffer();
            inicializarMotorDeAudio(); // Asegurarnos de que el contexto existe
            audioContextGlobal.decodeAudioData(arrayBuffer, (decodedData) => {
                audioGrabadoBuffer = decodedData;
                estadoGrabacion.innerText = "🎤 Grabación lista para reproducir.";
                btnReproducirMicrofono.disabled = false;
            });

            // Apagar el micrófono para que no siga escuchando
            stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        btnGrabarMicrofono.disabled = true;
        btnDetenerMicrofono.disabled = false;
        btnReproducirMicrofono.disabled = true;
        estadoGrabacion.innerText = "🔴 Grabando desde micrófono...";
    } catch (error) {
        console.error("Error al acceder al micrófono:", error);
        alert("No se pudo acceder al micrófono. Revisa los permisos de tu navegador.");
    }
});

btnDetenerMicrofono.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
        btnGrabarMicrofono.disabled = false;
        btnDetenerMicrofono.disabled = true;
        estadoGrabacion.innerText = "Procesando audio...";
    }
});

btnReproducirMicrofono.addEventListener('click', () => {
    if (!audioGrabadoBuffer) return;
    inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') audioContextGlobal.resume();

    // Creamos la fuente de audio y la conectamos a los efectos
    const source = audioContextGlobal.createBufferSource();
    source.buffer = audioGrabadoBuffer;
    source.connect(efectoEntrada); // Conectamos al rack de efectos
    source.start();
    estadoGrabacion.innerText = "▶️ Reproduciendo grabación...";
});

// ==========================================
// 6. PIANO ROLL Y PIANO VIRTUAL
// ==========================================
function inicializarPianoRoll() {
    const container = document.getElementById('pianoRollContainer');
    if (!container) return;
    if (konvaStage) konvaStage.destroy();

    konvaStage = new Konva.Stage({ container: 'pianoRollContainer', width: 3000, height: (finMidi - inicioMidi + 1) * altoFila });
    konvaLayer = new Konva.Layer();
    konvaStage.add(konvaLayer);

    for (let i = 0; i <= (finMidi - inicioMidi); i++) {
        const y = i * altoFila;
        const esTeclaNegra = [1, 3, 6, 8, 10].includes((finMidi - i) % 12);
        const rect = new Konva.Rect({ x: 0, y: y, width: 3000, height: altoFila, fill: esTeclaNegra ? '#1a252f' : '#2c3e50', stroke: '#34495e', strokeWidth: 1 });
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
    pianoVirtualContainer.innerHTML = '<div class="piano-keys-wrapper" id="pianoKeysWrapper"></div>';
    const wrapper = document.getElementById('pianoKeysWrapper');
    const notasBlancas = [0, 2, 4, 5, 7, 9, 11];
    let contadorTeclasBlancas = 0;

    for (let i = inicioMidi; i <= finMidi; i++) {
        if (notasBlancas.includes(i % 12)) {
            const tecla = document.createElement('div');
            tecla.className = 'tecla-blanca';
            tecla.innerText = i;
            tecla.dataset.midi = i;

            tecla.addEventListener('pointerdown', (e) => { e.preventDefault(); presionarTecla(i); });
            tecla.addEventListener('pointerup', (e) => { e.preventDefault(); soltarTecla(i); });
            tecla.addEventListener('pointerleave', (e) => { e.preventDefault(); soltarTecla(i); });

            wrapper.appendChild(tecla);
            contadorTeclasBlancas++;

            const siguienteNota = i + 1;
            if (siguienteNota <= finMidi && !notasBlancas.includes(siguienteNota % 12)) {
                const teclaNegra = document.createElement('div');
                teclaNegra.className = 'tecla-negra';
                teclaNegra.dataset.midi = siguienteNota;
                teclaNegra.style.left = (contadorTeclasBlancas * anchoTeclaBlanca - 15) + 'px';

                teclaNegra.addEventListener('pointerdown', (e) => { e.preventDefault(); presionarTecla(siguienteNota); });
                teclaNegra.addEventListener('pointerup', (e) => { e.preventDefault(); soltarTecla(siguienteNota); });
                teclaNegra.addEventListener('pointerleave', (e) => { e.preventDefault(); soltarTecla(siguienteNota); });

                wrapper.appendChild(teclaNegra);
            }
        }
    }

    document.addEventListener('pointerup', () => {
        Object.keys(notasActivas).forEach(pitch => {
            soltarTecla(parseInt(pitch));
        });
    });
}

async function presionarTecla(pitchMidi) {
    inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    const tecla = document.querySelector(`[data-midi="${pitchMidi}"]`);
    if (tecla) tecla.classList.add('pressed');

    tocarInstrumento(pitchMidi, 0.5);

    if (grabando) {
        const tiempoActual = (Date.now() - tiempoInicioGrabacion) / 1000;
        notasActivas[pitchMidi] = { inicio: tiempoActual, pitch: pitchMidi };
    }
}

function soltarTecla(pitchMidi) {
    const tecla = document.querySelector(`[data-midi="${pitchMidi}"]`);
    if (tecla) tecla.classList.remove('pressed');

    if (!grabando || !notasActivas[pitchMidi]) return;
    const tiempoActual = (Date.now() - tiempoInicioGrabacion) / 1000;
    const duracion = Math.max(0.1, tiempoActual - notasActivas[pitchMidi].inicio);
    notasDetectadas.push({ startTimeSeconds: notasActivas[pitchMidi].inicio, durationSeconds: duracion, pitchMidi: pitchMidi, amplitude: 1 });
    delete notasActivas[pitchMidi];
    actualizarNotasEnPianoRoll();
}

// ==========================================
// 7. LÓGICA DE LOS BOTONES DE OCTAVA
// ==========================================
btnOctavaSubir.addEventListener('click', () => {
    pianoVirtualContainer.scrollBy({ left: anchoTeclaBlanca * 7, behavior: 'smooth' });
});

btnOctavaBajar.addEventListener('click', () => {
    pianoVirtualContainer.scrollBy({ left: -anchoTeclaBlanca * 7, behavior: 'smooth' });
});

// ==========================================
// 8. CONTROLES DE REPRODUCCIÓN
// ==========================================
botonGrabarPiano.addEventListener('click', () => {
    grabando = true;
    tiempoInicioGrabacion = Date.now();
    estadoGrabacion.innerText = "🔴 Grabando...";
    botonGrabarPiano.disabled = true;
    botonDetenerGrabacion.disabled = false;
});

botonDetenerGrabacion.addEventListener('click', () => {
    grabando = false;
    estadoGrabacion.innerText = "⏹️ Detenido.";
    botonGrabarPiano.disabled = false;
    botonDetenerGrabacion.disabled = true;
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
// 9. INICIALIZACIÓN
// ==========================================
inicializarPianoVirtual();
inicializarPianoRoll();