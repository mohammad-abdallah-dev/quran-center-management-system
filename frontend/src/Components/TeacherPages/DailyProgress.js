import axios from "../../api";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Select, Button, Spin } from "antd";

export default function DailyProgress() {
  const Account = JSON.parse(
    localStorage.getItem("Account")
  );

  const [grades, setGrades] = useState([]);
  const [allStudents, setAllStudents] = useState([]);

  const [studentId, setStudentId] = useState("");

  const [fromDate, setFromDate] = useState(
    getTodayDate()
  );

  const [toDate, setToDate] = useState("");

  const [loading, setLoading] = useState(true);

  const [
    showGradeTotals,
    setShowGradeTotals,
  ] = useState(false);

  function getTodayDate() {
    const now = new Date();

    const localDate = new Date(
      now.getTime() -
        now.getTimezoneOffset() * 60 * 1000
    );

    return localDate
      .toISOString()
      .split("T")[0];
  }

  function normalizeDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    return dateValue
      .toString()
      .split("T")[0];
  }

  async function getPageData() {
    try {
      setLoading(true);

      const [
        gradesResponse,
        studentsResponse,
      ] = await Promise.all([
        axios.get(
          `/StudentDailyProgresses/ClassDailyGrades/${Account.classId}`
        ),

        axios.get("/Students"),
      ]);

      setGrades(
        Array.isArray(gradesResponse.data)
          ? gradesResponse.data
          : []
      );

      setAllStudents(
        Array.isArray(studentsResponse.data)
          ? studentsResponse.data
          : []
      );
    } catch (error) {
      console.log(error);

      alert(
        "حدث خطأ أثناء تحميل كشف علامات الطلاب"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    getPageData();
  }, []);

  const classStudents = useMemo(() => {
    if (!Array.isArray(allStudents)) {
      return [];
    }

    const studentsHaveClassId =
      allStudents.some(
        (student) =>
          student.classId !== null &&
          student.classId !== undefined
      );

    if (studentsHaveClassId) {
      return allStudents.filter(
        (student) =>
          Number(student.classId) ===
          Number(Account?.classId)
      );
    }

    if (Account?.className) {
      const studentsFromSameClass =
        allStudents.filter(
          (student) =>
            student.className ===
            Account.className
        );

      if (
        studentsFromSameClass.length > 0
      ) {
        return studentsFromSameClass;
      }
    }

    return allStudents;
  }, [
    allStudents,
    Account?.classId,
    Account?.className,
  ]);

  const gradesInDateRange = useMemo(() => {
    return grades.filter((item) => {
      const itemDate = normalizeDate(
        item.progressDate
      );

      if (!itemDate) {
        return false;
      }

      const matchesFromDate =
        !fromDate ||
        itemDate >= fromDate;

      const matchesToDate =
        !toDate ||
        itemDate <= toDate;

      return (
        matchesFromDate &&
        matchesToDate
      );
    });
  }, [grades, fromDate, toDate]);

  const dailyStudents = useMemo(() => {
    const rows = [];

    classStudents.forEach((student) => {
      const currentStudentId =
        student.id ??
        student.studentId;

      const currentStudentName =
        student.name ||
        student.studentName ||
        "طالب بدون اسم";

      const studentProgresses =
        gradesInDateRange.filter(
          (progress) =>
            Number(progress.studentId) ===
            Number(currentStudentId)
        );

      if (
        studentProgresses.length === 0
      ) {
        rows.push({
          rowId:
            `${currentStudentId}` +
            `-no-progress-` +
            `${fromDate}-${toDate}`,

          studentId:
            currentStudentId,

          studentName:
            currentStudentName,

          newMemorizationGrade: "-",
          reviewGrade: "-",
          cumulativeGrade: "-",

          progressDate:
            fromDate || "-",

          hasProgress: false,
        });

        return;
      }

      studentProgresses.forEach(
        (progress, index) => {
          const progressDate =
            normalizeDate(
              progress.progressDate
            );

          rows.push({
            rowId:
              `${currentStudentId}-` +
              `${progressDate}-` +
              `${index}`,

            studentId:
              currentStudentId,

            studentName:
              currentStudentName,

            newMemorizationGrade:
              progress.newMemorizationGrade ??
              "-",

            reviewGrade:
              progress.reviewGrade ??
              "-",

            cumulativeGrade:
              progress.cumulativeGrade ??
              "-",

            progressDate,

            hasProgress: true,
          });
        }
      );
    });

    return rows;
  }, [
    classStudents,
    gradesInDateRange,
    fromDate,
    toDate,
  ]);

  const filteredStudents = useMemo(() => {
    if (!studentId) {
      return dailyStudents;
    }

    return dailyStudents.filter(
      (student) =>
        Number(student.studentId) ===
        Number(studentId)
    );
  }, [
    dailyStudents,
    studentId,
  ]);

  const sortedStudents = useMemo(() => {
    return [...filteredStudents].sort(
      (first, second) => {
        const nameComparison =
          first.studentName.localeCompare(
            second.studentName,
            "ar"
          );

        if (nameComparison !== 0) {
          return nameComparison;
        }

        return second.progressDate.localeCompare(
          first.progressDate
        );
      }
    );
  }, [filteredStudents]);

  /*
    تجميع علامات كل طالب بشكل منفصل.

    النتيجة تكون:

    اسم الطالب
    مجموع الحفظ
    مجموع التراكمي
    مجموع المراجعة
  */
  const studentsGradeTotals = useMemo(() => {
    const totalsMap = {};

    filteredStudents.forEach((item) => {
      if (!item.hasProgress) {
        return;
      }

      const currentStudentId =
        item.studentId;

      if (!totalsMap[currentStudentId]) {
        totalsMap[currentStudentId] = {
          studentId:
            currentStudentId,

          studentName:
            item.studentName,

          newMemorizationTotal: 0,
          cumulativeTotal: 0,
          reviewTotal: 0,
        };
      }

      totalsMap[
        currentStudentId
      ].newMemorizationTotal +=
        Number(
          item.newMemorizationGrade
        ) || 0;

      totalsMap[
        currentStudentId
      ].cumulativeTotal +=
        Number(
          item.cumulativeGrade
        ) || 0;

      totalsMap[
        currentStudentId
      ].reviewTotal +=
        Number(item.reviewGrade) || 0;
    });

    return Object.values(
      totalsMap
    ).sort(
      (first, second) =>
        first.studentName.localeCompare(
          second.studentName,
          "ar"
        )
    );
  }, [filteredStudents]);

  function clearFilters() {
    setStudentId("");
    setFromDate(getTodayDate());
    setToDate("");
    setShowGradeTotals(false);
  }

  function handleFromDateChange(event) {
    const newFromDate =
      event.target.value;

    setFromDate(newFromDate);
    setShowGradeTotals(false);

    if (
      toDate &&
      newFromDate &&
      toDate < newFromDate
    ) {
      setToDate("");
    }
  }

  function handleToDateChange(event) {
    setToDate(event.target.value);
    setShowGradeTotals(false);
  }

  function handleStudentChange(value) {
    setStudentId(value ?? "");
    setShowGradeTotals(false);
  }

  function handleShowTotals() {
    setShowGradeTotals(
      (currentValue) => !currentValue
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h1 style={styles.title}>
            كشف علامات الطلاب
          </h1>

          <p style={styles.subtitle}>
            عرض تسميع طلاب الصف حسب الفترة
            المحددة
          </p>
        </div>

        <div style={styles.filters}>
          <div style={styles.field}>
            <label style={styles.label}>
              اسم الطالب
            </label>

            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="اختر الطالب"
              value={
                studentId ||
                undefined
              }
              onChange={
                handleStudentChange
              }
              style={styles.select}
              options={[
                {
                  value: "",
                  label: "جميع الطلاب",
                },

                ...classStudents.map(
                  (student) => ({
                    value:
                      student.id ??
                      student.studentId,

                    label:
                      student.name ||
                      student.studentName ||
                      "طالب بدون اسم",
                  })
                ),
              ]}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              من تاريخ
            </label>

            <input
              style={styles.input}
              type="date"
              value={fromDate}
              onChange={
                handleFromDateChange
              }
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              إلى تاريخ
            </label>

            <input
              style={styles.input}
              type="date"
              value={toDate}
              min={
                fromDate ||
                undefined
              }
              onChange={
                handleToDateChange
              }
            />
          </div>

          <Button
            onClick={clearFilters}
            style={styles.clearBtn}
          >
            مسح
          </Button>

          <Button
            onClick={
              handleShowTotals
            }
            style={styles.totalBtn}
          >
            {showGradeTotals
              ? "إخفاء المجموع"
              : "حساب مجموع العلامات"}
          </Button>
        </div>

        {showGradeTotals && (
          <div
            style={
              styles.totalsSection
            }
          >
            <div
              style={
                styles.totalsHeader
              }
            >
              <h2
                style={
                  styles.totalsTitle
                }
              >
                مجموع علامات الطلاب
              </h2>

              <span
                style={
                  styles.totalsPeriod
                }
              >
                {fromDate
                  ? `من ${fromDate}`
                  : ""}

                {toDate
                  ? ` إلى ${toDate}`
                  : ""}
              </span>
            </div>

            <div
              style={
                styles.totalsTableWrapper
              }
            >
              <table
                style={
                  styles.totalsTable
                }
              >
                <colgroup>
                  <col
                    style={{
                      width: "40%",
                    }}
                  />

                  <col
                    style={{
                      width: "20%",
                    }}
                  />

                  <col
                    style={{
                      width: "20%",
                    }}
                  />

                  <col
                    style={{
                      width: "20%",
                    }}
                  />
                </colgroup>

                <thead>
                  <tr>
                    <th
                      style={
                        styles.totalNameTh
                      }
                    >
                      اسم الطالب
                    </th>

                    <th
                      style={
                        styles.totalTh
                      }
                    >
                      حفظ
                    </th>

                    <th
                      style={
                        styles.totalTh
                      }
                    >
                      تراكمي
                    </th>

                    <th
                      style={
                        styles.totalTh
                      }
                    >
                      مراجعة
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {studentsGradeTotals.length ===
                  0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        style={
                          styles.totalEmpty
                        }
                      >
                        لا توجد علامات ضمن
                        الفترة المحددة
                      </td>
                    </tr>
                  ) : (
                    studentsGradeTotals.map(
                      (student) => (
                        <tr
                          key={
                            student.studentId
                          }
                        >
                          <td
                            style={
                              styles.totalNameTd
                            }
                          >
                            {
                              student.studentName
                            }
                          </td>

                          <td
                            style={
                              styles.totalTd
                            }
                          >
                            {
                              student.newMemorizationTotal
                            }
                          </td>

                          <td
                            style={
                              styles.totalTd
                            }
                          >
                            {
                              student.cumulativeTotal
                            }
                          </td>

                          <td
                            style={
                              styles.totalTd
                            }
                          >
                            {
                              student.reviewTotal
                            }
                          </td>
                        </tr>
                      )
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div style={styles.legend}>
          <div style={styles.legendItem}>
            <span
              style={styles.greenCircle}
            />

            <span>
              سمّع ضمن الفترة المحددة
            </span>
          </div>

          <div style={styles.legendItem}>
            <span
              style={styles.redCircle}
            />

            <span>
              لم يسمّع ضمن الفترة المحددة
            </span>
          </div>
        </div>

        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <colgroup>
              <col
                style={{
                  width: "115px",
                }}
              />

              <col
                style={{
                  width: "50px",
                }}
              />

              <col
                style={{
                  width: "50px",
                }}
              />

              <col
                style={{
                  width: "50px",
                }}
              />

              <col
                style={{
                  width: "92px",
                }}
              />

              <col
                style={{
                  width: "75px",
                }}
              />
            </colgroup>

            <thead>
              <tr>
                <th style={styles.nameTh}>
                  اسم الطالب
                </th>

                <th style={styles.th}>
                  حفظ
                </th>

                <th style={styles.th}>
                  مراجعة
                </th>

                <th style={styles.th}>
                  تراكمي
                </th>

                <th style={styles.th}>
                  التاريخ
                </th>

                <th style={styles.th}>
                  تفاصيل
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    style={styles.empty}
                    colSpan="6"
                  >
                    <div
                      style={
                        styles.loadingContainer
                      }
                    >
                      <Spin size="large" />

                      <span>
                        جاري تحميل
                        البيانات...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : sortedStudents.length ===
                0 ? (
                <tr>
                  <td
                    style={styles.empty}
                    colSpan="6"
                  >
                    لا يوجد طلاب
                  </td>
                </tr>
              ) : (
                sortedStudents.map(
                  (student) => (
                    <tr
                      key={
                        student.rowId
                      }
                    >
                      <td
                        style={
                          styles.nameTd
                        }
                      >
                        <div
                          style={
                            student.hasProgress
                              ? styles.listenedStudentName
                              : styles.notListenedStudentName
                          }
                          title={
                            student.studentName
                          }
                        >
                          {
                            student.studentName
                          }
                        </div>
                      </td>

                      <td
                        style={styles.td}
                      >
                        {
                          student.newMemorizationGrade
                        }
                      </td>

                      <td
                        style={styles.td}
                      >
                        {
                          student.reviewGrade
                        }
                      </td>

                      <td
                        style={styles.td}
                      >
                        {
                          student.cumulativeGrade
                        }
                      </td>

                      <td
                        style={
                          styles.dateTd
                        }
                      >
                        {
                          student.progressDate
                        }
                      </td>

                      <td
                        style={styles.td}
                      >
                        <div
                          style={
                            styles.actions
                          }
                        >
                          <Link
                            to={`/StudentDailyProgress/${student.studentId}`}
                            style={
                              styles.detailsBtn
                            }
                          >
                            سجل
                          </Link>

                          {!student.hasProgress && (
                            <Link
                              to={`/StudentDailyProgress/Add/${student.studentId}`}
                              style={
                                styles.addBtn
                              }
                            >
                              إضافة
                            </Link>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",

    background:
      "linear-gradient(rgba(8,18,12,.78), rgba(3,8,5,.95)), url('https://images.unsplash.com/photo-1448375240586-882707db888b')",

    backgroundSize: "cover",
    backgroundPosition: "center",

    padding: "10px",

    direction: "rtl",

    fontFamily:
      "Segoe UI, sans-serif",

    boxSizing: "border-box",
  },

  card: {
    width: "100%",
    maxWidth: "1050px",

    margin: "0 auto",

    background:
      "rgba(12,22,15,.94)",

    borderRadius: "16px",

    border:
      "1px solid rgba(143,165,90,.35)",

    padding: "12px",

    boxSizing: "border-box",
  },

  header: {
    marginBottom: "15px",
  },

  title: {
    color: "#f5f3e8",

    margin: 0,

    fontSize: "24px",
  },

  subtitle: {
    color: "#b9c88a",

    marginTop: "6px",
    marginBottom: 0,

    fontSize: "13px",
  },

  filters: {
    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit, minmax(135px, 1fr))",

    gap: "8px",

    marginBottom: "14px",

    alignItems: "end",
  },

  field: {
    display: "flex",

    flexDirection: "column",

    gap: "5px",

    minWidth: 0,
  },

  label: {
    color: "#b9c88a",

    fontWeight: "700",

    fontSize: "12px",
  },

  select: {
    width: "100%",

    height: "38px",
  },

  input: {
    width: "100%",

    height: "38px",

    background:
      "rgba(255,255,255,.08)",

    border:
      "1px solid rgba(185,200,138,.35)",

    color: "#f5f3e8",

    borderRadius: "9px",

    padding: "7px",

    outline: "none",

    fontSize: "12px",

    boxSizing: "border-box",
  },

  clearBtn: {
    height: "38px",

    borderRadius: "9px",

    fontWeight: "bold",

    background: "#7b2f2f",

    color: "#fff",

    border: "none",

    fontSize: "12px",

    padding: "0 10px",
  },

  totalBtn: {
    height: "38px",

    borderRadius: "9px",

    fontWeight: "bold",

    background:
      "linear-gradient(135deg,#1976d2,#0d47a1)",

    color: "#ffffff",

    border:
      "1px solid rgba(100,181,246,.55)",

    fontSize: "12px",

    padding: "0 12px",

    boxShadow:
      "0 4px 12px rgba(13,71,161,.28)",
  },

  totalsSection: {
    marginBottom: "14px",

    padding: "12px",

    borderRadius: "12px",

    background:
      "rgba(13,71,161,.10)",

    border:
      "1px solid rgba(100,181,246,.30)",
  },

  totalsHeader: {
    display: "flex",

    alignItems: "center",

    justifyContent: "space-between",

    flexWrap: "wrap",

    gap: "8px",

    marginBottom: "10px",
  },

  totalsTitle: {
    margin: 0,

    color: "#e3f2fd",

    fontSize: "16px",
  },

  totalsPeriod: {
    color: "#90caf9",

    fontSize: "10px",

    fontWeight: "600",
  },

  totalsTableWrapper: {
    width: "100%",

    overflowX: "auto",

    borderRadius: "10px",

    border:
      "1px solid rgba(100,181,246,.28)",

    WebkitOverflowScrolling: "touch",

    direction: "rtl",
  },

  totalsTable: {
    width: "100%",

    minWidth: "400px",

    tableLayout: "fixed",

    borderCollapse: "collapse",

    background:
      "rgba(255,255,255,.035)",

    direction: "rtl",
  },

  totalTh: {
    background:
      "linear-gradient(135deg,#1976d2,#0d47a1)",

    color: "#ffffff",

    padding: "9px 4px",

    fontSize: "11px",

    textAlign: "center",

    whiteSpace: "nowrap",
  },

  totalNameTh: {
    background:
      "linear-gradient(135deg,#1976d2,#0d47a1)",

    color: "#ffffff",

    padding: "9px 5px",

    fontSize: "11px",

    textAlign: "center",

    whiteSpace: "nowrap",
  },

  totalTd: {
    color: "#e3f2fd",

    padding: "9px 4px",

    textAlign: "center",

    borderBottom:
      "1px solid rgba(100,181,246,.15)",

    fontSize: "11px",

    fontWeight: "700",
  },

  totalNameTd: {
    color: "#ffffff",

    padding: "9px 6px",

    textAlign: "center",

    borderBottom:
      "1px solid rgba(100,181,246,.15)",

    fontSize: "11px",

    fontWeight: "700",

    overflow: "hidden",

    textOverflow: "ellipsis",

    whiteSpace: "nowrap",
  },

  totalEmpty: {
    color: "#bbdefb",

    padding: "20px",

    textAlign: "center",

    fontSize: "12px",
  },

  legend: {
    display: "flex",

    alignItems: "center",

    flexWrap: "wrap",

    gap: "14px",

    marginBottom: "12px",

    color: "#d9e6ad",

    fontSize: "11px",

    fontWeight: "600",
  },

  legendItem: {
    display: "flex",

    alignItems: "center",

    gap: "6px",
  },

  greenCircle: {
    width: "10px",

    height: "10px",

    borderRadius: "50%",

    background:
      "rgba(46,125,50,.75)",

    border: "1px solid #66bb6a",

    flexShrink: 0,
  },

  redCircle: {
    width: "10px",

    height: "10px",

    borderRadius: "50%",

    background:
      "rgba(123,47,47,.75)",

    border: "1px solid #ef5350",

    flexShrink: 0,
  },

  tableWrapper: {
    width: "100%",

    overflowX: "auto",

    borderRadius: "12px",

    WebkitOverflowScrolling: "touch",

    direction: "rtl",
  },

  table: {
    width: "100%",

    minWidth: "432px",

    tableLayout: "fixed",

    borderCollapse: "collapse",

    background:
      "rgba(255,255,255,.04)",

    direction: "rtl",
  },

  th: {
    background:
      "linear-gradient(135deg,#8fa55a,#5f6f35)",

    color: "#fff",

    padding: "8px 2px",

    fontSize: "10px",

    textAlign: "center",

    whiteSpace: "nowrap",

    overflow: "hidden",
  },

  nameTh: {
    background:
      "linear-gradient(135deg,#8fa55a,#5f6f35)",

    color: "#fff",

    padding: "8px 3px",

    fontSize: "10px",

    textAlign: "center",

    whiteSpace: "nowrap",

    direction: "rtl",
  },

  td: {
    color: "#f5f3e8",

    padding: "7px 2px",

    textAlign: "center",

    borderBottom:
      "1px solid rgba(255,255,255,.08)",

    fontSize: "10px",

    fontWeight: "600",

    whiteSpace: "nowrap",

    overflow: "hidden",
  },

  dateTd: {
    color: "#f5f3e8",

    padding: "7px 2px",

    textAlign: "center",

    borderBottom:
      "1px solid rgba(255,255,255,.08)",

    fontSize: "9px",

    fontWeight: "600",

    whiteSpace: "nowrap",

    direction: "ltr",

    overflow: "hidden",
  },

  nameTd: {
    color: "#f5f3e8",

    padding: "6px 3px",

    textAlign: "center",

    borderBottom:
      "1px solid rgba(255,255,255,.08)",

    direction: "rtl",

    overflow: "hidden",
  },

  listenedStudentName: {
    display: "block",

    width: "100%",

    padding: "3px 4px",

    borderRadius: "6px",

    background:
      "rgba(46,125,50,.14)",

    border:
      "1px solid rgba(102,187,106,.7)",

    color: "#d8f5d9",

    fontSize: "9px",

    fontWeight: "600",

    lineHeight: "1.2",

    overflow: "hidden",

    textOverflow: "ellipsis",

    whiteSpace: "nowrap",

    boxSizing: "border-box",
  },

  notListenedStudentName: {
    display: "block",

    width: "100%",

    padding: "3px 4px",

    borderRadius: "6px",

    background:
      "rgba(198,40,40,.14)",

    border:
      "1px solid rgba(239,83,80,.7)",

    color: "#ffd7d5",

    fontSize: "9px",

    fontWeight: "600",

    lineHeight: "1.2",

    overflow: "hidden",

    textOverflow: "ellipsis",

    whiteSpace: "nowrap",

    boxSizing: "border-box",
  },

  empty: {
    color: "#ddd",

    padding: "25px",

    textAlign: "center",

    fontSize: "13px",
  },

  loadingContainer: {
    display: "flex",

    flexDirection: "column",

    alignItems: "center",

    justifyContent: "center",

    gap: "12px",
  },

  actions: {
    display: "flex",

    justifyContent: "center",

    alignItems: "center",

    gap: "3px",

    flexWrap: "nowrap",
  },

  detailsBtn: {
    display: "inline-block",

    background:
      "rgba(185,200,138,.16)",

    color: "#d9e6ad",

    border:
      "1px solid rgba(185,200,138,.35)",

    padding: "4px 6px",

    borderRadius: "6px",

    textDecoration: "none",

    fontWeight: "bold",

    fontSize: "9px",

    whiteSpace: "nowrap",
  },

  addBtn: {
    display: "inline-block",

    background:
      "linear-gradient(135deg,#8fa55a,#5f6f35)",

    color: "#fff",

    border:
      "1px solid rgba(185,200,138,.35)",

    padding: "4px 6px",

    borderRadius: "6px",

    textDecoration: "none",

    fontWeight: "bold",

    fontSize: "9px",

    whiteSpace: "nowrap",
  },
};