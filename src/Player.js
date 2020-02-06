import React, {useState} from 'react';

const Player = (props) => {
    return (
        <>
            <div className="visualizer">
                <div id="chart-container" style={{width: "100%", height: "100%"}}></div>
            </div>

            <audio className="playback" controls="controls">
                <source id="file" src="music/oo1.mp3"/>
                Your browser does not support the player. You still able to download tracks.
            </audio>

            <div className="playlist">
                <ul>
                    <li className="pl-item">
                        <a href="#"><img className="pl-icon" src="icons/speaker.svg"/></a>
                        <a className="song-name" href="?song=1">Song 001</a>
                        <span className="lenght">04:14</span>
                        <a href="#"><img className="pl-icon" src="icons/download.svg"/></a>
                    </li>
                    <li className="pl-item">
                        <a href="#"><img className="pl-icon" src="icons/play.svg"/></a>
                        <a className="song-name" href="?song=2">Song 002</a>
                        <span className="lenght">02:35</span>
                        <a href="#"><img className="pl-icon" src="icons/download.svg"/></a>
                    </li>
                    <li className="pl-item">
                        <a href="#"><img className="pl-icon" src="icons/play.svg"/></a>
                        <a className="song-name" href="?song=2">Song 002</a>
                        <span className="lenght">02:35</span>
                        <a href="#"><img className="pl-icon" src="icons/download.svg"/></a>
                    </li>
                    <li className="pl-item">
                        <a href="#"><img className="pl-icon" src="icons/play.svg"/></a>
                        <a className="song-name" href="?song=2">Song 002</a>
                        <span className="lenght">02:35</span>
                        <a href="#"><img className="pl-icon" src="icons/download.svg"/></a>
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Player;
