import { useEffect, useState } from "react";
import axios from "axios";
import { getAccessToken } from "../common/jwtCommon";
import { useNavigate } from "react-router-dom";

export const Student = () => {
  const navigate = useNavigate();

  const [load, setLoad] = useState(false);
  const [error, setError] = useState('');

  const [newTakeId, setNewTakeId] = useState('');
  const [takeList, setTakeList] = useState([]);


  useEffect(() => {
    if(!load) {
      const onPageLoad = async () => {
        await loadPreviousTakes()
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

  const loadPreviousTakes = async () => {
    await axios.get(`api/take`,{
      headers: {
        Authorization: `Bearer ${getAccessToken()}`
      }
    }).then((response) => {
      if(response.status === 200) {
        setTakeList(response.data);
        console.log(response.data);
      } else {
        setError('Something went wrong');
      }
    }).catch((error) => {
      setError('Something went wrong');
    });
  }

  const takeTest = async () => {
    navigate(`/student/test/${newTakeId}`);
  }

  const BuildPreviousTakesTable = () => {
    return takeList.map((take) => {
      return (
        <tr key={take.id}>
          <td>{take.testTitle}</td>
          <td>{Math.round(take.successRate)}</td>
          <td>{Math.round(take.score*100)/100}</td>
        </tr>
      )
    })
  }

  return (
      <div className="container">
        <h1>Student Page</h1>
        <input name={"newTakeId"} className={"form-text"} value={newTakeId} onChange={(e) => setNewTakeId(e.target.value)}/> &nbsp;
        <button className={"btn btn-primary mb-2"} onClick={takeTest}> Take new test </button>
        <br/><br/>
        <div>
          <h3>Previous Tests</h3>
          <table className="table table-striped">
            <thead>
            <tr>
              <th scope="col">Test Title</th>
              <th scope="col">Success Rate</th>
              <th scope="col">Score</th>
            </tr>
            </thead>
            <tbody>
          <BuildPreviousTakesTable/>
            </tbody>
          </table>
        </div>
      </div>
  )
}