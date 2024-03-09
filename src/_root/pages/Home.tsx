import React, { useState, useEffect } from "react";
import PostCard from "@/components/shared/PostCard";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/posts/getAllPosts", {
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

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home feed</h2>
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
