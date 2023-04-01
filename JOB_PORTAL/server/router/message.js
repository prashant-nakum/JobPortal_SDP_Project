const express = require("express");
const router = express.Router();
const Applicant = require("../model/applicantSchema");
const Company = require("../model/companySchema");
const Message = require("../model/messageSchema");
const authenticate = require("../middleware/authenticate");

router.get("/getMessages", async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
  }
});

router.post("/sendMessage", authenticate, async (req, res) => {
  console.log(req.body.name);
  const { name, email, message } = req.body;
  try {
    if (!name || !email || !message) {
      return res.status(422).json({ error: "Plz fill all the fields" });
    }
    const companyExist = await Company.findOne({ email: email });
    const applicantExist = await Applicant.findOne({ email: email });
    //check if user exist or not
    if (!applicantExist && !companyExist) {
      return res.status(422).json({ error: "Email not Exist" });
    }

    const newmessage = new Message({
      name,
      email,
      message,
    });

    const addMessage = await newmessage.save();
    if (addMessage) {
      res.status(201).json({ message: "Message sended successfully" });
    } else {
      res.status(500).json({ error: "Failed to send Message" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.delete("/message/:id", async (req, res) => {
  try {
    let result = await Message.deleteOne({ _id: req.params.id });
    if (!result) {
      return res.status(400).json({ error: "Message not deleted" });
    }
    return res.status(200).json(result);
  } catch (err) {
    console.log(err);
  }
});

router.put("/markMessage/:id", async (req, res) => {
  let result = await Message.updateOne(
    { _id: req.params.id },
    {
      $set: req.body,
    }
  );
  if (result) {
    res.status(200).send(result);
  } else {
    res.status(400).send({ result: "no record found" });
  }
});

module.exports = router;
