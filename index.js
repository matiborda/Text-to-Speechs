const textarea = document.querySelector("textarea"),
    voiceList = document.querySelector("select"),
    speechBtn = document.querySelector("button");

let synth = window.speechSynthesis,
    isSpeaking = true;

// Función para cargar voces disponibles
function loadVoices() {
    voiceList.innerHTML = ''; // Limpiar opciones previas
    let voices = synth.getVoices();
    voices.forEach(voice => {
        let selected = voice.name === "Google US English" ? "selected" : "";
        let option = `<option value="${voice.name}" ${selected}>${voice.name} (${voice.lang})</option>`;
        voiceList.insertAdjacentHTML("beforeend", option);
    });
}

// Cargar voces cuando estén disponibles
synth.addEventListener("voiceschanged", loadVoices);

// Función para convertir texto a voz
function textToSpeech(text) {
    let utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1; // Ajusta el tono si deseas
    utterance.rate = 1; // Ajusta la velocidad de la voz

    let selectedVoice = synth.getVoices().find(voice => voice.name === voiceList.value);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    synth.speak(utterance);

    // Depuración para verificar el estado de la voz
    utterance.onstart = () => console.log("Iniciando discurso...");
    utterance.onend = () => {
        console.log("Discurso terminado");
        speechBtn.innerText = "Convert To Speech";
        isSpeaking = true;
    };
}

// Acción para el botón de hablar/pausar
speechBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (textarea.value !== "") {
        if (!synth.speaking) {
            textToSpeech(textarea.value);
            speechBtn.innerText = "Pause Speech";
        } else if (synth.speaking && isSpeaking) {
            synth.pause();
            isSpeaking = false;
            speechBtn.innerText = "Resume Speech";
        } else {
            synth.resume();
            isSpeaking = true;
            speechBtn.innerText = "Pause Speech";
        }
    }
});
