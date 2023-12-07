const express = require("express");
const LibraryEntryExit = require("../mongoose");
const route = express.Router();
const bcrypt = require("bcrypt");

route.get("/", async (req, res) => {
  try {
    const data = await schema.find({});
    res.send(data);
  } catch (err) {
    throw err;
  }
});

route.post("/", async (req, res) => {
  try {
    const user = await LibraryEntryExit.findOne({ email: req.body.email }).sort({ loginTime: -1 });
    const utcTime = new Date();

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    if (!user) {
      // User not found, create a new entry
      const newEntry = new LibraryEntryExit({
        email: req.body.email,
        password: hashedPassword,
        history: [new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000)],
      });
      await newEntry.save();
      res.status(200).json({ message: "Entry recorded successfully" });
    } else {
      const lastHistoryEntry = user.history[user.history.length - 1];

      if (!lastHistoryEntry || lastHistoryEntry.logoutTime) {
        // User is checked in, record login time
        user.history.push({
          loginTime: new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000),
          logoutTime: null,
        });
        await user.save();
        res.status(200).json({ message: "Login recorded successfully" });
      } else {
        // User is checked out, record logout time
        lastHistoryEntry.logoutTime = new Date(utcTime.getTime() + 5.5 * 60 * 60 * 1000);
        await user.save();
        res.status(200).json({ message: "Logout recorded successfully" });
      }
    }
  } catch (err) {
    console.error("Error handling entry/exit:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = route;
