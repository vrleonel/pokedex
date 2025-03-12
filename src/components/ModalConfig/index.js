import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { allVoicesObtained } from '../../utils/speech';

import { saveConfigToLocalStorage, getConfigFromLocalStorage } from '../../utils/localStorage';


import './styles.scss';

const ModalConfig = ({ toggle, handleModal }) => {
  const [loading, setLoading] = useState(false);
  const [voices, setVoices] = useState([]);
  const [actualVoice, setActualVoice] = useState(getConfigFromLocalStorage('voice'));
  const [debugMode, setDebugMode] = useState(getConfigFromLocalStorage('debug'));
  const [speak, setSpeak] = useState(getConfigFromLocalStorage('speak'));

  useEffect(() => {
    setLoading(true);
    allVoicesObtained.then((allvoices) => {
      setVoices(allvoices);
      setLoading(false);
    });
  }, []);

  const classes = ['overlay', toggle ? 'open' : 'closed'];

  const handleConfig = (name, value)  => {
    console.log('handlecofig', name, value, {actualVoice});
    if (name === 'voice') setActualVoice(value);
    if (name === 'debug') setDebugMode(!value);
    if (name === 'speak') setSpeak(value);

    saveConfigToLocalStorage(name, value);
  }



  return (
    <div className={classes.join(' ')} >
      <div className='modal-config'>
        <header><h2>Configs</h2> <button onClick={handleModal}>X</button></header>
        <main>
          <p>
            <label htmlFor="speak">Speak: </label>
            <input type="checkbox" id="speak" checked={speak} onChange={ (e) => handleConfig('speak', e.target.value) } />
          </p>
          <p>
            <label htmlFor="debug">Debug: </label>
            <input type="checkbox" id="debug" checked={debugMode} onChange={ (e) => handleConfig('debug', e.target.value) } />
          </p>
          <p>
            <label htmlFor="voice">Voice: </label>
            {loading && <span>Loading...</span>}
            {!loading && (
              <select id="voice" value={actualVoice} onChange={ (e) => handleConfig('voice', e.target.value) }>
                {voices.map((voice, index) => (
                  <option key={index} value={index}>{voice.name}</option>
                ))}
              </select>
            )}
          </p>
          <p>
            <button>Save</button>
          </p>
        </main>
        <footer></footer>
      </div>
    </div>
  )
}
ModalConfig.propTypes = {
  toggle: PropTypes.bool.isRequired,
  handleModal: PropTypes.func.isRequired,
};

export default ModalConfig;
