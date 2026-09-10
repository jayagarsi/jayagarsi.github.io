let matchRegex, getLastError;
RegexModule().then((Module) => {
    matchRegex = Module.cwrap('matchRegex', 'number', ['string', 'string']);
    getLastError = Module.cwrap('getLastError', 'string', []);
    //document.getElementById('regex-demo-status').textContent = 'Engine ready.';
    runMatch();
})//.catch((err) => {
    //document.getElementById('regex-demo-status').textContent = 'Failed to load engine: ' + err;
//});
function runMatch() {
    const resultDiv = document.getElementById('result');
    if (!matchRegex) return;
    const pattern = document.getElementById('pattern').value;
    const input = document.getElementById('input').value;
    if (!pattern) {
        resultDiv.className = 'regex-demo-result--idle';
        resultDiv.textContent = 'Type a pattern and input string above.';
        return;
    }
    const result = matchRegex(pattern, input);
    if (result === 1) {
        resultDiv.className = 'regex-demo-result--match';
        resultDiv.textContent = `✓ "${input}" matches ${pattern}`;
    } else if (result === 0) {
        resultDiv.className = 'regex-demo-result--no-match';
        resultDiv.textContent = `✗ "${input}" does not match ${pattern}`;
    } else {
        const msg = getLastError ? getLastError() : 'invalid pattern';
        resultDiv.className = 'regex-demo-result--error';
        resultDiv.textContent = `⚠ Invalid regex: ${msg}`;
    }
}
document.getElementById('pattern').addEventListener('input', runMatch);
document.getElementById('input').addEventListener('input', runMatch);
document.querySelectorAll('.regex-demo-example-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        document.getElementById('pattern').value = btn.dataset.pattern;
        document.getElementById('input').value = btn.dataset.input;
        runMatch();
    });
});