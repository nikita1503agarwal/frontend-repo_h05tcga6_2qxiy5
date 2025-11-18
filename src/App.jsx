import { useEffect, useState } from "react";
import Auth from "./components/Auth.jsx";
import SwipeDeck from "./components/SwipeDeck.jsx";
import Matches from "./components/Matches.jsx";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [tab, setTab] = useState("swipe");
  const [me, setMe] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem("token");
    if (!t) return;
    const loadMe = async () => {
      try {
        const r = await fetch(`${import.meta.env.VITE_BACKEND_URL}/me`, { headers: { Authorization: `Bearer ${t}` } });
        if (r.ok) setMe(await r.json());
      } catch (e) {}
    };
    loadMe();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
        <div className="max-w-6xl mx-auto">
          <header className="flex items-center justify-between py-4">
            <h1 className="text-white text-2xl font-bold">Flames Matrimony</h1>
          </header>
          <div className="mt-10">
            <Auth onAuthed={({ token }) => setToken(token)} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between py-4">
          <h1 className="text-white text-2xl font-bold">Flames Matrimony</h1>
          <div className="flex items-center gap-3">
            <button onClick={()=>setTab("swipe")} className={`px-4 py-2 rounded-full ${tab==='swipe' ? 'bg-white/20 text-white' : 'text-blue-200 hover:text-white'}`}>Swipe</button>
            <button onClick={()=>setTab("matches")} className={`px-4 py-2 rounded-full ${tab==='matches' ? 'bg-white/20 text-white' : 'text-blue-200 hover:text-white'}`}>Matches</button>
            <button onClick={handleLogout} className="px-4 py-2 rounded-full bg-white/10 text-white">Logout</button>
          </div>
        </header>

        {tab === "swipe" && <SwipeDeck token={token} />}
        {tab === "matches" && <div className="mt-6"><Matches token={token} /></div>}
      </div>
    </div>
  );
}

export default App
