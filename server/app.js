if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require('express')
const cors = require("cors");
const { authentication } = require("./middlewares/authentication");
const { errorHandler } = require("./middlewares/error-handler");

require('./config/mongoConnection')

const app = express()
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json());
const Controller = require('./controllers/controller')
const port = process.env.PORT || 3000

app.post('/register', Controller.addUser)
app.post('/loginStudent', Controller.loginStudent )
app.post('/loginTeacher', Controller.loginTeacher )

app.use(authentication);

app.get('/classes', Controller.allClass)
app.post('/classes', Controller.addClass)
app.get('/members', Controller.classMember)
app.put('/classes', Controller.enrollClass )

app.use(errorHandler);

app.listen(port, () => {
  console.log(`listening at port : ${port}`);
})