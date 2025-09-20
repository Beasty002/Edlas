import { Button } from "@/components/ui/button";
import { Home, LockKeyhole } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Unauthorize = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed z-50 inset-0 min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-center p-6">
      <div className="flex flex-col items-center gap-6 max-w-md">
        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/40 p-6">
          <LockKeyhole className="h-12 w-12 text-yellow-600 dark:text-yellow-400" />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          401 - Unauthorized
        </h1>

        <p className="text-gray-600 dark:text-gray-400">
          🚫 Hold up! You don’t have the secret handshake for this page. Either
          you’re lost… or you’re trying to sneak into the VIP area.
        </p>

        <div className="flex gap-3">
          <Button onClick={() => navigate(-1)} variant="outline">
            Take Me Back
          </Button>
          <Button
            onClick={() => navigate("/")}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Home className="mr-2 h-4 w-4" />
            Back to Safety
          </Button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 italic">
          (Psst… maybe Get Proper accessLevel first? 😉)
        </p>
      </div>
    </div>
  );
};

export default Unauthorize;
