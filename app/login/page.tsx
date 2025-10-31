"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [generalMessage, setGeneralMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/dashboard");
    });
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setEmailError(null);
    setPasswordError(null);
    setGeneralMessage(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("password")) setPasswordError(error.message);
      else setEmailError(error.message);
      return;
    }

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6 md:px-12">
      <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">Login</h2>

        {generalMessage && <p className="text-green-500 mb-4 text-center">{generalMessage}</p>}

        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <div>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                emailError ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {emailError && <p className="text-red-500 mt-1 text-sm">{emailError}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                passwordError ? "border-red-500" : "border-gray-300"
              }`}
              required
            />
            {passwordError && <p className="text-red-500 mt-1 text-sm">{passwordError}</p>}
          </div>
              <Link href="/ForgotPassword" className="text-blue-600 hover:underline text-center">
            Forgot Password?
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full shadow hover:bg-blue-700 transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="flex justify-between mt-4 text-sm text-gray-500">
          {/* <Link href="/signup" className="text-blue-600 hover:underline">
            I don't have an account
          </Link> */}
          
          
        </div>
               <p className="text-center mt-4 text-gray-500">
          I don't have an account{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            SignUp
          </Link>
        </p>
      
      </div>
    </div>
  );
}
