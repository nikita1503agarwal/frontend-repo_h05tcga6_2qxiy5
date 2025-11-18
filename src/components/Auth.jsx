import { useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Auth({ onAuthed }) {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (mode === "signup") {
        const r = await fetch(`${API}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });
        if (!r.ok) throw new Error((await r.json()).detail || "Signup failed");
      }
      const r2 = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await r2.json();
      if (!r2.ok) throw new Error(data.detail || "Login failed");
      localStorage.setItem("token", data.token);
      onAuthed({ token: data.token, user: data.user });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-white">
      <h2 className="text-2xl font-bold mb-4">{mode === "login" ? "Welcome back" : "Create account"}</h2>
      {error && <div className="mb-3 text-red-300 text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        {mode === "signup" && (
          <input className="w-full bg-white/10 p-3 rounded-xl outline-none" placeholder="Full name" value={name} onChange={(e)=>setName(e.target.value)} />
        )}
        <input className="w-full bg-white/10 p-3 rounded-xl outline-none" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full bg-white/10 p-3 rounded-xl outline-none" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 transition p-3 rounded-xl font-semibold">
          {loading ? "Please wait..." : mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>
      <div className="mt-4 text-sm text-blue-200">
        {mode === "login" ? (
          <button className="underline" onClick={()=>setMode("signup")}>Need an account? Sign up</button>
        ) : (
          <button className="underline" onClick={()=>setMode("login")}>Have an account? Log in</button>
        )}
      </div>
    </div>
  );
}
