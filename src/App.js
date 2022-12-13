import logo from './logo.svg';
import './App.css';
import { Component, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Register, Navbar, Login } from "./components";

class App extends Component {
  render() {
    return (
        <BrowserRouter>
          <Navbar/>
          <div className={"App"}>
            <Routes>
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </div>
        </BrowserRouter>
    );
  }
}

export default App;
