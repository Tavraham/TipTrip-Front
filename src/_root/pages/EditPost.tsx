import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import PostForm from "@/components/forms/PostForm";

const EditPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState({});
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function getPost() {
      try {
        const res = await axios.get(`http://localhost:3000/posts/postId/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });
        setPost(res.data);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error(error);
      }
    }

    getPost();
  }, [id]);

  // Render loading indicator if data is being fetched
  if (loading) {
    return <div>Loading...</div>;
  }

  // Render only if post data is available
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full ">
          <img
            src="/assets/icons/add-post.svg"
            alt="add"
            width={36}
            height={36}
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        <PostForm post={post} />
      </div>
    </div>
  );
};

export default EditPost;
