import React from 'react';
import Button from "react-bootstrap/Button";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import './genre-view.scss'

export class GenreView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { genre } = this.props;
    if (!genre) return null;
    return (
      <div className="genre-view">
        <Card style={{ backgroundColor: 'lightgrey' }}>
          < Card.Body >
            <div className="genre-name">
              <h1><span className="value">{genre.Name}</span></h1>
            </div>
            <div className="genre-description">
              <span className="label">Description: </span>
              <span className="value">{genre.Description}</span>
            </div>
            <Link to={`/`}>
              <Button variant="primary">Return</Button>
            </Link>
          </Card.Body >
        </Card>
      </div>
    );
  }
}