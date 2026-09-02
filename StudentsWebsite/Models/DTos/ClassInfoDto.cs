using StudentsWebsite.Models.DTos.UserDTO;

namespace StudentsWebsite.Models.DTos
{
    public class ClassInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Count { get; set; } = 0;
        public List<UserDto>? TeachersInfos { get; set; }
        
    }
}