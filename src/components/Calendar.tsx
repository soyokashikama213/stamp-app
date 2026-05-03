"use client";
import { useState, useCallback, useRef } from "react";
import { format, isToday, isFuture, getDay } from "date-fns";
import { ja } from "date-fns/locale";
import type { Habit, Stamp } from "@/types";

const WEEKDAYS = ["日","月","火","水","木","金","土"];

type Props = {
  habits: Habit[];
  stamps: Stamp[];
  days: Date[];
  currentMonth: Date;
  onToggleStamp: (habitId: string, date: string) => Promise<void>;
};

type StampKey = `${string}|${string}`;

// ポワンアニメーション用のキーセット
export default function Calendar({ habits, stamps, days, onToggleStamp }: Props) {
  const [animatingKeys, setAnimatingKeys] = useState<Set<StampKey>>(new Set());
  const [pendingKeys, setPendingKeys] = useState<Set<StampKey>>(new Set());

  const isStamped = useCallback(
    (habitId: string, date: string) =>
      stamps.some((s) => s.habit_id === habitId && s.date === date),
    [stamps]
  );

  const handleStamp = async (habitId: string, date: string) => {
    const key: StampKey = `${habitId}|${date}`;
    if (pendingKeys.has(key)) return;

    // スタンプを押すときだけアニメーション
    const willStamp = !isStamped(habitId, date);
    if (willStamp) {
      setAnimatingKeys((prev) => new Set(prev).add(key));
      setTimeout(() => {
        setAnimatingKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, 500);
    }

    setPendingKeys((prev) => new Set(prev).add(key));
    await onToggleStamp(habitId, date);
    setPendingKeys((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
  };

  // 月の最初の曜日に合わせてオフセット
  const firstWeekday = getDay(days[0]);

  return (
    <div className="glass-card rounded-4xl overflow-hidden animate-fade-up">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 border-b border-pink-100">
        {WEEKDAYS.map((w, i) => (
          <div
            key={w}
            className={`py-2 text-center text-xs font-bold ${
              i === 0 ? "text-red-400" : i === 6 ? "text-blue-400" : "text-pink-300"
            }`}
          >
            {w}
          </div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7">
        {/* 空白セル（オフセット） */}
        {Array.from({ length: firstWeekday }).map((_, i) => (
          <div key={`empty-${i}`} className="border-r border-b border-pink-50" />
        ))}

        {days.map((day, idx) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const isT = isToday(day);
          const isFut = isFuture(day);
          const weekday = getDay(day);

          // 当日までの達成率
          const dayStamps = stamps.filter((s) => s.date === dateStr);
          const doneCount = dayStamps.length;
          const allDone = !isFut && doneCount === habits.length && habits.length > 0;
          const noneDone = !isFut && doneCount === 0 && habits.length > 0;

          return (
            <div
              key={dateStr}
              className={`border-r border-b border-pink-50 p-1.5 sm:p-2 min-h-[80px] sm:min-h-[100px] transition-colors ${
                isT ? "bg-pink-50" : ""
              } ${allDone ? "bg-gradient-to-br from-pink-50 to-rose-50" : ""} ${
                noneDone && !isFut ? "bg-amber-50/40" : ""
              }`}
            >
              {/* 日付番号 */}
              <div className="flex items-center justify-between mb-1">
                <span
                  className={`text-xs sm:text-sm font-bold leading-none ${
                    isT
                      ? "w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-pink-400 text-white flex items-center justify-center text-[10px] sm:text-xs"
                      : weekday === 0
                      ? "text-red-400"
                      : weekday === 6
                      ? "text-blue-400"
                      : "text-pink-400"
                  }`}
                >
                  {format(day, "d")}
                </span>
                {allDone && (
                  <span className="text-[10px] select-none">🌟</span>
                )}
              </div>

              {/* スタンプボタン群 */}
              <div className="flex flex-wrap gap-0.5 sm:gap-1">
                {habits.map((habit) => {
                  const key: StampKey = `${habit.id}|${dateStr}`;
                  const stamped = isStamped(habit.id, dateStr);
                  const animating = animatingKeys.has(key);

                  return (
                    <button
                      key={habit.id}
                      onClick={() => !isFut && handleStamp(habit.id, dateStr)}
                      disabled={isFut}
                      title={habit.name}
                      className={`stamp-btn w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm
                        transition-all duration-150 select-none
                        ${
                          stamped
                            ? "shadow-md"
                            : "opacity-25 hover:opacity-50 bg-gray-100"
                        }
                        ${isFut ? "cursor-default opacity-10" : "cursor-pointer"}
                        ${animating ? "animate-powa" : ""}
                      `}
                      style={
                        stamped
                          ? { background: habit.color, boxShadow: `0 2px 8px ${habit.color}88` }
                          : {}
                      }
                    >
                      {stamped ? habit.emoji : <span className="opacity-40 text-[8px] sm:text-[10px]">{habit.emoji}</span>}
                    </button>
                  );
                })}
              </div>

              {/* 未達成の警告（過去の日） */}
              {noneDone && !isT && (
                <div className="mt-0.5 text-[8px] text-amber-400 font-bold">
                  …
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="px-4 py-3 border-t border-pink-100 flex flex-wrap gap-3">
        {habits.map((h) => (
          <div key={h.id} className="flex items-center gap-1.5 text-xs text-pink-400 font-medium">
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-sm"
              style={{ background: h.color }}
            >
              {h.emoji}
            </span>
            {h.name}
          </div>
        ))}
      </div>
    </div>
  );
}
