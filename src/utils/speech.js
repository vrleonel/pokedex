// File from: https://stackblitz.com/edit/web-platform-pg3tw5jn?file=script.js

import { getConfigFromLocalStorage } from './localStorage';

const allVoicesObtained = new Promise(function(resolve) {
  let voices = window.speechSynthesis.getVoices();
  if (voices.length !== 0) {
    resolve(voices);
  } else {
    window.speechSynthesis.addEventListener("voiceschanged", function() {
      voices = window.speechSynthesis.getVoices();
      resolve(voices);
    });
  }
});


const speakText = async (word) => {
  const debugMode = getConfigFromLocalStorage('debug');
  const utterance = new SpeechSynthesisUtterance(word);
  const voices = await allVoicesObtained;
  const selectedVoice = voices.findIndex(({name}) => name === 'Aaron');

  if (debugMode) console.log({voices}, 'Selected voice', voices[selectedVoice]);

  utterance.voice = voices[selectedVoice];
  speechSynthesis.speak(utterance);
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
