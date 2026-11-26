import { useState, useMemo } from "react";
import { formatMoney } from "../../utils/format.js";

export default function SplineChart({ transactions = [] }) {
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

      const monthTx = transactions.filter((t) => String(t.date).startsWith(key));
      const income = monthTx
        .filter((t) => (t.isIncome ? t.isIncome() : t.type === "Income"))
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const expense = monthTx
        .filter((t) => (t.isExpense ? t.isExpense() : t.type === "Expense"))
        .reduce((sum, t) => sum + Number(t.amount || 0), 0);
      const net = income - expense;

      months.push({
        key,
        label,
        date: fullDate,
        amount: net,
        income,
        expense,
        count: monthTx.length,
      });
    }
    return months;
  }, [transactions]);

  const [hoverIndex, setHoverIndex] = useState(() => new Date().getMonth());

  const width = 340;
  const height = 150;
  const paddingX = 18;
  const paddingBottom = 20;
  const paddingTop = 32;

  const maxAbs = useMemo(() => {
    const vals = monthlyData.map((m) => Math.abs(m.amount));
    return Math.max(...vals, 1);
  }, [monthlyData]);

  const hasData = useMemo(() => {
    return monthlyData.some((m) => m.count > 0);
  }, [monthlyData]);

  const points = monthlyData.map((m, index) => {
    const x = paddingX + (index / (monthlyData.length - 1)) * (width - 2 * paddingX);
    const normalized = hasData ? (m.amount + maxAbs) / (2 * maxAbs) : 0.5;
    const y = height - paddingBottom - normalized * (height - paddingTop - paddingBottom);
    return { ...m, x, y };
  });

  const buildSmoothPath = (pts) => {
    if (!pts.length) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2] || p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`;
    }
    return d;
  };

  const linePath = buildSmoothPath(points);
  const areaPath = points.length
    ? `${linePath} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`
    : "";

  const safeIndex = Math.min(Math.max(hoverIndex, 0), points.length - 1);
  const activePoint = points[safeIndex] || points[points.length - 1] || {
    x: width / 2,
    y: height / 2,
    amount: 0,
    date: "Current Month",
  };

  return (
    <div className="spline-chart-container">
      <div className="spline-chart-wrap">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="spline-svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="splineAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e222b" stopOpacity="0.14" />
              <stop offset="65%" stopColor="#1e222b" stopOpacity="0.03" />
              <stop offset="100%" stopColor="#1e222b" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {areaPath && <path d={areaPath} fill="url(#splineAreaGrad)" />}

          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#1d212a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          <line
            x1={activePoint.x}
            y1={activePoint.y}
            x2={activePoint.x}
            y2={height - paddingBottom}
            stroke="#cbd0d9"
            strokeWidth="1"
            strokeDasharray="2 3"
          />

          <circle
            cx={activePoint.x}
            cy={activePoint.y}
            r="4"
            fill="#1d212a"
            stroke="#ffffff"
            strokeWidth="2"
          />
        </svg>

        <div
          className="chart-tooltip-bubble"
          style={{
            left: `${(activePoint.x / width) * 100}%`,
            top: `${Math.max((activePoint.y / height) * 100 - 24, 8)}%`,
          }}
        >
          <div className="tooltip-value">{formatMoney(activePoint.amount)}</div>
          <div className="tooltip-date">{activePoint.date}</div>
        </div>
      </div>

      <div className="chart-months-row">
        {points.map((m, idx) => (
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
