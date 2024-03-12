import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { SigninValidation } from "@/lib/validation";
import { z } from "zod";
import Loader from "@/components/shared/Loader";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useEffect } from "react";
import { googleLoginRoute, loginRoute, refreshTokenRoute } from "@/utils/apiRoutes";

const SigninForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isLoading = false;

  useEffect(() => {
    checkAccessTokenExpiry();
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SigninValidation>) {
    try {
      const res = await axios.post(loginRoute, values);
      form.reset();
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      goHome(res.data.user);
    } catch (error: any) {
      console.error("Registration error:", error.message);
      if (error.response && error.response.data) {
        const responseData = error.response.data;
        console.log("Response data:", responseData);
        toast({ title: `Registration failed: ${responseData}` });
      } else {
        toast({ title: "Registration failed: Something went wrong." });
      }
    }
  }

  // Function to refresh token
  const refreshToken = async () => {
    try {
      const response = await axios.get(
        refreshTokenRoute,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("refreshToken")}`,
          },
        }
      );
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to check access token expiry and trigger refresh if needed
  const checkAccessTokenExpiry = async () => {
    console.log("Checking access token expiry");
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      console.log("Access token found");
      // Access token not found, maybe user is not logged in
      try {
        const decodedToken = jwtDecode(accessToken);
        if (!decodedToken || !decodedToken.exp) {
          // Token is invalid or doesn't contain an expiration claim
          throw new Error("Invalid token or missing expiration claim");
        }
        const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
        if (decodedToken.exp < currentTime) {
          console.log("Access token is expired");
          // Access token is expired, refresh it
          await refreshToken();
        }
        navigate("/home");
      } catch (error) {
        console.error(error);
      }
    }
    console.log("Access token not found");
  };

  const loginToGoogle = async (credentialResponse: CredentialResponse) => {
    const credentialDecoded = jwtDecode(credentialResponse.credential);
    const res = await axios.post(googleLoginRoute, {
      email: credentialDecoded.email,
      name: credentialDecoded.name,
    });
    localStorage.setItem("accessToken", res.data.accessToken);
    localStorage.setItem("refreshToken", res.data.refreshToken);
    goHome(res.data.user);
    console.log(res.data);
  };

  const goHome = async (user: {
    name: string;
    email: string;
    photo: string;
  }) => {
    localStorage.setItem("name", user.name);
    localStorage.setItem("email", user.email);
    localStorage.setItem("profilePicture", user.photo);
    navigate("/home");
  };

  return (
    <Form {...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img src="/assets/images/logo.jpg" alt="logo" />

        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12">
          Log In to your account
        </h2>
        <p className="text-light-3 small-medium md:base-regular mt-2">
          Welcome back, please enter your account details
        </p>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-5 w-full mt-4"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" className="shad-input" {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="shad-button_primary">
            {isLoading ? (
              <div className="flex-center gap-2">
                <Loader /> Loading...
              </div>
            ) : (
              "Sign in"
            )}
          </Button>
        </form>

        <GoogleLogin
          onSuccess={(credentialResponse) => {
            loginToGoogle(credentialResponse);
          }}
          onError={() => {
            console.log("Login Failed!");
          }}
        />

        <p className="text-small-regular text-light-2 text-center mt-2">
          Don't have an account ?
          <Link
            to="/sign-up"
            className="text-primary-500  text-small-semibold ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>
    </Form>
  );
};

export default SigninForm;
