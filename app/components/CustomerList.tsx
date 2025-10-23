"use client";

import { Customer } from "../types"; // optional interface file

interface Props {
  customers: Customer[];
}

export default function CustomerList({ customers  }: Props) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-lg font-semibold mb-2">Your Customers</h2>
      {customers.length === 0 ? (
        <p>No customers yet.</p>
      ) : (
        <ul>
          {customers.map((c) => (
            <li key={c.id} className="border-b py-2">
              <p className="font-medium">{c.name}</p>
              <p className="text-gray-600">{c.phone}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
