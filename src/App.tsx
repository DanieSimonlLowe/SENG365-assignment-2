import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import NotFound from "./components/NotFound";
import FilmList from "./components/FilmList";
import FilmView from "./components/FilmView";
import RegisterPage from "./components/RegisterPage";
import useStore from "./store";

function App() {
    const userId = useStore(state => state.userId);

  return (
      <div className="App">
        <Router>
          <div>
            <Routes>
                {userId===-1?
                    <Route path="/register" element={<RegisterPage/>}/>
                :''}
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
