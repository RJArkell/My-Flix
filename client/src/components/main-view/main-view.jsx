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
      .then(response => {
        this.setState({
          movies: response.data
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


  render() {
    const { movies, user } = this.state;
    if (!movies) return <div className="main-view" />;
    return (
      <Router>
        <div className="main-view">
          <Navbar bg="dark" variant="dark" expand="md" sticky="top">
            <Navbar.Brand href="#home">Edge of Umbra</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="#home">Movies</Nav.Link>
                <Nav.Link href="#link">Directors</Nav.Link>
                <NavDropdown title="Genres" id="genre-dropdown">
                  <NavDropdown.Item href="#action/3.1">Science-Fiction</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">Horror</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">Thriller</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="#link">About</Nav.Link>
              </Nav>
              <Form inline>
                <FormControl type="text" placeholder="Titles, directors, etc" className="mr-sm-2" />
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
              }
              } />
              <Route path="/register" render={() => <RegistrationView />} />
              <Route path="/movies/:movieId" render={({ match }) =>
                <MovieView movie={movies.find(m => m._id === match.params.movieId)} />
              } />
            </Row>
          </Container>
        </div>
      </Router>
    );
  }
}