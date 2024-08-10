import React from "react";
import { useParams } from "react-router-dom";

function ViewProject() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectBanner, setProjectBanner] = useState("");
  const [projectBannerPreview, setProjectBannerPreview] = useState("");
  const [gitRepoLink, setGitRepoLink] = useState("");
  const [projectLink, setProjectLink] = useState("");
  const [technologies, settechnologies] = useState("");
  const [stack, setStack] = useState("");
  const [deployed, setDeployed] = useState("");
  const { id } = useParams();
  return <div>ViewProject</div>;
}

export default ViewProject;
