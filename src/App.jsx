import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "bridge_se_data_v1";

const defaultData = {
  institutions: [
    { id: "amity", name: "Amity University", location: "Toshkent", color: "#4F46E5" },
    { id: "school21", name: "School21", location: "Toshkent", color: "#0891B2" },
    { id: "najot", name: "Najot Ta'lim", location: "Toshkent", color: "#059669" },
    { id: "tatu", name: "TATU", location: "Toshkent", color: "#D97706" },
    { id: "bukhara", name: "Buxoro Texnika Universiteti", location: "Buxoro", color: "#DC2626" },
  ],
  students: [],
  sessions: [],
  attendance: {},
  feedback: {},
};

const TOPICS = [
  "Yapon ish madaniyatiga kirish",
  "Hou-Ren-Sou (報・連・相)",
  "Kaizen va doimiy yaxshilanish",
  "Deadline va vaqt boshqaruvi",
  "Email va biznes kommunikatsiya",
  "Hujjatlashtirish standartlari",
  "Jamoaviy ish va Nemawashi",
  "Yaponiyada loyiha boshqaruvi",
  "Keigo 敬語 — hurmat iboralar",
  "Kod review va sifat nazorati",
];

function useStorage() {
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setData(saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData);
    } catch {
      setData(defaultData);
    }
    setLoaded(true);
  }, []);

  const save = useCallback((newData) => {
    setData(newData);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(newData)); } catch {}
  }, []);

  return { data, save, loaded };
}

const Icon = ({ name, size = 16 }) => {
  const icons = {
    calendar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    bar: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    star: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>,
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  };
  return icons[name] || null;
};

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, width: "100%", maxWidth: 500, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#666", padding: 4 }}><Icon name="x" size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Dashboard({ data }) {
  const today = new Date().toISOString().split("T")[0];
  const todaySessions = data.sessions.filter(s => s.date === today);
  const upcomingSessions = data.sessions.filter(s => s.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);
  const statBox = (label, value, color, icon) => (
    <div style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color }}>
        <Icon name={icon} size={22} />
      </div>
      <div>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#111", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 13, color: "#888", marginTop: 4 }}>{label}</div>
      </div>
    </div>
  );
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111" }}>Xush kelibsiz 👋</h2>
        <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>{new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {statBox("Jami muassasalar", data.institutions.length, "#4F46E5", "home")}
        {statBox("Jami talabalar", data.students.length, "#0891B2", "users")}
        {statBox("Jami darslar", data.sessions.length, "#059669", "calendar")}
        {statBox("Bugungi darslar", todaySessions.length, "#D97706", "star")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111" }}>📅 Kelgusi darslar</h3>
          {upcomingSessions.length === 0 ? <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>Darslar yo'q.</p> :
            upcomingSessions.map(s => {
              const inst = data.institutions.find(i => i.id === s.institutionId);
              return (
                <div key={s.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: inst?.color || "#ccc", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{s.topic}</div>
                    <div style={{ fontSize: 12, color: "#888" }}>{inst?.name} · {s.date} {s.time}</div>
                  </div>
                </div>
              );
            })}
        </div>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111" }}>🏫 Muassasalar holati</h3>
          {data.institutions.map(inst => {
            const instStudents = data.students.filter(s => s.institutionId === inst.id);
            const instSessions = data.sessions.filter(s => s.institutionId === inst.id);
            return (
              <div key={inst.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f0f0f0" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: inst.color, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{inst.name}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{inst.location}</div>
                </div>
                <div style={{ textAlign: "right", fontSize: 12, color: "#666" }}>
                  <div>{instStudents.length} talaba</div>
                  <div>{instSessions.length} dars</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SessionDetail({ session, data, save, onClose }) {
  const inst = data.institutions.find(i => i.id === session.institutionId);
  const students = data.students.filter(s => s.institutionId === session.institutionId);
  const att = data.attendance[session.id] || {};
  const fb = data.feedback[session.id] || { text: "", rating: 0, summary: "", aiLoading: false };

  function toggleAttendance(sid) {
    save({ ...data, attendance: { ...data.attendance, [session.id]: { ...att, [sid]: !att[sid] } } });
  }
  function saveFeedback(updates) {
    save({ ...data, feedback: { ...data.feedback, [session.id]: { ...fb, ...updates } } });
  }
  async function generateAISummary() {
    saveFeedback({ aiLoading: true });
    const presentStudents = students.filter(s => att[s.id]).map(s => s.name);
    const absentStudents = students.filter(s => !att[s.id]).map(s => s.name);
    const prompt = `Sen Bridge SE — O'zbekiston-Yaponiya IT ko'prigi dasturining yordamchisisisan.
Muassasa: ${inst?.name}
Mavzu: ${session.topic}
Sana: ${session.date}, Soat: ${session.time}
Kelganlar (${presentStudents.length}): ${presentStudents.join(", ") || "yo'q"}
Kelmadi (${absentStudents.length}): ${absentStudents.join(", ") || "yo'q"}
Reyting: ${fb.rating}/5
O'qituvchi izohi: ${fb.text || "kiritilmagan"}

Hisobotni quyidagi formatda yoz:
1. 📋 DARS XULOSA (2-3 gap)
2. 📊 DAVOMAT TAHLIL (foiz va baho)
3. 🎯 TAVSIYALAR (2-3 ta)
4. 🇯🇵 YAPONIYA UCHUN HISOBOT (professional uslubda)`;
    try {
      const res = await fetch("/.netlify/functions/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1000, messages: [{ role: "user", content: prompt }] })
      });
      const d = await res.json();
      const text = d.content?.map(c => c.text || "").join("") || "Xato yuz berdi.";
      saveFeedback({ summary: text, aiLoading: false });
    } catch {
      saveFeedback({ summary: "❌ Xato. Qayta urining.", aiLoading: false });
    }
  }

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflowY: "auto", maxHeight: "calc(100vh - 160px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: inst?.color || "#333" }}>{inst?.name}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111", marginTop: 2 }}>{session.topic}</div>
          <div style={{ fontSize: 13, color: "#888" }}>{session.date} · {session.time}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}><Icon name="x" size={20} /></button>
      </div>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 10, display: "flex", justifyContent: "space-between" }}>
          <span>👥 Davomat</span>
          {students.length > 0 && <span style={{ fontSize: 13, color: "#4F46E5" }}>{Object.values(att).filter(Boolean).length}/{students.length}</span>}
        </div>
        {students.length === 0 ? <p style={{ fontSize: 13, color: "#aaa" }}>Bu muassasada talabalar yo'q.</p> :
          students.map(student => (
            <div key={student.id} onClick={() => toggleAttendance(student.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, background: att[student.id] ? "#ECFDF5" : "#F9FAFB", border: "1.5px solid " + (att[student.id] ? "#059669" : "#E5E7EB"), cursor: "pointer", marginBottom: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: att[student.id] ? "#059669" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                {att[student.id] ? <Icon name="check" size={14} /> : <Icon name="x" size={14} />}
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{student.name}</div>
            </div>
          ))}
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 10 }}>💬 Feedback</div>
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => saveFeedback({ rating: n })} style={{ width: 36, height: 36, borderRadius: 8, border: "none", cursor: "pointer", background: n <= fb.rating ? "#F59E0B" : "#F3F4F6", fontSize: 18 }}>★</button>
          ))}
        </div>
        <textarea value={fb.text} onChange={e => saveFeedback({ text: e.target.value })} placeholder="Dars haqida izoh..." style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical", height: 80, fontFamily: "inherit", boxSizing: "border-box" }} />
        <div style={{ marginTop: 12, marginBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#333" }}>🤖 AI Hisobot</span>
          <button onClick={generateAISummary} disabled={fb.aiLoading} style={{ background: fb.aiLoading ? "#a5b4fc" : "#4F46E5", color: "#fff", border: "none", borderRadius: 8, padding: "7px 14px", cursor: fb.aiLoading ? "not-allowed" : "pointer", fontSize: 12, fontWeight: 700 }}>
            {fb.aiLoading ? "⏳ Yozilmoqda..." : "✨ AI Xulosa Yarat"}
          </button>
        </div>
        <textarea value={fb.summary} onChange={e => saveFeedback({ summary: e.target.value })} placeholder="AI xulosa bu yerda paydo bo'ladi..." style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical", height: 180, fontFamily: "inherit", boxSizing: "border-box" }} />
      </div>
    </div>
  );
}

function Sessions({ data, save }) {
  const [showAdd, setShowAdd] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ institutionId: "", date: new Date().toISOString().split("T")[0], time: "10:00", topic: "", notes: "" });
  const sorted = [...data.sessions].filter(s => filter === "all" || s.institutionId === filter).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  function addSession() {
    if (!form.institutionId || !form.date || !form.topic) return;
    save({ ...data, sessions: [...data.sessions, { ...form, id: Date.now().toString() }] });
    setShowAdd(false);
    setForm({ institutionId: "", date: new Date().toISOString().split("T")[0], time: "10:00", topic: "", notes: "" });
  }
  function deleteSession(id) {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    const newAtt = { ...data.attendance }; delete newAtt[id];
    const newFb = { ...data.feedback }; delete newFb[id];
    save({ ...data, sessions: data.sessions.filter(s => s.id !== id), attendance: newAtt, feedback: newFb });
    if (selected?.id === id) setSelected(null);
  }
  const inp = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lbl = { display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 };
  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 380px" : "1fr", gap: 20 }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>📅 Dars jadvali</h2>
          <button onClick={() => setShowAdd(true)} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="plus" size={16} /> Yangi dars
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={() => setFilter("all")} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: filter === "all" ? "#4F46E5" : "#f3f4f6", color: filter === "all" ? "#fff" : "#555" }}>Hammasi</button>
          {data.institutions.map(inst => (
            <button key={inst.id} onClick={() => setFilter(inst.id)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: filter === inst.id ? inst.color : "#f3f4f6", color: filter === inst.id ? "#fff" : "#555" }}>{inst.name.split(" ")[0]}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div>Hali dars yo'q. Birinchi darsni qo'shing!</div>
            </div>
          ) : sorted.map(session => {
            const inst = data.institutions.find(i => i.id === session.institutionId);
            const instStudents = data.students.filter(s => s.institutionId === session.institutionId);
            const att = data.attendance[session.id] || {};
            const presentCount = Object.values(att).filter(Boolean).length;
            const hasFeedback = !!data.feedback[session.id]?.text;
            const isSelected = selected?.id === session.id;
            return (
              <div key={session.id} onClick={() => setSelected(isSelected ? null : session)} style={{ background: isSelected ? "#F0F0FF" : "#fff", border: isSelected ? "2px solid #4F46E5" : "2px solid transparent", borderRadius: 12, padding: 16, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  <div style={{ width: 4, minHeight: 40, borderRadius: 4, background: inst?.color || "#ccc", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{session.topic}</div>
                        <div style={{ fontSize: 13, color: "#888", marginTop: 3 }}>{inst?.name} · {session.date} soat {session.time}</div>
                      </div>
                      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                        {hasFeedback && <span style={{ fontSize: 11, background: "#05996920", color: "#059669", padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>Feedback ✓</span>}
                        {instStudents.length > 0 && <span style={{ fontSize: 11, background: "#F0F0FF", color: "#4F46E5", padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{presentCount}/{instStudents.length}</span>}
                        <button onClick={e => { e.stopPropagation(); deleteSession(session.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", padding: 4, opacity: 0.6 }}><Icon name="trash" size={15} /></button>
                      </div>
                    </div>
                    {session.notes && <div style={{ fontSize: 12, color: "#999", marginTop: 6, fontStyle: "italic" }}>{session.notes}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selected && <SessionDetail session={selected} data={data} save={save} onClose={() => setSelected(null)} />}
      {showAdd && (
        <Modal title="Yangi dars qo'shish" onClose={() => setShowAdd(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={lbl}>Muassasa *</label>
              <select value={form.institutionId} onChange={e => setForm({ ...form, institutionId: e.target.value })} style={inp}>
                <option value="">Tanlang...</option>
                {data.institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div><label style={lbl}>Sana *</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inp} /></div>
              <div><label style={lbl}>Soat</label><input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={inp} /></div>
            </div>
            <div>
              <label style={lbl}>Mavzu *</label>
              <select value={TOPICS.includes(form.topic) ? form.topic : ""} onChange={e => setForm({ ...form, topic: e.target.value })} style={inp}>
                <option value="">Tanlang...</option>
                {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              <input type="text" placeholder="Boshqa mavzu..." value={TOPICS.includes(form.topic) ? "" : form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} style={{ ...inp, marginTop: 8 }} />
            </div>
            <div><label style={lbl}>Izoh</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, height: 80, resize: "vertical" }} /></div>
            <button onClick={addSession} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Dars qo'shish</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Students({ data, save }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filterInst, setFilterInst] = useState("all");
  const [form, setForm] = useState({ institutionId: "", name: "", email: "", notes: "" });
  function addStudent() {
    if (!form.institutionId || !form.name) return;
    save({ ...data, students: [...data.students, { ...form, id: Date.now().toString() }] });
    setShowAdd(false);
    setForm({ institutionId: "", name: "", email: "", notes: "" });
  }
  function deleteStudent(id) {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    save({ ...data, students: data.students.filter(s => s.id !== id) });
  }
  const filtered = data.students.filter(s => filterInst === "all" || s.institutionId === filterInst);
  const inp = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lbl = { display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 };
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>👥 Talabalar</h2>
        <button onClick={() => setShowAdd(true)} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="plus" size={16} /> Talaba qo'shish
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setFilterInst("all")} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: filterInst === "all" ? "#4F46E5" : "#f3f4f6", color: filterInst === "all" ? "#fff" : "#555" }}>Hammasi ({data.students.length})</button>
        {data.institutions.map(inst => (
          <button key={inst.id} onClick={() => setFilterInst(inst.id)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: filterInst === inst.id ? inst.color : "#f3f4f6", color: filterInst === inst.id ? "#fff" : "#555" }}>
            {inst.name.split(" ")[0]} ({data.students.filter(s => s.institutionId === inst.id).length})
          </button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
        {filtered.length === 0 ? (
          <div style={{ gridColumn: "1/-1", textAlign: "center", padding: 60, color: "#aaa" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>👤</div>
            <div>Talabalar yo'q. Qo'shing!</div>
          </div>
        ) : filtered.map(student => {
          const inst = data.institutions.find(i => i.id === student.institutionId);
          const studentSessions = data.sessions.filter(s => s.institutionId === student.institutionId);
          const attended = studentSessions.filter(s => data.attendance[s.id]?.[student.id]).length;
          return (
            <div key={student.id} style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: (inst?.color || "#ccc") + "20", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: inst?.color || "#555" }}>
                    {student.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{student.name}</div>
                    {student.email && <div style={{ fontSize: 12, color: "#888" }}>{student.email}</div>}
                  </div>
                </div>
                <button onClick={() => deleteStudent(student.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", opacity: 0.5 }}><Icon name="trash" size={15} /></button>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 12, background: (inst?.color || "#ccc") + "15", color: inst?.color || "#555", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>{inst?.name}</span>
                <span style={{ fontSize: 12, background: "#F0F0FF", color: "#4F46E5", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>{attended}/{studentSessions.length} dars</span>
              </div>
            </div>
          );
        })}
      </div>
      {showAdd && (
        <Modal title="Yangi talaba qo'shish" onClose={() => setShowAdd(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={lbl}>Muassasa *</label>
              <select value={form.institutionId} onChange={e => setForm({ ...form, institutionId: e.target.value })} style={inp}>
                <option value="">Tanlang...</option>
                {data.institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Ism sharifi *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} placeholder="Abdullayev Bobur" /></div>
            <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inp} /></div>
            <div><label style={lbl}>Izoh</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, height: 70, resize: "vertical" }} /></div>
            <button onClick={addStudent} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>Talaba qo'shish</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Reports({ data }) {
  const [selected, setSelected] = useState(data.institutions[0]?.id || "");
  const inst = data.institutions.find(i => i.id === selected);
  const students = data.students.filter(s => s.institutionId === selected);
  const sessions = data.sessions.filter(s => s.institutionId === selected).sort((a, b) => a.date.localeCompare(b.date));
  function exportReport() {
    const lines = ["HISOBOT: " + inst?.name + " - " + new Date().toLocaleDateString("uz-UZ"), "=".repeat(60), "Jami talabalar: " + students.length, "Jami darslar: " + sessions.length, "", "TALABALAR DAVOMATI:",
      ...students.map(st => { const att = sessions.filter(s => data.attendance[s.id]?.[st.id]).length; return "  " + st.name + ": " + att + "/" + sessions.length + " (" + (sessions.length ? Math.round(att/sessions.length*100) : 0) + "%)"; })];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "hisobot.txt"; a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>📊 Hisobotlar</h2>
        <button onClick={exportReport} style={{ background: "#059669", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600 }}>📥 TXT</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {data.institutions.map(i => (
          <button key={i.id} onClick={() => setSelected(i.id)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: selected === i.id ? i.color : "#f3f4f6", color: selected === i.id ? "#fff" : "#555" }}>{i.name}</button>
        ))}
      </div>
      {inst && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14, marginBottom: 24 }}>
            {[["Talabalar", students.length, inst.color], ["Darslar", sessions.length, "#4F46E5"], ["AI Hisobot", sessions.filter(s => data.feedback[s.id]?.summary).length, "#059669"]].map(([label, value, color]) => (
              <div key={label} style={{ background: "#fff", borderRadius: 12, padding: 18, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 32, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 13, color: "#888" }}>{label}</div>
              </div>
            ))}
          </div>
          {students.length > 0 && sessions.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflowX: "auto" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>Davomat jadvali</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 12px", background: "#F9FAFB", fontWeight: 700 }}>Talaba</th>
                    {sessions.map(s => <th key={s.id} style={{ padding: "8px 10px", background: "#F9FAFB", fontWeight: 600, fontSize: 11, textAlign: "center" }}>{s.date.slice(5)}</th>)}
                    <th style={{ padding: "8px 10px", background: "#F9FAFB", fontWeight: 700, textAlign: "center" }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st, idx) => {
                    const attended = sessions.filter(s => data.attendance[s.id]?.[st.id]).length;
                    const pct = sessions.length ? Math.round(attended/sessions.length*100) : 0;
                    return (
                      <tr key={st.id} style={{ background: idx % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{st.name}</td>
                        {sessions.map(s => <td key={s.id} style={{ textAlign: "center", padding: 8 }}>{data.attendance[s.id]?.[st.id] ? "✅" : "❌"}</td>)}
                        <td style={{ textAlign: "center", fontWeight: 700, color: pct >= 80 ? "#059669" : pct >= 60 ? "#D97706" : "#DC2626" }}>{pct}%</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const { data, save, loaded } = useStorage();
  const [tab, setTab] = useState("home");
  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div><div style={{ color: "#888" }}>Yuklanmoqda...</div></div>
    </div>
  );
  const navItems = [
    { id: "home", icon: "home", label: "Bosh sahifa" },
    { id: "sessions", icon: "calendar", label: "Darslar" },
    { id: "students", icon: "users", label: "Talabalar" },
    { id: "reports", icon: "bar", label: "Hisobotlar" },
  ];
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#F4F6FB", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 200, background: "#1E1B4B", flexShrink: 0, display: "flex", flexDirection: "column", padding: "24px 0" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>🌸 Bridge SE</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>FPT Consulting Japan</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Kosimov Hasan</div>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, marginBottom: 4, textAlign: "left", background: tab === item.id ? "rgba(255,255,255,0.15)" : "transparent", color: tab === item.id ? "#fff" : "rgba(255,255,255,0.6)" }}>
              <Icon name={item.icon} size={17} />{item.label}
            </button>
          ))}
        </nav>
        <div style={{ padding: "0 16px" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", textAlign: "center" }}>{data.institutions.length} muassasa · {data.students.length} talaba</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
        {tab === "home" && <Dashboard data={data} />}
        {tab === "sessions" && <Sessions data={data} save={save} />}
        {tab === "students" && <Students data={data} save={save} />}
        {tab === "reports" && <Reports data={data} />}
      </div>
    </div>
  );
}
