"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Props {
  userId: string;
  onCustomerAdded: () => void; // refresh callback
  onClose: () => void;        // close form after submit
}

export default function AddCustomerForm({ userId, onCustomerAdded, onClose }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error } = await supabase.from("customers").insert([
      { user_id: userId, name, phone },
    ]);

    setLoading(false);

    if (error) {
      setError(error.message);
    } else {
      setName("");
      setPhone("");
      onCustomerAdded(); // refresh customer list
      onClose();         // close the form automatically
    }
  };

  return (
    <form
      onSubmit={handleAddCustomer}
      className="bg-white p-4 rounded-lg shadow mb-4 max-w-md mx-auto"
    >
      <h2 className="text-lg font-semibold mb-2">Add Customer</h2>
      <input
        type="text"
        placeholder="Customer Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full p-2 mb-2 border rounded-lg"
        required
      />
      <input
        type="text"
        placeholder="Customer Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="w-full p-2 mb-2 border rounded-lg"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
      >
        {loading ? "Adding..." : "Add Customer"}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
