import './index.css';
import React, { useState, useMemo, useEffect } from 'react';
import Result from './Result.js';

const synth = window.speechSynthesis;

const App = () => {
  const [voices, setVoices] = useState([]);
  const [voiceSelected, setVoiceSelected] = useState("Google US English");
  const [text, setText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState('');
  const [meanings, setMeanings] = useState([]);
  const [phonetics, setPhonetics] = useState([]);
  const [word, setWord] = useState('');
  const [error, setError] = useState('');

  const dictionaryApi = (text) =>{
    let url= `https://api.dictionaryapi.dev/api/v2/entries/en/${text}`;
    fetch(url)
      .then(res => res.json())
      .then(result => {
        if (result.title) { // Handle API error responses
          setError(result.message);
          reset();
        } else {
          console.log(result);
          setMeanings(result[0].meanings);
          setPhonetics(result[0].phonetics);
          setWord(result[0].word);
          setError('');
        }
      })
      .catch(err => setError('Error fetching data'));
  }

  const reset = () => {
    setIsSpeaking('');
    setError('');
    setMeanings([]);
    setPhonetics([]);
    setWord('');
  }

  useEffect(() => {
    if (!text.trim()) return reset();
    
    const debounce = setTimeout(() => {
      dictionaryApi(text);
    }, 1000);
    
    return () => clearTimeout(debounce);
  }, [text]);

  useEffect(() => {
    const updateVoices = () => {
      setVoices(synth.getVoices());
    };

    updateVoices();
    synth.onvoiceschanged = updateVoices;
    
    return () => {
      synth.onvoiceschanged = null;
    };
  }, []);

  const startSpeech = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    const voice = voices.find(voice => voice.name === voiceSelected);
    if (voice) {
      utterance.voice = voice;
    }
    synth.speak(utterance);
  };

  const handleSpeech = () => {
    if (!text.trim()) return;
    if (!synth.speaking) { // Do not speak while speaking
      console.log(text);
      startSpeech(text);
      setIsSpeaking('speak');
    } else {
      synth.cancel();
    }

    setInterval(() => {
      if (!synth.speaking) {
        setIsSpeaking('');
      }
    }, 100);
  };

  return (
    <div className="container">
      <h1>English Dictionary!</h1>
      <form>
        <div className="row">
          <textarea cols="30" rows="4" placeholder="Enter Text"
            value={text} onChange={e => setText(e.target.value)} />

          <div key={''} className="voices-icons">
            <div className="select-voices">
              <select value={voiceSelected}
                onChange={e => setVoiceSelected(e.target.value)}>
                {
                  voices.map((voice, index) => (
                    <option key={index} value={voice.name}>{voice.name}</option>
                  ))
                }
              </select>
            </div>
            <i className={`fa-solid fa-volume-high ${isSpeaking}`}
              onClick={handleSpeech} />
          </div>
        </div>
      </form>
      {
        (text.trim() !== '' && !error) && 
        <Result
          word={word}
          phonetics={phonetics}
          meanings={meanings}
          setText={setText} />
      }
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
