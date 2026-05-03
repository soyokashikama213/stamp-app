"use client";
import { createClient } from "@/lib/supabase";
import { useState } from "react";

export default function AuthPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-card rounded-5xl p-10 max-w-sm w-full text-center shadow-xl shadow-pink-100">
        {/* ロゴ */}
        <div className="text-6xl mb-4 select-none">🌸</div>
        <h1 className="text-2xl font-extrabold text-pink-400 mb-1 tracking-wide">
          スタンプ帳
        </h1>
        <p className="text-sm text-pink-300 mb-8 font-medium">
          毎日の達成を、かわいくスタンプ！
        </p>

        {/* ログインボタン */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-pink-50 border-2 border-pink-200 text-pink-500 font-bold py-3.5 px-6 rounded-2xl transition-all duration-200 hover:scale-105 active:scale-95 shadow-md disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.26 9.77A7.5 7.5 0 0 1 12 4.5c1.9 0 3.63.7 4.96 1.84l3.7-3.7A12 12 0 0 0 12 0C7.37 0 3.36 2.7 1.28 6.67l3.98 3.1Z"/>
            <path fill="#34A853" d="M16.04 18.01A7.5 7.5 0 0 1 12 19.5a7.5 7.5 0 0 1-6.72-4.16l-3.99 3.07A12 12 0 0 0 12 24c3.24 0 6.17-1.22 8.39-3.22l-4.35-2.77Z"/>
            <path fill="#FBBC05" d="M19.5 12c0-.66-.06-1.3-.17-1.92H12v3.63h4.2a3.6 3.6 0 0 1-1.56 2.37l4.35 2.77A11.94 11.94 0 0 0 19.5 12Z"/>
            <path fill="#4285F4" d="M5.28 14.34A7.44 7.44 0 0 1 4.5 12c0-.81.14-1.6.38-2.34l-3.6-2.99A12 12 0 0 0 0 12c0 1.93.46 3.76 1.28 5.38l4-3.04Z"/>
          </svg>
          {loading ? "ログイン中..." : "Googleでログイン"}
        </button>

        <p className="mt-6 text-xs text-pink-200 font-medium">
          ログインすると達成記録がクラウドに保存されます✨
        </p>
      </div>
    </div>
  );
}
