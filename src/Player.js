import React, {useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import AudioPlayer from 'react-h5-audio-player';

import './player.css';

const PlayerItem = (props) => {
    const seconds = props.duration / 1000;

    return (
        <li className={classNames({"pl-item": true, "active": props.active})}>
            <img className="pl-icon" src="icons/speaker.svg" onClick={props.setAudio}/>
            <span className="song-name" onClick={props.setAudio}>{props.name.slice(0, props.name.length - 4)}</span>
            <span className="lenght">{parseInt(seconds / 60)}:{parseInt(seconds % 60)}</span>
            <a href={`music/${props.name}`} download><img className="pl-icon" src="icons/download.svg"/></a>
        </li>
    )
};

const Player = (props) => {
    const AUDIO_FILES = process.env.AUDIO_FILES || [];
    const AUDIO_DURATION = process.env.AUDIO_DURATION || [];

    const [audio, setAudio] = useState(AUDIO_FILES.length > 0 ? AUDIO_FILES[0] : undefined);

    return (
        <>
            <div className="visualizer">
                <div id="chart-container" style={{width: "100%", height: "100%"}}></div>
            </div>

            <AudioPlayer src={`music/${audio}`}/>

            <div className="playlist">
                <ul>
                    {AUDIO_FILES.map((name, i) => <PlayerItem key={i}
                                                                          active={name === audio}
                                                                          name={name}
                                                                          duration={AUDIO_DURATION[i]}
                                                                          setAudio={e => setAudio(name)}/>)}
                </ul>
            </div>
        </>
    );
};

export default Player;
