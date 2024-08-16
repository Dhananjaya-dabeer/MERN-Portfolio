import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ManageSkills from "./pages/ManageSkills";
import ManageTimeline from "./pages/ManageTimeline";
import ManageProjects from "./pages/ManageProjects";
import ViewProject from "./pages/ViewProject";
import UpdateProject from "./pages/UpdateProject";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/ui/PrivateRoute";
import "./App.css";
import axios from "axios";
function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(0);
  useEffect(() => {
    const testingFunction = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASE_URL}/api/v1/test/check`,
          { withCredentials: true }
        );

        if (data.success == false) {
          setLoading(false);
          toast.warn(data.message);
          return;
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.warn(
          error.response.data.message ||
            error.message ||
            "Please try to reload!"
        );
        console.log(error.message);
      }
    };
    testingFunction();

    const timeOutId1 = setTimeout(() => {
      setMessage((prev) => prev + 1);

      const timeOutId2 = setTimeout(() => {
        setMessage((prev) => prev + 1);

        const timeOutId3 = setTimeout(() => {
          setMessage((prev) => prev + 1);
        }, 10000);
        return () => clearTimeout(timeOutId3);
      }, 10000);

      return () => clearTimeout(timeOutId2);
    }, 10000);

    return () => clearTimeout(timeOutId1);
  }, []);
  return !loading ? (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/manage/skills" element={<ManageSkills />} />
          <Route path="/manage/timeline" element={<ManageTimeline />} />
          <Route path="/manage/projects" element={<ManageProjects />} />
          <Route path="/update/project/:id" element={<UpdateProject />} />
          <Route path="/view/project/:id" element={<ViewProject />} />
        </Route>
      </Routes>
      <ToastContainer position="bottom-right" theme="dark" />
    </BrowserRouter>
  ) : (
    <div className="w-screen h-screen flex flex-col justify-center items-center">
      <img src={import.meta.env.VITE_LOADER} alt="" className="w-24 h-24" />
      {message === 1 && <p>Syncing with the database, please hold on...</p>}
      {message === 2 && (
        <p>Hang tight! We're getting things ready for you...</p>
      )}
      {message === 3 && <p>Almost there! The data is being synchronized...</p>}
    </div>
  );
}

export default App;
