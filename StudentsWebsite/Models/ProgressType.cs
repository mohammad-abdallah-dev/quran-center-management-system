namespace StudentsWebsite.Models
{
    public class ProgressType
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public ICollection<StudentDailyProgress>? DailyProgresses { get; set; }
          
    }
}