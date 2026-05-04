import { useState, useEffect, useCallback } from "react";
import * as XLSX from "xlsx";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, onSnapshot } from "firebase/firestore";

// Firebase konfiguratsiya
const firebaseConfig = {
  apiKey: "AIzaSyCiA73YtMhhMSoCMErcUKKKgW-EE42GopA",
  authDomain: "bridge-se.firebaseapp.com",
  projectId: "bridge-se",
  storageBucket: "bridge-se.firebasestorage.app",
  messagingSenderId: "801070213190",
  appId: "1:801070213190:web:243a386c8e2f3170f70247",
  measurementId: "G-K2VJEHS1C5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const DATA_DOC = "bridge-se/main";

const STORAGE_KEY = "bridge_se_data_v1";

const defaultData = {
  institutions: [
    { id: "amity", name: "Amity University", location: "Toshkent", color: "#4F46E5" },
    { id: "school21", name: "School21", location: "Toshkent", color: "#0891B2" },
    { id: "school21smr", name: "School21 Samarkand", location: "Samarkand", color: "#7C3AED" },
    { id: "najot", name: "Najot Ta'lim", location: "Toshkent", color: "#059669" },
    { id: "tatu", name: "TATU", location: "Toshkent", color: "#D97706" },
    { id: "bukhara", name: "Buxoro Texnika Universiteti", location: "Buxoro", color: "#DC2626" },
    { id: "bukharamill", name: "Buxoro Milliy Universiteti · ブハラ国立大学", location: "Buxoro", color: "#DB2777" },
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
    const [col, docId] = DATA_DOC.split("/");
    const ref = doc(db, col, docId);
    const unsub = onSnapshot(ref, (snap) => {
      if (snap.exists()) {
        setData({ ...defaultData, ...snap.data() });
      } else {
        setData(defaultData);
      }
      setLoaded(true);
    }, () => {
      setData(defaultData);
      setLoaded(true);
    });
    return () => unsub();
  }, []);

  const save = useCallback(async (newData) => {
    setData(newData);
    try {
      const [col, docId] = DATA_DOC.split("/");
      await setDoc(doc(db, col, docId), newData);
    } catch (e) { console.error(e); }
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
    download: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
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

function DetailModal({ type, data, onClose }) {
  const today = new Date().toISOString().split("T")[0];

  const content = () => {
    if (type === "institutions") {
      return (
        <div>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>Barcha muassasalar · 全機関一覧</p>
          {data.institutions.map(inst => {
            const students = data.students.filter(s => s.institutionId === inst.id);
            const sessions = data.sessions.filter(s => s.institutionId === inst.id);
            const feedbacks = sessions.filter(s => data.feedback[s.id]?.text).length;
            return (
              <div key={inst.id} style={{ background: "#F9FAFB", borderRadius: 12, padding: 16, marginBottom: 12, borderLeft: `4px solid ${inst.color}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#111" }}>{inst.name}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>📍 {inst.location}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <span style={{ fontSize: 12, background: inst.color + "18", color: inst.color, padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>{students.length} talaba</span>
                    <span style={{ fontSize: 12, background: "#EEF2FF", color: "#4F46E5", padding: "4px 10px", borderRadius: 20, fontWeight: 700 }}>{sessions.length} dars</span>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 10 }}>
                  <div style={{ fontSize: 12, color: "#666" }}>📝 Hisobot: <strong>{feedbacks}</strong></div>
                  <div style={{ fontSize: 12, color: "#666" }}>📅 So'nggi dars: <strong>{sessions.sort((a,b) => b.date.localeCompare(a.date))[0]?.date || "—"}</strong></div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (type === "students") {
      return (
        <div>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>Barcha talabalar · 全学生一覧</p>
          {data.institutions.map(inst => {
            const students = data.students.filter(s => s.institutionId === inst.id);
            if (!students.length) return null;
            return (
              <div key={inst.id} style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: inst.color, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: inst.color }} />
                  {inst.name} · {students.length} talaba
                </div>
                {students.map(st => {
                  const sessions = data.sessions.filter(s => s.institutionId === inst.id);
                  const attended = sessions.filter(s => data.attendance[s.id]?.[st.id]).length;
                  const pct = sessions.length ? Math.round(attended / sessions.length * 100) : 0;
                  return (
                    <div key={st.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "#F9FAFB", borderRadius: 10, marginBottom: 6 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: inst.color + "20", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: inst.color, fontSize: 15 }}>
                        {st.name[0]?.toUpperCase()}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#111" }}>{st.name}</div>
                        {st.email && <div style={{ fontSize: 12, color: "#888" }}>{st.email}</div>}
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: pct >= 80 ? "#059669" : pct >= 60 ? "#D97706" : "#DC2626" }}>{pct}%</div>
                        <div style={{ fontSize: 11, color: "#aaa" }}>{attended}/{sessions.length} dars</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
          {data.students.length === 0 && <p style={{ color: "#aaa", textAlign: "center", padding: 20 }}>Hali talabalar yo'q</p>}
        </div>
      );
    }

    if (type === "sessions") {
      const allSessions = [...data.sessions].sort((a, b) => b.date.localeCompare(a.date));
      return (
        <div>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>Barcha darslar · 全授業一覧</p>
          {allSessions.length === 0 && <p style={{ color: "#aaa", textAlign: "center", padding: 20 }}>Hali darslar yo'q</p>}
          {allSessions.map(s => {
            const inst = data.institutions.find(i => i.id === s.institutionId);
            const students = data.students.filter(st => st.institutionId === s.institutionId);
            const att = data.attendance[s.id] || {};
            const present = Object.values(att).filter(Boolean).length;
            const pct = students.length ? Math.round(present / students.length * 100) : 0;
            const fb = data.feedback[s.id] || {};
            return (
              <div key={s.id} style={{ background: "#F9FAFB", borderRadius: 12, padding: 14, marginBottom: 10, borderLeft: `4px solid ${inst?.color || "#ccc"}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111" }}>{s.topic}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{inst?.name} · {s.date} {s.time}</div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: pct >= 80 ? "#059669" : pct >= 60 ? "#D97706" : "#DC2626", background: pct >= 80 ? "#ECFDF5" : pct >= 60 ? "#FEF9C3" : "#FEE2E2", padding: "3px 10px", borderRadius: 20 }}>
                    {present}/{students.length} · {pct}%
                  </span>
                </div>
                {fb.rating > 0 && <div style={{ fontSize: 12, color: "#F59E0B", marginTop: 6 }}>{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)} {fb.mood && `· ${fb.mood}`}</div>}
                {fb.text && <div style={{ fontSize: 12, color: "#666", marginTop: 4, fontStyle: "italic" }}>"{fb.text}"</div>}
              </div>
            );
          })}
        </div>
      );
    }

    if (type === "today") {
      const todaySessions = data.sessions.filter(s => s.date === today);
      return (
        <div>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 16 }}>Bugungi darslar · 今日の授業 — {new Date().toLocaleDateString("uz-UZ")}</p>
          {todaySessions.length === 0 && (
            <div style={{ textAlign: "center", padding: 40, color: "#aaa" }}>
              <div style={{ fontSize: 40 }}>📭</div>
              <div style={{ marginTop: 8 }}>Bugun dars yo'q · 今日は授業がありません</div>
            </div>
          )}
          {todaySessions.map(s => {
            const inst = data.institutions.find(i => i.id === s.institutionId);
            const students = data.students.filter(st => st.institutionId === s.institutionId);
            const att = data.attendance[s.id] || {};
            const present = Object.values(att).filter(Boolean).length;
            return (
              <div key={s.id} style={{ background: "#F9FAFB", borderRadius: 14, padding: 18, marginBottom: 12, borderLeft: `4px solid ${inst?.color || "#ccc"}` }}>
                <div style={{ fontSize: 15, fontWeight: 800, color: "#111", marginBottom: 4 }}>{s.topic}</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>{inst?.name} · Soat {s.time}</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <span style={{ fontSize: 12, background: "#EEF2FF", color: "#4F46E5", padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>👥 {students.length} talaba</span>
                  <span style={{ fontSize: 12, background: "#ECFDF5", color: "#059669", padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>✅ {present} keldi</span>
                  <span style={{ fontSize: 12, background: "#FEE2E2", color: "#DC2626", padding: "4px 12px", borderRadius: 20, fontWeight: 600 }}>❌ {students.length - present} kelmadi</span>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  const titles = {
    institutions: "🏫 Muassasalar · 機関一覧",
    students: "👥 Talabalar · 学生一覧",
    sessions: "📅 Darslar · 授業一覧",
    today: "⭐ Bugungi darslar · 今日の授業"
  };

  return (
    <Modal title={titles[type]} onClose={onClose}>
      {content()}
    </Modal>
  );
}

function Dashboard({ data, setTab }) {
  const [detailType, setDetailType] = useState(null);
  const today = new Date().toISOString().split("T")[0];
  const todaySessions = data.sessions.filter(s => s.date === today);
  const upcomingSessions = data.sessions.filter(s => s.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 5);

  const statBox = (label, value, color, icon, type) => (
    <div onClick={() => setDetailType(type)} style={{ background: "#fff", borderRadius: 14, padding: "20px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 16, cursor: "pointer", transition: "all 0.2s", border: "2px solid transparent" }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.transform = "translateY(0)"; }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: color + "18", display: "flex", alignItems: "center", justifyContent: "center", color }}>
        <Icon name={icon} size={22} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 28, fontWeight: 800, color: "#111", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{label}</div>
      </div>
      <div style={{ fontSize: 18, color: "#ccc" }}>›</div>
    </div>
  );
  return (
    <div>
      {detailType && <DetailModal type={detailType} data={data} onClose={() => setDetailType(null)} />}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111" }}>Xush kelibsiz 👋</h2>
        <p style={{ margin: "4px 0 0", color: "#666", fontSize: 14 }}>{new Date().toLocaleDateString("uz-UZ", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
        {statBox("Jami muassasalar · 合計機関数", data.institutions.length, "#4F46E5", "home", "institutions")}
        {statBox("Jami talabalar · 総学生数", data.students.length, "#0891B2", "users", "students")}
        {statBox("Jami darslar · 合計授業数", data.sessions.length, "#059669", "calendar", "sessions")}
        {statBox("Bugungi darslar · 今日の授業", todaySessions.length, "#D97706", "star", "today")}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111" }}>📅 Kelgusi darslar · 今後のレッスン</h3>
          {upcomingSessions.length === 0 ? <p style={{ color: "#aaa", fontSize: 13, margin: 0 }}>Darslar yo'q · レッスンなし</p> :
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
          <h3 style={{ margin: "0 0 16px", fontSize: 15, fontWeight: 700, color: "#111" }}>🏫 Muassasalar holati · 機関ステータス</h3>
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
                  <div>{instStudents.length} talaba · 学生</div>
                  <div>{instSessions.length} dars · 授業</div>
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
  const fb = data.feedback[session.id] || { text: "", rating: 0, summary: "", mood: "", nextPlan: "" };

  function toggleAttendance(sid) {
    save({ ...data, attendance: { ...data.attendance, [session.id]: { ...att, [sid]: !att[sid] } } });
  }
  function saveFeedback(updates) {
    save({ ...data, feedback: { ...data.feedback, [session.id]: { ...fb, ...updates } } });
  }

  const presentCount = Object.values(att).filter(Boolean).length;
  const pct = students.length ? Math.round(presentCount / students.length * 100) : 0;

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.08)", overflowY: "auto", maxHeight: "calc(100vh - 160px)" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: inst?.color || "#333", textTransform: "uppercase", letterSpacing: 1 }}>{inst?.name}</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#111", marginTop: 2 }}>{session.topic}</div>
          <div style={{ fontSize: 13, color: "#888" }}>{session.date} · soat {session.time}</div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#999" }}><Icon name="x" size={20} /></button>
      </div>

      {/* Davomat */}
      <div style={{ background: "#F9FAFB", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#333", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>👥 Davomat · 出席</span>
          <span style={{ fontSize: 13, background: pct >= 80 ? "#ECFDF5" : pct >= 60 ? "#FEF9C3" : "#FEE2E2", color: pct >= 80 ? "#059669" : pct >= 60 ? "#D97706" : "#DC2626", padding: "3px 10px", borderRadius: 20, fontWeight: 700 }}>
            {presentCount}/{students.length} · {pct}%
          </span>
        </div>
        {students.length === 0 ? <p style={{ fontSize: 13, color: "#aaa", margin: 0 }}>Bu muassasada talabalar yo'q · 学生がいません</p> :
          students.map(student => (
            <div key={student.id} onClick={() => toggleAttendance(student.id)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 10, background: att[student.id] ? "#ECFDF5" : "#fff", border: "1.5px solid " + (att[student.id] ? "#059669" : "#E5E7EB"), cursor: "pointer", marginBottom: 8, transition: "all 0.15s" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: att[student.id] ? "#059669" : "#E5E7EB", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", flexShrink: 0 }}>
                {att[student.id] ? <Icon name="check" size={13} /> : <Icon name="x" size={13} />}
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#111" }}>{student.name}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: att[student.id] ? "#059669" : "#aaa" }}>{att[student.id] ? "Keldi · 出席" : "Kelmadi · 欠席"}</span>
            </div>
          ))}
      </div>

      {/* Feedback Forma */}
      <div style={{ background: "#F0F0FF", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: "#4F46E5", marginBottom: 14 }}>📝 Dars Hisoboti · 授業レポート</div>

        {/* Reyting */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 8 }}>Dars sifati · 授業品質</label>
          <div style={{ display: "flex", gap: 8 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => saveFeedback({ rating: n })} style={{ width: 40, height: 40, borderRadius: 10, border: "none", cursor: "pointer", background: n <= fb.rating ? "#F59E0B" : "#E5E7EB", fontSize: 20, transition: "all 0.15s", transform: n <= fb.rating ? "scale(1.1)" : "scale(1)" }}>★</button>
            ))}
            {fb.rating > 0 && <span style={{ alignSelf: "center", fontSize: 13, color: "#888", marginLeft: 4 }}>{["","Yomon","O'rtacha","Yaxshi","A'lo","Mukammal"][fb.rating]}</span>}
          </div>
        </div>

        {/* Kayfiyat */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 8 }}>Talabalar kayfiyati · 学生の雰囲気</label>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {[["😴","Uyquli"],["😐","Neytral"],["🙂","Yaxshi"],["😊","Faol"],["🔥","Juda faol"]].map(([emoji, label]) => (
              <button key={label} onClick={() => saveFeedback({ mood: label })} style={{ padding: "6px 12px", borderRadius: 20, border: "2px solid " + (fb.mood === label ? "#4F46E5" : "#E5E7EB"), cursor: "pointer", background: fb.mood === label ? "#EEF2FF" : "#fff", fontSize: 13, fontWeight: 600, color: fb.mood === label ? "#4F46E5" : "#666" }}>
                {emoji} {label}
              </button>
            ))}
          </div>
        </div>

        {/* Izoh */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 6 }}>Dars izohi · 授業コメント</label>
          <textarea value={fb.text} onChange={e => saveFeedback({ text: e.target.value })} placeholder="Dars qanday o'tdi? Qiyinchiliklar, yutuqlar..." style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #C7D2FE", borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical", height: 80, fontFamily: "inherit", boxSizing: "border-box", background: "#fff" }} />
        </div>

        {/* Keyingi reja */}
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 6 }}>Keyingi dars rejasi · 次回授業計画</label>
          <textarea value={fb.nextPlan} onChange={e => saveFeedback({ nextPlan: e.target.value })} placeholder="Keyingi darsda nima qilinadi?" style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #C7D2FE", borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical", height: 60, fontFamily: "inherit", boxSizing: "border-box", background: "#fff" }} />
        </div>

        {/* Yaponiya hisoboti */}
        <div>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#555", display: "block", marginBottom: 6 }}>🇯🇵 Yapon tomon uchun xulosa · 日本側へのサマリー</label>
          <textarea value={fb.summary} onChange={e => saveFeedback({ summary: e.target.value })} placeholder="Yapon mijozga yuboriladigan professional hisobot..." style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #C7D2FE", borderRadius: 8, fontSize: 13, outline: "none", resize: "vertical", height: 80, fontFamily: "inherit", boxSizing: "border-box", background: "#fff" }} />
        </div>

        {/* Saqlandi belgisi */}
        {(fb.text || fb.summary || fb.rating > 0) && (
          <div style={{ marginTop: 10, fontSize: 12, color: "#059669", fontWeight: 600 }}>✓ Feedback avtomatik saqlandi · 自動保存済み</div>
        )}
      </div>
    </div>
  );
}

function Sessions({ data, save }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editSession, setEditSession] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("all");
  const emptyForm = { institutionId: "", date: new Date().toISOString().split("T")[0], time: "10:00", topic: "", notes: "" };
  const [form, setForm] = useState(emptyForm);
  const sorted = [...data.sessions].filter(s => filter === "all" || s.institutionId === filter).sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));

  function addSession() {
    if (!form.institutionId || !form.date || !form.topic) return;
    save({ ...data, sessions: [...data.sessions, { ...form, id: Date.now().toString() }] });
    setShowAdd(false);
    setForm(emptyForm);
  }

  function updateSession() {
    if (!form.institutionId || !form.date || !form.topic) return;
    save({ ...data, sessions: data.sessions.map(s => s.id === editSession.id ? { ...s, ...form } : s) });
    setEditSession(null);
    setForm(emptyForm);
  }

  function openEdit(session, e) {
    e.stopPropagation();
    setEditSession(session);
    setForm({ institutionId: session.institutionId, date: session.date, time: session.time, topic: session.topic, notes: session.notes || "" });
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

  const SessionForm = ({ onSubmit, btnText }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div>
        <label style={lbl}>Muassasa · 機関 *</label>
        <select value={form.institutionId} onChange={e => setForm({ ...form, institutionId: e.target.value })} style={inp}>
          <option value="">Tanlang · 選択...</option>
          {data.institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        <div><label style={lbl}>Sana · 日付 *</label><input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inp} /></div>
        <div><label style={lbl}>Soat · 時間</label><input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={inp} /></div>
      </div>
      <div>
        <label style={lbl}>Mavzu · テーマ *</label>
        <select value={TOPICS.includes(form.topic) ? form.topic : ""} onChange={e => setForm({ ...form, topic: e.target.value })} style={inp}>
          <option value="">Tanlang · 選択...</option>
          {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <input type="text" placeholder="Boshqa mavzu · その他..." value={TOPICS.includes(form.topic) ? "" : form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} style={{ ...inp, marginTop: 8 }} />
      </div>
      <div><label style={lbl}>Izoh · メモ</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, height: 80, resize: "vertical" }} /></div>
      <button onClick={onSubmit} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>{btnText}</button>
    </div>
  );

  return (
    <div style={{ display: "grid", gridTemplateColumns: selected ? "1fr 420px" : "1fr", gap: 20 }}>
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>📅 Dars jadvali · 授業スケジュール</h2>
          <button onClick={() => setShowAdd(true)} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
            <Icon name="plus" size={16} /> Yangi dars · 新授業
          </button>
        </div>
        <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
          <button onClick={() => setFilter("all")} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: filter === "all" ? "#4F46E5" : "#f3f4f6", color: filter === "all" ? "#fff" : "#555" }}>Hammasi · 全て</button>
          {data.institutions.map(inst => (
            <button key={inst.id} onClick={() => setFilter(inst.id)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: filter === inst.id ? inst.color : "#f3f4f6", color: filter === inst.id ? "#fff" : "#555" }}>{inst.name.split(" ")[0]}</button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {sorted.length === 0 ? (
            <div style={{ textAlign: "center", padding: 60, color: "#aaa" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div>Hali dars yo'q · まだ授業がありません</div>
            </div>
          ) : sorted.map(session => {
            const inst = data.institutions.find(i => i.id === session.institutionId);
            const instStudents = data.students.filter(s => s.institutionId === session.institutionId);
            const att = data.attendance[session.id] || {};
            const presentCount = Object.values(att).filter(Boolean).length;
            const fb = data.feedback[session.id];
            const hasFeedback = fb?.text || fb?.rating > 0 || fb?.summary;
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
                        {hasFeedback && <span style={{ fontSize: 11, background: "#05996920", color: "#059669", padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>📝 Hisobot</span>}
                        {instStudents.length > 0 && <span style={{ fontSize: 11, background: "#F0F0FF", color: "#4F46E5", padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{presentCount}/{instStudents.length}</span>}
                        <button onClick={e => openEdit(session, e)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4F46E5", padding: 4, opacity: 0.7, fontSize: 14 }}>✏️</button>
                        <button onClick={e => { e.stopPropagation(); deleteSession(session.id); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#DC2626", padding: 4, opacity: 0.6 }}><Icon name="trash" size={15} /></button>
                      </div>
                    </div>
                    {fb?.rating > 0 && <div style={{ fontSize: 12, color: "#F59E0B", marginTop: 4 }}>{"★".repeat(fb.rating)}{"☆".repeat(5 - fb.rating)}</div>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {selected && <SessionDetail session={selected} data={data} save={save} onClose={() => setSelected(null)} />}
      {showAdd && (
        <Modal title="Yangi dars qo'shish · 新授業追加" onClose={() => setShowAdd(false)}>
          <SessionForm onSubmit={addSession} btnText="Dars qo'shish · 追加" />
        </Modal>
      )}
      {editSession && (
        <Modal title="Darsni tahrirlash · 授業編集" onClose={() => { setEditSession(null); setForm({ institutionId: "", date: new Date().toISOString().split("T")[0], time: "10:00", topic: "", notes: "" }); }}>
          <SessionForm onSubmit={updateSession} btnText="Saqlash · 保存" />
        </Modal>
      )}
    </div>
  );
}

function Students({ data, save }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [filterInst, setFilterInst] = useState("all");
  const emptyForm = { institutionId: "", name: "", email: "", notes: "" };
  const [form, setForm] = useState(emptyForm);

  function addStudent() {
    if (!form.institutionId || !form.name) return;
    save({ ...data, students: [...data.students, { ...form, id: Date.now().toString() }] });
    setShowAdd(false);
    setForm(emptyForm);
  }

  function updateStudent() {
    if (!form.institutionId || !form.name) return;
    save({ ...data, students: data.students.map(s => s.id === editStudent.id ? { ...s, ...form } : s) });
    setEditStudent(null);
    setForm(emptyForm);
  }

  function openEdit(student, e) {
    e.stopPropagation();
    setEditStudent(student);
    setForm({ institutionId: student.institutionId, name: student.name, email: student.email || "", notes: student.notes || "" });
  }

  function deleteStudent(id) {
    if (!window.confirm("O'chirishni tasdiqlaysizmi?")) return;
    save({ ...data, students: data.students.filter(s => s.id !== id) });
  }

  const filtered = data.students.filter(s => filterInst === "all" || s.institutionId === filterInst);
  const inp = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lbl = { display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 };

  const StudentForm = ({ onSubmit, btnText }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div><label style={lbl}>Muassasa · 機関 *</label>
        <select value={form.institutionId} onChange={e => setForm({ ...form, institutionId: e.target.value })} style={inp}>
          <option value="">Tanlang · 選択...</option>
          {data.institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
      <div><label style={lbl}>Ism sharifi · 氏名 *</label><input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} placeholder="Abdullayev Bobur" /></div>
      <div><label style={lbl}>Email</label><input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inp} /></div>
      <div><label style={lbl}>Izoh · メモ</label><textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, height: 70, resize: "vertical" }} /></div>
      <button onClick={onSubmit} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 10, padding: "12px 20px", cursor: "pointer", fontSize: 14, fontWeight: 700 }}>{btnText}</button>
    </div>
  );
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>👥 Talabalar · 学生</h2>
        <button onClick={() => setShowAdd(true)} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="plus" size={16} /> Talaba qo'shish · 学生追加
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={() => setFilterInst("all")} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: filterInst === "all" ? "#4F46E5" : "#f3f4f6", color: filterInst === "all" ? "#fff" : "#555" }}>Hammasi · 全て ({data.students.length})</button>
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
            <div>Talabalar yo'q · 学生がいません</div>
          </div>
        ) : filtered.map(student => {
          const inst = data.institutions.find(i => i.id === student.institutionId);
          const studentSessions = data.sessions.filter(s => s.institutionId === student.institutionId);
          const attended = studentSessions.filter(s => data.attendance[s.id]?.[student.id]).length;
          const pct = studentSessions.length ? Math.round(attended / studentSessions.length * 100) : 0;
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
                <button onClick={e => openEdit(student, e)} style={{ background: "none", border: "none", cursor: "pointer", color: "#4F46E5", opacity: 0.7, fontSize: 14 }}>✏️</button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ fontSize: 12, background: (inst?.color || "#ccc") + "15", color: inst?.color || "#555", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>{inst?.name}</span>
                <span style={{ fontSize: 12, background: "#F0F0FF", color: "#4F46E5", padding: "4px 10px", borderRadius: 20, fontWeight: 600 }}>{attended}/{studentSessions.length} · {pct}%</span>
              </div>
            </div>
          );
        })}
      </div>
      {showAdd && (
        <Modal title="Yangi talaba · 新学生" onClose={() => setShowAdd(false)}>
          <StudentForm onSubmit={addStudent} btnText="Talaba qo'shish · 追加" />
        </Modal>
      )}
      {editStudent && (
        <Modal title="Talabani tahrirlash · 学生編集" onClose={() => { setEditStudent(null); setForm(emptyForm); }}>
          <StudentForm onSubmit={updateStudent} btnText="Saqlash · 保存" />
        </Modal>
      )}
    </div>
  );
}

function Files({ data, save }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filterInst, setFilterInst] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", url: "", type: "pdf", institutionId: "", description: "" });

  const files = data.files || [];

  const FILE_TYPES = [
    { id: "pdf", label: "PDF", icon: "📄", color: "#DC2626" },
    { id: "ppt", label: "PPT/PPTX", icon: "📊", color: "#D97706" },
    { id: "word", label: "Word", icon: "📝", color: "#2563EB" },
    { id: "txt", label: "TXT", icon: "📃", color: "#059669" },
    { id: "other", label: "Boshqa", icon: "📁", color: "#6B7280" },
  ];

  function getFileInfo(type) {
    return FILE_TYPES.find(t => t.id === type) || FILE_TYPES[FILE_TYPES.length - 1];
  }

  // Google Drive havolasini to'g'ridan-to'g'ri ochish uchun o'zgartirish
  function fixGoogleDriveUrl(url) {
    const match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return `https://drive.google.com/file/d/${match[1]}/view`;
    return url;
  }

  function addFile() {
    if (!form.name || !form.url || !form.institutionId) return;
    const newFile = {
      ...form,
      url: fixGoogleDriveUrl(form.url),
      id: Date.now().toString(),
      addedAt: new Date().toISOString().split("T")[0],
    };
    save({ ...data, files: [...files, newFile] });
    setShowAdd(false);
    setForm({ name: "", url: "", type: "pdf", institutionId: "", description: "" });
  }

  function deleteFile(id) {
    if (!window.confirm("Faylni o'chirishni tasdiqlaysizmi?")) return;
    save({ ...data, files: files.filter(f => f.id !== id) });
  }

  const filtered = files.filter(f => {
    const instOk = filterInst === "all" || f.institutionId === filterInst;
    const typeOk = filterType === "all" || f.type === filterType;
    const searchOk = !search || f.name.toLowerCase().includes(search.toLowerCase()) || f.description?.toLowerCase().includes(search.toLowerCase());
    return instOk && typeOk && searchOk;
  });

  const inp = { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e7eb", borderRadius: 8, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" };
  const lbl = { display: "block", fontSize: 13, fontWeight: 600, color: "#444", marginBottom: 6 };

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>📚 O'quv Materiallari · 教材ファイル</h2>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#888" }}>Google Drive, OneDrive, Dropbox havolalari</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ background: "#4F46E5", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
          <Icon name="plus" size={16} /> Fayl qo'shish · 追加
        </button>
      </div>

      {/* Qo'llanma */}
      <div style={{ background: "linear-gradient(135deg, #EEF2FF, #F0FDF4)", borderRadius: 14, padding: 16, marginBottom: 20, border: "1px solid #C7D2FE" }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#4F46E5", marginBottom: 8 }}>💡 Qanday ishlatiladi? · 使い方</div>
        <div style={{ fontSize: 12, color: "#555", lineHeight: 1.8 }}>
          1. Faylni <strong>Google Drive</strong> ga yuklang → O'ng bosing → "Ulashish" → Havolani nusxalang<br/>
          2. Yoki <strong>OneDrive / Dropbox</strong> havolasini ham qo'shsa bo'ladi<br/>
          3. Bu yerga nom, havola va muassasani kiriting → Saqlang ✅
        </div>
      </div>

      {/* Search va filter */}
      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap", alignItems: "center" }}>
        <input
          type="text"
          placeholder="🔍 Qidirish · 検索..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ ...inp, width: 200, padding: "8px 12px" }}
        />
        <button onClick={() => setFilterInst("all")} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: filterInst === "all" ? "#4F46E5" : "#f3f4f6", color: filterInst === "all" ? "#fff" : "#555" }}>Hammasi</button>
        {data.institutions.map(inst => (
          <button key={inst.id} onClick={() => setFilterInst(inst.id)} style={{ padding: "6px 14px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: filterInst === inst.id ? inst.color : "#f3f4f6", color: filterInst === inst.id ? "#fff" : "#555" }}>
            {inst.name.split(" ")[0]}
          </button>
        ))}
        <div style={{ borderLeft: "1px solid #e5e7eb", height: 24 }} />
        {FILE_TYPES.map(t => (
          <button key={t.id} onClick={() => setFilterType(filterType === t.id ? "all" : t.id)} style={{ padding: "6px 12px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600, background: filterType === t.id ? t.color : "#f3f4f6", color: filterType === t.id ? "#fff" : "#555" }}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Statistika */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap" }}>
        {FILE_TYPES.map(t => {
          const count = files.filter(f => f.type === t.id).length;
          if (!count) return null;
          return (
            <div key={t.id} style={{ background: "#fff", borderRadius: 10, padding: "8px 14px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ fontSize: 16 }}>{t.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: t.color }}>{count}</span>
              <span style={{ fontSize: 12, color: "#888" }}>{t.label}</span>
            </div>
          );
        })}
        <div style={{ background: "#fff", borderRadius: 10, padding: "8px 14px", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: "#4F46E5" }}>{files.length}</span>
          <span style={{ fontSize: 12, color: "#888", marginLeft: 4 }}>Jami fayl</span>
        </div>
      </div>

      {/* Fayllar ro'yxati */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: 60, color: "#aaa", background: "#fff", borderRadius: 16, boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Fayllar yo'q · ファイルがありません</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Yuqoridagi "Fayl qo'shish" tugmasini bosing</div>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 14 }}>
          {filtered.map(file => {
            const inst = data.institutions.find(i => i.id === file.institutionId);
            const typeInfo = getFileInfo(file.type);
            return (
              <div key={file.id} style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: `1.5px solid ${typeInfo.color}18`, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 52, height: 52, borderRadius: 13, background: typeInfo.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0 }}>
                  {typeInfo.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 800, color: "#111", marginBottom: 4, lineHeight: 1.3 }}>{file.name}</div>
                  {file.description && <div style={{ fontSize: 12, color: "#666", marginBottom: 6, fontStyle: "italic" }}>{file.description}</div>}
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                    <span style={{ fontSize: 11, background: (inst?.color || "#ccc") + "18", color: inst?.color || "#888", padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{inst?.name}</span>
                    <span style={{ fontSize: 11, background: typeInfo.color + "15", color: typeInfo.color, padding: "3px 8px", borderRadius: 20, fontWeight: 600 }}>{typeInfo.icon} {typeInfo.label}</span>
                    <span style={{ fontSize: 11, color: "#aaa", padding: "3px 0" }}>📅 {file.addedAt}</span>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <a href={file.url} target="_blank" rel="noreferrer" style={{ fontSize: 12, background: "#EEF2FF", color: "#4F46E5", padding: "6px 14px", borderRadius: 8, fontWeight: 700, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                      🔗 Ochish · 開く
                    </a>
                    <button onClick={() => deleteFile(file.id)} style={{ fontSize: 12, background: "#FEE2E2", color: "#DC2626", padding: "6px 10px", borderRadius: 8, fontWeight: 700, border: "none", cursor: "pointer" }}>
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Fayl qo'shish modal */}
      {showAdd && (
        <Modal title="📎 Fayl qo'shish · ファイル追加" onClose={() => setShowAdd(false)}>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={lbl}>Fayl nomi · ファイル名 *</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} placeholder="Mas: Yapon ish madaniyati - 1-dars.pdf" />
            </div>
            <div>
              <label style={lbl}>Havola · リンク * (Google Drive, OneDrive, Dropbox)</label>
              <input type="url" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} style={inp} placeholder="https://drive.google.com/..." />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div>
                <label style={lbl}>Fayl turi · ファイル種別 *</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
                  {FILE_TYPES.map(t => <option key={t.id} value={t.id}>{t.icon} {t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={lbl}>Muassasa · 機関 *</label>
                <select value={form.institutionId} onChange={e => setForm({ ...form, institutionId: e.target.value })} style={inp}>
                  <option value="">Tanlang...</option>
                  {data.institutions.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label style={lbl}>Tavsif · 説明 (ixtiyoriy)</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={{ ...inp, height: 70, resize: "vertical" }} placeholder="Bu fayl haqida qisqacha ma'lumot..." />
            </div>

            {/* Google Drive qo'llanmasi */}
            <div style={{ background: "#F0FDF4", borderRadius: 10, padding: 12, border: "1px solid #BBF7D0" }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#059669", marginBottom: 6 }}>📖 Google Drive havolasini qanday olish:</div>
              <div style={{ fontSize: 11, color: "#065F46", lineHeight: 1.8 }}>
                1. Drive da faylga o'ng bosing<br/>
                2. "Ulashish" → "Havola olish" ni bosing<br/>
                3. "Havola orqali kirish huquqi bor" ni tanlang<br/>
                4. Havolani nusxalab bu yerga joylashtiring
              </div>
            </div>

            <button
              onClick={addFile}
              disabled={!form.name || !form.url || !form.institutionId}
              style={{ background: form.name && form.url && form.institutionId ? "#4F46E5" : "#C7D2FE", color: "#fff", border: "none", borderRadius: 10, padding: "13px 20px", cursor: form.name && form.url && form.institutionId ? "pointer" : "not-allowed", fontSize: 14, fontWeight: 700 }}
            >
              ✅ Saqlash · 保存
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}


  const [selected, setSelected] = useState(data.institutions[0]?.id || "");
  const inst = data.institutions.find(i => i.id === selected);
  const students = data.students.filter(s => s.institutionId === selected);
  const sessions = data.sessions.filter(s => s.institutionId === selected).sort((a, b) => a.date.localeCompare(b.date));

  function exportExcel() {
    const wb = XLSX.utils.book_new();

    // 1-varaq: Davomat jadvali
    const attHeaders = ["Talaba ismi · 学生氏名", "Email", ...sessions.map(s => s.date + " " + s.topic.slice(0, 20)), "Jami · 合計", "Foiz · 割合"];
    const attRows = students.map(st => {
      const attended = sessions.filter(s => data.attendance[s.id]?.[st.id]).length;
      const pct = sessions.length ? Math.round(attended / sessions.length * 100) + "%" : "0%";
      return [st.name, st.email || "", ...sessions.map(s => data.attendance[s.id]?.[st.id] ? "✓" : "✗"), attended + "/" + sessions.length, pct];
    });
    const ws1 = XLSX.utils.aoa_to_sheet([attHeaders, ...attRows]);
    ws1["!cols"] = [{ wch: 25 }, { wch: 25 }, ...sessions.map(() => ({ wch: 18 })), { wch: 10 }, { wch: 8 }];
    XLSX.utils.book_append_sheet(wb, ws1, "Davomat · 出席");

    // 2-varaq: Dars hisobotlari
    const fbHeaders = ["Sana · 日付", "Soat · 時間", "Mavzu · テーマ", "Davomat · 出席", "Reyting · 評価", "Kayfiyat · 雰囲気", "Dars izohi · コメント", "Keyingi reja · 次回計画", "Yaponiya hisoboti · 日本側サマリー"];
    const fbRows = sessions.map(s => {
      const att = data.attendance[s.id] || {};
      const present = Object.values(att).filter(Boolean).length;
      const fb = data.feedback[s.id] || {};
      return [s.date, s.time, s.topic, present + "/" + students.length, fb.rating ? "★".repeat(fb.rating) : "-", fb.mood || "-", fb.text || "-", fb.nextPlan || "-", fb.summary || "-"];
    });
    const ws2 = XLSX.utils.aoa_to_sheet([fbHeaders, ...fbRows]);
    ws2["!cols"] = [{ wch: 12 }, { wch: 8 }, { wch: 30 }, { wch: 10 }, { wch: 10 }, { wch: 12 }, { wch: 40 }, { wch: 30 }, { wch: 50 }];
    XLSX.utils.book_append_sheet(wb, ws2, "Hisobotlar · レポート");

    // 3-varaq: Umumiy statistika
    const totalSessions = sessions.length;
    const avgAtt = students.length && totalSessions ? Math.round(sessions.reduce((acc, s) => {
      const att = data.attendance[s.id] || {};
      return acc + Object.values(att).filter(Boolean).length;
    }, 0) / totalSessions * 100 / students.length) : 0;
    const statsData = [
      ["Ko'rsatkich · 指標", "Qiymat · 値"],
      ["Muassasa · 機関", inst?.name],
      ["Jami talabalar · 総学生数", students.length],
      ["Jami darslar · 総授業数", totalSessions],
      ["O'rtacha davomat · 平均出席率", avgAtt + "%"],
      ["Hisobot yozilgan darslar · レポート済み授業", sessions.filter(s => data.feedback[s.id]?.text).length],
      ["Hisobot sanasi · レポート日", new Date().toLocaleDateString("uz-UZ")],
    ];
    const ws3 = XLSX.utils.aoa_to_sheet(statsData);
    ws3["!cols"] = [{ wch: 35 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(wb, ws3, "Statistika · 統計");

    XLSX.writeFile(wb, `bridge-se-${inst?.name}-${new Date().toISOString().slice(0,10)}.xlsx`);
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>📊 Hisobotlar · レポート</h2>
        <button onClick={exportExcel} style={{ background: "#059669", color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", cursor: "pointer", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
          <Icon name="download" size={16} /> Excel · ダウンロード
        </button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {data.institutions.map(i => (
          <button key={i.id} onClick={() => setSelected(i.id)} style={{ padding: "8px 16px", borderRadius: 20, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, background: selected === i.id ? i.color : "#f3f4f6", color: selected === i.id ? "#fff" : "#555" }}>{i.name}</button>
        ))}
      </div>
      {inst && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
            {[
              ["Talabalar · 学生", students.length, inst.color],
              ["Darslar · 授業", sessions.length, "#4F46E5"],
              ["Hisobot · レポート", sessions.filter(s => data.feedback[s.id]?.text).length, "#059669"],
              ["O'rt. reyting · 平均評価", sessions.filter(s => data.feedback[s.id]?.rating > 0).length ? (sessions.reduce((a, s) => a + (data.feedback[s.id]?.rating || 0), 0) / sessions.filter(s => data.feedback[s.id]?.rating > 0).length).toFixed(1) + "★" : "-", "#F59E0B"]
            ].map(([label, value, color]) => (
              <div key={label} style={{ background: "#fff", borderRadius: 12, padding: 18, textAlign: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color }}>{value}</div>
                <div style={{ fontSize: 12, color: "#888", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>

          {sessions.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", marginBottom: 20, overflowX: "auto" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>📋 Dars hisobotlari · 授業レポート一覧</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Sana · 日付</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Mavzu · テーマ</th>
                    <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700 }}>Davomat · 出席</th>
                    <th style={{ textAlign: "center", padding: "10px 12px", fontWeight: 700 }}>Reyting · 評価</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Kayfiyat · 雰囲気</th>
                    <th style={{ textAlign: "left", padding: "10px 12px", fontWeight: 700 }}>Izoh · コメント</th>
                  </tr>
                </thead>
                <tbody>
                  {sessions.map((s, idx) => {
                    const att = data.attendance[s.id] || {};
                    const present = Object.values(att).filter(Boolean).length;
                    const pct = students.length ? Math.round(present / students.length * 100) : 0;
                    const fb = data.feedback[s.id] || {};
                    return (
                      <tr key={s.id} style={{ background: idx % 2 === 0 ? "#fff" : "#FAFAFA", borderBottom: "1px solid #F3F4F6" }}>
                        <td style={{ padding: "10px 12px", fontWeight: 600 }}>{s.date}</td>
                        <td style={{ padding: "10px 12px", maxWidth: 200 }}>{s.topic}</td>
                        <td style={{ textAlign: "center", padding: "10px 12px" }}>
                          <span style={{ fontWeight: 700, color: pct >= 80 ? "#059669" : pct >= 60 ? "#D97706" : "#DC2626" }}>{present}/{students.length} · {pct}%</span>
                        </td>
                        <td style={{ textAlign: "center", padding: "10px 12px", color: "#F59E0B" }}>{fb.rating ? "★".repeat(fb.rating) : <span style={{ color: "#ccc" }}>—</span>}</td>
                        <td style={{ padding: "10px 12px" }}>{fb.mood || <span style={{ color: "#ccc" }}>—</span>}</td>
                        <td style={{ padding: "10px 12px", color: "#666", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{fb.text || <span style={{ color: "#ccc" }}>—</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {students.length > 0 && sessions.length > 0 && (
            <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 2px 10px rgba(0,0,0,0.06)", overflowX: "auto" }}>
              <h3 style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 700 }}>👥 Davomat jadvali · 出席表</h3>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px 12px", background: "#F9FAFB", fontWeight: 700 }}>Talaba · 学生</th>
                    {sessions.map(s => <th key={s.id} style={{ padding: "8px 10px", background: "#F9FAFB", fontWeight: 600, fontSize: 11, textAlign: "center" }}>{s.date.slice(5)}</th>)}
                    <th style={{ padding: "8px 10px", background: "#F9FAFB", fontWeight: 700, textAlign: "center" }}>%</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((st, idx) => {
                    const attended = sessions.filter(s => data.attendance[s.id]?.[st.id]).length;
                    const pct = sessions.length ? Math.round(attended / sessions.length * 100) : 0;
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!loaded) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "sans-serif" }}>
      <div style={{ textAlign: "center" }}><div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div><div style={{ color: "#888" }}>Yuklanmoqda · 読み込み中...</div></div>
    </div>
  );

  const navItems = [
    { id: "home", icon: "home", label: "Bosh sahifa", jp: "ホーム" },
    { id: "sessions", icon: "calendar", label: "Darslar", jp: "授業" },
    { id: "students", icon: "users", label: "Talabalar", jp: "学生" },
    { id: "files", icon: "star", label: "Materiallar", jp: "教材" },
    { id: "reports", icon: "bar", label: "Hisobotlar", jp: "報告" },
  ];

  // MOBIL VERSIYA
  if (isMobile) return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#F4F6FB", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Mobil header */}
      <div style={{ background: "#1E1B4B", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>🌸 Bridge SE</div>
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.4)" }}>FPT Consulting Japan</div>
        </div>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{data.students.length} talaba · {data.sessions.length} dars</div>
      </div>

      {/* Kontent */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 14px 80px" }}>
        {tab === "home" && <Dashboard data={data} setTab={setTab} />}
        {tab === "sessions" && <Sessions data={data} save={save} />}
        {tab === "students" && <Students data={data} save={save} />}
        {tab === "files" && <Files data={data} save={save} />}
        {tab === "reports" && <Reports data={data} />}
      </div>

      {/* Pastki navigatsiya */}
      <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "#1E1B4B", display: "flex", borderTop: "1px solid rgba(255,255,255,0.1)", zIndex: 100 }}>
        {navItems.map(item => (
          <button key={item.id} onClick={() => setTab(item.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "10px 4px", border: "none", cursor: "pointer", background: "transparent", color: tab === item.id ? "#fff" : "rgba(255,255,255,0.45)", borderTop: tab === item.id ? "2px solid #818CF8" : "2px solid transparent" }}>
            <Icon name={item.icon} size={20} />
            <div style={{ fontSize: 10, fontWeight: 600, marginTop: 3 }}>{item.label}</div>
            <div style={{ fontSize: 9, opacity: 0.6 }}>{item.jp}</div>
          </button>
        ))}
      </div>
    </div>
  );

  // DESKTOP VERSIYA
  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#F4F6FB", minHeight: "100vh", display: "flex" }}>
      <div style={{ width: 210, background: "#1E1B4B", flexShrink: 0, display: "flex", flexDirection: "column", padding: "24px 0" }}>
        <div style={{ padding: "0 20px 24px", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff" }}>🌸 Bridge SE</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>FPT Consulting Japan</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>Kosimov Hasan</div>
        </div>
        <nav style={{ padding: "16px 12px", flex: 1 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setTab(item.id)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, border: "none", cursor: "pointer", marginBottom: 4, textAlign: "left", background: tab === item.id ? "rgba(255,255,255,0.15)" : "transparent", color: tab === item.id ? "#fff" : "rgba(255,255,255,0.6)" }}>
              <Icon name={item.icon} size={17} />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{item.label}</div>
                <div style={{ fontSize: 10, opacity: 0.6 }}>{item.jp}</div>
              </div>
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
