import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../common/jwtCommon";

export const Teacher = () => {

  const [load, setLoad] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [newQuizName, setNewQuizName] = useState('');

  const [error, setError] = useState('');

  const loadQuizzes = async () => {
    await axios.get('api/Quiz',{
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      if(response.status === 200) {
        setQuizList(response.data);
        console.log(response.data);
      } else {
        setError('Something went wrong');
      }
    }).catch((error) => {
      setError('Something went wrong');
    });
  }

  const ConstructQuizList = () => {

    return quizList.map((quiz) => {
      return (
          <Link key={quiz.id}
              className="list-group-item list-group-item-action"
              to={`quiz/${quiz.quizId}`}>
            {quiz.quizTitle}
          </Link>
      )
    })
  }

  useEffect(() => {
    if(!load) {
      const onPageLoad = async () => {
        await loadQuizzes()
        setLoad(true);
      }
      if (document.readyState === 'complete') {
        onPageLoad();
      } else {
        window.addEventListener('load', onPageLoad);
        return () => window.removeEventListener('load', onPageLoad);
      }
    }
  })

  const createQuiz = async () => {
    await axios.post('api/Quiz',{
      title: newQuizName
    },{
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      if(response.status === 200) {
        loadQuizzes();
      } else {
        setError('Something went wrong');
      }
    }).catch((error) => {
      setError('Something went wrong');
    });
    window.location.reload();
  }

  return (
      <div className="container">
          <h1>Teacher Page</h1>
          <input name={"newQuizInput"} value={newQuizName} onChange={(e) => setNewQuizName(e.target.value)}/> &nbsp;
          <button className={"btn btn-primary mb-2"} onClick={createQuiz}> Add New Quiz</button>
        <div className="list-group">
          <ConstructQuizList/>
        </div>
      </div>
  )
}