namespace StudentsWebsite.Models
{
    public class StudentQuranProgress
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public Student? Student { get; set; } 

        public int? JuzNumber { get; set; }
        public string strength { get; set; }

        public string? Notes { get; set; }
        public string? LastTeacher { get; set; }

        public DateTime? Date { get; set; }
    }
}
