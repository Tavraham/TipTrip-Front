import React, { useState, useEffect } from "react";
import PostCard from "@/components/shared/PostCard";
import axios from "axios";
import { getAllPostsRoute, getReviewApiRoute } from "@/utils/apiRoutes";

function Home() {
  const [posts, setPosts] = useState([]);
  const [place, setPlace] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [htmlRef, setHtmlRef] = useState([]);

  useEffect(() => {
    getPosts();
    getReviw();
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

  const getReviw = async () => {
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
          <h2 className="h3-bold md:h2-bold text-left w-full">Home feed</h2>
          <br />
          <ul className="flex flex-col flex-1 gap-9 w-full">
            {
              <>
                <a
                  href={htmlRef}
                  target="_blank"
                  style={{ color: "purple", textDecoration: "underline" }}
                >
                  {place}
                </a>
                  <p>{reviews[0]}</p>
                
              </>
            }
          </ul>
          <br />
          <ul className="flex flex-col flex-1 gap-9 w-full">
            {posts.map((post) => (
              <li key={post} className="flex justify-center w-full">
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
