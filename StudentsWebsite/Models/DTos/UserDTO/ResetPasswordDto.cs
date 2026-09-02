using System.ComponentModel.DataAnnotations;

namespace StudentsWebsite.Models.DTos.UserDTO
{
    public class ResetPasswordDto
    {
        [Required]
        public string NewPassword { get; set; }

        [Required]
        public string ConfirmPassword { get; set; }
    }
}
