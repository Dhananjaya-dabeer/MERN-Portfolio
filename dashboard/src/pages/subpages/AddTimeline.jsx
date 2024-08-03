import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { logout } from "@/store/slices/userSlices";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

function AddTimeline() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleTimeline = async (e) => {
    e.preventDefault();
    const body = {
      title,
      description,
      from,
      to,
    };
    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/timeline/add`,
        body,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = response.data;
      if (data.success == false) {
        setLoading(false);
        toast.error(data.message);
      }
      setDescription("");
      setTitle("");
      setFrom("");
      setTo("");
      setLoading(false);
      toast.success(data.message || "Added timeline successfully");
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
        <form className="w-screen px-5 md:w-[650px]" onSubmit={handleTimeline}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="font-semibold leading-7 text-gray-900 text-3xl text-center uppercase">
                Add a new timeline
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
                    Description
                  </Label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Textarea
                        type="text"
                        placeholder="Timeling Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <Label className="block text-sm font-medium leading-6 text-gray-900">
                    From
                  </Label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Input
                        type="date"
                        placeholder="Starting Period"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full sm:col-span-4">
                  <Label className="block text-sm font-medium leading-6 text-gray-900">
                    To
                  </Label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-inset focus-within:ring-indigo-600">
                      <Input
                        type="date"
                        placeholder="Ending Period"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {loading ? (
            <LoadingButton content={"Adding Timeline..."} />
          ) : (
            <Button type="submit" className="w-full">
              Add Timeline
            </Button>
          )}
        </form>
      </div>
    </>
  );
}

export default AddTimeline;
