let SCORE = localStorage.getItem("score");

if (SCORE) {
  SCORE = JSON.parse(SCORE);
} else {
  console.log("No object found in local storage.");
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
const barColor = "#CD2A51";
const barBackground = "#FAC041";

function isObjectEmpty(obj) {
  return Object.keys(obj).length === 0 && obj.constructor === Object;
}

if (!isObjectEmpty(SCORE)) {
  DUMMY_DATA.forEach((item) => {
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
      .style("fill", barColor)
      .attr("width", barWidth)
      .attr("rx", 3)
      .attr("height", (d) => d)
      .attr("x", 0)
      .attr("y", (d) => height - d);
  });
}

const apiKey = "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";

const question = `I have filled in the survey about my health. The scores are marked from 0-100. Here are my results: Physical: ${SCORE.physical} , depression: ${SCORE.depression}, relationships: ${SCORE.relationships}, mental: ${SCORE.mental}, profesional: ${SCORE.professional}, anxiety: ${SCORE.anxiety}. What would you reccomend me to do today to improve my life? Also what would you reccoment me to do for the rest of the week? Any other advice?`;
const testQuestion = "How can I improve my health?";
const physicalQuestion = `I have scored ${SCORE.physical} out of a 100 in a survey that checks my physical health status, what woudl you advise me to do to improve my score?`;

function testfetch() {
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: testQuestion },
        // Add more messages as needed
      ],
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
      const container = document.createElement("div");
      container.innerText = replyText;
      document.body.appendChild(container);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

testfetch();
