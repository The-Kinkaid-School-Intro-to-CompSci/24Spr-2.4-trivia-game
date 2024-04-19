let triviaQuestions = [];
let score = 0;
let totalQuestions = 0;
let questionsAnswered = 0;

/************************* HELPER FUNCTIONS START  ****************************/
function clearContainer(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

/**
 * A functino to stop displaying a card
 * @param {HTMLDivElement} card - the card to stop displaying
 */
function dissappearACard(card){
    card.className = '';
    card.classList.add('d-none');
}

function reappearACard(card, areSections){
    card.className = '';
    if(areSections){
        card.classList.add('simple-border');
    }
    else{
        card.classList.add('card');
    }
    
    card.classList.add('my-3');
}

/**
 * A function to transition between the quiz and the choosing questions section
 * @param {Boolean} moveToQuiz - true if moving to the quiz, false if moving to the choosing questions section
 */
function transitionPhase(moveToQuiz){
    let questionsSection = document.querySelector('#questionsSection');
    let resultsSection = document.querySelector('#resultsSection');
    let choosingQuestionsSection = document.querySelector('#choosingQuestionsSection');

    if(moveToQuiz){
        reappearACard(questionsSection, true);
        reappearACard(resultsSection, true);
        dissappearACard(choosingQuestionsSection);
    }
    else{
        reappearACard(choosingQuestionsSection, true);
        dissappearACard(questionsSection);
        dissappearACard(resultsSection);
    }

}

/** YOU ONLY NEED TO CALL THIS FUNCTION --DO NOT MODIFY IT 
 * A function to decode the questions and answers.
 * You should call this function before displaying the questions.
 * Uses the he library to decode the questions and answers.
 * @param {Array} questions 
 * @returns {Array} - the questions with the decoded text added
 */
function fixQuestionsText(questions){
    for(let question of questions){
        let decoded = he.decode(question.question);
        //save encoded question
        question.encodedQuestion = question.question.slice();
        question.question = decoded;

        //decode the correct answer
        question.correct_answer = he.decode(question.correct_answer);
        //decode the incorrect answers
        for(let answer of question.incorrect_answers){
            let decoded = he.decode(answer);
            question.incorrect_answers[question.incorrect_answers.indexOf(answer)] = decoded;
        }
    }
    return questions
}

/** YOU ONLY NEED TO CALL THIS FUNCTION --DO NOT MODIFY IT 
 * A function to turn a string into questionID, stripping all punctuation
 * spaces, and the most common html encoded characters
 * @param {String} string - A string to turn into a camelCase questionID
 * @returns {String} - A camelCase questionID
 */
function generateQuestionID(string){
    let tmp = string;
    //remove encoded chars 
    tmp = tmp.replace(/(&#039;)|(&quot;)|(&ldquot;)(&rdquot;)/g, '');
    //remove all punctuation
    tmp = tmp.replace(/[.?,\/#!$%\^&\*;:{}=\-_`~()]/g, '');

    let questionID = tmp.replace(/(?:^\w|[A-Z]|\b\w)/g, 
        (word, index) =>
            index == 0 ? word.toLowerCase() : word.toUpperCase()
        ).replace(/\s+/g, '');
    return questionID;
}

/** DO NOT MODIFY THIS FUNCTION
 * A function to make the questionID input for a question
 * @param {Object} question - the question object
 * @returns {HTMLInputElement} - the hidden input element
 */
function makeQuestionIDInput(question){
    //make a hidden input that has the question as the value
    let hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'questionID');
    hiddenInput.setAttribute('value', question.questionID);
    return hiddenInput;
  }

/**  YOU ONLY NEED TO CALL THIS FUNCTION, DO NOT MODIFY IT
 * A helper function to create a form check input for a question
 * @param {Objects} question - the question object
 * @param {Boolean} isCorrect - whether the answer is correct
 * @param {String} answerValue - the value of the answer (aka the text of the answer)
 * @returns {HTMLDivElement} - the form-check div with the input and label
 */
function createFormCheckInput(question, isCorrect, answerValue){
    //create a div element with the class form-check
    let formCheck = document.createElement('div');
    formCheck.classList.add('form-check');

    //create an input element with the class form-check-input
    let input = document.createElement('input');
    input.classList.add('form-check-input');
    input.setAttribute('type', 'radio');
    input.setAttribute('name', question.questionID);
    let inputID = `${question.questionID}-${isCorrect ? 'correct' : `incorrect-${answerValue}`}`;
    input.setAttribute('id', `${inputID}`);
    input.setAttribute('value', answerValue);

    //create a label element with the class form-check-label
    let label = document.createElement('label');
    label.classList.add('form-check-label');
    label.setAttribute('for', `${inputID}`);
    label.textContent = answerValue;

    //append the input and label to the formCheck div
    formCheck.appendChild(input);
    formCheck.appendChild(label);

    return formCheck;
}

/************************** HELPER FUNCTIONS END ******************************/

/*********************** GAME FUNCTIONALITY START ***************************/

/**
 * A function to update the score and total questions displayed on the page
 */
function updateScoreDisplay(){
    //TODO: 
    //select the score span, the total questions span, and the questions answered span
    let scoreSpan = document.querySelector('#score');
    let totalQuestionsSpan = document.querySelector('#totalQuestions');
    let questionsAnsweredSpan = document.querySelector('#questionsAnswered');
    //update their text content with the 'score', 'totalQuestions', and 'questionsAnswered' variables
    scoreSpan.textContent = score;
    totalQuestionsSpan.textContent = totalQuestions;
    questionsAnsweredSpan.textContent = questionsAnswered;

    //Check if the questions answered is equal to the total questions
    //if they are equal, do an alert with the score
    if(questionsAnswered === totalQuestions){
        alert(`You scored ${score} out of ${totalQuestions}\nClick the restart button to play again!`);
    }

}

/**
 * A function to display the questions on the page
 * @param {Array} questions - an array of question objects
 */
function displayQuestions(questions){
    let questionsContainer = document.querySelector('#questionCards');
    //clear the questions container
    ////Step 3C : Uncomment to clear the questions container
    // clearContainer(questionsContainer);

    //create a card for a single question for testing
    let question = questions[0];
    let questionCard = createQuestionCard(question);
    //append the question card to the questionsContainer
    questionsContainer.appendChild(questionCard);

    //Step 3C 
    //loop through the questions and create a question card for each
    //append each card to the questionsContainer
    
}

function handleQuestionSubmit(event){
    event.preventDefault();
    console.log("Submit button clicked");

    //getting the form data --do not modify this
    const data = new FormData(event.target);
    let questionID = data.get('questionID');
    //get all input elements with name of question
    let answers = document.querySelectorAll(`input[name="${questionID}"]`);
    //answers is a NodeList, convert it to an array
    answers = Array.from(answers);

    let selectedAnswer = null;
    let correctAnswer = null;

    //Step 4A:
    //loop through the answers to find the selected answer and the correct answer

    //Step 4B:
    //update the score based on the selected answer and the correct answer
    //also add one to the questionsAnswered
    

    //update the score display
    updateScoreDisplay();

    //dissappear the question card of the card that was answered
    let questionCard = document.querySelector(`#${questionID}`);
    dissappearACard(questionCard);
}

/**
 * A function to create a question card. 
 * @param {Object} question - the question object
 * @returns {HTMLDivElement} - the question card element
 */
function createQuestionCard(question){

    //create a div element with the class card
    let questionCard = document.createElement('div');
    //add the class card to the questionCard
    questionCard.classList.add('card');

    //give the card a unique id using the encodedQuestion
    //important -- DO NOT MODIFY THIS
    question.questionID = generateQuestionID(question.encodedQuestion);
    questionCard.setAttribute('id', question.questionID);

    /*********** HEADER ************* */
    //Step 6
    //Step 3A: Create the header of the card
    console.log(question);
    //create a header (div element) with class card-header

    //create an title (h5 element) with the class card-title
    //the title should say the question


    //create a subtitle (p element) with the class card-subtitle
    //the subtitle should say the category of the question


    //append the cardTitle and subtitle to the cardHeader

    //append the cardHeader to the questionCard

    /*********** HEADER END ************* */

    /*********** FORM START ************* */
    let form = document.createElement('form');

    /*********** BODY START ************* */
    //create a card body with the class card-body
    let cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    //create a form element
    
    //create a div with class form-check for the correct answer
    //calling the function createFormCheckInput
    let correctAnswerFormCheck = createFormCheckInput(question, true, question.correct_answer);
    //append the correctAnswerFormCheck to the cardBody
    cardBody.appendChild(correctAnswerFormCheck);

    //Part 3B: 
    //for each incorrect answer, make an input with type radio and class form-check input, call the function createFormCheckInput
    

    //append the cardBody to the form
    form.appendChild(cardBody);

    /*********** BODY END ************* */

    //make a hidden input that has the question as the value
    //do not modify or remove
    let questionIDInput = makeQuestionIDInput(question);
    form.appendChild(questionIDInput);
  
    /*********** FOOTER START ************* */

    //create a card-footer with the class card-footer
    let cardFooter = document.createElement('div');
    cardFooter.classList.add('card-footer');
    //create a button with the class btn and btn-success    
    let submitBtn = document.createElement('button');
    submitBtn.setAttribute('type', 'submit');
    submitBtn.classList.add('btn', 'btn-success');
    submitBtn.textContent = 'Check Answer';

    //append the button to the cardFooter
    cardFooter.appendChild(submitBtn);

    //append the card footer to the form
    form.appendChild(cardFooter);
    /*********** FOOTER END ************* */

    //add an event listener to the button
    form.addEventListener('submit', (e) => handleQuestionSubmit(e));

    // append the cardHeader and the form to the questionCard
    //TODO:
    questionCard.appendChild(form);
    //add some margin to the card
    questionCard.classList.add('my-3');

    return questionCard;
}

/**
 * An async function that fetches questions from the API
 * @returns {Promise<JSON>} - the data from the API
 */
async function getQuestions(){
    console.log("Fetching questions from the API");
    const baseURL = 'https://opentdb.com/api.php?amount=1';
    
    //Step 1: get the user input (number of questions to get)
    //get the number of questions to fetch from the user input

    //update the totalQuestions variable

    //Step 2: get the user input (category)


    //build the full URL
    const fullURL = `${baseURL}`;
    console.log("Full URL: ", fullURL);
    //make the fetch request
    const response = await fetch(fullURL);
    if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
}


/**
 * A function to display the questions on the page
 * first fetching the questions from the API. 
 */
async function handleGetQuestionsBtn(){
    console.log("Get questions button clicked");
    //transition to the quiz phase
    transitionPhase(moveToQuiz=true);

    //fetch the questions data
    try {
        let questionsData = await getQuestions();
        console.log("Questions data: ", questionsData);
        //save the questions data to the triviaQuestions array
        triviaQuestions = questionsData.results;
    }
    catch(error){
        console.error("Error fetching questions data: ", error);
    }
    //fix the question text
    triviaQuestions = fixQuestionsText(triviaQuestions);

    //do something with the questions
    console.log("Questions: ", triviaQuestions);
    displayQuestions(triviaQuestions);

    //update scoreDisplay
    updateScoreDisplay();
}

/**
 * A function to handle the 'restarting' of the game
 */
function handleRestartBtn(){
    console.log("Restart button clicked");
    transitionPhase(moveToQuiz=false);
    //reset the triviaQuestions array
    triviaQuestions = [];
    //reset the score, total questions, and questions answered
    score = 0;
    totalQuestions = 0;
    questionsAnswered = 0;
}
/*********************** GAME FUNCTIONALITY END ***************************/


/********* Filtering Existing Questions  START **********/

/**
 * 
 * @param {String} difficulty - the difficulty to filter by
 * @returns {Array<Object>} - an array of questions that match the difficulty
 */
function filterByDifficulty(difficulty){
    let filteredQuestions = [];

    //Step 5: filter the triviaQuestions array by the difficulty
    //loop through the triviaQuestions array
    //if the question.difficulty is equal to the difficulty, push it to the filteredQuestions array

    //return an array of questions that match the difficulty
    return filteredQuestions;
}

/**
 * A function to handle the difficulty filter
 * @param {Event} event - the event object
 */
function handleDifficultyFilter(event){
    let difficultySelect = event.target;
    let difficulty = difficultySelect.value;
    console.log("Difficulty: ", difficulty);
    //filter the triviaQuestions array
    let filteredQuestions = filterByDifficulty(difficulty);
    console.log("Filtered questions: ", filteredQuestions);
    //display the filtered questions
    displayQuestions(filteredQuestions);
}


/********* Filtering Existing Questions  END **********/

/**
 * A function to run the program
 * add event listeners to the buttons
 * The main entry point of the program
 */
function runProgram() {

    //add an event listener to the getQUestions button
    let getQuestionsButton = document.querySelector('#getQuestions');
    getQuestionsButton.addEventListener('click', handleGetQuestionsBtn);

    //add an event listener to the restart button
    let restartButton = document.querySelector('#restartBtn');
    restartButton.addEventListener('click', handleRestartBtn);

    //add an event listener to the difficulty filter
    //Step 5:
    // let difficultyFilter = document.querySelector('#difficultyFilter');
    // difficultyFilter.addEventListener('change', (event) => handleDifficultyFilter(event));

    //Step 6: try to do it on your own
}

document.addEventListener('DOMContentLoaded', runProgram);