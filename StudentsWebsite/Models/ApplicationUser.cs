using Microsoft.AspNetCore.Identity;


namespace StudentsWebsite.Models
{
    public class ApplicationUser: IdentityUser
    {
        public int? ClassId { get; set; }

        public Class? Class { get; set; }

    }
}
