"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function EVCPaymentPage() {
  const [phone, setPhone] = useState("");
  const [amount] = useState(9.99);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) return router.push("/login");
      setUser(data.user);
    };
    getUser();
  }, [router]);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/evc-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          amount,
          userId: user.id,
        }),
      });

      const data = await res.json();

      if (!data.success) throw new Error(data.message);
      setMessage("✅ " + data.message);
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">EVC Payment</h1>

        <form onSubmit={handlePayment} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-1 font-medium">
              Phone Number (EVC)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 612345678"
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-600 outline-none"
              required
            />
          </div>

          <div className="flex justify-between p-3 border rounded-lg bg-gray-100">
            <span className="font-medium">Amount</span>
            <span className="font-semibold text-lg">${amount}</span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Processing..." : "Pay with EVC"}
          </button>
        </form>

        {message && (
          <p className="text-center mt-4 text-green-600 font-medium">
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          Logged in as <span className="font-semibold">{user.email}</span>
        </p>
      </div>
    </div>
  );
}
