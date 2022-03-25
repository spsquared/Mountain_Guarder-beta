// Copyright (C) 2022 Radioactive64

// prompts
socket.on('prompt', async function(id) {
    var data = Prompts[id];
    document.getElementById('promptContainer').style.display = 'block';
    await sleep((11-settings.dialogueSpeed)*10);
    var optionDivs = [];
    for (var i in data.options) {
        var div = document.createElement('div');
        div.classList.add('promptChoice');
        div.classList.add('ui-lightbutton');
        div.option = parseInt(i);
        div.onclick = function() {
            socket.emit('promptChoose', this.option);
            document.getElementById('promptContainer').style.display = 'none';
            document.getElementById('promptContainer').innerHTML = '<div id="promptText"></div><div id="promptChoices"></div>';
        };
        optionDivs[i] = div;
    }
    var textDiv = document.getElementById('promptText');
    await displayText(data.text, textDiv);
    for (var i in optionDivs) {
        document.getElementById('promptChoices').appendChild(optionDivs[i]);
        await sleep((11-settings.dialogueSpeed)*10);
        await displayText(data.options[i].text, optionDivs[i]);
    }
});
Prompts = [];
async function displayText(text, div) {
    for (var i in text) {
        var letter = document.createElement('span');
        letter.classList.add('ui-lighttext');
        letter.classList.add('promptFade');
        letter.innerText = text[i];
        div.appendChild(letter);
        await sleep((11-settings.dialogueSpeed)*10);
    }
};
function getNpcDialogues() {
    var request = new XMLHttpRequest();
    request.open('GET', '/client/prompts.json', false);
    request.onload = async function() {
        if (this.status >= 200 && this.status < 400) {
            var json = JSON.parse(this.response);
            Prompts = json;
            loadedassets++;
        } else {
            console.error('Error: Server returned status ' + this.status);
            await sleep(1000);
            request.send();
        }
    };
    request.onerror = function(){
        console.error('There was a connection error. Please retry');
    };
    request.send();
};
async function loadNpcDialogues() {};
