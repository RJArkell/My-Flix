import React from 'react';
import Button from "react-bootstrap/Button";
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import './director-view.scss'

export class DirectorView extends React.Component {
  constructor() {
    super();
    this.state = {};
  }
  render() {
    const { director } = this.props;
    if (!director) return null;
    return (
      <div className="director-view">
        <Card style={{ backgroundColor: 'lightgrey' }}>
          < Card.Body >
            <Container fluid>
              <Row>
                <Col sm={4}>
                  <Image className="director-picture" src={director.ImagePath} fluid />
                </Col>
                <Col sm={8}>
                  <div className="director-name">
                    <h1><span className="value">{director.Name}</span></h1>
                  </div>
                  <div className="director-born">
                    <span className="label">Born: </span>
                    <span className="value">{director.Born}</span>
                  </div>
                  <div className="director-bio">
                    <span className="label">Biography: </span>
                    <span className="value">{director.Biography}</span>
                  </div>
                  <Link to={`/`}>
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