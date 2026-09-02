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
    public class ClassesController : ControllerBase
    {
        private readonly MainDbContext _context;
        private readonly IClass _class;
        private readonly ILogger<ClassesController> _logger;

        public ClassesController(
            MainDbContext context,
            IClass classs,
            ILogger<ClassesController> logger)
        {
            _context = context;
            _class = classs;
            _logger = logger;
        }
         [Authorize(Roles = "Admin,Teacher")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ClassInfoDto>>> GetClasses()
        {
            try
            {
                var classes = await _class.GetAllClasses();
                return Ok(classes);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetClasses endpoint.");
                return Problem(
                    detail: "Something went wrong while getting classes.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }
        [Authorize(Roles = "Admin,Teacher")]
        [HttpGet("{id}")]
        public async Task<ActionResult<ClassInfoDto>> GetClass(int id)
        {
            try
            {
                var theClass = await _class.GetClass(id);

                if (theClass == null)
                    return NotFound(new { message = "Class not found." });

                return Ok(theClass);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetClass endpoint.");
                return Problem(
                    detail: "Something went wrong while getting the class.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutClass(int id, Class @class)
        {
            try
            {
                if (id != @class.Id)
                    return BadRequest(new { message = "Class id does not match." });

                var classExists = await _context.Classes.AnyAsync(e => e.Id == id);

                if (!classExists)
                    return NotFound(new { message = "Class not found." });

                _context.Entry(@class).State = EntityState.Modified;

                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                _logger.LogError(ex, "Concurrency error while updating class.");

                if (!await ClassExists(id))
                    return NotFound(new { message = "Class not found." });

                return Problem(
                    detail: "Class was updated by another process. Please try again.",
                    statusCode: StatusCodes.Status409Conflict
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in PutClass endpoint.");
                return Problem(
                    detail: "Something went wrong while updating the class.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<CreateClassDto>> PostClass(CreateClassDto createClassDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return ValidationProblem(ModelState);

                if (createClassDto == null || string.IsNullOrWhiteSpace(createClassDto.name))
                    return BadRequest(new { message = "Class name is required." });

                var theClass = await _class.CreateClass(createClassDto);

                if (theClass == null)
                    return BadRequest(new { message = "Class could not be created." });

                return Ok(theClass);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in PostClass endpoint.");
                return Problem(
                    detail: "Something went wrong while creating the class.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }
       
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            try
            {
                var classEntity = await _context.Classes
                    .Include(c => c.Teachers)
                    .Include(c => c.Students)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (classEntity == null)
                {
                    return NotFound(new { message = "Class not found." });
                }

                // فك ارتباط المعلمين
                foreach (var teacher in classEntity.Teachers)
                {
                    teacher.ClassId = null;
                }

                // فك ارتباط الطلاب
                foreach (var student in classEntity.Students)
                {
                    student.ClassId = null;
                }

                await _context.SaveChangesAsync();

                // حذف الصف
                _context.Classes.Remove(classEntity);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Class deleted successfully." });
            }
            catch (DbUpdateException ex)
            {
                _logger.LogError(ex, "Database error while deleting class.");

                return BadRequest(new
                {
                    message = "Cannot delete class because of database constraints."
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error while deleting class.");

                return StatusCode(500, new
                {
                    message = "Something went wrong."
                });
            }
        }

        private async Task<bool> ClassExists(int id)
        {
            return await _context.Classes.AnyAsync(e => e.Id == id);
        }
    }
}