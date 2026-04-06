// ULTIMATE CALCULATOR: PERFECT LAYOUT, FULL FUNCTIONALITY
class UltimateCalculator {
    constructor() {
        this.displayMain = document.getElementById('displayMain');
        this.expressionDiv = document.getElementById('expressionPreview');
        this.historyContainer = document.getElementById('historyContainer');
        this.memSpan = document.getElementById('memDisplay');
        
        this.currentInput = "0";
        this.previousValue = null;
        this.currentOperator = null;
        this.waitingForNewOperand = false;
        this.errorState = false;
        this.memory = 0;
        this.history = [];
        
        this.updateDisplay();
        this.renderHistory();
        this.updateMemoryDisplay();
        this.bindButtons();
        this.bindKeyboard();
    }
    
    updateDisplay() {
        if (this.errorState) {
            this.displayMain.innerText = "🚫 ERROR";
            return;
        }
        let val = this.currentInput;
        if (val === "" || val === undefined) val = "0";
        if (val.length > 20 && !val.includes("e")) {
            val = parseFloat(val).toExponential(10);
        }
        this.displayMain.innerText = val;
        if (this.currentOperator && this.previousValue !== null && !this.waitingForNewOperand) {
            this.expressionDiv.innerText = `${this.formatNumber(this.previousValue)} ${this.currentOperator} ${this.currentInput}`;
        } else if (this.previousValue !== null && this.currentOperator && this.waitingForNewOperand) {
            this.expressionDiv.innerText = `${this.formatNumber(this.previousValue)} ${this.currentOperator} ...`;
        } else {
            this.expressionDiv.innerText = "";
        }
    }
    
    formatNumber(n) {
        if (n === null || n === undefined) return "";
        let num = parseFloat(n);
        if (isNaN(num)) return n.toString().slice(0, 12);
        if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-6 && num !== 0)) return num.toExponential(8);
        return num.toString().replace(/\.?0+$/, '');
    }
    
    updateMemoryDisplay() {
        let memVal = this.memory;
        let memStr = (typeof memVal === 'number') ? memVal.toFixed(8).replace(/\.?0+$/, '') : "0";
        this.memSpan.innerText = `M = ${memStr}`;
    }
    
    addToHistory(expression, resultRaw) {
        let resultStr = (typeof resultRaw === 'number') ? this.formatNumber(resultRaw) : String(resultRaw);
        this.history.unshift({ expression: expression, result: resultStr });
        if (this.history.length > 20) this.history.pop();
        this.renderHistory();
    }
    
    renderHistory() {
        if (!this.historyContainer) return;
        if (this.history.length === 0) {
            this.historyContainer.innerHTML = `<div class="empty-msg">✨ calculations appear here<br>click any to reuse</div>`;
            return;
        }
        this.historyContainer.innerHTML = this.history.map((item, idx) => `
            <div class="history-item" data-history-index="${idx}">
                <div class="history-expr">${this.escapeHtml(item.expression)}</div>
                <div class="history-result">= ${this.escapeHtml(item.result)}</div>
            </div>
        `).join('');
        document.querySelectorAll('.history-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const idx = el.getAttribute('data-history-index');
                if (idx !== null && this.history[parseInt(idx)]) {
                    let resultVal = this.history[parseInt(idx)].result;
                    let parsed = parseFloat(resultVal);
                    if (!isNaN(parsed)) {
                        this.resetToFresh();
                        this.currentInput = parsed.toString();
                        this.waitingForNewOperand = false;
                        this.currentOperator = null;
                        this.previousValue = null;
                        this.errorState = false;
                        this.updateDisplay();
                    }
                    e.stopPropagation();
                });
            });
        });
    }
    
    escapeHtml(str) { return str.replace(/[&<>]/g, function(m){if(m==='&') return '&amp;'; if(m=='<') return '<'; if(m==='>') return '>'; return m;});}
    
    resetToFresh() {
        this.currentInput = "0";
        this.previousValue = null;
        this.currentOperator = null;
        this.waitingForNewOperand = false;
        this.errorState = false;
        this.updateDisplay();
    }
    
    resetAll() { this.resetToFresh(); }
    
    evaluate() {
        if (this.currentOperator === null || this.previousValue === null) return null;
        let a = parseFloat(this.previousValue);
        let b = parseFloat(this.currentInput);
        if (isNaN(a) || isNaN(b)) return null;
        let result = null;
        switch (this.currentOperator) {
            case '+': result = a + b; break;
            case '-': result = a - b; break;
            case '*': result = a * b; break;
            case '/': 
                if (b === 0) return "DIV_ZERO";
                result = a / b; 
                break;
            default: return null;
        }
        if (typeof result === 'number') result = parseFloat(result.toFixed(12));
        return result;
    }
    
    computeEquals() {
        if (this.errorState) {
            this.resetAll();
            return;
        }
        if (this.currentOperator && this.previousValue !== null && !this.waitingForNewOperand) {
            const expr = `${this.formatNumber(this.previousValue)} ${this.currentOperator} ${this.currentInput}`;
            let res = this.evaluate();
            if (res === "DIV_ZERO") {
                this.errorState = true;
                this.updateDisplay();
                return;
            }
            if (res !== null) {
                this.addToHistory(expr, res);
                this.currentInput = res.toString();
                this.previousValue = null;
                this.currentOperator = null;
                this.waitingForNewOperand = true;
                this.errorState = false;
                this.updateDisplay();
            }
        } else if (this.currentOperator === null && this.previousValue === null && !this.waitingForNewOperand && this.currentInput !== "0") {
            this.addToHistory(`val = ${this.currentInput}`, this.currentInput);
        }
    }
    
    setOperator(op) {
        if (this.errorState) { this.resetAll(); }
        if (this.waitingForNewOperand && this.currentOperator !== null) {
            this.currentOperator = op;
            this.updateDisplay();
            return;
        }
        if (this.currentOperator !== null && this.previousValue !== null && !this.waitingForNewOperand) {
            let res = this.evaluate();
            if (res === "DIV_ZERO") {
                this.errorState = true;
                this.updateDisplay();
                return;
            }
            if (res !== null) {
                this.previousValue = res;
                this.currentInput = res.toString();
            } else {
                this.previousValue = parseFloat(this.currentInput);
            }
        } else {
            if (this.previousValue === null) {
                this.previousValue = parseFloat(this.currentInput);
            }
        }
        this.currentOperator = op;
        this.waitingForNewOperand = true;
        this.updateDisplay();
    }
    
    appendNumber(numStr) {
        if (this.errorState) { this.resetAll(); }
        if (this.waitingForNewOperand) {
            this.currentInput = numStr;
            this.waitingForNewOperand = false;
        } else {
            if (this.currentInput === "0" && numStr !== ".") {
                this.currentInput = numStr;
            } else {
                if (numStr === "." && this.currentInput.includes(".")) return;
                this.currentInput += numStr;
            }
        }
        if (this.currentInput.length > 22 && !this.currentInput.includes("e")) {
            this.currentInput = this.currentInput.slice(0, 22);
        }
        this.updateDisplay();
    }
    
    deleteLast() {
        if (this.errorState) { this.resetAll(); return; }
        if (this.waitingForNewOperand) return;
        let curr = this.currentInput;
        if (curr.length === 1 || (curr.length === 2 && curr.startsWith("-"))) {
            this.currentInput = "0";
        } else {
            this.currentInput = curr.slice(0, -1);
            if (this.currentInput === "") this.currentInput = "0";
        }
        this.updateDisplay();
    }
    
    applyFunction(func) {
        if (this.errorState) { this.resetAll(); }
        let val = parseFloat(this.currentInput);
        if (isNaN(val)) return;
        let newVal = val;
        let exprFunc = "";
        switch (func) {
            case 'sqrt': newVal = Math.sqrt(val); exprFunc = `√(${this.formatNumber(val)})`; break;
            case 'square': newVal = val * val; exprFunc = `sqr(${this.formatNumber(val)})`; break;
            case 'reciprocal': 
                if (val === 0) { this.errorState = true; this.updateDisplay(); return; }
                newVal = 1 / val; 
                exprFunc = `1/(${this.formatNumber(val)})`; 
                break;
            case 'percent': newVal = val / 100; exprFunc = `${this.formatNumber(val)}%`; break;
            default: return;
        }
        this.addToHistory(exprFunc, newVal);
        this.currentInput = newVal.toString();
        this.previousValue = null;
        this.currentOperator = null;
        this.waitingForNewOperand = true;
        this.errorState = false;
        this.updateDisplay();
    }
    
    memoryAdd() {
        let cur = parseFloat(this.currentInput);
        if (!isNaN(cur) && !this.errorState) {
            this.memory += cur;
            this.updateMemoryDisplay();
        }
    }
    memorySubtract() {
        let cur = parseFloat(this.currentInput);
        if (!isNaN(cur) && !this.errorState) {
            this.memory -= cur;
            this.updateMemoryDisplay();
        }
    }
    memoryRecall() {
        if (this.errorState) this.resetAll();
        this.currentInput = this.memory.toString();
        this.waitingForNewOperand = false;
        this.currentOperator = null;
        this.previousValue = null;
        this.updateDisplay();
    }
    memoryClear() {
        this.memory = 0;
        this.updateMemoryDisplay();
    }
    clearHistory() {
        this.history = [];
        this.renderHistory();
    }
    
    bindButtons() {
        document.querySelectorAll('[data-value]').forEach(btn => {
            btn.addEventListener('click', () => this.appendNumber(btn.getAttribute('data-value')));
        });
        document.querySelectorAll('[data-op]').forEach(btn => {
            btn.addEventListener('click', () => {
                let op = btn.getAttribute('data-op');
                if (op === '÷') op = '/';
                if (op === '×') op = '*';
                if (op === '−') op = '-';
                this.setOperator(op);
            });
        });
        const equalsBtn = document.querySelector('[data-action="equals"]');
        if (equalsBtn) equalsBtn.addEventListener('click', () => this.computeEquals());
        const clearBtn = document.querySelector('[data-action="clear"]');
        if (clearBtn) clearBtn.addEventListener('click', () => this.resetAll());
        const delBtn = document.querySelector('[data-action="del"]');
        if (delBtn) delBtn.addEventListener('click', () => this.deleteLast());
        
        document.querySelectorAll('[data-action]').forEach(btn => {
            const act = btn.getAttribute('data-action');
            if (act === 'sqrt' || act === 'square' || act === 'reciprocal' || act === 'percent') {
                btn.addEventListener('click', () => this.applyFunction(act));
            }
            if (act === 'memoryAdd') btn.addEventListener('click', () => this.memoryAdd());
            if (act === 'memoryRecall') btn.addEventListener('click', () => this.memoryRecall());
        });
        document.getElementById('memStore')?.addEventListener('click', () => this.memoryAdd());
        document.getElementById('memSubtract')?.addEventListener('click', () => this.memorySubtract());
        document.getElementById('memRecall')?.addEventListener('click', () => this.memoryRecall());
        document.getElementById('memClear')?.addEventListener('click', () => this.memoryClear());
        document.getElementById('clearHistoryBtn')?.addEventListener('click', () => this.clearHistory());
    }
    
    bindKeyboard() {
        window.addEventListener('keydown', (e) => {
            const key = e.key;
            if (/[0-9]/.test(key)) { e.preventDefault(); this.appendNumber(key); }
            else if (key === '.') { e.preventDefault(); this.appendNumber('.'); }
            else if (key === '+' || key === '-' || key === '*' || key === '/') { e.preventDefault(); this.setOperator(key); }
            else if (key === 'Enter' || key === '=') { e.preventDefault(); this.computeEquals(); }
            else if (key === 'Backspace') { e.preventDefault(); this.deleteLast(); }
            else if (key === 'Escape') { e.preventDefault(); this.resetAll(); }
            else if (key === '%') { e.preventDefault(); this.applyFunction('percent'); }
        });
    }
}

window.addEventListener('DOMContentLoaded', () => { new UltimateCalculator(); });
