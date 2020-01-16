import React from 'react';
import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import './movie-view.scss'

export class MovieView extends React.Component {
  constructor() {
    super();

    this.state = {};
  }
  render() {
    const { movie, onClick } = this.props;
    if (!movie) return null;
    return (
      <div>
        <div className="movie-view">
          <Container fluid>
            <Row>
              <Col sm={4}>
                <Image className="movie-poster" src={movie.ImagePath} fluid />
              </Col>
              <Col sm={8}>
                <div className="movie-title">
                  <h1><span className="value">{movie.Title}</span></h1>
                </div>
                <div className="movie-genre">
                  <span className="label">Genre: </span>
                  <span className="value">{movie.Genre.Name}</span>
                </div>
                <div className="movie-director">
                  <span className="label">Director: </span>
                  <span className="value">{movie.Director.Name}</span>
                </div>
                <div className="movie-description">
                  <span className="label">Description: </span>
                  <span className="value">{movie.Description}</span>
                </div>
                <Button variant="primary" onClick={() => onClick()}>Return</Button>
              </Col>
            </Row>
          </Container>
        </div>
      </div >
    );
  }
}