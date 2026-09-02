import axios from "../../api"
import { useState } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
export default function Login() {
  const [Password, SetPassword] = useState("");
  const [userName, SetUserName] = useState("");
const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  async function handleSubmit(e) {
    e.preventDefault();
  if (loading) return; // يمنع الضغط أكثر من مرة

  setLoading(true);

    try {
      const res = await axios.post("/Users/Login", {
        username: userName,
        password: Password,
      });

      console.log(res.data);

    
localStorage.setItem("token", res.data.token);
localStorage.setItem("Account", JSON.stringify(res.data));

window.location.replace("/");
}
  catch (error) {
  console.log(error);

  if (error.response) {
    switch (error.response.status) {
      case 400:
        toast.warning("البيانات المدخلة غير صحيحة");
        break;

      case 401:
        toast.error("اسم المستخدم أو كلمة المرور غير صحيحة");
        break;

      case 403:
        toast.error("ليس لديك صلاحية للوصول");
        break;

      case 404:
        toast.info("الخدمة غير موجودة");
        break;

      case 500:
        toast.error("حدث خطأ في الخادم");
        break;

      default:
        toast.error("حدث خطأ غير متوقع");
        break;
    }
  } else if (error.request) {
    toast.error("تعذر الاتصال بالخادم");
  } else {
    toast.error(error.message);
  }
}
finally {
    // سواء نجحت أو فشلت
    // يرجع الزر كما كان
    setLoading(false);
  }
  }

  return (
    <div style={styles.page}>
      <ToastContainer
  position="top-center"
  autoClose={2000}
  theme="dark"
/>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>تسجيل دخول</h1>

        <label style={styles.label}>الأسم</label>
        <input
          style={styles.input}
          onChange={(e) => SetUserName(e.target.value)}
          placeholder="الأسم"
        />

        <label style={styles.label}>كلمة السر</label>
        <input
          style={styles.input}
          type="password"
          onChange={(e) => SetPassword(e.target.value)}
          placeholder="كلمة السر"
        />

    <button
  type="submit"
  disabled={loading}
  style={{
    ...styles.button,
    opacity: loading ? 0.7 : 1,
    cursor: loading ? "not-allowed" : "pointer",
  }}
>
  {loading ? "جاري التسجيل..." : "تسجيل"}
</button>
      </form>
    </div>
  );
}
const styles = {
  
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(rgba(15,18,14,0.88), rgba(15,18,14,0.9)), url('http://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1600&q=80')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "20px",
    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    padding: "30px",
    backgroundColor: "rgba(25, 28, 22, 0.92)",
    border: "1px solid #59624f",
    boxShadow: "0 20px 50px rgba(0,0,0,0.7)",
    borderRadius: "10px",
    boxSizing: "border-box",
  },

  title: {
    color: "#e8e1d1",
    letterSpacing: "3px",
    marginBottom: "5px",
    textAlign: "center",
    fontSize: "2rem",
  },

  subtitle: {
    color: "#9fa58e",
    marginBottom: "25px",
    textAlign: "center",
    fontSize: "15px",
  },

  label: {
    color: "#c8c1ad",
    fontSize: "15px",
    marginTop: "15px",
    display: "block",
  },

  input: {
    width: "100%",
    padding: "14px",
    marginTop: "7px",
    marginBottom: "14px",
    backgroundColor: "#141611",
    color: "#e8e1d1",
    border: "1px solid #59624f",
    borderRadius: "6px",
    outline: "none",
    fontSize: "16px",
    boxSizing: "border-box",
  },

  button: {
    
    width: "100%",
    marginTop: "20px",
    padding: "15px",
    backgroundColor: "#3a422f",
    color: "#e8e1d1",
    border: "1px solid #8a927c",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    letterSpacing: "2px",
    fontSize: "16px",
  },
};