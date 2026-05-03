"use client";
import { useState } from "react";
import type { Habit } from "@/types";

const EMOJI_OPTIONS = [
  "🏃","💪","📚","🎸","🧘","🥗","💧","😴","✍️","🎨",
  "🎹","🌿","🛁","💊","🧹","🐕","🚴","🏊","⚽","🎯",
];

type Props = {
  habits: Habit[];
  onAdd: (name: string, emoji: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
};

export default function HabitManager({ habits, onAdd, onDelete, onClose }: Props) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("🏃");
  const [adding, setAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!name.trim()) return;
    setAdding(true);
    await onAdd(name.trim(), emoji);
    setName("");
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await onDelete(id);
    setDeletingId(null);
    setShowConfirm(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* オーバーレイ */}
      <div className="absolute inset-0 bg-pink-900/20 backdrop-blur-sm" onClick={onClose} />

      <div className="relative glass-card w-full sm:max-w-md rounded-t-4xl sm:rounded-4xl p-6 shadow-2xl shadow-pink-200 animate-fade-up max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-pink-500">✏️ 習慣を管理</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-pink-100 text-pink-300 flex items-center justify-center text-xl"
          >
            ×
          </button>
        </div>

        {/* 習慣リスト */}
        {habits.length > 0 && (
          <div className="mb-5 space-y-2">
            {habits.map((h) => (
              <div
                key={h.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-2xl"
                style={{ background: h.color + "33" }}
              >
                <span className="text-xl">{h.emoji}</span>
                <span className="flex-1 font-bold text-pink-600 text-sm">{h.name}</span>

                {showConfirm === h.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(h.id)}
                      disabled={deletingId === h.id}
                      className="text-xs bg-red-400 hover:bg-red-500 text-white px-2.5 py-1 rounded-full font-bold transition-colors"
                    >
                      {deletingId === h.id ? "…" : "削除する"}
                    </button>
                    <button
                      onClick={() => setShowConfirm(null)}
                      className="text-xs bg-pink-100 text-pink-400 px-2.5 py-1 rounded-full font-bold"
                    >
                      キャンセル
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowConfirm(h.id)}
                    className="text-xs text-pink-300 hover:text-red-400 transition-colors font-medium px-2 py-1 rounded-full hover:bg-red-50"
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 習慣追加フォーム */}
        <div className="border-t border-pink-100 pt-5">
          <p className="text-xs font-bold text-pink-400 mb-3 uppercase tracking-wide">
            ＋ 新しい習慣を追加
          </p>

          {/* 絵文字選択 */}
          <div className="mb-3">
            <p className="text-xs text-pink-300 mb-2 font-medium">絵文字を選ぶ</p>
            <div className="flex flex-wrap gap-1.5">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-2xl text-lg transition-all ${
                    emoji === e
                      ? "bg-pink-200 scale-110 shadow-sm shadow-pink-200"
                      : "bg-pink-50 hover:bg-pink-100"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>

          {/* 名前入力 */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="習慣の名前（例：毎日運動）"
            maxLength={20}
            className="w-full px-4 py-3 rounded-2xl border-2 border-pink-100 focus:border-pink-300 focus:outline-none bg-white text-pink-600 placeholder-pink-200 font-medium text-sm mb-3 transition-colors"
          />

          <button
            onClick={handleAdd}
            disabled={!name.trim() || adding}
            className="w-full bg-pink-400 hover:bg-pink-500 disabled:bg-pink-200 text-white font-bold py-3 rounded-2xl transition-all hover:scale-105 active:scale-95 disabled:scale-100"
          >
            {adding ? "追加中..." : `${emoji} 追加する`}
          </button>
        </div>
      </div>
    </div>
  );
}
