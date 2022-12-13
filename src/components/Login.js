import { useState } from "react";
import { Link, Navigate } from "react-router-dom";

import Cookies from "universal-cookie";
import axios from "axios";

const cookies = new Cookies();

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [navigate, setNavigate] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

      await axios.post('api/Authentication/login', {
        email,
        password,
      }).then((response) => {
        if(response.status === 200) {
          console.log(response.data.accessToken)
          let accessToken = response.data.accessToken;
          cookies.set('accessToken', accessToken, { path: '/' });
          setNavigate(true);
        }
      }).catch((error) => {
        setError('Invalid credentials');
      });
    }

  if(navigate) {
    return <Navigate to="/dashboard" />
  }

  return (
      <div className="container">
        <h1 className="h3 mb-3 font-weight-normal text-center">Please sign in</h1>
        <form className="form-signin" onSubmit={onSubmit}>
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input type="email" id="inputEmail" className="form-control"
                 placeholder="Email address" required autoFocus
                 onChange={e => setEmail(e.target.value)}/>

          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" id="inputPassword" className="form-control"
                 placeholder="Password" required
                 onChange={e => setPassword(e.target.value)}/>
          <p className={"text-danger"}>{error}</p>
          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
          <br/>
          <Link to={"/register"}>Don't have an account?</Link>
        </form>
      </div>
  )
}