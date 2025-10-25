"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddDebtForm({
  customerId,
  onAdded,
}: {
  customerId: string;
  onAdded: () => void;
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    if (!userId) {
      setErrorMsg("You must be logged in.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("debts").insert([
      {
        user_id: userId,
        customer_id: customerId,
        amount: parseFloat(amount),
        description,
        due_date: dueDate,
        paid: 0,
        status: "unpaid",
      },
    ]);

    if (error) setErrorMsg(error.message);
    else {
      setAmount("");
      setDescription("");
      setDueDate("");
      onAdded();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow w-full">
      <h3 className="text-lg font-semibold mb-3">Add New Debt</h3>
      <input type="number" step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mb-2 p-2 border rounded-lg" required />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mb-2 p-2 border rounded-lg" required />
      <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full mb-3 p-2 border rounded-lg" />

      {errorMsg && <p className="text-red-600 text-sm mb-2">{errorMsg}</p>}

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
        {loading ? "Saving..." : "Add Debt"}
      </button>
    </form>
  );
}
