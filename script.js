import polishArray from './polish.js';
import englishArray from './english.js'

const switchBtn = document.getElementById("toggleBtn");
const polishCharacters = document.getElementById("polishCharacters");
const polishButton = document.getElementById("polishButton");
const word = document.getElementById("word");
const playAgainBtn = document.getElementById('playAgain');
const popup = document.getElementById('popupContainer');
const notification = document.getElementById('notification');
const finalMessage1 = document.getElementById('finalMessage1');
const finalMessage2 = document.getElementById('finalMessage2');

const keyboardBtn = document.querySelectorAll('#keyboardBtn');
const parts = document.querySelectorAll('.part');

const polishWords = polishArray();
const englishWords = englishArray();

let words = [...englishWords];

// switch language function
function switchLanguage() {
    if (switchBtn.checked) {
        words = [...polishWords];
    } else {
        words = [...englishWords];
    }
};


let selectedWord = words[Math.floor(Math.random() * words.length)];

const correctLetters = [];
const wrongLetters = [];

//show hidden word
function displayWord() {
    word.innerHTML = `${selectedWord
        .split('')
        .map(letter => `
            <span class="letter">
                ${correctLetters.includes(letter) ? letter : ''}
            </span>
        `)
        .join('')
    }`;

    const innerWord = word.innerText.replace(/\n/g, '');

    if(innerWord === selectedWord) {
        finalMessage1.innerText = 'Congratulations!';
        finalMessage2.innerText = 'Hangman is alive';
        popup.style.display = 'flex';
    }
}



// choose letter function
function insertLetter(chosenLetter) {
    if (selectedWord.includes(chosenLetter)) {
        if (!correctLetters.includes(chosenLetter)) {
            correctLetters.push(chosenLetter);
            displayWord();
        } else {
            showNotification();
        }
    } else {
        if (!wrongLetters.includes(chosenLetter)) {
            wrongLetters.push(chosenLetter);

            wrongLetter();
        } else {
            showNotification();
        }
    }
}


// update the wrong letters
function wrongLetter() {
 // display parts
    parts.forEach((part, index) => {
        const errors = wrongLetters.length;

        if(index < errors) {
            part.style.display = 'block';
        } else {
            part.style.display = "none";
        }
    })

// check if game is lost
if(wrongLetters.length === parts.length) {
    finalMessage1.innerText = `${selectedWord}`;
    finalMessage2.innerHTML = '<p>Why did you do this? You killed him! </p>';
    popup.style.display = 'flex';
}

}

//style correct and wrong letters on virtual keyboard
function styleKeyboardBtn() {
    keyboardBtn.forEach(btn => {
        if (wrongLetters.includes(btn.innerText)) {
            btn.classList.add('wrongLetter')
        } else if (correctLetters.includes(btn.innerText)) {
            btn.classList.add('correctLetter')
        }
    })
};


//show notification
function showNotification() {
    notification.classList.add('show');

    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000)
}



// show polish characters function
function showPolishCharacters() {
    polishCharacters.classList.toggle('hidden');
};

// flip arrow on polish button
function flipArrow() {
    if (polishCharacters.classList.contains('hidden')){
        polishButton.innerHTML = '<i class="fas fa-sort-down"></i>';
    } else {
        polishButton.innerHTML = '<i class="fas fa-sort-up"></i>';
    };
};




// EVENT LISTENERS
// real keyboard event listener
window.addEventListener('keydown', e => {
    if (e.keyCode >= 65 && e.keyCode <= 90) {//each key on keyboard has own keyCode
        const letter = e.key;
        insertLetter(letter);
        styleKeyboardBtn();
    }
});

// virtual keyboard event listener
keyboardBtn.forEach((btn) => {
    btn.addEventListener('click', event => {
        const letter = btn.innerText;

        insertLetter(letter);
        styleKeyboardBtn();
    })
})


//restart game
playAgainBtn.addEventListener('click', () => {
    //empty arrays
    correctLetters.splice(0);
    wrongLetters.splice(0);
    //new random world
    selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord();
    //reset parts of figure etc.
    wrongLetter();
    //remove popup
    popup.style.display = 'none';
    //return to default keyboard styling
    keyboardBtn.forEach((btn) => {
        btn.classList.remove('wrongLetter');
        btn.classList.remove('correctLetter');
    })
});

displayWord();

//switch polish/english words
switchBtn.addEventListener('change', () => {
    switchLanguage();
    correctLetters.splice(0);
    wrongLetters.splice(0);
    selectedWord = words[Math.floor(Math.random() * words.length)];
    displayWord();
    wrongLetter();
    
    keyboardBtn.forEach((btn) => {
        btn.classList.remove('wrongLetter', 'correctLetter');
    })
});

polishButton.addEventListener('click', () => {
    showPolishCharacters();
    flipArrow();
});

