using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.EntityFrameworkCore;
using StudentsWebsite.Data;
using StudentsWebsite.Models;
using StudentsWebsite.Models.DTos.UserDTO;
using StudentsWebsite.Repostries.Interfaces;

namespace StudentsWebsite.Repostries.Services
{
    public class IdentitiUserService : IUser
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly MainDbContext _context;
        private readonly JwtTokenService jwtTokenService;
        private readonly ILogger<IdentitiUserService> _logger;

        public IdentitiUserService(
            UserManager<ApplicationUser> manager,
            JwtTokenService jwtTokenService,
            MainDbContext dbContext,
            ILogger<IdentitiUserService> logger)
        {
            _userManager = manager;
            this.jwtTokenService = jwtTokenService;
            _context = dbContext;
            _logger = logger;
        }
        [Authorize(Roles ="Admin")]
        public async Task<UserDto?> Register(RegisterdUserDto registerdUserDto, ModelStateDictionary modelState)
        {
            try
            {
                Class? theClass = null;

                if (registerdUserDto.ClassId.HasValue)
                {
                    theClass = await _context.Classes
                        .AsNoTracking()
                        .FirstOrDefaultAsync(c => c.Id == registerdUserDto.ClassId.Value);

                    if (theClass == null)
                    {
                        modelState.AddModelError(nameof(registerdUserDto.ClassId), "Class not found.");
                        return null;
                    }
                }

                var user = new ApplicationUser()
                {
                    UserName = registerdUserDto.UserName,
                    Email = registerdUserDto.Email,
                    ClassId = registerdUserDto.ClassId
                };

                var result = await _userManager.CreateAsync(user, registerdUserDto.Password);

                if (!result.Succeeded)
                {
                    foreach (var error in result.Errors)
                    {
                        modelState.AddModelError(GetErrorField(error.Code), error.Description);
                    }

                    return null;
                }

                var roleResult = await _userManager.AddToRoleAsync(user, registerdUserDto.role);

                if (!roleResult.Succeeded)
                {
                    await _userManager.DeleteAsync(user);

                    foreach (var error in roleResult.Errors)
                    {
                        modelState.AddModelError("", error.Description);
                    }

                    return null;
                }

                return new UserDto()
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = registerdUserDto.role,
                    ClassName = theClass?.Name
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while registering user.");
                modelState.AddModelError("", "Something went wrong while registering the user.");
                return null;
            }
        }

        public async Task<UserDto?> Login(string username, string password)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
                    return null;

                var user = await _userManager.Users
                    .Include(u => u.Class)
                    .FirstOrDefaultAsync(u => u.UserName == username);

                if (user == null)
                    return null;

                bool passValidation = await _userManager.CheckPasswordAsync(user, password);

                if (!passValidation)
                    return null;

                var roles = await _userManager.GetRolesAsync(user);

                return new UserDto()
                {
                    classId=user.ClassId,
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = roles.FirstOrDefault(),
                    ClassName = user.Class?.Name,
                    Token = await jwtTokenService.GenerateToken(user, TimeSpan.FromDays(7))
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while logging in user.");
                return null;
            }
        }
        public async Task<List<UserDto>> GetAllusers()
        {
            var usersFromDb = await _context.Users
                .Include(u => u.Class)
                .ToListAsync();

            List<UserDto> users = new List<UserDto>();


            foreach (var user in usersFromDb)
            {
               
                var roles = await _userManager.GetRolesAsync(user);
                if (roles.Contains("Admin"))
                    continue;
                {
                    users.Add(new UserDto()
                    {
                        Id = user.Id,
                        UserName = user.UserName,
                        Email = user.Email,
                        Role = roles.FirstOrDefault(),
                        ClassName = user.Class?.Name
                    });
                }
            }

            return users;
        }
        public async Task<(bool Success, List<string> Errors)> ResetPassword(string userId, ResetPasswordDto dto)
        {
            List<string> errors = new List<string>();

            if (string.IsNullOrWhiteSpace(userId))
            {
                errors.Add("رقم المستخدم غير صحيح");
                return (false, errors);
            }

            if (string.IsNullOrWhiteSpace(dto.NewPassword))
            {
                errors.Add("يرجى إدخال كلمة السر الجديدة");
                return (false, errors);
            }

            if (dto.NewPassword != dto.ConfirmPassword)
            {
                errors.Add("كلمتا المرور غير متطابقتين");
                return (false, errors);
            }

            var user = await _userManager.FindByIdAsync(userId);

            if (user == null)
            {
                errors.Add("المستخدم غير موجود");
                return (false, errors);
            }

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            var result = await _userManager.ResetPasswordAsync(
                user,
                token,
                dto.NewPassword
            );

            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    errors.Add(TranslateIdentityError(error.Description));
                }

                return (false, errors);
            }

            return (true, errors);
        }

        public async Task<UserDto?> GetuserById(string id)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id))
                    return null;

                var user = await _userManager.Users
                    .Include(u => u.Class)
                    .FirstOrDefaultAsync(u => u.Id == id);

                if (user == null)
                    return null;

                var roles = await _userManager.GetRolesAsync(user);

                return new UserDto()
                {
                    Id = user.Id,
                    UserName = user.UserName,
                    Email = user.Email,
                    Role = roles.FirstOrDefault(),
                    ClassName = user.Class?.Name
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while getting user by id.");
                return null;
            }
        }

        public async Task<bool> DeleteUserById(string id)
        {
            if (string.IsNullOrWhiteSpace(id))
                return false;

            var user = await _userManager.FindByIdAsync(id);

            if (user == null)
                return false;

            var dailyProgresses = await _context.StudentDailyProgresses
                .Where(x => x.TeacherId == id)
                .ToListAsync();

            foreach (var progress in dailyProgresses)
            {
                progress.TeacherId = null;
            }

            await _context.SaveChangesAsync();

            var result = await _userManager.DeleteAsync(user);

            return result.Succeeded;
        }


        private static string TranslateIdentityError(string error)
        {
            if (error.Contains("Passwords must be at least", StringComparison.OrdinalIgnoreCase))
                return "كلمة السر قصيرة جدًا";

            if (error.Contains("Passwords must have at least one non alphanumeric", StringComparison.OrdinalIgnoreCase))
                return "كلمة السر يجب أن تحتوي على رمز مثل @ أو #";

            if (error.Contains("Passwords must have at least one digit", StringComparison.OrdinalIgnoreCase))
                return "كلمة السر يجب أن تحتوي على رقم واحد على الأقل";

            if (error.Contains("Passwords must have at least one uppercase", StringComparison.OrdinalIgnoreCase))
                return "كلمة السر يجب أن تحتوي على حرف كبير واحد على الأقل";

            if (error.Contains("Passwords must have at least one lowercase", StringComparison.OrdinalIgnoreCase))
                return "كلمة السر يجب أن تحتوي على حرف صغير واحد على الأقل";

            return error;
        }
        private static string GetErrorField(string errorCode)
        {
            if (errorCode.Contains("Password", StringComparison.OrdinalIgnoreCase))
                return nameof(RegisterdUserDto.Password);

            if (errorCode.Contains("Email", StringComparison.OrdinalIgnoreCase))
                return nameof(RegisterdUserDto.Email);

            if (errorCode.Contains("UserName", StringComparison.OrdinalIgnoreCase) ||
                errorCode.Contains("Username", StringComparison.OrdinalIgnoreCase) ||
                errorCode.Contains("User", StringComparison.OrdinalIgnoreCase))
                return nameof(RegisterdUserDto.UserName);

            return "";
        }
    }
}