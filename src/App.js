// import logo from "./logo.svg";
import "./App.css";
import React, { useState, useEffect, useReducer } from "react";
import Header from "./component/Header";
import Movie from "./component/Movie";
import Search from "./component/Search";

let countPage = 1;
// let MOVIE_API_URL = `https://www.omdbapi.com/?s=Batman&page=${countPage}&apikey=9d286e14`; // you should replace this with yours
const initialState = {
  loading: true,
  movies: [],
  errorMessage: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "SEARCH_MOVIES_REQUEST":
      return {
        ...state,
        loading: true,
        errorMessage: null,
      };
    case "SEARCH_MOVIES_SUCCESS":
      return {
        ...state,
        loading: false,
        movies: action.payload,
      };
    case "SEARCH_MOVIES_FAILURE":
      return {
        ...state,
        loading: false,
        errorMessage: action.error,
      };
    default:
      return state;
  }
};

let fatchArray = [];
let fetchRequest = true;
const App = () => {
  let MOVIE_API_URL = `https://www.omdbapi.com/?s=Batman&page=${countPage}&apikey=9d286e14`; // you should replace this with yours
  // const [loading, setLoading] = useState(true);
  // const [movies, setMovies] = useState([]);
  // const [errorMessage, setErrorMessage] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    // while (fetchRequest) {
    fetch(MOVIE_API_URL)
      .then((response) => response.json())
      .then((jsonResponse) => {
        fatchArray = [...jsonResponse.Search];
        console.log("fatchArray", fatchArray);
        if (jsonResponse.Response === "True") {
          // setMovies(jsonResponse.Search);
          // setLoading(false);
          // dispatch({
          //   type: "SEARCH_MOVIES_SUCCESS",
          //   payload: fatchArray,
          // });
          console.log("countPage", countPage);
          countPage++;
          fetchRequest = true;
        } else {
          countPage = 1;
          fetchRequest = false;
          dispatch({
            // setErrorMessage(jsonResponse.Error);
            // setLoading(false);
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonResponse.Error,
          });
        }
        dispatch({
          type: "SEARCH_MOVIES_SUCCESS",
          payload: fatchArray,
        });
      });
    // }
  }, []);

  const search = (searchValue) => {
    dispatch({
      type: "SEARCH_MOVIES_REQUEST",
    });
    // setLoading(true);
    // setErrorMessage(null);

    fetch(`https://www.omdbapi.com/?s=${searchValue}&apikey=9d286e14`)
      .then((response) => response.json())
      .then((jsonResponse) => {
        if (jsonResponse.Response === "True") {
          // setMovies(jsonResponse.Search);
          // setLoading(false);
          dispatch({
            type: "SEARCH_MOVIES_SUCCESS",
            payload: jsonResponse.Search,
          });
        } else {
          // setErrorMessage(jsonResponse.Error);
          // setLoading(false);
          dispatch({
            type: "SEARCH_MOVIES_FAILURE",
            error: jsonResponse.Error,
          });
        }
      });
  };
  const { movies, errorMessage, loading } = state;

  return (
    <div className="App">
      <Header text="HOOKED" />
      <Search search={search} />
      <p className="App-intro">Sharing a few of our favourite movies</p>
      <div className="movies">
        <span>cont movie {movies.length}</span>
        {loading && !errorMessage ? (
          <span>loading...</span>
        ) : errorMessage ? (
          <div className="errorMessage">{errorMessage}</div>
        ) : (
          movies.map((movie, index) => (
            <Movie key={`${index}-${movie.Title}`} movie={movie} />
          ))
        )}
      </div>
    </div>
  );
};

export default App;
