import { Button } from "antd";
import axios from "../../api"
export default function ClassDashBoard({ classes, setClasses }) {
    const Account = JSON.parse(localStorage.getItem("Account"));

    async function handleDelete(id) {
  const confirmDelete = window.confirm(
    "هل أنت متأكد من حذف هذا الصف؟"
  );

  if (!confirmDelete) return;

  try {
    await axios.delete(`/Classes/${id}`

      
    );

    
    setClasses((prev) => prev.filter((c) => c.id !== id));
  } catch (err) {
    console.log(err);
    alert("حدث خطأ أثناء الحذف");
  }
}
  return (
    <div style={styles.list}>
      {classes.map((classItem) => (
        <div key={classItem.id} style={styles.item}>
          <h2 style={styles.className}>{classItem.name}</h2>

          <div style={styles.teacherBox}>
            <p> {classItem.count}  عدد الطلاب  </p>
            <p style={styles.sectionTitle}>مشرفين الشعبة </p>

            {classItem.teachersInfos?.length > 0 ? (
              classItem.teachersInfos.map((teacher) => (
                <p key={teacher.id} style={styles.teacherName}>
                  {teacher.userName}
                </p>
              ))
            ) : (
              <p style={styles.empty}>لا يوجد مشرفين</p>
            )}
            <Button
  style={styles.deleteButton}
  onClick={() => handleDelete(classItem.id)}
>
  حذف الشعبة
</Button>
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "20px",
  },
item: {
  background: "rgba(20,30,18,0.82)",
  border: "1px solid rgba(143,165,90,0.35)",
  borderRadius: "16px",
  padding: "20px",
  color: "#f0f0e0",
  boxShadow: "0 6px 20px rgba(0,0,0,0.35)",
},
  className: {
    margin: "0 0 15px",
    color: "#e5e0c8",
    fontSize: "22px",
  },
  teacherBox: {
    borderTop: "1px solid rgba(139,161,93,0.35)",
    paddingTop: "12px",
  },
sectionTitle: {
  color: "#d7e3a3",
  fontWeight: "bold",
  marginBottom: "12px",
  fontSize: "17px",
},
teacherName: {
  background: "rgba(95,111,53,0.22)",
  border: "1px solid rgba(143,165,90,0.35)",
  padding: "10px",
  borderRadius: "8px",
  margin: "8px 0",
  color: "#f5f5e6",
},
  empty: {
    color: "#cfcfcf",
    fontSize: "14px",
  },
  deleteButton: {
  width: "100%",
  height: "44px",
  marginTop: "15px",
  borderRadius: "10px",
  background: "linear-gradient(135deg,#5f6f35,#7f9250)",
  border: "1px solid #8fa55a",
  color: "#fff",
  fontWeight: "bold",
  fontSize: "15px",
  boxShadow: "0 4px 10px rgba(95,111,53,0.35)",
},
};