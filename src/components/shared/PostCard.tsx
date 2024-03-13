import { deletePostRoute, host } from "@/utils/apiRoutes";
import axios from "axios";
import { Link } from "react-router-dom";

const PostCard = ({ post }: { post: {_id: string; profilePic: string; name: string; description: string; photo: string}  }) => {
  function deletePost() {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (confirmDelete) {
      axios
        .delete(`${deletePostRoute}/${post._id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        })
        .then((res) => {
          console.log(res);
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  return (
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
            <p className="base-medium lg:body-bold text-light-1">{post.name}</p>
          </div>
        </div>
        <Link
          to={`/update-post/${post._id}`}
          className={`${
            localStorage.getItem("name") !== post.name && "hidden"
          }`}
        >
          <img src="\assets\icons\edit.svg" alt="edit" width={20} height={20} />
        </Link>
        <button
          onClick={deletePost}
          className={`${
            localStorage.getItem("name") !== post.name && "hidden"
          }`}
        >
          <img
            src="\assets\icons\delete.svg"
            alt="more"
            width={20}
            height={20}
          />
        </button>
      </div>
      <Link to={`/post/${post._id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>{post.description}</p>
          <ul className="flex gap-1 mt-2"></ul>
        </div>
        <img
          // src={post.photo || "/assets/icons/profile-placeholder.svg"}
          src={`${host}/${post.photo}`}
          className="post-card_img"
          alt="post image"
        />
      </Link>
    </div>
  );
};

export default PostCard;
