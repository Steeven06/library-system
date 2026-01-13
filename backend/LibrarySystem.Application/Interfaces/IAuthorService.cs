using LibrarySystem.Application.DTOs.Authors;
using System;
using System.Collections.Generic;
using System.Text;
using LibrarySystem.Application.DTOs.Authors;

namespace LibrarySystem.Application.Interfaces
{
    public interface IAuthorService
    {
        Task<List<AuthorDto>> GetAllAsync();
        Task<AuthorDto?> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(CreateAuthorDto dto);
        Task UpdateAsync(Guid id, UpdateAuthorDto dto);
        Task DeleteAsync(Guid id);

    }
}
