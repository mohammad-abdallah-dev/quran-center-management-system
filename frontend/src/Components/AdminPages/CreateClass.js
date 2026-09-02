import { Input, Button, message } from "antd";
import { useState } from "react";
import axios from "../../api"
import { toast } from "react-toastify";
export default function CreateClass() {
  const [ClassName, setClassName] = useState("");
  const Account = JSON.parse(localStorage.getItem("Account"));
const [loading, setLoading] = useState(false);
 async function handleAdd() {
  if (!ClassName.trim()) {
    toast.warning("أدخل اسم الشعبة أولاً");
    return;
  }

  setLoading(true);

  try {
    await axios.post(
      "/Classes",
      {
        name: ClassName,
      },
     
    );

    toast.success("تم إضافة الشعبة بنجاح");
    setClassName("");
  } catch (error) {
    console.log(error);
    toast.error("حدث خطأ أثناء إضافة الشعبة");
  } finally {
    setLoading(false);
  }
}

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>إنشاء شعبة جديدة</h1>

        <label style={styles.label}>اسم الشعبة</label>

        <Input
          style={styles.input}
         
          value={ClassName}
          onChange={(e) => setClassName(e.target.value)}
        />

      <Button
  style={styles.button}
  onClick={handleAdd}
  loading={loading}
  disabled={loading}
>
  إنشاء
</Button>
      </div>
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
      "linear-gradient(rgba(8,18,12,0.75), rgba(3,8,5,0.9)), url('http://images.unsplash.com/photo-1448375240586-882707db888b')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "450px",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(12,22,15,0.85)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(139,161,93,0.4)",
    boxShadow: "0 0 40px rgba(0,0,0,0.7)",
    color: "#f0f0e0",
    boxSizing: "border-box",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#e5e0c8",
    letterSpacing: "1px",
    fontSize: "28px",
  },

  label: {
    display: "block",
    marginBottom: "10px",
    color: "#b9c88a",
    fontWeight: "bold",
  },

 input: {
  width: "100%",
  height: "45px",
  marginBottom: "20px",
  borderRadius: "8px",
  border: "1px solid #6f7d49",
  background: "rgba(0,0,0,0.4)",
  color: "#fff",
  fontSize: "16px",
},

  button: {
    width: "100%",
    height: "45px",
    border: "none",
    borderRadius: "8px",
    background: "linear-gradient(135deg,#5f6f35,#9aaa57)",
    color: "white",
    fontWeight: "bold",
    fontSize: "16px",
  },
  
};