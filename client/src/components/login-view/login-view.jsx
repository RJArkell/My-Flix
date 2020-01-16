import React, { useState } from 'react';
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from 'react-bootstrap/Card';
import './login-view.scss'

export function LoginView(props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(username, password);
    props.onLoggedIn(username)
  };

  return (
    <Card style={{ width: '25%' }}>
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
          <Button variant="secondary" onClick={handleSubmit}>Register new account</Button>
        </Form>
      </Card.Body >
    </Card>
  );
}