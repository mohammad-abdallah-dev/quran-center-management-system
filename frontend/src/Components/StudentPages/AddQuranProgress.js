import { Button, Select } from "antd";
import axios from "../../api" 
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
export default function AddQuranprogress() {
  const { id } = useParams();
  const navigate = useNavigate();
    const Account = JSON.parse(localStorage.getItem("Account"));

  const [student, setStudent] = useState({});
  const [juzNumber, setJuzNumber] = useState("");
  const [strength, setStrength] = useState("");
  const [notes, setNotes] = useState("");

  async function getStudent() {
    const res = await axios.get(`/Students/${id}`);
    setStudent(res.data);
  }

  async function handleAdd() {
  const juz = Number(juzNumber);

  if (!juzNumber || !strength) {
    toast.error("❌ رقم الجزء والمستوى مطلوبين", {
      position: "top-center",
      autoClose: 2000,
    });
    return;
  }

  if (juz < 1 || juz > 30) {
    toast.error("❌ رقم الجزء يجب أن يكون بين 1 و 30", {
      position: "top-center",
      autoClose: 2000,
    });
    return;
  }

  try {
    await axios.post("/StudentQuranProgresses", {
      studentId: Number(id),
      juzNumber: juz,
      strength,
      notes,
      date: new Date(),
      LastTeacher: Account.userName,
    });

    toast.success("✅ تم إضافة الجزء بنجاح", {
      position: "top-center",
      autoClose: 2000,
    });

    setTimeout(() => {
      navigate(`/StudentQuranProgress/${id}`);
    }, 1200);
  } catch (err) {
    console.log(err);

    toast.error("❌ حدث خطأ أثناء الإضافة", {
      position: "top-center",
      autoClose: 2500,
    });
  }
}

  useEffect(() => {
    getStudent();
  }, []);

  return (
    <div style={styles.page}>
            <ToastContainer position="top-center" autoClose={2000} theme="dark" />

      <div style={styles.card}>
        <Button style={styles.backBtn} onClick={() => navigate(`/StudentQuranProgress/${id}`)}>
        ↩️  كشف الأجزاء
        </Button>

        <div style={styles.studentBox}>
          <h2 style={styles.studentName}>{student.name}</h2>
          <p style={styles.className}>{student.className}</p>
        </div>

        <h1 style={styles.title}>إضافة جزء جديد</h1>

        <label style={styles.label}>رقم الجزء</label>
        <input
  style={styles.input}
  type="number"
  min="1"
  max="30"
  placeholder="مثلاً 27"
  value={juzNumber}
  onChange={(e) => setJuzNumber(e.target.value)}
/>

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

        <label style={styles.label}>الملاحظات</label>
        <textarea
          style={styles.textarea}
          placeholder="اكتب كل ملاحظة بسطر جديد"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Button style={styles.button} onClick={handleAdd}>
          حفظ
        </Button>
      </div>
    </div>
  );
}

const styles = {
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

  studentBox: {
    textAlign: "center",
    marginBottom: "14px",
    paddingBottom: "12px",
    borderBottom: "1px solid rgba(185,200,138,.18)",
  },

  studentName: {
    color: "#f4f0db",
    margin: 0,
    fontSize: "22px",
  },

  className: {
    color: "#b9c88a",
    margin: "6px 0 0",
  },

  title: {
    color: "#f4f0db",
    margin: "0 0 18px",
    fontSize: "24px",
    textAlign: "center",
  },

  label: {
    display: "block",
    color: "#b9c88a",
    marginBottom: "6px",
    marginTop: "12px",
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
  },
};