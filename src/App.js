import React from 'react';
import './App.css';
import Player from "./Player";

function App() {
    return (
        <div>

            <div className="content">
                <div className="top-menu">
                    <ul className="menu">
                      <li><a href="index.html">Music</a></li>
                      <li><a href="about.html">About</a></li>
                      <li><a href="signup.html">Sign-Up for updates</a></li>
                      <li><a href="donate.html">Donate</a></li>
                      <li><a href="feedback.html">Feedback</a></li>
                    </ul>
                </div>

                <div className="logo">
                    sleepingaliencreature
                </div>

                <Player/>
            </div>

            <footer className="footer">
                <a href="#">Created by sleepingaliencreature 2020</a>
            </footer>

        </div>
    );
}

export default App;
