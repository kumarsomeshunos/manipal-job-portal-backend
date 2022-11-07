import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import Admin from "../models/Admin.js";

const router = express.Router();

// dotenv
dotenv.config();

router.get("/login", (req, res) => {
  res.send("Login Get");
});


// Complete register function
router.post("/register", async (req, res) => {
  const { name, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await Admin.create({
      name,
      username,
      password: hashedPassword,
    });

    console.log(result);
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// Complete login function
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await Admin.findOne({ username });

    if (user) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (isPasswordCorrect) {
        const token = jwt.sign(
          { username: user.username, id: user._id },
          process.env.TOKEN_SECRET,
          { expiresIn: "1h" }
        );

        res.status(200).json({ result: user, token });
      } else {
        res.status(404).json({ message: "Invalid credentials" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).send();
  }
});

// router.post("/login", async (req, res) => {

//   const pass = 'admin';
//   // hash
//   const hashedPassword = await bcrypt.hash(pass, 10);
//   //compare
//   const result = await bcrypt.compare(pass, hashedPassword);
//   //return result
//   console.log("Comparing " + pass + " with " + hashedPassword);
//   console.log("result: " +result);



//   Admin.findOne({ username: req.body.username })
//     .then((user) => {
//       console.log("Comparing " + user.password + " with " + req.body.password);
//       bcrypt
//         .compare(req.body.password, user.password)
//         .then((passwordCheck) => {

//           if (!passwordCheck) {
//             console.log("Compare failed");
//             return response.status(400).send({
//               message: "Incorrect Login",
//               error,
//             });
//           }

//           //   create JWT token
//           const token = jwt.sign(
//             {
//               userId: user._id,
//               userEmail: user.username,
//             },
//             process.env.TOKEN_SECRET,
//             { expiresIn: "24h" }
//           );

//           //   return success response
//           restart.status(200).send({
//             message: "Login Successful",
//             email: user.email,
//             token,
//           });
//         })
//         // catch error if password does not match
//         .catch((error) => {
//           res.status(400).send({
//             message: "Passwords does not match",
//             error,
//           });
//         });
//     })
//     .catch((e) => {
//       res.status(404).send({
//         message: "Username not found",
//         e,
//       });
//     });


// });

// router.post("/register", async (req, res) => {

//   //   check if username already exists
//   Admin.findOne({ username: req.body.username })
//     .then((user) => {
//       if (user) {
//         return res.status(400).send({
//           message: "Username already exists",
//         });
//       }

//       // hash the password
//       console.log("Hashing: " + req.body.password);
//       bcrypt.hash(req.body.password, 10).then((hash) => {
//         console.log(hash);
//         const admin = new Admin({
//           name: req.body.name,
//           username: req.body.username,
//           password: hash,
//         });

//         // save the user
//         admin
//           .save()
//           .then((user) => {
//             res.status(201).send({
//               message: "User created successfully",
//               user,
//             });
//           })

//           // catch error if user is not saved
//           .catch((error) => {
//             res.status(400).send({
//               message: "User not created",
//               error,
//             });
//           });
//         })

//         // catch error if password is not hashed
//         .catch((error) => {
//           res.status(400).send({
//             message: "Password not hashed",
//             error,
//           });

//         });

//       });
          
// });

export default router;
