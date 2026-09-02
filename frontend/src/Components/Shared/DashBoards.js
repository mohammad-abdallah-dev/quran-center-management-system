import axios from "../../api" 

import { Spin } from "antd";

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ClassDashBoard from "../AdminPages/ClassDashBoard";
import TeacherDashBoard from "../AdminPages/TeacherDashBoard";
import StudentDashBoard from "../TeacherPages/StudentsDashBoard";
export default function DashBoards() {
     const Account = JSON.parse(localStorage.getItem("Account"));

  const { type ,id } = useParams();
  const [data, setData] = useState([]);
const [pageLoading, setPageLoading] = useState(true);
  async function GetData() {
    let url = "";

    if (type === "Class") {
      url = "/Classes";
    }
   else if(type==="Teacher")
    {
 url = "/Users/GetAllUsers";
    }
    else if(type==="Students"){
      url = `/Students/ByClass/${Account.classId}`;
    }

    if (!url) return;

    try {
      const res = await axios.get(url



      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
    finally {
    setPageLoading(false);
  }
  }

  useEffect(() => {
    GetData();
  }, [type]);
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
       <h1 style={styles.title}>
  {type === "Class"
    ? "سجل الشعب"
    : type === "Teacher"
    ? "سجل المشرفين"
    : "سجل الطلاب"}
</h1>
        {type === "Class" && <ClassDashBoard classes={data} setClasses={setData}/>}
        {type === "Teacher" && <TeacherDashBoard Teacheres={data} setTeacheres={setData}/>}
        {type === "Students" && <StudentDashBoard Students={data} setStudents={setData}/>}

      </div>
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
      "linear-gradient(rgba(8,18,12,0.75), rgba(3,8,5,0.9)), url('http://images.unsplash.com/photo-1448375240586-882707db888b')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    fontFamily: "Segoe UI, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
    padding: "30px",
    borderRadius: "20px",
    background: "rgba(12,22,15,0.85)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(139,161,93,0.4)",
    boxShadow: "0 0 40px rgba(0,0,0,0.7)",
    boxSizing: "border-box",
  },
  title: {
    textAlign: "center",
    color: "#e5e0c8",
    marginBottom: "30px",
    letterSpacing: "2px",
    fontSize: "clamp(24px, 5vw, 34px)",
  },
};