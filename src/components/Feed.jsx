import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addFeed } from "../utils/feedSlice";
import { useEffect } from "react";
import UserCard from "./UserCard";

const Feed = () => {
  const feed = useSelector((store) => store.feed) || [];
  const dispatch = useDispatch();

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
  }, [feed]);

  if (feed.length === 0) return <h1 className="flex justify-center my-10">No new users found!</h1>;

  return (
    <div className="flex flex-wrap gap-4 justify-center my-10">
      {feed.map((user) => (
        <UserCard key={user._id} user={user} />
      ))}
    </div>
  );
};

export default Feed;
