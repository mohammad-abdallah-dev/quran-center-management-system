namespace StudentsWebsite.Models.DTos
{
    public class StudentDailyProgressDto
    {
        public int Id { get; set; }

        public int StudentId { get; set; }

        public string StudentName { get; set; } = string.Empty;

        public string TeacherName { get; set; } = string.Empty;

        public string Content { get; set; } = string.Empty;
        public string ProgressType { get; set; } = string.Empty;

        public DateOnly ProgressDate { get; set; }

        public string? NextTask { get; set; }

        public float? Grade { get; set; }

        public bool IsCompleted { get; set; }

        public string? Note { get; set; }

        public bool IsEdited { get; set; }
    }
}
