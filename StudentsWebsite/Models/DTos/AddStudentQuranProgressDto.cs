namespace StudentsWebsite.Models.DTos
{
    public class AddStudentQuranProgressDto
    {
        public int StudentId { get; set; }
        public int? JuzNumber { get; set; }
        public string strength { get; set; }
        public string LastTeacher { get; set; }
        public string? Notes { get; set; }

        public DateTime? Date { get; set; }
    }
}
