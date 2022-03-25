// Copyright (C) 2022 Radioactive64

controllerConnected = false;
var axes = {
    movex: 0,
    movey: 0,
    aimx: 0,
    aimy: 0
};
var buttons = {
    attack: false,
    second: false,
    clicking: false,
};
async function updateControllers() {
    controllerConnected = false;
    var controllers = navigator.getGamepads();
    for (var i in controllers) {
        if (controllers[i] instanceof Gamepad) {
            controllerConnected = true;
            var controller = controllers[i];
            axes.movex = controller.axes[0];
            axes.movey = controller.axes[1];
            var size = Math.min(window.innerWidth, window.innerHeight)/2;
            axes.aimx = controller.axes[2]*size;
            axes.aimy = controller.axes[3]*size;
            document.getElementById('crossHair').style.left = axes.aimx + window.innerWidth/2-11 + 'px';
            document.getElementById('crossHair').style.top = axes.aimy + window.innerHeight/2-11 + 'px';
            // add section in settings for these keybinds
            buttons.attack = controller.buttons[6].pressed;
            buttons.second = controller.buttons[4].pressed;
            buttons.clicking = controller.buttons[0].pressed;
            break;
        }
    }
    if (controllerConnected) document.getElementById('crossHair').style.display = 'block';
    else document.getElementById('crossHair').style.display = '';
};
async function sendControllers() {
    socket.emit('controllerAxes', {
        movex: axes.movex,
        movey: axes.movey,
        aimx: axes.aimx,
        aimy: axes.aimy
    });
    if (buttons.clicking && document.getElementById('respawnButton').style.display == 'block') respawn();
};
window.ongamepadconnected = function(e) {
    controllers[e.gamepad.index] = e.gamepad;
};
window.ongamepaddisconnected = function(e) {
    delete controllers[e.gamepad.index];
};