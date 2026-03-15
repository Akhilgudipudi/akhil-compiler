{variant=“standard” id=“serverjs-full-updated”}
const express = require(“express”)
const fs = require(“fs”)
const { exec } = require(“child_process”)
const path = require(“path”)

const app = express()

app.use(express.json())
app.use(express.static(“public”))

const codesDir = path.join(__dirname,“codes”)

if(!fs.existsSync(codesDir)){
fs.mkdirSync(codesDir)
}

app.post(”/run”,(req,res)=>{

const {code,language,input} = req.body

let filePath
let compileCmd
let runCmd

if(language===“python”){

filePath = path.join(codesDir,“main.py”)

fs.writeFileSync(filePath,code)

runCmd = python ${filePath}

}

else if(language===“c”){

filePath = path.join(codesDir,“main.c”)

fs.writeFileSync(filePath,code)

compileCmd = gcc ${filePath} -o ${codesDir}/main.exe

runCmd = ${codesDir}/main.exe

}

else if(language===“cpp”){

filePath = path.join(codesDir,“main.cpp”)

fs.writeFileSync(filePath,code)

compileCmd = g++ ${filePath} -o ${codesDir}/main.exe

runCmd = ${codesDir}/main.exe

}

else if(language===“java”){

filePath = path.join(codesDir,“Main.java”)

fs.writeFileSync(filePath,code)

compileCmd = javac ${filePath}

runCmd = java -cp ${codesDir} Main

}

function executeRun(){

const process = exec(runCmd,(err,stdout,stderr)=>{

if(err){
return res.json({output:err.toString()})
}

if(stderr){
return res.json({output:stderr})
}

res.json({output:stdout})

})

if(input){
process.stdin.write(input)
process.stdin.end()
}

}

if(compileCmd){

exec(compileCmd,(compileErr)=>{

if(compileErr){
return res.json({output:compileErr.toString()})
}

executeRun()

})

}else{

executeRun()

}

})

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{

console.log(“🚀 Akhil Compiler Server Running”)

})
