import React from 'react';
import axios from 'axios';
import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import { BrowserRouter as Router, Route } from "react-router-dom";
import './main-view.scss'

import { RegistrationView } from "../registration-view/registration-view";
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';
import { GenreView } from '../genre-view/genre-view';
import { ProfileView } from '../profile-view/profile-view';
import { ProfileUpdateView } from '../profile-view/profile-update-view';
import { DirectorView } from '../director-view/director-view';

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: [],
      user: null
    };
  }

  getMovies(token) {
    axios.get('https://edge-of-umbra.herokuapp.com/movies', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        this.setState({
          movies: res.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    let accessToken = localStorage.getItem('token');
    if (accessToken !== null) {
      this.setState({
        user: localStorage.getItem('user')
      });
      this.getMovies(accessToken);
    }
  }

  onLoggedIn(authData) {
    console.log(authData);
    this.setState({
      user: authData.user.Username
    });
    localStorage.setItem('token', authData.token);
    localStorage.setItem('user', authData.user.Username);
    this.getMovies(authData.token);
  }

  onLoggedOut() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.open('/', '_self');
    this.setState({
      user: null
    });
  }

  render() {
    const { movies, user } = this.state;
    if (!movies) return <div className="main-view" />;
    return (
      <Router>
        <div className="main-view">
          <Navbar bg="dark" variant="dark" expand="md" sticky="top">
            <Navbar.Brand href="/">Edge of Umbra</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Movies</Nav.Link>
                <NavDropdown title={user} id="basic-nav-dropdown">
                  <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                  <NavDropdown.Item onClick={() => this.onLoggedOut()}>Logout</NavDropdown.Item>
                </NavDropdown>
              </Nav>
              <Form inline>
                <FormControl type="text" placeholder="Search" className="mr-sm-2" />
                <Button variant="outline-light">Search</Button>
              </Form>
            </Navbar.Collapse>
          </Navbar>
          <Container>
            <Row>
              <Route exact path="/" render={() => {
                if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
                return movies.map(m =>
                  <Col key={m._id} xs={12} sm={6} md={4} lg={3}>
                    <MovieCard key={m._id} movie={m} />
                  </Col>
                )
              }} />
              <Route exact path="/register" render={() => <RegistrationView />} />
              <Route exact path="/login" render={() => <LoginView />} />
              <Route path="/movies/:movieId" render={({ match }) =>
                <MovieView movie={movies.find(m => m._id === match.params.movieId)} />
              } />
              <Route path="/genres/:name" render={({ match }) => {
                if (!movies || !movies.length) return <div className="main-view" />;
                return <GenreView genre={movies.find(m => m.Genre.Name === match.params.name).Genre} />
              }} />
              <Route path="/directors/:name" render={({ match }) => {
                if (!movies) return <div className="main-view" />;
                return <DirectorView director={movies.find(m => m.Director.Name === match.params.name).Director} />
              }} />
              <Route exact path="/profile" render={() => <ProfileView />} />
              <Route exact path="/profile/update" render={() => <ProfileUpdateView />} />
            </Row>
          </Container>
        </div>
      </Router>
    );
  }
}