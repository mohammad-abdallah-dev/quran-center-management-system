import axios from "../../api"
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CreateTeacher() {
  const navigate = useNavigate();
  const account = JSON.parse(localStorage.getItem("Account"));
const [showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [classId, setClassId] = useState("");
  const [AllClasses,setAllClasses]=useState([{}])
    const Account = JSON.parse(localStorage.getItem("Account"));
const [loading, setLoading] = useState(false);

 async function GetAllClasses(){
  const res= await axios.get(
    "/Classes"
   
        
  )
  setAllClasses(res.data);
  console.log(res.data);
  
 }
  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const res = await axios.post("/Users/Register", {
       
        userName: userName,
        email: email,
        password: password,
        confirmPassword: confirmPassword,
        role: "Teacher",
        classId: Number(classId),
      }
  
    
    );

   console.log(res.data);

toast.success("تم إنشاء المشرف بنجاح");

setTimeout(() => {
  navigate("/");
}, 1500);
   } catch (error) {
  console.log(error.response?.data || error.message);

  const data = error.response?.data;
  let errorMessage = "حدث خطأ أثناء إنشاء المشرف";

  if (data?.errors) {
    errorMessage = Object.values(data.errors)[0][0];
  } else if (data?.message) {
    errorMessage = data.message;
  } else if (typeof data === "string") {
    errorMessage = data;
  }

  // ترجمة أشهر الأخطاء
  switch (errorMessage) {
    case "The UserName field is required.":
  errorMessage = "يرجى إدخال اسم المستخدم.";
  break;
    case "Passwords do not match.":
      errorMessage = "كلمتا المرور غير متطابقتين.";
      break;

    case "Username is already taken.":
      errorMessage = "اسم المستخدم مستخدم مسبقاً.";
      break;

    case "Email is already taken.":
      errorMessage = "البريد الإلكتروني مستخدم مسبقاً.";
      break;

    case "The Email field is not a valid e-mail address.":
      errorMessage = "البريد الإلكتروني غير صحيح.";
      break;

    case "Password must be at least 6 characters.":
      errorMessage = "يجب أن تكون كلمة المرور 6 أحرف على الأقل.";
      break;

    default:
      break;
  }

  toast.error(errorMessage);
}
  }
useEffect(()=>{
GetAllClasses()
},[])
  return (
    <div style={styles.page}>
    <ToastContainer
      position="top-center"
      autoClose={1500}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      pauseOnHover
      theme="dark"/>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>إنشاء مشرف جديد </h1>

        <div style={styles.formGrid}>
          <div style={styles.field}>
            <label style={styles.label}>الاسم</label>
            <input
              style={styles.input}
              placeholder="الاسم"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>الايميل</label>
            <input
              style={styles.input}
              placeholder="الايميل"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

  <div style={styles.field}>
  <label style={styles.label}>كلمة السر</label>

  <div style={styles.passwordContainer}>
    <input
      style={styles.passwordInput}
      type={showPassword ? "text" : "password"}
      placeholder="كلمة السر"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <button
      type="button"
      style={styles.eyeButton}
      onClick={() => setShowPassword(!showPassword)}
    >
      {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
    </button>
  </div>
</div>

<div style={styles.field}>
  <label style={styles.label}>تأكيد كلمة السر</label>

  <div style={styles.passwordContainer}>
    <input
      style={styles.passwordInput}
      type={showConfirmPassword ? "text" : "password"}
      placeholder="تأكيد كلمة السر"
      value={confirmPassword}
      onChange={(e) => setConfirmPassword(e.target.value)}
    />

    <button
      type="button"
      style={styles.eyeButton}
      onClick={() =>
        setShowConfirmPassword(!showConfirmPassword)
      }
    >
      {showConfirmPassword ? (
        <FiEyeOff size={20} />
      ) : (
        <FiEye size={20} />
      )}
    </button>
  </div>
</div>

          <div style={styles.fieldFull}>
  <label style={styles.label}>الشعبة</label>

  <select
    style={styles.input}
    value={classId}
    onChange={(e) => setClassId(e.target.value)}
  >
    <option value="default">اختر الشعبة</option>

    {AllClasses.map((item) => (
      <option key={item.id} value={item.id}>
        {item.name}
      </option>
    ))}
  </select>
</div>

          <div style={styles.buttonContainer}>
            <button type="submit" style={styles.button}>
                {loading ? "جاري الإنشاء..." : "إنشاء"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

const styles = {
  passwordContainer: {
  position: "relative",
},

passwordInput: {
  width: "100%",
  padding: "12px 45px 12px 12px",
  border: "1px solid #d9d9d9",
  borderRadius: "8px",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
},

eyeButton: {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  border: "none",
  background: "transparent",
  cursor: "pointer",
  color: "#777",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 0,
},
  eye: {
  position: "absolute",
  left: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer",
  fontSize: "18px",
  userSelect: "none",
},
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
    maxWidth: "900px",
    padding: "clamp(22px, 5vw, 40px)",
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
    letterSpacing: "2px",
    fontSize: "clamp(22px, 5vw, 32px)",
  },

  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  fieldFull: {
    display: "flex",
    flexDirection: "column",
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
  appearance: "none",
},

  buttonContainer: {
    gridColumn: "1 / -1",
    marginTop: "15px",
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
    letterSpacing: "2px",
  },
};