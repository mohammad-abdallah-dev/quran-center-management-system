namespace StudentsWebsite.Models.DTos
{
    public class AddStudentDailyProgressDto
    {
        public int StudentId { get; set; }
        public string Content { get; set; } = string.Empty;
        public string ProgressType { get; set; } = string.Empty;
        public DateOnly ProgressDate { get; set; }
        public string? NextTask { get; set; }
        public float? Grade { get; set; }
        public bool IsCompleted { get; set; }
        public string? Note { get; set; }
    }
}
