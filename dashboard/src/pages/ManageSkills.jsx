import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function ManageSkills() {
  const [skillsLoading, setIsSkillsLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [newProficiencyCount, setNewProficiencyCount] = useState(1);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [skillId, setSkillId] = useState();
  useEffect(() => {
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
        setIsSkillsLoading(false);
        toast.error(error.response.data.message || error.message);
        if (error.response.status == 401 || error.response.status == 403) {
          dispatch(logout());
        }
      }
    };
    fetchDataForSkills();
  }, []);
  const hadnleInputChange = (proficiency) => {
    setNewProficiencyCount(proficiency);
  };

  const handleUpdateSkill = async (id) => {
    try {
      const { data } = await axios.put(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/skill/update/${id}`,
        { proficiency: newProficiencyCount },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(data);
      if (data.success == false) {
        toast.error(data.message || "Internal Error");
        return;
      }
      setDeleteLoading(false);
      toast.success(data.message || "Skill Updated successfully!");
    } catch (error) {
      setDeleteLoading(false);
      toast.error(error.response.data.message || error.message);
      if (error.response.status == 401 || error.response.status == 403) {
        dispatch(logout());
      }
    }
  };
  const handleDeleteSkill = async (id) => {
    try {
      setSkillId(id);
      setDeleteLoading(true);
      const { data } = await axios.delete(
        `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/skill/delete/${id}`,
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

      const copyOfSkills = skills.filter((skill) => skill._id !== id);
      setSkills(copyOfSkills);
      setDeleteLoading(false);
      toast.success(data.message || "Skill delted successfully!");
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
                <CardTitle>Manage Your Skills</CardTitle>
                <Link to={"/"}>
                  <Button className="w-fit">Return to Dashboard</Button>
                </Link>
              </CardHeader>
              {!skillsLoading ? (
                <CardContent className="grid grid-cols-2 gap-4">
                  {skills && skills.length > 0 ? (
                    skills.map((skill) =>
                      deleteLoading && skillId === skill._id ? (
                        <div className="flex items-center justify-center ">
                          <LoadingButton
                            heightAndWidth={"h-10 w-10"}
                          ></LoadingButton>
                        </div>
                      ) : (
                        <Card key={skill._id}>
                          <CardHeader className="text-3xl font-bold items-center justify-between flex-row">
                            {skill.title}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Trash2
                                    onClick={() => handleDeleteSkill(skill._id)}
                                    className="h-5 w-5 hover:text-red-600 cursor-pointer"
                                  />
                                </TooltipTrigger>
                                <TooltipContent
                                  side="right"
                                  style={{ color: "red" }}
                                >
                                  Delete
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </CardHeader>
                          <CardFooter>
                            <Label className="text-2xl mr-2">Proficiancy</Label>
                            <Input
                              type="number"
                              defaultValue={skill.proficiency}
                              onChange={(e) =>
                                hadnleInputChange(e.target.value)
                              }
                              onBlur={() => handleUpdateSkill(skill._id)}
                            />
                          </CardFooter>
                        </Card>
                      )
                    )
                  ) : (
                    <CardTitle className="text-3xl overflow-y-hidden">
                      You have not added any skill
                    </CardTitle>
                  )}
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

export default ManageSkills;
