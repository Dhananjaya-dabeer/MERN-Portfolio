import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { logout } from "@/store/slices/userSlices";
import axios from "axios";
import { ImageUp, PhoneOutgoingIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function ViewProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectBanner, setProjectBanner] = useState("");
  const [projectBannerPreview, setProjectBannerPreview] = useState();
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [technologies, settechnologies] = useState("");
  const [stack, setStack] = useState("");
  const [deployed, setDeployed] = useState("");
  const { id } = useParams();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const dispatch = useDispatch();

  const handleProjectBannerPreview = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProjectBanner(file);
      setProjectBannerPreview(reader.result);
    };
  };

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
        setProjectBannerPreview(
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

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const body = new FormData();
      body.append("projectBanner", projectBanner);
      body.append("title", title);
      body.append("description", description);
      body.append("projectLink", projectLink);
      body.append("gitRepoLink", gitRepoLink);
      body.append("deployed", deployed);
      body.append("technologies", technologies);
      body.append("stack", stack);

      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/project/update/${id}`,
        body,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (data.success == false) {
        setUpdating(false);
        toast.error(data.message || "Internal Error");
        return;
      }
      setUpdating(false);
      toast.success(data.message || "Project Updated!");
    } catch (error) {
      setUpdating(false);
      toast.error(error.response.data.message || error.message);
      if (error.response.status == 401 || error.response.status == 403) {
        dispatch(logout());
      }
    }
  };

  return !isPageLoading ? (
    <>
      <div className="flex justify-center items-center min-h-screen sm:gap-4 sm:py-4 sm:pl-14">
        <form
          className="w-screen px-5 md:w-[1000px]"
          onSubmit={handleUpdateProject}
        >
          <div className="space-y-12">
            <div className=" border-gray-900/10 pb-12">
              <div className="flex justify-between items-center">
                <h2 className="font-semibold leading-7 text-gray-900 text-3xl text-center uppercase">
                  Update Project
                </h2>
                <Link to={"/manage/projects"}>
                  <Button>Return to Projects</Button>
                </Link>
              </div>
              <div className="mt-10 flex flex-col gap-5">
                <div className="w-full sm:col-span-4">
                  <img
                    src={projectBannerPreview && projectBannerPreview}
                    alt="ProjectBanner"
                    className="w-full h-auto"
                  />
                  <div className="relative">
                    <input
                      type="file"
                      onChange={handleProjectBannerPreview}
                      className="avatar-update-btn mt-4 w-full"
                    />
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        placeholder="Project Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Textarea
                        placeholder="Feature 1.   Feature 2.   Feature 3."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Technologies Used
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Textarea
                        placeholder="HTML, CSS, JavaScript, TailwindCSS"
                        value={technologies}
                        onChange={(e) => settechnologies(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Stack
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Select
                        value={stack}
                        onValueChange={(selectedValue) =>
                          setStack(selectedValue)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project Stack"></SelectValue>
                          <SelectContent>
                            <SelectItem value="Full Stack">
                              Full Stack
                            </SelectItem>
                            <SelectItem value="MERN">MERN</SelectItem>
                            <SelectItem value="MEAN">MEAN</SelectItem>
                            <SelectItem value="MEVN">MEVN</SelectItem>
                            <SelectItem value="Next.JS">Next.JS</SelectItem>
                            <SelectItem value="React.JS">React.JS</SelectItem>
                          </SelectContent>
                        </SelectTrigger>
                      </Select>
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Deployed
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Select
                        value={deployed}
                        onValueChange={(selectedValue) =>
                          setDeployed(selectedValue)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Is This Project Deployed?"></SelectValue>
                          <SelectContent>
                            <SelectItem value="Yes">Yes</SelectItem>
                            <SelectItem value="No">No</SelectItem>
                          </SelectContent>
                        </SelectTrigger>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Github Repository Link
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        placeholder="Paste Your Github Repository Link Here"
                        value={gitRepoLink}
                        onChange={(e) => setGitRepoLink(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Project Link
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <input
                        type="text"
                        placeholder="Paste Your Deployed Project Link"
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center w-full items-center">
            {updating ? (
              <div className="flex justify-center items-center">
                <LoadingButton content={"Updating Project..."} width={"w-56"} />
              </div>
            ) : (
              <button
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 w-52"
                onClick={handleUpdateProject}
              >
                Update
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  ) : (
    <div className="w-screen h-screen flex justify-center items-center">
      <img src={import.meta.env.VITE_LOADER} alt="" className="w-16 h-16" />
    </div>
  );
}

export default ViewProject;
