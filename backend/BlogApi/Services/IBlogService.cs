using BlogApi.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BlogApi.Services
{
    public interface IBlogService
    {
        // Creamos IBlogService para obligar a los servicios a tener esta estructura
        Task<IEnumerable<Blog>> GetAllAsync();
        Task<Blog> GetByIdAsync(int id);
        Task<Blog> AddAsync(Blog blog);
        Task<bool> UpdateAsync(int id, Blog blog);
        Task<bool> DeleteAsync(int id);
    }
}
