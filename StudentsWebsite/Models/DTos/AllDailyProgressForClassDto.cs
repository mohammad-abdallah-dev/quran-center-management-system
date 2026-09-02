namespace StudentsWebsite.Models.DTos
{
    public class AllDailyProgressForClassDto
    {
        public int StudentId { get; set; }
        public string StudentName { get; set; }

        public float? NewMemorizationGrade { get; set; }
        public float? CumulativeGrade { get; set; }
        public float? ReviewGrade { get; set; }

        public DateOnly ProgressDate { get; set; }
    }
}
