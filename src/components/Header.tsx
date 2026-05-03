"use client";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { User } from "@supabase/supabase-js";

type Props = {
  user: User | null;
  currentMonth: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onSignOut: () => void;
};

export default function Header({ user, currentMonth, onPrevMonth, onNextMonth, onSignOut }: Props) {
  const isCurrentMonth =
    format(currentMonth, "yyyy-MM") === format(new Date(), "yyyy-MM");

  return (
    <header className="sticky top-0 z-30 glass-card border-b border-pink-100 shadow-sm shadow-pink-100">
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
        {/* ロゴ */}
        <div className="flex items-center gap-2">
          <span className="text-2xl select-none">🌸</span>
          <span className="font-extrabold text-pink-400 text-lg hidden sm:block tracking-wide">
            スタンプ帳
          </span>
        </div>

        {/* 月ナビゲーション */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={onPrevMonth}
            className="w-8 h-8 rounded-full hover:bg-pink-100 text-pink-400 flex items-center justify-center transition-colors text-lg"
          >
            ‹
          </button>
          <div className="text-center min-w-[110px]">
            <p className="font-extrabold text-pink-500 text-base sm:text-lg leading-none">
              {format(currentMonth, "yyyy年M月", { locale: ja })}
            </p>
            {isCurrentMonth && (
              <span className="text-xs text-pink-300 font-medium">今月</span>
            )}
          </div>
          <button
            onClick={onNextMonth}
            className="w-8 h-8 rounded-full hover:bg-pink-100 text-pink-400 flex items-center justify-center transition-colors text-lg"
          >
            ›
          </button>
        </div>

        {/* ユーザー */}
        <div className="flex items-center gap-2">
          {user?.user_metadata?.avatar_url ? (
            <img
              src={user.user_metadata.avatar_url}
              alt="avatar"
              className="w-8 h-8 rounded-full border-2 border-pink-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-pink-100 border-2 border-pink-200 flex items-center justify-center text-sm">
              👤
            </div>
          )}
          <button
            onClick={onSignOut}
            className="text-xs text-pink-300 hover:text-pink-500 transition-colors font-medium hidden sm:block"
          >
            ログアウト
          </button>
        </div>
      </div>
    </header>
  );
}
