using Microsoft.AspNetCore.Authorization;
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
    public class StudentsController : ControllerBase
    {
        private readonly MainDbContext _context;
        private readonly IStudent _student;
        private readonly ILogger<StudentsController> _logger;

        public StudentsController(
            MainDbContext context,
            IStudent student,
            ILogger<StudentsController> logger)
        {
            _context = context;
            _student = student;
            _logger = logger;
        }
        [HttpGet("ByClass/{id}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<StudentInfoDto>>> GetAllStudentsByClassId(int id)
        {
            try
            {
                var students = await _student.GetAllStudentByClassId(id);
                return Ok(students);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetStudents endpoint.");

                return Problem(
                    detail: "Something went wrong while getting students.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }

        [HttpGet]
        [Authorize]
        public async Task<ActionResult<IEnumerable<StudentInfoDto>>> GetStudents()
        {
            try
            {
                var students = await _student.GetAllStudents();
                return Ok(students);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetStudents endpoint.");

                return Problem(
                    detail: "Something went wrong while getting students.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<StudentInfoDto>> GetStudent(int id)
        {
            try
            {
                var student = await _student.GetStudent(id);

                if (student == null)
                    return NotFound(new { message = "Student not found." });

                return Ok(student);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetStudent endpoint.");

                return Problem(
                    detail: "Something went wrong while getting the student.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult<CreateStudentDto>> PostStudent(CreateStudentDto student)
        {
            try
            {
                if (!ModelState.IsValid)
                    return ValidationProblem(ModelState);

                if (student == null || string.IsNullOrWhiteSpace(student.name))
                    return BadRequest(new { message = "Student name is required." });

                var classExists = await _context.Classes
                    .AnyAsync(c => c.Id == student.ClassId);

                if (!classExists)
                    return BadRequest(new { message = "Class not found." });

                var createdStudent = await _student.CreateStudent(student);

                if (createdStudent == null)
                    return BadRequest(new { message = "Student could not be created." });

                return Ok(createdStudent);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in PostStudent endpoint.");

                return Problem(
                    detail: "Something went wrong while creating the student.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutStudent(int id, Student student)
        {
            try
            {
                if (student == null)
                    return BadRequest(new { message = "Student data is required." });

                if (id != student.Id)
                    return BadRequest(new { message = "Student id does not match." });

                var studentExists = await _context.Students
                    .AnyAsync(s => s.Id == id);

                if (!studentExists)
                    return NotFound(new { message = "Student not found." });

                var classExists = await _context.Classes
                    .AnyAsync(c => c.Id == student.ClassId);

                if (!classExists)
                    return BadRequest(new { message = "Class not found." });

                _context.Entry(student).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error while updating student.");

                if (!await StudentExists(id))
                    return NotFound(new { message = "Student not found." });

                return Problem(
                    detail: "Student was updated by another process. Please try again.",
                    statusCode: StatusCodes.Status409Conflict
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in PutStudent endpoint.");

                return Problem(
                    detail: "Something went wrong while updating the student.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            try
            {
                var student = await _context.Students
                    .FirstOrDefaultAsync(s => s.Id == id);

                if (student == null)
                    return NotFound(new { message = "Student not found." });

                _context.Students.Remove(student);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while deleting student.");

                return BadRequest(new
                {
                    message = "Cannot delete this student because it is related to other data."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in DeleteStudent endpoint.");

                return Problem(
                    detail: "Something went wrong while deleting the student.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }

        private async Task<bool> StudentExists(int id)
        {
            return await _context.Students.AnyAsync(e => e.Id == id);
        }

        [HttpGet("{id}/QuranProgress")]
        [Authorize]
        public async Task<ActionResult<List<StudentQuranProgress>>> GetStudentQuranProgress(int id)
        {
            var progresses = await _student.GetStudentQuranProgress(id);

            if (progresses == null || !progresses.Any())
                return NotFound();

            return Ok(progresses);
        }
    }
}