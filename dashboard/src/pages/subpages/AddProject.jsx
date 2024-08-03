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
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function AddProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectBanner, setProjectBanner] = useState("");
  const [projectBannerPreview, setProjectBannerPreview] = useState("");
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [technologies, settechnologies] = useState("");
  const [stack, setStack] = useState("");
  const [deployed, setDeployed] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSvg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setProjectBanner(file);
      setProjectBannerPreview(reader.result);
    };
  };
  const handleAddNewProject = async (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append("projectBanner", projectBanner);
    body.append("title", title);
    body.append("description", description);
    body.append("projectLink", projectLink);
    body.append("gitRepoLink", gitRepoLink);
    body.append("deployed", deployed);
    body.append("technologies", technologies);
    body.append("stack", stack);
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/project/add`,
        body,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (data.success == false) {
        toast.error(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      toast.success(data.message);
    } catch (error) {
      if (error.response.status == 401 || error.response.status == 403) {
        dispatch(logout());
      }
      toast.error(error.response.data.message || error.message);
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen sm:gap-4 sm:py-4 sm:pl-14">
        <form
          className="w-screen px-5 md:w-[1000px]"
          onSubmit={handleAddNewProject}
        >
          <div className="space-y-12">
            <div className=" border-gray-900/10 pb-12">
              <h2 className="font-semibold leading-7 text-gray-900 text-3xl text-center uppercase">
                Add a new Project
              </h2>
              <div className="mt-10 flex flex-col gap-5">
                <div className="w-full sm:col-span-4">
                  <Label className="block text-sm font-medium leading-6 text-gray-900">
                    Title
                  </Label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Input
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
                  <Label className="block text-sm font-medium leading-6 text-gray-900">
                    Description
                  </Label>
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
                  <Label className="block text-sm font-medium leading-6 text-gray-900">
                    Technologies Used
                  </Label>
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
                  <Label className="block text-sm font-medium leading-6 text-gray-900">
                    Stack
                  </Label>
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
                  <Label className="block text-sm font-medium leading-6 text-gray-900">
                    Deployed
                  </Label>
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
                  <Label className="block text-sm font-medium leading-6 text-gray-900">
                    Github Repository Link
                  </Label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Input
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
                  <Label className="block text-sm font-medium leading-6 text-gray-900">
                    Project Link
                  </Label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Input
                        type="text"
                        placeholder="Paste Your Deployed Project Link"
                        value={projectLink}
                        onChange={(e) => setProjectLink(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="cover-photo"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Project Banner
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      {projectBannerPreview ? (
                        <img
                          className="mx-auto h-[250px] w-full text-gray-300"
                          viewBox="0 0 24 24"
                          src={projectBannerPreview && projectBannerPreview}
                        ></img>
                      ) : (
                        <ImageUp
                          aria-hidden="true"
                          className="mx-auto h-12 w-12 text-gray-300"
                        />
                      )}
                      <div className="mt-4 flex text-sm leading-6 text-gray-600 items-center justify-center">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            onChange={handleSvg}
                            type="file"
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="text-xs leading-5 text-gray-600">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <div className="flex justify-center items-center">
              <LoadingButton content={"Adding Project..."} width={"w-56"} />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <Button type="submit" className="w-56">
                Add Project
              </Button>
            </div>
          )}
        </form>
      </div>
    </>
  );
}

export default AddProject;
