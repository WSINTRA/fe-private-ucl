import moment from "moment";

const url = "http://127.0.0.1:3000";
export const submitLogin = async (userform: {
  username: string;
  password: string;
}) => {
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(userform), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
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
