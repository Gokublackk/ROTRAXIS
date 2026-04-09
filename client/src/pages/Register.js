import { useState } from "react";
import API from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    name: "", email: "", password: ""
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async () => {
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      alert("Registered Successfully");
    } catch (err) {
      alert("Error");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Register</h2>

      <input name="name" placeholder="Name" onChange={handleChange} /><br />
      <input name="email" placeholder="Email" onChange={handleChange} /><br />
      <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />

      <button onClick={submit}>Register</button>
    </div>
  );
}