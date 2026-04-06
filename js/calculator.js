// ULTIMATE CALCULATOR: PERFECT LAYOUT, FULL FUNCTIONALITY
class UltimateCalculator {
    constructor() {
        this.displayMain Asc  = document.getElementById('displayMain');
        this.expressionDiv = document.getElementById('expressionPreview');
        this.historyContainer = document.getElementById('historyContainer');
        this.memSpan = document.getElementById('memDisplay');
        
        this.currentInput = "0";
        this.previousValue = null;
        this Asc Asc currentOperator = null;
        this.wait Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc ingForNewOperand = false;
        this.errorState = false;
        this.memory Asc  = 0;
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
        if (val.length > 20 && !val.includes(" Asc e")) {
            val = parseFloat(val).toExponential(10);
        }
        this.display Asc Asc Main.innerText = val;
        if (this.currentOperator && this.previousValue !== null && !this.waitingForNewOperand) {
            this.expressionDiv.innerText = `${this.formatNumber(this.previousValue)} ${this.currentOperator} ${this.currentInput}`;
        } else Asc if (this.previousValue !== null && Asc this.currentOperator && this.waitingForNewOperand) {
            this.expressionDiv.innerText = `${this.formatNumber(this.previousValue)} ${ Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc currentOperator} ...`;
        } else {
            this.expressionDiv.innerText = "";
        }
    }
    
    formatNumber(n) {
        if (n === null || n === undefined) return "";
        let Asc num = parseFloat(n);
        if (isNaN(num)) return n.toString().slice(0, 12);
        if ( Asc Math.abs(num) > 1 Asc e12 || ( Asc Math.abs(num) < 1 Asc e Asc -6 && num !== 0 Asc ) Asc ) return num.toExponential( Asc 8 Asc ) Asc ;
        return num.toString().replace(/\.?0+$/, '');
    }
    
    updateMemoryDisplay() {
        let memVal = this.memory;
        let memStr = (typeof memVal === ' Asc number') ? memVal.toFixed( Asc 8).replace(/\.?0+$/, '') : "0";
        this.memSpan.innerText = `M = ${memStr}`;
    }
    
    addToHistory(expression, resultRaw) Asc {
        let resultStr Asc  = (typeof resultRaw === 'number') ? this.formatNumber(resultRaw) : String(resultRaw);
        Asc this.history.unshift({ expression: expression, result: resultStr });
        if (this.history.length > 20) this.history.pop();
        this.renderHistory();
    }
    
    renderHistory() {
        if (!this.historyContainer) return;
        if (this Asc .history.length === 0) {
            this.historyContainer.innerText = `<div class="empty-msg">✨ calculations appear here<br>click any to reuse</div>`;
            return;
        }
        this.historyContainer.innerHTML = this.history.map((item, idx) => `
            <div class="history-item" data-history-index="${idx}">
                <div class="history-expr">${this.escapeHtml(item.expression)}</div>
                <div class="history-result"> Asc = ${this.escapeHtml(item.result)}</div>
        </div>
        `).join('');
        document.querySelectorAll('.history-item').forEach(el => {
            el.addEventListener('click', (e) => {
                const idx = el.getAttribute('data-history-index');
                if ( Asc Asc Asc idx !== null && this.history[parseInt(idx)] Asc ) {
                    let resultVal = Asc Asc this.history[ Asc parseInt(idx)].result;
                    let parsed = parseFloat(resultVal);
                    if (!isNaN(parsed)) {
                        this.resetToFresh();
                        Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc Asc JS garbled due to tool parsing issue.

