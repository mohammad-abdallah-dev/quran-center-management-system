using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentsWebsite.Data;
using StudentsWebsite.Models;
using StudentsWebsite.Models.DTos;
using StudentsWebsite.Repostries.Interfaces;
using StudentsWebsite.Repostries.Services;

namespace StudentsWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentQuranProgressesController : ControllerBase
    {
        private readonly MainDbContext _context;
        private readonly IProgress _progress;

        public StudentQuranProgressesController(MainDbContext context,
            IProgress progress
            )
        {
            _context = context;
            _progress = progress;
        }

        // GET: api/StudentQuranProgresses
        [HttpGet("ByStudent/{studentId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<StudentQuranProgress>>> GetstudentQuranProgresses(int studentId)
        {
            return await _progress.GetStudentQuranProgresforStudentById(studentId);
        }

        // GET: api/StudentQuranProgresses/5
        [HttpGet("{id}")]
        [Authorize]
        public async Task<ActionResult<StudentQuranProgress>> GetStudentQuranProgress(int id)
        {
            var studentQuranProgress = await _progress.GetStudentQuranProgress(id);

            if (studentQuranProgress == null)
            {
                return NotFound();
            }

            return studentQuranProgress;
        }

        // PUT: api/StudentQuranProgresses/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> PutStudentQuranProgress(
        int id,
        StudentQuranProgress studentQuranProgress)
        {
            var updated = await _progress.EditStudentProgress(id, studentQuranProgress);

            if (updated == null)
                return NotFound();

            return Ok(updated);
        }

        // POST: api/StudentQuranProgresses
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<AddStudentQuranProgressDto>> PostStudentQuranProgress(AddStudentQuranProgressDto studentQuranProgress)
        {
            var theProgress = await _progress.AddStudentProgress(studentQuranProgress);
            return Ok(theProgress);
          
        }

        // DELETE: api/StudentQuranProgresses/5
        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteStudentQuranProgress(int id)
        {
            var studentQuranProgress = await _context.studentQuranProgresses.FindAsync(id);
            if (studentQuranProgress == null)
            {
                return NotFound();
            }

            _context.studentQuranProgresses.Remove(studentQuranProgress);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool StudentQuranProgressExists(int id)
        {
            return _context.studentQuranProgresses.Any(e => e.Id == id);
        }
    }
}
