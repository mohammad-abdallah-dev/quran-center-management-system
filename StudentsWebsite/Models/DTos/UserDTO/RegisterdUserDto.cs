using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace StudentsWebsite.Models.DTos.UserDTO
{
    public class RegisterdUserDto
    {
        [Required]
        public string UserName { get; set; }
        [Required]
        public string Email { get; set; }
        [Required]    
        public string Password { get; set; }
        [Required]
        [Compare("Password",ErrorMessage ="Does not Match")]
       public string ConfirmPassword { get; set; }

        public int? ClassId { get; set; } 
        public string role { get; set; }
       
    }
}
