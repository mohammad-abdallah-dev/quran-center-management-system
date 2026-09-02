import { Button, Select } from "antd";
import axios from "../../api" 
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { Spin } from "antd";

export default function EditStudentDailyProgress() {
  const { id } = useParams(); // id تبع السجل اليومي
  const navigate = useNavigate();

  const Account = JSON.parse(localStorage.getItem("Account"));
  const teacherName =
  Account?.userName ||
  Account?.username ||
  Account?.name ||
  "";
const [isSaving, setIsSaving] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [progressType, setProgressType] = useState("");
  const [content, setContent] = useState("");
  const [progressDate, setProgressDate] = useState("");
  const [nextTask, setNextTask] = useState("");
  const [grade, setGrade] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [note, setNote] = useState("");
const [pageLoading, setPageLoading] = useState(true);

  async function getProgress() {
    try {
      const res = await axios.get(
        `/StudentDailyProgresses/${id}`
      );

      setStudentId(res.data.studentId);
      setContent(res.data.content || "");
      setProgressType(res.data.progressType || "");
      setProgressDate(res.data.progressDate?.split("T")[0] || "");
      setNextTask(res.data.nextTask || "");
      setGrade(res.data.grade ?? "");
      setIsCompleted(res.data.isCompleted || false);
      setNote(res.data.note || "");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("حدث خطأ أثناء جلب بيانات السجل");
    }finally {
    setPageLoading(false);
  }
  }

 async function handleSubmit(e) {
  e.preventDefault();

  if (isSaving) {
    return;
  }

  if (!progressType || !content || !progressDate) {
    toast.warning("يرجى تعبئة نوع الواجب والواجب والتاريخ");
    return;
  }

  try {
    setIsSaving(true);

    await axios.put(
      `/StudentDailyProgresses/${id}`,
      {
        content,
        progressType,
        progressDate,
        nextTask,
        grade: grade === "" ? null : Number(grade),
        isCompleted,
        note,
      }
    );

    toast.success("تم تعديل السجل بنجاح");

    setTimeout(() => {
      navigate(`/StudentDailyProgress/${studentId}`);
    }, 1200);
  } catch (err) {
    console.log(err.response?.data || err.message);
    toast.error("حدث خطأ أثناء التعديل");

    setIsSaving(false);
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
  htmlType="button"
  style={styles.backBtn}
  disabled={isSaving}
  onClick={() =>
    navigate(
      `/StudentDailyProgress/${studentId}`
    )
  }
>
  ↩️ كشف التسميع
</Button>
        <h1 style={styles.title}>التعديل على الواجب</h1>

        <div style={styles.field}>
          <label style={styles.label}>نوع الواجب</label>
          <Select
            style={styles.select}
            placeholder="اختر نوع الواجب"
            value={progressType || undefined}
            onChange={(value) => setProgressType(value)}
            options={[
              { value: "حفظ جديد", label: "حفظ جديد" },
              { value: "تراكمي", label: "تراكمي" },
              { value: "مراجعة", label: "مراجعة" },
            ]}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>الواجب</label>
          <textarea
            style={styles.textarea}
            placeholder="مثلاً: وجه 17"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>العلامة</label>
          <input
            style={styles.input}
            type="number"
            placeholder="أدخل العلامة"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>الواجب القادم</label>
          
          <textarea
  style={styles.textarea}
  placeholder="مثلاً: وجه 18"
  value={nextTask}
  onChange={(e) => setNextTask(e.target.value)}
/>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>التاريخ</label>
          <input
            style={styles.input}
            type="date"
            value={progressDate}
            onChange={(e) => setProgressDate(e.target.value)}
          />
        </div>

        <div style={styles.checkBox}>
          <label style={styles.checkLabel}>تم إنجاز الواجب</label>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>الملاحظات</label>
          <textarea
            style={styles.textarea}
            placeholder="اكتب الملاحظات"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>

       <Button
  htmlType="submit"
  loading={isSaving}
  disabled={isSaving}
  style={{
    ...styles.button,
    opacity: isSaving ? 0.65 : 1,
    cursor: isSaving
      ? "not-allowed"
      : "pointer",
  }}
>
  {isSaving
    ? "جاري حفظ التعديل..."
    : "حفظ التعديل"}
</Button>
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
    minHeight: "90px",
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

  checkBox: {
    marginTop: "14px",
    padding: "12px",
    borderRadius: "10px",
    background: "rgba(255,255,255,.04)",
    border: "1px solid rgba(185,200,138,.22)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  checkLabel: {
    color: "#f4f0db",
    fontWeight: "bold",
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