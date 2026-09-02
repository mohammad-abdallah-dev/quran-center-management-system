using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using StudentsWebsite.Data;
using StudentsWebsite.Models;
using StudentsWebsite.Models.DTos;
using StudentsWebsite.Repostries.Interfaces;

namespace StudentsWebsite.Repostries.Services
{
    public class StudentService : IStudent
    {
        private readonly MainDbContext _context;
        private readonly ILogger<StudentService> _logger;

        public StudentService(MainDbContext context, ILogger<StudentService> logger)
        {
            _context = context;
            _logger = logger;
        }



        public async Task<CreateStudentDto?> CreateStudent(CreateStudentDto createStudent)
        {
            try
            {
                if (createStudent == null)
                    return null;

                if (string.IsNullOrWhiteSpace(createStudent.name))
                    return null;

                var classExists = await _context.Classes
                    .AnyAsync(c => c.Id == createStudent.ClassId);

                if (!classExists)
                    return null;

                var student = new Student()
                {
                    Name = createStudent.name,
                    ClassId = createStudent.ClassId,
                    QuranProgresses=new List<StudentQuranProgress>()
                    
                };

                _context.Students.Add(student);
                await _context.SaveChangesAsync();

                return createStudent;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while creating student.");
                return null;
            }
        }

        public async Task<List<StudentInfoDto>> GetAllStudentByClassId(int id)
        {
            var students = await _context.Students
                .Include(s => s.Class)
                .Include(e=>e.QuranProgresses)
                .Where(s => s.ClassId == id)
                .Select(s => new StudentInfoDto
                {
                    id = s.Id,
                    name = s.Name,
                    JuzNumber=s.QuranProgresses.Count()
                    
                })
                .ToListAsync();

            return students;
        }

        public async Task<List<StudentInfoDto>> GetAllStudents()
        {
            try
            {
                var students = await _context.Students
                    .AsNoTracking()
                    .Include(s => s.Class)
                    .ToListAsync();

                var studentsInfos = new List<StudentInfoDto>();

                foreach (var student in students)
                {
                    studentsInfos.Add(new StudentInfoDto()
                    {
                        id = student.Id,
                        name = student.Name,
                        className = student.Class?.Name,
                       
                    });
                }

                return studentsInfos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while getting all students.");
                return new List<StudentInfoDto>();
            }
        }

        public async Task<StudentInfoDto?> GetStudent(int id)
        {
            try
            {
                var theStudent = await _context.Students
                    .AsNoTracking()
                    .Include(s => s.Class)
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (theStudent == null)
                    return null;

                return new StudentInfoDto()
                {
                    id = theStudent.Id,
                    name = theStudent.Name,
                    className = theStudent.Class?.Name

                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while getting student by id.");
                return null;
            }
        }

        public async Task<List<StudentQuranProgress>> GetStudentQuranProgress(int id)
        {
            return await _context.studentQuranProgresses
                .Where(q => q.StudentId == id)
                .ToListAsync();
        }

        
    }
}