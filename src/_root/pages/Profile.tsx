import { Link, Outlet } from "react-router-dom";

import Loader from "@/components/shared/Loader";
import axios from "axios";
import { useState } from "react";
import PostCard from "@/components/shared/PostCard";

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
  // const { id } = useParams();
  const name = localStorage.getItem("name");
  const [posts, setPosts] = useState([]);

  async function getPostByName() {
    try {
      const res = await axios.get(
        `http://localhost:3000/posts/getPostByName/${name}`,
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
  getPostByName();

  if (!posts)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={
              localStorage.getItem("profilePicture") === "null"
                ? "/assets/icons/profile-placeholder.svg"
                : `http://localhost:3000/${localStorage.getItem(
                    "profilePicture"
                  )}`
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {name}
              </h1>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={posts.length} label="Posts" />
              <StatBlock
                value={localStorage.getItem("email") || ""}
                label={""}
              />
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <div>
              <Link
                to={`/update-profile/${name}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg `}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ul className="flex flex-col flex-1 gap-9 w-full">
        {posts.map((post) => (
          <li key={post} className="flex justify-center w-full">
            <PostCard post={post} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Profile;
