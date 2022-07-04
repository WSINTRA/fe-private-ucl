import moment from "moment";

const url = "http://127.0.0.1:3000";
export const getAuthToken = async (userform: {
  email: string;
  password: string;
}) => {
  let res = await fetch(url + "/authenticate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userform),
  });
  if (res.ok) {
    return res;
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
  date: Date
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
    }),
  });
  if (response.ok) {
    return response.json();
  }
};
