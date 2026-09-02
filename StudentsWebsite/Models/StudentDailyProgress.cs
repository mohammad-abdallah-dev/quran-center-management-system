namespace StudentsWebsite.Models
{
    public class StudentDailyProgress
    {
        public int Id { get; set; }

        public int StudentId { get; set; }
        public Student Student { get; set; } = null!;

        public string? TeacherId { get; set; }
        public ApplicationUser ?Teacher { get; set; } = null!;
        public string? Content { get; set; }

        public string ProgressType { get; set; }

        public DateOnly ProgressDate { get; set; }
        public string ?NextTask { get; set; }
        public float? Grade { get; set; }

        public bool IsCompleted { get; set; }

        public string? Note { get; set; }
        public bool IsEdited { get; set; } = false; 
    }
}