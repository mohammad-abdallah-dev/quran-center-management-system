using StudentsWebsite.Migrations;
using StudentsWebsite.Models;
using StudentsWebsite.Models.DTos;


namespace StudentsWebsite.Repostries.Interfaces
{
    public interface IProgress
    {
        Task<List<StudentQuranProgress>> GetStudentQuranProgresforStudentById(int studentId);
        

        Task<StudentQuranProgress?> GetStudentQuranProgress(int progressId);

        Task<AddStudentQuranProgressDto> AddStudentProgress(AddStudentQuranProgressDto studentQuranProgress);

        Task<StudentQuranProgress?> EditStudentProgress(int id, StudentQuranProgress studentQuranProgress);

        Task<StudentQuranProgress?> DeleteStudentProgress(int id);
    }
}
