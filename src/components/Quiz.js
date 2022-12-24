import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../common/jwtCommon";

const difficulty = {
  "EASY": 0,
  "MEDIUM": 1,
  "HARD": 2
}

const reverseDifficulty = {
  0: "EASY",
  1: "MEDIUM",
  2: "HARD"
}

export const Quiz = () => {

  const { id } = useParams()

  const [load, setLoad] = useState(false);
  const [questionList, setQuestionList] = useState([]);

  const [questionId, setQuestionId] = useState(0);
  const [questionText, setQuestionText] = useState('');
  const [questionDifficulty, setQuestionDifficulty] = useState('EASY');
  const [questionOptions, setQuestionOptions] = useState([]);
  const [questionsIsCorrect, setQuestionsIsCorrect] = useState([]);
  const [optionCount, setOptionCount] = useState(0);
  const [idkwhy, setIdkwhy] = useState(0);

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
    await axios.get(`api/Quiz/${id}/questions`,{
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

  const onModalPageOpen = (questionId) => {
    setQuestionId(questionId);
    const question = questionList.find(q => q.id === questionId);
    console.log(question);
    let finalOptions = [];
    for(let i = 0; i < question.options.length; i++) {
      finalOptions.push(question.options[i].optionText);
    }
    setQuestionOptions(finalOptions);
    let finalIsCorrect = [];
    for(let i = 0; i < question.options.length; i++) {
      finalIsCorrect.push(question.options[i].isCorrect);
    }
    setQuestionsIsCorrect(finalIsCorrect);
    setQuestionText(question.questionText);
    setQuestionDifficulty(reverseDifficulty[question.difficulty]);
    setOptionCount(question.options.length);
    console.log(finalIsCorrect)
  }

  const comparatorDifficulty = (a, b) => {
    if(a.difficulty === b.difficulty)
      return a.questionText.localeCompare(b.questionText);
    return a.difficulty - b.difficulty;
  }

  const getColorClassBasedOnDifficulty = (difficulty) => {
    if(difficulty === 0) {
      return "list-group-item-success";
    } else if(difficulty === 1) {
      return "list-group-item-warning";
    } else {
      return "list-group-item-danger";
    }
  }

  const onQuestionDelete = (questionId) => {
    questionList.splice(questionList.findIndex(q => q.id === questionId), 1);
    setQuestionList(questionList);
    setIdkwhy(1-idkwhy);
    submitQuiz()
  }

  const ConstructQuestionList = () => {
    questionList.sort(comparatorDifficulty);
    let index = 1;
    return questionList.map((question) => {
      return (
          <div className={"d-flex"} key={`${question.id}-dv`}>
          <button key={`${question.id}`}
                className={"list-group-item list-group-item-action " + getColorClassBasedOnDifficulty(question.difficulty) }
                onClick={() => onModalPageOpen(question.id)}
                type="button" data-toggle="modal" data-target={`#createQuestionModal`}>
            {index++}. {question.questionText}
          </button>&nbsp;
            <button key={`${question.id}-del`} onClick={() => onQuestionDelete(question.id)}
                    className={"list-group-item list-group-item-action list-group-item-danger h-25"}
                    style={{"width":"5%"}}>Del</button>
            <br/>
            <br/>
          </div>
      )
    })
  }

  const onQuestionSubmit = (e) => {
    e.preventDefault()
    const question = {
      questionText: questionText,
      difficulty: difficulty[questionDifficulty],
      type: 0,
      options: []
    }
    let answerCount = 0;

    for(let i = 0; i < optionCount; i++) {
      if(questionOptions[i] === undefined) {
        questionOptions[i] = '';
      }
      if(questionsIsCorrect[i] === undefined) {
        questionsIsCorrect[i] = false;
      }
      question.options.push({
        optionText: questionOptions[i],
        isCorrect: questionsIsCorrect[i]
      })
      if(questionsIsCorrect[i]) {
        answerCount++;
      }
    }
    if(answerCount === 0) {
      question.type = 2;
    } else if(answerCount === 1) {
      question.type = 0;
    } else {
      question.type = 1;
    }

    questionList.map((q) => {
      if(q.id === questionId) {
        q.questionText = questionText;
        q.difficulty = difficulty[questionDifficulty];
        q.type = question.type;
        q.options = question.options;
      }
      return q;
    })
    console.log(questionList);
    submitQuiz()
  }

  const submitQuiz = () => {
    axios.post(`api/Quiz/${id}/questions`, {questions: questionList}, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    })
    window.location.reload();
  }

  const onNewQuestionAdded = () => {
    const newQuestion = {
      questionText: 'new question',
      difficulty: 1,
      type: 0,
      options: []
    }
    questionList.push(newQuestion);
    setQuestionList(questionList);
    submitQuiz()
  }

  return (
      <div className="container">
        <h1>Quiz Page</h1>
        <button type="button" className="btn btn-primary" onClick={onNewQuestionAdded}>Add Question</button>
        <br/><br/>
        <div className="list-group">
          <ConstructQuestionList/>

          <div className="modal fade" id={`createQuestionModal`} tabIndex="-1" role="dialog"
               aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
              <div className="modal-content row">
                <div className="modal-header">
                  <h3 className="modal-title" id="exampleModalLabel">Modify Question</h3>
                  <button type="button" className="close" data-dismiss="modal"
                          aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div className="modal-body">
                  <form onSubmit={onQuestionSubmit} noValidate className={"col-md-12"}>
                    <div className="form-group">
                      <label htmlFor="questionText">Statement: </label>
                      <input type="text"
                             className="form-control"
                             name="questionText"
                             id="fc-name"
                             value={questionText}
                              onChange={(e) => setQuestionText(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="questionDifficulty">Difficulty: </label>
                      <select className="form-control"
                              id="questionDifficulty"
                              value={questionDifficulty}
                              onChange={(e) => setQuestionDifficulty(e.target.value)}
                      >
                        <option value="EASY">Easy</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HARD">Hard</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="optionCount">Option Count: </label>
                      <input type="number"
                             className="form-control"
                             name="questionOptions"
                             id="fc-name"
                             value={optionCount}
                             onChange={(e) => setOptionCount(parseInt(e.target.value))}
                      />
                    </div>

                    { optionCount > 0 && (
                      [...Array(optionCount)].map((e, i) => {
                        return (
                            <div className="form-group" key={`key-div-${questionId}-${i}`}>
                              <label htmlFor="optionCount">Option {i + 1} </label> &nbsp;
                              <input type="checkbox" name="isCorrect"
                                     key={`key-inputIsCorrect-${questionId}-${i}`}
                                      onChange={(e) => {
                                        let temp = questionsIsCorrect;
                                        temp[i] = e.target.checked;
                                        setQuestionsIsCorrect(temp);
                                        setIdkwhy(1-idkwhy);
                                      }}
                                     value={questionsIsCorrect[i]}
                                     checked={questionsIsCorrect[i]}
                              />
                              <input type="text" name="questionOptions"
                                     key={`key-inputOption-${questionId}-${i}`}
                                     className="form-control"
                                     onChange={(e) => {
                                        let temp = questionOptions;
                                        temp[i] = e.target.value;
                                        setQuestionOptions(temp);
                                        setIdkwhy(1-idkwhy);
                                       console.log(questionOptions)
                                       console.log(i)
                                     }}
                                     value={questionOptions[i]}
                              />
                            </div>
                        )
                      }))
                    }

                    <br/>
                    <div className="form-group">
                      <button type="submit" className="btn btn-primary btn-block">Submit</button>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary"
                          data-dismiss="modal">Close
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
  )
}