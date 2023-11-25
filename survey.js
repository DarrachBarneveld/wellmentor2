// DUMMY CODE FOR SURVEY
import data from "./test_questions.json";
const DATA = data;

const questionText = document.getElementById("question");
const answersText = document.getElementById("answers");
const answersBtns = answersText.querySelectorAll(".btn");
const display = document.getElementById("display");
const score = document.querySelector("score");
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
    const jsonString = JSON.stringify(SCORE);
    if (localStorage.getItem("score")) {
      // If it exists, overwrite it
      localStorage.setItem("score", jsonString);
    } else {
      // If it doesn't exist, create a new entry
      localStorage.setItem("score", jsonString);
    }
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
