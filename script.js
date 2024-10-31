const questions = [{
        question: "What is the shortcut for copying selected text in MS Word?",
        options: ["Ctrl + X", "Ctrl + V", "Ctrl + C", "Ctrl + A"],
        answer: "Ctrl + C"
    },
    {
        question: "Which keyboard shortcut is used to bold text in MS Word?",
        options: ["Ctrl + U", "Ctrl + I", "Ctrl + B", "Ctrl + Z"],
        answer: "Ctrl + B"
    },
    {
        question: "What is the shortcut to open a new document in MS Word?",
        options: ["Ctrl + N", "Ctrl + O", "Ctrl + P", "Ctrl + D"],
        answer: "Ctrl + N"
    },
    {
        question: "Which shortcut will paste the copied content in MS Word?",
        options: ["Ctrl + X", "Ctrl + C", "Ctrl + V", "Ctrl + A"],
        answer: "Ctrl + V"
    },
    {
        question: "What is the shortcut to undo an action in MS Word?",
        options: ["Ctrl + Z", "Ctrl + Y", "Ctrl + U", "Ctrl + I"],
        answer: "Ctrl + Z"
    },
    {
        question: "Which shortcut will align text to the center in MS Word?",
        options: ["Ctrl + L", "Ctrl + E", "Ctrl + R", "Ctrl + J"],
        answer: "Ctrl + E"
    },
    {
        question: "What is the shortcut to insert a new slide in MS PowerPoint?",
        options: ["Ctrl + M", "Ctrl + N", "Ctrl + I", "Ctrl + S"],
        answer: "Ctrl + M"
    },
    {
        question: "What is the keyboard shortcut to start a slideshow in MS PowerPoint?",
        options: ["F5", "Ctrl + S", "Ctrl + T", "F2"],
        answer: "F5"
    },
    {
        question: "Which shortcut is used to duplicate a slide in MS PowerPoint?",
        options: ["Ctrl + D", "Ctrl + V", "Ctrl + C", "Ctrl + M"],
        answer: "Ctrl + D"
    },
    {
        question: "What is the shortcut to select all content in MS Excel?",
        options: ["Ctrl + A", "Ctrl + S", "Ctrl + P", "Ctrl + L"],
        answer: "Ctrl + A"
    },
    {
        question: "What is the shortcut to insert a new worksheet in MS Excel?",
        options: ["Shift + F11", "Ctrl + F11", "Alt + F11", "Ctrl + N"],
        answer: "Shift + F11"
    },
    {
        question: "Which shortcut will save the current file in MS Office?",
        options: ["Ctrl + P", "Ctrl + S", "Ctrl + D", "Ctrl + O"],
        answer: "Ctrl + S"
    }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 60;
let wrongAnswers = [];
let totalTimeTaken = 0;
let username = '';

document.getElementById('start-quiz').onclick = () => {
    username = document.getElementById('username').value;
    if (username) {
        startQuiz();
    } else {
        alert("Please enter your name.");
    }
};

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    wrongAnswers = [];
    totalTimeTaken = 0;
    document.getElementById('welcome').classList.add('hidden');
    document.getElementById('quiz').style.display = 'block';
    document.getElementById('results').classList.add('hidden');
    displayQuestion();
}

function displayQuestion() {
    resetTimer();

    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    const questionNumberElement = document.getElementById('question-number');

    questionElement.innerText = questions[currentQuestionIndex].question;
    optionsElement.innerHTML = '';

    questions[currentQuestionIndex].options.forEach(option => {
        const optionDiv = document.createElement('div');
        optionDiv.innerText = option;
        optionDiv.onclick = () => selectOption(optionDiv);
        optionsElement.appendChild(optionDiv);
    });

    questionNumberElement.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
}

function selectOption(optionDiv) {
    const options = document.querySelectorAll('#options div');
    options.forEach(option => option.classList.remove('selected'));
    optionDiv.classList.add('selected');
}

document.getElementById('next').onclick = () => {
    moveToNextQuestion();
};

function moveToNextQuestion() {
    clearInterval(timer);

    const selectedOption = document.querySelector('#options .selected');
    const timeTaken = 60 - timeLeft;

    if (selectedOption) {
        if (selectedOption.innerText === questions[currentQuestionIndex].answer) {
            score++;
        } else {
            wrongAnswers.push({
                question: questions[currentQuestionIndex].question,
                correctAnswer: questions[currentQuestionIndex].answer,
                selected: selectedOption.innerText
            });
        }
    } else {
        wrongAnswers.push({
            question: questions[currentQuestionIndex].question,
            correctAnswer: questions[currentQuestionIndex].answer,
            selected: 'No Answer'
        });
    }

    totalTimeTaken += timeTaken;
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        displayQuestion();
    } else {
        endQuiz();
    }
}

function startTimer() {
    timeLeft = 60;
    document.getElementById('time').innerText = timeLeft;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time').innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timer);
            moveToNextQuestion();
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    startTimer();
}

function endQuiz() {
    clearInterval(timer);
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('score').innerText = `${username}, you scored ${score} out of ${questions.length}. Total time taken: ${totalTimeTaken} seconds.`;

    const wrongAnswersElement = document.getElementById('wrong-answers');
    wrongAnswersElement.innerHTML = '';

    if (wrongAnswers.length === 0) {
        wrongAnswersElement.innerHTML = '<li>Congratulations! You got all answers correct!</li>';
    } else {
        wrongAnswers.forEach(answer => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>Question:</strong> ${answer.question} <br> 
                <strong>Your answer:</strong> <span class="wrong-answer">${answer.selected}</span> <br> 
                <strong>Correct answer:</strong> <span class="correct-answer">${answer.correctAnswer}</span>`;
            wrongAnswersElement.appendChild(li);
        });
    }

    updateLeaderboard();
}

function updateLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    leaderboard.push({
        name: username,
        score: score,
        time: totalTimeTaken
    });

    // Sort by score first, then by time if scores are the same
    leaderboard.sort((a, b) => {
        if (b.score === a.score) {
            return a.time - b.time; // If scores are the same, sort by time (ascending)
        }
        return b.score - a.score; // Sort by score (descending)
    });

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
    displayLeaderboard(leaderboard);
}

function displayLeaderboard(leaderboard) {
    const leaderboardElement = document.getElementById('leaderboard');
    leaderboardElement.innerHTML = '';
    leaderboard.forEach(entry => {
        const li = document.createElement('li');
        li.innerText = `${entry.name}: Score: ${entry.score}, Time: ${entry.time} seconds`;
        leaderboardElement.appendChild(li);
    });
}

document.getElementById('clear-leaderboard').onclick = () => {
    localStorage.removeItem('leaderboard');
    document.getElementById('leaderboard').innerHTML = '';
};

document.getElementById('retake').onclick = () => {
    startQuiz();
};

window.onload = () => {
    document.getElementById('quiz').style.display = 'none';
    document.getElementById('results').classList.add('hidden');
};
