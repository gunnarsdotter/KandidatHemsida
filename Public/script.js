//Variable
var name;
var socket;
var socketIp = 'ws://192.168.43.177/'; 

//Fullscreen, (not for Safari)
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
//Remove dubble-touch
var lastTouchEnd = 0;
document.addEventListener('touchend', function (event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
        event.preventDefault();
    }
    lastTouchEnd = now;
}, false);
//Load when the player push start
function init() {
    //Change the websocket adress depending on where the server is on!!!
    socket = new WebSocket(socketIp);
    socket.onopen = function (event) {
        console.log('Connection is open ...');
        socket.send('CheckPlayer');
    };
    socket.onerror = function (err) {
        console.log('err: ', err);
        document.getElementById("errorView").style.visibility = "visible";
        document.getElementById("errorText").innerHTML = "ERROR: " + err;
        document.getElementById("startView").style.visibility = "hidden";
        document.getElementById("nameView").style.visibility = "hidden";
        document.getElementById("weaponView").style.visibility = "hidden";
        document.getElementById("gameView").style.visibility = "hidden";
    };
    socket.onclose = function () {
        //TODO- What will happen here?
        console.log("Connection is closed...");
    };
    //Messege recived from socket
    socket.onmessage = function (event) {
        arg = event.data.split(' ');
        //Change background depending on the players id
        // On error print the error
        // or when the game is ending do something?
        if (arg[0] == "changeBackground") {
            url = "url(Images/Avatars/avatar" + arg[1] + ".png)";
            document.getElementById("gameView").style.backgroundImage = url;
            document.getElementById("nameView").style.visibility = "hidden";
            document.getElementById("weaponView").style.visibility = "hidden";
            document.getElementById("gameView").style.visibility = "visible";
            document.getElementById("rotate").style.visibility = "hidden";
        }
        else if (arg[0] == "SCORE") {
            document.getElementById("score").innerHTML = arg[1];
        }
        else if (arg[0] == "ERROR") {
            document.getElementById("errorView").style.visibility = "visible";
            document.getElementById("errorText").innerHTML = event.data;
            document.getElementById("startView").style.visibility = "hidden";
            document.getElementById("nameView").style.visibility = "hidden";
            document.getElementById("weaponView").style.visibility = "hidden";
            document.getElementById("gameView").style.visibility = "hidden";
        }
        else if (arg[0] == "HEALTH") {
            if (arg[1] < 20) {
                document.getElementById("health").style.backgroundColor = "#ff875c"; //RÖD
            }
            else if (arg[1] < 50) {
                document.getElementById("health").style.backgroundColor = "#ff875c"; //GULA
            }
            else {
                document.getElementById("health").style.backgroundColor = "#87ffc5"; //GRÖN
            }
            document.getElementById("health").style.width = arg[1]+"%";
        }
        else if (arg[0] == "END") {
            //TODO- something?
        }
    };
}
//change view from start to name
function startFun() {
    openFullScreen();
    init();
    document.getElementById("startView").style.visibility = "hidden";
    document.getElementById("nameView").style.visibility = "inherit";
}
//Save name and make change view from name to weapon
function nameFun() {
    name = document.getElementById("nameField").value.trim().toLowerCase();
    //check the input name.
    if (name.includes("bajs") || true == name.includes("kuk")) {
        document.getElementById("nameField").placeholder = "NO, THAT IS NOT YOUR NAME!";
        document.getElementById("nameField").value = "";
    }
    else if (!(name == null || name == "" || name == "Name" || name == "Write your name" || name == "No, that is not your name!" || name == "ups, try again!" || name.length < 3)) {
        document.getElementById("nameView").style.visibility = "hidden";
        document.getElementById("weaponView").style.visibility = "inherit";
    }
    else {
        document.getElementById("nameField").placeholder = "UPS, TRY AGAIN!";
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
//save weapon and change view from vepon to game
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
function changeWepon() {
    document.getElementById("weaponView").style.visibility = "visible";
    document.getElementById("gameView").style.visibility = "hidden";
}

//Button push down respons, makes the buttons push visible
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
//Button push up respons, makes the buttons push visible
document.addEventListener('touchend', function (event) {
    if (event.srcElement.id == 'fireActive') event.srcElement.id = 'fire';
}, false);
document.addEventListener('touchend', function (event) {
    if (event.srcElement.id == 'leftActive') event.srcElement.id = 'left';
}, false);
document.addEventListener('touchend', function (event) {
    if (event.srcElement.id == 'rightActive') event.srcElement.id = 'right';
}, false);
