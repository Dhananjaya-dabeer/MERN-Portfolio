import { Button } from "@/components/ui/button";
import axios from "axios";
import {
  ExternalLink,
  Facebook,
  Github,
  Instagram,
  Linkedin,
  Twitter,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Typewriter } from "react-simple-typewriter";

function Hero() {
  const [user, setUser] = useState({});
  useEffect(() => {
    const getMyProfile = async () => {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/user/me/portfolio`,
        { withCredentials: true }
      );
      setUser(data.user);
    };

    getMyProfile();
  }, []);

  const ensureUrl = (url) => {
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return `https://${url}`;
    }
  };
  console.log(user);
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-2">
        <span className="bg-green-400 rounded-full h-2 w-2"></span>
        <p>Online</p>
      </div>
      <h1 className="overflow-x-hidden text-[1.3rem] sm:text-[1.7rem] md:text-[2.2rem] lg:text-[2.8rem] traacking=[2px] mb-4">
        Hey, I'm {user?.fullName}
      </h1>
      <h1 className="text-tubeLight-effect overflow-x-hidden text-[1.3rem] sm:text-[1.7rem] md:text-[2.2rem] lg:text-[2.8rem] tracking-[15px]">
        <Typewriter
          words={["frontend developer.", "Proficient in MERN stack"]}
          loop={true}
          typeSpeed={120}
          delaySpeed={60}
          deleteSpeed={200}
        />
      </h1>
      <div className="w-fit px-5 py-2 bg-slate-50 rounded-[20px] flex gap-5 items-center mt-4 md:mt-8 lg:mt-10">
        {user.instagramURL && (
          <Link to={ensureUrl(user.instagramURL)} target="_blank">
            <Instagram className="text-red-500 w-7 h-7" />
          </Link>
        )}
        {user.facebookURL && (
          <Link to={ensureUrl(user.facebookURL)} target="_blank">
            <Facebook className="text-pink-800 w-7 h-7" />
          </Link>
        )}
        {user.linkedinURL && (
          <Link to={ensureUrl(user.linkedinURL)} target="_blank">
            <Linkedin className="text-blue-800 w-7 h-7" />
          </Link>
        )}
        {user.twitterURL && (
          <Link to={ensureUrl(user.twitterURL)} target="_blank">
            <Twitter className="text-blue-600 w-7 h-7" />
          </Link>
        )}
      </div>
      <div className="mt-4 md:mt-8 lg:mt-10 flex gap-3">
        <Link to={user.githubURL} target="_blank">
          <Button className="rounded-[30px] flex items-center gap-2 flex-row">
            <span>
              <Github />
            </span>
            <span>Github</span>
          </Button>
        </Link>
        <Link to={user.resume && user.resume.url} target="_blank">
          <Button className="rounded-[30px] flex items-center gap-2 flex-row">
            <span>
              <ExternalLink />
            </span>
            <span>Resume</span>
          </Button>
        </Link>
      </div>
      <p className="mt-8 text-xl tracking-[2px]">{user.aboutMe}</p>
      <hr className="my-8 md:my-10" />
    </div>
  );
}

export default Hero;
