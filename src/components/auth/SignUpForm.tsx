"use client";
import React, { useState } from "react";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { auth, database } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { ref, set } from "firebase/database";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "">("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => {
      setMessage("");
      setMessageType("");
      if (type === "success") {
        router.push("/signin");
      }
    }, 3000);
  };

  const fullNamePattern = /^[A-Za-z\s]{8,16}$/;
  const emailPattern = /^[a-z\d]+@(gmail|yahoo|outlook)\.(com|in|org|co)$/;
  const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[\d])(?=.*[$%&#@]).{4,10}$/;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullNamePattern.test(fullName)) {
      showMessage("Please enter a valid full name (8-16 letters only).", "error");
      return;
    }
    if (!emailPattern.test(email)) {
      showMessage("Invalid email format! Use Gmail, Yahoo, or Outlook.", "error");
      return;
    }
    if (!passwordPattern.test(password)) {
      showMessage(
        "Weak password! Use 4+ chars, letters, numbers & symbols.",
        "error"
      );
      return;
    }

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await set(ref(database, "users/" + user.uid), {
        email: email,
        password: password,
      });

      showMessage("Your account has been successfully created! 🎉", "success");
      setEmail("");
      setFullName("");
      setPassword("");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error: ", error.message);
        showMessage("Oops! " + error.message, "error");
      } else {
        console.error("Unexpected error", error);
        showMessage("Oops! An unexpected error occurred.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col flex-1 lg:w-1/2 w-full overflow-y-auto no-scrollbar"
    >
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
          Sign Up
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Enter your details to create an account
        </p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label htmlFor="fullname" className="mb-1">
              User Name
            </Label>
            <Input
              id="fullname"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="User Name"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="email" className="mb-1">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="password" className="mb-1">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          {message && (
            <div
              className={`text-sm mb-4 ${messageType === "error" ? "text-red-500" : "text-green-500"
                }`}
            >
              {message}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex justify-center items-center"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size={20} color="#fff" /> : "Sign Up"}
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-700 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="text-brand-500 hover:text-brand-600">
            Sign In
          </Link>
        </p>
      </div>
    </motion.div>
  );
}
