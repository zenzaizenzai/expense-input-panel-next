import React, { useState } from 'react';

interface CalendarPickerProps {
  selectedDate: string; // 'YYYY-MM-DD'
  onSelectDate: (date: string) => void;
}

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土'];

const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedDate, onSelectDate }) => {
  const parseDate = (dStr: string) => {
    const parts = dStr.split('-').map(Number);
    return new Date(parts[0], parts[1] - 1, parts[2] || 1);
  };

  const initialDate = parseDate(selectedDate);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-11

  const today = new Date();
  const formatYMD = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const todayStr = formatYMD(today);

  const currentObj = parseDate(selectedDate);
  const weekdayName = WEEKDAYS[currentObj.getDay()];

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear(y => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear(y => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const handleToday = () => {
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    onSelectDate(todayStr);
  };

  const handleOffsetDay = (offset: number) => {
    const d = parseDate(selectedDate);
    d.setDate(d.getDate() + offset);
    const newStr = formatYMD(d);
    onSelectDate(newStr);
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  };

  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const calendarCells: { day: number; dateStr: string; isCurrentMonth: boolean }[] = [];

  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const d = daysInPrevMonth - i;
    const prevDate = new Date(viewYear, viewMonth - 1, d);
    calendarCells.push({
      day: d,
      dateStr: formatYMD(prevDate),
      isCurrentMonth: false,
    });
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const curDate = new Date(viewYear, viewMonth, d);
    calendarCells.push({
      day: d,
      dateStr: formatYMD(curDate),
      isCurrentMonth: true,
    });
  }

  const remaining = 7 - (calendarCells.length % 7);
  if (remaining < 7) {
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(viewYear, viewMonth + 1, d);
      calendarCells.push({
        day: d,
        dateStr: formatYMD(nextDate),
        isCurrentMonth: false,
      });
    }
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md border border-indigo-100 p-4 sm:p-5 mb-6 transition-all">
      {/* 上段ヘッダー：選択中日付とクイックボタン */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <span className="text-xl">📅</span>
          <div>
            <div className="text-xs text-slate-400 font-medium">入力日</div>
            <div className="text-base sm:text-lg font-bold text-slate-800">
              {currentObj.getFullYear()}年{currentObj.getMonth() + 1}月{currentObj.getDate()}日
              <span className={`ml-1 text-sm font-semibold ${
                currentObj.getDay() === 0 ? 'text-red-500' : currentObj.getDay() === 6 ? 'text-blue-500' : 'text-slate-600'
              }`}>
                ({weekdayName})
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handleOffsetDay(-1)}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            title="前日へ"
          >
            ◀ 前日
          </button>
          <button
            type="button"
            onClick={handleToday}
            className={`px-3 py-1 text-xs font-semibold rounded transition ${
              selectedDate === todayStr
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
            }`}
          >
            今日
          </button>
          <button
            type="button"
            onClick={() => handleOffsetDay(1)}
            className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            title="翌日へ"
          >
            翌日 ▶
          </button>
        </div>
      </div>

      {/* 中段：年月操作バー */}
      <div className="flex items-center justify-between py-3">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
          aria-label="前月"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <span className="text-base font-bold text-slate-700 tracking-wide">
          {viewYear}年 {viewMonth + 1}月
        </span>

        <button
          type="button"
          onClick={handleNextMonth}
          className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition"
          aria-label="次月"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* 下段：カレンダーグリッド */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((wd, idx) => (
          <div
            key={wd}
            className={`text-xs font-bold py-1.5 ${
              idx === 0 ? 'text-red-500' : idx === 6 ? 'text-blue-500' : 'text-slate-400'
            }`}
          >
            {wd}
          </div>
        ))}

        {calendarCells.map((cell, idx) => {
          const isSelected = cell.dateStr === selectedDate;
          const isToday = cell.dateStr === todayStr;
          const dayOfWeek = idx % 7;

          let textColor = cell.isCurrentMonth
            ? dayOfWeek === 0 ? 'text-red-500' : dayOfWeek === 6 ? 'text-blue-500' : 'text-slate-700'
            : 'text-slate-300';

          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => onSelectDate(cell.dateStr)}
              className={`
                h-9 sm:h-10 rounded-lg text-sm font-semibold flex items-center justify-center relative transition-all
                ${isSelected
                  ? '!bg-indigo-600 !text-white shadow-md scale-105 z-10'
                  : 'hover:bg-indigo-50 hover:text-indigo-600'
                }
                ${isToday && !isSelected ? 'ring-2 ring-indigo-400 font-bold' : ''}
                ${textColor}
              `}
            >
              <span>{cell.day}</span>
              {isToday && !isSelected && (
                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-indigo-500"></span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarPicker;
