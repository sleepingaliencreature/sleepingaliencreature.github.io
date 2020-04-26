import React, {useCallback, useEffect, useRef, useState} from 'react';
import classNames from 'classnames';
import AudioPlayer from 'react-h5-audio-player';
import {isUndefined} from 'lodash';
import echarts from 'echarts';
import {useHistory, useLocation} from "react-router-dom";
import copy from 'copy-to-clipboard';

import './player.css';


const PlayerItem = (props) => {
    const seconds = props.duration / 1000;
    const name = props.path.slice(0, props.path.length - 4);

    const copyLink = useCallback((e, name) => {
        copy(`${process.env.PUBLIC_URL}/#${name}`);
        e.preventDefault();
        alert("Link to track was copied to clipboard");
    }, []);

    return (
        <li className={classNames({"pl-item": true, "active": props.active})}>
            <img alt="" className="pl-icon speaker" src="icons/speaker.svg"/>
            <img alt="" className="pl-icon play" src="icons/play.svg" onClick={props.selectAudio}/>
            <span className="song-name" onClick={props.selectAudio}>{name}</span>
            <span className="lenght">{parseInt(seconds / 60)}:{parseInt(seconds % 60)}</span>
            <a href={`#${name}`} onClick={e => copyLink(e, name)}>
                <img alt="" className="pl-icon" src="icons/link.svg"/>
            </a>
            <a href={`music/${props.path}`} download><img alt="" className="pl-icon" src="icons/download.svg"/></a>
        </li>
    )
};

let maxChartValue = 240;
let minChartValue = 100;

const defaultChartOption = {
    angleAxis: {
        type: 'value',
        clockwise: false,
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    radiusAxis: {
        min: 0,
        max: maxChartValue + 50,
        axisLine: {
            show: false,
        },
        axisTick: {
            show: false,
        },
        axisLabel: {
            show: false,
        },
        splitLine: {
            show: false,
        },
    },
    polar: {
        radius: '100%',
    },
    series: [{
        coordinateSystem: 'polar',
        name: 'line',
        type: 'line',
        showSymbol: false,
        lineStyle: {
            color: {
                colorStops: [{
                    offset: 0.7,
                    color: '#e91e63'
                },
                    {
                        offset: 0.3,
                        color: '#3f51b5'
                    }
                ],
            },
            shadowColor: 'blue',
            shadowBlur: 10,
        },
        zlevel: 2,
        data: Array.apply(null, {
            length: 361
        }).map(Function.call, i => {
            return [minChartValue, i];
        }),
        silent: true,
        hoverAnimation: false,
    },
        {
            coordinateSystem: 'polar',
            name: 'maxbar',
            type: 'line',
            showSymbol: false,
            lineStyle: {
                color: '#87b9ca',
                shadowColor: '#87b9ca',
                shadowBlur: 10,
            },
            data: Array.apply(null, {
                length: 361
            }).map(Function.call, i => {
                return [minChartValue, i];
            }),
            silent: true,
            hoverAnimation: false,
        },
        {
            coordinateSystem: 'polar',
            name: 'interior',
            type: 'effectScatter',
            showSymbol: false,
            data: [0],
            symbolSize: 100,
            rippleEffect: {
                period: 3.5,
                scale: 3,
            },
            itemStyle: {
                color: {
                    type: 'radial',
                    colorStops: [{
                        offset: 0,
                        color: '#87b9ca'
                    }, {
                        offset: 1,
                        color: 'white'
                    }],
                },
            },
            silent: true,
            hoverAnimation: false,
            animation: false,
        },
    ]
};

function _generateWaveData(data, chartOption) {
    let waveData = [];
    let dd = [];
    let maxR = 0;

    for (let i = 0; i < 180; i += 2) {
        // (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
        // let freq = (data[i*2 + 10] + data[i*2 + 1 + 10]) / 2.0;
        const freq = data[i + 10];
        var r = (((freq - 0) * (maxChartValue - minChartValue)) / (255 - 0)) + minChartValue;
        if (r > maxR) {
            maxR = r;
        }
        // waveData.push([r, i]);
        dd.push(r)
    }

    const a = dd;
    const b = a.slice().reverse();

    dd = b.concat(a).concat(b).concat(a);

    waveData = dd.map((v, i) => [v, i]);

    // for (let i = 0; i <= 180; i++) {
    //     waveData.push([dd[i], i]);
    // }
    // for (let i = 181; i <= 360; i++) {
    //     waveData.push([dd[360 - i], i]);
    // }
    waveData.push([waveData[0][0], 360]);
    return {
        maxR: maxR,
        data: waveData
    };
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

    const analyserRef = useRef();
    const chartRef = useRef();

    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        const audio = audioEl.current.audio;

        if (location.pathname !== "/") {
            history.replace("/");
            const i = AUDIO_FILES.indexOf(location.pathname.slice(1) + ".mp3");
            if (i >= 0) {
                setTimeout(() => {
                    audio.play().catch(e => console.log("Can't autostart playing"));
                    setAudioIndex(i);
                }, 500);
            }
        }
    }, [location.pathname, AUDIO_FILES, history]);

    const getAnalyser = () => {
        if (analyserRef.current) {
            return analyserRef.current;
        }

        const audio = audioEl.current.audio;

        const context = new AudioContext();
        const src = context.createMediaElementSource(audio);
        const analyser = context.createAnalyser();

        // let lowpass = context.createBiquadFilter();
        // lowpass.type = "lowpass";
        // // lowpass.settar
        // lowpass.frequency.setValueAtTime(200, 0);
        // lowpass.Q.setValueAtTime(1, 0);
        //
        // src.connect(lowpass);
        //
        // let highpass = context.createBiquadFilter();
        // highpass.type = "highpass";
        // highpass.frequency.setValueAtTime(150, 0);
        // highpass.Q.setValueAtTime(1, 0);
        // lowpass.connect(highpass);
        // highpass.connect(context.destination);

        // chartOption.series[0].animation = false;
        // chartOption.series[2].rippleEffect.period = 150 / 120;

        src.connect(analyser);
        analyser.connect(context.destination);

        analyser.smoothingTimeConstant = 0.9;
        analyser.fftSize = 2048;

        analyserRef.current = analyser;

        return analyser;
    };

    const getChart = () => {
        if (chartRef.current) {
            return chartRef.current;
        }

        const canvas = canvasEl.current;
        const chart = echarts.init(canvas);

        chartRef.current = chart;

        return chart;
    };

    const onPlay = useCallback(() => {
        const playing = true;

        if (!isUndefined(window.AudioContext)) {
            const chart = getChart();
            const chartOption = JSON.parse(JSON.stringify(defaultChartOption));
            let lastMaxR = 0;

            const analyser = getAnalyser();

            function renderFrame() {
                const bufferLength = analyser.frequencyBinCount;
                const freqData = new Uint8Array(bufferLength);
                analyser.getByteFrequencyData(freqData);
                let waveData = _generateWaveData(freqData, chartOption);
                chartOption.series[0].data = waveData.data;

                if (waveData.maxR > lastMaxR) {
                    lastMaxR = waveData.maxR + 4;
                } else if (playing) {
                    lastMaxR -= 2;
                } else {
                    lastMaxR = minChartValue;
                }

                // maxbar
                chartOption.series[1].data = Array.apply(null, {
                    length: 361
                }).map(Function.call, (i) => {
                    return [lastMaxR, i];
                });
                chart.setOption(chartOption, true);

                requestAnimationFrame(renderFrame);
            }

            renderFrame();
        }
    }, []);

    const audio = isUndefined(audioIndex) ? undefined : AUDIO_FILES[audioIndex];

    return (
        <>
            <div className="visualizer">
                {isUndefined(window.AudioContext) && <div><img alt="" src="wave.gif" /></div>}
                {!isUndefined(window.AudioContext) && <div id="chart-container" style={{width: "100%", height: "100%"}}
                                                           ref={canvasEl}></div>}
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
                    {AUDIO_FILES.map((path, i) => <PlayerItem key={i}
                                                                          active={i === audioIndex}
                                                                          path={path}
                                                                          duration={AUDIO_DURATION[i]}
                                                                          selectAudio={e => setAudioIndex(i)}/>)}
                </ul>
            </div>
        </>
    );
};

export default Player;
