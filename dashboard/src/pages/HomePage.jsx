import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { logout } from "@/store/slices/userSlices";
import axios from "axios";
import {
  CodeXml,
  FolderGit,
  History,
  Home,
  LayoutGrid,
  LogOut,
  MessageSquareMore,
  Package,
  Package2,
  PanelLeft,
  User,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

function HomePage() {
  const [active, setActive] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, error, user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `http://localhost:4000/api/v1/user/logout`,
        {},
        { withCredentials: true }
      );
      const data = response.data;
      if (data.success == false) {
        toast.error(data.message);
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      dispatch(logout());
      toast.success("Logged out!");
      navigate("/login");
    } catch (error) {
      setIsLoading(false);
      if (error.response.status == 403) {
        navigate("/login");
      }
      toast.error(error.response.data.message || error.message);
    }
  };
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);
  return (
    <div className="flex flex-col min-h-screen bg-muted/40 w-full">
      <aside className="fixed inset-y-0 left0 hidden w-14 flex-col border-r bg-background sm:flex z-50">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full">
            <Package className="h-4 w-4 transition-all group-hover:scale-110" />
            <span className="sr-only">Dashboard</span>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Dashboard"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Dashboard")}
                >
                  <Home className="w-5 h-5" />
                  <span className="sr-only">Dashboard</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Dashboard</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Add Project"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Add Project")}
                >
                  <FolderGit className="w-5 h-5" />
                  <span className="sr-only">Add Project</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Add Project</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Add Skills"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Add Skills")}
                >
                  <CodeXml className="w-5 h-5" />
                  <span className="sr-only">Add Skills</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Add Skills</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Add Application"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Add Application")}
                >
                  <LayoutGrid className="w-5 h-5" />
                  <span className="sr-only">Add Application</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Add Application</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Add Timeline"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Add Timeline")}
                >
                  <History className="w-5 h-5" />
                  <span className="sr-only">Add Timeline</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Add Timeline</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Messages"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Messages")}
                >
                  <MessageSquareMore className="w-5 h-5" />
                  <span className="sr-only">Messages</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Messages</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Account"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={() => setActive("Account")}
                >
                  <User className="w-5 h-5" />
                  <span className="sr-only">Account</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Account</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex-col items-center gap-4 px-2 py-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    active === "Logout"
                      ? "text-accent-foreground bg-accent"
                      : "text-muted-foreground"
                  } transition-colors hover:text-foreground md:h-8 md:w-8`}
                  onClick={handleLogout}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="sr-only">Logout</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Logout</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
      <header className="sticky top-0 left0 hidden w-14  flex-col border-r bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 max-[900px]:h-[100px]">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="sm:hidden">
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-xs">
            <nav className="grid gap-6 text-lg font-medium">
              <Link className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Dashboard"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActive("Dashboard")}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Add Project"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActive("Add Project")}
              >
                <FolderGit className="h-5 w-5" />
                Add Project
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Add Skills"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActive("Add Skills")}
              >
                <Home className="h-5 w-5" />
                Add Skills
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Add Application"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActive("Add Application")}
              >
                <LayoutGrid className="h-5 w-5" />
                Add Application
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Add Timeline"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActive("Add Timeline")}
              >
                <History className="h-5 w-5" />
                Add Timeline
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Messages"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActive("Messages")}
              >
                <Home className="h-5 w-5" />
                Messages
              </Link>
              <Link
                href="#"
                className={`flex items-center gap-4 px-2.5 ${
                  active === "Account"
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setActive("Account")}
              >
                <User className="h-5 w-5" />
                Account
              </Link>

              <Link
                href="#"
                className={`flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground`}
                onClick={handleLogout}
              >
                <Home className="h-5 w-5" />
                Logout
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="flex"></div>
      </header>
    </div>
  );
}

export default HomePage;
