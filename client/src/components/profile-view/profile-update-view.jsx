import React, { useState } from "react";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import { Link } from "react-router-dom";
import "./profile-view.scss"

export function ProfileUpdateView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [birthday, setBirthday] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    console.log();
    axios.put(`https://edge-of-umbra.herokuapp.com/users/${localStorage.getItem("user")}`, {
      Username: username,
      Password: password,
      Birthday: birthday,
      Email: email,
    }, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        const data = res.data;
        console.log(data);
        alert("Profile updated, please login again");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.open("/client", "_self");
      })
      .catch(e => {
        console.log(username);
        alert("Error updating profile");
      });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    axios.delete(`https://edge-of-umbra.herokuapp.com/users/${localStorage.getItem('user')}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
      .then(res => {
        alert("Your account has been deleted");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.open("/", "_self");
      })
      .catch(e => {
        alert("Error deleting the account");
      });
  }

  return (
    <div className="profile-update-view">
      <Card style={{ backgroundColor: 'lightgrey' }}>
        <Card.Body>
          <Card.Text>Please update all fields of your profile</Card.Text>
          <Form>
            <Form.Group controlId="regUsername">
              <Form.Label>Username - Must be at least 5 characters long</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="regPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="regEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="example@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="regBirthday">
              <Form.Label>Birthday</Form.Label>
              <Form.Control
                type="date"
                value={birthday}
                onChange={(e) => setBirthday(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleUpdate}>Update</Button>
            <Link to={`/profile`}>
              <Button variant="secondary">Return to profile</Button>
            </Link>
            <Button variant="danger" type="submit" onClick={handleDelete}>Delete account</Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}