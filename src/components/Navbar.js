import { Link } from "react-router-dom";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const logout = () => {
  cookies.remove("access_token");
}

const changeMode = () => {
  document.getElementById("root").classList.toggle("dark-mode");
}

const commons = (
    <li>
      <button id="dark-mode-button" onClick={changeMode} style={{background: "transparent"}}>
        <img width={"20px"} height={"20px"} src={"/images/darkmode.png"} alt={"Dark mode icon"}/>
      </button>
    </li>
)

const loginRegLink = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </li>
      <li className="nav-item">
        <Link to="/register" className="nav-link">
          Register
        </Link>
      </li>
      {commons}
    </ul>
)

const userLink = (
    <ul className="navbar-nav">
      <li className="nav-item">
        <Link to="/profile" className="nav-link">
          User
        </Link>
      </li>
      <li className="nav-item">
        <a href="" onClick={logout} className="nav-link">
          Logout
        </a>
      </li>
      {commons}
    </ul>
)


export const Navbar = () => {
  return (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark">
        <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#main-navbar"
            aria-controls="main-navbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div
            className="collapse navbar-collapse justify-content-md-center"
            id="main-navbar"
        >
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
          </ul>
          {cookies.get('accessToken') ? userLink : loginRegLink}
        </div>
      </nav>
  )
}