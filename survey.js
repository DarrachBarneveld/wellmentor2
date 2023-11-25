// DUMMY CODE FOR SURVEY
import data from "./questions.json";
const DATA = data;

const questionText = document.getElementById("question");
const answersText = document.getElementById("answers");
const answersBtns = answersText.querySelectorAll(".btn");
const display = document.getElementById("display");
const score = document.querySelector("score");
const form = document.getElementById("form");
const checkResultsBtn = document.getElementById("check-results");

let TOTALINDEX = 0;
let SCORE = {
  physical: 0,
  depression: 0,
  relationships: 0,
  mental: 0,
  professional: 0,
  anxiety: 0,
};

document.addEventListener("DOMContentLoaded", () => {
  nextQuestion(DATA, TOTALINDEX);
});

async function nextQuestion(data, index) {
  if (data.length <= index) {
    document.getElementById("id_physical").value = SCORE.physical;
    document.getElementById("id_depression").value = SCORE.depression;
    document.getElementById("id_relationship").value = SCORE.relationships;
    document.getElementById("id_professional").value = SCORE.professional;
    document.getElementById("id_mental").value = SCORE.mental;
    document.getElementById("id_anxiety").value = SCORE.anxiety;
    display.innerHTML = "";
    checkResultsBtn.classList.remove("hidden");
    return;
  }

  questionText.innerHTML = `<h2>${data[index].question}</h2>`;

  answersText.innerHTML = "";

  const answersCount = data[index].answers.length;

  for (var n = 0; n < answersCount; n++) {
    var button = document.createElement("button");

    const { category } = data[index];
    button.innerHTML = data[index].answers[n];

    // Updated to reach 100 if max answer - 5 possible answers each
    button.value = 25 * n;
    button.classList.add("btn");
    button.addEventListener("click", (e) => storeAnswer(e, category));
    answersText.appendChild(button);
  }

  TOTALINDEX++;
}

function storeAnswer(e, category) {
  const buttonValue = e.target.closest("button").value;

  SCORE[category] += +buttonValue;

  nextQuestion(DATA, TOTALINDEX);
}

answersBtns.forEach((button) => {
  button.addEventListener("click", (e) => storeAnswer(e));
});

checkResultsBtn.addEventListener("click", () => form.submit());
