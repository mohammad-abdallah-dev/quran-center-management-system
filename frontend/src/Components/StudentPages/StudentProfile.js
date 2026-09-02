import { Button } from "antd";
import axios from "../../api" 
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Spin } from "antd";
export default function StudentProfile() {
    const Account = JSON.parse(localStorage.getItem("Account"));

  const [Studentinfo, setStudentInfo] = useState({});
  const [StudentQuranInfos, setStudentQuranInfos] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);

  const { id } = useParams();
async function handleDelete(id) {
  const confirmDelete = window.confirm(
    "هل أنت متأكد من حذف هذا الجزء؟"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(
      `/StudentQuranProgresses/${id}`
    );

    setStudentQuranInfos((prev) =>
      prev.filter((item) => item.id !== id)
    );
  } catch (err) {
    console.log(err);
    alert("حدث خطأ أثناء الحذف");
  }
  
}
async function GetInfos() {
  setPageLoading(true);

  try {
    const res = await axios.get(`/Students/${id}`);
    setStudentInfo(res.data);
  } catch (error) {
    console.log(error);
  } finally {
    setPageLoading(false);
  }
}

  useEffect(() => {
    GetInfos();
  }, [id]);
if (pageLoading) {
  return (
    <div style={styles.loadingPage}>
<Spin
  size="large"
  style={{
    color: "#9ACD32",
  }}
/>      <p style={styles.loadingText}>جاري تحميل البيانات...</p>
    </div>
  );
}
 return (

  <div style={styles.page}>
   <Link to={`/DashBoards/Students/${Account.classId}`}>
  <Button style={styles.backBtn}>كشف الطلاب</Button>
</Link>
    <div style={styles.card}>
      <div style={styles.top}>

        <div>
          <h1 style={styles.name}>{Studentinfo.name}</h1>
          <p style={styles.className}>الشعبة : {Studentinfo.className}</p>
        </div>
      </div>

      <div style={styles.sectionTitle}>كشوفات الطالب</div>

      <div style={styles.progressList}>
        <Link to={`/studentQuranProgress/${id}`}>
          <Button style={styles.addButton}>
            كشف أجزاء الطالب 
          </Button>
        </Link>
      </div>
      <br/>
      <div style={styles.progressList}>
        <Link to={`/StudentDailyProgress/${id}`}>
          <Button style={styles.addButton}>
          كشف التسميع
          </Button>
        </Link>
      </div>
    </div>
  </div>
);
}

const styles = {
   loadingPage: {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100vh",
  background: "#234a2d", // أخضر غامق
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
},

loadingText: {
  marginTop: "20px",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
},
  backBtn: {
  background: "transparent",
  color: "#b9c88a",
  border: "1px solid rgba(185,200,138,.45)",
  borderRadius: "10px",
  marginBottom: "14px",
  fontWeight: "bold",
},
  actions: {
  display: "flex",
  alignItems: "center",
  gap: "24px", // مسافة كبيرة بين الزرين
},

deleteBtn: {
  background: "linear-gradient(135deg,#7b2f2f,#4b1f1f)", // أحمر زيتي
  color: "#fff",
  border: "none",
  padding: "6px 14px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "13px",
  fontWeight: "600",
  transition: ".2s",
},

editIcon: {
  background: "linear-gradient(135deg,#8fa55a,#5f6f35)",
  color: "#fff",
  padding: "6px 14px",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: "600",
  border: "1px solid rgba(255,255,255,.15)",
},
  noteTitle: {
  color: "#a8bc76",
  fontWeight: "bold",
  marginBottom: "8px",
  fontSize: "14px",
},
  addButton: {
  background: "linear-gradient(135deg,#8fa55a,#5f6f35)",
  color: "#fff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  height: "42px",
},
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(rgba(8,18,12,.75), rgba(3,8,5,.92)), url('http://images.unsplash.com/photo-1448375240586-882707db888b')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    padding: "14px",
    boxSizing: "border-box",
    fontFamily: "Segoe UI, sans-serif",
    direction: "rtl",
  },

  card: {
    width: "100%",
    maxWidth: "720px",
    margin: "0 auto",
    background: "rgba(12,22,15,.9)",
    border: "1px solid rgba(139,161,93,.4)",
    borderRadius: "18px",
    padding: "16px",
    boxSizing: "border-box",
    boxShadow: "0 12px 35px rgba(0,0,0,.35)",
  },

  top: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    borderBottom: "1px solid rgba(185,200,138,.18)",
    paddingBottom: "12px",
  },

  name: {
    color: "#f4f0db",
    margin: 0,
    fontSize: "clamp(22px, 5vw, 32px)",
  },

  className: {
    color: "#b9c88a",
    margin: "8px 0 0",
    fontSize: "15px",
  },

  editBtn: {
    display: "none",
  },

  sectionTitle: {
    color: "#f4f0db",
    marginTop: "14px",
    marginBottom: "10px",
    fontSize: "17px",
    fontWeight: "bold",
  },

  progressList: {
    display: "grid",
    gap: "10px",
  },

  progressCard: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(185,200,138,.22)",
    borderRadius: "14px",
    padding: "14px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 6px 18px rgba(0,0,0,.18)",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "8px",
    borderBottom: "1px solid rgba(185,200,138,.15)",
    paddingBottom: "8px",
  },

  juz: {
    color: "#f4f0db",
    margin: 0,
    fontSize: "18px",
    fontWeight: "bold",
  },

  editIcon: {
    background: "linear-gradient(135deg,#8fa55a,#5f6f35)",
    color: "#fff",
    padding: "6px 12px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
    border: "1px solid rgba(255,255,255,.15)",
  },

  row: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
  },

  label: {
    color: "#a8bc76",
    fontSize: "14px",
    fontWeight: "600",
  },

  value: {
    color: "#f5f3e8",
    fontSize: "15px",
    fontWeight: "bold",
  },

notes: {
  padding: "12px",
  background: "rgba(255,255,255,.04)",
  borderRadius: "10px",
  color: "#ddd",
  lineHeight: "1.8",
  fontSize: "14px",
  borderRight: "3px solid #8fa55a",
  whiteSpace: "pre-line", // 👈 تعرض كل سطر تحت الثاني
},

  empty: {
    color: "#ccc",
    textAlign: "center",
    margin: "20px 0",
  },
};