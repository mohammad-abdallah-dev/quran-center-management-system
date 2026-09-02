import axios from "../../api" 
import { Select } from "antd";
import {Button} from "antd";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {Spin} from "antd";
export default function StudentDailyProgress() {
  const { id } = useParams();
    const Account = JSON.parse(localStorage.getItem("Account"));

  const [allStudentInfos, setAllStudentInfos] = useState([]);
  const [progressType, setProgressType] = useState("");
const [pageLoading, setPageLoading] = useState(true);
const getCardStyle = (type) => {
  switch (type) {
    case "حفظ جديد":
  return {
    background:
      "linear-gradient(135deg, rgba(16,185,129,.22), rgba(12,22,15,.95))",
    border: "1px solid #10b981",
  };

   case "تراكمي":
  return {
    background:
      "linear-gradient(135deg, rgba(124,58,237,.22), rgba(12,22,15,.95))",
    border: "1px solid #7c3aed",
  };

  case "مراجعة":
  return {
    background:
      "linear-gradient(135deg, rgba(245,158,11,.22), rgba(12,22,15,.95))",
    border: "1px solid #f59e0b",
  };

    default:
      return {};
  }
};
  async function GetAllStudentInfos() {
    try {
      const res = await axios.get(
        `/StudentDailyProgresses/ByStudent/${id}`
      );

      setAllStudentInfos(res.data);
    } catch (err) {
      console.log(err);
      alert("حدث خطأ أثناء جلب البيانات");
    }finally {
    setPageLoading(false);
  }
  }

  async function handleDelete(progressId) {
    if (!window.confirm("هل أنت متأكد من حذف هذا الإنجاز؟")) return;

    try {
      await axios.delete(
        `/StudentDailyProgresses/${progressId}`
      );

      setAllStudentInfos((prev) =>
        prev.filter((item) => item.id !== progressId)
      );
    } catch (err) {
      console.log(err);
      alert("حدث خطأ أثناء الحذف");
    }
  }

  useEffect(() => {
    GetAllStudentInfos();
  }, [id]);

  const filteredInfos = progressType
    ? allStudentInfos.filter((x) => x.progressType === progressType)
    : allStudentInfos;
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
       
      <div style={styles.card}>
        <div style={styles.top}>
              <Link to={`/StudentProfile/${id}`}>
  <Button style={styles.backBtn}>الرجوع للطالب </Button>
</Link>
          <div>

            <h1 style={styles.name}> كشف التسميع</h1>

            <p style={styles.className}>
              {allStudentInfos[0]?.studentName}
            </p>
          </div>

          <Link
            to={`/StudentDailyProgress/Add/${id}`}
            style={styles.addButton}
          >
            + إضافة
          </Link>
        </div>

        <div style={styles.filterBox}>
          <label style={styles.label}>
            فلترة حسب نوع الواجب
          </label>

          <Select
  allowClear
  placeholder="اختر نوع الواجب"
  value={progressType}
  onChange={(value) => setProgressType(value ?? "")}
  style={styles.select}
  options={[
    {
      value: "",
      label: "الكل",
    },
    {
      value: "حفظ جديد",
      label: "حفظ جديد",
    },
    {
      value: "تراكمي",
      label: "تراكمي",
    },
    {
      value: "مراجعة",
      label: "مراجعة",
    },
  ]}
/>
        </div>

        <div style={styles.progressList}>
          {filteredInfos.length === 0 ? (
            <p style={styles.empty}>
              لا يوجد إنجازات يومية
            </p>
          ) : (
            filteredInfos.map((item) => (
 <div
    key={item.id}
    style={{
      ...styles.progressCard,
      ...getCardStyle(item.progressType),
    }}
  >  <div style={styles.cardHeader}>
<div style={styles.typeText}>
    <span style={styles.infoLabel}>نوع الواجب :</span>

    <span style={styles.typeValue}>
        {item.progressType}
    </span>
</div>

    <div style={styles.actions}>
      <Link
        to={`/StudentDailyProgress/Edit/${item.id}`}
        style={styles.editIcon}
      >
        تعديل
      </Link>

      <button
        style={styles.deleteBtn}
        onClick={() => handleDelete(item.id)}
      >
        حذف
      </button>
    </div>
  </div>

  <div style={styles.infoContainer}>
   <div style={styles.taskCard}>
  <div style={styles.taskTitle}>الواجب</div>

  <div style={styles.taskContent}>
    {item.content || "-"}
  </div>
</div>

    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>المشرف</span>
      <span style={styles.infoValue}>{item.teacherName}</span>
    </div>

    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>العلامة</span>
      <span style={styles.infoValue}>
        {item.grade ?? "-"}
      </span>
    </div>

  <div style={styles.taskCard}>
  <div style={styles.taskTitle}>الواجب القادم</div>

  <div style={styles.taskContent}>
    {item.nextTask || "-"}
  </div>
</div>

    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>التاريخ</span>
      <span style={styles.infoValue}>
        {item.progressDate?.split("T")[0]}
      </span>
    </div>

    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>الحالة</span>

      <div style={styles.badges}>
        <span
          style={
            item.isCompleted
              ? styles.successBadge
              : styles.warningBadge
          }
        >
          {item.isCompleted ? "مكتمل" : "غير مكتمل"}
        </span>

        <span
          style={
            item.isEdited
              ? styles.editedBadge
              : styles.normalBadge
          }
        >
          {item.isEdited ? "تم التعديل" : "لم يعدل"}
        </span>
      </div>
    </div>
  </div>

  <div style={styles.notesCard}>
    <div style={styles.noteTitle}>
      الملاحظات
    </div>

    <p style={styles.noteText}>
      {item.note || "لا يوجد ملاحظات"}
    </p>
  </div>
</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
const styles = {
taskCard: {
  marginTop: "6px",
  padding: "12px",
  borderRadius: "10px",
  background: "rgba(255,255,255,.05)",
  borderRight: "4px solid #5fa8ff",
  textAlign: "right",
  direction: "rtl",
},

taskTitle: {
  color: "#8ec5ff",
  fontWeight: "bold",
  marginBottom: "8px",
  fontSize: "14px",
  textAlign: "right",
},

taskContent: {
  color: "#fff",
  whiteSpace: "pre-wrap",
  wordBreak: "break-word",
  lineHeight: "1.9",
  fontSize: "15px",
  textAlign: "right",
  direction: "rtl",
},
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
    titleSection: {
  textAlign: "center",
  flex: 1,
},

backBtn: {
  background: "transparent",
  color: "#b9c88a",
  border: "1px solid rgba(185,200,138,.35)",
  borderRadius: "10px",
  fontWeight: "bold",
  height: "42px",
  padding: "0 18px",
},
     backBtn: {
  background: "transparent",
  color: "#b9c88a",
  border: "1px solid rgba(185,200,138,.45)",
  borderRadius: "10px",
  marginBottom: "14px",
  fontWeight: "bold",
},
    typeText: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
},

typeValue: {
    color: "#f4f0db",
    fontWeight: "700",
    fontSize: "15px",
},
    page: {
  minHeight: "100vh",
  background:
    "linear-gradient(rgba(8,18,12,.75), rgba(3,8,5,.92)), url('http://images.unsplash.com/photo-1448375240586-882707db888b')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  padding: "15px",
  direction: "rtl",
  fontFamily: "Segoe UI, sans-serif",
},

card: {
  maxWidth: "850px",
  margin: "0 auto",
  background: "rgba(12,22,15,.92)",
  borderRadius: "18px",
  border: "1px solid rgba(143,165,90,.35)",
  padding: "20px",
},

top: {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "20px",
  gap: "10px",
  flexWrap: "wrap",
},

name: {
  color: "#f5f3e8",
  margin: 0,
  fontSize: "30px",
},

className: {
  color: "#b9c88a",
  marginTop: "8px",
},

addButton: {
  background: "linear-gradient(135deg,#8fa55a,#5f6f35)",
  color: "#fff",
  padding: "10px 18px",
  borderRadius: "10px",
  textDecoration: "none",
  fontWeight: "bold",
},

filterBox: {
  marginBottom: "20px",
},

label: {
  color: "#b9c88a",
  fontWeight: "bold",
},

select: {
  width: "100%",
  marginTop: "8px",
},

progressList: {
  display: "grid",
  gap: "18px",
},

empty: {
  color: "#ddd",
  textAlign: "center",
  padding: "40px",
},
  progressCard: {
    background: "rgba(255,255,255,.05)",
    border: "1px solid rgba(185,200,138,.2)",
    borderRadius: "14px",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
    borderBottom: "1px solid rgba(185,200,138,.15)",
    paddingBottom: "10px",
  },

  typeBadge: {
    background: "linear-gradient(135deg,#8fa55a,#5f6f35)",
    color: "#fff",
    padding: "7px 16px",
    borderRadius: "20px",
    fontWeight: "bold",
    fontSize: "14px",
  },

  actions: {
    display: "flex",
    gap: "8px",
  },

  editIcon: {
    background: "linear-gradient(135deg,#8fa55a,#5f6f35)",
    color: "#fff",
    padding: "6px 13px",
    borderRadius: "8px",
    textDecoration: "none",
    fontSize: "13px",
    fontWeight: "600",
  },

  deleteBtn: {
    background: "linear-gradient(135deg,#7b2f2f,#4b1f1f)",
    color: "#fff",
    border: "none",
    padding: "6px 13px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  infoContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "7px",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    padding: "6px 0",
    borderBottom: "1px dashed rgba(255,255,255,.08)",
  },

  infoLabel: {
    color: "#a8bc76",
    fontWeight: "700",
    fontSize: "14px",
    minWidth: "95px",
  },

  infoValue: {
    color: "#f5f3e8",
    fontWeight: "600",
    fontSize: "14px",
    textAlign: "left",
    flex: 1,
    wordBreak: "break-word",
  },

  badges: {
    display: "flex",
    gap: "6px",
    flexWrap: "wrap",
  },

  successBadge: {
    background: "#2e7d32",
    color: "#fff",
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  warningBadge: {
    background: "#8d6e63",
    color: "#fff",
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  editedBadge: {
    background: "#1565c0",
    color: "#fff",
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  normalBadge: {
    background: "#616161",
    color: "#fff",
    borderRadius: "20px",
    padding: "3px 10px",
    fontSize: "12px",
    fontWeight: "bold",
  },

  notesCard: {
    marginTop: "5px",
    background: "rgba(255,255,255,.04)",
    borderRight: "4px solid #8fa55a",
    borderRadius: "10px",
    padding: "12px",
  },

  noteTitle: {
    color: "#a8bc76",
    fontWeight: "bold",
    marginBottom: "8px",
    fontSize: "14px",
  },

  noteText: {
    margin: 0,
    color: "#f5f3e8",
    lineHeight: "1.8",
    textAlign: "right",
    direction: "rtl",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },
};