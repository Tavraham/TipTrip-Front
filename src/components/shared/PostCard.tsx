import { Link } from "react-router-dom";

const PostCard = ({ post }) => {
  return (
    <div className="post-card">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={""}>
            {/* `/profile/${post.creator.$id}` */}
            <img
              src={
                post?.creator?.imageUrl ||
                "/assets/icons/profile-placeholder.svg"
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
        <Link
          to={`/update-post/${post._id}`}
          className={`${localStorage.getItem("name") !== post.name && "hidden"}`}
        >
          <img src="\assets\icons\edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>
            {post.description}
          </p>
          <ul className="flex gap-1 mt-2"></ul>
        </div>
        <img
          // src={post.photo || "/assets/icons/profile-placeholder.svg"}
          src={`http://localhost:3000/${post.photo}`}
          className="post-card_img"
          alt="post image"
        />
      </Link>
    </div>
  );
};

export default PostCard;
