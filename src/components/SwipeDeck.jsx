import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_BACKEND_URL;

function Card({ profile, onDragEnd }) {
  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(e, info) => onDragEnd(info.offset.x)}
      className="absolute w-full h-full bg-white/10 backdrop-blur border border-white/10 rounded-3xl p-6 text-white shadow-xl"
      style={{ backgroundImage: profile.photos?.[0] ? `url(${profile.photos[0]})` : undefined, backgroundSize: 'cover', backgroundPosition: 'center' }}
    >
      <div className="bg-black/40 p-4 rounded-2xl inline-block">
        <div className="text-2xl font-bold">{profile.name}</div>
        {profile.location && <div className="text-sm text-blue-200">{profile.location}</div>}
      </div>
    </motion.div>
  );
}

export default function SwipeDeck({ token }) {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  const load = async () => {
    setLoading(true);
    setMessage("");
    try {
      const r = await fetch(`${API}/discover`, { headers });
      const data = await r.json();
      setQueue(data.profiles || []);
    } catch (e) {
      setMessage("Failed to load profiles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSwipe = async (dir) => {
    if (!queue.length) return;
    const [top, ...rest] = queue;
    setQueue(rest);
    try {
      const r = await fetch(`${API}/swipe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...headers },
        body: JSON.stringify({ target_id: top.id, action: dir === 'right' ? 'like' : 'pass' })
      });
      const data = await r.json();
      if (data.match) {
        setMessage(`It's a match with ${top.name}!`);
      }
      if (rest.length < 3) load();
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="relative w-full max-w-md aspect-[3/4] mx-auto">
      <div className="absolute inset-0">
        <AnimatePresence>
          {queue.slice(0, 3).map((p, idx) => (
            <Card key={p.id} profile={p} onDragEnd={(x)=> handleSwipe(x>50 ? 'right' : x<-50 ? 'left' : 'none')} />
          ))}
        </AnimatePresence>
        {!queue.length && !loading && (
          <div className="w-full h-full flex items-center justify-center text-blue-200">No more profiles. Check back later.</div>
        )}
        {loading && (
          <div className="w-full h-full flex items-center justify-center text-blue-200">Loading...</div>
        )}
      </div>
      <div className="flex justify-center gap-6 mt-4">
        <button onClick={()=>handleSwipe('left')} className="px-6 py-3 rounded-full bg-white/10 border border-white/10 text-white">Pass</button>
        <button onClick={()=>handleSwipe('right')} className="px-6 py-3 rounded-full bg-pink-600 text-white">Like</button>
      </div>
      {message && <div className="mt-3 text-center text-green-300">{message}</div>}
    </div>
  );
}
