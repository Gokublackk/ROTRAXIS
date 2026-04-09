const submit = async () => {
  if (!form.name || !form.email || !form.message) {
    return alert("Please fill in required fields.");
  }

  try {
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      setDone(true);
    } else {
      alert(data.message || "Error sending message");
    }

  } catch (err) {
    setLoading(false);
    console.error(err);
    alert("Server error");
  }
};