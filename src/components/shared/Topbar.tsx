import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useEffect } from "react";

const Topbar = () => {

  const navigate = useNavigate();



  const handleLogout = async () => {
    // await axios.get("http://localhost:3000/auth/logout");
    // Clear local storage
    localStorage.removeItem("Id");
    localStorage.removeItem("name");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    localStorage.removeItem("profilePicture");
    navigate("/");
  };

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 item-center">
          <img
            src="\assets\images\logo.jpg"
            alt="logo"
            width={130}
            height={325}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={handleLogout}
            >
            <img src="\assets\icons\logout.svg" alt="logout" />


          </Button>
          <Link to={`/profile`} className="flex gap-3 items-center">
            <img
              src={
                localStorage.getItem("profilePicture") === "null"
                  ? "/assets/icons/profile-placeholder.svg"
                  : `http://localhost:3000/${localStorage.getItem(
                      "profilePicture"
                    )}`
              }
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;
