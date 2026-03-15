require.config({ paths: { vs: 'https://unpkg.com/monaco-editor@0.34.1/min/vs' }})

let editor
let files={}
let activeFile=null

const templates={

python:`print("Hello from AKHIL's COMPILER")`,

c:`#include <stdio.h>

int main(){
printf("Hello from AKHIL's COMPILER");
return 0;
}`,

cpp:`#include <iostream>

using namespace std;

int main(){
cout<<"Hello from AKHIL's COMPILER";
return 0;
}`,

java:`class Main {
public static void main(String[] args){
System.out.println("Hello from AKHIL's COMPILER");
}
}`
}

require(['vs/editor/editor.main'], function () {

editor = monaco.editor.create(document.getElementById('editor'), {

value:templates.python,
language:'python',
theme:'vs-dark',
automaticLayout:true

})

})

function setLang(lang){

// change dropdown language
document.getElementById("language").value = lang

// update editor code template
changeLanguage()

}

function changeLanguage(){

const lang=document.getElementById("language").value
editor.setValue(templates[lang])
monaco.editor.setModelLanguage(editor.getModel(),lang)

}

function newFile(){

const name=prompt("Enter file name")

if(!name) return

files[name]=""

updateExplorer()

}

function updateExplorer(){

const list=document.getElementById("fileList")

list.innerHTML=""

for(const f in files){

const li=document.createElement("li")

li.innerText=f

li.onclick=()=>openFile(f)

list.appendChild(li)

}

}

function openFile(name){

activeFile=name
editor.setValue(files[name])

}

async function runCode(){

const code=editor.getValue()
const language=document.getElementById("language").value
const input=document.getElementById("input").value

document.getElementById("output").innerText="Running..."

const start=Date.now()

const res=await fetch("https://akhil-compiler-backend.onrender.com/run",{

method:"POST",
headers:{"Content-Type":"application/json"},

body:JSON.stringify({
code,
language,
input
})

})

const data=await res.json()

const runtime=Date.now()-start

document.getElementById("output").innerText=data.output

document.getElementById("runtime").innerText="Runtime: "+runtime+" ms"

}

/* typing header */

const text="⚡ AKHIL's COMPILER"
let i=0

function type(){

if(i<text.length){
document.getElementById("typingTitle").innerHTML+=text.charAt(i)
i++
setTimeout(type,100)
}

}

type()
