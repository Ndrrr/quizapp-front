import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Login = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();

      await axios.post('api/Authentication/login', {
        email,
        password,
      }, {
        withCredentials: true
      }).then((response) => {
        if(response.status === 200) {
          console.log(response.data.accessToken)
          let accessToken = response?.data?.accessToken;
          setAuth({accessToken});
          cookies.set('accessToken', accessToken, { path: '/' });
          navigate(from, { replace: true });
        } else {
          setError('Invalid credentials');
        }
      }).catch((error) => {
        setError('Invalid credentials');
      });
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