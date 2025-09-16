import { useState } from "react";
import { Link } from "react-router-dom"; // Assuming you have React Router for navigation
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear any previous errors

    try {
      const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, phone }),
      });

      if (response.ok) {
        // Handle successful registration
        console.log("Registration successful!");
        alert("Registration successful! You can now log in.");
        // You might want to redirect to the login page or home page
      } else {
        // Handle registration failure
        const errorText = await response.text();
        setError(errorText || "Registration failed. Please try again.");
      }
    } catch (err) {
      // Handle network or other errors
      setError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-10 bg-white shadow p-6 rounded"
    >
      <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Username"
        className="w-full border p-2 mb-3 rounded"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        className="w-full border p-2 mb-3 rounded"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full border p-2 mb-3 rounded"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="tel"
        placeholder="Phone (optional)"
        className="w-full border p-2 mb-3 rounded"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
      >
        Register
      </button>
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login here</Link>
      </p>
    </form>
  );
}

export default Register;