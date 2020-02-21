import React, {useCallback, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import AudioPlayer from 'react-h5-audio-player';
import {isUndefined} from 'lodash';
import CircularAudioWave from './circular-audio-wave';

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

    const audioEl = useRef(null);
    const canvasEl = useRef(null);

    const next = useCallback(() =>
        setAudioIndex(!isUndefined(audioIndex) && audioIndex < AUDIO_FILES.length - 1 ? audioIndex + 1 :
            audioIndex), [audioIndex, AUDIO_FILES]);
    const prev = useCallback(() =>
        setAudioIndex(!isUndefined(audioIndex) && audioIndex > 0 ? audioIndex - 1 : audioIndex),
        [audioIndex]);

    // const onPlay = useCallback(() => {
    //     const audio = audioEl.current.audio;
    //     var canvas = canvasEl.current;
    //
    //     var context = new AudioContext();
    //     var src = context.createMediaElementSource(audio);
    //     var analyser = context.createAnalyser();
    //
    //     canvas.width = window.innerWidth;
    //     canvas.height = window.innerHeight;
    //     var ctx = canvas.getContext("2d");
    //
    //     src.connect(analyser);
    //     analyser.connect(context.destination);
    //
    //     analyser.fftSize = 256;
    //
    //     var bufferLength = analyser.frequencyBinCount;
    //     console.log(bufferLength);
    //
    //     var dataArray = new Uint8Array(bufferLength);
    //
    //     var WIDTH = canvas.width;
    //     var HEIGHT = canvas.height;
    //
    //     var barWidth = (WIDTH / bufferLength) * 2.5;
    //     var barHeight;
    //     var x = 0;
    //
    //     function renderFrame() {
    //         requestAnimationFrame(renderFrame);
    //
    //         x = 0;
    //
    //         analyser.getByteFrequencyData(dataArray);
    //
    //         ctx.fillStyle = "#000";
    //         ctx.fillRect(0, 0, WIDTH, HEIGHT);
    //
    //         for (var i = 0; i < bufferLength; i++) {
    //             barHeight = dataArray[i];
    //
    //             var r = barHeight + (25 * (i / bufferLength));
    //             var g = 250 * (i / bufferLength);
    //             var b = 50;
    //
    //             ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
    //             ctx.fillRect(x, HEIGHT - barHeight, barWidth, barHeight);
    //
    //             x += barWidth + 1;
    //         }
    //     }
    //
    //     renderFrame();
    // }, [audioIndex])

    const onPlay = useCallback(() => {
        const wave = new CircularAudioWave(canvasEl.current);
        wave.loadAudio(`music/${audio}`).then(() => wave.play());
    }, [audioIndex]);

    const audio = isUndefined(audioIndex) ? undefined : AUDIO_FILES[audioIndex];

    return (
        <>
            <div className="visualizer">
                <div id="chart-container" style={{width: "100%", height: "100%"}}>
                    <canvas ref={canvasEl}></canvas>
                </div>
            </div>

            <AudioPlayer src={`music/${audio}`}
                         ref={audioEl}
                         showSkipControls={true}
                         showJumpControls={false}
                         onClickPrevious={prev}
                         onClickNext={next}
                         onEnded={next}
                         onPlay={onPlay}/>

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
