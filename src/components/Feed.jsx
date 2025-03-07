import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { useEffect, useState } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed) || [];
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0); // Track which profile is displayed

  // Fetch feed data only once
  const getFeed = async () => {
    if (feed.length > 0) return;

    try {
      const res = await axios.get(`${BASE_URL}/feed`, { withCredentials: true });
      if (Array.isArray(res.data.data)) {
        dispatch(addFeed(res.data.data));
      } else {
        console.error("Unexpected API response:", res.data);
      }
    } catch (err) {
      console.error("Error fetching feed:", err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

  // Move to next profile when a button is clicked
  const handleNextProfile = (userId) => {
    dispatch(removeUserFromFeed(userId)); // Remove user from Redux store
    setCurrentIndex((prevIndex) => prevIndex + 1); // Show next profile
  };

  if (!feed || feed.length === 0 || currentIndex >= feed.length) {
    return <h1 className="flex justify-center my-10 text-lg">No more users!</h1>;
  }

  return (
    <div className="flex justify-center my-10">
      <UserCard user={feed[currentIndex]} onNext={handleNextProfile} />
    </div>
  );
};

export default Feed;
