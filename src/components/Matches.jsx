import { useEffect, useMemo, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL;

export default function Matches({ token }) {
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const r = await fetch(`${API}/matches`, { headers });
      const data = await r.json();
      setItems(data.matches || []);
    } catch (e) {
      // ignore
    }
  };
  useEffect(()=>{ load(); }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      {items.map((u)=> (
        <div key={u.id} className="bg-white/10 border border-white/10 rounded-2xl p-4">
          <div className="h-32 rounded-xl bg-cover bg-center mb-3" style={{backgroundImage: u.photos?.[0] ? `url(${u.photos[0]})` : undefined}} />
          <div className="text-white font-semibold">{u.name}</div>
          {u.location && <div className="text-blue-300 text-sm">{u.location}</div>}
        </div>
      ))}
      {!items.length && <div className="text-blue-200">No matches yet. Keep swiping!</div>}
    </div>
  );
}
