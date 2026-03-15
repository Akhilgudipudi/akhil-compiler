{variant=“standard” id=“serverjs-complete-final”}
const express = require(“express”)
const fs = require(“fs”)
const path = require(“path”)
const { exec } = require(“child_process”)

const app = express()

app.use(express.json())
app.use(express.static(“public”))

const codesDir = path.join(__dirname, “codes”)

// Create codes folder if not exists
if (!fs.existsSync(codesDir)) {
fs.mkdirSync(codesDir)
}

app.post(”/run”, (req, res) => {
const { code, language, input } = req.body

let filePath
let compileCmd = null
let runCmd

// PYTHON
if (language === "python") {

    filePath = path.join(codesDir, "main.py")

    fs.writeFileSync(filePath, code)

    runCmd = `python "${filePath}"`

}

// C
else if (language === "c") {

    filePath = path.join(codesDir, "main.c")

    fs.writeFileSync(filePath, code)

    compileCmd = `gcc "${filePath}" -o "${codesDir}/main.exe"`

    runCmd = `"${codesDir}/main.exe"`

}

// C++
else if (language === "cpp") {

    filePath = path.join(codesDir, "main.cpp")

    fs.writeFileSync(filePath, code)

    compileCmd = `g++ "${filePath}" -o "${codesDir}/main.exe"`

    runCmd = `"${codesDir}/main.exe"`

}

// JAVA
else if (language === "java") {

    filePath = path.join(codesDir, "Main.java")

    fs.writeFileSync(filePath, code)

    compileCmd = `javac "${filePath}"`

    runCmd = `java -cp "${codesDir}" Main`

}

function runProgram() {

    const program = exec(runCmd, (error, stdout, stderr) => {

        if (error) {
            return res.json({ output: error.toString() })
        }

        if (stderr) {
            return res.json({ output: stderr })
        }

        res.json({
            output: stdout || "Program executed successfully with no output"
        })

    })

    if (input) {
        program.stdin.write(input)
        program.stdin.end()
    }

}

if (compileCmd) {

    exec(compileCmd, (compileError) => {

        if (compileError) {
            return res.json({ output: compileError.toString() })
        }

        runProgram()

    })

} else {

    runProgram()

}
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
console.log(“🚀 Akhil Compiler Backend Running on Port “ + PORT)
})
