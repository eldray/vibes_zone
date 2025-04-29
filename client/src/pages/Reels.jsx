import { useState, useEffect } from "react";
import ReelPlayer from "../components/ReelPlayer";

const Reels = () => {
  const [reels, setReels] = useState([
    {
      _id: "1",
      media:
        "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
      user: {
        username: "cryptoqueen",
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      },
      description: "Exploring NFTs #DigitalArt",
      likes: [1, 2, 3],
      comments: [1],
      duration: 60,
    },
    {
      _id: "2",
      media:
        "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_2mb.mp4",
      user: {
        username: "beatsmith",
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      },
      description: "New track vibes #Music",
      likes: [1],
      comments: [],
      duration: 45,
    },
  ]);
  const [currentReel, setCurrentReel] = useState(0);

  useEffect(() => {
    const handleTouch = (e) => {
      const touchY = e.touches[0].clientY;
      let startY;

      const handleTouchStart = (e) => {
        startY = e.touches[0].clientY;
      };

      const handleTouchEnd = () => {
        if (startY - touchY > 100) {
          setCurrentReel((prev) => Math.min(prev + 1, reels.length - 1));
        } else if (touchY - startY > 100) {
          setCurrentReel((prev) => Math.max(prev - 1, 0));
        }
      };

      window.addEventListener("touchstart", handleTouchStart);
      window.addEventListener("touchend", handleTouchEnd);

      return () => {
        window.removeEventListener("touchstart", handleTouchStart);
        window.removeEventListener("touchend", handleTouchEnd);
      };
    };

    window.addEventListener("touchmove", handleTouch);
    return () => window.removeEventListener("touchmove", handleTouch);
  }, [reels.length]);

  return (
    <div className="h-[calc(100vh-4rem)]">
      {reels.map((reel, index) => (
        <ReelPlayer
          key={reel._id}
          reel={reel}
          isActive={index === currentReel}
        />
      ))}
    </div>
  );
};

export default Reels;
