"use client";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import type { Habit, Stamp } from "@/types";
import Calendar from "@/components/Calendar";
import HabitManager from "@/components/HabitManager";
import StatsBar from "@/components/StatsBar";
import Header from "@/components/Header";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
} from "date-fns";

const HABIT_COLORS = [
  "#FFB3C6","#FFD6A5","#FDFFB6","#CAFFBF","#9BF6FF","#BDB2FF","#FFC6FF","#FFADAD",
];

export default function HomePage() {
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [stamps, setStamps] = useState<Stamp[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showManager, setShowManager] = useState(false);

  // ユーザー取得
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, []);

  // 習慣一覧取得
  const fetchHabits = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", user.id)
      .order("order");
    if (data) setHabits(data);
  }, [user, supabase]);

  // 当月スタンプ取得
  const fetchStamps = useCallback(async () => {
    if (!user) return;
    const from = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const to   = format(endOfMonth(currentMonth),   "yyyy-MM-dd");
    const { data } = await supabase
      .from("stamps")
      .select("*")
      .eq("user_id", user.id)
      .gte("date", from)
      .lte("date", to);
    if (data) setStamps(data);
  }, [user, currentMonth, supabase]);

  useEffect(() => {
    if (!user) return;
    Promise.all([fetchHabits(), fetchStamps()]).finally(() => setLoading(false));
  }, [user, fetchHabits, fetchStamps]);

  // スタンプを押す / 外す
  const toggleStamp = async (habitId: string, date: string) => {
    if (!user) return;
    const exists = stamps.find(
      (s) => s.habit_id === habitId && s.date === date
    );
    if (exists) {
      await supabase.from("stamps").delete().eq("id", exists.id);
      setStamps((prev) => prev.filter((s) => s.id !== exists.id));
    } else {
      const { data } = await supabase
        .from("stamps")
        .insert({ user_id: user.id, habit_id: habitId, date })
        .select()
        .single();
      if (data) setStamps((prev) => [...prev, data]);
    }
  };

  // 習慣を追加
  const addHabit = async (name: string, emoji: string) => {
    if (!user) return;
    const color = HABIT_COLORS[habits.length % HABIT_COLORS.length];
    const { data } = await supabase
      .from("habits")
      .insert({ user_id: user.id, name, emoji, color, order: habits.length })
      .select()
      .single();
    if (data) setHabits((prev) => [...prev, data]);
  };

  // 習慣を削除
  const deleteHabit = async (id: string) => {
    await supabase.from("habits").delete().eq("id", id);
    setHabits((prev) => prev.filter((h) => h.id !== id));
    setStamps((prev) => prev.filter((s) => s.habit_id !== id));
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // 当月の日付リスト
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end:   endOfMonth(currentMonth),
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-4xl animate-bounce">🌸</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      <Header
        user={user}
        currentMonth={currentMonth}
        onPrevMonth={() => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() - 1))}
        onNextMonth={() => setCurrentMonth((d) => new Date(d.getFullYear(), d.getMonth() + 1))}
        onSignOut={handleSignOut}
      />

      <main className="max-w-5xl mx-auto px-3 sm:px-6 pt-4 space-y-5">
        {/* 統計バー */}
        <StatsBar habits={habits} stamps={stamps} days={days} />

        {/* カレンダー */}
        {habits.length === 0 ? (
          <div className="glass-card rounded-4xl p-10 text-center animate-fade-up">
            <div className="text-5xl mb-3">✨</div>
            <p className="text-pink-400 font-bold text-lg mb-1">
              最初の習慣を追加しよう！
            </p>
            <p className="text-pink-300 text-sm mb-6">
              下のボタンから項目を追加してね
            </p>
            <button
              onClick={() => setShowManager(true)}
              className="bg-pink-400 hover:bg-pink-500 text-white font-bold px-6 py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-md shadow-pink-200"
            >
              ＋ 習慣を追加
            </button>
          </div>
        ) : (
          <Calendar
            habits={habits}
            stamps={stamps}
            days={days}
            currentMonth={currentMonth}
            onToggleStamp={toggleStamp}
          />
        )}
      </main>

      {/* FAB - 習慣管理ボタン */}
      <button
        onClick={() => setShowManager(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-pink-400 hover:bg-pink-500 text-white rounded-full shadow-lg shadow-pink-300 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95 z-40"
        title="習慣を管理"
      >
        ✏️
      </button>

      {/* 習慣管理モーダル */}
      {showManager && (
        <HabitManager
          habits={habits}
          onAdd={addHabit}
          onDelete={deleteHabit}
          onClose={() => setShowManager(false)}
        />
      )}
    </div>
  );
}
