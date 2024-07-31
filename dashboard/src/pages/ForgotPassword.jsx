import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  let regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  const handleUpdatePassword = async () => {
    try {
      setLoading(true);
      const isEmailValid = regex.test(email);
      if (!isEmailValid) {
        toast.error("Please enter a valid email id!");
        setLoading(false);
        return;
      }
      const { data } = await axios.post(
        `http://localhost:4000/api/v1/user/password/forgot`,
        { email },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (data.success === false) {
        toast.error(data.message);
        setLoading(false);
        return;
      }
      toast.success(data.message);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error(error.response.data.message || error.message);
    }
  };
  return (
    <div className="w-full lg:grid lg:min-h-full lg:grid-cols-2 xl:min-h-screen">
      <div className=" min-h-screen flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Forgot password</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to get verification email
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
                  to="/login"
                  className="ml-auto inline-block text-sm underline"
                >
                  Remember your password?
                </Link>
              </div>
            </div>
            {loading ? (
              <LoadingButton content={"Requesting..."} />
            ) : (
              <Button
                type="submit"
                className="w-full"
                onClick={handleUpdatePassword}
              >
                Request to update
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

export default ForgotPassword;
