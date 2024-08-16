import { ThemeProvider } from "@/components/theme-provider";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProjectView from "./pages/ProjectView";
import Footer from "./pages/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";
import { useEffect, useState } from "react";
import axios from "axios";
function App() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(0);
  useEffect(() => {
    const testingFunction = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(
          `${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/test/check`,
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/project/:id" element={<ProjectView />} />
        </Routes>
        <Footer />
        <ToastContainer position="bottom-right" theme="dark" />
      </Router>
    </ThemeProvider>
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
