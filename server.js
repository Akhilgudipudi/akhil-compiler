const express = require("express")
const fs = require("fs")
const { spawn } = require("child_process")

const app = express()

app.use(express.json())
app.use(express.static("public"))

if(!fs.existsSync("codes")){
fs.mkdirSync("codes")
}

app.post("/run",(req,res)=>{

const {code,language,input}=req.body

let filename=""

function runProgram(cmd,args=[]){

const process = spawn(cmd,args)

let output=""
let error=""

process.stdout.on("data",(data)=>{
output+=data.toString()
})

process.stderr.on("data",(data)=>{
error+=data.toString()
})

if(input){
process.stdin.write(input+"\n")
}

process.stdin.end()

process.on("close",()=>{
res.json({output:error || output})
})

}

if(language==="python"){

filename="codes/main.py"
fs.writeFileSync(filename,code)

runProgram("python",[filename])

}

else if(language==="c"){

filename="codes/main.c"
fs.writeFileSync(filename,code)

const compile=spawn("gcc",[filename,"-o","codes/main.exe"])

compile.on("close",(code)=>{

if(code!==0){
return res.json({output:"Compilation error"})
}

runProgram("codes/main.exe")

})

}

else if(language==="cpp"){

filename="codes/main.cpp"
fs.writeFileSync(filename,code)

const compile=spawn("g++",[filename,"-o","codes/main.exe"])

compile.on("close",(code)=>{

if(code!==0){
return res.json({output:"Compilation error"})
}

runProgram("codes/main.exe")

})

}

else if(language==="java"){

filename="codes/Main.java"
fs.writeFileSync(filename,code)

const compile=spawn("javac",[filename])

compile.on("close",(code)=>{

if(code!==0){
return res.json({output:"Compilation error"})
}

runProgram("java",["-cp","codes","Main"])

})

}

})

app.listen(3000,()=>{
console.log("AKHIL's COMPILER running at http://localhost:3000")
})