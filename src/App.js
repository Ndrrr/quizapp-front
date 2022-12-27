import './App.css';
import RequireAuth from "./components/auth/RequireAuth";

import { Component } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import {
  Register,
  Login,
  Layout,
  Unauthorized,
  Missing,
  Student,
  Teacher,
  Quiz,
  Test,
  TakeTest,
  CheckAnonymousTake
} from "./components";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Layout/>}>
                {/* public routes */}
                <Route path="/unauthorized" element={<Unauthorized/>}/>

                <Route element={<RequireAuth allowedRoles={["Unauthenticated"]}/>}>
                  <Route path="/register" element={<Register/>}/>
                  <Route path="/login" element={<Login/>}/>
                </Route>

                {/*protected routes */}
                <Route element={<RequireAuth allowedRoles={["Student", "Teacher"]}/>}>
                  <Route path="/profile" element={<div>Profile</div>}/>
                </Route>

                <Route element={<RequireAuth allowedRoles={["Student"]}/>}>
                  <Route path="/student/test/:testId" element={<TakeTest/>}/>
                  <Route path="/student/" element={<Student/>}/>
                </Route>

                <Route element={<RequireAuth allowedRoles={["Teacher"]}/>}>
                  <Route path="/teacher/quiz/:quizId/test/:testId/check/:anonymousId" element={<CheckAnonymousTake/>}/>
                  <Route path="/teacher/quiz/:quizId/test/:testId" element={<Test/>}/>
                  <Route path="/teacher/quiz/:id" element={<Quiz/>}/>
                  <Route path="/teacher/" element={<Teacher/>}/>
                </Route>

                {/* catch all */}
                <Route path="*" element={<Missing/>}/>
              </Route>
            </Routes>
          </AuthProvider>
        </BrowserRouter>
    );
  }
}

export default App;
