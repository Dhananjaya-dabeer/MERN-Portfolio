import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ResetPassword() {
  const [loading, setLoading] = useState(false);
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleReset = async () => {
    try {
      setLoading(true);
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/user/password/reset/${token}`,
        { password, confirmPassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.success == false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      toast.success(data.message);
      navigate("/login");
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
            <h1 className="text-3xl font-bold">reset password</h1>
            <p className="text-balance text-muted-foreground">
              Enter your new password
            </p>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Confirm Password</Label>
              </div>
              <Input
                id="password"
                type="password"
                value={confirmPassword}
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="cursor-default"
              />
            </div>
            {loading ? (
              <LoadingButton cotent={"Resetting..."} />
            ) : (
              <Button type="submit" className="w-full" onClick={handleReset}>
                Reset
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
export default ResetPassword;
