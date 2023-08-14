let express=require('express')
let route=express.Router();
let user_auth=require('../../middleware/userauth')



route.post('/sell', user_auth, async (req, res) => {
    try {
      const existingSpot = await Parkspots.findOne({ owned_id: req.body.user_id });
      if (existingSpot) {
        return res.send({ msg: 'You are already selling a parking spot' });
      }
  
      const newSpot = new Parkspots({
        owned_id: req.body.user_id,
        latitude: req.body.latitude,
        longitude: req.body.longitude,
        address:req.body.address,
        bookedby: "null",
        bookedtime: Date.now(),
        status: 0
      });
  
      await newSpot.save();
      res.send({ msg: 'Saved parking spot' });
    } catch (error) {
      res.status(500).send({ error: "Server error" });
    }
  });
  
  
  route.post('/book', user_auth, async (req, res) => {
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
    
          res.send({ msg: "Parking spot booked" });
        } else {
          res.status(400).send({ message: "This spot is already booked by someone" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Server error" });
      }
    });
    
    route.post('/cancel', user_auth, async (req, res) => {
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
    
    route.post('/near', user_auth, async (req, res) => {
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