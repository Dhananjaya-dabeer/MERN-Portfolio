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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logout } from "@/store/slices/userSlices";
import axios from "axios";
import { Eye, Pen, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function ManageProjects() {
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [projectId, setProjectId] = useState();

  useEffect(() => {
    const fetchDataForProjects = async () => {
      try {
        setIsProjectLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/project/getall`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        if (data.success == false) {
          setIsProjectLoading(false);
          toast.error(data.message || "Internal Error");
          return;
        }
        setIsProjectLoading(false);
        setProjects(data?.data);
      } catch (error) {
        setIsProjectLoading(false);
        toast.error(error.response.data.message || error.message);
        if (error.response.status == 401 || error.response.status == 403) {
          dispatch(logout());
        }
      }
    };
    fetchDataForProjects();
  }, []);
  const handleDeleteProject = async (id) => {
    try {
      setProjectId(id);
      setIsDeleteLoading(true);
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/project/delete/${id}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (data.success == false) {
        setIsDeleteLoading(false);
        toast.error(data.message || "Internal Error");
        return;
      }
      const copyProjects = projects.filter((project) => project._id !== id);
      setProjects(copyProjects);
      setIsProjectLoading(false);
      toast.success(data.message || "Project Deleted!");
    } catch (error) {
      setIsProjectLoading(false);
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
                <CardTitle>Manage Your Projects</CardTitle>
                <Link to={"/"}>
                  <Button>Return to Dashboard</Button>
                </Link>
              </CardHeader>
              {!isProjectLoading ? (
                <CardContent className="grid grid-cols-1 gap-4">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Banner</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Stack
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Deployed
                        </TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projects && projects.length > 0 ? (
                        projects.map((project) => {
                          return (
                            <TableRow className="bg-accent" key={project._id}>
                              <TableCell className="font-medium">
                                <div>
                                  <img
                                    src={
                                      project.projectBanner &&
                                      project.projectBanner.url &&
                                      project.projectBanner.url
                                    }
                                    alt={project.title}
                                    className="w-16 h-16"
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="font-medium">
                                {project.title}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {project.stack}
                              </TableCell>
                              <TableCell className="hidden md:table-cell">
                                {project.deployed}
                              </TableCell>
                              {projectId === project._id ? (
                                <TableCell className="h-24 flex items-center w-1/3">
                                  <LoadingButton></LoadingButton>
                                </TableCell>
                              ) : (
                                <TableCell className="flex flex-row items-center gap-3 h-24">
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        {
                                          <Link
                                            to={`/view/project/${project._id}`}
                                          >
                                            <button className="border-green-600 border-2 rounded-full h-8 w-8 flex justify-center items-center text-green-600 hover:text-slate-950 hover:bg-green-600">
                                              <Eye className="h-5 w-5" />
                                            </button>
                                          </Link>
                                        }
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="bottom"
                                        style={{ color: "red" }}
                                      >
                                        View
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        {
                                          <Link
                                            to={`/update/project/${project._id}`}
                                          >
                                            <button className="border-yellow-400 border-2 rounded-full h-8 w-8 flex justify-center items-center text-yellow-400 hover:text-slate-950 hover:bg-yellow-400">
                                              <Pen className="h-5 w-5" />
                                            </button>
                                          </Link>
                                        }
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="bottom"
                                        style={{ color: "red" }}
                                      >
                                        Edit
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <button
                                          className="border-red-600 border-2 rounded-full h-8 w-8 flex justify-center items-center text-red-600 hover:text-slate-50 hover:bg-red-600"
                                          onClick={() =>
                                            handleDeleteProject(project._id)
                                          }
                                        >
                                          <Trash2 className="h-5 w-5" />
                                        </button>
                                      </TooltipTrigger>
                                      <TooltipContent
                                        side="bottom"
                                        style={{ color: "red" }}
                                      >
                                        Delete
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </TableCell>
                              )}
                            </TableRow>
                          );
                        })
                      ) : (
                        <TableRow>
                          <TableCell className="text-3xl overflow-y-hidden">
                            You have not added any Projects
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

export default ManageProjects;
