using LibrarySystem.Domain.Entities;

namespace LibrarySystem.Domain.Interfaces
{
    public interface IBookRepository
    {
        Task<List<Books>> GetAllAsync();
        Task<Books?> GetByIdAsync(Guid id);
        Task AddAsync(Books book);
        Task UpdateAsync(Books book);
        Task DeleteAsync(Guid id);
    }
}
