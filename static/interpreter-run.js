let pyodide;
const statusEl = document.getElementById("status");
const runBtn = document.getElementById("run-btn");
const codeInput = document.getElementById("code-input");
const errorEl = document.getElementById("error-output");
const audioEl = document.getElementById("output-audio");

async function init() {
  pyodide = await loadPyodide();

  // ADJUST: path to your interpreter's .py file, served from /static
  const interpreterCode = await (await fetch("/interpreter/interpreter.py")).text();
  pyodide.FS.writeFile("interpreter.py", interpreterCode);

  // If your interpreter needs extra packages, uncomment and edit:
  // await pyodide.loadPackage("micropip");
  // const micropip = pyodide.pyimport("micropip");
  // await micropip.install(["numpy"]);

  statusEl.textContent = "Ready.";
  runBtn.disabled = false;
}

async function runCode() {
  errorEl.textContent = "";
  audioEl.style.display = "none";
  runBtn.disabled = true;
  runBtn.textContent = "Running...";

  try {
    const userCode = codeInput.value;
    pyodide.FS.writeFile("input.src", userCode); // ADJUST extension if needed

    // ADJUST: this must match your interpreter's actual entry point/function name
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