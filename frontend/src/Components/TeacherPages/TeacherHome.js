import { useNavigate } from "react-router-dom";

export default function TeacherHome() {
  const navigate = useNavigate();
  const account = JSON.parse(localStorage.getItem("Account"));

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>TEACHER HOME</h1>

        <button style={styles.button} onClick={() => navigate("/CreateStudent")}>
          إنشاء طالب جديد
        </button>

        <button style={styles.button} onClick={() => navigate(`/DashBoards/Students/${account.classId}`)}>
طلاب الشعبة        </button>

        <button style={styles.button} onClick={() => navigate("/DailyProgress")}>
          الإنجاز اليومي
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(rgba(5,12,8,0.82), rgba(3,8,5,0.92)), url('http://images.unsplash.com/photo-1448375240586-882707db888b')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "18px",
    boxSizing: "border-box",
    fontFamily: "Segoe UI, sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "430px",
    padding: "34px 22px",
    borderRadius: "22px",
    background: "rgba(8,18,12,0.9)",
    border: "1px solid rgba(139,161,93,0.55)",
    boxShadow: "0 0 35px rgba(0,0,0,0.75)",
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    color: "#e5e0c8",
    fontSize: "clamp(26px, 8vw, 34px)",
    letterSpacing: "2px",
    marginBottom: "30px",
  },
  button: {
    width: "100%",
    minHeight: "62px",
    marginBottom: "18px",
    borderRadius: "12px",
    border: "1px solid #8fa55a",
    background: "rgba(3,10,6,0.75)",
    color: "#f5f2df",
    fontSize: "clamp(17px, 5vw, 20px)",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 0 18px rgba(143,165,90,0.25)",
  },
};