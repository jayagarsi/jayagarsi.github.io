let pyodide;
const statusEl = document.getElementById("status");
const runBtn = document.getElementById("run-btn");
const errorEl = document.getElementById("error-output");
const audioEl = document.getElementById("output-audio");

// Initialize CodeMirror on the #editor div
const editor = CodeMirror(document.getElementById("editor"), {
  lineNumbers: true,
  theme: "dracula",
  mode: null, // no built-in mode for a custom language yet
  tabSize: 2,
  value: "// write your program here"
});

async function init() {
  pyodide = await loadPyodide();
  const interpreterCode = await (await fetch("/interpreter/interpreter.py")).text();
  pyodide.FS.writeFile("interpreter.py", interpreterCode);
  statusEl.textContent = "Ready.";
  runBtn.disabled = false;
}

async function runCode() {
  errorEl.textContent = "";
  audioEl.style.display = "none";
  runBtn.disabled = true;
  runBtn.textContent = "Running...";

  try {
    const userCode = editor.getValue(); // pull from CodeMirror instead of textarea
    pyodide.FS.writeFile("input.src", userCode);

    await pyodide.runPythonAsync(`
import interpreter
interpreter.run("input.src", "output.wav")
    `);

    const wavBytes = pyodide.FS.readFile("output.wav");
    const blob = new Blob([wavBytes], { type: "audio/wav" });
    const url = URL.createObjectURL(blob);
    audioEl.src = url;
    audioEl.style.display = "block";
  } catch (err) {
    errorEl.textContent = "Error: " + err.message;
  } finally {
    runBtn.disabled = false;
    runBtn.textContent = "Run";
  }
}

runBtn.addEventListener("click", runCode);
init();