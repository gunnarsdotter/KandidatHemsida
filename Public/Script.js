//Variable
var name;
var socket;

//Fullscreen
function openFullScreen() {
    if (document.fullscreenEnabled) {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) { /* Firefox */
            document.documentElement.mozRequestFullScreen();
        } else if (document.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            document.webkitRequestFullscreen();
        } else if (document.msRequestFullscreen) { /* IE/Edge */
            document.msRequestFullscreen();
        } else if (document.mozFullScreenEnabled) { /* */
            document.mozFullScreenEnabled();
        } else if (document.fullScreenEnabled) { /*  */
            document.fullScreenEnabled();
        }
    }
}
         
//tabort dubble touch
var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);


function init() {
    socket = new WebSocket('ws://192.168.1.35/');

    socket.onopen = function (event) {
        console.log('Connection is open ...');
    };
    socket.onerror = function (err) {
        console.log('err: ', err);
    };
    socket.onclose = function () {
        //document.getElementById("startView").style.visibility = "visible";
        //document.getElementById("nameView").style.visibility = "hidden";
        //document.getElementById("weaponView").style.visibility = "hidden";
        //document.getElementById("gameView").style.visibility = "hidden";
        //TODO- vad ska hända?
        console.log("Connection is closed...");
    };

    //Messege recived from socket
    socket.onmessage = function (event) {
        arg = event.data.split(' ');
        //Change background depending on the players id
        //When the game is ending do something
        if (arg[0] == "changeBackground") {
            url = "url(Images/Avatars/avatar" + arg[1] + ".png)";
            document.getElementById("gameView").style.backgroundImage = url;
        }
        else if (arg[0] == "end") {
            //TODO- something?
        }
    };
}

//change view from start to name
function startFun() {
    init();
    openFullScreen();
    document.getElementById("startView").style.visibility = "hidden";
    document.getElementById("nameView").style.visibility = "inherit";
}

//Save name and make change view from name to weapon
function nameFun() {
    name = document.getElementById("nameField").value.trim();
    //check the input name.
    if (name.toLowerCase().includes("bajs") || true == name.toLowerCase().includes("kuk")) {
        document.getElementById("nameField").placeholder = "No, that is not your name!";
        document.getElementById("nameField").value = "";
    }
    else if (!(name == null || name == "" || name == "Name" || name == "Write your name" || name == "No, that is not your name!" || name == "ups, try again!" || name.length < 3)) {
        document.getElementById("nameView").style.visibility = "hidden";
        document.getElementById("weaponView").style.visibility = "inherit";
    }
    else {
        document.getElementById("nameField").placeholder = "ups, try again!";
        document.getElementById("nameField").value = "";
    }
}

//To enable enter key
function runScript(e) {
    //See notes about 'which' and 'key'
    if (e.keyCode == 13) {
        nameFun();
        return false;
    }
}

//save vepon and change view from vepon to game
function weaponFun(arg) {
    socket.send("info " + name + " " + arg);
    document.getElementById("weaponView").style.visibility = "hidden";
    document.getElementById("gameView").style.visibility = "visible";
    document.getElementById("rotate").style.visibility = "hidden";
}
   
//Send a messege arg that is called from the playbuttons
function message(arg) {
    socket.send("message " + arg);
}

//Button push down respons
document.addEventListener('touchstart', function (event) { 
    if (event.srcElement.id == 'fire') {
        event.srcElement.id = 'fireActive';
        window.navigator.vibrate(1);
    }
}, false);
document.addEventListener('touchstart', function (event) {
    if (event.srcElement.id == 'left') event.srcElement.id = 'leftActive';
}, false);
document.addEventListener('touchstart', function (event) {
    if (event.srcElement.id == 'right') event.srcElement.id = 'rightActive';
}, false);

document.addEventListener('touchend', function (event) { 
    if (event.srcElement.id == 'fireActive') event.srcElement.id = 'fire';
}, false);
document.addEventListener('touchend', function (event) {
    if (event.srcElement.id == 'leftActive') event.srcElement.id = 'left';
}, false);
document.addEventListener('touchend', function (event) {
    if (event.srcElement.id == 'rightActive') event.srcElement.id = 'right';
}, false);








//function lockScreen() {
//    openFullScreen();

//    rotation funkar inte på datorn!!!
//    var orientation = screen.msOrientation || screen.mozOrientation || (screen.orientation || {}).type;
//    screen.lockOrientationUniversal = screen.lockOrientation || screen.mozLockOrientation || screen.msLockOrientation;

//    if (screen.orientation.lock("landscape-primary")) {
//         Orientation was locked
//    } else if (screen.lockOrientationUniversal("landscape-primary")) {
//         Orientation was locked
//    }
//    else {
//         Orientation lock failed
//    }
//}

//document.addEventListener('touchmove', function (event) { //ej safari
//    if (event.scale !== 1) { event.preventDefault(); }
//}, false);

//document.addEventListener('scroll', function (event) {
//    if (event.scale !== 1) { event.preventDefault(); }
//}, false);
//document.addEventListener('resize', function (event) {
//    if (event.scale !== 1) { event.preventDefault(); }

//}, false);

//window.removeEventListener('touchmove', function (event) {}, false);
//window.removeEventListener('touchmove', function (event) {}, true);
//window.removeEventListener('scroll', function (event) {}, false);
//window.removeEventListener('scroll', function (event) {}, true);
//window.removeEventListener('resize', function (event) { }, false);
//window.removeEventListener('resize', function (event) { }, false);
//document.addEventListener('touchstart', function (event) {
//    if (event.touches.length != 1) {
//        event.preventDefault();
//    }

//}, false);


//Glitchi and makes the dobule touch work
//function setButtonPress() {
//    var left = document.getElementById("left");
//    if (left != null) {
//        left.addEventListener('touchstart', function (event) {
//            left.style.backgroundImage = "url(Images/Button/buttonleftpressed.png)";

//        }, false);
//        left.addEventListener('touchend', function (event) {
//            left.style.backgroundImage = "url(Images/Button/buttonleft.png)";

//        }, false);
//    }
//    var right = document.getElementById("right");
//    if (right != null) {
//        right.addEventListener('touchstart', function (event) {
//            right.style.backgroundImage = "url(Images/Button/buttonrightpressed.png)";

//        }, false);
//        right.addEventListener('touchend', function (event) {
//            right.style.backgroundImage = "url(Images/Button/buttonright.png)";

//        }, false);
//    }
//    var fire = document.getElementById("fire");
//    if (fire != null) {
//        fire.addEventListener('touchstart', function (event) {
//            fire.style.backgroundImage = "url(Images/Button/buttonfirepressed.png)";

//        }, false);
//        fire.addEventListener('touchend', function (event) {
//            fire.style.backgroundImage = "url(Images/Button/buttonfire.png)";

//        }, false);
//    }
//}