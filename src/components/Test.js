import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../common/jwtCommon";

export const Test = () => {

  const { quizId, testId } = useParams()

  const [load, setLoad] = useState(false);
  const [questionList, setQuestionList] = useState([]);


  const [error, setError] = useState('');

  useEffect(() => {
    if(!load) {
      const onPageLoad = async () => {
        await loadQuestions()
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

  const loadQuestions = async () => {
    await axios.get(`api/Quiz/${quizId}/questions`,{
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      if(response.status === 200) {
        setQuestionList(response.data);
        console.log(response.data);
      } else {
        setError('Something went wrong');
      }
    }).catch((error) => {
      setError('Something went wrong');
    });
  }

  return (
      <div className="container">
        <h1>Test Page - {testId}</h1>
        <br/><br/>
        <div className="split">
          <div className={"left"}>left</div>
          <div className={"right"}>right </div>
        </div>
      </div>
  )
}