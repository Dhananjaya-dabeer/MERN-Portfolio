import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { logout } from "@/store/slices/userSlices";
import axios from "axios";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ManageTimeline() {
  const dispatch = useDispatch();
  const [timelines, setTimelines] = useState([]);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [timelineId, setTimelineId] = useState("");
  const [deleteCount, setDeleteCount] = useState(1);
  const [timelineLoading, setTImelinLoading] = useState(false);
  useEffect(() => {
    const fetchDataForTimeline = async () => {
      try {
        setTImelinLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/timeline/getall`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (data.success == false) {
          setTImelinLoading(false);
          toast.error(data.message || "Internal Error");
          return;
        }
        setTimelines(data?.timelines);
        setTImelinLoading(false);
      } catch (error) {
        toast.error(error.response.data.message || error.message);
        if (error.response.status == 401 || error.response.status == 403) {
          dispatch(logout());
        }
      }
    };
    fetchDataForTimeline();
  }, [deleteCount]);

  const deleteTimeline = async (id) => {
    try {
      setTimelineId(id);
      setDeleteLoading(true);
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/timeline/delete/${id}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      if (data.success == false) {
        setDeleteLoading(false);
        toast.error(data.message || "Internal Error");
        return;
      }
      setDeleteLoading(false);
      setDeleteCount(deleteCount + 1);
      toast.success(data.message || "Time line delted successfully");
    } catch (error) {
      setDeleteLoading(false);
      toast.error(error.response.data.message || error.message);
      if (error.response.status == 401 || error.response.status == 403) {
        dispatch(logout());
      }
    }
  };

  return (
    <>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Tabs>
          <TabsContent>
            <Card>
              <CardHeader className="flex gap-4 sm:justify-between sm:flex-row sm:items-center">
                <CardTitle>Manage Your Timeline</CardTitle>
                <Link to={"/"}>
                  <Button>Return to Dashboard</Button>
                </Link>
              </CardHeader>
              {!timelineLoading ? (
                <CardContent className="grid grid-cols-1 gap-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Descritpion</TableHead>
                        <TableHead>Frome</TableHead>
                        <TableHead>To</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {timelines && timelines.length > 0 ? (
                        timelines.map((time) => {
                          return (
                            <TableRow className="bg-accent" key={time._id}>
                              <TableCell className="font-medium">
                                {time.title}
                              </TableCell>
                              <TableCell className="md:table-cell">
                                {time.description}
                              </TableCell>
                              <TableCell className="md:table-cell">
                                {time.timeline.from}
                              </TableCell>
                              <TableCell className="md:table-cell">
                                {time.timeline.to}
                              </TableCell>
                              <TableCell className="flex justify-end">
                                {timelineId === time._id && deleteLoading ? (
                                  <LoadingButton
                                    width={"w-1/6"}
                                  ></LoadingButton>
                                ) : (
                                  <button
                                    className="border-red-600 border-2 rounded-full h-8 w-8 flex justify-center items-center text-red-600 hover:text-slate-50 hover:bg-red-600"
                                    onClick={() => deleteTimeline(time._id)}
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell className="text-3xl overflow-y-hidden">
                            You have not added any timeline
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              ) : (
                <div className="flex items-center justify-center">
                  <img
                    src={import.meta.env.VITE_LOADER2}
                    alt="Loading..."
                    className="w-10 h-10"
                  />
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default ManageTimeline;
