import { Button } from "@/components/ui/button";
import { Home, SearchX } from "lucide-react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed z-50 inset-0 min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-6">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <div className="rounded-full bg-red-100 dark:bg-red-900/40 p-6">
          <SearchX className="h-12 w-12 text-red-500 dark:text-red-400" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          404 - Page Not Found
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          Oops! The page you’re looking for doesn’t exist or has been moved.
          Please check the URL or return to the homepage.
        </p>

        <div className="flex gap-3">
          <Button onClick={() => navigate(-1)} variant="outline">
            Go Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
