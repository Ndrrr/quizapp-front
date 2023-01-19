import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../common/jwtCommon";

export const CheckAnonymousTake = () => {
  const navigate = useNavigate();

  const { quizId, testId, anonymousId } = useParams()

  const [load, setLoad] = useState(false);
  const [anonymousAnswers, setAnonymousAnswers] = useState([]);
  const [scoreByQuestion, setScoreByQuestion] = useState(new Map());

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if(!load) {
      const onPageLoad = async () => {
        await loadAnonymousAnswers().then((data) => {
          console.log(data)
          setAnonymousAnswers(data);
          setLoad(true);
        })}
      if (document.readyState === 'complete') {
        onPageLoad();
      } else {
        window.addEventListener('load', onPageLoad);
        return () => window.removeEventListener('load', onPageLoad);
      }
    }
  })

  const loadAnonymousAnswers = async () => {
    return await axios.get(`api/Take/${anonymousId}/openended`,{
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      if(response.status === 200) {
        return response.data;
      } else {
        setError('Something went wrong');
      }
    }).catch((error) => {
      setError('Something went wrong');
    });
  }

  const submitReview = async () => {
    const data = {
      marks: []
    }
    scoreByQuestion.forEach((value, key) => {
      data.marks.push({
        id: key,
        score: Math.round(value)
      })
    });

    await axios.post(`api/Take/givemark/${anonymousId}`, data,
        {
          headers: {
            Authorization: `Bearer ${getAccessToken()}`
          }
        }).then((response) => {
          setSuccess('Review submitted successfully');
          setTimeout(() => {
            navigate(-1);
          }, 2000);
          console.log("success" + response);
    })
  }

  const BuildAnonymousFormQuestions = () => {
    return anonymousAnswers.map((anonymousQuestion, index) => {
      return (
          <div key={`${anonymousQuestion.takeQuestionId}-aq`}>
            <h3>{index+1}. {anonymousQuestion.questionText}</h3>
            <h4>- {anonymousQuestion.studentAnswer}</h4>
            <label htmlFor={`${anonymousQuestion.takeQuestionId}-reviewed`}>Score: </label> &nbsp;
            <select name={`${anonymousQuestion.takeQuestionId}-reviewed`}
                   onChange={(e) => {scoreByQuestion.set(anonymousQuestion.takeQuestionId, e.target.value)}}
                     defaultValue={anonymousQuestion.score}>
            >
              <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
            </select>
          </div>
      )
    })
  }

  const BuildAnonymousCheckingView = () => {
    return (
        <div>
          <h1>Anonymous Results</h1>
          <h2 className="text-success"><b>{success}</b></h2>

          <div>
            <ul className={"border border-info rounded-5 p-5"}>
              <BuildAnonymousFormQuestions />
              <button className={"btn btn-dark mt-2"} onClick={submitReview}>Submit</button>
            </ul>
          </div>
        </div>
    )
  }

  return (
      <div className="container">
        <h1>Checking Page - {testId}</h1>
        <br/><br/>
        <BuildAnonymousCheckingView />
      </div>
  )
}