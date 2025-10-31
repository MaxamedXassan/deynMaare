"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1️⃣ Signup user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          setError("This email is already in use. Try logging in.");
        } else {
          setError(error.message);
        }
        setLoading(false);
        return;
      }

      // 2️⃣ Add free trial in profiles table
      if (data?.user) {
        const trialStarts = new Date();
        const trialEnds = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // +14 days

        const { error: profileError } = await supabase.from("profiles").insert({
          id: data.user.id,
          trial_starts_at: trialStarts.toISOString(),
          trial_ends_at: trialEnds.toISOString(),
          is_subscribed: false,
        });

        if (profileError) {
          setError("Signup succeeded but failed to create profile.");
          setLoading(false);
          return;
        }

        // 3️⃣ Auto login user
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (loginError) {
          setError("Signup succeeded but login failed. Please login manually.");
        } else {
          router.push("/login");
        }
      }
    } catch (err: any) {
      setError("Something went wrong, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Create Account</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>

        <div className="flex justify-center mt-4 text-sm">
          <button
            onClick={() => router.push("/login")}
            className="text-blue-600 hover:underline"
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  );
}
