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
import './main-view.scss'



//import { RegistrationView } from "../registration-view/registration-view";
import { LoginView } from '../login-view/login-view';
import { MovieCard } from '../movie-card/movie-card';
import { MovieView } from '../movie-view/movie-view';

export class MainView extends React.Component {
  constructor() {
    super();
    this.state = {
      movies: null,
      selectedMovie: null,
      user: null
    };
  }

  componentDidMount() {
    axios.get('https://edge-of-umbra.herokuapp.com/movies')
      .then(response => {
        this.setState({
          movies: response.data
        });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  onMovieClick(movie) {
    this.setState({
      selectedMovie: movie
    });
  }

  onLoggedIn(user) {
    this.setState({
      user
    });
  }

  render() {
    const { movies, selectedMovie, user } = this.state;
    if (!user) return <LoginView onLoggedIn={user => this.onLoggedIn(user)} />;
    if (!movies) return <div className="main-view" />;
    return (
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
              <Nav.Link href="#link">Login</Nav.Link>
            </Nav>
            <Form inline>
              <FormControl type="text" placeholder="Titles, directors, etc" className="mr-sm-2" />
              <Button variant="outline-light">Search</Button>
            </Form>
          </Navbar.Collapse>
        </Navbar>
        <Container>
          <Row>
            {selectedMovie
              ? <MovieView movie={selectedMovie} onClick={() => this.onButtonClick()} />
              : movies.map(movie => (
                <Col key={movie._id} xs={12} sm={6} md={4} lg={3}>
                  <MovieCard key={movie._id} movie={movie} onClick={movie => this.onMovieClick(movie)} />
                </Col>
              ))
            }
          </Row>
        </Container>
      </div>
    );
  }
}