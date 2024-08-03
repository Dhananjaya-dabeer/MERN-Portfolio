import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { logout, UpdateUser } from "@/store/slices/userSlices";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function UpdateProfile() {
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(user && user?.data?.fullName);
  const [email, setEmail] = useState(user && user?.data?.email);
  const [phone, setPhone] = useState(user && user?.data?.phone);
  const [aboutMe, setAboutMe] = useState(user && user?.data?.fullName);
  const [portfolioUrl, setPortfolioUrl] = useState(
    user && user?.data?.portfolioURL
  );
  const [linkedinUrl, setLinkedInUrl] = useState(
    user && user?.data?.linkedinURL
  );
  const [githubUrl, setGithubUrl] = useState(user && user?.data?.githubURL);
  const [instagramUrl, setInstagramUrl] = useState(
    user &&
      (user?.data?.instagramURL === undefined ? "" : user?.data?.instagramURL)
  );
  const [twitterUrl, setTwitterUrl] = useState(
    user &&
      (user?.data?.instagramURL === undefined ? "" : user?.data?.facebookURL)
  );
  const [facebook, setFacebookUrl] = useState(
    user &&
      (user?.data?.instagramURL === undefined ? "" : user?.data?.twitterURL)
  );
  const [avatar, setAvatar] = useState(
    user && user?.data?.avatar && user?.data?.avatar?.url
  );
  const [avatarPreview, setAvatarPreview] = useState(
    user && user?.data?.avatar && user?.data?.avatar?.url
  );
  const [resume, setResume] = useState(
    user && user?.data?.resume && user?.data?.resume?.url
  );
  const [resumePreview, setResumePreview] = useState(
    user && user?.data?.resume && user?.data?.resume?.url
  );

  const avatarHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setAvatarPreview(reader.result);
        setAvatar(file);
      };
    }
  };
  const resumeHandler = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setResumePreview(reader.result);
        setResume(file);
      };
    }
  };

  const hadnleUpdateProfile = async () => {
    const emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,6}$/;
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!emailRegex.test(email)) {
      toast.warn("Please enter a valid email id!");
      return;
    }
    if (!phoneRegex.test(phone)) {
      toast.warn("Please enter Indian number!");
      return;
    }
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("portfolioURL", portfolioUrl);
    formData.append("aboutMe", aboutMe);
    formData.append("linkedinURL", linkedinUrl);
    formData.append("githubURL", githubUrl);
    formData.append("instagramURL", instagramUrl);
    formData.append("twitterURL", twitterUrl);
    formData.append("facebookURL", facebook);
    formData.append("avatar", avatar);
    formData.append("resume", resume);
    try {
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/user/update/me`,
        formData,
        {
          withCredentials: true,
        }
      );
      const data = response.data;
      if (data.success == false) {
        setLoading(false);
        toast.error(data.message);
        return;
      }
      setLoading(false);
      dispatch(UpdateUser(data));
      toast.success("Portfolio Updated Successfully!");
    } catch (error) {
      setLoading(false);
      console.log(error.response.data.status);
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
              <h1 className="text-3xl font-bold">Update Profile</h1>
              <p className="mb-5">Update Your Profile</p>
            </div>
          </div>
          <div className="grid gap-6">
            <div className="flex items-start lg:justify-between lg:items-center flex-col lg:flex-row gap-5">
              <div className="grid gap-2 w-full sm:w-72">
                <Label>Profile Image</Label>
                <img
                  src={avatarPreview && avatarPreview}
                  alt="avatar"
                  className="w-full h-auto sm:w-72 sm:h-72 rounded-2xl"
                />
                <div className="relative">
                  <input
                    type="file"
                    className="avatar-update-btn"
                    onChange={avatarHandler}
                  />
                </div>
              </div>
              <div className="grid gap-2 w-full sm:w-72">
                <Label>Resume</Label>
                <img
                  src={resumePreview && resumePreview}
                  alt="resume"
                  className="w-full h-auto sm:w-72 sm:h-72 rounded-2xl"
                />
                <div className="relative">
                  <input
                    type="file"
                    className="avatar-update-btn"
                    onChange={resumeHandler}
                  />
                </div>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input
                type="text"
                defaultValue={user?.data?.fullName}
                placeholder="Your Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input
                type="email"
                defaultValue={user?.data?.email}
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input
                type="text"
                defaultValue={user?.data?.phone}
                placeholder="Your Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>About Me</Label>
              <Textarea
                defaultValue={user?.data?.aboutMe}
                placeholder="About Me"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Portfolio URL</Label>
              <Input
                defaultValue={user?.data?.portfolioURL}
                placeholder="Your Portfolio URL"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Github URL</Label>
              <Input
                defaultValue={user?.data?.githubURL}
                placeholder="Your Github Profile URL"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>LinkedIn URL</Label>
              <Input
                defaultValue={user?.data?.linkedinURL}
                placeholder="Your LinkedIn Profile URL"
                value={linkedinUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Instagram URL</Label>
              <Input
                defaultValue={user?.data?.instagramURL}
                placeholder="Your Instagram Profile URL"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Facebook URL</Label>
              <Input
                defaultValue={user?.data?.facebookURL}
                placeholder="Your Facebook Profile URL"
                value={facebook}
                onChange={(e) => setFacebookUrl(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Twitter(X) URL</Label>
              <Input
                defaultValue={user?.data?.twitterURL}
                onChange={(e) => setTwitterUrl(e.target.value)}
                placeholder="Your Twitter Profile URL"
                value={twitterUrl}
              />
            </div>
            <div className="grid gap-2">
              {!loading ? (
                <Button className="w-full" onClick={hadnleUpdateProfile}>
                  Update Profile
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

export default UpdateProfile;
