import React, {useEffect, useRef, useState} from 'react';
import classNames from 'classnames';

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

const AudioPlayer = ({audio}) => {
    const audioEl = useRef(null);

    useEffect(() => {
            if(!audioEl.current.paused) {
                audioEl.current.pause();
                audioEl.current.load();
                audioEl.current.play();
            }
    }, [audio]);

    return (
        <audio ref={audioEl} className="playback" controls="controls">
            <source id="file" src={`music/${audio}`}/>
            Your browser does not support the player. You still able to download tracks.
        </audio>
    );
};

const Player = (props) => {
    const [audio, setAudio] = useState(process.env.AUDIO_FILES[0]);

    return (
        <>
            <div className="visualizer">
                <div id="chart-container" style={{width: "100%", height: "100%"}}></div>
            </div>

            <AudioPlayer audio={audio}/>

            <div className="playlist">
                <ul>
                    {process.env.AUDIO_FILES.map((name, i) => <PlayerItem key={i}
                                                                          active={name === audio}
                                                                          name={name}
                                                                          duration={process.env.AUDIO_DURATION[i]}
                                                                          setAudio={e => setAudio(name)}/>)}
                </ul>
            </div>
        </>
    );
};

export default Player;
