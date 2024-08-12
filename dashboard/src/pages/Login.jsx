import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  loginFailed,
  loginRequest,
  loginSuccess,
} from "@/store/slices/userSlices";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import LoadingButton from "@/components/LoadingButton";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginImage, setLoginImage] = useState("");
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      dispatch(loginRequest());

      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/user/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(data);
      if (data.success == false) {
        toast.error(data.message);
        dispatch(loginFailed(data.message));
      } else {
        dispatch(loginSuccess(data));
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response.data.message || error.message);
      dispatch(loginFailed("All fields are required!"));
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
    const loginImages = [
      "https://i.ibb.co/BPT2YPQ/account-login-flat-illustration-203633-1807.jpg",
      "https://i.ibb.co/nzMKt5y/digital-illustration-man-demonstrating-online-authentication-large-tablet-display-941526-2750.jpg",
      "https://i.ibb.co/rcnZMTz/digital-illustration-man-demonstrating-online-authentication-large-tablet-display-941526-3257.jpg",
      "https://i.ibb.co/j6qDj3s/login-concept-illustration-114360-739.jpg",
      "https://i.ibb.co/j6qDj3s/login-concept-illustration-114360-739.jpg",
      "https://i.ibb.co/j6qDj3s/login-concept-illustration-114360-739.jpg",
      "https://i.ibb.co/260HCr0/flat-illustration-secure-login-system-concept-1272652-230.jpg",
      "https://i.ibb.co/PtPpT4Z/3d-account-login-password-form-page-illustration-user-authorization-sign-account-authentication-page.jpg",
      "https://i.ibb.co/cCNwjvs/forgot-password-concept-illustration-713576-107.jpg",
      "https://i.ibb.co/2Pswr0n/illustration-welcome-message-mobile-wireframe-idea-with-showcasing-various-ui-elements-1278800-8029.jpg",
    ][Math.floor(Math.random() * 10)];
    setLoginImage(loginImages);
  }, []);

  return (
    <div className="w-full lg:grid lg:min-h-full lg:grid-cols-2 xl:min-h-screen">
      <div className=" min-h-screen flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  to="/password/forgot"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {loading ? (
              <LoadingButton content={"Loging in"} />
            ) : (
              <Button type="submit" className="w-full" onClick={handleLogin}>
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={loginImage}
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
