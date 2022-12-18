import { Link } from "react-router-dom";
import { getRole, removeAccessToken } from "../../common/jwtCommon";
import useAuth from "../../hooks/useAuth";

export const Navbar = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    await removeAccessToken();
    setAuth({});
    window.location.reload();
  }

  const changeMode = () => {
    document.getElementById("root").classList.toggle("dark-mode");
  }

  const homeLink = (
      <li className="nav-item" key="home">
        <Link to="/" className="nav-link">
          Home
        </Link>
      </li>
  )

  const changeModeLink = (
      <li className="nav-item" key="chmode">
        <button id="dark-mode-button" onClick={changeMode} style={{background: "transparent"}}>
          <img width={"20px"} height={"20px"} src={"/images/darkmode.png"} alt={"Dark mode icon"}/>
        </button>
      </li>
  )

  const loginLink = (
      <li className="nav-item" key="login">
        <Link to="/login" className="nav-link">
          Login
        </Link>
      </li>
  )
  const registerLink = (
      <li className="nav-item" key="register">
        <Link to="/register" className="nav-link">
          Register
        </Link>
      </li>
  )

  const profileLink = (
      <li className="nav-item" key="profile">
        <Link to="/profile" className="nav-link">
          Profile
        </Link>
      </li>
  )

  const logoutLink = (
      <li className="nav-item" key="logout">
        <a href="#" onClick={logout} className="nav-link">
          Logout
        </a>
      </li>
  )

  const studentLink = (
      <div id={"student-link"}>
        <li className="nav-item" key="student">
          <Link to="/student" className="nav-link">
            Dashboard
          </Link>
        </li>
      </div>
  )

  const teacherLink = (
      <div id={"teacher-link"}>
        <li className="nav-item" key="teacher">
          <Link to="/teacher" className="nav-link">
            Dashboard
          </Link>
        </li>
      </div>
  )

  const BuildNavbar = () => {
    const role = getRole();
    let links = [];
    links.push(homeLink);
    if (role) {
      links.push(profileLink);
      if (role === "Student") {
        links.push(studentLink);
      } else if (role === "Teacher") {
        links.push(teacherLink);
      }
      links.push(logoutLink);
    } else {
      links.push(loginLink);
      links.push(registerLink);
    }
    links.push(changeModeLink);
    return links;
  }

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
          <span className="navbar-toggler-icon"/>
        </button>

        <div
            className="collapse navbar-collapse justify-content-md-center"
            id="main-navbar"
        >
          <ul className="navbar-nav" id="navbar-list">
            <BuildNavbar/>
          </ul>
        </div>
      </nav>
  )
}