function openNav(){
    document.getElementById("mySideNav").style.width = "100%";
}

function closeNav(){
    document.getElementById("mySideNav").style.width = "0";
}

function openSubmissionModal(){
    var popup = window.open("/menu/nav-links/question-submission/submit-questions.html", "Submit your question!", "width=600, height=400");
}

document.querySelector('.nav-links a').addEventListener('click', openSubmissionModal);