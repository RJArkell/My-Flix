import React from "react";
import Col from "react-bootstrap/Col";
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

  return <div className="movie-list">
    <Row>
      <VisibilityFilterInput visibilityFilter={visibilityFilter} />
    </Row>

    <Row>
      {filteredMovies.map(m =>
        <Col key={m._id} xs={12} sm={6} md={4} lg={3}>
          <MovieCard key={m._id} movie={m} />
        </Col>)}
    </Row>
  </div>;
}

export default connect(mapStateToProps)(MovieList);