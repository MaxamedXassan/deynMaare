"use client";

import { useEffect, useState, use } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useRouter } from "next/navigation";
import AddDebtForm from "../../components/AddDebtForm";
import DebtList from "../../components/DebtList";

export default function CustomerDashboard({
  params,
}: {
  params: Promise<{ customerId: string }>;
}) {
  const resolvedParams = use(params);
  const customerId = resolvedParams.customerId;

  const [debts, setDebts] = useState<any[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const router = useRouter();

  const fetchDebts = async () => {
    setLoading(true);
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;

    const { data, error } = await supabase
      .from("debts")
      .select("*")
      .eq("customer_id", customerId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setDebts(data);
    setLoading(false);
  };

  const fetchCustomer = async () => {
    const { data } = await supabase
      .from("customers")
      .select("name")
      .eq("id", customerId)
      .single();
    if (data) setCustomerName(data.name);
  };

  useEffect(() => {
    fetchCustomer();
    fetchDebts();

    const openHandler = () => setShowForm(true);
    document.addEventListener("openAddDebtForm", openHandler);
    return () => document.removeEventListener("openAddDebtForm", openHandler);
  }, [customerId]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-blue-600 text-sm hover:underline"
          >
            ← Back
          </button>
          <h1 className="text-xl font-semibold text-gray-800">
            {customerName ? `${customerName}'s Debts` : "Customer Debts"}
          </h1>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading debts...</p>
        ) : (
          <DebtList debts={debts} onRefresh={fetchDebts} />
        )}

        {showForm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <div className="bg-white p-6 rounded-xl w-96 shadow-lg">
              <AddDebtForm
                customerId={customerId}
                onAdded={() => {
                  setShowForm(false);
                  fetchDebts();
                }}
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
      </div>
    </div>
  );
}
