import React from 'react';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import './profile-view.scss'

export class ProfileView extends React.Component {
  constructor() {
    super();
    this.state = {
      username: null,
      email: null,
      birthday: null,
      favouriteMovies: []
    };
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    this.getUser(accessToken);
  }

  getUser(token) {
    const username = localStorage.getItem('user');
    axios.get(`https://edge-of-umbra.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        this.setState({
          username: res.data.Username,
          email: res.data.Email,
          birthday: res.data.Birthday,
          favouriteMovies: res.data.FavouriteMovies
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="profile-view">
        <Card>
          <Card.Body>
            <Card.Title><h1>{this.state.username}</h1></Card.Title>
            <div className="user-born">
              <span className="label">Born: </span>
              <span className="value">{this.state.birthday}</span>
            </div>
            <div className="user-email">
              <span className="label">Email: </span>
              <span className="value">{this.state.email}</span>
            </div>
            <div className="user-favorites">
              <span className="label">Favorite Movies: </span>
              <span className="value">{this.state.favouriteMovies}</span>
            </div>
            <Link to={`/`}>
              <Button variant="primary">Return</Button>
            </Link>
            <Link to={'/profile/update'}>
              <Button variant='secondary'>Update profile</Button>
            </Link>
          </Card.Body >
        </Card>
      </div>
    );
  }
}