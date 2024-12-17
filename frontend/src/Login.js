import "./Login.css";
import {React, useState} from "react";
import { Link } from "react-router-dom";
export default function Login(){
    let [res,setRes] = useState(false)
    return <>
    <video src="marvel.mp4" id="intro" autoPlay loop muted></video>
    {!res?<Form setRes={setRes}/>:<LoggedIn/>}
    </>
}
function Form({setRes}){
    let [errorMsg,setErrorMsg] = useState(null)
    async function LoginBtn(e){
        console.log(process.env.REACT_APP_BACKEND_URL)
        let form = e.target
        e.preventDefault()
        let formdata = new FormData(form)
        let formObject = Object.fromEntries(formdata.entries())
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/user/loginUser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formObject),
              credentials: "include"
            })
            if(!response.ok) {
                const error = await response.json();
                setErrorMsg(error);
                return;
            }
    
            const data = await response.json();
            if(data.result){
                setRes(true)
            }
            console.log("Response from server:", data);
        }catch(err){
            console.log(err)
        }
    }
    return <div className="loginForm">
    <h1>Login</h1>
    <form className="LoginForm" onSubmit={LoginBtn}>
    <label htmlFor="username">Enter Your Username</label>
    <input type="text" id="username" name="username"></input>
    <label htmlFor="password">Enter Your Password</label>
    <input type="password" id="password" name="password"></input>
    <span id="errorMsg">{errorMsg}</span>
    <span id="loginRedirect">New user ? <Link to={"/register"}>Register now</Link></span>
    <button type="submit">Log in</button>
    </form>
</div>
}
function LoggedIn(){
    return <div className='loggedin'>
        <h1>Successfully Logged In</h1>
        <Link to={"/"}><button>Go To Home Page</button></Link>
    </div>
}