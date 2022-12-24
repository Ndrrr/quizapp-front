import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../common/jwtCommon";
import { MDBCollapse } from "mdb-react-ui-kit";
import $ from "jquery";

export const Teacher = () => {

  const [load, setLoad] = useState(false);
  const [quizList, setQuizList] = useState([]);
  const [newQuizName, setNewQuizName] = useState('');

  const [testTitle, setTestTitle] = useState('New Test');
  const [quizId, setQuizId] = useState(0);
  const [easyQuestionCount, setEasyQuestionCount] = useState(0);
  const [mediumQuestionCount, setMediumQuestionCount] = useState(0);
  const [hardQuestionCount, setHardQuestionCount] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [error, setError] = useState('');

  const loadQuizzes = async () => {
    await axios.get('api/Quiz', {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      if (response.status === 200) {
        setQuizList(response.data);
        console.log(response.data);
        setQuizId(response.data[0]?.quizId);
      } else {
        setError('Something went wrong');
      }
    }).catch((error) => {
      setError('Something went wrong');
    });
  }

  const toggleCollapse = (quizId) => {
    const elem = $('#collapse-' + quizId);
    elem.slideToggle()
  }

  const ConstructQuizList = () => {

    return quizList.map((quiz) => {
      return (
          <div key={`${quiz.quizId}-main`}
               className="list-group-item list-group-item-action" onClick={() => toggleCollapse(quiz.quizId)}>
            <Link className={`list-group-item list-group-item-action list-group-item-info`}
                  to={`quiz/${quiz.quizId}`}>
              {quiz.quizTitle}
            </Link>
            <MDBCollapse className={"list-group"} id={`collapse-${quiz.quizId}`} show >
              {quiz.tests.map((test) => {
                return (
                <Link key = {`${quiz.quizId}-${test.testId}`}
                      className={"list-group-item list-group-item-action list-group-item-primary"}
                      to={`quiz/${quiz.quizId}/test/${test.testId}`}>
                >
                  {test.testTitle}
                </Link>
                    )}
              )}
            </MDBCollapse>
          </div>
      )
    })
  }

  useEffect(() => {
    if (!load) {
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
    await axios.post('api/Quiz', {
      title: newQuizName
    }, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      if (response.status === 200) {
        loadQuizzes();
      } else {
        setError('Something went wrong');
      }
    }).catch((error) => {
      setError('Something went wrong');
    });
    window.location.reload();
  }

  const onTestSubmit = (e) => {
    e.preventDefault();
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);

    const newTest = {
      title: testTitle,
      quizId: quizId,
      easyQuestionCount: easyQuestionCount,
      mediumQuestionCount: mediumQuestionCount,
      hardQuestionCount: hardQuestionCount,
      startDate: startDateObj.toISOString(),
      endDate: endDateObj.toISOString()
    }

    axios.post('api/Test', newTest, {
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      if (response.status === 200) {
        window.location.reload();
      } else {
        setError('Something went wrong');
      }
    }).catch((error) => {
      setError('Something went wrong');
    })
  }

  return (
      <div className="container">
        <h1>Teacher Page</h1>

        <input name={"newQuizInput"} value={newQuizName} onChange={(e) => setNewQuizName(e.target.value)}/> &nbsp;
        <button className={"btn btn-primary mb-2"} onClick={createQuiz}> Add New Quiz</button>
        &nbsp;
        <button className={"btn btn-primary mb-2"} type="button" data-toggle="modal"
                data-target={`#createTestModal`}> Add Test
        </button>

        <div className="list-group">
          <ConstructQuizList/>
        </div>
        <div className="modal fade" id={`createTestModal`} tabIndex="-1" role="dialog"
             aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content row">
              <div className="modal-header">
                <h3 className="modal-title" id="exampleModalLabel">Add Test</h3>
                <button type="button" className="close" data-dismiss="modal"
                        aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form onSubmit={onTestSubmit} noValidate className={"col-md-12"}>
                  <div className="form-group">
                    <label htmlFor="questionText">Title: </label>
                    <input type="text"
                           className="form-control"
                           name="questionText"
                           id="fc-name"
                           value={testTitle}
                           onChange={(e) => setTestTitle(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="relatedQuiz">Quiz: </label>
                    <select className="form-control" id="relatedQuiz" name="relatedQuiz"
                            value={quizId}
                            onChange={(e) => setQuizId(e.target.value)}>
                      {quizList.map((quiz) => {
                        return (
                            <option key={`${quiz.quizId}-opt`} value={quiz.quizId}>{quiz.quizTitle}</option>
                        )
                      })}
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="easyQuestionCount">Easy Question Count: </label>
                    <input type="number"
                           className="form-control"
                           name="easyQuestionCount"
                           id="easyQuestionCount"
                           value={easyQuestionCount}
                           onChange={(e) => setEasyQuestionCount(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="mediumQuestionCount">Medium Question Count: </label>
                    <input type="number"
                           className="form-control"
                           name="mediumQuestionCount"
                           id="mediumQuestionCount"
                           value={mediumQuestionCount}
                           onChange={(e) => setMediumQuestionCount(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="hardQuestionCount">Hard Question Count: </label>
                    <input type="number"
                           className="form-control"
                           name="hardQuestionCount"
                           id="hardQuestionCount"
                           value={hardQuestionCount}
                           onChange={(e) => setHardQuestionCount(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="startDate">Start Date: </label>
                    <input type="datetime-local"
                           className="form-control"
                           name="startDate"
                           id="startDate"
                           value={startDate}
                           onChange={(e) => setStartDate(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="endDate">End Date: </label>
                    <input type="datetime-local"
                           className="form-control"
                           name="endDate"
                           id="endDate"
                           value={endDate}
                           onChange={(e) => setEndDate(e.target.value)}
                    />
                  </div>

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
  )
}