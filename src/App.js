import React from 'react';
import {HashRouter} from "react-router-dom";

import Player from "./Player";

import './App.css';


function App() {
    return (
        <div>
            <HashRouter hashType="noslash">

                <div className="content">
                    <div className="top-menu">
                        <ul className="menu">
                          <li><a href="index.html">Music</a></li>
                          <li><a href="signup.html">Sign-Up for updates</a></li>
                          <li><a href="donate.html">Donate</a></li>
                          <li><a href="feedback.html">Feedback</a></li>
                          <li> <a class="soundcloud-link" href="https://soundcloud.com/sleepingaliencreature">SoundCloud</a> </li>
                        </ul>
                    </div>

                    <div className="logo">
                        sleepingaliencreature
                    </div>

                    <Player/>
                </div>

                <footer className="footer">
                  <a href="feedback.html">Created by sleepingaliencreature 2020</a>
                </footer>

            </HashRouter>
        </div>
    );
}

export default App;
