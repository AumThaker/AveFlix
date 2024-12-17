import "./movieView.css";
import { movieContext } from "./App.js";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
export default function MovieView() {
  return (
    <>
      <Movie />
    </>
  );
}
function Movie() {
  let { movieKey } = useContext(movieContext);
  let [tokenStatus, setTokenStatus] = useState(false);
  let [userData, setUserData] = useState(null);
  let [movieData, setMovieData] = useState(null);
  let navigate = useNavigate()
  useEffect(() => {
    async function fetching() {
      try {
        const response = await fetch(process.env.BACKEND_URL + "/user/fetchUser", {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) {
          const error = await response.json();
          return error;
        }

        const data = await response.json();
        if (data.result) {
          setTokenStatus(true);
          setUserData(data);
        }
        console.log("Response from server:", data);
      } catch (error) {
        console.log(error);
      }
    }
    fetching();
  }, []);
  useEffect(() => {
    try {
      async function fetchingMovie() {
        if(movieKey===null){
          navigate('/')
        }
        let movieKeyJson = {
          movie: movieKey,
        };
        const response = await fetch("http://localhost:5000/movies", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(movieKeyJson),
        });
        if (!response.ok) {
          const error = await response.json();
          return error;
        }

        const data = await response.json();
        if (data.result) {
          console.log(data.movie.movieLink);
          setMovieData(data);
        }
        console.log("Response from server:", data);
      }
      fetchingMovie();
    } catch (error) {
      console.log(error);
    }
  }, [movieKey]);
  return (
    <>
      <nav>
        <h1>AveFlix</h1>
        {!tokenStatus ? (
          <Link to="/login">
            <button>Login Now</button>
          </Link>
        ) : (
          <div className="leftNav">
            <button id="premium">Premium</button>
            <h2>{userData.user.username}</h2>
          </div>
        )}
      </nav>
      <div className="mainContainer">
        {movieData === null ? null : (
          <>
            <div className="video-container">
              <video
                src={movieData.movie.movieLink}
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
                controls
              ></video>
            </div>
            <div className="movieDetails">
              <img
                src={movieData.movie.movieImage}
                alt={`${movieData.movie.movieName} Poster`}
              ></img>
              <h1>{movieData.movie.movieName}</h1>
              <h3 id="mry">{movieData.movie.movieReleaseYear}</h3>
              <h3 id="ml">{movieData.movie.movieLength}</h3>
              <p>{movieData.movie.movieDesc}</p>
              <span id="rating1">IMDB RATINGS : {movieData.movie.movieRatings.imDB}</span>
              <span id="rating2">ROTTEN TOMATOES :{movieData.movie.movieRatings.rottenTomatoes}</span>
            </div>
          </>
        )}
      </div>
    </>
  );
}
