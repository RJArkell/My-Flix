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
      favoriteMovies: []
    };
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }

  getUser(token) {
    let username = localStorage.getItem('user');
    axios.get(`https://edge-of-umbra.herokuapp.com/users/${username}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        this.setState({
          username: res.data.Username,
          email: res.data.Email,
          birthday: res.data.Birthday,
          favoriteMovies: res.data.FavoriteMovies
        });
      })
      .catch(function (err) {
        console.log(err);
      });
  }

  deleteMovie(event, favoriteMovie) {
    event.preventDefault();
    let username = localStorage.getItem('user');
    axios.delete(`https://edge-of-umbra.herokuapp.com/users/${username}/favoritemovies/${favoriteMovie}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        document.location.reload(true);
      })
      .then(res => {
        alert('Movie successfully deleted from favorites');
      })

      .catch(e => {
        alert('Movie could not be deleted from favorites ' + e)
      });
  }

  render() {
    const { birthday, email, username, favoriteMovies } = this.state;
    return (
      <div className="profile-view">
        <Card>
          <Card.Body>
            <Card.Title><h1>{username}</h1></Card.Title>
            <div className="user-born">
              <span className="label">Born: </span>
              <span className="value">{birthday && birthday.slice(0, 10)}</span>
            </div>
            <div className="user-email">
              <span className="label">Email: </span>
              <span className="value">{email}</span>
            </div>
            <Link to={`/`}>
              <Button variant="primary">Return</Button>
            </Link>
            <Link to={'/profile/update'}>
              <Button variant='secondary'>Update profile</Button>
            </Link>
          </Card.Body >
        </Card>
        <div className='favoritemovies'></div>
        <div className='label'>Favorite Movies</div>
        {favoriteMovies.length === 0 &&
          <div className="value">No movies favorited</div>
        }
        {favoriteMovies.length > 0 &&
          <div className="value">{favoriteMovies.map(favoriteMovie => (<p key={favoriteMovie}>
            {JSON.parse(localStorage.getItem('movies')).find(movie => movie._id === favoriteMovie)._id}<span onClick={(event) =>
              this.deleteMovie(event, favoriteMovie)}> Delete</span></p>))}</div>
        }
      </div>
    );
  }
}