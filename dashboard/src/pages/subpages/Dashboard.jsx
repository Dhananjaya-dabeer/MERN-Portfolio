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
          navigate("/login");
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
          navigate("/login");
        }
      }
    };
    fetchDataForProjects();
    fetchDataForSkills();
  }, []);

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
                    projects?.length && (
                      <CardTitle className="text-5xl">
                        {projects?.length}
                      </CardTitle>
                    )
                  ) : (
                    <LoadingButton width={"w-1/4"} heightAndWidth={"h-7 w-7"}>
                      {projects?.length}
                    </LoadingButton>
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
                    skills?.length && (
                      <CardTitle className="text-5xl">
                        {skills?.length}
                      </CardTitle>
                    )
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
                                  <Button>Update</Button>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Link
                                    to={
                                      project.projectLink
                                        ? project.projectLink
                                        : ""
                                    }
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
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
