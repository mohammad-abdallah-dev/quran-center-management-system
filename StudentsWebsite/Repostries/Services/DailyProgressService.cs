using Microsoft.EntityFrameworkCore;
using StudentsWebsite.Data;
using StudentsWebsite.Models;
using StudentsWebsite.Models.DTos;
using StudentsWebsite.Repostries.Interfaces;

namespace StudentsWebsite.Repostries.Services
{
    public class DailyProgressService : IDailyProgress

    {
        private readonly MainDbContext _context;
        public DailyProgressService( MainDbContext context ) {
        
            _context = context;
        }

        public async Task<StudentDailyProgress> AddStudentDailyProgressDto(
    AddStudentDailyProgressDto dto,
    string teacherId)
        {
            var theProgress = new StudentDailyProgress()
            {
                IsCompleted = dto.IsCompleted,
                IsEdited = false,
                NextTask = dto.NextTask,
                Note = dto.Note,
                ProgressDate = dto.ProgressDate,
                Content = dto.Content,
                Grade = dto.Grade,
                ProgressType = dto.ProgressType,
                StudentId = dto.StudentId,
                TeacherId = teacherId
            };

            _context.StudentDailyProgresses.Add(theProgress);
            await _context.SaveChangesAsync();

            return theProgress;
        }
        public Task<List<AllDailyProgressForClassDto>> AllDailyProgressForClassDto(int classId)
        {
            var result = _context.StudentDailyProgresses
         .Include(e => e.Student)
    .Where(e => e.Student.ClassId == classId)
    .ToList()
                .GroupBy(e => new
                {
                    e.StudentId,
                    Date = e.ProgressDate,
                })
                .Select(g => new AllDailyProgressForClassDto
                {
                    StudentId = g.Key.StudentId,
                    StudentName = g.First().Student.Name,

                    NewMemorizationGrade = g
                        .FirstOrDefault(x => x.ProgressType == "حفظ جديد")?.Grade,

                    CumulativeGrade = g
                        .FirstOrDefault(x => x.ProgressType == "تراكمي")?.Grade,

                    ReviewGrade = g
                        .FirstOrDefault(x => x.ProgressType == "مراجعة")?.Grade,

                    ProgressDate = g.Key.Date
                })
                .ToList();

            return Task.FromResult(result);
        }




        public Task DeleteStudentDailyProgressDto(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<EditStudentDailyProgressDto?> EditStudentDailyProgressDto(
      int id,
      EditStudentDailyProgressDto editStudentDailyProgressDto,
      string teacherId
  )
        {
            var theProgress =
                await _context.StudentDailyProgresses.FindAsync(id);

            if (theProgress == null)
                return null;

            theProgress.Note =
                editStudentDailyProgressDto.Note;

            theProgress.Content =
                editStudentDailyProgressDto.Content;

            theProgress.ProgressDate =
                editStudentDailyProgressDto.ProgressDate;

            theProgress.NextTask =
                editStudentDailyProgressDto.NextTask;

            theProgress.Grade =
                editStudentDailyProgressDto.Grade;

            theProgress.IsCompleted =
                editStudentDailyProgressDto.IsCompleted;

            theProgress.IsEdited = true;

            theProgress.ProgressType =
                editStudentDailyProgressDto.ProgressType;

            // أهم سطر: تغيير المعلم إلى آخر شخص عدّل
            theProgress.TeacherId = teacherId;

            await _context.SaveChangesAsync();

            return editStudentDailyProgressDto;
        }

        public async Task<List<StudentDailyProgressDto>> GetAllstudentDailyProgressDtos(int studentId)
        {
            return await _context.StudentDailyProgresses
                .Where(e => e.StudentId == studentId)
                .Include(e => e.Student)
                .Include(e => e.Teacher)
                .Select(progressItem => new StudentDailyProgressDto
                {
                    Content = progressItem.Content,
                    Grade = progressItem.Grade,
                    Id = progressItem.Id,
                    IsCompleted = progressItem.IsCompleted,
                    IsEdited = progressItem.IsEdited,
                    NextTask = progressItem.NextTask,
                    Note = progressItem.Note,
                    ProgressDate = progressItem.ProgressDate,
                    ProgressType = progressItem.ProgressType,
                    StudentId = progressItem.StudentId,
                    StudentName = progressItem.Student.Name,
                    TeacherName = progressItem.Teacher.UserName
                })
                .OrderByDescending(e => e.ProgressDate)
                .ToListAsync();
        }

        public async Task<StudentDailyProgressDto> GetStudentDailyProgressById(int DailyProgressId)
        {
            var theProgress = await _context.StudentDailyProgresses
                .Include(e => e.Student)
                .Include(e => e.Teacher)
                .FirstOrDefaultAsync(e => e.Id == DailyProgressId);
            if (theProgress == null)
                return null;
            return new StudentDailyProgressDto()
            {
                Content=theProgress.Content,
                Grade=theProgress.Grade,
                Id=theProgress.Id,
                IsCompleted=theProgress.IsCompleted,
                IsEdited=theProgress.IsEdited,
                NextTask=theProgress.NextTask,
                Note=theProgress.Note,
                ProgressDate=theProgress.ProgressDate,
                ProgressType=theProgress.ProgressType,
                StudentId=theProgress.StudentId,
                StudentName=theProgress.Student.Name,
                TeacherName=theProgress.Teacher.UserName
            };
        }
    }
}
