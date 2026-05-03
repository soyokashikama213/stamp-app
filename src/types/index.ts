export type Habit = {
  id: string;
  user_id: string;
  name: string;
  emoji: string;
  color: string;
  order: number;
  created_at: string;
};

export type Stamp = {
  id: string;
  user_id: string;
  habit_id: string;
  date: string; // YYYY-MM-DD
  created_at: string;
};

export type HabitWithStamps = Habit & {
  stamps: Stamp[];
};
