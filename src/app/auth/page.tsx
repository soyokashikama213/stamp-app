"use client";
import { createClient } from "@/lib/supabase";
import { useState, useEffect } from "react"; // ← ここ追加
import { useRouter } from "next/navigation"; // ← ここ追加

export default function AuthPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const router = useRouter(); 

  useEffect(() => {
  const init = async () => {
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
      router.replace("/auth");
    } else {
      setUser(session.user);
    }

    setLoading(false);
  };

  init();

  const { data: { subscription } } =
    supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setUser(session.user);
      } else {
        router.replace("/auth");
      }
    });

  return () => subscription.unsubscribe();
}, []);

 const handleGoogleLogin = async () => {
  setLoading(true);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error);
    alert("ログイン失敗");
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-5xl p-10 max-w-sm w-full text-center shadow-xl shadow-pink-100">
        <div className="text-6xl mb-4 select-none">🌸</div>
        <h1 className="text-2xl font-extrabold text-pink-400 mb-1 tracking-wide">
          スタンプ帳
        </h1>
        <p className="text-sm text-pink-300 mb-8 font-medium">
          毎日の達成を、かわいくスタンプ！
        </p>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-pink-50 border-2 border-pink-200 text-pink-500 font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md disabled:opacity-50"
        >
          {loading ? "ログイン中..." : "Googleでログイン"}
        </button>

        <p className="mt-6 text-xs text-pink-200 font-medium">
          ログインすると達成記録がクラウドに保存されます✨
        </p>
      </div>
    </div>
  );
}
