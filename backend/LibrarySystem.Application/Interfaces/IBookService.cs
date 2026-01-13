using LibrarySystem.Application.DTOs.Books;
using System;
using System.Collections.Generic;
using System.Text;

namespace LibrarySystem.Application.Interfaces
{
    public interface IBookService
    {
        Task<List<BookDto>> GetAllAsync();
        Task<BookDto?> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(CreateBookDto dto);
        Task UpdateAsync(Guid id, UpdateBookDto dto);
        Task DeleteAsync(Guid id);
    }
}