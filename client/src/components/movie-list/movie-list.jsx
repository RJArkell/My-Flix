import React from "react";
import Col from "react-bootstrap/Col";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import { connect } from "react-redux";
import VisibilityFilterInput from '../visibility-filter-input/visibility-filter-input';
import { MovieCard } from "../movie-card/movie-card";

const mapStateToProps = state => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MovieList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter(m => m.Title.toLowerCase().includes(visibilityFilter.toLowerCase()));
  }

  if (!movies) return <div className="main-view" />;

  return (<div className="movie-list">
    <VisibilityFilterInput visibilityFilter={visibilityFilter} />
    {filteredMovies.map(m =>
      <Container>
        <Row>
          {movies.map(m => (
            <Col key={m._id} xs={12} sm={6} md={4} lg={3}>
              <MovieCard key={m.id} movie={m} />
            </Col>
          ))}
        </Row>
      </Container>
    )};
  </div>
  )
}

export default connect(mapStateToProps)(MovieList);