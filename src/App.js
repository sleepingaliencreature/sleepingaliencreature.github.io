import React from 'react';
import './App.css';
import Player from "./Player";

function App() {
    return (
        <div>

            <div className="content">
                <div className="top-menu">
                    <ul className="menu">
                        <li><a href="">Music</a></li>
                        <li><a href="">About</a></li>
                        <li><a href="">Sign-up for updates</a></li>
                        <li><a href="">Donate</a></li>
                        <li><a href="">Contact</a></li>
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
