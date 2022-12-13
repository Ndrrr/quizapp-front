import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

export const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [userType, setUserType] = useState(0);

  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordConfirmError, setPasswordConfirmError] = useState('');

  const [navigate, setNavigate] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();

    if(passwordError === '' && emailError === '' && passwordConfirmError === '') {
      await axios.post('api/Authentication/register', {
        name: firstName,
        surname: lastName,
        email,
        password,
        userType: parseInt(userType)
      }).then((response) => {
        if(response.status === 200) {
          setNavigate(true);
        }
      }).catch((error) => {
        console.log(error);
       if(error.request.status === 500) {
        setEmailError('User with this email already exists');
      } else {
        setEmailError('Something went wrong');
      }
      });
      //setNavigate(true);
    }
  }
  if(navigate) {
    return <Navigate to="/login" />
  }

  const onEmailChange = async (e) => {
    setEmail(e.target.value);

    // email must be valid
    if (!e.target.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setEmailError('Email must be valid');
    } else {
      setEmailError('');
    }
  }

  const onPasswordChange = async (e) => {
    setPassword(e.target.value);

    if (!e.target.value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)) {
      let errorMsg = `Password must contain`;
      if (!e.target.value.match(/^(?=.*\d)/gm)) {
        errorMsg += ` <li>at least one number</li>`;
      }
      if (!e.target.value.match(/^(?=.*[a-z])/gm)) {
        errorMsg += ` <li>at least one lowercase letter</li>`;
      }
      if (!e.target.value.match(/^(?=.*[A-Z])/gm)) {
        errorMsg += ` <li>at least one uppercase letter</li>`;
      }
      if (!e.target.value.match(/^(?=.*[@$!%*?&])/gm)) {
        errorMsg += ` <li>at least one special character</li>`;
      }
      if (!e.target.value.match(/^(?=.{8,})/gm)) {
        errorMsg += ` <li>at least 8 characters</li>`;
      }
      setPasswordError(errorMsg);
    } else {
      setPasswordError('');
    }
  }

  const onPasswordConfirmChange = async (e) => {
    setPassword2(e.target.value);

    // password must match
    if (e.target.value !== password) {
      setPasswordConfirmError('Password must match');
    } else {
      setPasswordConfirmError('');
    }
  }

  return (
      <div className="container">
        <h1 className="h3 mb-3 font-weight-normal text-center">Please sign up</h1>
        <form className="form-signin" onSubmit={onSubmit}>
          <label htmlFor="inputEmail" className="sr-only">Email address</label>
          <input type="email" id="inputEmail" className="form-control"
                 placeholder="Email address" required autoFocus
                 onChange={onEmailChange}/>
          <p className={'text-danger'}>{emailError}</p>

          <label htmlFor="inputFirstName" className="sr-only">First Name</label>
          <input type="text" id="inputFirstName" className="form-control"
                 placeholder="First Name" required
                 onChange={e => setFirstName(e.target.value)}/>
          <p></p>

          <label htmlFor="inputLastName" className="sr-only">Last Name</label>
          <input type="text" id="inputLastName" className="form-control"
                 placeholder="Last Name" required
                 onChange={e => setLastName(e.target.value)}/>
          <p></p>

          <label htmlFor="inputPassword" className="sr-only">Password</label>
          <input type="password" id="inputPassword" className="form-control"
                 placeholder="Password" required
                 onChange={onPasswordChange}/>
          <p className={'text-danger'} dangerouslySetInnerHTML={{ __html:passwordError}}></p>

          <label htmlFor="inputPasswordConfirm" className="sr-only">Confirm Password</label>
          <input type="password" id="inputPasswordConfirm" className="form-control"
                 placeholder="Confirm Password" required
                 onChange={onPasswordConfirmChange}/>
          <p className={'text-danger'}>{passwordConfirmError}</p>

          <div id={"usertype-container"}>
            <input name={"usertype"} id={"student"} type={"radio"} value={"0"} defaultChecked={true}
             onChange={e => setUserType(e.target.value)}/>
            <label htmlFor={"student"}>Student</label>
            <input name={"usertype"} id={"teacher"} type={"radio"} value={"1"}
              onChange={e => setUserType(e.target.value)}/>
            <label htmlFor={"teacher"}>Teacher</label>
          </div>

          <button className="btn btn-lg btn-primary btn-block" type="submit">Sign up</button>
          <br/>
          <Link to={"/login"}>Already have an account?</Link>
        </form>
      </div>
  )
}