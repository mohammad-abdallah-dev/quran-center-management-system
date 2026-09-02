using StudentsWebsite.Models.DTos;

namespace StudentsWebsite.Repostries.Interfaces
{
    public interface IClass
    {
        public Task<CreateClassDto> CreateClass(CreateClassDto createClassDto);
        public Task<List<ClassInfoDto>> GetAllClasses();
        public Task<ClassInfoDto> GetClass(int id);


    }
}
