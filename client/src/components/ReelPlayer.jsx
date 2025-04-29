import { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faComment,
  faShare,
  faVolumeUp,
  faVolumeMute,
} from "@fortawesome/free-solid-svg-icons";

const ReelPlayer = ({ reel, isActive }) => {
  const [isPlaying, setIsPlaying] = useState(isActive);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-black">
      <video
        ref={videoRef}
        src={reel.media}
        className="w-full h-full object-cover"
        loop
        playsInline
        autoPlay={isActive}
        muted={isMuted}
        onClick={togglePlay}
      />
      <div className="absolute bottom-10 left-4 text-white">
        <div className="flex items-center mb-2">
          <img
            src={reel.user.avatar}
            alt={reel.user.username}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="font-semibold">{reel.user.username}</span>
        </div>
        <p className="text-sm">{reel.description}</p>
      </div>
      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center space-y-4 text-white">
        <button className="flex flex-col items-center">
          <FontAwesomeIcon icon={faHeart} className="text-2xl" />
          <span className="text-sm">{reel.likes.length}</span>
        </button>
        <button className="flex flex-col items-center">
          <FontAwesomeIcon icon={faComment} className="text-2xl" />
          <span className="text-sm">{reel.comments.length}</span>
        </button>
        <button className="flex flex-col items-center">
          <FontAwesomeIcon icon={faShare} className="text-2xl" />
          <span className="text-sm">Share</span>
        </button>
        <button onClick={toggleMute} className="flex flex-col items-center">
          <FontAwesomeIcon
            icon={isMuted ? faVolumeMute : faVolumeUp}
            className="text-2xl"
          />
        </button>
      </div>
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        {Math.floor(reel.duration / 60)}:
        {(reel.duration % 60).toString().padStart(2, "0")}
      </div>
    </div>
  );
};

export default ReelPlayer;
