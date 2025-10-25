"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AddCustomerForm from "../components/AddCustomerForm";
import CustomerList from "../components/CustomerList";

interface Customer {
  id: number;
  name: string;
  phone: string;
}

export default function DashboardPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // ✅ Get current userId
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    };
    getUser();
  }, []);

  // ✅ Fetch customers
  const fetchCustomers = async () => {
    setLoading(true);
    if (!userId) return;
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (!error && data) setCustomers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (userId) fetchCustomers();
  }, [userId]);

  // ✅ Filtered customers
  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-4 text-center text-gray-800">
          Customer Dashboard
        </h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mb-4 p-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {/* Customer List */}
        {loading ? (
          <p className="text-center text-gray-500">Loading customers...</p>
        ) : (
          <CustomerList customers={filteredCustomers} onRefresh={fetchCustomers} />
        )}
      </div>

      {/* Add Customer Modal */}
      {showForm && userId && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
            <AddCustomerForm
              userId={userId}
              onCustomerAdded={() => {
                fetchCustomers();
                setShowForm(false);
              }}
              onClose={() => setShowForm(false)}
            />
            <button
              onClick={() => setShowForm(false)}
              className="mt-3 text-gray-600 text-sm w-full hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Add Customer Button */}
      <div className="fixed bottom-4 w-full flex justify-center">
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white py-3 font-semibold rounded-xl shadow-md max-w-lg w-full hover:bg-blue-700 transition"
        >
          + Add Customer
        </button>
      </div>
    </div>
  );
}
