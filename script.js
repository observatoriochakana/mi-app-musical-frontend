// ==========================================
// 1. ELEMENTOS DEL HTML
// ==========================================
const botonGrabar = document.getElementById('botonGrabar');
const botonDetener = document.getElementById('botonDetener');
const zonaReproductor = document.getElementById('zonaReproductor');
const reproductorAudio = document.getElementById('reproductorAudio');
const botonDescargar = document.getElementById('botonDescargar');
const estadoTexto = document.getElementById('estadoTexto');
const botonReproducirMelodia = document.getElementById('botonReproducirMelodia');
const selectorInstrumentoUsuario = document.getElementById('selectorInstrumentoUsuario');
const selectorEstiloUsuario = document.getElementById('selectorEstiloUsuario');
const botonExportarAudio = document.getElementById('botonExportarAudio');
const archivoAudio = document.getElementById('archivoAudio');
const botonProcesarArchivo = document.getElementById('botonProcesarArchivo');

// Elementos Admin
const nuevoNombre = document.getElementById('nuevoNombre');
const nuevoSonido = document.getElementById('nuevoSonido');
const botonAgregarInstrumento = document.getElementById('botonAgregarInstrumento');
const listaInstrumentosDiv = document.getElementById('listaInstrumentos');
const nuevoNombreEtnicos = document.getElementById('nuevoNombreEtnicos');
const archivoSF2 = document.getElementById('archivoSF2');
const programaSF2 = document.getElementById('programaSF2');
const botonCargarSF2 = document.getElementById('botonCargarSF2');
const nuevoEstiloNombre = document.getElementById('nuevoEstiloNombre');
const nuevoEstiloBPM = document.getElementById('nuevoEstiloBPM');
const botonAgregarEstilo = document.getElementById('botonAgregarEstilo');
const listaEstilosDiv = document.getElementById('listaEstilos');

// Controles de Efectos
const reverbSlider = document.getElementById('reverbSlider');
const delaySlider = document.getElementById('delaySlider');
const flangerSlider = document.getElementById('flangerSlider');
const wahSlider = document.getElementById('wahSlider');

let mediaRecorder, audioChunks = [], stream;
let notasDetectadas = [];

// ==========================================
// 2. BASE DE DATOS (localStorage e IndexedDB)
// ==========================================
let catalogoInstrumentos = JSON.parse(localStorage.getItem('misInstrumentos')) || [{ nombre: "Piano", sonido: "acoustic_grand_piano", tipo: "builtin" }];
let catalogoEstilos = JSON.parse(localStorage.getItem('misEstilos')) || [{ nombre: "Clásico", bpm: 120 }];

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
// 3. ADMINISTRACIÓN Y LISTAS
// ==========================================
function actualizarListas() {
    listaInstrumentosDiv.innerHTML = "Instrumentos:<br>";
    selectorInstrumentoUsuario.innerHTML = "";
    catalogoInstrumentos.forEach(inst => {
        listaInstrumentosDiv.innerHTML += `- ${inst.nombre} (${inst.tipo === 'sf2' ? 'Étnico .sf2' : 'Estándar'})<br>`;
        selectorInstrumentoUsuario.innerHTML += `<option value='${JSON.stringify(inst)}'>${inst.nombre}</option>`;
    });

    listaEstilosDiv.innerHTML = "Estilos:<br>";
    selectorEstiloUsuario.innerHTML = `<option value="">-- Sin estilo --</option>`;
    catalogoEstilos.forEach(est => {
        listaEstilosDiv.innerHTML += `- ${est.nombre} (${est.bpm} BPM)<br>`;
        selectorEstiloUsuario.innerHTML += `<option value="${est.bpm}">${est.nombre}</option>`;
    });
}

botonAgregarInstrumento.addEventListener('click', () => {
    if (!nuevoNombre.value) return alert("Escribe un nombre");
    catalogoInstrumentos.push({ nombre: nuevoNombre.value, sonido: nuevoSonido.value, tipo: "builtin" });
    localStorage.setItem('misInstrumentos', JSON.stringify(catalogoInstrumentos));
    nuevoNombre.value = "";
    actualizarListas();
});

botonCargarSF2.addEventListener('click', async () => {
    const file = archivoSF2.files[0];
    if (!file) return alert("Selecciona un archivo .sf2");
    if (!nuevoNombreEtnicos.value) return alert("Escribe un nombre para el instrumento");
    try {
        const arrayBuffer = await file.arrayBuffer();
        const db = await openDB();
        const tx = db.transaction('sf2files', 'readwrite');
        await tx.objectStore('sf2files').put({ nombre: nuevoNombreEtnicos.value, buffer: arrayBuffer });
        catalogoInstrumentos.push({ nombre: nuevoNombreEtnicos.value, tipo: "sf2", programa: parseInt(programaSF2.value) || 0 });
        localStorage.setItem('misInstrumentos', JSON.stringify(catalogoInstrumentos));
        actualizarListas();
        alert(`¡${nuevoNombreEtnicos.value} agregado!`);
        nuevoNombreEtnicos.value = ""; archivoSF2.value = "";
    } catch (error) { console.error(error); alert("Error al cargar el .sf2."); }
});

botonAgregarEstilo.addEventListener('click', () => {
    if (!nuevoEstiloNombre.value) return alert("Escribe un nombre");
    catalogoEstilos.push({ nombre: nuevoEstiloNombre.value, bpm: parseInt(nuevoEstiloBPM.value) });
    localStorage.setItem('misEstilos', JSON.stringify(catalogoEstilos));
    nuevoEstiloNombre.value = "";
    actualizarListas();
});

actualizarListas();

// Actualizar sliders visualmente
reverbSlider.addEventListener('input', (e) => document.getElementById('valReverb').innerText = e.target.value);
delaySlider.addEventListener('input', (e) => document.getElementById('valDelay').innerText = e.target.value);
flangerSlider.addEventListener('input', (e) => document.getElementById('valFlanger').innerText = e.target.value);
wahSlider.addEventListener('input', (e) => document.getElementById('valWah').innerText = e.target.value);

// ==========================================
// 4. GRABACIÓN Y ANÁLISIS (Basic Pitch)
// ==========================================
botonGrabar.addEventListener('click', async () => {
    try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => audioChunks.push(event.data);
        
        mediaRecorder.onstop = async () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            estadoTexto.innerText = "Analizando... 🎵"; estadoTexto.style.display = 'block'; 
            botonReproducirMelodia.disabled = true; botonExportarAudio.style.display = 'none';

            const audioContext = new AudioContext({ sampleRate: 22050 });
            const decodedData = await audioContext.decodeAudioData(await audioBlob.arrayBuffer());
            const basicPitch = new BasicPitch("https://raw.githubusercontent.com/spotify/basic-pitch-ts/main/model/model.json");

            const frames = [], onsets = [], contours = [];
            await basicPitch.evaluateModel(decodedData,
                (f, o, c) => { frames.push(...f); onsets.push(...o); contours.push(...c); },
                (progress) => { estadoTexto.innerText = `Analizando... ${Math.round(progress * 100)}%`; }
            );

            notasDetectadas = basicPitch.outputToNotesPoly(frames, onsets);
            
            if (notasDetectadas.length > 0) {
                estadoTexto.innerText = `¡Listo! ${notasDetectadas.length} notas.`;
                botonReproducirMelodia.disabled = false;
                botonExportarAudio.style.display = 'inline-block';
            } else { estadoTexto.innerText = "No se detectaron notas."; }

            reproductorAudio.src = URL.createObjectURL(audioBlob);
            botonDescargar.href = reproductorAudio.src;
            zonaReproductor.style.display = 'block';
            stream.getTracks().forEach(track => track.stop());
            audioChunks = [];
        };
        mediaRecorder.start();
        botonGrabar.disabled = true; botonDetener.disabled = false; zonaReproductor.style.display = 'none'; estadoTexto.style.display = 'none';
    } catch (error) { console.error(error); }
});

botonDetener.addEventListener('click', () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop(); botonGrabar.disabled = false; botonDetener.disabled = true;
    }
});

// ==========================================
// 4b. PROCESAMIENTO DE ARCHIVO (Para cuando no hay micrófono)
// ==========================================
botonProcesarArchivo.addEventListener('click', async () => {
    const file = archivoAudio.files[0];
    if (!file) return alert("Selecciona un archivo de audio primero");

    estadoTexto.innerText = "Analizando archivo de audio... 🎵";
    estadoTexto.style.display = 'block';
    botonReproducirMelodia.disabled = true;
    botonExportarAudio.style.display = 'none';

    try {
        const arrayBuffer = await file.arrayBuffer();
        const audioContext = new AudioContext({ sampleRate: 22050 });
        const decodedData = await audioContext.decodeAudioData(arrayBuffer);
        const basicPitch = new BasicPitch("https://raw.githubusercontent.com/spotify/basic-pitch-ts/main/model/model.json");
        
        const frames = [], onsets = [], contours = [];
        await basicPitch.evaluateModel(decodedData,
            (f, o, c) => { frames.push(...f); onsets.push(...o); contours.push(...c); },
            (progress) => { estadoTexto.innerText = `Analizando... ${Math.round(progress * 100)}%`; }
        );

        notasDetectadas = basicPitch.outputToNotesPoly(frames, onsets);
        
        if (notasDetectadas.length > 0) {
            estadoTexto.innerText = `¡Listo! ${notasDetectadas.length} notas detectadas.`;
            botonReproducirMelodia.disabled = false;
            botonExportarAudio.style.display = 'inline-block';
            reproductorAudio.src = URL.createObjectURL(file);
            zonaReproductor.style.display = 'block';
        } else {
            estadoTexto.innerText = "No se detectaron notas claras en el archivo.";
        }
    } catch (error) {
        console.error("Error al procesar el archivo:", error);
        estadoTexto.innerText = "Error: Asegúrate de que sea un archivo de audio válido.";
    }
});

// ==========================================
// 5. CONSTRUCTOR DE CADENA DE EFECTOS
// ==========================================
function construirCadenaDeEfectos(ac) {
    const wahNode = ac.createBiquadFilter();
    wahNode.type = "lowpass"; 
    wahNode.frequency.value = 400 + (parseInt(wahSlider.value) * 15); 
    wahNode.Q.value = 10;
    const wahGain = ac.createGain();
    wahGain.gain.value = parseInt(wahSlider.value) / 100;

    const flangerDelay = ac.createDelay();
    flangerDelay.delayTime.value = 0.005;
    const flangerLFO = ac.createOscillator();
    flangerLFO.frequency.value = 0.5;
    const flangerLFO_Gain = ac.createGain();
    flangerLFO_Gain.gain.value = 0.002;
    flangerLFO.connect(flangerLFO_Gain); flangerLFO_Gain.connect(flangerDelay.delayTime); flangerLFO.start();
    const flangerGain = ac.createGain();
    flangerGain.gain.value = parseInt(flangerSlider.value) / 100;

    const delayNode = ac.createDelay();
    delayNode.delayTime.value = 0.3;
    const delayFeedback = ac.createGain();
    delayFeedback.gain.value = 0.4;
    delayNode.connect(delayFeedback); delayFeedback.connect(delayNode);
    const delayGain = ac.createGain();
    delayGain.gain.value = parseInt(delaySlider.value) / 100;

    const reverbNode = ac.createConvolver();
    const length = ac.sampleRate * 2.5;
    const impulse = ac.createBuffer(2, length, ac.sampleRate);
    for (let i = 0; i < 2; i++) {
        const channel = impulse.getChannelData(i);
        for (let j = 0; j < length; j++) {
            channel[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / length, 2);
        }
    }
    reverbNode.buffer = impulse;
    const reverbGain = ac.createGain();
    reverbGain.gain.value = parseInt(reverbSlider.value) / 100;

    const masterGain = ac.createGain();
    masterGain.connect(ac.destination);

    wahNode.connect(wahGain); wahGain.connect(flangerDelay);
    flangerDelay.connect(flangerGain); flangerGain.connect(delayNode);
    delayNode.connect(delayGain); delayGain.connect(reverbNode);
    reverbNode.connect(reverbGain); reverbGain.connect(masterGain);

    return { entrada: wahNode, maestro: masterGain };
}

// ==========================================
// 6. REPRODUCCIÓN EN VIVO (Con SpessaSynth y Render)
// ==========================================
botonReproducirMelodia.addEventListener('click', async () => {
    if (notasDetectadas.length === 0) return;

    const instrumentoSeleccionado = JSON.parse(selectorInstrumentoUsuario.value);
    const bpmEstilo = parseInt(selectorEstiloUsuario.value) || 120; 

    estadoTexto.innerText = `Cargando ${instrumentoSeleccionado.nombre}...`;
    const ac = new AudioContext();
    
    const { entrada, maestro } = construirCadenaDeEfectos(ac);

    if (instrumentoSeleccionado.tipo === 'builtin') {
        Soundfont.instrument(ac, instrumentoSeleccionado.sonido).then(function (instrumento) {
            estadoTexto.innerText = "¡Reproduciendo! 🎶";
            
            instrumento.output.connect(entrada);
            const directGain = ac.createGain();
            directGain.gain.value = 0.7; 
            instrumento.output.connect(directGain);
            directGain.connect(maestro);

            notasDetectadas.forEach(nota => {
                const beatDuration = 60 / bpmEstilo; 
                const tiempoInicio = ac.currentTime + (nota.startTimeSeconds * beatDuration) + 0.1;
                const duracion = (nota.durationSeconds || 0.5) * beatDuration;
                instrumento.play(nota.pitchMidi, tiempoInicio, { duration: duracion });
            });
        });
    } else if (instrumentoSeleccionado.tipo === 'sf2') {
        try {
            let data;
            const db = await openDB();
            const tx = db.transaction('sf2files', 'readonly');
            const store = tx.objectStore('sf2files');
            
            data = await store.get(instrumentoSeleccionado.nombre);
            
            if (!data || !data.buffer) {
                estadoTexto.innerText = `Descargando ${instrumentoSeleccionado.nombre} del servidor...`;
                // AQUÍ APUNTA A RENDER
                const respuesta = await fetch(`https://backend-musica-app.onrender.com/instrumentos/${instrumentoSeleccionado.nombre}`);
                if (!respuesta.ok) throw new Error("No se pudo descargar el archivo");
                
                const arrayBuffer = await respuesta.arrayBuffer();
                
                const txWrite = db.transaction('sf2files', 'readwrite');
                await txWrite.objectStore('sf2files').put({ nombre: instrumentoSeleccionado.nombre, buffer: arrayBuffer });
                
                data = { buffer: arrayBuffer };
            }

            await ac.audioWorklet.addModule("https://cdn.jsdelivr.net/npm/spessasynth_lib@4.4.7/dist/spessasynth_processor.min.js");
            const synth = new WorkletSynthesizer(ac);
            await synth.soundBankManager.addSoundBank(data.buffer, "main");
            await synth.isReady;

            synth.connect(entrada);
            const directGain = ac.createGain();
            directGain.gain.value = 0.7;
            synth.connect(directGain);
            directGain.connect(maestro);

            synth.programChange(0, instrumentoSeleccionado.programa);
            estadoTexto.innerText = "¡Reproduciendo con instrumento étnico! 🎶";

            notasDetectadas.forEach(nota => {
                const beatDuration = 60 / bpmEstilo; 
                const tiempoInicio = ac.currentTime + (nota.startTimeSeconds * beatDuration) + 0.1;
                const duracion = (nota.durationSeconds || 0.5) * beatDuration;
                
                synth.noteOn(0, nota.pitchMidi, 127);
                setTimeout(() => synth.noteOff(0, nota.pitchMidi), duracion * 1000);
            });

        } catch (err) {
            console.error("Error con SF2:", err);
            estadoTexto.innerText = "Error al cargar el instrumento étnico.";
        }
    }
});

// ==========================================
// 7. EXPORTACIÓN A WAV (Offline Render)
// ==========================================
botonExportarAudio.addEventListener('click', async () => {
    if (notasDetectadas.length === 0) return;

    const instrumentoSeleccionado = JSON.parse(selectorInstrumentoUsuario.value);
    const bpmEstilo = parseInt(selectorEstiloUsuario.value) || 120; 
    
    const ultimaNota = notasDetectadas[notasDetectadas.length - 1];
    const duracionTotal = (ultimaNota.startTimeSeconds + (ultimaNota.durationSeconds || 1)) * (60 / bpmEstilo) + 3; 
    
    estadoTexto.innerText = "Renderizando audio... ⏳ (puede tardar)";
    const offlineCtx = new OfflineAudioContext(2, 44100 * duracionTotal, 44100);

    const { entrada, maestro } = construirCadenaDeEfectos(offlineCtx);

    if (instrumentoSeleccionado.tipo === 'builtin') {
        Soundfont.instrument(offlineCtx, instrumentoSeleccionado.sonido).then(function (instrumento) {
            instrumento.output.connect(entrada);
            const directGain = offlineCtx.createGain(); directGain.gain.value = 0.7;
            instrumento.output.connect(directGain); directGain.connect(maestro);

            notasDetectadas.forEach(nota => {
                const beatDuration = 60 / bpmEstilo; 
                const tiempoInicio = (nota.startTimeSeconds * beatDuration) + 0.1;
                const duracion = (nota.durationSeconds || 0.5) * beatDuration;
                instrumento.play(nota.pitchMidi, tiempoInicio, { duration: duracion });
            });
            offlineCtx.startRendering().then(renderedBuffer => descargarWAV(renderedBuffer, instrumentoSeleccionado.nombre));
        });
    } else if (instrumentoSeleccionado.tipo === 'sf2') {
        try {
            const db = await openDB();
            const data = await db.transaction('sf2files', 'readonly').objectStore('sf2files').get(instrumentoSeleccionado.nombre);
            
            if (data) {
                await offlineCtx.audioWorklet.addModule("https://cdn.jsdelivr.net/npm/spessasynth_lib@4.4.7/dist/spessasynth_processor.min.js");

                const synth = new WorkletSynthesizer(offlineCtx, { eventsEnabled: false });
                await synth.soundBankManager.addSoundBank(data.buffer, "main");
                await synth.isReady;

                synth.connect(entrada);
                const directGain = offlineCtx.createGain(); directGain.gain.value = 0.7;
                synth.connect(directGain); directGain.connect(maestro);

                synth.programChange(0, instrumentoSeleccionado.programa);

                notasDetectadas.forEach(nota => {
                    const beatDuration = 60 / bpmEstilo; 
                    const tiempoInicio = (nota.startTimeSeconds * beatDuration) + 0.1;
                    const duracion = (nota.durationSeconds || 0.5) * beatDuration;
                    
                    setTimeout(() => {
                        synth.noteOn(0, nota.pitchMidi, 127);
                        setTimeout(() => synth.noteOff(0, nota.pitchMidi), duracion * 1000);
                    }, tiempoInicio * 1000);
                });

                const renderedBuffer = await offlineCtx.startRendering();
                descargarWAV(renderedBuffer, instrumentoSeleccionado.nombre);
            }
        } catch (err) {
            console.error("Error al exportar SF2:", err);
            estadoTexto.innerText = "Error al exportar el instrumento étnico.";
        }
    }
});

// Función auxiliar para descargar el WAV
function descargarWAV(buffer, nombre) {
    estadoTexto.innerText = "¡Audio renderizado! Preparando descarga...";
    const wavBlob = bufferToWav(buffer);
    const url = URL.createObjectURL(wavBlob);
    const a = document.createElement('a');
    a.style.display = 'none'; a.href = url;
    a.download = `mi_melodia_${nombre}.wav`;
    document.body.appendChild(a); a.click();
    window.URL.revokeObjectURL(url);
    estadoTexto.innerText = "¡Descarga completada! 🎉";
}

// Función para convertir AudioBuffer a WAV
function bufferToWav(buffer) {
    let numOfChan = buffer.numberOfChannels, length = buffer.length * numOfChan * 2 + 44,
        bufferArray = new ArrayBuffer(length), view = new DataView(bufferArray),
        channels = [], i, sample, offset = 0, pos = 0;

    function setUint16(data) { view.setUint16(pos, data, true); pos += 2; }
    function setUint32(data) { view.setUint32(pos, data, true); pos += 4; }

    setUint32(0x46464952); setUint32(length - 8); setUint32(0x45564157);
    setUint32(0x20746d66); setUint32(16); setUint16(1); setUint16(numOfChan);
    setUint32(buffer.sampleRate); setUint32(buffer.sampleRate * 2 * numOfChan);
    setUint16(numOfChan * 2); setUint16(16); setUint32(0x61746164);
    setUint32(length - pos - 4);

    for (i = 0; i < buffer.numberOfChannels; i++) channels.push(buffer.getChannelData(i));
    while (pos < length) {
        for (i = 0; i < numOfChan; i++) {
            sample = Math.max(-1, Math.min(1, channels[i][offset]));
            sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0;
            view.setInt16(pos, sample, true); pos += 2;
        }
        offset++;
    }
    return new Blob([bufferArray], { type: "audio/wav" });
}

// ==========================================
// 8. CONEXIÓN CON EL BACKEND (Render)
// ==========================================
async function cargarInstrumentosDelBackend() {
    try {
        // AQUÍ APUNTA A RENDER
        const respuesta = await fetch('https://backend-musica-app.onrender.com/instrumentos');
        const archivos = await respuesta.json();
        
        let cambios = false;
        archivos.forEach(nombreArchivo => {
            const yaExiste = catalogoInstrumentos.some(inst => inst.nombre === nombreArchivo);
            if (!yaExiste) {
                catalogoInstrumentos.push({ 
                    nombre: nombreArchivo, 
                    tipo: "sf2", 
                    programa: 0 
                });
                cambios = true;
            }
        });

        if (cambios) {
            localStorage.setItem('misInstrumentos', JSON.stringify(catalogoInstrumentos));
            actualizarListas();
            console.log("Instrumentos del backend (Render) cargados.");
        }
    } catch (error) {
        console.log("Backend no disponible o Render está despertando. Usando instrumentos locales.");
    }
}

// Llamar a la función al iniciar la app
cargarInstrumentosDelBackend();