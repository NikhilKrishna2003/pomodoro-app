const KEY = "nikhub_daily_analytics";

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getTodayAnalytics() {
  const raw = localStorage.getItem(KEY);
  const data = raw ? JSON.parse(raw) : {};
  const today = todayKey();

  if (!data[today]) {
    data[today] = {
      date: today,
      pomodoros: 0,
      focusMinutes: 0,
      breaks: 0,
    };
    localStorage.setItem(KEY, JSON.stringify(data));
  }

  return data[today];
}

export function updateTodayAnalytics(fn) {
  const raw = localStorage.getItem(KEY);
  const data = raw ? JSON.parse(raw) : {};
  const today = todayKey();

  const current = data[today] || {
    date: today,
    pomodoros: 0,
    focusMinutes: 0,
    breaks: 0,
  };

  fn(current);
  data[today] = current;
  localStorage.setItem(KEY, JSON.stringify(data));
}
