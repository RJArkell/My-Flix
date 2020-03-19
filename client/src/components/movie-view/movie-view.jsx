import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Card from "react-bootstrap/Card";
import { Link } from "react-router-dom";
import "./movie-view.scss"

export class MovieView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { movie } = this.props;
    if (!movie) return null;
    return (
      <div className="movie-view">
        <Card style={{ backgroundColor: 'lightgrey' }}>
          < Card.Body >
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
                    <Link to={`/genres/${movie.Genre.Name}`}>
                      <span className="value">{movie.Genre.Name}</span>
                    </Link>
                  </div>
                  <div className="movie-director">
                    <span className="label">Director: </span>
                    <Link to={`/directors/${movie.Director.Name}`}>
                      <span className="value">{movie.Director.Name}</span>
                    </Link>
                  </div>
                  <div className="movie-description">
                    <span className="label">Description: </span>
                    <span className="value">{movie.Description}</span>
                  </div>
                  <Link to={"/"}>
                    <Button variant="primary">Return</Button>
                  </Link>
                </Col>
              </Row>
            </Container>
          </Card.Body >
        </Card>
      </div>
    );
  }
}