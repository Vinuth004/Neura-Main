import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoginImage from "../assets/login.jpg";
import toast, { Toaster } from 'react-hot-toast';
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const loginData = { email, password };

    try {
      const response = await fetch("http://localhost:3000/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message, {
          style: {
            border: '1px solid #1cad2c',
            padding: '16px',
            color: '#159923',
          },
          iconTheme: {
            primary: '#1cad2c',
            secondary: '#b4f0ba',
          },
        });
        Cookies.set("email", email, { expires: 7 });
        navigate("/");
      } else {
        toast(result.message,
        {
          icon: '⚠️',
          style: {
            borderRadius: '100vh',
            background: '#69262c',
            color: '#fff',
          },
        }
      );
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast("An error occured. Try again !",
      {
        icon: '⚠️',
        style: {
          borderRadius: '100vh',
          background: '#69262c',
          color: '#fff',
        },
      }
    );
    }
  };

  return (
    <div className="w-full lg:grid lg:min-h-[100vh] lg:grid-cols-2 xl:min-h-[800px]">
      <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-balance text-muted-foreground">
              Enter your email below to login to your account
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>

                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline">
              Sign up
            </a>
          </div>
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <img
          src={LoginImage}
          alt="Image"
          width="1920"
          height="800"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}
