using StudentsWebsite.Models;
using StudentsWebsite.Models.DTos;

namespace StudentsWebsite.Repostries.Interfaces
{
    public interface IDailyProgress
    {
        public Task<List<StudentDailyProgressDto>> GetAllstudentDailyProgressDtos(int StudentId);
        public Task<StudentDailyProgressDto> GetStudentDailyProgressById(int DailyProgressId);
        Task<StudentDailyProgress> AddStudentDailyProgressDto(AddStudentDailyProgressDto dto, string teacherId); public Task DeleteStudentDailyProgressDto(int id);
        Task<EditStudentDailyProgressDto?>
            EditStudentDailyProgressDto(
                int id,
                EditStudentDailyProgressDto dto,
                string teacherId
            );
        public Task<List<AllDailyProgressForClassDto>> AllDailyProgressForClassDto(int ClassId);
    }
}
