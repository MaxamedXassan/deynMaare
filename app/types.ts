// types.ts
export interface Customer {
  id: number;       // SERIAL INT
  name: string;
  phone: string;
  user_id: string;  // UUID from auth.users
}

export interface Debt {
  id: number;
  customer_id: number; // INT
  amount: number;
  paid: number;
  remaining: number;
  description: string;
  date_given: string;
}
