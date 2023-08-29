const difficultySelect = document.getElementById('difficulty');
const typeSelect = document.getElementById('type');
const categorySelect = document.getElementById('category');
const generateButton = document.getElementById('generate');
const triviaContainer = document.querySelector('.trivia');
const resultsContainer = document.querySelector('.results');
const scoreDisplay = document.getElementById('score');
const newTriviaButton = document.getElementById('newTrivia');

// Fetch categories from API and populate category select dropdown
fetch('https://opentdb.com/api_category.php')
  .then(response => response.json())
  .then(data => {
    data.trivia_categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name;
      categorySelect.appendChild(option);
    });
  });

generateButton.addEventListener('click', () => {
  const difficulty = difficultySelect.value;
  const type = typeSelect.value;
  const category = categorySelect.value;

  // Fetch trivia questions from API using selected parameters
  fetch(`https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`)
    .then(response => response.json())
    .then(data => {
      populateTrivia(data.results);
    });
});

function populateTrivia(questions) {
  triviaContainer.innerHTML = '';
  let score = 0;

  questions.forEach((question, index) => {
    const questionElement = document.createElement('div');
    questionElement.className = 'question';
    questionElement.innerHTML = `
      <h3>Question ${index + 1}:</h3>
      <p>${question.question}</p>
    `;

    const options = [...question.incorrect_answers, question.correct_answer];
    options.sort(() => Math.random() - 0.5);

    options.forEach(option => {
      const optionElement = document.createElement('button');
      optionElement.className = 'option';
      optionElement.textContent = option;
      optionElement.addEventListener('click', () => {
        if (option === question.correct_answer) {
          score += 100;
        }
        questionElement.querySelectorAll('.option').forEach(btn => {
          btn.disabled = true;
        });
        scoreDisplay.textContent = `Score: ${score}`;
      });
      questionElement.appendChild(optionElement);
    });

    triviaContainer.appendChild(questionElement);
  });

  triviaContainer.style.display = 'block';
  resultsContainer.style.display = 'none';
}

newTriviaButton.addEventListener('click', () => {
  triviaContainer.style.display = 'none';
  resultsContainer.style.display = 'none';
});
