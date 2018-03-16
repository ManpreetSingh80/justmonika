var dialogElem = document.getElementById('dialog');
var dialogBoxElem = document.getElementById('dialog-box');
var talkBtnElem = document.getElementById('talk_btn');
var timer, counter;
var message = [];
var messageDelay = 7000;
var topicDelay = 2*60000;
var variables = {
    player: 'Darling'
};
var talk = true;
var conversation_start = true;

function toggleTalk() {
    if (talk === false) {
        setTimeout(loadConversation, 2000);
        talk = true;
        talkBtnElem.innerHTML = 'Disable Talk';
    } else {
        clearText();
        dialogBoxElem.style.opacity = 0;
        talk = false;
        talkBtnElem.innerHTML = 'Enable Talk';
    }
}

function fillVariables(text) {
    return text.replace(/\[.+\]/g, str => `${variables[str.slice(1,-1)]}`)
}

function animateText(text) {
    counter = 1;
    timer = setInterval('loadText(" ' + text + '")', 30);
}


function loadText(text) {
    dialogElem.innerHTML = text.substring(0, counter);
    if (counter >= text.length) {
        clearInterval(timer);
    } else {
        counter++;
    }
}

function clearText() {
    clearInterval(timer);
    dialogElem.innerHTML = "";
};

function onSkip() {
    if (talk !== true) {
        return;
    }
    clearText();
    if (message.length) {
        if (dialogBoxElem.style.opacity !== "1") {
           dialogBoxElem.style.opacity = 1; 
        }
        var text = fillVariables(message.shift());
        animateText(text); 
    } else {
        dialogBoxElem.style.opacity = 0;
    }
}


document.addEventListener('keypress', onSkip);
document.getElementsByTagName('body')[0].addEventListener('click', onSkip);

function getRandomNumber(low, high) {
    return low + Math.floor(Math.random()*high);
}

function rotateMessages() {
    if (message.length) {
        onSkip();
        setTimeout(rotateMessages, messageDelay);
    } else {
        onSkip();
        setTimeout(loadConversation, topicDelay);
    }
}

function isNewUser() {
    if (typeof(Storage) !== "undefined") {
        // Code for localStorage/sessionStorage.
        if (localStorage.getItem("monika.chr")) {
            return false;
        } else {
            localStorage.setItem('monika.chr','Dont delete my file');
            return true;
        }
    } else {
        // Sorry! No Web Storage support..
        return true;
    }
}

function loadConversation() {
    if (talk !== true) {
        return;
    }
    if (conversation_start) {
        conversation_start = false;
        if (isNewUser()) {
            // load random topic
            var topicsList = Object.keys(topics);
            topic = topicsList[getRandomNumber(0,topicsList.length)];
            message = topics[topic];
            rotateMessages();
        } else {
            // load a starter
            var topicsList = Object.keys(conversation_starters);
            topic = topicsList[getRandomNumber(0,topicsList.length)];
            message = conversation_starters[topic];
            rotateMessages();
        }
    } else {
        // load random topic
        var topicsList = Object.keys(topics);
        topic = topicsList[getRandomNumber(0,topicsList.length)];
        message = topics[topic];
        rotateMessages();
    }
}

(function(){setTimeout(loadConversation, 2000);})();

function doFullScreen() {
    console.log('request full screen');
    setTimeout(() => requestFullScreen(document.body), 100);
}

function cancelFullScreen(el) {
    var requestMethod = el.cancelFullScreen||el.webkitCancelFullScreen||el.mozCancelFullScreen||el.exitFullscreen;
    if (requestMethod) { // cancel full screen.
        requestMethod.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
}

function requestFullScreen(el) {
    // Supports most browsers and their versions.
    var requestMethod = el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen;

    if (requestMethod) { // Native full screen.
        requestMethod.call(el);
    } else if (typeof window.ActiveXObject !== "undefined") { // Older IE.
        var wscript = new ActiveXObject("WScript.Shell");
        if (wscript !== null) {
            wscript.SendKeys("{F11}");
        }
    }
    return false;
}

function toggleFull() {
    var elem = document.body; // Make the body go full screen.
    var isInFullScreen = (document.fullScreenElement && document.fullScreenElement !== null) ||  (document.mozFullScreen || document.webkitIsFullScreen);

    if (isInFullScreen) {
        cancelFullScreen(document);
    } else {
        requestFullScreen(elem);
    }
    return false;
}
