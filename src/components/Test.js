import { useEffect, useState } from "react";
import {Link, useParams} from "react-router-dom";
import axios from "axios";
import { getAccessToken } from "../common/jwtCommon";

const clearArray = (array) => {
  while(array.length > 0) {
    array.pop();
  }
  return array;
}

export const Test = () => {

  const { quizId, testId } = useParams()

  const [load, setLoad] = useState(false);
  const [anonymousResults, setAnonymousResults] = useState([]);
  const [checkedQuizResults, setCheckedQuizResults] = useState([]);
  const [explicit, setExplicit] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    if(!load) {
      const onPageLoad = async () => {
        await loadAnonymousIds().then((data) => {
          clearArray(anonymousResults);
          data.forEach(item => anonymousResults.push(item))

          console.log(anonymousResults);
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

  const loadAnonymousIds = async () => {
    return await axios.get(`api/Test/${testId}/takes?anonymous=true`,{
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

  const loadCheckedQuizResults = async () => {
    return await axios.get(`api/Test/${testId}/takes?anonymous=false`,{
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      if(response.status === 200) {
        setCheckedQuizResults(response.data);
        return response.data;
      } else {
        setError('Something went wrong');
      }
    }).catch((error) => {
      setError('Something went wrong');
    })
  }

  const BuildAnonymousResultsList = () => {
    console.log(anonymousResults);
    return anonymousResults.map((anonymousData) => {
      return (
          <div key={anonymousData.anonymousId}>
            <Link className={"list-group-item list-group-item-action list-group-item-info"}
                  to={`check/${anonymousData.anonymousId}`}>Anonymous ID: {anonymousData.anonymousId}
              &nbsp; <span className={"text-danger"}>({anonymousData.isReviewed ? 'Reviewed' : 'Not Reviewed'})</span></Link>
          </div>
      )
    })
  }

  const BuildAnonymousView = () => {
    return (
        <div>
          <h1>Anonymous Results</h1>
          <div className="list-group">
            <BuildAnonymousResultsList />
            {anonymousResults.filter((res) => res.isReviewed === false).length === 0 &&
                <div>
                  <p>All students are reviewed </p>
                  <button className="btn btn-primary" onClick={() => loadCheckedQuizResults() && setExplicit(true)}>Show Explicit Results</button>
                </div>
            }
          </div>
        </div>
    )
  }

  const BuildExplicitResultsList = () => {
    return checkedQuizResults.map((result) => {
      return (
          <tr key={result.id}>
            <td>{result.fullName}</td>
            <td>{result.successRate}</td>
            <td>{result.score}</td>
          </tr>
      )
    })
  }

  const BuildExplicitView = () => {
    return  (
        <div>
          <h1>Explicit Results</h1>
          <div className="list-group">
            <table className="table table-striped">
              <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Success Rate</th>
                <th scope="col">Score</th>
              </tr>
              </thead>
              <tbody>
              <BuildExplicitResultsList/>
              </tbody>
            </table>
            <button className="btn btn-primary" onClick={() => setExplicit(false)}>Hide Explicit Results</button>
          </div>
        </div>
    )
  }

  return (
      <div className="container">
        <h1>Test Page - {testId}</h1>
        <br/><br/>
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        {explicit && <BuildExplicitView />}
        {!explicit && <BuildAnonymousView />}
      </div>
  )
}