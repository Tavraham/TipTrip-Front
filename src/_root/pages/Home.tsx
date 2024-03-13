import { useState, useEffect } from "react";
import PostCard from "@/components/shared/PostCard";
import axios from "axios";
import { getAllPostsRoute } from "@/utils/apiRoutes";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    getPosts();
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

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="font-bold text-lg md:text-xl text-left">Home feed</h2>
          {/* <br /> */}
          <ul className="flex flex-col gap-4 w-full">
            {posts.map((post: {_id: string; profilePic: string; name: string; description: string; photo: string}) => (
              <li key={post._id}>
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
