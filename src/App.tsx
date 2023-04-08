import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import NotFound from "./components/NotFound";
import FilmList from "./components/FilmList";
import FilmView from "./components/FilmView";

function App() {
  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
                <Route path="/films/:p" element={<FilmList/>}/>
                <Route path="/film/:id" element={<FilmView/>}/>
                <Route path="*" element={<NotFound/>}/>
            </Routes>
          </div>
        </Router>
      </div>
  );
}

export default App;
