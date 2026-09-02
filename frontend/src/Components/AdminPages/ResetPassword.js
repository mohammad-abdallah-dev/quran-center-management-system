import axios from "../../api"
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { FiEye, FiEyeOff } from "react-icons/fi";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPassword() {
  const { id } = useParams();
  const navigate = useNavigate();
  const Account = JSON.parse(localStorage.getItem("Account"));

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!newPassword.trim()) {
      toast.warning("يرجى إدخال كلمة السر الجديدة");
      return;
    }

    if (!confirmPassword.trim()) {
      toast.warning("يرجى تأكيد كلمة السر");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("كلمتا المرور غير متطابقتين");
      return;
    }

    try {
      await axios.put(
        `/Users/ResetPassword/${id}`,
        {
          newPassword,
          confirmPassword,
        }
      );

      toast.success("تم تغيير كلمة السر بنجاح");

      setTimeout(() => {
        navigate(-1);
      }, 1500);
    } catch (error) {
      const data = error.response?.data;

      if (Array.isArray(data)) {
        toast.error(data[0]);
      } else if (typeof data === "string") {
        toast.error(data);
      } else {
        toast.error("حدث خطأ أثناء تغيير كلمة السر");
      }
    }
  }

  return (
    <div style={styles.page}>
      <ToastContainer position="top-center" autoClose={1500} theme="dark" rtl />

      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>تغيير كلمة السر</h1>

        <div style={styles.field}>
          <label style={styles.label}>كلمة السر الجديدة</label>

          <div style={styles.passwordBox}>
            <input
              style={styles.input}
              type={showPassword ? "text" : "password"}
              placeholder="كلمة السر الجديدة"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>تأكيد كلمة السر</label>

          <div style={styles.passwordBox}>
            <input
              style={styles.input}
              type={showConfirmPassword ? "text" : "password"}
              placeholder="تأكيد كلمة السر"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <button
              type="button"
              style={styles.eyeBtn}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
            </button>
          </div>
        </div>

        <button type="submit" style={styles.button}>
          حفظ كلمة السر
        </button>

        <button type="button" style={styles.backBtn} onClick={() => navigate(-1)}>
          رجوع
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(rgba(8,18,12,.8), rgba(3,8,5,.95))",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    direction: "rtl",
    padding: "16px",
    boxSizing: "border-box",
    fontFamily: "Segoe UI, sans-serif",
  },

  card: {
    width: "100%",
    maxWidth: "420px",
    background: "rgba(12,22,15,.95)",
    border: "1px solid rgba(139,161,93,.4)",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 12px 35px rgba(0,0,0,.35)",
  },

  title: {
    color: "#f4f0db",
    textAlign: "center",
    marginBottom: "22px",
  },

  field: {
    marginBottom: "16px",
  },

  label: {
    color: "#b9c88a",
    fontWeight: "bold",
    marginBottom: "8px",
    display: "block",
  },

  passwordBox: {
    position: "relative",
  },

  input: {
    width: "100%",
    height: "44px",
    borderRadius: "10px",
    border: "1px solid rgba(185,200,138,.35)",
    background: "rgba(255,255,255,.07)",
    color: "#fff",
    padding: "0 12px 0 45px",
    boxSizing: "border-box",
    outline: "none",
    fontSize: "15px",
  },

  eyeBtn: {
    position: "absolute",
    left: "12px",
    top: "50%",
    transform: "translateY(-50%)",
    background: "transparent",
    border: "none",
    color: "#b9c88a",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    padding: 0,
  },

  button: {
    width: "100%",
    height: "44px",
    border: "none",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#8fa55a,#5f6f35)",
    color: "#fff",
    fontWeight: "bold",
    cursor: "pointer",
    marginTop: "8px",
  },

  backBtn: {
    width: "100%",
    height: "42px",
    borderRadius: "10px",
    background: "transparent",
    color: "#f4f0db",
    border: "1px solid rgba(185,200,138,.3)",
    cursor: "pointer",
    marginTop: "10px",
  },
};