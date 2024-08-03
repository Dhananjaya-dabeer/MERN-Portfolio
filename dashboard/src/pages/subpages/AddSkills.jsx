import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { logout } from "@/store/slices/userSlices";
import axios from "axios";
import { ImageUp, PhoneOutgoingIcon } from "lucide-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function AddSkills() {
  const [title, setTitle] = useState("");
  const [proficiency, setProficiency] = useState("");
  const [svg, setSvg] = useState("");
  const [svgPreview, setSvgPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleSvg = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setSvg(file);
      setSvgPreview(reader.result);
    };
  };
  const handleAddNewSkill = async (e) => {
    e.preventDefault();
    const body = new FormData();
    body.append("title", title);
    body.append("proficiency", proficiency);
    body.append("svg", svg);

    console.log(svg);
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/skill/add`,
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
      setTitle("");
      setProficiency("");
      setSvg("");
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
          className="w-screen px-5 md:w-[650px]"
          onSubmit={handleAddNewSkill}
        >
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="font-semibold leading-7 text-gray-900 text-3xl text-center uppercase">
                Add a new Skill
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
                        placeholder="Matriculation"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <Label className="block text-sm font-medium leading-6 text-gray-900">
                    proficiency
                  </Label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Textarea
                        type="text"
                        placeholder="Timeling Description"
                        value={proficiency}
                        onChange={(e) => setProficiency(e.target.value)}
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
                    Skill Icon
                  </label>
                  <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      {svgPreview ? (
                        <img
                          className="mx-auto h-12 w-12 text-gray-300"
                          viewBox="0 0 24 24"
                          src={svgPreview && svgPreview}
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
            <LoadingButton content={"Adding Skill..."} />
          ) : (
            <Button type="submit" className="w-full">
              Add Skill
            </Button>
          )}
        </form>
      </div>
    </>
  );
}

export default AddSkills;
