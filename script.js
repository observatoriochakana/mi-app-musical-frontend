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

// Controles de Transporte, Snap y Pre-cuenta
const inputBpm = document.getElementById('inputBpm');
const btnMetronomo = document.getElementById('btnMetronomo');
const selectSnap = document.getElementById('selectSnap');
const chkPreCuenta = document.getElementById('chkPreCuenta');

// Controles Multipista
const btnAgregarPista = document.getElementById('btnAgregarPista');
const listaPistasContainer = document.getElementById('listaPistasContainer');

// Elementos del Micrófono
const chkEscucharMidiAlGrabar = document.getElementById('chkEscucharMidiAlGrabar');
const btnGrabarMicrofono = document.getElementById('btnGrabarMicrofono');
const btnDetenerMicrofono = document.getElementById('btnDetenerMicrofono');
const btnReproducirMicrofono = document.getElementById('btnReproducirMicrofono');
const btnLimpiarMicrofono = document.getElementById('btnLimpiarMicrofono');

// Botones de Octava
const btnOctavaBajar = document.getElementById('btnOctavaBajar');
const btnOctavaSubir = document.getElementById('btnOctavaSubir');

// ==========================================
// 2. CATÁLOGO DE INSTRUMENTOS Y ESTADO MULTIPISTA
// ==========================================
const CATALOGO_INSTRUMENTOS = [
    { valor: 'sitar', nombre: 'Sitar (India)' },
    { valor: 'taiko_drum', nombre: 'Kultrún / Bombo' }, 
    { valor: 'flute', nombre: 'Quena Andina' },
    { valor: 'pan_flute', nombre: 'Zampoña / Siku' },
    { valor: 'french_horn', nombre: 'Trutruka' }, 
    { valor: 'recorder', nombre: 'Pifilka' },
    { valor: 'banjo', nombre: 'Trompe (Arpa de Boca)' },
    { valor: 'steel_drums', nombre: 'Metawe (Cántaro)' }, 
    { valor: 'shakuhachi', nombre: 'Shakuhachi (Japón)' },
    { valor: 'didgeridoo', nombre: 'Didgeridoo' },
    { valor: 'acoustic_guitar_nylon', nombre: 'Charango / Oud' },
    { valor: 'acoustic_guitar_steel', nombre: 'Cuatro Venezolano' },
    { valor: 'acoustic_bass', nombre: 'Contrabajo Pizzicato' },
    { valor: 'kalimba', nombre: 'Kalimba (Mbira)' },
    { valor: 'koto', nombre: 'Koto (Japón)' },
    { valor: 'shamisen', nombre: 'Shamisen (Japón)' },
    { valor: 'fiddle', nombre: 'Erhu (China)' },
    { valor: 'english_horn', nombre: 'Duduk (Armenia)' },
    { valor: 'bagpipe', nombre: 'Gaita Gallega / Celta' },
    { valor: 'acoustic_grand_piano', nombre: 'Piano (Base)' }
];

const COLORES_PISTAS = ['#e74c3c', '#2ecc71', '#3498db', '#f39c12', '#9b59b6', '#1abc9c', '#e84393'];

let pistasMidi = [
    { id: 1, nombre: 'Pista 1', instrumento: 'sitar', volumen: 0.85, mute: false, solo: false, color: COLORES_PISTAS[0], notas: [] }
];
let pistaActivaId = 1;
let contadorPistas = 1;

// Estado de Grabación y Tempo
let bpmActual = 120;
let metronomoActivo = false;
let intervaloMetronomo = null;
let pulsoActual = 0;

let grabando = false;
let contandoPreCuenta = false;
let tiempoInicioGrabacion = 0;
let notasActivas = {};
let nodosMidiEnCurso = [];

// Estado Micrófono
let mediaRecorder = null;
let chunksAudio = [];
let audioGrabadoBuffer = null;

// Rango MIDI y Rejilla
const inicioMidi = 36; 
const finMidi = 84;    
const altoFila = 20;
const pxPorSegundo = 100;
const anchoTeclaBlanca = 50; 

let konvaStage = null;
let konvaLayer = null;

// Motor de Audio
let audioContextGlobal = null;
let masterGain = null;
let efectoEntrada = null;
let instrumentosCacheados = {};

function obtenerPistaActiva() {
    return pistasMidi.find(p => p.id === pistaActivaId) || pistasMidi[0];
}

function obtenerPistasAudibles() {
    const haySolo = pistasMidi.some(p => p.solo);
    return pistasMidi.filter(p => {
        if (haySolo) return p.solo && !p.mute;
        return !p.mute;
    });
}

// ==========================================
// 3. INTERFAZ MULTIPISTA (UI)
// ==========================================
function renderizarListaPistas() {
    if (!listaPistasContainer) return;
    listaPistasContainer.innerHTML = '';

    pistasMidi.forEach(pista => {
        const div = document.createElement('div');
        div.className = `pista-item ${pista.id === pistaActivaId ? 'activa' : ''}`;
        div.style.borderLeftColor = pista.color;

        div.addEventListener('click', (e) => {
            if (['SELECT', 'INPUT', 'BUTTON'].includes(e.target.tagName)) return;
            pistaActivaId = pista.id;
            renderizarListaPistas();
            actualizarNotasEnPianoRoll();
        });

        const opcionesHtml = CATALOGO_INSTRUMENTOS.map(inst => 
            `<option value="${inst.valor}" ${inst.valor === pista.instrumento ? 'selected' : ''}>${inst.nombre}</option>`
        ).join('');

        div.innerHTML = `
            <div class="pista-header">
                <span class="pista-nombre" title="Clic para seleccionar esta pista">${pista.nombre} (${pista.notas.length})</span>
                <div class="pista-btns">
                    <button class="btn-mini btn-mute ${pista.mute ? 'mute-on' : ''}" title="Silenciar">M</button>
                    <button class="btn-mini btn-solo ${pista.solo ? 'solo-on' : ''}" title="Solo">S</button>
                    ${pistasMidi.length > 1 ? '<button class="btn-mini btn-del" title="Eliminar pista">✕</button>' : ''}
                </div>
            </div>
            <div class="pista-controles">
                <select class="sel-inst">${opcionesHtml}</select>
                <input type="range" class="vol-pista" min="0" max="100" value="${Math.round(pista.volumen * 100)}" title="Volumen">
            </div>
        `;

        div.querySelector('.btn-mute').addEventListener('click', () => {
            pista.mute = !pista.mute;
            renderizarListaPistas();
        });

        div.querySelector('.btn-solo').addEventListener('click', () => {
            pista.solo = !pista.solo;
            renderizarListaPistas();
        });

        const btnDel = div.querySelector('.btn-del');
        if (btnDel) {
            btnDel.addEventListener('click', () => {
                if (confirm(`¿Eliminar "${pista.nombre}"?`)) {
                    pistasMidi = pistasMidi.filter(p => p.id !== pista.id);
                    if (pistaActivaId === pista.id) pistaActivaId = pistasMidi[0].id;
                    renderizarListaPistas();
                    actualizarNotasEnPianoRoll();
                }
            });
        }

        div.querySelector('.sel-inst').addEventListener('change', (e) => {
            pista.instrumento = e.target.value;
            pistaActivaId = pista.id;
            renderizarListaPistas();
        });

        div.querySelector('.vol-pista').addEventListener('input', (e) => {
            pista.volumen = parseInt(e.target.value) / 100;
        });

        listaPistasContainer.appendChild(div);
    });
}

if (btnAgregarPista) {
    btnAgregarPista.addEventListener('click', () => {
        contadorPistas++;
        const color = COLORES_PISTAS[(contadorPistas - 1) % COLORES_PISTAS.length];
        const instSugerido = CATALOGO_INSTRUMENTOS[(contadorPistas - 1) % CATALOGO_INSTRUMENTOS.length].valor;
        const nuevaPista = {
            id: contadorPistas,
            nombre: `Pista ${contadorPistas}`,
            instrumento: instSugerido,
            volumen: 0.85,
            mute: false,
            solo: false,
            color: color,
            notas: []
        };
        pistasMidi.push(nuevaPista);
        pistaActivaId = nuevaPista.id;
        renderizarListaPistas();
        actualizarNotasEnPianoRoll();
        estadoGrabacion.innerText = `✨ ${nuevaPista.nombre} creada y seleccionada.`;
    });
}

// ==========================================
// 4. MOTOR DE AUDIO, EFECTOS Y CUANTIZACIÓN
// ==========================================
function cuantizarTiempo(segundos) {
    const factorPulso = selectSnap ? parseFloat(selectSnap.value) : 0;
    if (!factorPulso || factorPulso <= 0) {
        return Math.max(0, Math.round(segundos * 100) / 100);
    }
    const segundosPorPulso = 60 / bpmActual;
    const pasoRejilla = segundosPorPulso * factorPulso;
    return Math.max(0, Math.round(segundos / pasoRejilla) * pasoRejilla);
}

function construirCadenaEfectos(ctx, destinoFinal) {
    const entrada = ctx.createGain();

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

    const delayNode = ctx.createDelay();
    delayNode.delayTime.value = 0.3;
    const delayFeedback = ctx.createGain();
    delayFeedback.gain.value = 0.4;
    delayNode.connect(delayFeedback);
    delayFeedback.connect(delayNode);
    const delayGain = ctx.createGain();
    delayGain.gain.value = delaySlider ? parseInt(delaySlider.value) / 100 : 0.2;

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
            valReverb.innerText = reverbSlider.value;
            cadena.reverbGain.gain.value = parseInt(reverbSlider.value) / 100;
        });
    }
    if (delaySlider) {
        delaySlider.addEventListener('input', () => {
            valDelay.innerText = delaySlider.value;
            cadena.delayGain.gain.value = parseInt(delaySlider.value) / 100;
        });
    }
}

// ==========================================
// 5. METRÓNOMO Y PRE-CUENTA (COUNT-IN)
// ==========================================
function tocarClicMetronomo(esTiempoFuerte, tiempoProgramado = null) {
    if (!audioContextGlobal) inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') audioContextGlobal.resume();

    const osc = audioContextGlobal.createOscillator();
    const gain = audioContextGlobal.createGain();

    osc.frequency.value = esTiempoFuerte ? 1050 : 620;
    osc.type = 'triangle';

    const t = tiempoProgramado !== null ? tiempoProgramado : audioContextGlobal.currentTime;
    gain.gain.setValueAtTime(0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);

    osc.connect(gain);
    gain.connect(masterGain);

    osc.start(t);
    osc.stop(t + 0.06);
}

function iniciarMetronomo() {
    detenerMetronomo();
    pulsoActual = 0;
    const msPorPulso = (60 / bpmActual) * 1000;

    tocarClicMetronomo(true);
    pulsoActual = 1;

    intervaloMetronomo = setInterval(() => {
        tocarClicMetronomo(pulsoActual % 4 === 0);
        pulsoActual++;
    }, msPorPulso);
}

function detenerMetronomo() {
    if (intervaloMetronomo) {
        clearInterval(intervaloMetronomo);
        intervaloMetronomo = null;
    }
}

function ejecutarPreCuenta(alTerminar) {
    if (!chkPreCuenta || !chkPreCuenta.checked) {
        alTerminar();
        return;
    }

    contandoPreCuenta = true;
    detenerMetronomo();
    const msPorPulso = (60 / bpmActual) * 1000;
    let conteo = 1;

    estadoGrabacion.innerText = `⏳ Pre-cuenta: 1...`;
    tocarClicMetronomo(true);

    const timerPre = setInterval(() => {
        conteo++;
        if (conteo <= 4) {
            estadoGrabacion.innerText = `⏳ Pre-cuenta: ${conteo}...`;
            tocarClicMetronomo(false);
        } else {
            clearInterval(timerPre);
            contandoPreCuenta = false;
            if (metronomoActivo) iniciarMetronomo();
            alTerminar();
        }
    }, msPorPulso);
}

if (btnMetronomo) {
    btnMetronomo.addEventListener('click', () => {
        metronomoActivo = !metronomoActivo;
        if (metronomoActivo) {
            btnMetronomo.innerText = '⏱️ Metrónomo: ON';
            btnMetronomo.style.backgroundColor = 'var(--accent-blue)';
            iniciarMetronomo();
        } else {
            btnMetronomo.innerText = '⏱️ Metrónomo: OFF';
            btnMetronomo.style.backgroundColor = '#2d2d2d';
            detenerMetronomo();
        }
    });
}

if (inputBpm) {
    inputBpm.addEventListener('change', () => {
        let nuevoBpm = parseInt(inputBpm.value);
        if (isNaN(nuevoBpm) || nuevoBpm < 40) nuevoBpm = 40;
        if (nuevoBpm > 240) nuevoBpm = 240;
        inputBpm.value = nuevoBpm;
        bpmActual = nuevoBpm;

        if (metronomoActivo) iniciarMetronomo();
        inicializarPianoRoll();
        actualizarNotasEnPianoRoll();
    });
}

// ==========================================
// 6. REPRODUCCIÓN DE INSTRUMENTOS Y PISTAS
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

async function tocarInstrumento(pitchMidi, duracion = 0.5) {
    if (!audioContextGlobal) inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    const pista = obtenerPistaActiva();
    if (!pista || !pista.instrumento) return;

    try {
        const instrumento = await obtenerInstrumento(audioContextGlobal, pista.instrumento);
        instrumento.play(pitchMidi, audioContextGlobal.currentTime, {
            duration: duracion,
            gain: pista.volumen * 1.5,
            destination: efectoEntrada
        });
    } catch (error) {
        console.error("Error al tocar instrumento:", error);
    }
}

function detenerReproduccionMidiEnCurso() {
    nodosMidiEnCurso.forEach(nodo => {
        try {
            if (nodo && typeof nodo.stop === 'function') nodo.stop();
        } catch (e) {}
    });
    nodosMidiEnCurso = [];
}

async function programarPistasMidi(tiempoArranque, excluirPistaActiva = false) {
    const pistasAudibles = obtenerPistasAudibles().filter(p => 
        p.notas.length > 0 && (!excluirPistaActiva || p.id !== pistaActivaId)
    );
    if (pistasAudibles.length === 0) return;

    const promesasInst = pistasAudibles.map(p => obtenerInstrumento(audioContextGlobal, p.instrumento));
    const instrumentosCargados = await Promise.all(promesasInst);

    pistasAudibles.forEach((pista, idx) => {
        const inst = instrumentosCargados[idx];
        pista.notas.forEach(nota => {
            const nodo = inst.play(nota.pitchMidi, tiempoArranque + nota.startTimeSeconds, {
                duration: nota.durationSeconds,
                gain: pista.volumen * 1.5,
                destination: efectoEntrada
            });
            nodosMidiEnCurso.push(nodo);
        });
    });
}

// ==========================================
// 7. GRABACIÓN DE MICRÓFONO (CON PRE-CUENTA)
// ==========================================
btnGrabarMicrofono.addEventListener('click', async () => {
    if (contandoPreCuenta) return;

    try {
        inicializarMotorDeAudio();
        if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

        const stream = await navigator.mediaDevices.getUserMedia({
            audio: { echoCancellation: true, noiseSuppression: true }
        });

        btnGrabarMicrofono.disabled = true;
        btnReproducirMicrofono.disabled = true;

        ejecutarPreCuenta(async () => {
            mediaRecorder = new MediaRecorder(stream);
            chunksAudio = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksAudio.push(e.data);
            };

            mediaRecorder.onstop = async () => {
                detenerReproduccionMidiEnCurso();
                const blob = new Blob(chunksAudio, { type: 'audio/webm' });
                const arrayBuffer = await blob.arrayBuffer();
                audioContextGlobal.decodeAudioData(arrayBuffer, (decodedData) => {
                    audioGrabadoBuffer = decodedData;
                    estadoGrabacion.innerText = "🎤 Grabación de voz lista.";
                    btnReproducirMicrofono.disabled = false;
                });
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            btnDetenerMicrofono.disabled = false;

            const quiereEscucharMidi = chkEscucharMidiAlGrabar && chkEscucharMidiAlGrabar.checked;
            if (quiereEscucharMidi) {
                detenerReproduccionMidiEnCurso();
                await programarPistasMidi(audioContextGlobal.currentTime + 0.05, false);
                estadoGrabacion.innerText = "🔴 Grabando Mic + Pistas MIDI...";
            } else {
                estadoGrabacion.innerText = "🔴 Grabando micrófono...";
            }
        });
    } catch (error) {
        console.error("Error al acceder al micrófono:", error);
        btnGrabarMicrofono.disabled = false;
        alert("No se pudo acceder al micrófono.");
    }
});

btnDetenerMicrofono.addEventListener('click', () => {
    detenerReproduccionMidiEnCurso();
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
// 8. PIANO ROLL (CON REJILLA BPM Y MULTIPISTA)
// ==========================================
function inicializarPianoRoll() {
    const container = document.getElementById('pianoRollContainer');
    if (!container) return;
    if (konvaStage) konvaStage.destroy();

    const anchoTotal = 3000;
    const altoTotal = (finMidi - inicioMidi + 1) * altoFila;

    konvaStage = new Konva.Stage({ container: 'pianoRollContainer', width: anchoTotal, height: altoTotal });
    konvaLayer = new Konva.Layer();
    konvaStage.add(konvaLayer);

    // Filas horizontales
    const teclasNegrasIndices = [1, 3, 6, 8, 10];
    for (let i = 0; i <= (finMidi - inicioMidi); i++) {
        const y = i * altoFila;
        const esTeclaNegra = teclasNegrasIndices.includes((finMidi - i) % 12);
        const rect = new Konva.Rect({ 
            x: 0, y: y, width: anchoTotal, height: altoFila, 
            fill: esTeclaNegra ? '#1a252f' : '#2c3e50', 
            stroke: '#34495e', strokeWidth: 0.5 
        });
        konvaLayer.add(rect);
    }

    // Líneas verticales según BPM y subdivisión
    const segundosPorPulso = 60 / bpmActual;
    const pxPorPulso = segundosPorPulso * pxPorSegundo;
    const totalPulsos = Math.floor(anchoTotal / pxPorPulso);

    for (let p = 0; p <= totalPulsos; p++) {
        const x = p * pxPorPulso;
        const esInicioCompas = p % 4 === 0;
        const linea = new Konva.Line({
            points: [x, 0, x, altoTotal],
            stroke: esInicioCompas ? '#95a5a6' : '#3d566e',
            strokeWidth: esInicioCompas ? 1.5 : 0.8
        });
        konvaLayer.add(linea);
    }

    // Dibujar nota con doble clic (cuantizada)
    konvaStage.on('dblclick dbltap', () => {
        const pointerPos = konvaStage.getPointerPosition();
        const tiempoBruto = pointerPos.x / pxPorSegundo;
        const tiempo = cuantizarTiempo(tiempoBruto);
        const pitch = finMidi - Math.floor(pointerPos.y / altoFila);
        const duracionDefault = selectSnap && parseFloat(selectSnap.value) > 0 
            ? (60 / bpmActual) * parseFloat(selectSnap.value) 
            : 0.5;

        const pista = obtenerPistaActiva();
        pista.notas.push({ 
            startTimeSeconds: tiempo, 
            pitchMidi: pitch, 
            durationSeconds: Math.max(0.15, duracionDefault), 
            amplitude: 1 
        });
        tocarInstrumento(pitch, 0.3);
        renderizarListaPistas();
        actualizarNotasEnPianoRoll();
    });

    konvaLayer.draw();
}

function actualizarNotasEnPianoRoll() {
    if (!konvaLayer) return;
    konvaLayer.find('.nota-rect').forEach(nodo => nodo.destroy());

    // 1. Notas de otras pistas (referencia visual semitransparente)
    pistasMidi.forEach(pista => {
        if (pista.id === pistaActivaId || pista.mute) return;
        pista.notas.forEach(nota => {
            const rectFantasma = new Konva.Rect({
                x: nota.startTimeSeconds * pxPorSegundo,
                y: (finMidi - nota.pitchMidi) * altoFila,
                width: Math.max(10, nota.durationSeconds * pxPorSegundo),
                height: altoFila - 2,
                fill: pista.color,
                cornerRadius: 3,
                opacity: 0.25,
                listening: false,
                name: 'nota-rect'
            });
            konvaLayer.add(rectFantasma);
        });
    });

    // 2. Notas de la pista activa (editables)
    const pistaActiva = obtenerPistaActiva();
    pistaActiva.notas.forEach((nota, index) => {
        const x = nota.startTimeSeconds * pxPorSegundo;
        const ancho = Math.max(10, nota.durationSeconds * pxPorSegundo);
        const y = (finMidi - nota.pitchMidi) * altoFila;

        const rectNota = new Konva.Rect({ 
            x: x, y: y, width: ancho, height: altoFila - 2, 
            fill: pistaActiva.color, stroke: '#ffffff', strokeWidth: 0.7,
            cornerRadius: 3, opacity: 0.95, draggable: true, name: 'nota-rect' 
        });

        rectNota.on('click', (e) => { 
            e.cancelBubble = true; 
            pistaActiva.notas.splice(index, 1); 
            renderizarListaPistas();
            actualizarNotasEnPianoRoll(); 
        });

        rectNota.on('dragend', () => { 
            const tiempoCuantizado = cuantizarTiempo(rectNota.x() / pxPorSegundo);
            const nuevoPitch = Math.max(inicioMidi, Math.min(finMidi, finMidi - Math.round(rectNota.y() / altoFila)));
            pistaActiva.notas[index].startTimeSeconds = tiempoCuantizado; 
            pistaActiva.notas[index].pitchMidi = nuevoPitch;
            actualizarNotasEnPianoRoll();
        });

        konvaLayer.add(rectNota);
    });

    konvaLayer.draw();
}

// ==========================================
// 9. PIANO VIRTUAL Y GRABACIÓN EN VIVO
// ==========================================
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
        Object.keys(notasActivas).forEach(pitch => soltarTecla(parseInt(pitch)));
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
    const duracion = Math.max(0.12, tiempoActual - notasActivas[pitchMidi].inicio);
    const inicioCuantizado = cuantizarTiempo(notasActivas[pitchMidi].inicio);

    const pista = obtenerPistaActiva();
    pista.notas.push({ 
        startTimeSeconds: inicioCuantizado, 
        durationSeconds: duracion, 
        pitchMidi: pitchMidi, 
        amplitude: 1 
    });

    delete notasActivas[pitchMidi];
    renderizarListaPistas();
    actualizarNotasEnPianoRoll();
}

if (btnOctavaSubir) {
    btnOctavaSubir.addEventListener('click', () => pianoVirtualContainer.scrollBy({ left: anchoTeclaBlanca * 7, behavior: 'smooth' }));
}
if (btnOctavaBajar) {
    btnOctavaBajar.addEventListener('click', () => pianoVirtualContainer.scrollBy({ left: -anchoTeclaBlanca * 7, behavior: 'smooth' }));
}

// ==========================================
// 10. CONTROLES DE GRABACIÓN Y REPRODUCCIÓN TOTAL
// ==========================================
botonGrabarPiano.addEventListener('click', async () => {
    if (contandoPreCuenta) return;
    inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();

    botonGrabarPiano.disabled = true;

    ejecutarPreCuenta(async () => {
        grabando = true;
        tiempoInicioGrabacion = Date.now();
        botonDetenerGrabacion.disabled = false;

        detenerReproduccionMidiEnCurso();
        await programarPistasMidi(audioContextGlobal.currentTime + 0.02, true);

        const pista = obtenerPistaActiva();
        estadoGrabacion.innerText = `🔴 Grabando en ${pista.nombre}...`;
    });
});

botonDetenerGrabacion.addEventListener('click', () => {
    grabando = false;
    detenerReproduccionMidiEnCurso();
    estadoGrabacion.innerText = "⏹️ Grabación MIDI detenida.";
    botonGrabarPiano.disabled = false;
    botonDetenerGrabacion.disabled = true;
});

botonLimpiar.addEventListener('click', () => {
    const pista = obtenerPistaActiva();
    if (pista.notas.length === 0) return;
    if (confirm(`¿Borrar todas las notas de "${pista.nombre}"?`)) {
        detenerReproduccionMidiEnCurso();
        pista.notas = [];
        renderizarListaPistas();
        actualizarNotasEnPianoRoll();
        estadoGrabacion.innerText = `🗑 Notas de ${pista.nombre} borradas.`;
    }
});

botonReproducirMelodia.addEventListener('click', async () => {
    const pistasAudibles = obtenerPistasAudibles().filter(p => p.notas.length > 0);
    if (pistasAudibles.length === 0 && !audioGrabadoBuffer) {
        return alert("Graba audio con el micrófono o agrega notas en una pista activa.");
    }

    inicializarMotorDeAudio();
    if (audioContextGlobal.state === 'suspended') await audioContextGlobal.resume();
    detenerReproduccionMidiEnCurso();

    estadoGrabacion.innerText = "⏳ Preparando mezcla...";
    const tiempoArranque = audioContextGlobal.currentTime + 0.1;

    if (audioGrabadoBuffer) {
        const source = audioContextGlobal.createBufferSource();
        source.buffer = audioGrabadoBuffer;
        source.connect(efectoEntrada);
        source.start(tiempoArranque);
    }

    await programarPistasMidi(tiempoArranque, false);
    estadoGrabacion.innerText = "▶️ Reproduciendo mezcla total...";
});

// ==========================================
// 11. EXPORTACIÓN MULTIPISTA A ARCHIVO WAV
// ==========================================
botonExportarAudio.addEventListener('click', async () => {
    const pistasAudibles = obtenerPistasAudibles().filter(p => p.notas.length > 0);
    if (pistasAudibles.length === 0 && !audioGrabadoBuffer) {
        return alert("No hay audio ni pistas MIDI activas para exportar.");
    }

    estadoGrabacion.innerText = "⏳ Renderizando WAV multipista...";
    botonExportarAudio.disabled = true;

    try {
        let duracionMidi = 0;
        pistasAudibles.forEach(pista => {
            pista.notas.forEach(n => {
                const finNota = n.startTimeSeconds + n.durationSeconds;
                if (finNota > duracionMidi) duracionMidi = finNota;
            });
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

        for (const pista of pistasAudibles) {
            const instOffline = await Soundfont.instrument(offlineCtx, pista.instrumento, { soundfont: 'FluidR3_GM' });
            pista.notas.forEach(nota => {
                instOffline.play(nota.pitchMidi, nota.startTimeSeconds, {
                    duration: nota.durationSeconds,
                    gain: pista.volumen * 1.5,
                    destination: cadenaOffline.entrada
                });
            });
        }

        const renderedBuffer = await offlineCtx.startRendering();
        const wavBlob = audioBufferToWav(renderedBuffer);

        const url = URL.createObjectURL(wavBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `EthnoSynth_Multipista_${Date.now()}.wav`;
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
        for (let i = 0; i < string.length; i++) view.setUint8(offset + i, string.charCodeAt(i));
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
    for (let i = 0; i < numChannels; i++) channels.push(buffer.getChannelData(i));

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
// 12. INICIALIZACIÓN
// ==========================================
renderizarListaPistas();
inicializarPianoVirtual();
inicializarPianoRoll();