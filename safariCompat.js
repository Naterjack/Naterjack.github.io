isWebkit=false;
var ua = navigator.userAgent.toLowerCase();
if (ua.indexOf('safari') != -1) {
  if (ua.indexOf('chrome') > -1) {
     // Chrome
  } else {
    isWebkit=true; // Safari
  }
}

if (isWebkit){

    var y = document.getElementsByClassName("backgroundContent");

    y[0].style.animationName="none";
    var styleElem = document.head.appendChild(document.createElement("style"));
    styleElem.innerHTML = ".backgroundContent:before {height:200vh; width:200vw;}";

    var styleElem2 = document.head.appendChild(document.createElement("style"));
    styleElem2.innerHTML = ".lowerBackgroundContent:after {animation-name: \"none\"; height:200vh; width:200vw;}";
}