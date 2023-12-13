// Track the number of skills dragged into each box
let skillsCount = 0;
let skills2Count = 0;
let skills3Count = 0;

// Arrays for good and bad skills
const goodSkills1 = ["node.js", "python", "javascript", "html & css", "REACT", "SQL", "Database design", "Express.js", "AWS", "Docker"];
const badSkills1 = ["Microsoft Excel", "Graphic Design", "Data Entry","Apache", "MASM", "C#", "Customer Service", "MATLAB"];


const goodSkills2 = ["Software Engineering Intern at ABC Innovations", "IT Project Manager at Global Solutions", "Front-End Developer Intern at TechCraft Studios", "Teaching Assistant at Mary Coding Camp", "Quality Assurance Part-Time Intern at Intel", "Google Cybersecurity Certification"];
const badSkills2 = ["Data Entry Summer Job at FedEx", "Volunteer for E-commerce Overhaul", "Barista at Starbucks"];


const goodSkills3 = ["Secure Blogging Platform with Multi-Factor Authentication with Firebase", "Portfolio Website using React", "Social Media Metrics Dashboard","Metadata Search Application using Spotify and Genius API" ];
const badSkills3 = ["Customer Service Spreadsheet", "To Do List App", "Entrepreneurial Mindset Vlog Channel on Youtube"];


// Point system
const pointSystem = {
    goodSkill: 1, // Points for each good skill
    badSkill: 0, // Points for each bad skill
    //okaySkill: 0.5, // Points for each okay skill
};



function allowDrop(event) {
    event.preventDefault();
}

function drag(event, data) {
    event.dataTransfer.setData("text", data);
}

function drop(event, targetId) {
    event.preventDefault();
    var data = event.dataTransfer.getData("text");

    // Check the targetId to determine the destination box
    if (targetId === "otherSkillsList" && skillsCount < 9) {
        addToBox(data, targetId);
        skillsCount++;
    } else if (targetId === "workExperienceList" && skills2Count < 6) {
        addToBox(data, targetId);
        skills2Count++;
    } else if (targetId === "projectsList" && skills3Count < 5) {
        addToBox(data, targetId);
        skills3Count++;
    }
}

function addToBox(data, targetId) {
    var newElement = document.createElement("li");
    newElement.innerText = data;

    // Add a "Remove" button to the new element
    var removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "remove-btn";
    removeButton.onclick = function () {
        newElement.remove();

        // Update the count when a skill is removed
        if (targetId === "otherSkillsList") {
            skillsCount--;
        } else if (targetId === "workExperienceList") {
            skills2Count--;
        } else if (targetId === "projectsList") {
            skills3Count--;
        }
    };
    newElement.appendChild(removeButton);

    document.getElementById(targetId).appendChild(newElement);
}


function calculatePoints(goodSkills, badSkills, userSkills) {
    let overallPoints = 0;

    userSkills.forEach(skill => {
        const lowercaseSkill = skill.toLowerCase();
        if (goodSkills.map(s => s.toLowerCase()).includes(lowercaseSkill)) {
            overallPoints += pointSystem.goodSkill;
        } else if (badSkills.map(s => s.toLowerCase()).includes(lowercaseSkill)) {
            // No points deducted for bad skills

        } else {
            console.log(`Unknown skill: ${skill}`);
        }
    });

    return overallPoints;
}

function redirectToNextPage(hasInterviewOffer) {
    sessionStorage.setItem("interviewResult", hasInterviewOffer ? "Congratulations! You got an interview offer!" : "Sorry, you did not qualify for an interview offer.");
    window.location.href = "nextpage.html";
}

function checkInterviewOffer() {
    const workExperienceSkills = getSkillsFromList("workExperienceList");
    const otherSkills = getSkillsFromList("otherSkillsList");
    const projectsSkills = getSkillsFromList("projectsList");

    const overallPoints1 = calculatePoints(goodSkills1, badSkills1,  otherSkills);
    const overallPoints2 = calculatePoints(goodSkills2, badSkills2,  workExperienceSkills);
    const overallPoints3 = calculatePoints(goodSkills3, badSkills3,  projectsSkills);

    const hasInterviewOffer = overallPoints1 >= 3 && overallPoints2 >= 3 && overallPoints3 >= 3;

    redirectToNextPage(hasInterviewOffer);
}


function getSkillsFromList(listId) {
    const skillsList = document.getElementById(listId).getElementsByTagName("li");
    const skillsArray = Array.from(skillsList).map(skill => skill.innerText.replace("Remove", "").trim());
    console.log(`Skills in ${listId}: ${skillsArray.join(", ")}`);
    return skillsArray;
}


function initializeApplyButton() {
    const applyButton = document.getElementById("applyButton");
    applyButton.addEventListener("click", checkInterviewOffer);
}

window.onload = function () {
    initializeApplyButton();
};
