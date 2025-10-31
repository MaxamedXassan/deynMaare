"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/navigation";

interface Customer {
  id: number;
  name: string;
  phone: string;
}

interface Props {
  customers: Customer[];
  onRefresh: () => void;
}

export default function CustomerList({ customers, onRefresh }: Props) {
  const router = useRouter();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editName, setEditName] = useState("");
  const [editNumber, setEditNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this customer?")) return;
    setLoading(true);
    const { error } = await supabase.from("customers").delete().eq("id", id);
    setLoading(false);
    if (error) alert(error.message);
    else onRefresh();
  };

  const startEdit = (c: Customer) => {
    setEditingCustomer(c);
    setEditName(c.name);
    setEditNumber(c.phone);
  };

  const handleUpdate = async () => {
    if (!editingCustomer) return;
    setLoading(true);
    const { error } = await supabase
      .from("customers")
      .update({ name: editName, number: editNumber })
      .eq("id", editingCustomer.id);
    setLoading(false);
    if (error) alert(error.message);
    else {
      setEditingCustomer(null);
      onRefresh();
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow w-full">
      <h2 className="text-lg font-semibold mb-3">Your Customers</h2>

      {customers.length === 0 ? (
        <p>No customers yet.</p>
      ) : (
        <ul>
          {customers.map((c) => (
            <li key={c.id} className="border-b py-2 flex items-center justify-between">
              <div
                onClick={() => router.push(`/dashboard/${c.id}`)}
                className="cursor-pointer flex-1"
              >
                <p className="font-medium">{c.name}</p>
                <p className="text-gray-600 text-sm">{c.phone}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(c)}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="text-red-600 text-sm hover:underline"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingCustomer && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Edit Customer</h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Name"
              className="w-full border p-2 rounded mb-3"
            />
            <input
              type="text"
              value={editNumber}
              onChange={(e) => setEditNumber(e.target.value)}
              placeholder="Number"
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex justify-between">
              <button onClick={() => setEditingCustomer(null)} className="text-gray-600">
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
