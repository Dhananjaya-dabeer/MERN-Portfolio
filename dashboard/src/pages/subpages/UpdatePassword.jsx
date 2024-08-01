import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { logout } from "@/store/slices/userSlices";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UpdatePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCurrentPasswordText, setIsCurrentPasswordText] = useState(false);
  const [isNewPasswordText, setIsNewPasswordText] = useState(false);
  const [isConfirmNewPasswordText, setIsConfirmNewPasswordText] =
    useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleUpdatePassword = async () => {
    try {
      const body = {
        currentPassword,
        newPassword,
        confirmNewPassword,
      };
      const response = await axios.put(
        "http://localhost:4000/api/v1/user/update/password",
        body,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = response.data;
      if (data.success == false) {
        setIsLoading(false);
        toast.error(data.message);
        return;
      }
      setIsLoading(false);
      toast.success(data.message || "Password Updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setIsCurrentPasswordText(false);
      setIsNewPasswordText(false);
      setIsConfirmNewPasswordText(false);
    } catch (error) {
      setIsLoading(false);
      if (error.response.status == 403 || error.response.status == 401) {
        navigate("/login");
        dispatch(logout());
      }
      toast.error(error.response.data.message || error.message);
    }
  };
  return (
    <>
      <div className="w-full h-full">
        <div>
          <div className="grid w-[100%] gap-6">
            <div className="grid gap-2">
              <h1 className="text-3xl font-bold">Update Password</h1>
              <p className="mb-5">Update Your Dashboard Password</p>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="grid gap-2">
              <Label>Current Password</Label>
              <div className="flex w-full justify-between items-center bg-white h-10 rounded-lg">
                <input
                  type={isCurrentPasswordText ? "text" : "password"}
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="outline-none border-none w-full pl-5"
                />
                {currentPassword !== "" &&
                  (!isCurrentPasswordText ? (
                    <EyeOff
                      onClick={() => setIsCurrentPasswordText(true)}
                      className="mr-5 cursor-pointer"
                    />
                  ) : (
                    <Eye
                      onClick={() => setIsCurrentPasswordText(false)}
                      className="mr-5 cursor-pointer"
                    />
                  ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>New Password</Label>
              <div className="flex w-full justify-between items-center bg-white h-10 rounded-lg">
                <input
                  type={isNewPasswordText ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="outline-none border-none w-full pl-5"
                />
                {newPassword !== "" &&
                  (!isNewPasswordText ? (
                    <EyeOff
                      onClick={() => setIsNewPasswordText(true)}
                      className="mr-5 cursor-pointer"
                    />
                  ) : (
                    <Eye
                      onClick={() => setIsNewPasswordText(false)}
                      className="mr-5 cursor-pointer"
                    />
                  ))}
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Confirm New Password</Label>
              <div className="flex w-full justify-between items-center bg-white h-10 rounded-lg">
                <input
                  type={isConfirmNewPasswordText ? "text" : "password"}
                  placeholder="Confirm New Password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="outline-none border-none w-full pl-5"
                />
                {confirmNewPassword !== "" &&
                  (!isConfirmNewPasswordText ? (
                    <EyeOff
                      onClick={() => setIsConfirmNewPasswordText(true)}
                      className="mr-5 cursor-pointer"
                    />
                  ) : (
                    <Eye
                      onClick={() => setIsConfirmNewPasswordText(false)}
                      className="mr-5 cursor-pointer"
                    />
                  ))}
              </div>
            </div>
            <div className="grid gap-2">
              {!isLoading ? (
                <Button className="w-full" onClick={handleUpdatePassword}>
                  Update Password
                </Button>
              ) : (
                <LoadingButton content={"Updating.."} />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdatePassword;
