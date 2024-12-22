const express = require('express');
const router = express.Router();
const Subscriber = require('../models/subscriber');

//get all
router.get('/', async(req, res) => {
  try {
    const subscribers = await Subscriber.find();
    res.json(subscribers);
  }catch(err){
    res.status(500).json({ message: err.message });
  }
});

//get one
router.get('/:id', getSubscriber, async(req, res) => {
  try {
    res.json(req.subscriber);
  }catch(err){
    res.status(500).json({ message: err.message });
  }
});

//create one
router.post('/', async(req, res) => {
  const subscriber = new Subscriber({
    name: req.body.name,
    subscribedToChannel: req.body.subscribedToChannel
  })
  try {
    const newSubscriber = await subscriber.save();
    res.status(201).json(newSubscriber);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
});

//update one
router.patch('/:id', getSubscriber, async(req, res) => {
  if (req.body.name != null) {
    req.subscriber.name = req.body.name;
  }
  if (req.body.subscribedToChannel != null) {
    req.subscriber.subscribedToChannel = req.body.subscribedToChannel;
  }
  try {
    const updatedSubscriber = await req.subscriber.save();
    res.json(updatedSubscriber);
  }catch(err){
    res.status(400).json({ message: err.message });
  }
});

//delete one
router.delete('/:id', getSubscriber, async (req, res) => {
  try {
    await req.subscriber.deleteOne();
    res.json({ message: 'Deleted subscriber' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//middleware
async function getSubscriber(req, res, next) {
  let subscriber;
  try {
    subscriber = await Subscriber.findById(req.params.id)
    if(subscriber == null){
      return res.status(404).json({ message: 'Cannot find subscriber' });
    }
  } catch(err){
      return res.status(500).json({ message: err.message });
    }
    req.subscriber = subscriber;
    next();
  }

module.exports = router;