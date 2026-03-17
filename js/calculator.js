(function() {
  'use strict';
  
  const display = document.getElementById('display');
  const buttonsContainer = document.querySelector('.buttons');
  
  let audioContext = null;
  
  function playBeep() {
    try {
      if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
      }
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch(e) {}
  }
  
  function updateDisplay(value) {
    display.textContent = value || '0';
  }
  
  function deleteLast() {
    playBeep();
    let current = display.textContent;
    updateDisplay(current.slice(0, -1));
  }
  
  function calculate() {
    playBeep();
    try {
      let expression = display.textContent.replace(/×/g, '*').replace(/÷/g, '/');
      let result = Function('"use strict";return (' + expression + ')')();
      updateDisplay(isNaN(result) ? 'Error' : Math.round(result * 10000000000) / 10000000000);
    } catch {
      updateDisplay('Error');
    }
  }
  
  function appendToDisplay(value) {
    playBeep();
    let current = display.textContent;
    if (current === '0' && !['+', '-', '*', '/', '%', '.'].includes(value)) {
      updateDisplay(value);
    } else {
      updateDisplay(current + value);
    }
  }
  
  // Button clicks
  buttonsContainer.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      const text = e.target.textContent.trim();
      if (text === 'C') {
        updateDisplay('');
      } else if (text === 'DEL') {
        deleteLast();
      } else if (text === '=') {
        calculate();
      } else {
        appendToDisplay(text);
      }
    }
  });
  
  // Keyboard
  document.addEventListener('keydown', (e) => {
    if (/[0-9+\-*/.%]/.test(e.key)) {
      e.preventDefault();
      appendToDisplay(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      calculate();
    } else if (e.key === 'Backspace') {
      e.preventDefault();
      deleteLast();
    } else if (e.key === 'Escape' || e.key.toLowerCase() === 'c') {
      e.preventDefault();
      updateDisplay('');
    }
  });
  
  // Initial
  updateDisplay('');
  
})();
