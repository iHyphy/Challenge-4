// Variables to keep track of quiz state
var currentQuestionIndex = 0;
var time = questions.length * 15;
var timerId;

// DOM elements
var questionsEl = document.getElementById('questions');
var timerEl = document.getElementById('time');
var choicesEl = document.getElementById('choices');
var submitBtn = document.getElementById('submit');
var startBtn = document.getElementById('start');
var initialsEl = document.getElementById('initials');
var feedbackEl = document.getElementById('feedback');

// Sound effects
var sfxRight = new Audio('assets/sfx/correct.wav');
var sfxWrong = new Audio('assets/sfx/incorrect.wav');

// Function to start the quiz
function startQuiz() {
  var startScreenEl = document.getElementById('start-screen');
  startScreenEl.classList.add('hide');

  questionsEl.classList.remove('hide');

  timerId = setInterval(clockTick, 1000);

  timerEl.textContent = time;

  getQuestion();
}

// Function to get the current question
function getQuestion() {
  var currentQuestion = questions[currentQuestionIndex];

  var titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;

  choicesEl.innerHTML = '';

  currentQuestion.choices.forEach(function(choice, index) {
    var choiceNode = document.createElement('button');
    choiceNode.classList.add('choice');
    choiceNode.setAttribute('value', choice);
    choiceNode.textContent = index + 1 + '. ' + choice;
    choicesEl.appendChild(choiceNode);
  });
}

// Function to handle click events on choices
function questionClick(event) {
  var buttonEl = event.target;

  if (!buttonEl.matches('.choice')) {
    return;
  }

  if (buttonEl.value !== questions[currentQuestionIndex].answer) {
    time -= 15;
    if (time < 0) {
      time = 0;
    }
    timerEl.textContent = time;
    sfxWrong.play();
    feedbackEl.textContent = 'Wrong!';
  } else {
    sfxRight.play();
    feedbackEl.textContent = 'Correct!';
  }

  feedbackEl.classList.remove('hide');
  setTimeout(function () {
    feedbackEl.classList.add('hide');
  }, 1000);

  currentQuestionIndex++;

  if (time <= 0 || currentQuestionIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

// Function to end the quiz
function quizEnd() {
  clearInterval(timerId);

  var endScreenEl = document.getElementById('end-screen');
  endScreenEl.classList.remove('hide');

  questionsEl.classList.add('hide');

  var finalScoreEl = document.getElementById('final-score');
  finalScoreEl.textContent = time;
}

// Function to update the timer
function clockTick() {
  time--;
  timerEl.textContent = time;

  if (time <= 0) {
    quizEnd();
  }
}

// Function to save highscore
function saveHighscore() {
  var initials = initialsEl.value.trim();

  if (initials !== '') {
    var highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];

    var newScore = {
      score: time,
      initials: initials
    };

    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    window.location.href = 'highscores.html';
  }
}

// Function to check for 'Enter' key press
function checkForEnter(event) {
  if (event.key === 'Enter') {
    saveHighscore();
  }
}

// Event listeners
submitBtn.addEventListener('click', saveHighscore);
startBtn.addEventListener('click', startQuiz);
choicesEl.addEventListener('click', questionClick);
initialsEl.addEventListener('keyup', checkForEnter);
