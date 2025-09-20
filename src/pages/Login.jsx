import { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [theme, setTheme] = useState("light");
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const location = useLocation();
  const from = location.state?.from?.pathname;
  useEffect(() => {
    if (localStorage.theme === "dark") {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!email) newErrors.email = "This field is required";
    if (!password) newErrors.password = "This field is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await auth.login(email, password);

        const redirectTo = !from || from === "/login" ? "/" : from;
        navigate(redirectTo, { replace: true });
      } catch (error) {}
    }
  };
  useEffect(() => {
    if (auth.isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [auth.isAuthenticated, from, navigate]);
  return (
    <div className="flex h-screen">
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-700 to-indigo-600 text-white items-center justify-center p-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Welcome to School Management</h1>
          <p className="text-lg text-gray-200">
            Manage students, academics, and performance reports easily
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
        <Card className="w-full max-w-md shadow-lg bg-white dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-gray-900 dark:text-gray-100">
              Login
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-300">
              Enter your credentials
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="grid gap-4">
              <div className="grid gap-1">
                <Label
                  htmlFor="email"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Username / Email
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your username or email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mt-1"
                />
                {errors.email && (
                  <span className="text-red-500 text-sm">{errors.email}</span>
                )}
              </div>

              <div className="grid gap-1">
                <Label
                  htmlFor="password"
                  className="text-gray-700 dark:text-gray-200"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 mt-1"
                />
                {errors.password && (
                  <span className="text-red-500 text-sm">
                    {errors.password}
                  </span>
                )}
              </div>
            </CardContent>

            <CardFooter className="mt-4">
              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
