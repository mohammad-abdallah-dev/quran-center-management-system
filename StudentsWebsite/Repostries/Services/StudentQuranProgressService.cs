using Microsoft.EntityFrameworkCore;
using StudentsWebsite.Data;
using StudentsWebsite.Models;
using StudentsWebsite.Models.DTos;
using StudentsWebsite.Repostries.Interfaces;

namespace StudentsWebsite.Repostries.Services
{
    public class StudentQuranProgressService : IProgress

    {
        private readonly MainDbContext _context; 
        public StudentQuranProgressService(MainDbContext context)
        {
            _context = context;
        }

        public async Task<AddStudentQuranProgressDto> AddStudentProgress(AddStudentQuranProgressDto studentQuranProgress)
        {
            var theProgress =
                new StudentQuranProgress()
                {
                    StudentId = studentQuranProgress.StudentId,
                    JuzNumber= studentQuranProgress.JuzNumber,
                    Notes = studentQuranProgress.Notes,
                    Date = studentQuranProgress.Date,
                    strength= studentQuranProgress.strength,
                    LastTeacher=studentQuranProgress.LastTeacher,
                    
                  
                };
           
            _context.studentQuranProgresses.Add(theProgress);
            await _context.SaveChangesAsync();
            return studentQuranProgress;

        }

        public Task<StudentQuranProgress?> DeleteStudentProgress(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<StudentQuranProgress?> EditStudentProgress(
            int id,
            StudentQuranProgress studentQuranProgress)
        {
            var theProgress = await GetStudentQuranProgress(id);

            if (theProgress == null)
                return null;

            theProgress.StudentId = studentQuranProgress.StudentId;
            theProgress.JuzNumber = studentQuranProgress.JuzNumber;
            theProgress.LastTeacher = studentQuranProgress.LastTeacher;
            theProgress.Notes = studentQuranProgress.Notes;
            theProgress.strength = studentQuranProgress.strength;
            theProgress.Date = studentQuranProgress.Date;

            await _context.SaveChangesAsync();

            return theProgress;
        }

        public async Task<List<StudentQuranProgress>> GetStudentQuranProgresforStudentById(int studentId)
        {

            return await _context.studentQuranProgresses
                .Where(q => q.StudentId == studentId)
                .ToListAsync();
        }

        public async Task<StudentQuranProgress?> GetStudentQuranProgress(int progressId)
        {
           var theProgress = await _context.studentQuranProgresses.FindAsync(progressId);
            return theProgress;
        }
    }
}
