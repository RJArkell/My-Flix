import React, { useState } from 'react';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import './login-view.scss'

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://edge-of-umbra.herokuapp.com/login', {
      Username: username,
      Password: password
    })
      .then(res => {
        const data = res.data;
        props.onLoggedIn(data);
      })
      .catch(e => {
        console.log('User does not exist')
      });
  };

  return (
    <Card style={{ width: '40%' }}>
      < Card.Body >
        <Card.Title><h1>Edge of Umbra</h1></Card.Title>
        <Card.Text>Welcome back, please enter your login information.</Card.Text>
        <Form>
          <Form.Group controlId="loginUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="loginPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="text"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="primary" type="submit" onClick={handleSubmit}>Submit</Button>
          <Link to={`/register`}>
            <Button variant="secondary">Register new account</Button>
          </Link>
        </Form>
      </Card.Body >
    </Card>
  );
}