namespace StudentsWebsite.Models
{
    public class Class
    {
        public int Id { get; set; }

        public string Name { get; set; } 

        public ICollection<Student>? Students { get; set; }
        public ICollection<ApplicationUser>? Teachers { get; set; }
        

    }
}
