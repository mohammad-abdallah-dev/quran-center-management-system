using System.Reflection.Emit;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using StudentsWebsite.Models;

namespace StudentsWebsite.Data
{
    public class MainDbContext(DbContextOptions options) : IdentityDbContext<ApplicationUser>(options)
    {
        public DbSet<Class> Classes { get; set; }
        public DbSet<Student> Students { get; set; }
        public DbSet<StudentQuranProgress> studentQuranProgresses { get; set; }
        public DbSet<ProgressType> ProgressTypes { get; set; }
        public DbSet<StudentDailyProgress> StudentDailyProgresses { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            seedRoles(builder, "Admin");
            seedRoles(builder, "Teacher");
            // User --> Class  M:1
            builder.Entity<ApplicationUser>()
      .HasOne(u => u.Class)
      .WithMany(c => c.Teachers)
      .HasForeignKey(u => u.ClassId)
      .OnDelete(DeleteBehavior.SetNull);
            // Student --> Class M:1
            builder.Entity<Student>()
    .HasOne(s => s.Class)
    .WithMany(c => c.Students)
    .HasForeignKey(s => s.ClassId)
    .OnDelete(DeleteBehavior.Restrict);
            // Student --> StuDayProg 1:M
            builder.Entity<StudentDailyProgress>()
            .HasOne(p => p.Student)
            .WithMany(s => s.DailyProgresses)
            .HasForeignKey(p => p.StudentId)
            .OnDelete(DeleteBehavior.Cascade);

            // User --> StuDayProg  1:M
            builder.Entity<StudentDailyProgress>()
                .HasOne(p => p.Teacher)
                .WithMany()
                .HasForeignKey(p => p.TeacherId)
                .OnDelete(DeleteBehavior.Restrict);
           
            builder.Entity<StudentQuranProgress>()
    .HasOne(q => q.Student)
    .WithMany(s => s.QuranProgresses)
    .HasForeignKey(q => q.StudentId)
    .OnDelete(DeleteBehavior.Cascade);
        }
       private void seedRoles(ModelBuilder modelBuilder, string roleName, params string[] permission)
        {
            var role = new IdentityRole
            {
                Id = roleName.ToLower(),
                Name = roleName,
                NormalizedName = roleName.ToUpper(),
                ConcurrencyStamp = Guid.Empty.ToString()
            };

            // add claims for the users
            // complete


            modelBuilder.Entity<IdentityRole>().HasData(role);
        }
    
}
    } 

