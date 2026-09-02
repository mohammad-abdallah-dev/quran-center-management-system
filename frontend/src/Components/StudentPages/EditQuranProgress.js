import { Button, Select } from "antd";
import axios from "../../api" 
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Spin } from "antd";

export default function EditQuranProgress() {
  const { id } = useParams(); // id تبع الجزء
  const navigate = useNavigate();
    const Account = JSON.parse(localStorage.getItem("Account"));

  const [studentId, setStudentId] = useState("");
  const [juzNumber, setJuzNumber] = useState("");
  const [strength, setStrength] = useState("");
  const [notes, setNotes] = useState("");
const [pageLoading, setPageLoading] = useState(true);

async function getProgress() {
  setPageLoading(true);

  try {
    const res = await axios.get(
      `/StudentQuranProgresses/${id}`
    );

    setStudentId(res.data.studentId);
    setJuzNumber(res.data.juzNumber);
    setStrength(res.data.strength);
    setNotes(res.data.notes);
  } catch (error) {
    console.log(error);
  } finally {
    setPageLoading(false);
  }
}

  async function handleSubmit(e) {
  e.preventDefault();

  const juz = Number(juzNumber);

  if (!juzNumber || !strength) {
    toast.error("❌ رقم الجزء والمستوى مطلوبين");
    return;
  }

  if (juz < 1 || juz > 30) {
    toast.error("❌ رقم الجزء يجب أن يكون بين 1 و 30");
    return;
  }

  try {
    await axios.put(`/StudentQuranProgresses/${id}`, {
      id: Number(id),
      studentId: Number(studentId),
      juzNumber: juz,
      strength,
      notes,
      date: new Date(),
      LastTeacher: Account.userName,
    });

    toast.success("تم تعديل الجزء بنجاح");

    setTimeout(() => {
      navigate(`/StudentQuranProgress/${studentId}`);
    }, 1200);
  } catch (err) {
    console.log(err.response?.data || err.message);
    toast.error("حدث خطأ أثناء التعديل");
  }
}

  useEffect(() => {
    getProgress();
  }, []);
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
      <ToastContainer position="top-center" autoClose={1500} theme="dark" />

      <form onSubmit={handleSubmit} style={styles.card}>
        <Button
          style={styles.backBtn}
          onClick={() => navigate(`/StudentQuranProgress/${studentId}`)}
        >
        ↩️  كشف الأجزاء
        </Button>

        <h1 style={styles.title}>التعديل على الجزء </h1>

        <div style={styles.field}>
          <label style={styles.label}>رقم الجزء</label>
         <input
  style={styles.input}
  type="number"
  min="1"
  max="30"
  placeholder="رقم الجزء"
  value={juzNumber}
  onChange={(e) => setJuzNumber(e.target.value)}
/>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>مستوى الجزء</label>
          <Select
            style={styles.select}
            placeholder="اختار المستوى"
            value={strength || undefined}
            onChange={(value) => setStrength(value)}
            options={[
              { value: "قوي", label: "قوي" },
              { value: "متوسط", label: "متوسط" },
              { value: "ضعيف", label: "ضعيف" },
              { value: "غير مكتمل", label: "غير مكتمل" },
              { value: "جديد", label: "جديد" },


            ]}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>الملاحظات</label>
          <textarea
            style={styles.textarea}
            placeholder="اكتب كل ملاحظة بسطر جديد"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button type="submit" style={styles.button}>
          حفظ التعديل
        </button>
      </form>
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
    maxWidth: "520px",
    margin: "0 auto",
    background: "rgba(12,22,15,.92)",
    border: "1px solid rgba(139,161,93,.4)",
    borderRadius: "18px",
    padding: "18px",
    boxSizing: "border-box",
  },

  backBtn: {
    background: "transparent",
    color: "#b9c88a",
    border: "1px solid rgba(185,200,138,.45)",
    borderRadius: "10px",
    marginBottom: "14px",
  },

  title: {
    color: "#f4f0db",
    margin: "0 0 18px",
    fontSize: "24px",
    textAlign: "center",
  },

  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "18px",
  },

  label: {
    display: "block",
    color: "#b9c88a",
    marginBottom: "6px",
    fontWeight: "bold",
  },

  input: {
    width: "100%",
    height: "42px",
    borderRadius: "10px",
    border: "1px solid rgba(185,200,138,.35)",
    background: "#1f2821",
    color: "#fff",
    padding: "0 12px",
    boxSizing: "border-box",
    outline: "none",
  },

  select: {
    width: "100%",
    height: "42px",
  },

  textarea: {
    width: "100%",
    minHeight: "130px",
    borderRadius: "10px",
    border: "1px solid rgba(185,200,138,.35)",
    background: "#1f2821",
    color: "#fff",
    padding: "12px",
    boxSizing: "border-box",
    outline: "none",
    resize: "vertical",
    lineHeight: "1.7",
  },

  button: {
    width: "100%",
    height: "42px",
    marginTop: "18px",
    background: "linear-gradient(135deg,#8fa55a,#5f6f35)",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    fontWeight: "bold",
    fontSize: "15px",
    cursor: "pointer",
  },
};