import "../styles/index.css";
import { questions } from "./questions";

const startButton = document.querySelector(".start-button");
const questionTemplate = document.querySelector(".question-container");

let currentQuestionIndex = 0;
let score = 0;

startButton.addEventListener("click", function () {
  currentQuestionIndex = 0;
  score = 0;

  const existingQuestions = document.querySelectorAll(".question-content");
  const resultsCard = document.querySelector(".results-card");

  existingQuestions.forEach((question) => question.remove());
  if (resultsCard) resultsCard.remove();
  showQuestion(currentQuestionIndex);
});

function showQuestion(index) {
  const questionClone = questionTemplate.content.cloneNode(true);
  const questionContent = questionClone.querySelector(".question-content");

  questionContent.dataset.questionIndex = index;

  const currentQuestion = questions[index];

  questionContent.querySelector(".question-title").textContent =
    currentQuestion.question;
  questionContent.querySelector(".question-image").src = currentQuestion.image;

  const optionsContainer = questionContent.querySelector(".coffee-question");
  const options = optionsContainer.querySelectorAll("input");
  const labels = optionsContainer.querySelectorAll("label");

  options.forEach((option, i) => {
    const uniqueId = `question-${index}-option-${i}`;
    option.id = uniqueId;
    option.value = currentQuestion.options[i];
    labels[i].htmlFor = uniqueId;
    labels[i].textContent = currentQuestion.options[i];
    option.checked = false;
  });

  const submitButton = questionContent.querySelector(".submit-button");
  if (index === questions.length - 1) {
    submitButton.textContent = "Завершить викторину";
  } else {
    submitButton.textContent = "Давай дальше!";
  }

  const lastQuestion = document.querySelector(".question-content:last-of-type");
  if (lastQuestion) {
    lastQuestion.after(questionContent);
  } else {
    const startCard = document.querySelector(".card");
    startCard.after(questionContent);
  }

  setTimeout(() => {
    questionContent.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, 50);

  submitButton.addEventListener("click", function (evt) {
    evt.preventDefault();
    handleAnswer(currentQuestion, questionContent);
  });
}

function handleAnswer(currentQuestion, questionElement) {
  const selectedOption = questionElement.querySelector(
    'input[name="coffee"]:checked'
  );

  if (!selectedOption) {
    alert("Пожалуйста, выберите ответ!");
    return;
  }

  const isCorrect = selectedOption.value === currentQuestion.answer;

  if (isCorrect) {
    score++;
    questionElement.style.borderColor = "green";
    questionElement.style.backgroundColor = "rgba(0, 255, 0, 0.1)";
  } else {
    questionElement.style.borderColor = "red";
    questionElement.style.backgroundColor = "rgba(255, 0, 0, 0.1)";

    const correctOption = questionElement.querySelector(
      `input[value="${currentQuestion.answer}"]`
    );
    if (correctOption) {
      const correctLabel = correctOption.nextElementSibling;
      correctLabel.style.color = "green";
      correctLabel.style.fontWeight = "bold";
    }
  }

  const submitButton = questionElement.querySelector(".submit-button");
  submitButton.disabled = true;
  submitButton.textContent = "Ответ зафиксирован";
  submitButton.style.backgroundColor = "rgb(243, 233, 220)";

  const radioButtons = questionElement.querySelectorAll('input[type="radio"]');
  radioButtons.forEach((radio) => {
    radio.disabled = true;
  });

  currentQuestionIndex++;

  if (currentQuestionIndex < questions.length) {
    showQuestion(currentQuestionIndex);
  } else {
    showResults();
  }
}

function showResults() {
  const resultsCard = document.createElement("div");
  resultsCard.className = "card results-card";
  resultsCard.innerHTML = `
    <h1 class="main-title">Викторина завершена!</h1>
    <p>Ваш результат: ${score} из ${questions.length}</p>
    <p>Процент правильных ответов: ${Math.round(
      (score / questions.length) * 100
    )}%</p>
    <button class="start-button">Пройти еще раз</button>
  `;

  const lastQuestion = document.querySelector(".question-content:last-of-type");
  if (lastQuestion) {
    lastQuestion.after(resultsCard);
  } else {
    document.body.appendChild(resultsCard);
  }

  resultsCard.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });

  resultsCard
    .querySelector(".start-button")
    .addEventListener("click", function () {
      const existingQuestions = document.querySelectorAll(".question-content");
      existingQuestions.forEach((question) => question.remove());
      resultsCard.remove();

      currentQuestionIndex = 0;
      score = 0;
      showQuestion(currentQuestionIndex);
    });
}
