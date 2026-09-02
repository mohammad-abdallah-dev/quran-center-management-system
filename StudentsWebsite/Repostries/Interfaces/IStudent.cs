using StudentsWebsite.Models;
using StudentsWebsite.Models.DTos;

namespace StudentsWebsite.Repostries.Interfaces
{
    public interface IStudent
    {
        public Task<List<StudentInfoDto>> GetAllStudents();
        public Task<StudentInfoDto> GetStudent(int id);
        public Task<CreateStudentDto> CreateStudent(CreateStudentDto createStudent);
        public Task<List<StudentQuranProgress>> GetStudentQuranProgress(int id);
        public Task<List<StudentInfoDto>> GetAllStudentByClassId(int id);
     
    }
}
