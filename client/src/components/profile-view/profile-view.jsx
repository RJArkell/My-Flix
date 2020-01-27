import React from 'react';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import './profile-view.scss'

export class ProfileView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }

  componentDidMount() {
    const accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.getUser(accessToken);
    }
  }

  getUser(token) {
    let user = localStorage.getItem('user');
    axios.get(`https://edge-of-umbra.herokuapp.com/users/${user}`, {
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

  deleteFavoriteMovie(movieId) {
    let user = localStorage.getItem('user');
    console.log(this.props.movies);
    axios.delete(`https://edge-of-umbra.herokuapp.com/users/${user}/favoriteMovies/${movieId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        alert('removed movie from favorites');
      })
      .catch(e => {
        alert('error removing movie' + e);
      });
    window.open("/profile", "_self");
  }

  render() {
    const { birthday, username, email, favoriteMovies } = this.state;
    return (
      <div className="profile-view">
        <Row>
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
          <Card>
            <Card.Body>
              <Card.Title><h1>Favorited Movies</h1></Card.Title>
              {this.props.movies.map(movie => {
                if (movie._id === favoriteMovies.find(favoriteMovie => favoriteMovie === movie._id)) {
                  return <p key={movie._id}>{movie.Title}
                    <Link to={`/movies/${movie._id}`}>
                      <Button variant="info" size='sm'>Details</Button>
                    </Link>
                    <Button variant='danger' size='sm' onClick={() => this.deleteFavoriteMovie(movie._id)}>Remove</Button></p>
                } else if (!favoriteMovies) {
                  return <p>No movies favorited</p>
                }
              })}
            </Card.Body>
          </Card>
        </Row>
      </div >
    );
  }
}