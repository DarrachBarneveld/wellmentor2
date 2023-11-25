import { collection, getDocs } from "@firebase/firestore";
import { firebaseDB } from "./config/firebase";
const OpenAI = require("openai");
let openai;

let SCORE = localStorage.getItem("score");
let LOWESTCAT = "";

if (SCORE) {
  SCORE = JSON.parse(SCORE);
} else {
  console.log("No object found in local storage.");
}
const loader = document.getElementById("loader");
const loaderText = document.getElementById("loaderText");
const GTPCAT = document.getElementById("gpt-title");

let apiKey = "";

findLowestCategory(SCORE);
function findLowestCategory(categories) {
  let lowestCategory = null;
  let lowestValue = Infinity;

  for (const category in categories) {
    if (categories.hasOwnProperty(category)) {
      const value = categories[category];

      if (value < lowestValue) {
        lowestValue = value;
        lowestCategory = category;
      }
    }
  }
  LOWESTCAT = lowestCategory;
}

const DUMMY_DATA = [
  { section: "Physical", value: SCORE.physical, icon: "fa-solid fa-dumbbell" },
  {
    section: "Depression",
    value: SCORE.depression,
    icon: "fa-solid fa-cloud-rain",
  },
  {
    section: "Relationships",
    value: SCORE.relationships,
    icon: "fa-solid fa-user-group",
  },
  { section: "Mental", value: SCORE.mental, icon: "fa-solid fa-brain" },
  {
    section: "Anxiety",
    value: SCORE.anxiety,
    icon: "fa-solid fa-bolt-lightning",
  },
  {
    section: "Professional",
    value: SCORE.professional,
    icon: "fa-solid fa-user-tie",
  },
];

const height = 110;
const width = 100;
const barWidth = 100;
const barOffset = 10;
const barColor = [
  "#CD2A51",
  "#4670f3",
  "#d9b988",
  "#f5c041",
  "#865527",
  "	#008000",
];
const barBackground = "whitesmoke";

async function init() {
  const { key } = await getGPTKey();

  openai = new OpenAI({
    apiKey: key,
    dangerouslyAllowBrowser: true,
  });
  apiKey = key;

  askgpt();
  // openai = new OpenAI({
  //   apiKey: key,
  //   dangerouslyAllowBrowser: true,
  // });
}

// const askgpt = async () => {
//   let outputArea = document.getElementById("gpt");

//   console.log("fire");
//   const chatCompletion = await openai.chat.completions
//     .create({
//       model: "gpt-3.5-turbo",
//       messages: [{ role: "user", content: QUESTION }],
//     })
//     .then((res) => (outputArea.value = res.choices[0].message.content));

//   console.log(chatCompletion);
// };

export async function getGPTKey() {
  try {
    const userCollectionRef = collection(firebaseDB, "api");
    const querySnapshot = await getDocs(userCollectionRef);

    const key = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      key.push(data);
    });

    return key[0];
  } catch (error) {
    console.error("Error fetching documents: ", error);
  }
}

init();

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

if (!isObjectEmpty(SCORE)) {
  DUMMY_DATA.forEach((item, index) => {
    const col = document.createElement("div");
    col.classList.add("col-md-4", "col-6");
    const resultCard = document.createElement("div");
    resultCard.classList.add("results-card");
    const sectionTitle = item.section.toUpperCase();
    resultCard.innerHTML = `<div class="bar ${item.section}"></div><div class="bar-title"><i style="color: #CD2A51;"class="${item.icon}" style="color: green"></i><span>${item.value}</span></div>`;
    col.appendChild(resultCard);
    const resultsContainer = document.querySelector(".row");
    resultsContainer.appendChild(col);

    const svg = d3
      .select(`.${item.section}`)
      .append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("background", barBackground)
      .style("border-radius", "7px");

    svg
      .selectAll("rect")
      .data([item.value])
      .enter()
      .append("rect")
      .style("fill", barColor[index])
      .attr("width", barWidth)
      .attr("rx", 3)
      .attr("height", (d) => d)
      .attr("x", 0)
      .attr("y", (d) => height - d);
  });
}

const QUESTION = `User
write short bulletpoints on how i can improve my mental health in relation to ${LOWESTCAT}`;

function askgpt() {
  loader.classList.remove("hidden");
  loaderText.classList.remove("hidden");

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: QUESTION }],
      max_tokens: 60,
      temperature: 0.2,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Data from API:", data);
      // Access the assistant's reply
      const assistantReply = data.choices[0].message.content;
      const replyText =
        typeof assistantReply === "object"
          ? assistantReply.text
          : assistantReply;
      console.log("Assistant Reply:", replyText);
      loader.classList.add("hidden");
      loaderText.classList.add("hidden");

      const container = document.getElementById("gpt");
      GTPCAT.innerText = `You need help in ${LOWESTCAT} Health`;
      container.innerText = replyText;

      console.log("hi");
    })
    .catch((error) => console.error("Error fetching data:", error));
}
