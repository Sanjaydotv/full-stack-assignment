const express = require('express')
const app = express()
const port = 3001
const bodyParser = require('body-parser')
const jwt = require("jsonwebtoken");


const USERS = [];

const QUESTIONS = [{
    title: "Two states",
    description: "Given an array , return the maximum of the array?",
    testCases: [{
        input: "[1,2,3,4,5]",
        output: "5"
    }]
}];


const SUBMISSION = [

]

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.post('/signup', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email , password } = req.body;

  //Store email and password (as is for now) in the USERS array above (only if the user with the given email doesnt exist)
  const USEREXISTS = USERS.find( USERS => USERS.email === email);
  if(USEREXISTS){
    res.status(400).json({error: "user already exists"});
  }

  USERS.push({email,password});

  // return back 200 status code to the client
  res.status(200).send("User Registered Successfully");
})

app.post('/login', function(req, res) {
  // Add logic to decode body
  // body should have email and password
  const {email , password } = req.body;

  // Check if the user with the given email exists in the USERS array
  const user = USERS.find(user => user.email === email);
  // Also ensure that the password is the same
  if(user && user.password === password){
    const token = jwt.sign({ email :user.email},'secret-key');
    res.status(200).json({token});
    // If the password is the same, return back 200 status code to the client
    // Also send back a token (any random string will do for now)
  }
  // If the password is not the same, return back 401 status code to the client
  else {
    res.status(401).json({error:"Invlaid credentials"});
  }
})

app.get('/questions', function(req, res) {

  //return the user all the questions in the QUESTIONS array
  res.send(QUESTIONS);
})

app.get("/submissions", function(req, res) {
   req.send(SUBMISSION);
  
});


app.post("/submissions", function(req, res) {

  const {email , question , answer} = req.body;

  const user = USER.find(user => user.email === email);
  if(!user)
  {
    res.status(401).json({error: "user not found"});
  }

  const submission = {
    email,
    question,
    answer,
    timestamp: new Date(),toISOString()
  };

   // let the user submit a problem, randomly accept or reject the solution
    const isAccepted = Math.random >= 0.5;
    submission.status = isAccepted? "Accepted" : "Rejected";
   // Store the submission in the SUBMISSION array above
    SUBMISSION.push(submission);

    res.status(200).json({message: "Answer submitted successfully"});
});

// leaving as hard todos
// Create a route that lets an admin add a new problem
// ensure that only admins can do that.
const isAdmin = (req,res,next) => {
  const token = req.headers.authorization;

  if(token){
    try{
      const decoded = jwt.verify(token,'secret-key');
      if(decoded.isAdmin){
        next();
      }
      else {
        res.status(403).json({error: "unauthozided access"});
      }

    } catch(err) {
      res.status(403).json({error:"unauthorized access"})
    }

  } else {
    res.status(403).json({error:"unauthorized access"})
  }
};

app.post('/problems', isAdmin , (req,res) => {
  const { title , description , testCases } = req.body;

  const problem = {
    title , 
    description ,
    testCases
  };

  QUESTIONS.push(problem);

  res.status(200).json({message : "problem added successfully"});
} )

app.listen(port, function() {
  console.log(`Example app listening on port ${port}`)
})