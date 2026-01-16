import React, { useState, useEffect, useRef } from 'react';
import mike_img from '../images/mike.png';
import stop_mike_img from "../images/stop_mike_img.png"

function VoiceToText({ fallbackInput, setFallbackInput }) {

  const [transcript, setTranscript] = useState('');
  const [listening, setListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  // const [fallbackInput, setFallbackInput] = useState('');


  useEffect(() => {
    // alert("hey")
    // Check if the SpeechRecognition API is available in the browser
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {

      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;


      const newRecognition = new SpeechRecognition();


      newRecognition.continuous = true;
      newRecognition.interimResults = true;


      newRecognition.onstart = () => {
        setListening(true);
      };


      newRecognition.onresult = (event) => {
        let newTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          newTranscript += event.results[i][0].transcript;
        }
        setTranscript(newTranscript);
        setFallbackInput(newTranscript)
      };


      newRecognition.onend = () => {
        setListening(false);
      };


      setRecognition(newRecognition);
    } else {
      // SpeechRecognition API not available, provide a fallback input field
      console.warn('SpeechRecognition API is not available in this browser.');
    }

  }, []);


  const startListening = () => {
    if (recognition && !listening) {
      recognition.start();
    }
  };


  const stopListening = () => {
    if (recognition && listening) {
      recognition.stop();
    }
  };


  // const handleFallbackInputChange = (e) => {
  //   setFallbackInput(e.target.value);
  // };


  return (
    <div>
      {listening ?
        <button>
          <img src={stop_mike_img} className='mike-img' alt='mike img' height={20} width={20} onClick={() => stopListening()} />
        </button>
        :
        <button>
          <img src={mike_img} onClick={() => startListening()} alt='mike img' className='mike-img' height={20} width={20} />
        </button>
      }
    </div>
  );
}

export default VoiceToText;