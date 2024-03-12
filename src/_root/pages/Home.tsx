import React, { useState, useEffect } from "react";
import PostCard from "@/components/shared/PostCard";
import axios from "axios";
import { getAllPostsRoute, getReviewApiRoute } from "@/utils/apiRoutes";

function Home() {
  const [posts, setPosts] = useState([]);
  // const [place, setPlace] = useState([]);
  // const [reviews, setReviews] = useState([]);
  // const [htmlRef, setHtmlRef] = useState([]);

  useEffect(() => {
    getPosts();
    // getReviw();
  }, []);

  const getPosts = async () => {
    try {
      const res = await axios.get(getAllPostsRoute, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      // Store the fetched posts in the state
      setPosts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // const getReviw = async () => {
  //   try {
  //     const res = await axios.get(getReviewApiRoute);
  //     console.log(res.data);
  //     setReviews(res.data.tips);
  //     setPlace(res.data.placeName);
  //     setHtmlRef(res.data.htmlRef.match(/href="(.*?)"/)[1]);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="font-bold text-lg md:text-xl text-left">Home feed</h2>
          {/* <br />
          <div className="border border-gray-300 rounded-md p-4 mb-4">
            <a
              href={htmlRef}
              target="_blank"
              className="text-purple-600 underline block mb-2"
            >
              {place}
            </a>
            <div className="review">
              <p className="font-semibold mb-1">Review:</p>
              <p>{reviews[0]}</p>
            </div>
          </div> */}
          {/* <br /> */}
          <ul className="flex flex-col gap-4 w-full">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
  
}

export default Home;
