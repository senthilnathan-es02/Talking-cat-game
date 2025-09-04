class TalkingCat {
    constructor() {
        this.recognition = null;
        this.synthesis = window.speechSynthesis;
        this.isListening = false;
        this.isSpeaking = false;
        
        this.initSpeechRecognition();
        this.setupEventListeners();
        this.showWelcomeMessage();
    }

    initSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
            this.recognition.continuous = false;
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-IN';

            this.recognition.onstart = () => this.onListeningStart();
            this.recognition.onresult = (event) => this.onSpeechResult(event);
            this.recognition.onend = () => this.onListeningEnd();
            this.recognition.onerror = (event) => this.onSpeechError(event);
        } else {
            this.showMessage("Sorry! Your browser doesn't support speech recognition. Try Chrome! 😿");
        }
    }

    setupEventListeners() {
        const micButton = document.getElementById('micButton');
        micButton.addEventListener('click', () => this.toggleListening());

        // ✅ Click on cat → talk + emojis
        document.getElementById('catContainer').addEventListener('click', () => {
            this.randomCatReaction();
        });
    }

    toggleListening() {
        if (!this.recognition) {
            this.showMessage("Speech recognition not supported! 😿");
            return;
        }
        if (this.isListening) {
            this.stopListening();
        } else {
            this.startListening();
        }
    }

    startListening() {
        if (this.isSpeaking) {
            this.synthesis.cancel();
            this.stopTalking();
        }
        try {
            this.recognition.start();
        } catch (error) {
            console.log('Speech recognition error:', error);
            this.showMessage("Couldn't start listening! Try again! 😿");
        }
    }

    stopListening() {
        if (this.recognition) {
            this.recognition.stop();
        }
    }

    onListeningStart() {
        this.isListening = true;
        const micButton = document.getElementById('micButton');
        const status = document.getElementById('status');
        
        micButton.textContent = '🛑 Stop Listening';
        micButton.classList.add('listening');
        status.textContent = 'Listening... Speak now! 👂';
        status.className = 'status listening';
        
        this.showMessage("I'm listening. Please say something!");
        this.animateCatListening();
    }

    onListeningEnd() {
        this.isListening = false;
        const micButton = document.getElementById('micButton');
        const status = document.getElementById('status');
        
        micButton.textContent = '🎤 Talk to Me!';
        micButton.classList.remove('listening');
        status.textContent = 'Processing... 🤔';
        status.className = 'status';
    }

    onSpeechResult(event) {
        const transcript = event.results[0][0].transcript;
        console.log('Heard:', transcript);
        
        this.showMessage(`You said: "${transcript}"`);
        this.repeatInCatVoice(transcript);
    }

    onSpeechError(event) {
        console.log('Speech error:', event.error);
        const status = document.getElementById('status');
        
        if (event.error === 'no-speech') {
            status.textContent = "I didn't hear anything. Try again.";
        } else if (event.error === 'not-allowed') {
            status.textContent = "Please allow microphone access.";
        } else {
            status.textContent = "Something went wrong. Try again.";
        }
        status.className = 'status';
    }

    repeatInCatVoice(text) {
        if (!text || text.trim() === '') {
            this.showMessage("I did not catch that.");
            return;
        }

        let catText = "You said: " + text;
        const utterance = new SpeechSynthesisUtterance(catText);
        utterance.rate = 1; 
        utterance.pitch = 1; 
        utterance.volume = 1; 
        utterance.lang = "en-IN"; 

        utterance.onstart = () => this.startTalking();
        utterance.onend = () => this.stopTalking();

        this.synthesis.speak(utterance);
        this.showMessage(catText);
    }

    startTalking() {
        this.isSpeaking = true;
        const catMouth = document.getElementById('catMouth');
        const status = document.getElementById('status');
        
        catMouth.classList.add('talking');
        status.textContent = 'Speaking...';
        status.className = 'status speaking';
        
        this.animateCatTalking();
    }

    stopTalking() {
        this.isSpeaking = false;
        const catMouth = document.getElementById('catMouth');
        const status = document.getElementById('status');
        
        catMouth.classList.remove('talking');
        status.textContent = 'Ready to listen again.';
        status.className = 'status';
    }

    showMessage(message) {
        const speechBubble = document.getElementById('speechBubble');
        const speechText = document.getElementById('speechText');
        
        speechText.textContent = message;
        speechBubble.classList.add('show');
        
        setTimeout(() => {
            speechBubble.classList.remove('show');
        }, 4000);
    }

    showWelcomeMessage() {
        setTimeout(() => {
            const welcomeMsg = "Hello! I am your talking cat. Click the mic and speak with me.";
            this.showMessage(welcomeMsg);
            this.repeatInCatVoice("Hello! I am your talking cat. I am happy to meet you.");
        }, 1000);
    }

    animateCatListening() {
        const catContainer = document.getElementById('catContainer');
        catContainer.style.animation = 'float 1s ease-in-out infinite';
    }

    animateCatTalking() {
        const catContainer = document.getElementById('catContainer');
        catContainer.style.animation = 'bounce 0.5s ease-in-out infinite';
        
        setTimeout(() => {
            catContainer.style.animation = 'float 3s ease-in-out infinite';
        }, 2000);
    }

    // ✅ Cat random reaction (text + voice + emojis)
    randomCatReaction() {
        const reactions = [
            { msg: "Hello! Nice to see you.", emoji: "hearts" },
            { msg: "I am very happy now.", emoji: "hearts" },
            { msg: "You surprised me with chocolates!", emoji: "chocolates" },
            { msg: "I feel sleepy. Bring me my pillow!", emoji: "pillow" },
            { msg: "You clicked me. Thank you!", emoji: "hearts" },
            { msg: "You make me smile.", emoji: "hearts" }
        ];

        const random = reactions[Math.floor(Math.random() * reactions.length)];
        this.showMessage(random.msg);
        this.repeatInCatVoice(random.msg);
        this.createFloatingEmojis(random.emoji);
    }

    // ✅ Floating emojis generator
    createFloatingEmojis(type) {
        const container = document.getElementById('hearts');
        let emoji = '💕'; 

        if (type === "hearts") emoji = '💕';
        if (type === "chocolates") emoji = '🍫';
        if (type === "pillow") emoji = '🛏️';

        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const item = document.createElement('div');
                item.className = 'heart';
                item.innerHTML = emoji;
                item.style.left = Math.random() * 100 + '%';
                item.style.animationDelay = Math.random() * 1 + 's';
                
                container.appendChild(item);
                
                setTimeout(() => {
                    item.remove();
                }, 3000);
            }, i * 200);
        }
    }
}

// 🔻 Bottom option functions
function flashRed() {
    const catContainer = document.getElementById('catContainer');
    catContainer.classList.add('flash-red');
    setTimeout(() => {
        catContainer.classList.remove('flash-red');
    }, 600);
}

function makeKittyHappy() {
    const cat = window.talkingCat;
    cat.showMessage("I am very happy now!");
    cat.createFloatingEmojis("hearts");
    flashRed();
    cat.repeatInCatVoice("I am very happy now!");
}

function makeKittySurprised() {
    const cat = window.talkingCat;
    cat.showMessage("Oh! You surprised me with chocolates!");
    cat.createFloatingEmojis("chocolates");
    flashRed();
    cat.repeatInCatVoice("Oh! You surprised me with chocolates!");
}

function makeKittySleepy() {
    const cat = window.talkingCat;
    cat.showMessage("I feel sleepy. Bring me my pillow!");
    cat.createFloatingEmojis("pillow");
    flashRed();
    cat.repeatInCatVoice("I feel sleepy. Bring me my pillow!");
}

// ✅ Initialize
window.addEventListener('DOMContentLoaded', () => {
    window.talkingCat = new TalkingCat();
});

// ✅ Handle voices loading
window.speechSynthesis.onvoiceschanged = () => {
    console.log('Voices loaded');
};
