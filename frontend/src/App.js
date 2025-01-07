import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from "./Register.js"
import Login from "./Login.js";
import Home from "./Home.js";
import MovieView from "./movieView.js";
import { createContext, useState } from "react";
import Premium from "./premium.js";
import TermAndCondition from "./tc.js";
export let movieContext = createContext()
export default function App(){
    let [movieKey,setMoviekey] = useState(null)
    return <>
    <BrowserRouter>
    <movieContext.Provider value={{movieKey,setMoviekey}}>
    <Routes>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/" element={<Home setMoviekey={setMoviekey}/>}></Route>
        <Route path="/movieView" element={<MovieView/>}></Route>
        <Route path="/premium" element={<Premium/>}></Route>
        <Route path="/termandconditions" element={<TermAndCondition/>}></Route>
    </Routes>
    </movieContext.Provider>
    </BrowserRouter>
    </>
}