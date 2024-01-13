const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
app.use(express.json());
app.use(cors());

const dot = require("dotenv").config();

mongoose.connect(process.env.MONGO).then(() => {
  console.log("Connected to DB");
});

const users = mongoose.Schema({
  name: String,
  description: String,
  interests: Array,
});

const User = mongoose.model("User", users);

app.get("/", async (req, res) => {
  const all = await User.find({});
  if (all) {
    res.status(200).json(all);
  } else {
    res.status(500).json("Error");
  }
});

app.post("/add", async (req, res) => {
  const { name, description, interests } = req.body;
  try {
    const newUser = new User({
      name,
      description,
      interests,
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/delete/:id", async (req, res) => {
  const userId = req.params.id;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    const all = await User.find({});

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully", all });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.put("/update/:id", async (req, res) => {
  const { name, description, interests } = req.body;

  const id = req.params.id;

  try {
    const updateFields = {};

    if (name) {
      updateFields.name = name;
    }

    if (description) {
      updateFields.description = description;
    }

    if (interests && interests.length > 0) {
      updateFields.interests = interests;
    }

    // Update the user document
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateFields,
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server Started");
});
