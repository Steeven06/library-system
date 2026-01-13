using LibrarySystem.Domain.Entities;
using LibrarySystem.Domain.Interfaces;
using LibrarySystem.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace LibrarySystem.Infrastructure.Repositories
{
    public class BookRepository : IBookRepository
    {
        private readonly LibraryDbContext _context;

        public BookRepository(LibraryDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Books book)
        {
            await _context.Books.AddAsync(book);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(Guid id)
        {
            var book = await _context.Books.FindAsync(id);  // <- aquí se define 'book'

            if (book is null)
                return; // o lanzar excepción si quieres
            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Books>> GetAllAsync()
        {
            return await _context.Books
                .Include(x => x.Author)
                .Include(x => x.Category)
                .ToListAsync();
        }

        public async Task<Books?> GetByIdAsync(Guid id)
        {
            return await _context.Books
                .Include(x => x.Author)
                .Include(x => x.Category)
                .FirstOrDefaultAsync(x => x.Id == id);
        }

        public async Task UpdateAsync(Books book)
        {
            _context.Books.Update(book);
            await _context.SaveChangesAsync();
        }
    }
}
