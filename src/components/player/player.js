import { useEffect, useState } from "react";
import useSound from "use-sound";
import Music from "../../assets/Pehle Bhi Main(PagalWorld.com.cm).mp3";
import Photo from "../../assets/download.jpg";
import { CgPlayButtonR  } from "react-icons/cg";
import {  GiPauseButton  } from "react-icons/gi";
import { GiPreviousButton, GiNextButton  } from "react-icons/gi";
import { IconContext } from "react-icons";
import './player.css'

export default function Player() {
  const [Playing, setPlaying] = useState(false);
  const [AudioList, setAudioList] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [soundUrl, setSoundUrl] = useState(Music);
  const [play, { pause, duration, sound }] = useSound(soundUrl);
  const [time, setTime] = useState({  min: "", sec: "", });
  const [currTime, setCurrTime] = useState({ min: "", sec: "",
  });

  const [seconds, setSeconds] = useState();
  

  useEffect(() => {
    if (duration) {
      const timeLag = duration / 1000;
      const minutes = Math.floor(timeLag / 60);
      const secRemain = Math.floor(timeLag % 60);
      setTime({
        min: minutes,
        sec: secRemain,
      });
    }
  }, [Playing]);

  
  const playSelected = (index) => {
    const selectedTrack = AudioList[index];
    setCurrTime({
      min: "0",
      sec: "0",
    });
    setSeconds(0);
    setCurrentIndex(index);
    localStorage.setItem("lastPlayingTrack", selectedTrack.src);
    setSoundUrl(selectedTrack?.src);
    setPlaying(true);
  };
  useEffect(() => {
    const storedAudioList = JSON.parse(localStorage.getItem("AudioList")) || [];
    setAudioList(storedAudioList);

    const lastPlayingTrack = localStorage.getItem("lastPlayingTrack");

    const lastPlayingTrackIndex = storedAudioList.findIndex(
      (track) => track.src === lastPlayingTrack
    );
    if (lastPlayingTrackIndex !== -1) {
      setCurrentIndex(lastPlayingTrackIndex);
      setSoundUrl(AudioList[lastPlayingTrackIndex]?.src); 
    }
  }, []);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const newAudioList = files.map((file) => ({
      src: URL.createObjectURL(file),
      name: file.name,
    }));
    setAudioList([...AudioList, ...newAudioList]);
    localStorage.setItem(
      "AudioList",
      JSON.stringify([...AudioList, ...newAudioList])
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (sound) {
        setSeconds(sound.seek([]));
        const min = Math.floor(sound.seek([]) / 60);
        const sec = Math.floor(sound.seek([]) % 60);
        setCurrTime({
          min,
          sec,
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [sound]);

  const playingButton = () => {
    if (Playing) {
      pause();
      setPlaying(false);
    } else {
      play();
      setPlaying(true);
    }
  };

  const handlePlayNextTrack = () => {
    const nextTrackIndex = (currentIndex + 1) % AudioList.length;
    setCurrentIndex(nextTrackIndex);
    localStorage.setItem("lastPlayingTrack", AudioList[nextTrackIndex].src);
  };

  return (
    <div>
      <div className="container">
        <div>
      <h2 style={{color:"white"}}>Playing Now</h2>
      <img className="banner" src={Photo} />
      <div>
        <div className="title">
          {AudioList
            .filter((track, index) => index === currentIndex)
            .map((track, index) => (
              <p key={index} style={{color:"white"}}>{track.name}</p>
            ))}
        </div>
      </div>
      <div>
        <div className="time">
          <p>
            {currTime.min}:{currTime.sec}
          </p>
          <p>
            {time.min}:{time.sec}
          </p>
        </div>
        <input
          type="range"
          min="0"
        
          style={{  width:'380px'}}
          max={duration / 1000}
          default="0"
          value={seconds}
          className="timeline"
          onChange={(e) => {
            sound.seek([e.target.value]);
          }}
        />
      </div>
      
      <div className="buttonsContainer">
        <button className="button">
          <IconContext.Provider value={{ size: "3em", color: "rgb(250, 250, 165)" }}>
          <GiPreviousButton />
          </IconContext.Provider>
        </button>
        {!Playing ? (
          <button className="button" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "rgb(250, 250, 165)" }}>
            <CgPlayButtonR />
            </IconContext.Provider>
          </button>
        ) : (
          <button className="button" onClick={playingButton}>
            <IconContext.Provider value={{ size: "3em", color: "rgb(250, 250, 165)" }}>
            <GiPauseButton />
            </IconContext.Provider>
          </button>
        )}
        <button className="button" onClick={handlePlayNextTrack}>
          <IconContext.Provider value={{ size: "3em", color: "rgb(250, 250, 165)" }}>
          <GiNextButton />
          </IconContext.Provider>
        </button>

        </div>
        </div>
        <div>
          <div>
          <input
          style={{color:"rgb(14, 36, 53)", backgroundColor:"grey", borderRadius:"5px", padding:'2px'}}
          
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            multiple
          />

          <ul>
            {AudioList.map((track, index) => (
              <li key={index} onClick={() => playSelected(index)} className="list-items">
                {track.name}
              </li>
            ))}
          </ul>

          </div>
         
        </div>
        {/* <AudioPlayer/> */}
    
    </div>
<div className="audioPlayer">
<audio src={AudioList[currentIndex]?.src} controls onEnded={handlePlayNextTrack} />

</div>
    </div>
  );
}
