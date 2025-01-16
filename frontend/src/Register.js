import { Link } from 'react-router-dom';
import './Register.css';
import react, { useState } from 'react'
export default function Register(){
    const [result,setResult] = useState(false)
    return <>
        <video src="marvel.mp4" id="intro" autoPlay loop muted></video>
        {!result?<Form setResult={setResult}/>:<Registered />}
    </>
}
function Form({setResult}){
    const [upp, setUpp] = useState(false); // Uppercase condition
    const [low, setLow] = useState(false); // Lowercase condition
    const [num, setNum] = useState(false); // Numeric condition
    const [sc, setSc] = useState(false);
    let [errorMsg,setErrorMsg] = useState(null)
    async function registerBtn(e){
        let form = e.target
        e.preventDefault()
        const formData = new FormData(form);
        const formObject = Object.fromEntries(formData.entries());
        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/user/registerUser", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(formObject),
            })
            if(!response.ok) {
                const error = await response.json();
                setErrorMsg(error);
                return;
            }
            const data = await response.json();
            if(data.result){
                setResult(true)
            }
            console.log("Response from server:", data);
        }catch(err){
            console.log(err)
        }
    }
    function passwordCheck(e) {
        const pass = e.target.value;

        // Regular Expressions
        const uppL = /[A-Z]/;   // At least one uppercase letter
        const lowL = /[a-z]/;   // At least one lowercase letter
        const numL = /[0-9]/;   // At least one numeric character
        const scL = /[!@#$&*]/; // At least one special character

        // Update States
        setUpp(uppL.test(pass));
        setLow(lowL.test(pass));
        setNum(numL.test(pass));
        setSc(scL.test(pass));
    }
    return <div className="registration">
        <h1>Register Now !!</h1>
        <form className="RegForm" onSubmit={registerBtn}>
        <label htmlFor="username">Enter Your Username</label>
        <input type="text" id="username" name="username"></input>
        <label htmlFor="password">Enter Your Password</label>
        <input type="password" id="password" name="password" onChange={(e)=>passwordCheck(e)}></input>
        <span className="condition">Password should have</span>
        <span className={`conditions ${upp ? "active" : "inactive"}`}>1 Uppercase letter</span>
        <span className={`conditions ${low ? "active" : "inactive"}`}>1 Lowercase letter</span>
        <span className={`conditions ${num ? "active" : "inactive"}`}>1 Numeric character</span>
        <span className={`conditions ${sc ? "active" : "inactive"}`}>1 Special character</span>
        <span className="conditions">8 length password</span>
        <label htmlFor="email">Enter Your EmailId</label>
        <input type="email" id="email" name="email"></input>
        <span id="errorMsg">{errorMsg}</span>
        <span id="loginRedirect">Already registered ? <Link to={"/login"}>Log in</Link></span>
        <button type="submit">Register</button>
        </form>
    </div>
}
function Registered(){
    return <div className='registered'>
        <h1>Successfully Registered</h1>
        <Link to={"/login"}><button>Go To Login Page</button></Link>
    </div>
}