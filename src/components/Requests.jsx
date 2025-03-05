import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect, useState } from "react";

const Requests = () => {
  const requests = useSelector((store) => store.requests) || [];
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  const reviewRequest = async (status, _id) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      
      console.log("API Response:", res.data);
      console.log("Removing request with ID:", _id);
      
      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  const fetchRequests = async () => {
    console.log("Fetching requests...");
    setLoading(true);
    try {
      const res = await axios.get(`${BASE_URL}/users/requests`, {
        withCredentials: true,
      });

      console.log("Response received:", res.data);
      if (res.data?.connectionRequest) {
        dispatch(addRequests(res.data.connectionRequest));
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching requests:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("useEffect triggered");
    fetchRequests();
  }, []);

  console.log("Current requests state:", requests);

  if (loading) return <h1 className="flex justify-center my-10">Loading...</h1>;
  
  if (!requests || requests.length === 0) {
    return <h1 className="flex justify-center my-10">No Requests Found</h1>;
  }

  return (
    <div className="text-center my-10">
      <h1 className="text-bold text-white text-3xl">Connection Requests</h1>
      
      {requests.map((request) => {
        console.log("Rendering request:", request);
        const user = request.fromUserId;
        const requestId = request._id;
        
        if (!user) {
          console.error("Missing user data for request:", request);
          return null;
        }
        
        return (
          <div
            key={requestId}
            className="flex justify-between items-center m-4 p-4 rounded-lg bg-base-300 mx-auto"
          >
            <div>
              <img
                alt="photo"
                className="w-20 h-20 rounded-full"
                src={user.photoURL}
              />
            </div>
            <div className="text-left mx-4">
              <h2 className="font-bold text-xl">{user.firstName + " " + user.lastName}</h2>
              {user.age && user.gender && <p>{user.age + ", " + user.gender}</p>}
              <p>{user.about}</p>
            </div>
            <div>
              <button
                className="btn btn-primary mx-2"
                onClick={() => reviewRequest("rejected", requestId)}
              >
                Reject
              </button>
              <button
                className="btn btn-secondary mx-2"
                onClick={() => reviewRequest("accepted", requestId)}
              >
                Accept
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Requests;