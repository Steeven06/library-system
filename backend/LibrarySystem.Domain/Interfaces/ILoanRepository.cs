using LibrarySystem.Domain.Entities;

namespace LibrarySystem.Domain.Interfaces
{
    public interface ILoanRepository
    {
        Task<List<Loan>> GetAllAsync();
        Task<Loan?> GetByIdAsync(Guid id);
        Task AddAsync(Loan loan);
        Task UpdateAsync(Loan loan);
    }
}
