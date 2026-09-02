using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentsWebsite.Data;
using StudentsWebsite.Models;
using StudentsWebsite.Models.DTos;
using StudentsWebsite.Repostries.Interfaces;

namespace StudentsWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentDailyProgressesController : ControllerBase
    {
        private readonly MainDbContext _context;
        private readonly IDailyProgress _dailyProgress;

        public StudentDailyProgressesController(MainDbContext context
            ,IDailyProgress dailyProgress
            )
        {
            _context = context;
            _dailyProgress = dailyProgress;
        }

        // GET: api/StudentDailyProgresses/ByStudent/5

        [HttpGet("ByStudent/{StudentId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<StudentDailyProgressDto>>> GetStudentDailyProgresses(int StudentId)
        {
            var AllProgress =await _dailyProgress.GetAllstudentDailyProgressDtos(StudentId);
            return Ok(AllProgress);

        }
        private string GetUserId()
        {
            return User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        }

        private async Task<bool> TeacherCanAccessStudent(int studentId)
        {
            if (User.IsInRole("Admin"))
                return true;

            var teacherId = GetUserId();

            var teacher = await _context.Users.FindAsync(teacherId);
            var student = await _context.Students.FindAsync(studentId);

            if (teacher == null || student == null)
                return false;

            return teacher.ClassId == student.ClassId;
        }
        // GET: api/StudentDailyProgresses/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<StudentDailyProgressDto>> GetStudentDailyProgress(int id)
        {
            var studentDailyProgress = await _dailyProgress.GetStudentDailyProgressById(id);

            if (studentDailyProgress == null)
            {
                return NotFound();
            }

            return studentDailyProgress;
        }

        // PUT: api/StudentDailyProgresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutStudentDailyProgress(
    int id,
    EditStudentDailyProgressDto studentDailyProgress
)
        {
            var teacherId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrWhiteSpace(teacherId))
            {
                return Unauthorized();
            }

            var theNewProgress =
                await _dailyProgress.EditStudentDailyProgressDto(
                    id,
                    studentDailyProgress,
                    teacherId
                );

            if (theNewProgress == null)
            {
                return NotFound();
            }

            return Ok(theNewProgress);
        }
        [HttpGet("ClassDailyGrades/{classId}")]
        [Authorize]
        public async Task<ActionResult<List<AllDailyProgressForClassDto>>> ClassDailyGrades(int classId)
        {
            var result = await _dailyProgress.AllDailyProgressForClassDto(classId);
            return Ok(result);
        }
        // POST: api/StudentDailyProgresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize(Roles = "Teacher,Admin")]
        public async Task<ActionResult> PostStudentDailyProgress(AddStudentDailyProgressDto dto)
        {
            var teacherId = GetUserId();

            if (string.IsNullOrEmpty(teacherId))
                return Unauthorized("TeacherId not found in token");

            if (!await TeacherCanAccessStudent(dto.StudentId))
                return Forbid();

            var newProgress = await _dailyProgress.AddStudentDailyProgressDto(dto, teacherId);

            return Ok(new
            {
                message = "تمت الإضافة بنجاح",
                id = newProgress.Id
            });
        }

        // DELETE: api/StudentDailyProgresses/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteStudentDailyProgress(int id)
        {
            var studentDailyProgress = await _context.StudentDailyProgresses.FindAsync(id);
            if (studentDailyProgress == null)
            {
                return NotFound();
            }

            _context.StudentDailyProgresses.Remove(studentDailyProgress);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentDailyProgressExists(int id)
        {
            return _context.StudentDailyProgresses.Any(e => e.Id == id);
        }
    }
}
