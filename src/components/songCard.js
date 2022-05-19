import React from "react";
import Flip from "react-reveal/Flip";
import './songCard.css';
import {IoIosTrash} from "react-icons/io";

const SongCard = ({songs, removeSong}) => {

  const deleteSong = (id) => {
    removeSong(id);
  }

  return (
    <div>
      {songs.map((song) => (
        <Flip top>
          <div className="card">
        <p className="emoji">&#127926;</p>
        <p className="title">{song.artist.length > 0 ? song.artist : "Very Secret Artist"}</p>
        <p className="artist">{song.title.length > 0 ? song.title : "the nameless song"}</p>
        <p className="bpm">{song.bpm} BPM</p>
        <button className="deleteBtn" icon="fa-solid fa-xmark" onClick={() => deleteSong(song.id)}><IoIosTrash className="trashIcon"/></button>
        <br/>
        </div>
        </Flip>
      ))}
    </div>
  );
};

export default SongCard;
