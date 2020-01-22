import React from "react";
import Col from "react-bootstrap/Col";
import { connect } from "react-redux";
import { MovieCard } from "../movie-card/movie-card";

const mapStateToProps = state => {
  const { visibilityFilter } = state;
  return { visibilityFilter };
};

function MoviesList(props) {
  const { movies, visibilityFilter } = props;
  let filteredMovies = movies;

  if (visibilityFilter !== '') {
    filteredMovies = movies.filter(m => m.Title.includes(visibilityFilter));
  }

  if (!movies) return <div className="main-view" />;

  return filteredMovies.map(m =>
    <Col key={m._id} xs={12} sm={6} md={4} lg={3}>
      <MovieCard key={m._id} movie={m} />
    </Col>
  );
}

export default connect(mapStateToProps)(MoviesList);