import { useNavigate } from "react-router-dom";

export const Unauthorized = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
      <section>
        <h1>Unauthorized</h1>
        <br/>
        <p>You dont have access to the resource</p>
        <button onClick={goBack}>Go Back</button>
      </section>
  )
}