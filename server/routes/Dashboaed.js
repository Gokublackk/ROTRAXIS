import { useEffect, useState } from "react";

export default function Dashboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/contact")
      .then(res => res.json())
      .then(setData);
  }, []);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      {data.map((item, i) => (
        <div key={i} style={{border: "1px solid #ccc", margin: 10, padding: 10}}>
          <p><b>Name:</b> {item.name}</p>
          <p><b>Email:</b> {item.email}</p>
          <p><b>Message:</b> {item.message}</p>
        </div>
      ))}
    </div>
  );
}