// types.ts
// export interface Customer {
//   id: number;       // SERIAL INT
//   name: string;
//   phone: string;
//   user_id: string;  // UUID from auth.users
// }


export interface Props {
  customers: Customer[];
  onRefresh: () => void;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
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


// interface Props {
//   customers: Customer[];
//   onRefresh: () => void;
// }