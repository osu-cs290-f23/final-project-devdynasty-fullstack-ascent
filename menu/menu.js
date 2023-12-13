function openNav(){
    document.getElementById("mySideNav").style.width = "100%";
}

function closeNav(){
    document.getElementById("mySideNav").style.width = "0";
}

function openSubmissionModal(){
    var popup = window.open("/submit-questions", "Submit your question!", "width=600, height=400");
}

document.querySelector('.nav-links a').addEventListener('click', openSubmissionModal);