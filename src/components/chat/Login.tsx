import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Login = ({ onSubmit }: { onSubmit: (userName: string) => void }) => {
  const [name, setName] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const u = name.trim();
    onSubmit(u);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.25),transparent_60%),radial-gradient(800px_400px_at_80%_10%,rgba(34,211,238,0.22),transparent_60%),linear-gradient(to_bottom_right,#0B1220,#0B0F1A)]">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 24 }}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-6 shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-300">
            Realtime Chat
          </div>
          <p className="text-sm text-white/70 mt-1">Enter a username to join</p>
        </div>
        <div className="space-y-3">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your username"
            className="w-full rounded-xl bg-white/5 text-white placeholder:text-white/60 px-4 py-3 outline-none border border-white/10 focus:border-white/20 focus:ring-2 focus:ring-white/10"
          />
          <Button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-tr from-indigo-500 to-cyan-500 text-white shadow-[0_10px_30px_-10px_rgba(99,102,241,0.6)] hover:opacity-90"
          >
            Join Chat
          </Button>
        </div>
        <div className="mt-4 text-xs text-white/60">
          Tips: Use /dm &lt;user&gt; &lt;message&gt; to send a private message
        </div>
      </motion.form>
    </div>
  );
};

export default Login;
