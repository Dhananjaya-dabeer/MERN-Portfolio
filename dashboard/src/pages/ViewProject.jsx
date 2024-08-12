import { Button } from "@/components/ui/button";
import { logout } from "@/store/slices/userSlices";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ViewProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectBanner, setProjectBanner] = useState("");
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [technologies, settechnologies] = useState("");
  const [stack, setStack] = useState("");
  const [deployed, setDeployed] = useState("");
  const { id } = useParams();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        setIsPageLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/project/get/${id}`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        if (data.success == false) {
          setIsPageLoading(false);
          toast.error(data.message || "Internal Error");
          return;
        }
        console.log(data);
        setIsPageLoading(false);
        setTitle(data.data.title);
        setDescription(data.data.description);
        setProjectBanner(
          data.data.projectBanner && data.data.projectBanner.url
        );
        setGitRepoLink(data.data.gitRepoLink);
        setProjectLink(data.data.projectLink);
        settechnologies(data.data.technologies);
        setStack(data.data.stack);
        setDeployed(data.data.deployed);
      } catch (error) {
        setIsPageLoading(false);
        toast.error(error.response.data.message || error.message);
        if (error.response.status == 401 || error.response.status == 403) {
          dispatch(logout());
        }
      }
    })();
  }, []);

  const descriptionInListFormat = description.split(". ");
  const technologiesInListFormat = technologies.split(", ");

  return !isPageLoading ? (
    <div className="flex justify-center items-center min-h-screen sm:gap-4 sm:py-4 sm:pl-14">
      <div className="w-screen px-5 md:w-[1000px]">
        <div className="space-y-12">
          <div className=" border-gray-900/10 pb-12">
            <div className="mt-10 flex flex-col gap-5">
              <div className="w-full sm:col-span-4">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="font-semibold leading-7 text-gray-900 text-3xl text-center uppercase">
                    View Project
                  </h2>
                  <Link to={"/manage/projects"}>
                    <Button>Return to Projects</Button>
                  </Link>
                </div>
                <h1 className="text-2xl font-bold mb-4">{title}</h1>
                <img
                  src={projectBanner && projectBanner}
                  alt={title}
                  className="w-full h-auto"
                />
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Description:</p>
                <ul className="list-disc">
                  {descriptionInListFormat.map((item, index) => {
                    return <li key={index}>{item}</li>;
                  })}
                </ul>
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Technologies:</p>
                <ul className="list-disc">
                  {technologiesInListFormat.map((item, index) => {
                    return <li key={index}>{item}</li>;
                  })}
                </ul>
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Stack:</p>
                {stack}
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Deplyed:</p>
                {deployed}
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Github Repository Link:</p>
                {gitRepoLink}
              </div>
              <div className="w-full sm:col-span-4">
                <p className="text-2xl mb-2">Project Link:</p>
                <Link
                  to={projectLink ? projectLink : "/"}
                  target="_blank"
                  className="text-sky-700"
                >
                  {projectLink ? projectLink : "Still Not Deplyed"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="w-screen h-screen flex justify-center items-center">
      <img src={import.meta.env.VITE_LOADER} alt="" className="w-16 h-16" />
    </div>
  );
}

export default ViewProject;
