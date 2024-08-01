import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  getAllMessagesFail,
  getAllMessagesRequest,
  getAllMessagesSuccess,
  getAllMessagesDeleteSuccess,
} from "@/store/slices/messageSlices";
import { logout } from "@/store/slices/userSlices";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Messages() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleReturnToDashboard = () => {
    navigate("/");
  };

  const { messages } = useSelector((state) => state.messages);
  const [messageId, setMessageId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch(getAllMessagesRequest());
        const response = await axios.get(
          "http://localhost:4000/api/v1/message/getall",
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        const data = response.data;
        console.log(data);
        if (data.success == false) {
          toast.error(data.message);
          dispatch(getAllMessagesFail());
          return;
        }
        dispatch(getAllMessagesSuccess(data.data));
      } catch (error) {
        toast.error(error.response.data.message || error.message);
        if (error.response.status == 403 || error.response.status == 401) {
          dispatch(logout()), navigate("/login");
        }
        dispatch(getAllMessagesFail());
      }
    };
    fetchData();
  }, []);

  const handleElementDelete = async (id) => {
    setMessageId(id);
    try {
      setIsLoading(true);
      const response = await axios.delete(
        `http://localhost:4000/api/v1/message/delete/${id}`,
        { withCredentials: true }
      );
      const data = response.data;
      if (data.success == false) {
        toast.error(data.message || "Error occoured during delete");
        setIsLoading(false);
        return;
      }
      let filteredData = messages.filter((item) => item._id !== id);
      dispatch(getAllMessagesDeleteSuccess(filteredData));
      setIsLoading(false);
      toast.success(data.message || "Message deleted successfully");
    } catch (error) {
      toast.error(error.response.data.message || error.message);
      if (error.response.status == 403 || error.response.status == 401) {
        dispatch(logout()), navigate("/login");
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen sm:gap-4 sm:py-4 sm:pl-20">
      <Tabs>
        <TabsContent>
          <Card>
            <CardHeader className="flex gap-4 sm:justify-between sm:flex-row sm:items-center">
              <CardTitle>Messages</CardTitle>
              <Button onClick={handleReturnToDashboard} className="w-fit">
                Return to Dashboard
              </Button>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-4">
              {messages && messages.length > 0 ? (
                messages.map((message) => (
                  <Card key={message._id} className="grid gap-2">
                    <CardDescription className="text-slate-950">
                      <span className="font-bold mr-2">Sender Name:</span>
                      {message.senderName}
                    </CardDescription>
                    <CardDescription className="text-slate-950">
                      <span className="font-bold mr-2">Subject</span>
                      {message.subject}
                    </CardDescription>
                    <CardDescription className="text-slate-950">
                      <span className="font-bold mr-2">Message</span>
                      {message.message}
                    </CardDescription>
                    <CardFooter className="justify-end">
                      {isLoading && messageId === message._id ? (
                        <LoadingButton content={"Deleting"} width={"w-32"} />
                      ) : (
                        <Button
                          className="w-32"
                          onClick={() => {
                            handleElementDelete(message._id);
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </CardFooter>
                  </Card>
                ))
              ) : (
                <CardHeader>No Message Found!</CardHeader>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Messages;
