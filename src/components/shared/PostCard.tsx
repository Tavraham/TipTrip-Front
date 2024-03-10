import { log } from "console";
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
              {/* {localStorage.getItem("name")} */}
              post.
            </p>
          </div>
        </div>
        <Link
          to={`/update-post/${post.$id}`}
          // className={`${localStorage.getItem("Id") !== post.creator.$id && "hidden"}`}
        >
          <img src="\assets\icons\edit.svg" alt="edit" width={20} height={20} />
        </Link>
      </div>
      <Link to={`/posts/${post.$id}`}>
        <div className="small-medium lg:base-medium py-5">
          <p>
            {localStorage.getItem("caption")}
          </p>
          <ul className="flex gap-1 mt-2"></ul>
        </div>
        <img
          src={post.imageUrl || "/assets/icons/profile-placeholder.svg"}
          className="post-card_img"
          alt="post image"
        />
      </Link>
    </div>
  );
};

export default PostCard;
