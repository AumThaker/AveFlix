import "./Home.css";
import React, {useContext, useEffect, useState } from "react";
import { Link ,useNavigate } from "react-router-dom";
import { movieContext } from "./App.js";
export default function Home() {
  let [tokenStatus, setTokenStatus] = useState(false);
  let [userData, setUserData] = useState(null);
  let [moviesData,setMoviesData] = useState(null); 
  let [loginNotification,setLoginNotification] = useState(false)
  let {setMoviekey} = useContext(movieContext)
  let [premiumNotification,setPremiumNotification] = useState(false)
  const navigate = useNavigate()
  useEffect(() => {
    async function fetching() {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/user/fetchUser", {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) {
          const error = await response.json();
          console.log(error)
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
  useEffect(()=>{
    try {
        async function moviesApi(){
            const response = await fetch(process.env.REACT_APP_MOVIEAPI_URL + "/api",{
                method:"GET"
            })
            if (!response.ok) {
                const error = await response.json();
                return error;
              }
      
              const data = await response.json();
              if(data) setMoviesData(Object.values(data));
              console.log("Response from server:", data);
        }
        moviesApi();
    } catch (error) {
        console.log(error)
    }
  },[])

  async function movieView(index){
    setMoviekey(index)
    if(!tokenStatus || !userData){
      setLoginNotification(true)
    }
    else if(userData.premium.paymentID===null){
      setPremiumNotification(true)
    }
    else{
      navigate('/movieView')
    }
  }

  function closeLoginNotification(){
    setLoginNotification(false)
  }
  function closePremiumNotification(){
    setPremiumNotification(false)
  }

  return (
    <>
      <nav>
        <h1>AveFlix</h1>
        {!tokenStatus ? (
          <>
          <Link to='/termandconditions'>
          <h2>Terms And Conditions</h2>
          </Link>
          <Link to="/login">
            <button>Login Now</button>
          </Link>
          </>
        ) : (
          <div className="leftNav">
            <h2>Terms And Conditions</h2>
            <h2>Privacy And Shipping Policy</h2>
            <h2>Cancellation/Refund</h2>
            <h2>Contact us</h2>
            <Link to="/premium"><button id="premium">Premium</button></Link>
            <h2>{userData.user.username}</h2>
          </div>
        )}
      </nav>
      {loginNotification?<div className="notification">
        <h4>Login to watch movies</h4>
        <svg xmlns="http://www.w3.org/2000/svg" onClick={closeLoginNotification} width="20" height="20" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
</svg>
      </div>:null}
      {premiumNotification?<div className="notification">
        <h4>Upgrade to premium to watch movies</h4>
        <svg xmlns="http://www.w3.org/2000/svg" onClick={closePremiumNotification} width="20" height="20" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
  <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/>
</svg>
      </div>:null}
      <main>
        <div className="movies">
        {moviesData===null?<div class="fullpage-wrapper">
  <div class="reactor-container">
    <div class="reactor-container-inner circle abs-center"></div>
    <div class="tunnel circle abs-center"></div>
    <div class="core-wrapper circle abs-center"></div>
    <div class="core-outer circle abs-center"></div>
    <div class="core-inner circle abs-center"></div>
    <div class="coil-container">
      <div class="coil coil-1"></div>
      <div class="coil coil-2"></div>
      <div class="coil coil-3"></div>
      <div class="coil coil-4"></div>
      <div class="coil coil-5"></div>
      <div class="coil coil-6"></div>
      <div class="coil coil-7"></div>
      <div class="coil coil-8"></div>
    </div>
  </div>
</div>:moviesData.map((movie,i)=>{
            return <div className="movie" key={i} onClick={()=>{movieView(i)}}>
                <img src={movie.movieImage} alt="moviePoster"></img>
                <h3>{movie.movieName}</h3>
                <h3>{movie.movieLength}</h3>
            </div>
        })}
        </div>
      </main>
    </>
  );
}
