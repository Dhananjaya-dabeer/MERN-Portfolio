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
  const { loading, isAuthenticated, error } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      dispatch(loginRequest());
      const { data } = await axios.post(
        `http://localhost:4000/api/v1/user/login`,
        { email, password },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (data.success === false) {
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
              <LoadingButton cotent={"Loging in"} />
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
          src="/placeholder.svg"
          alt="Image"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
