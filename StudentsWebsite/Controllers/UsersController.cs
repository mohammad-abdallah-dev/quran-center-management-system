using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StudentsWebsite.Models.DTos.UserDTO;
using StudentsWebsite.Repostries.Interfaces;

namespace StudentsWebsite.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly IUser userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUser context, ILogger<UsersController> logger)
        {
            userService = context;
            _logger = logger;
        }
        [AllowAnonymous]

        [HttpPut("ResetPassword/{userId}")]
        public async Task<IActionResult> ResetPassword(string userId, [FromBody] ResetPasswordDto dto)
        {
            if (!ModelState.IsValid)
                return ValidationProblem(ModelState);

            var result = await userService.ResetPassword(userId, dto);

            if (!result.Success)
                return BadRequest(result.Errors);

            return Ok("تم تغيير كلمة السر بنجاح");
        }
        [Authorize(Roles = "Admin")]

        [HttpPost("Register")]
        public async Task<ActionResult<UserDto>> Register(RegisterdUserDto registerdUserDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return ValidationProblem(ModelState);

                var user = await userService.Register(registerdUserDto, ModelState);

                if (!ModelState.IsValid)
                    return ValidationProblem(ModelState);

                if (user == null)
                    return BadRequest(new { message = "User registration failed." });

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in Register endpoint.");
                return Problem(
                    detail: "Something went wrong while registering the user.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }

        [HttpPost("Login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return ValidationProblem(ModelState);

                var user = await userService.Login(loginDto.Username, loginDto.Password);

                if (user == null)
                    return Unauthorized(new { message = "Invalid username or password." });

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in Login endpoint.");
                return Problem(
                    detail: "Something went wrong while logging in.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("GetAllUsers")]
    

        public async Task<ActionResult<List<UserDto>>> GetAllUsers()
        {
            try
            {
                var users = await userService.GetAllusers();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetAllUsers endpoint.");
                return Problem(
                    detail: "Something went wrong while getting users.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("GetByUserId/{id}")]
       
        public async Task<ActionResult<UserDto>> GetUserById(string id)
        {
            try
            {
                var theUser = await userService.GetuserById(id);

                if (theUser == null)
                    return NotFound(new { message = "User not found." });

                return Ok(theUser);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Unexpected error in GetUserById endpoint.");
                return Problem(
                    detail: "Something went wrong while getting the user.",
                    statusCode: StatusCodes.Status500InternalServerError
                );
            }
        }
        [Authorize(Roles = "Admin")]
        [HttpDelete("DeleteUserById/{id}")]
        public async Task<IActionResult> DeleteUserById(string id)
        {
            try
            {
                var res = await userService.DeleteUserById(id);

                if (!res)
                    return BadRequest(new { message = "User could not be deleted." });

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.ToString());
            }
        }
    }
}