import moment from "moment";
import { signUpPayload } from "../types/dataTypes";

const url = "http://127.0.0.1:3000";
export const getAuthToken = async (userform: {
  email: string;
  password: string;
}) => {
  return await fetch(url + "/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userform),
  });
};

export const signUpNewUser = async (payload: signUpPayload) => {
  const response = await fetch(url + "/companies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (response.ok) {
    return response.json();
  }
};

export const fetchCustomers = async (token: string) => {
  const response = await fetch(url + "/customers", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.ok) {
    return response.json();
  }
};

export const saveNextDate = async (
  token: string,
  customerId: number,
  date: Date,
  recurring: string
) => {
  const response = await fetch(url + "/customers/create_next_service", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: customerId,
      next_service_date: moment.utc(date).format("HH:mm DD MMMM YYYY"),
      recurring: recurring,
    }),
  });
  if (response.ok) {
    return response.json();
  }
};

export const saveCustomerNote = async (
  token: string,
  customerId: number,
  note: string
) => {
  const response = await fetch(url + "/customers/update_note", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      id: customerId,
      note: note,
    }),
  });
  if (response.ok) {
    return response.json();
  }
};

export const saveCustomer = async (token: string, payload: any) => {
  return await fetch(url + "/customers", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      customer: {
        ...payload,
      },
    }),
  });
};

export const deleteCustomer = async (token: string, id: string) => {
  return await fetch(url + `/customers/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  });
};
