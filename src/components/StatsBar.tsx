"use client";
import { format, subDays, isToday, parseISO } from "date-fns";
import type { Habit, Stamp } from "@/types";

type Props = {
  habits: Habit[];
  stamps: Stamp[];
  days: Date[];
};

function calcStreak(habitId: string, stamps: Stamp[]): number {
  const stamped = new Set(
    stamps.filter((s) => s.habit_id === habitId).map((s) => s.date)
  );
  let streak = 0;
  let cursor = new Date();
  // 今日がまだスタンプされていなければ昨日から数え始める
  if (!stamped.has(format(cursor, "yyyy-MM-dd"))) {
    cursor = subDays(cursor, 1);
  }
  while (stamped.has(format(cursor, "yyyy-MM-dd"))) {
    streak++;
    cursor = subDays(cursor, 1);
  }
  return streak;
}

function totalRate(habits: Habit[], stamps: Stamp[], days: Date[]): number {
  if (habits.length === 0 || days.length === 0) return 0;
  const today = format(new Date(), "yyyy-MM-dd");
  const pastDays = days.filter((d) => format(d, "yyyy-MM-dd") <= today);
  const total = pastDays.length * habits.length;
  if (total === 0) return 0;
  const done = stamps.filter((s) =>
    pastDays.some((d) => format(d, "yyyy-MM-dd") === s.date)
  ).length;
  return Math.round((done / total) * 100);
}

export default function StatsBar({ habits, stamps, days }: Props) {
  const rate = totalRate(habits, stamps, days);
  const today = format(new Date(), "yyyy-MM-dd");
  const todayDone = habits.filter((h) =>
    stamps.some((s) => s.habit_id === h.id && s.date === today)
  ).length;
  const todayTotal = habits.length;

  // 今月の連続達成（全習慣をその日に達成した日）
  const allDoneStreak = (() => {
    let streak = 0;
    let cursor = new Date();
    if (
      !days.some((d) => isToday(d)) ||
      habits.length === 0
    ) return 0;

    const allDoneOnDate = (date: Date) => {
      const d = format(date, "yyyy-MM-dd");
      return habits.every((h) => stamps.some((s) => s.habit_id === h.id && s.date === d));
    };

    if (!allDoneOnDate(cursor)) cursor = subDays(cursor, 1);
    while (
      days.some((d) => format(d, "yyyy-MM-dd") === format(cursor, "yyyy-MM-dd")) &&
      allDoneOnDate(cursor)
    ) {
      streak++;
      cursor = subDays(cursor, 1);
    }
    return streak;
  })();

  if (habits.length === 0) return null;

  return (
    <div className="glass-card rounded-3xl p-4 sm:p-5 animate-fade-up">
      <div className="flex flex-wrap gap-3 sm:gap-5 mb-3 items-center">
        {/* 今日の達成 */}
        <div className="flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <div>
            <p className="text-[10px] text-pink-300 font-medium leading-none mb-0.5">今日</p>
            <p className="font-extrabold text-pink-500 text-base leading-none">
              {todayDone}
              <span className="text-pink-300 font-medium text-sm">/{todayTotal}</span>
            </p>
          </div>
        </div>

        <div className="w-px h-8 bg-pink-100" />

        {/* 達成率 */}
        <div className="flex items-center gap-2">
          <span className="text-xl">📊</span>
          <div>
            <p className="text-[10px] text-pink-300 font-medium leading-none mb-0.5">今月達成率</p>
            <p className="font-extrabold text-pink-500 text-base leading-none">{rate}%</p>
          </div>
        </div>

        <div className="w-px h-8 bg-pink-100" />

        {/* 連続日数 */}
        <div className="flex items-center gap-2">
          <span className="text-xl">🔥</span>
          <div>
            <p className="text-[10px] text-pink-300 font-medium leading-none mb-0.5">連続全達成</p>
            <p className="font-extrabold text-pink-500 text-base leading-none">
              {allDoneStreak}
              <span className="text-pink-300 font-medium text-sm">日</span>
            </p>
          </div>
        </div>

        {/* 個別ストリーク */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          {habits.map((h) => {
            const streak = calcStreak(h.id, stamps);
            return (
              <div
                key={h.id}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{ background: h.color + "55", color: "#c0628a" }}
              >
                <span>{h.emoji}</span>
                <span>{streak}日</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 達成率プログレスバー */}
      <div className="h-2.5 bg-pink-100 rounded-full overflow-hidden">
        <div
          className="h-full progress-bar rounded-full transition-all duration-700"
          style={{ width: `${rate}%` }}
        />
      </div>

      {rate < 50 && (
        <p className="text-[10px] text-amber-400 font-bold mt-1.5 text-right animate-pulse">
          💪 もう少し！達成率50%を目指そう
        </p>
      )}
      {rate >= 80 && (
        <p className="text-[10px] text-pink-400 font-bold mt-1.5 text-right">
          🎉 素晴らしい！この調子で続けよう✨
        </p>
      )}
    </div>
  );
}
