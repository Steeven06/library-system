using LibrarySystem.Application.DTOs.Categories;
using System;
using System.Collections.Generic;
using System.Text;

namespace LibrarySystem.Application.Interfaces
{
    public interface ICategoryService
    {
        Task<List<CategoryDto>> GetAllAsync();
        Task<CategoryDto?> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(CreateCategoryDto dto);
        Task UpdateAsync(Guid id, UpdateCategoryDto dto);
        Task DeleteAsync(Guid id);
    }
}
