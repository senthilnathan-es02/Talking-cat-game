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
            this.recognition.lang = 'en-IN'; // Indian English

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

        // Click on cat for fun interactions
        document.getElementById('catContainer').addEventListener('click', () => {
            this.randomCatReaction();
            this.createHearts();
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

        // Keep simple words only
        let catText = "You said: " + text;

        const utterance = new SpeechSynthesisUtterance(catText);
        utterance.rate = 1; // normal speed
        utterance.pitch = 1; // normal pitch
        utterance.volume = 1; // clear volume
        utterance.lang = "en-IN"; // Indian English voice

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

    randomCatReaction() {
        const reactions = [
            "Hello! Nice to see you.",
            "I am very happy now.",
            "You clicked me. Thank you!",
            "I like talking with you.",
            "You make me smile."
        ];
        
        const randomReaction = reactions[Math.floor(Math.random() * reactions.length)];
        this.showMessage(randomReaction);
        this.repeatInCatVoice(randomReaction);
    }

    createHearts() {
        const heartsContainer = document.getElementById('hearts');
        
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.innerHTML = '💕';
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDelay = Math.random() * 1 + 's';
                
                heartsContainer.appendChild(heart);
                
                setTimeout(() => {
                    heart.remove();
                }, 3000);
            }, i * 200);
        }
    }
}

// Bottom options
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
    cat.createHearts();
    flashRed();
    cat.repeatInCatVoice("I am very happy now!");
}

function makeKittySurprised() {
    const cat = window.talkingCat;
    cat.showMessage("Oh! You surprised me!");
    flashRed();
    cat.repeatInCatVoice("Oh! You surprised me!");
}

function makeKittySleepy() {
    const cat = window.talkingCat;
    cat.showMessage("I feel sleepy now.");
    flashRed();
    cat.repeatInCatVoice("I feel sleepy now.");
}

// Initialize
window.addEventListener('DOMContentLoaded', () => {
    window.talkingCat = new TalkingCat();
});

// Handle voices loading
window.speechSynthesis.onvoiceschanged = () => {
    console.log('Voices loaded');
};
