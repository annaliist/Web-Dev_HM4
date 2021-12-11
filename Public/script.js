var clicked = false;
var counterVal = 0;
function increaseLike(){
    if (!clicked){
    localStorage.setItem("increase", ++counterVal);
    clicked = true;
    document.getElementById("counter-label").innerHTML = localStorage.getItem("increase");
}}
if (localStorage.getItem("increase") == 1 && !clicked) {
    document.getElementById("counter-label").innerHTML = localStorage.getItem("increase");
    }