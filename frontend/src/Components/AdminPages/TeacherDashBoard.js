import { Button } from "antd";
import axios from "../../api"
import ResetPassword from "./ResetPassword";
import { Link } from "react-router-dom";
export default function TeacherDashBoard({ Teacheres, setTeacheres }) {
    const Account = JSON.parse(localStorage.getItem("Account"));

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "هل أنت متأكد من حذف هذا المشرف"
    );
console.log("delete id:", id);
    if (!confirmDelete) return;

    try {
      await axios.delete(`/Users/DeleteUserById/${id}`
       
      );

      setTeacheres((prev) => prev.filter((teacher) => teacher.id !== id));
    } catch (err) {
      console.log(err);
      alert("حدث خطأ أثناء حذف المشرف");
    }
  }

  return (
    <div style={styles.list}>
      {Teacheres.map((teacher) => (
        <div key={teacher.id} style={styles.item}>
          <h2 style={styles.teacherName}>{teacher.userName}</h2>

          <p style={styles.info}>
            الشعبة: <span style={styles.value}>{teacher.className}</span>
          </p>

          <Button
  style={styles.deleteButton}
  onClick={() => handleDelete(teacher.id)}
>
  🗑 حذف المشرف
</Button>
<Link to={`/ResetPassword/${teacher.id}`} style={styles.resetPasswordBtn}>
  🔐 تغيير كلمة السر
</Link>
        </div>
      ))}
    </div>
  );
}

const styles = {
  resetPasswordBtn: {
  background: "linear-gradient(135deg,#4f6f8f,#2f4d68)",
  color: "#fff",
  padding: "6px 12px",
  borderRadius: "8px",
  textDecoration: "none",
  fontSize: "13px",
  fontWeight: "600",
},
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "18px",
    width: "100%",
  },

  item: {
    background: "rgba(0,0,0,0.35)",
    border: "1px solid #6f7d49",
    borderRadius: "14px",
    padding: "18px",
    color: "#f0f0e0",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  teacherName: {
    margin: 0,
    color: "#e5e0c8",
    fontSize: "clamp(20px, 5vw, 24px)",
    textAlign: "center",
    wordBreak: "break-word",
  },

  info: {
    margin: 0,
    color: "#b9c88a",
    fontWeight: "bold",
    fontSize: "16px",
    textAlign: "center",
  },

  value: {
    color: "#fff",
    fontWeight: "normal",
  },

 deleteButton: {
  width: "100%",
  height: "45px",
  background: "rgba(80, 40, 30, 0.6)",
  color: "#f5e6d3",
  border: "1px solid #8b5e3c",
  borderRadius: "10px",
  fontWeight: "bold",
  fontSize: "15px",
  transition: "0.3s",
},
};