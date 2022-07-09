const User = require('../models/user')
const Subject = require('../models/subject')
const {
  createTokenFromPayload,
  comparePasswordHash,
  createHashFromPassword 
} = require("../helpers/hashPassword");

class Controller {

  static async allClass (req, res, next) {
    try {
      await Subject.find().then((subject) => {
        res.status(200).json(subject);
      })
      
    } catch (err) {
     next(err)
    }

  }

  static async addClass (req, res, next) {
    try {
      const { name } = req.body

      const {role} = req.user

      if (role === 'teacher') {
        await Subject.create({name: name}).then((subject) => {
          res.status(200).json(subject);
        }) 
      } else {
        throw { name: "Forbidden", statusCode: 403 };
      }

    } catch (err) {
     next(err)
    }
  }

  static async addUser (req, res, next) {
    try {
      const { name, email, password } = req.body
      let hash = createHashFromPassword(password);
      await User.create({name, email, role: 'student', password: hash}).then((subject) => {
        res.status(200).json(subject);
      }) 
    } catch (err) {
     next(err)
    }
  }

  static async loginStudent (req, res, next) {
    try {
      const { email, password } = req.body;

      await User.findOne({
          email,
          role: 'student'
      }).then((user) => {
        if (!user) {
          throw { name: "Invalid User", statusCode: 401 };
        }
        
        const userValidation = comparePasswordHash(password, user.password);

        if (!userValidation) {
          throw { name: "Invalid User", statusCode: 401 };
        }

        const payload = {
          id: user.id,
        };
  
        const accessToken = createTokenFromPayload(payload);
  
        res.status(200).json({
          statusCode: 200,
          access_token: accessToken,
          data: {
            email: user.email,
          },
        });
      });
    } catch (err) {
      next(err);
    }
  }

  static async loginTeacher (req, res, next) {
    try {
      const { email, password } = req.body;

      await User.findOne({
          email,
          role: 'teacher'
        }).then((user) => {
        if (!user) {
          throw { name: "Invalid User", statusCode: 401 };
        }
        const userValidation = comparePasswordHash(password, user.password);

        if (!userValidation) {
          throw { name: "Invalid User", statusCode: 401 };
        }

        const payload = {
          id: user._id,
        };
  
        const accessToken = createTokenFromPayload(payload);
  
        res.status(200).json({
          statusCode: 200,
          access_token: accessToken,
          data: {
            email: user.email,
          },
        });
      });
    } catch (err) {
      next(err);
    }
  }

  static async enrollClass (req, res, next) {
    try {

      const { name } = req.body;
      const { id, email, name : studentName, role} = req.user

      if (role === 'student') {
        let newSubject = {id, name: studentName, email}
        await Subject.findOneAndUpdate({name}, {$push: { student: newSubject}})
        await User.findOneAndUpdate({ _id: id }, {$push: {subject: name}})
        
        res.status(200).json({
          message: "Class added successfully"
        });
      } else {
        throw { name: "Forbidden", statusCode: 403 };
      }
    } catch (err) {
     next(err)
    }

  }

  static async classMember (req, res, next) {
    try {
      const { name } = req.body;

      await Subject.findOne({name}).then((subject) => {
        res.status(200).json(subject);
      })
  
    } catch (err) {
     next(err)
    }

  }
}

module.exports = Controller;