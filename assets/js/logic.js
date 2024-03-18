class Quiz {
  constructor() {
    this.currentQuestionIndex = 0;
    this.time = questions.length * 15;
    this.timerId = null;
    this.questionsEl = document.getElementById('questions');
    this.timerEl = document.getElementById('time');
    this.choicesEl = document.getElementById('choices');
    this.submitBtn = document.getElementById('submit');
    this.startBtn = document.getElementById('start');
    this.initialsEl = document.getElementById('initials');
    this.feedbackEl = document.getElementById('feedback');
    this.sfxRight = new Audio('assets/sfx/correct.wav');
    this.sfxWrong = new Audio('assets/sfx/incorrect.wav');
  }

  startQuiz() {
    const startScreenEl = document.getElementById('start-screen');
    startScreenEl.classList.add('hide');
    this.questionsEl.classList.remove('hide');
    this.timerId = setInterval(() => this.clockTick(), 1000);
    this.timerEl.textContent = this.time;
    this.getQuestion();
  }

  getQuestion() {
    const currentQuestion = questions[this.currentQuestionIndex];
    const titleEl = document.getElementById('question-title');
    titleEl.textContent = currentQuestion.title;
    this.choicesEl.innerHTML = '';
    currentQuestion.choices.forEach((choice, index) => {
      const choiceNode = document.createElement('button');
      choiceNode.classList.add('choice');
      choiceNode.setAttribute('value', choice);
      choiceNode.textContent = index + 1 + '. ' + choice;
      this.choicesEl.appendChild(choiceNode);
    });
  }

  questionClick(event) {
    const buttonEl = event.target;
    if (!buttonEl.matches('.choice')) {
      return;
    }
    if (buttonEl.value !== questions[this.currentQuestionIndex].answer) {
      this.time -= 15;
      if (this.time < 0) {
        this.time = 0;
      }
      this.timerEl.textContent = this.time;
      this.sfxWrong.play();
      this.feedbackEl.textContent = 'Wrong!';
    } else {
      this.sfxRight.play();
      this.feedbackEl.textContent = 'Correct!';
    }
    this.feedbackEl.classList.remove('hide');
    setTimeout(() => {
      this.feedbackEl.classList.add('hide');
    }, 1000);
    this.currentQuestionIndex++;
    if (this.time <= 0 || this.currentQuestionIndex === questions.length) {
      this.quizEnd();
    } else {
      this.getQuestion();
    }
  }

  quizEnd() {
    clearInterval(this.timerId);
    const endScreenEl = document.getElementById('end-screen');
    endScreenEl.classList.remove('hide');
    this.questionsEl.classList.add('hide');
    const finalScoreEl = document.getElementById('final-score');
    finalScoreEl.textContent = this.time;
  }

  clockTick() {
    this.time--;
    this.timerEl.textContent = this.time;
    if (this.time <= 0) {
      this.quizEnd();
    }
  }

  saveHighscore() {
    const initials = this.initialsEl.value.trim();
    if (initials !== '') {
      const highscores = JSON.parse(window.localStorage.getItem('highscores')) || [];
      const newScore = {
        score: this.time,
        initials: initials
      };
      highscores.push(newScore);
      window.localStorage.setItem('highscores', JSON.stringify(highscores));
      window.location.href = 'highscores.html';
    }
  }

  checkForEnter(event) {
    if (event.key === 'Enter') {
      this.saveHighscore();
    }
  }

  init() {
    this.submitBtn.addEventListener('click', () => this.saveHighscore());
    this.startBtn.addEventListener('click', () => this.startQuiz());
    this.choicesEl.addEventListener('click', (event) => this.questionClick(event));
    this.initialsEl.addEventListener('keyup', (event) => this.checkForEnter(event));
  }
}

const quiz = new Quiz();
quiz.init();
