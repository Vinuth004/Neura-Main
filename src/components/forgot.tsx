import { useState, CSSProperties } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast, { Toaster } from 'react-hot-toast';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import ClipLoader from "react-spinners/ClipLoader";

export function ForgotForm() {
  const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };
  const [email, setEmail] = useState("");
  const [isOtpDrawerOpen, setOtpDrawerOpen] = useState(false);
  const [isPasswordDrawerOpen, setPasswordDrawerOpen] = useState(false);
  const [randnum, setRandnum] = useState('');
  const [otp, setOtp] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  let [color, setColor] = useState("#ffffff");
  let [loading, setLoading] = useState(false);


  async function handleRetrieve(email: string) {
    setLoading(true)
    try {
      const response = await fetch("http://127.0.0.1:5000/api/retrieve-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const num = await response.json();
      if (response.ok) {
        setLoading(false)
        toast.success('Email sent successfully. Please check your inbox', {
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
        setRandnum(num.message);
        setOtpDrawerOpen(true); // Open the OTP drawer when the email is successfully sent
      } else {
        setLoading(false)
        toast("Failed to send the email", {
          icon: '⚠️',
          style: {
            borderRadius: '100vh',
            background: '#69262c',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      setLoading(false)
      console.error("Error:", error);
      toast("An error occured", {
        icon: '⚠️',
        style: {
          borderRadius: '100vh',
          background: '#69262c',
          color: '#fff',
        },
      });
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleRetrieve(email);
  };

  const handleOtpChange = (otpValue: string) => {
    setOtp(otpValue);
  };

  const handleOtpSubmit = () => {
    if (otp == randnum) {
      setPasswordDrawerOpen(true); // Open the password drawer if OTP matches
      setOtpDrawerOpen(false);
    } else {
      toast("Incorrect OTP !! Try again", {
        icon: '⚠️',
        style: {
          borderRadius: '100vh',
          background: '#69262c',
          color: '#fff',
        },
      });
    }
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/reset.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password: newPassword }),
      });
      if (response.ok) {
        toast.success('Password updated successfully', {
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
        setPasswordDrawerOpen(false);
      } else {
        toast("Failed to update the password", {
          icon: '⚠️',
          style: {
            borderRadius: '100vh',
            background: '#69262c',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast("An error occured", {
        icon: '⚠️',
        style: {
          borderRadius: '100vh',
          background: '#69262c',
          color: '#fff',
        },
      });
    }
  };

  return (
    <>
        <Toaster
        position="bottom-right"
        reverseOrder={false}
      />
      <ClipLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
      <Card className="mx-auto max-w-sm mt-10">
        <CardHeader>
          <CardTitle className="text-2xl">Forgot Password?</CardTitle>
          <CardDescription>
            Enter your email address to recover your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
              <Button type="submit" variant="outline" className="w-full">
                Retrieve Login
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <a href="#" className="underline">
              Sign up
            </a>
          </div>
        </CardContent>
      </Card>

      {/* OTP Drawer */}
      <Drawer open={isOtpDrawerOpen} onOpenChange={setOtpDrawerOpen}>
        <DrawerContent className="flex flex-col items-center justify-center p-6">
          <DrawerHeader className="flex flex-col items-center text-center">
            <DrawerTitle className="text-xl font-semibold">Enter OTP</DrawerTitle>
            <DrawerDescription className="mt-4">
              <InputOTP
                maxLength={6}
                className="flex justify-center"
                onChange={(value: string) => handleOtpChange(value)}
              >
                <InputOTPGroup className="flex justify-center">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup className="flex justify-center">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex justify-center gap-4 mt-4">
            <Button onClick={handleOtpSubmit}>Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* New Password Drawer */}
      <Drawer open={isPasswordDrawerOpen} onOpenChange={setPasswordDrawerOpen}>
        <DrawerContent className="flex flex-col items-center justify-center p-6">
          <DrawerHeader className="flex flex-col items-center text-center">
            <DrawerTitle className="text-xl font-semibold">Enter New Password</DrawerTitle>
            <DrawerDescription className="mt-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="*********"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex justify-center gap-4 mt-4">
            <Button onClick={handlePasswordSubmit}>Submit</Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
