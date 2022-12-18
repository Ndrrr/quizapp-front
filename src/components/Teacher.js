import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export const Teacher = () => {
  const { setAuth } = useAuth();

  const navigate = useNavigate();

  const [quizList, setQuizList] = useState([]);
  const [error, setError] = useState('');

  const loadQuizzes = async () => {
    await axios.get('api/Quizzes', {
      withCredentials: true
    }).then((response) => {
      if(response.status === 200) {
        setQuizList(response.data);
        console.log(response.data);
      } else {
        setError('Invalid credentials');
      }
    }).catch((error) => {
      setError('Invalid credentials');
    });
  }

  return (
      <div className="container">
          <h1>Teacher Page</h1>
      </div>
  )
}