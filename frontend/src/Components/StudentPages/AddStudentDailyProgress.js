import { Button, Select } from "antd";
import axios from "../../api";
import { ToastContainer, toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function AddStudentDailyProgress() {
  const { id } = useParams();
  const navigate = useNavigate();
  const Account = JSON.parse(localStorage.getItem("Account"));
  const teacherName =
  Account?.userName ||
  Account?.username ||
  Account?.name ||
  "";
const [isSaving, setIsSaving] = useState(false);
  const [student, setStudent] = useState({});
  const [studentDailyInfos, setStudentDailyInfos] = useState([]);

  const [progressType, setProgressType] = useState("");
  const [content, setContent] = useState("");
  const [progressDate, setProgressDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [nextTask, setNextTask] = useState("");
  const [grade, setGrade] = useState("");
  const [isCompleted, setIsCompleted] = useState(false);
  const [note, setNote] = useState("");

  async function getStudent() {
    try {
      const [studentRes, dailyRes] = await Promise.all([
        axios.get(`/Students/${id}`),
        axios.get(`/StudentDailyProgresses/ByStudent/${id}`),
      ]);

      setStudent(studentRes.data);
      setStudentDailyInfos(dailyRes.data);
    } catch (err) {
      console.log(err);
      toast.error("حدث خطأ أثناء جلب بيانات الطالب");
    }
  }

  function fillContentFromLastTask(type, records) {
    const sameTypeRecords = records
      .filter((x) => x.progressType === type && x.nextTask)
      .sort((a, b) => new Date(b.progressDate) - new Date(a.progressDate));

    const lastRecord = sameTypeRecords[0];

    setContent(lastRecord?.nextTask || "");
  }

async function handleAdd() {
  if (isSaving) {
    return;
  }

  if (!progressType || !content || !progressDate) {
    toast.warning("يرجى تعبئة نوع الواجب والواجب والتاريخ");
    return;
  }

  if (!teacherName) {
    toast.error("تعذر معرفة اسم المعلم من بيانات تسجيل الدخول");
    return;
  }

  const alreadyExists = studentDailyInfos.some((item) => {
    const itemDate = item.progressDate?.split("T")[0];

    return (
      item.progressType === progressType &&
      itemDate === progressDate
    );
  });

  if (alreadyExists) {
    toast.warning(
      `تم تسجيل ${progressType} لهذا الطالب في هذا اليوم مسبقاً`
    );
    return;
  }

  try {
    setIsSaving(true);

    await axios.post("/StudentDailyProgresses", {
      studentId: Number(id),
      content,
      progressType,
      progressDate,
      nextTask,
      grade: grade === "" ? null : Number(grade),
      isCompleted,
      note,

      lastTeacher: teacherName,
    });

    toast.success("تم إضافة السجل بنجاح");

    setTimeout(() => {
      navigate(`/StudentDailyProgress/${id}`);
    }, 1200);
  } catch (err) {
    console.log(err.response?.data || err.message);
    toast.error("حدث خطأ أثناء الإضافة");

    setIsSaving(false);
  }
}

  useEffect(() => {
    getStudent();
  }, [id]);
const availableOptions = [
  { value: "حفظ جديد", label: "حفظ جديد" },
  { value: "تراكمي", label: "تراكمي" },
  { value: "مراجعة", label: "مراجعة" },
].filter((option) => {
  return !studentDailyInfos.some((item) => {
    const itemDate = item.progressDate?.split("T")[0];

    return (
      item.progressType === option.value &&
      itemDate === progressDate
    );
  });
});
  return (
    <div style={styles.page}>
      <ToastContainer position="top-center" autoClose={2000} theme="dark" />

      <div style={styles.card}>
        <Button
          style={styles.backBtn}
          onClick={() => navigate(`/StudentDailyProgress/${id}`)}
        >
          ↩️ كشف التسميع
        </Button>

        <div style={styles.studentBox}>
          <h2 style={styles.studentName}>{student.name}</h2>
          <p style={styles.className}>{student.className}</p>
        </div>

        <h1 style={styles.title}>إضافة واجب جديد</h1>

        <label style={styles.label}>نوع الواجب</label>
       <Select
  style={styles.select}
  placeholder="اختر نوع الواجب"
  value={progressType || undefined}
  onChange={(value) => {
    setProgressType(value);
    fillContentFromLastTask(value, studentDailyInfos);
  }}
  options={availableOptions}
/>

        <label style={styles.label}>الواجب</label>
        <textarea
          style={styles.textarea}
          placeholder="مثلاً: وجه 17"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label style={styles.label}>العلامة</label>
        <input
          style={styles.input}
          placeholder="أدخل العلامة"
          type="number"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
        />

  <label style={styles.label}>الواجب القادم</label>
<textarea
  style={styles.textarea}
  placeholder="مثلاً: وجه 18"
  value={nextTask}
  onChange={(e) => setNextTask(e.target.value)}
/>

        <label style={styles.label}>التاريخ</label>
        <input
          style={styles.input}
          type="date"
          value={progressDate}
          onChange={(e) => setProgressDate(e.target.value)}
        />

        <div style={styles.checkBox}>
          <label style={styles.checkLabel}>تم إنجاز الواجب</label>
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
        </div>

        <label style={styles.label}>الملاحظات</label>
        <textarea
          style={styles.textarea}
          placeholder="اكتب الملاحظات"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button
  style={{
    ...styles.button,
    opacity: isSaving ? 0.65 : 1,
    cursor: isSaving ? "not-allowed" : "pointer",
  }}
  onClick={handleAdd}
  disabled={isSaving}
  loading={isSaving}
>
  {isSaving ? "جاري الحفظ..." : "حفظ السجل"}
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