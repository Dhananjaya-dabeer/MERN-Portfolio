import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

function UpdateProfile() {
  const { user, loading, error, isUpdated, message } = useSelector(
    (state) => state.user
  );

  const dispatch = useDispatch();
  const [fullName, setFullName] = useState(user && user?.data.fullName);
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
              <Input type="text" defaultValue={user.data.fullName} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Email</Label>
              <Input type="email" defaultValue={user.data.email} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Phone</Label>
              <Input type="text" defaultValue={user.data.phone} disabled />
            </div>
            <div className="grid gap-2">
              <Label>About Me</Label>
              <Textarea defaultValue={user.data.aboutMe} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Portfolio URL</Label>
              <Input defaultValue={user.data.portfolioURL} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Github URL</Label>
              <Input defaultValue={user.data.githubURL} disabled />
            </div>
            <div className="grid gap-2">
              <Label>LinkedIn URL</Label>
              <Input defaultValue={user.data.linkedinURL} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Instagram URL</Label>
              <Input defaultValue={user.data.instagramURL} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Facebook URL</Label>
              <Input defaultValue={user.data.facebookURL} disabled />
            </div>
            <div className="grid gap-2">
              <Label>Twitter(X) URL</Label>
              <Input defaultValue={user.data.twitterURL} disabled />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default UpdateProfile;
