import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState('');
  const [user, setUser] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();
    const { name, email, password, role } = e.target.elements;
    await axios.post('/api/register', {
      name: name.value,
      email: email.value,
      password: password.value,
      role: role.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;
    const response = await axios.post('/api/login', {
      email: email.value,
      password: password.value
    });
    setUser(response.data.user);
    setRole(response.data.user.role);
    setIsLoggedIn(true);
  };

  const handleComplaint = async (e) => {
    e.preventDefault();
    const { complaint } = e.target.elements;
    await axios.post('/api/complaint', {
      complaint: complaint.value,
      userId: user._id
    });
  };

  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    if (role === 'admin') {
      axios.get('/api/complaints').then(response => {
        setComplaints(response.data);
      });
    }
  }, [role]);

  if (!isLoggedIn) {
    return (
      <div>
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input name="name" type="text" placeholder="Name" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <select name="role">
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Register</button>
        </form>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  if (role === 'user') {
    return (
      <div>
        <h2>User Panel</h2>
        <form onSubmit={handleComplaint}>
          <textarea name="complaint" placeholder="Your complaint" required></textarea>
          <button type="submit">Submit Complaint</button>
        </form>
      </div>
    );
  }

  if (role === 'admin') {
    return (
      <div>
        <h2>Admin Panel</h2>
        {complaints.map((complaint, index) => (
          <div key={index}>
            <p>{complaint.complaint}</p>
            <p>Submitted by: {complaint.userId}</p>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default App;
