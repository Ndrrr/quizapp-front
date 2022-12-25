import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../common/jwtCommon";

const QuestionType ={
  SINGLE_CHOICE: 0,
  MULTIPLE_CHOICE: 1,
  OPEN_ENDED: 2,
}

export const TakeTest = () => {
  const navigate = useNavigate();

  const { testId } = useParams()

  const [load, setLoad] = useState(false);
  const [questionList, setQuestionList] = useState([]);

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [idkWhy, setIdkWhy] = useState(0);
  const [questionAnswerMap, setQuestionAnswerMap] = useState(new Map());

  const updateState = () => {
    setIdkWhy(1-idkWhy);
  }

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
    await axios.get(`api/test/${testId}`,{
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      if(response.status === 200) {
        setQuestionList(response.data.questions);
        console.log(response.data);
      } else {
        setError('Something went wrong');
        updateState()
      }
    }).catch((error) => {
      setError('Quiz not found or not started');
      updateState()
    });
  }

  const goBack = () => {
    navigate(-1);
  }

  const submitQuiz = async () => {
    const result = {
      testId: testId,
      questions: []
    }

    questionAnswerMap.forEach((value, key, map) => {
      let tempAnswer = {
        questionId: key,
        answers: [],
        openEndedAnswer: ''
      }
      if(value.type === QuestionType.OPEN_ENDED) {
        tempAnswer.openEndedAnswer = value.answers;
      } else {
        tempAnswer.answers = value.answer;
      }
      result.questions.push(tempAnswer);
    })
    console.log(result)
    axios.post(`api/test/submit`, result, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }}).then((response) => {
        if(response.status === 200) {
          setSuccess('Test submitted successfully');
          setTimeout(() => {
            navigate(-1);
          }, 2000);
        } else {
          setError('Something went wrong');
        }
      }).catch((error) => {
        console.log(error)
      setError(error.response.data.message);
    })
  }

  const BuildOpenEnded = (question) => {
    return (
      <div key={`${question.id}-oe`} className="question">
        <input className="form-control" type="text" name="answer" placeholder="Answer"
               style={{"minWidth":"500px"}}
               onChange={(e) => questionAnswerMap.set(question.id,
                   {type: QuestionType.OPEN_ENDED, answers: e.target.value})}/>
      </div>
    )
  }

  const handleMultipleChoice = (e, question) => {
    const answer = e.target.value;
    const isChecked = e.target.checked;
    const currentAnswer = (questionAnswerMap.get(question.id) !== undefined ? questionAnswerMap.get(question.id).answer : []);
    if(isChecked) {
      currentAnswer.push(answer);
      questionAnswerMap.set(question.id, {type: QuestionType.MULTIPLE_CHOICE, answer: currentAnswer});
    } else {
      currentAnswer.splice(currentAnswer.indexOf(answer), 1);
      questionAnswerMap.set(question.id, {type: QuestionType.MULTIPLE_CHOICE, answer: currentAnswer});
    }
  }

  const BuildMultipleChoice = (question) => {
    return (
        <div key={`${question.id}-mc`} className="question">
          {question.options.map((option) => {
            return (
                <div key={`${question.id}-mc-${option.id}`} className="option form-check">
                  <input className=" form-check-input" type="checkbox" id={`${question.id}-mc-${option.id}`}
                         name={`${question.id}-mc`} value={option.id} onChange={(e)=> handleMultipleChoice(e, question)}/>
                  <label className="form-check-label"  htmlFor={`${question.id}-mc-${option.id}`}>{option.optionText}</label>
                </div>
            )
          })}
        </div>
    )
  }

  const handleSingleChoice = (e, question) => {
    const answer = e.target.value;
    questionAnswerMap.set(question.id, {type: QuestionType.SINGLE_CHOICE, answer: [answer]});
  }

  const BuildSingleChoice = (question) => {
    return (
      <div key={`${question.id}-sc`} >
        {question.options.map((option) => {
          return (
            <div key={`${question.id}-sc-${option.id}`} className="form-check">
              <input className="form-check-input" type="radio" id={`${question.id}-sc-${option.id}`}
                     name={`${question.id}-sc`} value={option.id} onChange={(e) => handleSingleChoice(e, question)}/>
              <label className="form-check-label" htmlFor={`${question.id}-sc-${option.id}`}>{option.optionText}</label>
            </div>
          )
        })}
      </div>
    )
  }

  const BuildSingleQuestion = (question, index) => {
    return (
      <div key={`${question.id}-qs`} className="mb-5">
        <h3>{index+1}. {question.questionText}</h3>
        {question.type === QuestionType.OPEN_ENDED && BuildOpenEnded(question)}
        {question.type === QuestionType.MULTIPLE_CHOICE && BuildMultipleChoice(question)}
        {question.type === QuestionType.SINGLE_CHOICE && BuildSingleChoice(question)}
      </div>
      )
  }

  const BuildQuestions = () => {
    if (questionList.length > 0) {
      return questionList.map((question, index) => {
        return (
            BuildSingleQuestion(question,index)
        )
      })
    }
  }
  const BuildPage = () => {
    return (
        <div>
          <ul className="border border-info rounded-5 p-5">
            <BuildQuestions/>
            <button className="w-50 mt-2 mx-5 btn btn-primary" onClick={submitQuiz}>Submit</button>
          </ul>
        </div>
    )
  }
  return (
      <div className="container">
        <h1>Test - {testId}</h1>
        <h2 className="text-success"><b>{success}</b></h2>
        {error && <div className={"text-danger"}>{error} &nbsp; <button className={"btn btn-dark"} onClick={goBack}>Go Back</button></div>}
        {!error && <BuildPage/>}

      </div>
  )
}