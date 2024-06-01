const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/complaintsDB', { useNewUrlParser: true, useUnifiedTopology: true });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

const complaintSchema = new mongoose.Schema({
  complaint: String,
  userId: mongoose.Schema.Types.ObjectId
});

const User = mongoose.model('User', userSchema);
const Complaint = mongoose.model('Complaint', complaintSchema);

app.post('/api/register', async (req, res) => {
  const { name, email, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ name, email, password: hashedPassword, role });
  await newUser.save();
  res.sendStatus(201);
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, role: user.role }, 'secretKey');
    res.json({ token, user });
  } else {
    res.sendStatus(401);
  }
});

app.post('/api/complaint', async (req, res) => {
  const { complaint, userId } = req.body;
  const newComplaint = new Complaint({ complaint, userId });
  await newComplaint.save();
  res.sendStatus(201);
});

app.get('/api/complaints', async (req, res) => {
  const complaints = await Complaint.find();
  res.json(complaints);
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
