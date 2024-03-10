import { useState, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { INavLink } from "@/types";
import { sidebarLinks } from "@/constants";
import { Button } from "@/components/ui/button";
import { Loader } from "lucide-react";
import axios from "axios";
import { toast } from "../ui/use-toast";

const LeftSidebar = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const accessToken = localStorage.getItem("accessToken");
      if (accessToken) {
        try {
          const res = await axios.get("http://localhost:3000/auth/userInfo", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          setUser(res.data.name);
          setEmail(res.data.email);
          // localStorage.setItem("Id", res.data._id);
          localStorage.setItem("name", res.data.name);
          localStorage.setItem("email", res.data.email);
          localStorage.setItem("profilePicture", res.data.photo);
        } catch (error) {
          toast({ title: "Error fetching user info" });
        }
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    // await axios.get("http://localhost:3000/auth/logout");
    // Clear local storage
    localStorage.removeItem("Id");
    localStorage.removeItem("name");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");

    navigate("/");
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.jpg"
            alt="logo"
            width={170}
            height={36}
          />
        </Link>

        {
          <Link to={`/profile`} className="flex gap-3 items-center">
            <img
              src={"/assets/icons/profile-placeholder.svg"}
              alt="profile"
              className="h-14 w-14 rounded-full"
            />
            <div className="flex flex-col">
              <p className="body-bold">{user ? user : "guest name"}</p>
              <p className="small-regular text-light-3">
                {email ? email : "guest email"}
              </p>
            </div>
          </Link>
        }

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={handleLogout}
      >
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
