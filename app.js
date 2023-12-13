const express = require("express");
const exphbs = require('express-handlebars')

const path = require('path');
const app = express();

app.engine("handlebars", exphbs.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars")

var data = require("./data.json")

var srcDir = path.join(__dirname, 'public/src/');
app.use("/src", express.static(srcDir));

/*
  -> IMPORTANT
  -> it is a security risk to serve node_modules via express. You should use a bundler like webpack or browserify
*/
var nodeModulesDir = path.join(__dirname, 'node_modules/');
app.use('/node_modules', express.static(nodeModulesDir));


app.get('/job-apps', function (req, res, next) {
  res.status(200).render("jobApps", {
    css: "/job-apps.css",
    title: "Job Roles",
    music: "/audio_files/Wanted(chosic.com).mp3"
  })
})

app.get('/resume', function (req, res, next) {
  res.status(200).render("resume", {
    css: "/resume.css",
    title: "Create a Resume",
    music: "/audio_files/Wanted(chosic.com).mp3"
  })
})

app.get('/interview', function (req, res, next) {
  var totalNum = data.total
  console.log(totalNum)
  var index = Math.floor(Math.random() * totalNum)
  console.log(index)
  var qData = data.questions[index]  // get one rand q
  console.log(qData);
  var qs = [qData.correct].concat(qData.incorrect)
  console.log(qs)
  var qs_shuffled = qs.sort(() => Math.random() - 0.5);  // https://stackoverflow.com/q/2450954 comment from SaboSuke
  console.log(qs)
  res.status(200).render("interview", {
    css: "/interview.css",
    title: "Interview",
    music: "/audio_files/robo-boss-encounter-theme-instrumental-176873.mp3",
    question: data.questions[index].question,
    c1: qs_shuffled[0],
    c2: qs_shuffled[1],
    c3: qs_shuffled[2],
    c4: qs_shuffled[3]
  })
})


app.get('/resume-results', function (req, res, next) {
  res.sendFile(__dirname + "/public/resume/resume-results.html");
})

app.get('/submit-questions', function (req, res, next) {
  res.sendFile(__dirname + "/public/submit-questions/submit-questions.html");
})

var jobAppsDir = path.join(__dirname, "public/job-apps/")
app.use("/", express.static(jobAppsDir));


var interviewDir = path.join(__dirname, "public/interview/")
app.use("/", express.static(interviewDir));

var resumeDir = path.join(__dirname, "public/resume/")
app.use("/", express.static(resumeDir));

var submitDir = path.join(__dirname, "public/submit-questions/")
app.use("/", express.static(submitDir));

var menuDir = path.join(__dirname, "menu/")
app.use("/", express.static(menuDir));

app.use("/", express.static("/"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});


app.post('/submit-questions', function (req, res, next) {
  console.log(req.body)
  var totalNum = data.total
  if (req.body && req.body.question && req.body.correct && req.body.incorrect) {
    data[total+1].push({
      question: req.body.question,
      correct: req.body.correct,
      incorrect: req.body.incorrect
    })
    fs.writeFile(
      "./data.json",
      JSON.stringify(data, null, 2),
      function (err) {
        if (err) {
          res.status(500).send("Error writing question to DB")
        } else {
          res.status(200).send("Question successfully added to DB")
        }
      }
    )
  }
  else {
    res.status(400).send(
      "Requests need a JSON body with 'question', 'correct', and 'incorrect'"
    )
  }
})

app.post('/check-answer', function(req, res, next) {
  console.log(req.body)
  if (req.body && req.body.question && req.body.answer) {
    var qIndex = data.questions.findIndex(req.body.question)
    if (index === -1) {
      res.status(500).send(
        "Unable to find matching question"
      )
    }
    if (data.questions[qIndex].correct === req.body.answer) {
      res.status(200).send(
        "thankyou"
      )
    }
    else {
      res.status(200).send(
        "end"
      )
    }
  }
  else {
    res.status(400).send(
      "Requests need a JSON body with 'question' and 'answer'"
    )
  }
})


app.listen(8000, function (err) {
  if (err) {
    throw err
  }
  console.log("Server is running on localhost:8000");
});
