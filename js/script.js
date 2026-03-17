(function() {
      // ----- DOM elements -----
      const display = document.getElementById('display');
      const themeToggle = document.getElementById('theme-toggle');
      const historyToggle = document.getElementById('history-toggle');
      const historyPanel = document.getElementById('history-panel');
      const historyList = document.getElementById('history-list');
      const clearHistoryBtn = document.getElementById('clear-history');
      

      // ----- State -----
      let history = [];
      let audioContext = null;
      let isLight = false;

      // ----- Sound effect -----
      function playBeep() {
        try {
          if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
          }
          if (audioContext.state === 'suspended') {
            audioContext.resume().then(() => {
              beepInternal();
            }).catch(() => {});
          } else {
            beepInternal();
          }
        } catch (e) {
          // Ignore audio errors
        }
      }
window.clearAll = function() {
  playBeep();
  display.value = '';
};

      function beepInternal() {
        if (!audioContext) return;
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.1;
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.08);
      }

      // ----- Calculator functions (exposed globally for onclick) -----
      window.appendValue = function(value) {
        playBeep();
        if (value === 'C') {
          clearDisplay();
          return;
        }
        display.value += value;
      };

      window.clearDisplay = function() {
        playBeep();
        display.value = '';
      };

      window.deleteLast = function() {
        playBeep();
        display.value = display.value.slice(0, -1);
      };

      window.calculate = function() {
        playBeep();
        try {
          const expression = display.value;
          if (!expression) return;
          const result = eval(expression);
          display.value = result;
          addToHistory(expression + ' = ' + result);
        } catch {
          display.value = 'Error';
        }
      };

      // ----- History management -----
      function addToHistory(entry) {
        history.push(entry);
        renderHistory();
      }

      function renderHistory() {
        historyList.innerHTML = '';
        history.slice().reverse().forEach(item => {
          const li = document.createElement('li');
          li.textContent = item;
          historyList.appendChild(li);
        });
      }

      function clearHistory() {
        playBeep();
        history = [];
        renderHistory();
      }

      // ----- Theme toggle -----
      function toggleTheme() {
        isLight = !isLight;
        document.body.classList.toggle('light', isLight);
        themeToggle.textContent = isLight ? '☀️' : '🌙';
      }

      // ----- History panel toggle -----
      function toggleHistory() {
        historyPanel.classList.toggle('hidden');
      }

      // ----- Keyboard support -----
      function handleKeyDown(e) {
        const key = e.key;
        const allowedKeys = '0123456789.+-*/%';
        if (allowedKeys.includes(key)) {
          e.preventDefault();
          appendValue(key);
        } else if (key === 'Enter' || key === '=') {
          e.preventDefault();
          calculate();
        } else if (key === 'Escape') {
          e.preventDefault();
          clearDisplay();
        } else if (key === 'Backspace') {
          e.preventDefault();
          deleteLast();
        } else if (key.toLowerCase() === 'c') {
          e.preventDefault();
          clearDisplay();
        }
      }

      // ----- Event listeners -----
      themeToggle.addEventListener('click', () => {
        playBeep();
        toggleTheme();
      });

      historyToggle.addEventListener('click', () => {
        playBeep();
        toggleHistory();
      });

      clearHistoryBtn.addEventListener('click', clearHistory);

      document.addEventListener('keydown', handleKeyDown);

      // ----- Initialize theme toggle text -----
      themeToggle.textContent = '🌙'; // dark mode default
    })();
