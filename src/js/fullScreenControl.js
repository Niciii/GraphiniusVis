var FSelem = {
      el: null,
      width: null,
      height: null
    };

function switchToFullScreen(elem_string) {
  var elem = document.querySelector(elem_string);
  var canvas = document.querySelector(elem_string + " canvas");
  console.log(canvas);
  if (elem) {
    FSelem = {
      el: elem,
      width: elem.clientWidth,
      height: elem.clientHeight
    }
    // console.log(elem);
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    }
    canvas.focus();
  }
  else {
    alert("Element to full-screen does not exist...");
  }
}

function FShandler( event ) {
  var fullscreenElement = document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  var fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.webkitFullscreenEnabled;
  if ( fullscreenElement ) {
      // console.log("fullscreen enabled!");
      fullscreenElement.style.width = "100%";
      fullscreenElement.style.height = "100%";
  }
  else {
      // console.log("fullscreen disabled!");
      // we can't get the element that WAS in fullscreen,
      // so we fall back to a manual entry...
      // console.log(FSelem);
      FSelem.el.style.width = FSelem.width+"px";
      FSelem.el.style.height = FSelem.height+"px";
  }
}

document.addEventListener("fullscreenchange", FShandler);
document.addEventListener("webkitfullscreenchange", FShandler);
document.addEventListener("mozfullscreenchange", FShandler);
document.addEventListener("MSFullscreenChange", FShandler);
