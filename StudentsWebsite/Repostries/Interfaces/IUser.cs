using Microsoft.AspNetCore.Mvc.ModelBinding;
using StudentsWebsite.Models.DTos.UserDTO;

namespace StudentsWebsite.Repostries.Interfaces
{
    public interface IUser
    {

        // Add register
        public Task<UserDto> Register(RegisterdUserDto registerdUserDto, ModelStateDictionary modelState);


        // Add login 
        public Task<UserDto> Login(string username, string password);
        Task<(bool Success, List<string> Errors)> ResetPassword(string userId, ResetPasswordDto dto);

        public Task<List<UserDto>> GetAllusers();
        public Task<UserDto> GetuserById(string id);
        public Task<bool> DeleteUserById(string id); 

        
    }
}
