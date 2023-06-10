const { spawn } = require("child_process"),
  path = require("path");
var fs = require('fs');

const runCode = async (codeFile, inputs) => {
  const timeout = 8;
  console.log("timeouttt", timeout)
  try {
    const output = await new Promise((resolve, reject) => {
      const codeExec = spawn("python3", [
        `${path.join(__dirname, `../codes/4fcdb126-cb90-4a25-be73-da3957b39b8a.py`)}`,
      ]);


      let outputString = "",
        errorString = "";

      if (inputs) {
        codeExec.stdin.write(inputs);
        codeExec.stdin.end();
      }


      codeExec.stdin.on("error", (...args) => {
        // console.log("stdin err", args);
      });



      codeExec.stdout.on("data", (data) => {

        outputString += data.toString();
      });
      codeExec.stderr.on("data", (data) => {
        errorString += data.toString();
      });
      codeExec.on("exit", () => {
        if (errorString) reject(errorString);
        resolve(outputString);
      });

      setTimeout(() => {
        reject(
          `Error: Timed Out. Your code took too long to execute, over ${timeout} seconds.`
        );
      }, timeout * 1000);
    });
    // fs.unlink(`../codes/${codeFile}`);
    return {
      success: true,
      timestamp: new Date(),
      output,
      language: "py",
      version: "3.10.4",
    };
    // return { message: "code exec done true" }
  } catch (error) {
    // return { message: "code exec done false" }
    return {
      success: false,
      timestamp: new Date(),
      error,
      language: "py",
      version: "3.10.4",
    };
  }
};

const executePython = async (codeFile, inputs) => {
  return await runCode(codeFile, inputs);
};

module.exports = {
  executePython,
};
