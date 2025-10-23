"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import AddCustomerForm from "../components/AddCustomerForm";
import CustomerList from "../components/CustomerList";

interface Customer {
  id: string;
  name: string;
  phone: string;
  created_at: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
      if (data.user) fetchCustomers(data.user.id);
    };
    getUser();
  }, []);

  const fetchCustomers = async (userId: string) => {
    const { data } = await supabase
      .from("customers")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    setCustomers(data as Customer[]);
    setFilteredCustomers(data as Customer[]);
  };

  useEffect(() => {
    if (search === "") {
      setFilteredCustomers(customers);
    } else {
      const filtered = customers.filter((c) =>
        c.phone.includes(search)
      );
      setFilteredCustomers(filtered);
    }
  }, [search, customers]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 pb-28">
      <div className="w-full max-w-md px-4">
        <h1 className="text-2xl font-bold mb-4">DeynMaare Dashboard</h1>
        {user && <p className="text-gray-700 mb-4">Welcome, {user.email}</p>}

        {/* Search */}
        <input
          type="text"
          placeholder="Search by phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-2 border rounded-lg w-full mb-4"
        />

        {/* Add Customer Form */}
        {showForm && user && (
          <AddCustomerForm
            userId={user.id}
            onCustomerAdded={() => fetchCustomers(user.id)}
            onClose={() => setShowForm(false)}
          />
        )}

        {/* Customer List */}
        <CustomerList customers={filteredCustomers} />
      </div>

      {/* Fixed Add Customer Button (same width as list container) */}
      <div className="fixed bottom-0 left-0 w-full flex justify-center bg-gray-50 border-t shadow-md py-4">
        <div className="w-full max-w-md px-4">
          <button
            onClick={() => setShowForm(!showForm)}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            {showForm ? "Close Form" : "Add Customer"}
          </button>
        </div>
      </div>
    </div>
  );
}
