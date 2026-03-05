import { useState, useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer
} from "recharts";
import jsPDF from "jspdf";
import "./index.css";

// ─── Helpers ───────────────────────────────────────────────
const fmt = (n) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency", currency: "NGN", maximumFractionDigits: 0,
  }).format(n);
const pct = (n) => `${n.toFixed(2)}%`;

const SUSTAINABILITY = {
  urban:    { label: "Urban",    score: 85, color: "#22c55e", note: "High walkability, strong infrastructure, close to transit hubs." },
  suburban: { label: "Suburban", score: 62, color: "#f59e0b", note: "Moderate access to amenities, growing infrastructure." },
  rural:    { label: "Rural",    score: 38, color: "#ef4444", note: "Limited infrastructure, lower demand but high growth potential." },
};

const SDG_ITEMS = [
  { label: "SDG 11 — Sustainable Cities",      mult: 1.00, icon: "🏙️" },
  { label: "SDG 7 — Affordable Clean Energy",  mult: 0.85, icon: "⚡" },
  { label: "SDG 6 — Clean Water Access",       mult: 0.90, icon: "💧" },
  { label: "SDG 13 — Climate Action",          mult: 0.75, icon: "🌿" },
];

// ─── PDF Export ────────────────────────────────────────────
function exportPDF(inputs, calc, sus) {
  const doc = new jsPDF();
  doc.setFontSize(20); doc.setTextColor(15, 23, 42);
  doc.text("RealNov8 Group", 20, 20);
  doc.setFontSize(14); doc.setTextColor(80);
  doc.text("Property Investment Report", 20, 30);
  doc.setFontSize(10); doc.setTextColor(150);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-NG")}`, 20, 38);

  doc.setDrawColor(200); doc.line(20, 42, 190, 42);

  doc.setFontSize(13); doc.setTextColor(15, 23, 42);
  doc.text("Property Details", 20, 52);
  doc.setFontSize(10); doc.setTextColor(80);
  [
    `Property Price: ${fmt(inputs.price)}`,
    `Monthly Rental Income: ${fmt(inputs.rental)}`,
    `Monthly Expenses: ${fmt(inputs.expenses)}`,
    `Mortgage Rate: ${inputs.mortgage}%`,
    `Projection Duration: ${inputs.duration} years`,
    `Location Type: ${sus.label}`,
  ].forEach((l, i) => doc.text(l, 20, 62 + i * 8));

  doc.setFontSize(13); doc.setTextColor(15, 23, 42);
  doc.text("Key Metrics", 20, 120);
  doc.setFontSize(10); doc.setTextColor(80);
  [
    `Annual ROI: ${pct(calc.roi)}`,
    `Rental Yield: ${pct(calc.rentalYield)}`,
    `Monthly Cash Flow: ${fmt(calc.cashFlow)}`,
    `Payback Period: ${calc.payback > 0 ? calc.payback.toFixed(1) + " years" : "N/A"}`,
    `Net Annual Income: ${fmt(calc.annualNet)}`,
    `Sustainability Score: ${sus.score}/100`,
  ].forEach((l, i) => doc.text(l, 20, 130 + i * 8));

  doc.setFontSize(9); doc.setTextColor(180);
  doc.text("RealNov8 Group — Smart Real Estate, Sustainable Cities", 20, 280);
  doc.save("realnov8-investment-report.pdf");
}

// ─── Main App ──────────────────────────────────────────────
export default function App() {
  const [inputs, setInputs] = useState({
    price: 25000000, rental: 250000, expenses: 40000,
    mortgage: 8, duration: 5, location: "urban",
  });
  const [tab, setTab] = useState("overview");
  const set = (k, v) => setInputs((p) => ({ ...p, [k]: v }));

  const calc = useMemo(() => {
    const { price, rental, expenses, mortgage, duration } = inputs;
    const annualRental   = rental * 12;
    const annualExpenses = expenses * 12;
    const annualMortgage = price * (mortgage / 100);
    const annualNet      = annualRental - annualExpenses - annualMortgage;
    const roi            = (annualNet / price) * 100;
    const rentalYield    = (annualRental / price) * 100;
    const payback        = annualNet > 0 ? price / annualNet : -1;
    const cashFlow       = annualNet / 12;
    const yearly = Array.from({ length: duration }, (_, i) => ({
      year:          `Yr ${i + 1}`,
      netIncome:     Math.round(annualNet),
      propertyValue: Math.round(price * Math.pow(1.07, i + 1)),
      cumProfit:     Math.round(annualNet * (i + 1)),
    }));
    return { annualNet, roi, rentalYield, payback, cashFlow, yearly, annualRental, annualExpenses, annualMortgage };
  }, [inputs]);

  const sus = SUSTAINABILITY[inputs.location];

  const FIELDS = [
    { label: "Property Price (₦)",          key: "price",    min: 1000000, max: 500000000, step: 500000 },
    { label: "Monthly Rental Income (₦)",   key: "rental",   min: 10000,   max: 5000000,   step: 10000 },
    { label: "Monthly Expenses (₦)",        key: "expenses", min: 0,       max: 500000,    step: 5000 },
    { label: "Mortgage Rate (%)",           key: "mortgage", min: 0,       max: 30,        step: 0.5 },
    { label: "Projection Duration (Years)", key: "duration", min: 1,       max: 20,        step: 1 },
  ];

  const METRICS = [
    { label: "Annual ROI",        value: pct(calc.roi),         color: calc.roi > 0 ? "#22c55e" : "#ef4444" },
    { label: "Rental Yield",      value: pct(calc.rentalYield), color: "#38bdf8" },
    { label: "Monthly Cash Flow", value: fmt(calc.cashFlow),    color: calc.cashFlow > 0 ? "#22c55e" : "#ef4444" },
    { label: "Payback Period",    value: calc.payback > 0 ? `${calc.payback.toFixed(1)} yrs` : "N/A", color: "#a78bfa" },
  ];

  const BREAKDOWN = [
    { label: "Gross Rental Income", value: calc.annualRental,   color: "#22c55e", cost: false },
    { label: "Annual Expenses",     value: calc.annualExpenses, color: "#ef4444", cost: true  },
    { label: "Annual Mortgage",     value: calc.annualMortgage, color: "#f59e0b", cost: true  },
    { label: "Net Annual Income",   value: calc.annualNet,      color: calc.annualNet > 0 ? "#38bdf8" : "#ef4444", cost: false, bold: true },
  ];

  const tooltipStyle = { background: "#0f172a", border: "1px solid #334155", borderRadius: 8, fontSize: 12 };

  return (
    <div className="app">
      <div className="container">

        {/* Header */}
        <div className="header">
          <p className="eyebrow">RealNov8 Group</p>
          <h1>Property Investment Calculator</h1>
          <p>Analyze ROI, rental yield &amp; sustainability in seconds</p>
        </div>

        {/* Inputs */}
        <div className="card">
          <p className="card-title">Property Details</p>
          <div className="input-grid">
            {FIELDS.map(({ label, key, min, max, step }) => (
              <div className="input-group" key={key}>
                <label>{label}</label>
                <input type="number" value={inputs[key]} min={min} max={max} step={step}
                  onChange={e => set(key, parseFloat(e.target.value) || 0)} />
              </div>
            ))}
            <div className="input-group">
              <label>Location Type</label>
              <select value={inputs.location} onChange={e => set("location", e.target.value)}>
                <option value="urban">Urban</option>
                <option value="suburban">Suburban</option>
                <option value="rural">Rural</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {["overview", "projections", "sustainability"].map(t => (
            <button key={t} className={`tab-btn${tab === t ? " active" : ""}`} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>

        {/* ── Overview ── */}
        {tab === "overview" && (
          <>
            <div className="metrics-grid">
              {METRICS.map(({ label, value, color }) => (
                <div className="metric-card" key={label}>
                  <div className="metric-value" style={{ color }}>{value}</div>
                  <div className="metric-label">{label}</div>
                </div>
              ))}
            </div>
            <div className="card">
              <p className="card-title">Annual Breakdown</p>
              {BREAKDOWN.map(({ label, value, color, cost, bold }) => (
                <div className="breakdown-row" key={label}>
                  <span className={`breakdown-label${bold ? " bold" : ""}`}>{label}</span>
                  <span className="breakdown-value" style={{ color }}>
                    {fmt(Math.abs(value))}{cost ? " (cost)" : ""}
                  </span>
                </div>
              ))}
              <button className="btn-primary" onClick={() => exportPDF(inputs, calc, sus)}>
                📄 Download Investment Report (PDF)
              </button>
            </div>
          </>
        )}

        {/* ── Projections ── */}
        {tab === "projections" && (
          <div className="card">
            <div className="chart-section">
              <p className="chart-title">Net Income &amp; Cumulative Profit</p>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={calc.yearly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `₦${(v/1e6).toFixed(1)}M`} />
                  <Tooltip formatter={v => fmt(v)} contentStyle={tooltipStyle} />
                  <Legend />
                  <Line type="monotone" dataKey="netIncome" stroke="#38bdf8" strokeWidth={2} name="Net Income/yr" dot={{ fill: "#38bdf8" }} />
                  <Line type="monotone" dataKey="cumProfit" stroke="#22c55e" strokeWidth={2} name="Cumulative Profit" dot={{ fill: "#22c55e" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="chart-section">
              <p className="chart-title">Property Value Appreciation (7% p.a.)</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={calc.yearly}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="year" stroke="#64748b" fontSize={12} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `₦${(v/1e6).toFixed(0)}M`} />
                  <Tooltip formatter={v => fmt(v)} contentStyle={tooltipStyle} />
                  <Bar dataKey="propertyValue" fill="#a78bfa" name="Property Value" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* ── Sustainability ── */}
        {tab === "sustainability" && (
          <>
            <div className="card">
              <div className="sus-header">
                <div className="sus-ring">
                  <svg viewBox="0 0 36 36" width="80" height="80">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#334155" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke={sus.color} strokeWidth="3"
                      strokeDasharray={`${sus.score} 100`} strokeLinecap="round"
                      transform="rotate(-90 18 18)" />
                  </svg>
                  <span className="sus-score-text" style={{ color: sus.color }}>{sus.score}</span>
                </div>
                <div>
                  <div className="sus-info-title" style={{ color: sus.color }}>{sus.label} Location</div>
                  <div className="sus-info-sub">Sustainability Score: {sus.score}/100</div>
                </div>
              </div>
              <p className="sus-note">{sus.note}</p>
            </div>
            {SDG_ITEMS.map(({ label, mult, icon }) => {
              const score = Math.round(sus.score * mult);
              return (
                <div className="sdg-row" key={label}>
                  <span className="sdg-icon">{icon}</span>
                  <div className="sdg-content">
                    <div className="sdg-label">{label}</div>
                    <div className="sdg-bar-bg">
                      <div className="sdg-bar-fill" style={{ width: `${score}%` }} />
                    </div>
                  </div>
                  <span className="sdg-score">{score}</span>
                </div>
              );
            })}
          </>
        )}

        <p className="footer">RealNov8 Group — Smart Real Estate, Sustainable Cities</p>
      </div>
    </div>
  );
}