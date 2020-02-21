import React, {useCallback, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import AudioPlayer from 'react-h5-audio-player';
import {isUndefined} from 'lodash';

import './player.css';

const PlayerItem = (props) => {
    const seconds = props.duration / 1000;

    return (
        <li className={classNames({"pl-item": true, "active": props.active})}>
            <img className="pl-icon speaker" src="icons/speaker.svg"/>
            <img className="pl-icon play" src="icons/play.svg" onClick={props.selectAudio}/>
            <span className="song-name" onClick={props.selectAudio}>{props.name.slice(0, props.name.length - 4)}</span>
            <span className="lenght">{parseInt(seconds / 60)}:{parseInt(seconds % 60)}</span>
            <a href={`music/${props.name}`} download><img className="pl-icon" src="icons/download.svg"/></a>
        </li>
    )
};

const Player = (props) => {
    const AUDIO_FILES = process.env.AUDIO_FILES || [];
    const AUDIO_DURATION = process.env.AUDIO_DURATION || [];

    const [audioIndex, setAudioIndex] = useState(AUDIO_FILES.length > 0 ? 0 : undefined);

    const next = useCallback(() =>
        setAudioIndex(!isUndefined(audioIndex) && audioIndex < AUDIO_FILES.length - 1 ? audioIndex + 1 :
            audioIndex), [audioIndex, AUDIO_FILES]);
    const prev = useCallback(() =>
        setAudioIndex(!isUndefined(audioIndex) && audioIndex > 0 ? audioIndex - 1 : audioIndex),
        [audioIndex]);

    const audio = isUndefined(audioIndex) ? undefined : AUDIO_FILES[audioIndex];

    return (
        <>
            <div className="visualizer">
                <div id="chart-container" style={{width: "100%", height: "100%"}}></div>
            </div>

            <AudioPlayer src={`music/${audio}`}
                         showSkipControls={true}
                         showJumpControls={false}
                         onClickPrevious={prev}
                         onClickNext={next}/>

            <div className="playlist">
                <ul>
                    {AUDIO_FILES.map((name, i) => <PlayerItem key={i}
                                                                          active={i === audioIndex}
                                                                          name={name}
                                                                          duration={AUDIO_DURATION[i]}
                                                                          selectAudio={e => setAudioIndex(i)}/>)}
                </ul>
            </div>
        </>
    );
};

export default Player;
