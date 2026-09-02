import { Button } from "antd";
import axios from "../../api" 
import { useNavigate } from "react-router-dom";
export default function StudentDashBoard({ Students, setStudents }) {
  
  const Account = JSON.parse(localStorage.getItem("Account"));
const navigate = useNavigate();
  async function handleDelete(id) {
    const confirmDelete = window.confirm("هل أنت متأكد من حذف الطالب؟");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/Students/${id}`);

      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "حدث خطأ أثناء الحذف");
    }
  }

  return (
    <div style={styles.container}>
      {Students.map((student) => (
        
        <div key={student.id} style={styles.row}>
         <div style={styles.studentInfo}>
  <div style={styles.juzBox}>
    {student.juzNumber ?? 0}
  </div>

  <div style={styles.nameBox}>
    {student.name}
  </div>
</div>

        <Button
  style={styles.profileButton}
  onClick={() => navigate(`/StudentProfile/${student.id}`)}
>
  👤
</Button>

          <Button
            style={styles.deleteButton}
            onClick={() => handleDelete(student.id)}
          >
            حذف
          </Button>
          
        </div>
      ))}
    </div>
  );
}

const styles = {
  studentInfo: {
  display: "grid",
  gridTemplateColumns: "50px 1fr",
  alignItems: "center",
  flex: 1,
},

juzBox: {
  width: "42px",
  height: "32px",
  background: "#142d72d2", // أزرق غامق
  color: "#fff",
  borderRadius: "8px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold",
  fontSize: "15px",
  boxShadow: "0 2px 8px rgba(0,0,0,.25)",
},

nameBox: {
  color: "#f5f2df",
  fontSize: "16px",
  fontWeight: "bold",
  textAlign: "center",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
},
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  row: {
    width: "100%",
    display: "grid",
    gridTemplateColumns: "1fr auto auto",
    gap: "8px",
    alignItems: "center",
    background: "rgba(20,30,18,0.85)",
    border: "1px solid rgba(143,165,90,0.45)",
    borderRadius: "12px",
    padding: "10px",
    boxSizing: "border-box",
  },

  nameBox: {
    color: "#f5f2df",
    fontSize: "16px",
    fontWeight: "bold",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  profileButton: {
  width: "42px",
  height: "38px",
  borderRadius: "8px",
  background: "rgba(95,111,53,0.35)",
  border: "1px solid #8fa55a",
  color: "#fff",
  fontSize: "18px",
  fontWeight: "bold",
  padding: 0,
},

  deleteButton: {
    height: "38px",
    borderRadius: "8px",
    background: "rgba(120,45,35,0.8)",
    border: "1px solid #b56a5d",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "13px",
  },
};