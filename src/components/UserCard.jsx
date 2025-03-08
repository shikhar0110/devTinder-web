import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";

const UserCard = ({ user }) => {
  if (!user) return null;

  const { _id, firstName, lastName, photoURL, age, gender, about } = user;
  const dispatch = useDispatch();

  const handleSendRequest = async (status, userId) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${userId}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      console.error("Error sending request:", err);
    }
  };

  return (
    <div className="card w-80 h-[500px] bg-base-100 shadow-xl rounded-xl overflow-hidden">
      {/* Full-Height Image */}
      <figure className="w-full h-3/5">
        <img src={photoURL} alt={firstName} className="w-full h-full object-cover" />
      </figure>

      {/* Card Body */}
      <div className="card-body flex flex-col justify-between p-4">
        <div>
          <h2 className="card-title text-lg font-bold">{firstName || "Unknown User"}</h2>
          <p className="text-sm text-gray-500">{age && gender ? `${age}, ${gender}` : "Age & gender not available"}</p>
{/* <p className="text-sm">{about || "No information available"}</p> */}
        </div>

        {/* Buttons */}
        <div className="card-actions flex justify-between mt-3">
          <button className="btn btn-outline btn-error flex-1" onClick={() => handleSendRequest("ignored", _id)}>
            Ignore
          </button>
          <button className="btn btn-primary flex-1" onClick={() => handleSendRequest("interested", _id)}>
            Interested
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
