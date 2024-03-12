import { Link } from "react-router-dom";
import Loader from "@/components/shared/Loader";
import axios from "axios";
import { useState, useEffect } from "react";
import PostCard from "@/components/shared/PostCard";
import { changeProfilePictureRoute, getPostByNameRoute, host, changeNameRoute } from "@/utils/apiRoutes";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  // const name = localStorage.getItem("name");
  const [posts, setPosts] = useState([]);
  const [name, setName] = useState<string>(() => localStorage.getItem("name") || '');

  useEffect(() => {
    async function getPosts() {
      try {
        const res = await axios.get(
          `${getPostByNameRoute}/${name}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        setPosts(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    getPosts();
  }, [name]);

  const changePicture = async (event) => {
    try {
      const formData = new FormData();
      formData.append("name", name || "");
      formData.append("file", event.target.files[0]);
      const res = await axios.put(
        changeProfilePictureRoute,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      localStorage.setItem("profilePicture", res.data.photo);

      window.location.reload();
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  const changeName = async () => {
    try {
      const newName = prompt("Enter your new name:");
      if (!newName) return; // If user cancels the prompt, do nothing
  
      const res = await axios.put(
        changeNameRoute,
        { name, newName }, // Send the current name and the new name in the request body
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
  
      // Update the name in localStorage with the new name returned from the server
      localStorage.setItem("name", res.data.newName);
  
      // Update the name displayed in the UI
      setName(res.data.newName);
  
      // Optionally, you can reload the page to reflect the name change immediately
      window.location.reload();
    } catch (error) {
      console.error("Error changing name:", error);
    }
  };
  
  


  if (!posts)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        {/* Profile details */}
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          {/* Profile picture */}
          <img
            src={
              localStorage.getItem("profilePicture") === "null"
                ? "/assets/icons/profile-placeholder.svg"
                : `${host}/${localStorage.getItem(
                    "profilePicture"
                  )}`
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          {/* Upload profile picture */}
          <label htmlFor="upload-photo" className="cursor-pointer">
            <img
              src={"/assets/icons/edit.svg"}
              alt="edit"
              width={20}
              height={20}
            />
            <input
              type="file"
              id="upload-photo"
              className="hidden"
              onChange={changePicture}
            />
          </label>
          {/* Profile information */}
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {name}
              </h1>
            </div>
            {/* User stats */}
            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={posts.length} label="Posts" />
              <StatBlock
                value={localStorage.getItem("email") || ""}
                label={""}
              />
            </div>
          </div>
          {/* Edit name button */}
          <div className="flex justify-center gap-4">
            <div>
              <button
                onClick={changeName}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg `}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Name
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Display user's posts */}
      <ul className="flex flex-col flex-1 gap-9 w-full">
        {posts.map((post) => (
          <li key={post.id} className="flex justify-center w-full">
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
