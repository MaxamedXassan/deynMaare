"use client";

import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

interface Debt {
  id: string;
  amount: number;
  description: string;
  status: string;
  paid: number;
  due_date: string;
  created_at: string;
}

export default function DebtList({
  debts,
  onRefresh,
}: {
  debts: Debt[];
  onRefresh: () => void;
}) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [partialInputId, setPartialInputId] = useState<string | null>(null);
  const [partialAmount, setPartialAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this debt?")) return;
    setLoading(true);
    await supabase.from("debts").delete().eq("id", id);
    onRefresh();
    setLoading(false);
  };

  const handleUpdate = async (id: string) => {
    setLoading(true);
    await supabase
      .from("debts")
      .update({ amount: parseFloat(editAmount), description: editDescription })
      .eq("id", id);
    setEditing(null);
    onRefresh();
    setLoading(false);
  };

  const handleStatusChange = async (debt: Debt, status: string) => {
    if (status === "partial") {
      setPartialInputId(debt.id);
      setPartialAmount("");
      return;
    }
    const paid = status === "paid" ? debt.amount : 0;
    setLoading(true);
    await supabase.from("debts").update({ status, paid }).eq("id", debt.id);
    onRefresh();
    setPartialInputId(null);
    setLoading(false);
  };

  const handlePartialSubmit = async (debt: Debt) => {
    const paidAmount = parseFloat(partialAmount);
    if (isNaN(paidAmount) || paidAmount <= 0 || paidAmount > debt.amount - debt.paid) {
      alert("Invalid amount");
      return;
    }
    const newPaid = debt.paid + paidAmount;
    const newStatus = newPaid >= debt.amount ? "paid" : "partial";
    setLoading(true);
    await supabase
      .from("debts")
      .update({ paid: newPaid, status: newStatus })
      .eq("id", debt.id);
    setPartialInputId(null);
    setPartialAmount("");
    onRefresh();
    setLoading(false);
  };

  const total = debts.reduce((sum, d) => sum + d.amount, 0);
  const paid = debts.reduce((sum, d) => sum + d.paid, 0);
  const unpaid = total - paid;

  return (
    <div className="w-full relative pb-28">
      {/* Total / Summary */}
      {debts.length > 0 && (
        <div className="bg-white p-4 mb-4 rounded-xl shadow flex justify-between text-sm font-medium">
          <span>Total: ${total.toFixed(2)}</span>
          <span className="text-green-600">Paid: ${paid.toFixed(2)}</span>
          <span className="text-red-500">Unpaid: ${unpaid.toFixed(2)}</span>
        </div>
      )}

      {/* Debts List */}
      <div className="space-y-3">
        {debts.length === 0 && (
          <p className="text-center text-gray-500 mt-4">No debts yet.</p>
        )}

        {debts.map((d) => (
          <div
            key={d.id}
            className={`bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row sm:justify-between sm:items-center transition ${
              d.status === "paid" ? "opacity-60 line-through text-gray-500" : ""
            }`}
          >
            {editing === d.id ? (
              <div className="flex-1">
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="border p-1 rounded mb-2 w-full"
                />
                <input
                  type="text"
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="border p-1 rounded w-full"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleUpdate(d.id)} className="text-sm text-blue-600 hover:underline">
                    Save
                  </button>
                  <button onClick={() => setEditing(null)} className="text-sm text-gray-600 hover:underline">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <p className="font-semibold text-gray-800">
                    ${d.amount.toFixed(2)} (Paid: ${d.paid.toFixed(2)})
                  </p>
                  <p className="text-gray-600 text-sm">{d.description}</p>
                  <p className="text-gray-400 text-xs">
                    Given: {new Date(d.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                  {partialInputId === d.id ? (
                    <>
                      <input
                        type="number"
                        step="0.01"
                        value={partialAmount}
                        onChange={(e) => setPartialAmount(e.target.value)}
                        className="border rounded-lg p-1 w-20 text-sm"
                      />
                      <button onClick={() => handlePartialSubmit(d)} className="text-green-600 hover:underline text-sm">
                        Pay
                      </button>
                      <button onClick={() => setPartialInputId(null)} className="text-gray-600 hover:underline text-sm">
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <select
                        value={d.status}
                        onChange={(e) => handleStatusChange(d, e.target.value)}
                        className="border rounded-lg p-1 text-sm"
                      >
                        <option value="unpaid">Unpaid</option>
                        <option value="partial">Partial</option>
                        <option value="paid">Paid</option>
                      </select>

                      <button onClick={() => {
                        setEditing(d.id);
                        setEditAmount(d.amount.toString());
                        setEditDescription(d.description);
                      }} className="text-blue-600 hover:underline text-sm">
                        Edit
                      </button>

                      <button onClick={() => handleDelete(d.id)} disabled={loading} className="text-red-500 hover:underline text-sm">
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Always Show Add Debt Button */}
      <div className="fixed bottom-4 left-0 right-0 mx-auto w-[90%] max-w-2xl">
        <button
          onClick={() => document.dispatchEvent(new CustomEvent("openAddDebtForm"))}
          className="w-full bg-blue-600 text-white py-3 rounded-xl shadow-md hover:bg-blue-700 transition"
        >
          + Add Debt
        </button>
      </div>
    </div>
  );
}
