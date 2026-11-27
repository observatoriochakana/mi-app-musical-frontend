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
const valReverb = document.getElementById('valReverb');
const valDelay = document.getElementById('valDelay');
const selectorInstrumentoUsuario = document.getElementById('selectorInstrumentoUsuario');

// Elementos de Administración
const nuevoNombreEtnicos = document.getElementById('nuevoNombreEtnicos');
const archivoSF2 = document.getElementById('archivoSF2');
const botonCargarSF2 = document.getElementById('botonCargarSF2');

// Elementos del Micrófono
const btnGrabarMicrofono = document.getElementById('btnGrabarMicrofono');
const btnDetenerMicrofono = document.getElementById('btnDetenerMicrofono');
const btnReproducirMicrofono = document.getElementById('btnReproducirMicrofono');
const btnLimpiarMicrofono = document.getElementById('btnLimpiarMicrofono');

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
let audioGrabadoBuffer = null;

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
    if (!selectorInstrumentoUsuario) return;
    selectorInstrumentoUsuario.innerHTML = '';
    CATALOGO_INSTRUMENTOS.forEach(inst => {
        const option = document.createElement('option');
        option.value = inst.valor;
        option.innerText = inst.nombre;
        selectorInstrumentoUsuario.appendChild(option);
    });
    selectorInstrumentoUsuario.value = 'sitar'; 
    if (estadoGrabacion) estadoGrabacion.innerText = "Catálogo cargado. ¡Listo para grabar!";
}
cargarInstrumentosEnSelector();

// Actualizar porcentajes visuales de los sliders
if (reverbSlider && valReverb) {
    reverbSlider.addEventListener('input', () => {
        valReverb.innerText = reverbSlider.value;
    });
}
if (delaySlider && valDelay) {
    delaySlider.addEventListener('input', () => {
        valDelay.innerText = delaySlider.value;
    });
}

// ==========================================
// 3. MOTOR DE AUDIO Y EFECTOS
// ==========================================
function construirCadenaEfectos(ctx, destinoFinal) {
    const entrada = ctx.createGain();

    // Reverb
    const reverbNode = ctx.createConvolver();
    const length = ctx.sampleRate * 2.5;
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let i = 0; i < 2; i++) {
        const channel = impulse.getChannelData(i);
        for (let j = 0; j < length; j++) {
            channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
        }
    }
    reverbNode.buffer = impulse;
    const reverbGain = ctx.createGain();
    reverbGain.gain.value = reverbSlider ? parseInt(reverbSlider.value) / 100 : 0.3;

    // Delay
    const delayNode = ctx.createDelay();
    delayNode.delayTime.value = 0.3;
    const delayFeedback = ctx.createGain();
    delayFeedback.gain.value = 0.4;
    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    const delayGain = ctx.createGain();
    delayGain.gain.value = delaySlider ? parseInt(delaySlider.value) / 100 : 0.2;

    // Conexiones
    entrada.connect(delayNode);
    delayNode.connect(delayGain);
    delayGain.connect(reverbNode);
    reverbNode.connect(reverbGain);
    reverbGain.connect(destinoFinal);

    const dryGain = ctx.createGain();
    dryGain.gain.value = 0.65;
    entrada.connect(dryGain);
    dryGain.connect(destinoFinal);

    return { entrada, reverbGain, delayGain };
}

function inicializarMotorDeAudio() {
    if (audioContextGlobal) return;

    audioContextGlobal = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioContextGlobal.createGain();
    masterGain.connect(audioContextGlobal.destination);

    const cadena = construirCadenaEfectos(audioContextGlobal, masterGain);
    efectoEntrada = cadena.entrada;

    if (reverbSlider) {
        reverbSlider.addEventListener('input', () => {
            cadena.reverbGain.gain.value = parseInt(reverbSlider.value) / 100;
        });
    }
    if (delaySlider) {
        delaySlider.addEventListener('input', () => {
            cadena.delayGain.gain.value = parseInt(delaySlider.value) / 100;
        });
    }
}

// ==========================================
// 4. FUNCIÓN MAESTRA PARA TOCAR
// ==========================================
async function obtenerInstrumento(ctx, nombreInstrumento) {
    if (ctx === audioContextGlobal && instrumentosCacheados[nombreInstrumento]) {
        return instrumentosCacheados[nombreInstrumento];
    }
    const inst = await Soundfont.instrument(ctx, nombreInstrumento, { soundfont: 'FluidR3_GM' });
    if (ctx === audioContextGlobal) {
        instrumentosCacheados[nombreInstrumento] = inst;
    }
    return inst;
}

async function tocarInstrumento(pitchMidi, duracion = 0.5, tiempoInicio = 0) {
    if (!audioContextGlobal) inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    const nombreInstrumento = selectorInstrumentoUsuario.value;
    if (!nombreInstrumento) return;

    try {
        if (!instrumentosCacheados[nombreInstrumento]) {
            estadoGrabacion.innerText = `Cargando sonido...`;
        }
        const instrumento = await obtenerInstrumento(audioContextGlobal, nombreInstrumento);
        const momento = audioContextGlobal.currentTime + tiempoInicio;
        instrumento.play(pitchMidi, momento, { duration: duracion, destination: efectoEntrada });
        estadoGrabacion.innerText = `Instrumento listo.`;
    } catch (error) {
        console.error("Error al cargar instrumento:", error);
        estadoGrabacion.innerText = "Error al cargar el instrumento.";
    }
}

// ==========================================
// 5. GRABACIÓN DE MICRÓFONO
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
            const arrayBuffer = await blob.arrayBuffer();
            inicializarMotorDeAudio();
            audioContextGlobal.decodeAudioData(arrayBuffer, (decodedData) => {
                audioGrabadoBuffer = decodedData;
                estadoGrabacion.innerText = "🎤 Grabación de voz lista.";
                btnReproducirMicrofono.disabled = false;
            });

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

btnReproducirMicrofono.addEventListener('click', async () => {
    if (!audioGrabadoBuffer) return;
    inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    const source = audioContextGlobal.createBufferSource();
    source.buffer = audioGrabadoBuffer;
    source.connect(efectoEntrada);
    source.start(audioContextGlobal.currentTime);
    estadoGrabacion.innerText = "🎧 Reproduciendo solo micrófono...";
});

if (btnLimpiarMicrofono) {
    btnLimpiarMicrofono.addEventListener('click', () => {
        if (!audioGrabadoBuffer) return;
        if (confirm("¿Borrar la grabación del micrófono?")) {
            audioGrabadoBuffer = null;
            btnReproducirMicrofono.disabled = true;
            estadoGrabacion.innerText = "🗑 Audio del micrófono borrado.";
        }
    });
}

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

    const teclasNegrasIndices = [1, 3, 6, 8, 10];
    for (let i = 0; i <= (finMidi - inicioMidi); i++) {
        const y = i * altoFila;
        const esTeclaNegra = teclasNegrasIndices.includes((finMidi - i) % 12);
        const rect = new Konva.Rect({ x: 0, y: y, width: 3000, height: altoFila, fill: esTeclaNegra ? '#1a252f' : '#2c3e50', stroke: '#34495e', strokeWidth: 1 });
        konvaLayer.add(rect);
    }

    konvaStage.on('dblclick dbltap', () => {
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
        rectNota.on('dragend', () => { notasDetectadas[index].startTimeSeconds = Math.max(0, rectNota.x() / pxPorSegundo); notasDetectadas[index].pitchMidi = finMidi - Math.round(rectNota.y() / altoFila); });

        konvaLayer.add(rectNota);
    });
    konvaLayer.draw();
}

function inicializarPianoVirtual() {
    if (!pianoVirtualContainer) return;
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

    tocarInstrumento(pitchMidi, 0.5, 0);

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
if (btnOctavaSubir) {
    btnOctavaSubir.addEventListener('click', () => {
        pianoVirtualContainer.scrollBy({ left: anchoTeclaBlanca * 7, behavior: 'smooth' });
    });
}

if (btnOctavaBajar) {
    btnOctavaBajar.addEventListener('click', () => {
        pianoVirtualContainer.scrollBy({ left: -anchoTeclaBlanca * 7, behavior: 'smooth' });
    });
}

// ==========================================
// 8. CONTROLES DE REPRODUCCIÓN SINCRONIZADA
// ==========================================
botonGrabarPiano.addEventListener('click', () => {
    grabando = true;
    tiempoInicioGrabacion = Date.now();
    estadoGrabacion.innerText = "🔴 Grabando MIDI...";
    botonGrabarPiano.disabled = true;
    botonDetenerGrabacion.disabled = false;
});

botonDetenerGrabacion.addEventListener('click', () => {
    grabando = false;
    estadoGrabacion.innerText = "⏹️ Grabación MIDI detenida.";
    botonGrabarPiano.disabled = false;
    botonDetenerGrabacion.disabled = true;
});

botonLimpiar.addEventListener('click', () => {
    if (confirm("¿Borrar todas las notas MIDI?")) {
        notasDetectadas = [];
        actualizarNotasEnPianoRoll();
        estadoGrabacion.innerText = "🗑 Pista MIDI limpiada.";
    }
});

// Reproducción sincronizada: Micrófono + MIDI al mismo tiempo exacto
botonReproducirMelodia.addEventListener('click', async () => {
    if (notasDetectadas.length === 0 && !audioGrabadoBuffer) {
        return alert("Graba audio con el micrófono o dibuja/graba notas MIDI primero.");
    }

    inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    const nombreInstrumento = selectorInstrumentoUsuario.value;
    let instrumento = null;

    if (notasDetectadas.length > 0) {
        estadoGrabacion.innerText = "⏳ Preparando pistas sincronizadas...";
        instrumento = await obtenerInstrumento(audioContextGlobal, nombreInstrumento);
    }

    const tiempoArranque = audioContextGlobal.currentTime + 0.1;

    if (audioGrabadoBuffer) {
        const source = audioContextGlobal.createBufferSource();
        source.buffer = audioGrabadoBuffer;
        source.connect(efectoEntrada);
        source.start(tiempoArranque);
    }

    if (instrumento && notasDetectadas.length > 0) {
        notasDetectadas.forEach(nota => {
            instrumento.play(nota.pitchMidi, tiempoArranque + nota.startTimeSeconds, {
                duration: nota.durationSeconds,
                destination: efectoEntrada
            });
        });
    }

    estadoGrabacion.innerText = "▶️ Reproduciendo mezcla (Mic + MIDI)...";
});

// ==========================================
// 9. EXPORTACIÓN A ARCHIVO WAV
// ==========================================
botonExportarAudio.addEventListener('click', async () => {
    if (notasDetectadas.length === 0 && !audioGrabadoBuffer) {
        return alert("No hay audio ni notas MIDI para exportar.");
    }

    estadoGrabacion.innerText = "⏳ Renderizando archivo WAV...";
    botonExportarAudio.disabled = true;

    try {
        let duracionMidi = 0;
        notasDetectadas.forEach(n => {
            const finNota = n.startTimeSeconds + n.durationSeconds;
            if (finNota > duracionMidi) duracionMidi = finNota;
        });

        const duracionMic = audioGrabadoBuffer ? audioGrabadoBuffer.duration : 0;
        const duracionTotal = Math.max(duracionMidi, duracionMic, 1) + 2.5;
        const sampleRate = 44100;

        const offlineCtx = new OfflineAudioContext(2, Math.ceil(sampleRate * duracionTotal), sampleRate);
        const cadenaOffline = construirCadenaEfectos(offlineCtx, offlineCtx.destination);

        if (audioGrabadoBuffer) {
            const micSource = offlineCtx.createBufferSource();
            micSource.buffer = audioGrabadoBuffer;
            micSource.connect(cadenaOffline.entrada);
            micSource.start(0);
        }

        if (notasDetectadas.length > 0) {
            const nombreInstrumento = selectorInstrumentoUsuario.value;
            const instOffline = await Soundfont.instrument(offlineCtx, nombreInstrumento, { soundfont: 'FluidR3_GM' });
            notasDetectadas.forEach(nota => {
                instOffline.play(nota.pitchMidi, nota.startTimeSeconds, {
                    duration: nota.durationSeconds,
                    destination: cadenaOffline.entrada
                });
            });
        }

        const renderedBuffer = await offlineCtx.startRendering();
        const wavBlob = audioBufferToWav(renderedBuffer);

        const url = URL.createObjectURL(wavBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `EthnoSynth_Mezcla_${Date.now()}.wav`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        estadoGrabacion.innerText = "💾 ¡Archivo WAV exportado!";
    } catch (error) {
        console.error("Error al exportar WAV:", error);
        estadoGrabacion.innerText = "❌ Error al exportar WAV.";
        alert("Hubo un error al generar el WAV.");
    } finally {
        botonExportarAudio.disabled = false;
    }
});

function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;

    const samples = buffer.length;
    const dataSize = samples * blockAlign;
    const arrayBuffer = new ArrayBuffer(44 + dataSize);
    const view = new DataView(arrayBuffer);

    function writeString(offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    }

    writeString(0, 'RIFF');
    view.setUint32(4, 36 + dataSize, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    const channels = [];
    for (let i = 0; i < numChannels; i++) {
        channels.push(buffer.getChannelData(i));
    }

    let offset = 44;
    for (let i = 0; i < samples; i++) {
        for (let channel = 0; channel < numChannels; channel++) {
            let sample = Math.max(-1, Math.min(1, channels[channel][i]));
            sample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
            view.setInt16(offset, sample, true);
            offset += 2;
        }
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// ==========================================
// 10. INICIALIZACIÓN
// ==========================================
inicializarPianoVirtual();
inicializarPianoRoll();