import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import './App.css';
import NotFound from "./components/NotFound";
import FilmList from "./components/FilmList";
import FilmView from "./components/FilmView";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage"
import NavBar from "./components/NavBar"
import useStore from "./store";
import LogoutPage from "./components/LogoutPage";
import CreateFilm from "./components/CreateFilm";
import EditFilm from "./components/EditFilm"

function App() {
    const userId = useStore(state => state.userId);

    return (
        <div className="App">

             <Router>
                 <NavBar/>
                {userId===-1?
                    <div>
                        <Routes>

                          <Route path="/register" element={<RegisterPage/>}/>
                          <Route path="/login" element={<LoginPage/>}/>
                          <Route path="/films/:p" element={<FilmList/>}/>
                          <Route path="/film/:id" element={<FilmView/>}/>
                          <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </div>
              :   <div>
                      <Routes>
                          <Route path="/film/create" element={<CreateFilm/>}/>
                          <Route path="/logout" element={<LogoutPage/>}/>
                          <Route path="/films/:p" element={<FilmList/>}/>
                          <Route path="/film/:id" element={<FilmView/>}/>
                          <Route path="/edit/:id" element={<EditFilm/>}/>
                          <Route path="*" element={<NotFound/>}/>
                      </Routes>
                  </div>}
            </Router>
        </div>
    );
}

export default App;
