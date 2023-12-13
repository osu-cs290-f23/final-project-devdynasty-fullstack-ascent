console.log("hello")

var buttons = document.getElementsByClassName("choice-buttons")

for (var i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", function (event) {
        var clickedB = event.target
        console.log(clickedB);
        var answerText = clickedB.textContent
        console.log(answerText)
        var questionText = document.getElementById("narrative-text").textContent
        console.log(questionText)
        checkAnswer(questionText, answerText);
    });
}

function checkAnswer(question, answer) {
    // update the json file and send to server
    fetch('/check-answer', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify( {
            question: question,
            answer: answer
        }),
    }).then(function (res) {
        if (res.status === 200) {
            window.location.href("/" + res.body + ".html");
        }
        else {

        alert("An internal error occurred...");
        }
    })

    /*
    .then(response => response.json())
    .then(data => {
        console.log(data);
        alert("Question submitted successfully!");
    })
    .catch((error) => {
        console.error('Error:', error);
        alert("Error submitting question. Please try again.");
    });
    */


 }
