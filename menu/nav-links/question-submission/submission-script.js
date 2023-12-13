var questionCounter = 1;

function submitQuestion(){
    var questionText = document.getElementById('question-text').value;
    var correctAnswer = document.getElementById('correct-answer').value;
    var wrongAnswers = document.getElementById('wrong-answers').value.split(',');

    /* 
    ** this is an error check again the user either not putting enough distractor questions or 
    ** if they put more than five potential distractor questiosn
    */
    if(wrongAnswers.length < 3 || wrongAnswers.length >= 5){
        alert("Please provide 3 to 5 incorrect answers for your question.");
        return;
}
}

questionCounter++;

var newQuestion = {
    "questionText": questionText,
    "correctAnswer": correctAnswer,
    "distractors": generateRandomOptions(correctAnswer, wrongAnswers)
};

console.log(newQuestion);

document.getElementById('submission-form').reset();

function goBack(){
    // two methods

    //method 1: assuming that the submission script will take the user to a separate page we could do
    /* window.history.back()*/
    // this method functionally acts like if the user hit the back button. super simple

    //method 2: redirect the user to the homepage to start the game
    /* window.location.href = "/[homepage]" */
}

//full disclosure, I used chatGPT to help me create this function
function generateRandomOptions(correctAnswer, wrongAnswers){
    // this shuffles the wrong answers that the user submitted so that it'll be slightly random each time
    var randomizeWrongAnswers = wrongAnswers.slice().sort(() => Math.random() - 0.5);
    // this picks three of the shuffled wrong answers to include on the interview page
    var pickedThree = randomizeWrongAnswers.slice(0,3);

    pickedThree.push(correctAnswer);

    return pickedThree.sort(() => Math.random() - 0.5);
}

// // Send the new question to the server
// fetch('http://localhost:3000/submitQuestion',{
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(newQuestion),
//   })
//   .then(response => response.json())
//   .then(data => {
//     console.log(data);
//     alert("Question submitted successfully!");
//   })
//   .catch((error) => {
//     console.error('Error:', error);
//     alert("Error submitting question. Please try again.");
//   });
  
