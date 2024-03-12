import { getReviewApiRoute } from "@/utils/apiRoutes";
import axios from "axios";
import { useEffect, useState } from "react";

const Explore = () => {
  const [place, setPlace] = useState("");
  const [reviews, setReviews] = useState([]);
  const [htmlRef, setHtmlRef] = useState("");

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    try {
      const res = await axios.get(getReviewApiRoute);
      console.log(res.data);
      setReviews(res.data.tips);
      setPlace(res.data.placeName);
      setHtmlRef(res.data.htmlRef.match(/href="(.*?)"/)[1]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="font-bold text-lg md:text-xl text-left">Reviews</h2>
          <br />
          <div className="border border-gray-300 rounded-md p-4 mb-4">
            <a
              href={htmlRef}
              target="_blank"
              className="text-purple-600 underline block mb-2"
            >
              {place}
            </a>
            <div className="reviews">
              {reviews.slice(0, 5).map((review, index) => (
                <div key={index} className="review">
                  <p className="font-semibold mb-1">Review {index + 1}:</p>
                  <p>{review}</p>
                </div>
              ))}
            </div>
          </div>
          <br />
        </div>
      </div>
    </div>
  );
};

export default Explore;
