import './App.css';
import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register, Login, Layout } from "./components";
import { AuthProvider } from "./context/AuthProvider";
import RequireAuth from "./components/RequireAuth";


class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <AuthProvider>
              <Routes>
                <Route path="/" element={<Layout/>}>
                  {/* public routes */}
                  <Route path="/unauthorized" element={<div>Unauthorized</div>}/>

                  <Route element={<RequireAuth allowedRoles={["Unauthenticated"]}/>}>
                    <Route path="/register" element={<Register/>}/>
                    <Route path="/login" element={<Login/>}/>
                  </Route>

                  {/*protected routes */}
                  <Route element={<RequireAuth allowedRoles={["Student", "Teacher"]}/>}>
                    <Route path="/profile" element={<div>Profile</div>}/>
                  </Route>

                  <Route element={<RequireAuth allowedRoles={["Student"]}/>}>
                    <Route path="/student" element={<div>Student</div>}/>
                  </Route>

                  <Route element={<RequireAuth allowedRoles={["Teacher"]}/>}>
                    <Route path="/teacher" element={<div>Teacher</div>}/>
                  </Route>

                  {/* catch all */}
                  <Route path="*" element={<div>Missing</div>}/>
                </Route>
              </Routes>
          </AuthProvider>
        </BrowserRouter>
    );
  }
}

export default App;
