import React, {useState, useEffect, useRef} from 'react';
import { findRegressionLine } from '../utils/linearRegression';
import SongCard from './songCard';
import './songAdder.css'
import {v4 as uuidv4} from 'uuid';

const LOCAL_STORAGE_KEY = 'bpmCounter'

const BPMCounterButton = () => {

    const RESET_TIME = 100000;

    const [taps, setTaps] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [bpmCount, setBpmCount] = useState("");
    const [resetTimerId, setResetTimerId] = useState(null);
    const [newSongs, setNewSongs] = useState([]);
    const [songObject, setSongObject] = useState([{title: "", artist: "", bpm: "", id: ""}]);

    const titleRef = useRef();
    const artistRef = useRef();
    const bpmRef = useRef();


    useEffect(() => {
        const storedSongs = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
        if (storedSongs) setNewSongs(storedSongs);
    }, [])

    useEffect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newSongs))
    }, [newSongs])

    const removeSong = (id) => {
        const filteredSongs = newSongs.filter((song) => song.id !== id);
        setNewSongs(filteredSongs);
    }

    const handleSubmit = () => {
        let title = titleRef.current.value;
        let artist = artistRef.current.value;
        let bpm = bpmRef.current.value;

        if (bpm === '') return (
            alert("You need a BPM to add a song")
        )

        setNewSongs(prevSongs => {
            return [...prevSongs, {title: title, artist: artist, bpm: bpm, id: uuidv4()}]
            
        })
        songObject.title = ""
        songObject.artist = ""
        reset();
    }


    const handleChange = e => {
        const {name, value} = e.target;
        setSongObject(prevState => ({
            ...prevState,
           [name]: value
        }))
    }

    const handleTap = ({timeStamp}) => {
        if (!startTime) {
            setStartTime(Date.now());
        }

        const tapsCount = taps.length;
        const timeDiff = startTime ? Date.now() - startTime : 0;

        setTaps([...taps, [tapsCount, timeDiff]]);
        setBpmCount(calculateBPM(taps));
        startResetTimer();
        setSongObject(songObject.bpm = bpmCount);
    }

    const startResetTimer = () => {
        clearTimeout(resetTimerId);
        const id = setTimeout(() => reset(), RESET_TIME);
        setResetTimerId(id);
    }

    const reset = () => {
        setBpmCount('');
        setTaps([]);
        setStartTime(null);
    }

    const calculateBPM = timestamps => {
        if (timestamps.length < 2) {
            return 0;
        }
        const sampleNumbers = timestamps.map(stamp => stamp[0]);
        const timeDiffs = timestamps.map(stamp => stamp[1]);
        const [a] = findRegressionLine(sampleNumbers, timeDiffs);
        return Math.round(60000 / a);
    };

    const multiplyBpm = () => {
        let multipliedBpm = (bpmCount * 2);
        console.log(multipliedBpm);
        setBpmCount(multipliedBpm);
    }

    const divideBpm = () => {
        let multipliedBpm = (bpmCount / 2);
        console.log(multipliedBpm);
        setBpmCount(multipliedBpm);
    }



    return(
        <div>
            <div className='form'>
                <p>&#127926;Tap the BPM button to the song of your choice to get the BPM&#127926;</p>
                <button onClick={handleTap} onChange={handleChange}>Tap for BPM</button><button className='resetBtn' onClick={reset}>Reset</button>
            <br/>
            <p>Multiply or divide your BPM</p>
            <button onClick={multiplyBpm}>x 2</button>
            <button onClick={divideBpm}>÷ 2</button>
            <form>
             <input className='bpmInput' placeholder='BPM' value={bpmCount} onChange={handleChange} ref={bpmRef} for="bpm" id="bpm" name="bpm"></input>
             <br/>
             <input placeholder='Song Title' value={songObject.title} onChange={handleChange} ref={titleRef} for="title" type="text" id="title" name="title"/>
             <br/>
             <input placeholder='Artist' value={songObject.artist} onChange={handleChange} ref={artistRef} type="text" for="artist" id="artist" name="artist"/>
             <br/>
             
            </form>
            <p>&#9193; Add title and artist to save the BPM for the future &#9194;</p>
            <button className='saveBtn' onClick={handleSubmit}>Save Song</button>
           </div>
           <SongCard songs={newSongs} removeSong={removeSong}/>
        </div>
        
    )

}

export default BPMCounterButton;