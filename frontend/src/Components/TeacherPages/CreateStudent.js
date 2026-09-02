import { useState, useEffect } from "react";
import axios from "../../api" 
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CreateStudent() {
  const navigate = useNavigate();
  const Account = JSON.parse(localStorage.getItem("Account"));

  const [studentName, setStudentName] = useState("");
  const [classId, setClassId] = useState("");
  const [AllClasses, setAllClasses] = useState([]);

  async function GetAllClasses() {
    const res = await axios.get("/Classes", {
     
    });

    setAllClasses(res.data);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      await axios.post(
        "/Students",
        {
          name: studentName,
          classId: Number(Account.classId),
        }
      );

     toast.success("تم إنشاء الطالب بنجاح");
     setStudentName("");
    } catch (err) {
      console.log(err.response?.data || err.message);
      alert("حدث خطأ أثناء إنشاء الطالب");
    }
  }

  useEffect(() => {
    GetAllClasses();
  }, []);

  return (
    <div style={styles.page}>
        <ToastContainer position="top-center" autoClose={1500} theme="dark" />
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>إنشاء طالب جديد</h1>

        <div style={styles.field}>
          <label style={styles.label}>اسم الطالب</label>
          <input
            style={styles.input}
            placeholder="اسم الطالب"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
          />
        </div>

        {/* <div style={styles.field}>
          <label style={styles.label}>الصف</label>
          <select
            style={styles.input}
            value={classId}
            onChange={(e) => setClassId(e.target.value)}
          >
            <option value="">اختر الصف</option>

            {AllClasses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div> */}

        <button type="submit" style={styles.button}>
          تأكيد
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "linear-gradient(rgba(8,18,12,0.7), rgba(3,8,5,0.9)), url('http://images.unsplash.com/photo-1448375240586-882707db888b')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "520px",
    padding: "35px",
    borderRadius: "20px",
    background: "rgba(12,22,15,0.85)",
    border: "1px solid rgba(139,161,93,0.4)",
    boxShadow: "0 0 40px rgba(0,0,0,0.7)",
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    color: "#e5e0c8",
    marginBottom: "30px",
    fontSize: "clamp(24px, 6vw, 32px)",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    marginBottom: "20px",
  },
  label: {
    marginBottom: "8px",
    color: "#b9c88a",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "13px",
    borderRadius: "8px",
    border: "1px solid #6f7d49",
    background: "rgba(0,0,0,0.4)",
    color: "white",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "15px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg,#5f6f35,#9aaa57)",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "16px",
  },
};