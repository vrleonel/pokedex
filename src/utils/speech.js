// File from: https://stackblitz.com/edit/web-platform-pg3tw5jn?file=script.js
const speakText = (word) => {
  const utterance = new SpeechSynthesisUtterance(word);

  utterance.lang = 'en-US';
  const voices = speechSynthesis.getVoices();
  utterance.voice = voices[158]; // Choose a specific voice
  // console.log(utterance.voice.lang);
  speechSynthesis.speak(utterance);

  // Speak the text
}

const voiceTesting = () => {
  const synth = window.speechSynthesis;

  const inputForm = document.querySelector('form');
  const inputTxt = document.querySelector('input');
  const voiceSelect = document.querySelector('select');

  synth.lang = 'pt-BR';
  const voices = synth.getVoices();
  console.log('c', voices[1].name);

  for (let i = 0; i < voices.length; i++) {
    const option = document.createElement('option');
    const text = document.createTextNode(voices[i].name);
    option.appendChild(text);
    option.setAttribute('data-name', voices[i].name);
    option.value = voices[i].name;
    voiceSelect.appendChild(option);
  }

  inputForm.onsubmit = (event) => {
    event.preventDefault();

    const utterThis = new SpeechSynthesisUtterance(inputTxt.value);
    const selectedOption =
      voiceSelect.selectedOptions[0].getAttribute('data-name');
    for (let i = 0; i < voices.length; i++) {
      if (voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        console.log('Voice num', i)
      }
    }
    console.log(utterThis);
    synth.speak(utterThis);
    inputTxt.blur();
  };
}
export { speakText, voiceTesting };
