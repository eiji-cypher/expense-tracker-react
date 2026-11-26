import { useState, useMemo } from "react";
import { formatMoney } from "../../utils/format.js";

export default function WaveChart({ transactions = [], currentSpend = 0 }) {
  const monthlyData = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const months = [];
    for (let m = 0; m < 12; m++) {
      const d = new Date(year, m, 1);
      const monthNum = String(m + 1).padStart(2, "0");
      const key = `${year}-${monthNum}`;
      const label = d.toLocaleString("en-US", { month: "short" });
      const fullDate = d.toLocaleString("en-US", { month: "long", year: "numeric" });

      const monthExpenses = transactions.filter(
        (t) => (t.isExpense ? t.isExpense() : t.type === "Expense") && String(t.date).startsWith(key)
      );
      const spend = monthExpenses.reduce((sum, t) => sum + Number(t.amount || 0), 0);

      months.push({
        key,
        label,
        date: fullDate,
        spend,
        count: monthExpenses.length,
      });
    }
    return months;
  }, [transactions]);

  const [hoverIndex, setHoverIndex] = useState(() => new Date().getMonth());

  const width = 340;
  const height = 120;
  const paddingX = 18;

  const maxSpend = useMemo(() => {
    const spends = monthlyData.map((m) => m.spend);
    return Math.max(...spends, currentSpend, 1);
  }, [monthlyData, currentSpend]);

  const hasAnyExpenses = useMemo(() => {
    return monthlyData.some((m) => m.spend > 0) || currentSpend > 0;
  }, [monthlyData, currentSpend]);

  const steps = 60;
  const pointsWave1 = [];
  const pointsWave2 = [];
  const pointsWave3 = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = paddingX + t * (width - 2 * paddingX);

    const amplitudeFactor = hasAnyExpenses ? Math.min(maxSpend / 1000, 1) : 0;

    const y1 = 70 + Math.sin(t * Math.PI * 4 - 0.4) * (18 * amplitudeFactor);
    const y2 = 70 + Math.sin(t * Math.PI * 3 + 1.2) * (14 * amplitudeFactor);
    const y3 = 70 + Math.cos(t * Math.PI * 3.5) * (10 * amplitudeFactor);

    pointsWave1.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y1.toFixed(1)}`);
    pointsWave2.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y2.toFixed(1)}`);
    pointsWave3.push(`${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y3.toFixed(1)}`);
  }

  const path1 = pointsWave1.join(" ");
  const path2 = pointsWave2.join(" ");
  const path3 = pointsWave3.join(" ");

  const safeIndex = Math.min(Math.max(hoverIndex, 0), monthlyData.length - 1);
  const targetT = safeIndex / (monthlyData.length - 1);
  const markerX = paddingX + targetT * (width - 2 * paddingX);
  const amplitudeFactor = hasAnyExpenses ? Math.min(maxSpend / 1000, 1) : 0;
  const markerY = 70 + Math.sin(targetT * Math.PI * 4 - 0.4) * (18 * amplitudeFactor);

  const activeMonth = monthlyData[safeIndex] || {
    label: "Now",
    date: "Current Month",
    spend: currentSpend,
    count: 0,
  };

  const displayAmount = activeMonth.spend;

  return (
    <div className="wave-chart-container">
      <div className="wave-chart-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="wave-svg"
          preserveAspectRatio="none"
        >
          <path
            d={path3}
            fill="none"
            stroke="#e4e8ef"
            strokeWidth="1.2"
            strokeLinecap="round"
          />

          <path
            d={path2}
            fill="none"
            stroke="#c8ced9"
            strokeWidth="1.6"
            strokeLinecap="round"
          />

          <path
            d={path1}
            fill="none"
            stroke="#181c24"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          <line
            x1={markerX}
            y1={markerY}
            x2={markerX}
            y2={height - 10}
            stroke="#9fa6b4"
            strokeWidth="1.2"
          />

          <circle
            cx={markerX}
            cy={markerY}
            r="4.5"
            fill="#181c24"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>

        <div
          className="wave-tooltip-pill"
          style={{
            left: `${(markerX / width) * 100}%`,
            top: `${(markerY / height) * 100 - 32}%`,
          }}
        >
          {formatMoney(displayAmount)}
        </div>
      </div>

      <div className="chart-months-row">
        {monthlyData.map((m, idx) => (
          <button
            key={m.key}
            type="button"
            className={`month-label-btn ${idx === safeIndex ? "active" : ""}`}
            onClick={() => setHoverIndex(idx)}
            onMouseEnter={() => setHoverIndex(idx)}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
