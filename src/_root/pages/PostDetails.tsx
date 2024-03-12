import { createCommentRoute, getPostRoute, host } from "@/utils/apiRoutes";
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

interface Comment {
  user: string;
  comment: string;
}

const PostDetails = () => {
  const { id } = useParams();
  const [post, setPost] = useState({
    name: "",
    description: "",
    photo: "",
    profilePic: "",
    comments: [] as Comment[],
  });
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    async function getPost() {
      try {
        const res = await axios.get(
          `${getPostRoute}/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
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

  async function addComment() {
    const comment = prompt("Enter your comment");
    const user = localStorage.getItem("name");
    await axios.put(
      `${createCommentRoute}/${id}`,
      { comment, user },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    window.location.reload();
  }

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="post-card">
          <div className="flex-between">
            <div className="flex items-center gap-3">
              <Link to={``}>
                <img
                  src={
                    !post.profilePic
                      ? "/assets/icons/profile-placeholder.svg"
                      : `${host}/${post.profilePic}`
                  }
                  alt="creator"
                  className="rounded-full w-12 lg:h:12"
                />
              </Link>
              <div className="flex flex-col">
                <p className="base-medium lg:body-bold text-light-1">
                  {post.name}
                </p>
              </div>
            </div>
          </div>
          <Link to={``}>
            <div className="small-medium lg:base-medium py-5">
              <p>{post.description}</p>
              <ul className="flex gap-1 mt-2"></ul>
            </div>
            <img
              src={`${host}/${post.photo}`}
              className="post-card_img"
              alt="post image"
            />
          </Link>
          <div className="flex justify-center">
            {" "}
            <button
              className="bg-blue-500 text-white rounded p-2"
              onClick={addComment}
            >
              Add comment
            </button>
          </div>
          <ul className="flex flex-col flex-1 gap-9 w-full">
            {post.comments.map((comment, index) => (
              <li key={index} className="">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{comment.user}</span>:
                  <p className="ml-2">{comment.comment}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;
