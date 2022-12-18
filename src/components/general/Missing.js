import { useNavigate } from "react-router-dom";

export const Missing = () => {
  const navigate = useNavigate();

  const goBack = () => navigate(-1);

  return (
      <section>
        <h1>Missing</h1>
        <br/>
        <p>Resource is not found</p>
        <button onClick={goBack}>Go Back</button>
      </section>
  )
}