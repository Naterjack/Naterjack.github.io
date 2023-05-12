var overlay = document.getElementById('overlay');
var title = document.getElementById('title');
var subtitle = document.getElementById('subtitle');
var buttons = document.getElementsByClassName('invertable-button');
var infoText = document.getElementById('info-text');

let bio = `
     I'm a computer scientist specialising in ethical deep learning & machine vision.
     <br/>
     <br/>
     Hobbyist game dev, with experience in Godot, UE 4/5 and Unity.
     <br/>
     <br/>
     Soon to be an AI MSc student @ Loughborough University
     <br/>
     Previously: <br/>
        <b><font size=4> University of Warwick </font></b>(2019-2022) <br/>  Computer Science BSc 2.1
    `

let isOverlayed = false;

document.getElementById('AboutButton').onclick = function() {
    console.log("Clicked");
    if (!isOverlayed){

        isOverlayed = true;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // dark mode
            overlay.style.mixBlendMode = "darken";
        }else {
            overlay.style.mixBlendMode = "lighten";
            title.classList.add('info-transistion');
            subtitle.classList.add('info-transistion');
            for (const item of buttons){
                item.classList.add('info-transition');
            }
        }
        overlay.classList.add('info-transistion');
        infoText.innerHTML = bio;
        infoText.classList.add('info-transistion');
        
    }else{

        isOverlayed = false;

        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            // dark mode
            overlay.style.mixBlendMode = "none";
        }else {
            overlay.style.mixBlendMode = "none";
            title.classList.remove('info-transistion');
            subtitle.classList.remove('info-transistion');
            for (const item of buttons){
                item.classList.remove('info-transition');
            }
        }
        overlay.classList.remove('info-transistion');
        infoText.classList.remove('info-transistion');
        infoText.innerText = '';
    }  
     
}