const express = require('express');
const route = express.Router();
const users = require('../../data/user/User');
const jwt = require('jsonwebtoken');
const Parkspots = require('../../data/parkspots/Parkspots');
const history = require('../../data/log/history.js');

function costofpark(date1, date2) {
  const diffInMilliseconds = Math.abs(date2 - date1);
  const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
  return diffInMinutes;
}

let authenticate = (req, res, next) => {
  if (req.cookies.auth_token) {
    jwt.verify(req.cookies.auth_token, process.env.JWT_SECRET_KEY, (err, doc) => {
      if (!err) {
        req.body.user_id = doc.user_id;
        next();
      } else {
        res.status(401).json({ message: "Login required token is invalid" });
      }
    });
  } else {
    res.status(500).send({ message: "Login required" });
  }
};

route.post('/new', async (req, res) => {
  try {
    const existingUser = await users.findOne({ username: req.body.username });
    if (existingUser) {
      return res.send({ message: "User already exists" });
    }

    const newUser = new users({
      name: req.body.name,
      username: req.body.username,
      password: req.body.password,
      email: req.body.email
    });

    const token = jwt.sign({ username_user: req.body.username }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    await newUser.save();
    res.cookie("auth_token", token);
    console.log(newUser.id);
    res.send({ auth_token: token, user_id: newUser.id });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

route.post('/login', async (req, res) => {
  try {
    const user = await users.findOne({ username: req.body.username, password: req.body.password });
    if (!user) {
      return res.status(400).send({ message: "User doesn't exist" });
    }

    const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.cookie("auth_token", token);
    res.send({ auth_token: token, user_id: user.id });
    console.log(user.id);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});

route.post('/sell', authenticate, async (req, res) => {
  try {
    const existingSpot = await Parkspots.findOne({ owned_id: req.body.user_id });
    if (existingSpot) {
      return res.send({ message: 'You are already selling a parking spot' });
    }

    const newSpot = new Parkspots({
      owned_id: req.body.user_id,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      bookedby: "null",
      bookedtime: Date.now(),
      status: 0
    });

    await newSpot.save();
    res.send({ message: 'Saved parking spot' });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Server error" });
  }
});


route.post('/book', authenticate, async (req, res) => {
    try {
      const existingBooking = await Parkspots.findOne({ bookedby: req.body.user_id });
      if (existingBooking) {
        return res.send({ message: "You already have a booking" });
      }
  
      const ownedSpot = await Parkspots.findOne({ owned_id: req.body.owned_id });
      if (!ownedSpot) {
        return res.status(400).send({ message: "Invalid owner_id" });
      }
  
      if (ownedSpot.status === false) {
        await Parkspots.updateOne(
          { owned_id: req.body.owned_id },
          {
            $set: {
              status: 1,
              bookedby: req.body.user_id,
              bookedtime: Date.now()
            }
          }
        );
  
        res.send({ message: "Parking spot booked" });
      } else {
        res.status(400).send({ message: "This spot is already booked by someone" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  });
  
  route.post('/cancel', authenticate, async (req, res) => {
    try {
      const data = await Parkspots.findOne({ bookedby: req.body.user_id });
      if (!data) {
        return res.status(400).send({ message: "You haven't booked any parking space" });
      }
  
      const timeofbooking = data.bookedtime;
      await Parkspots.updateOne(
        { bookedby: req.body.user_id },
        { $set: { status: 0, bookedby: "", bookedtime: Date.now() } }
      );
  
      const cost = process.env.cost * costofpark(Date.now(), timeofbooking);
      const log = new history({
        booked_by: req.body.user_id,
        owner_id: data.owned_id,
        cost: cost
      });
  
      await log.save();
      res.send({ message: "Cancelled the parking spot" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  });
  
  route.post('/near', authenticate, async (req, res) => {
    try {
      const docs = await Parkspots.find({
        $or: [{ status: 0 }, { bookedby: req.body.user_id }],
        owned_id: { $ne: req.body.user_id },
        latitude: { $gt: req.body.latitude - req.body.radius, $lt: req.body.latitude + req.body.radius },
        longitude: { $gt: req.body.longitude - req.body.radius, $lt: req.body.longitude + req.body.radius }
      });
  
      if (docs.length === 0) {
        return res.status(400).json({ message: "No parking spots found near you" });
      }
  
      res.send(docs);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: "Server error" });
    }
  });
  
module.exports=route;