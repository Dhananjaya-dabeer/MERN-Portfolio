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
import { logout } from "@/store/slices/userSlices";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Dashboard() {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isProjectLoading, setIsProjectLoading] = useState(false);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState();
  const [application, setApplication] = useState();
  const [deleteAppLoading, setDeleteAppLoading] = useState(false);
  const [applicationCount, setApplicationCount] = useState(1);
  const [applicationId, setApplicationId] = useState("");
  const [timelines, setTimelines] = useState();
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

    const fetchDataForSkills = async () => {
      try {
        setIsSkillsLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/skill/getall`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );
        if (data.success == false) {
          setIsSkillsLoading(false);
          toast.error(data.message || "Internal Error");
          return;
        }
        setIsSkillsLoading(false);
        setSkills(data?.data);
      } catch (error) {
        console.log(error);
        setIsSkillsLoading(false);
        toast.error(error.response.data.message || error.message);
        if (error.response.status == 401 || error.response.status == 403) {
          dispatch(logout());
        }
      }
    };

    const fetchDataForTimeline = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/timeline/getall`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (data.success == false) {
          toast.error(data.message || "Internal Error");
          return;
        }
        setTimelines(data?.timelines);
      } catch (error) {
        toast.error(error.response.data.message || error.message);
        if (error.response.status == 401 || error.response.status == 403) {
          dispatch(logout());
        }
      }
    };

    fetchDataForProjects();
    fetchDataForSkills();
    fetchDataForTimeline();
  }, []);

  useEffect(() => {
    const fetchDataForApplication = async () => {
      try {
        const { data } = await axios.get(
          `${
            import.meta.env.VITE_BACKEND_BASE_URL
          }/api/v1/softwareapplication/getall`,
          {
            withCredentials: true,
            headers: { "Content-Type": "application/json" },
          }
        );

        if (data.success == false) {
          toast.error(data.message);
          return;
        }
        setApplication(data.data);
      } catch (error) {
        toast.error(error.response.data.message || error.message);
        if (error.response.status == 401 || error.response.status == 403) {
          dispatch(logout());
        }
      }
    };
    fetchDataForApplication();
  }, [applicationCount]);
  const deleteApplicationHandler = async (id) => {
    try {
      setApplicationId(id);
      setDeleteAppLoading(true);
      const { data } = await axios.delete(
        `${
          import.meta.env.VITE_BACKEND_BASE_URL
        }/api/v1/softwareapplication/delete/${id}`,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      if (data.success == false) {
        setDeleteAppLoading(false);
        toast.error(data.message || "Internal error");
        return;
      }
      setDeleteAppLoading(false);
      toast.success(data.message || "deleted Successfully!");
      setApplicationCount(applicationCount + 1);
    } catch (error) {
      setDeleteAppLoading(false);
      toast.error(error.response.data.message || error.message);
      if (error.response.status == 401 || error.response.status == 403) {
        dispatch(logout());
      }
    }
  };

  return (
    <>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <main className="grid flex-1 items-center gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-2 xl:grid-cols-2">
          <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              <Card className="sm:col-span-2">
                <CardHeader className="pb-3">
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    {user.data.aboutMe}
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Link to={user.data.portfolioURL && user.data.portfolioURL}>
                    <Button>Visit Portfolio</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col justify-center">
                <CardHeader className="pb-2">
                  <CardTitle>Projects Completed</CardTitle>
                  {!isProjectLoading ? (
                    <CardTitle className="text-5xl">
                      {projects?.length}
                    </CardTitle>
                  ) : (
                    <LoadingButton
                      width={"w-1/4"}
                      heightAndWidth={"h-7 w-7"}
                    ></LoadingButton>
                  )}
                </CardHeader>
                <CardFooter>
                  <Link to={"/manage/projects"}>
                    <Button>Manage Projects</Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col justify-center">
                <CardHeader className="pb-2">
                  <CardTitle>Skills</CardTitle>
                  {!isSkillsLoading ? (
                    <CardTitle className="text-5xl">{skills?.length}</CardTitle>
                  ) : (
                    <LoadingButton
                      heightAndWidth={"h-7 w-7"}
                      width={"w-1/4"}
                    ></LoadingButton>
                  )}
                </CardHeader>
                <CardFooter>
                  <Link to={"/manage/skills"}>
                    <Button>Manage Skills</Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
            <Tabs>
              <TabsContent>
                <Card>
                  <CardHeader className="px-7">
                    <CardTitle>Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="table-cell">Title</TableHead>
                          <TableHead className="hidden md:table-cell">
                            Stack
                          </TableHead>
                          <TableHead className="hidden md:table-cell">
                            Deployed
                          </TableHead>
                          <TableHead className="md:table-cell">
                            Update
                          </TableHead>
                          <TableHead className="text-right">Visit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {projects && projects.length > 0 ? (
                          projects.map((project) => {
                            return (
                              <TableRow className="bg-accent" key={project._id}>
                                <TableCell>
                                  <div className="font-semibold">
                                    {project.title}
                                  </div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {project.stack}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">
                                  {project.deployed}
                                </TableCell>
                                <TableCell>
                                  <Link to={`/update/project/${project._id}`}>
                                    <Button>Update</Button>
                                  </Link>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Link
                                    to={
                                      project.projectLink
                                        ? project.projectLink
                                        : ""
                                    }
                                    target="Blank"
                                  >
                                    <Button>visit</Button>
                                  </Link>
                                </TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell className="text-3xl overflow-y-hidden">
                              You have not added any project
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <Tabs>
              <TabsContent>
                <Card>
                  <CardHeader className="px-7 gap-3">
                    <CardTitle>Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="grid sm:grid-cols-2 gap-4">
                    {skills && skills.length > 0 ? (
                      skills.map((skill) => {
                        return (
                          <Card key={skill._id}>
                            <CardHeader>{skill.title}</CardHeader>
                            <CardFooter>
                              <Progress value={skill.proficiency} />
                            </CardFooter>
                          </Card>
                        );
                      })
                    ) : (
                      <p className="text-3xl overflow-y-hidden">
                        You have not added any project
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <Tabs>
              <TabsContent className="grid min-[1050px]:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="px-7">
                      Software Applications
                    </CardTitle>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead className="md:table-cell">
                              Icon
                            </TableHead>
                            <TableHead className="md:table-cell">
                              Action
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {application && application.length > 0 ? (
                            application.map((app) => {
                              return (
                                <TableRow className="bg-accent">
                                  <TableCell>{app.name}</TableCell>
                                  <TableCell>
                                    <img
                                      className=" w-7 h-7"
                                      src={app?.svg && app?.svg?.url}
                                      alt={app.name}
                                    ></img>
                                  </TableCell>
                                  <TableCell>
                                    {deleteAppLoading &&
                                    applicationId === app._id ? (
                                      <LoadingButton
                                        content={"Loading..."}
                                        width={"w-1/2"}
                                      ></LoadingButton>
                                    ) : (
                                      <Button
                                        onClick={() =>
                                          deleteApplicationHandler(app._id)
                                        }
                                      >
                                        Delete
                                      </Button>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })
                          ) : (
                            <TableRow>
                              <TableCell className="text-3xl overflow-y-hidden">
                                You have not added any Software Application
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="px-7 flex items-center justify-between flex-row">
                    <CardTitle>Timeline</CardTitle>
                    <Link to={"/manage/timeline"}>
                      <Button>Manage Timeline</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>From</TableHead>
                          <TableHead>To</TableHead>
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
                                  {time.timeline.from}
                                </TableCell>
                                <TableCell className="md:table-cell text-right">
                                  {time.timeline.to}
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
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
