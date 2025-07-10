"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import { ChevronLeftIcon } from "@/icons";
import Link from "next/link";
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";

export default function SignInForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState<"error" | "success" | "">("");
    const router = useRouter();

    function showMessage(message: string, type: "error" | "success") {
        setMessage(message);
        setMessageType(type);

        setTimeout(() => {
            setMessage("");
            setMessageType("");
        }, 3000);
    }

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const emailPattern = /^[a-z\d]+@(gmail|yahoo|outlook)+\.(com|in|org|co)$/;

        if (!emailPattern.test(email)) {
            showMessage("Please enter a valid email address (e.g., user@gmail.com).", "error");
            return;
        }

        if (!password) {
            showMessage("Please enter your password.", "error");
            return;
        }

        const demoCredentials = {
            email: "user@gmail.com",
            password: "User@123"
        };

        if (email === demoCredentials.email && password === demoCredentials.password) {
            showMessage("Login successful with demo credentials!", "success");

            setTimeout(() => router.push("/"), 1500);
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                showMessage("Login successful!", "success");
                setEmail("")
                setPassword("")
                setTimeout(() => router.push("/"), 1500);
            })
            .catch((error) => {
                const errorCode = error.code;

                if (errorCode === "auth/user-not-found") {
                    showMessage("User not found. Please register first.", "error");
                } else if (errorCode === "auth/wrong-password") {
                    showMessage("Password is incorrect. Please try again.", "error");
                } else {
                    showMessage("An error occurred: " + error.message, "error");
                }
            });
    };

    return (
        <div className="flex flex-col flex-1 lg:w-1/2 w-full">
            <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
                <div>
                    <div className="mb-5 sm:mb-8">
                        <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
                            Sign In
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Enter your email and password to sign in!
                        </p>
                    </div>
                    <div>
                        <form onSubmit={handleSubmit}>
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
                                className="w-full mt-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Sign In
                            </button>
                        </form>
                        <div className="mt-5">
                            <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/signup"
                                    className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                                >
                                    Sign Up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
