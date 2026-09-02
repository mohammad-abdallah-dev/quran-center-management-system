using Microsoft.EntityFrameworkCore;
using StudentsWebsite.Data;
using StudentsWebsite.Models;
using StudentsWebsite.Models.DTos;
using StudentsWebsite.Models.DTos.UserDTO;
using StudentsWebsite.Repostries.Interfaces;

namespace StudentsWebsite.Repostries.Services
{
    public class ClassService : IClass
    {
        private readonly MainDbContext _context;
        private readonly ILogger<ClassService> _logger;

        public ClassService(MainDbContext context, ILogger<ClassService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<CreateClassDto?> CreateClass(CreateClassDto createClassDto)
        {
            try
            {
                if (createClassDto == null)
                    return null;

                if (string.IsNullOrWhiteSpace(createClassDto.name))
                    return null;

                var classEntity = new Class()
                {
                    Name = createClassDto.name,
                    
                    
                };

                _context.Classes.Add(classEntity);
                await _context.SaveChangesAsync();

                return createClassDto;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while creating class.");
                return null;
            }
        }

        public async Task<List<ClassInfoDto>> GetAllClasses()
        {
            try
            {
                var allClasses = await _context.Classes
                    .AsNoTracking()
                    .Include(c => c.Students)
                    .Include(c => c.Teachers)
                    .ToListAsync();

                var classesInfos = new List<ClassInfoDto>();

                foreach (var classEntity in allClasses)
                {
                    classesInfos.Add(new ClassInfoDto()
                    {
                        Id = classEntity.Id,
                        Name = classEntity.Name,
                        Count=classEntity.Students?.Count?? 0 ,

                        TeachersInfos = classEntity.Teachers.Select(e => new UserDto()
                        {
                            Id = e.Id,
                            UserName = e.UserName,
                            Email = e.Email,
                            
                        }).ToList()
                        
                    }
                    
                    );

                }

                return classesInfos;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while getting all classes.");
                return new List<ClassInfoDto>();
            }
        }

        public async Task<ClassInfoDto?> GetClass(int id)
        {
            try
            {
                var theClass = await _context.Classes
                    .AsNoTracking()
                    .Include(c => c.Students)
                    .Include(c => c.Teachers)
                    .FirstOrDefaultAsync(c => c.Id == id);

                if (theClass == null)
                    return null;

                return new ClassInfoDto()
                {
                    Id = theClass.Id,
                    Name = theClass.Name,
                    Count = theClass.Students?.Count ?? 0,


                    TeachersInfos = theClass.Teachers.Select(e => new UserDto()
                    {
                        Id = e.Id,
                        UserName = e.UserName,
                        Email = e.Email
                    }).ToList()
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while getting class by id.");
                return null;
            }
        }
    }
}