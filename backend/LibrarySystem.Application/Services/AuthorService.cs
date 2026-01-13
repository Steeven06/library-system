using LibrarySystem.Application.DTOs.Authors;
using LibrarySystem.Application.Interfaces;
using LibrarySystem.Domain.Entities;
using LibrarySystem.Domain.Interfaces;




namespace LibrarySystem.Application.Services
{
    public class AuthorService : IAuthorService
    {
        private readonly IAuthorRepository _repository;

        public AuthorService(IAuthorRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<AuthorDto>> GetAllAsync()
        {
            var authors = await _repository.GetAllAsync();
            return authors.Select(a => new AuthorDto
            {
                Id = a.Id,
                FullName = a.FullName
            }).ToList();
        }

        public async Task<AuthorDto?> GetByIdAsync(Guid id)
        {
            var author = await _repository.GetByIdAsync(id);
            if (author == null)
                return null;

            return new AuthorDto
            {
                Id = author.Id,
                FullName = author.FullName
            };
        }

        public async Task<Guid> CreateAsync(CreateAuthorDto dto)
        {
            var normalized = dto.FullName.Trim().ToLower();

            if (await _repository.ExistsByNameAsync(normalized))
                throw new Exception("El autor ya está registrado.");

            var author = new Author
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName
            };

            await _repository.AddAsync(author);
            return author.Id;
        }

        public async Task UpdateAsync(Guid id, UpdateAuthorDto dto)
        {
            var author = await _repository.GetByIdAsync(id);
            if (author == null) throw new Exception("Author no encontrado");

            var normalized = dto.FullName.Trim().ToLower();

            if (await _repository.ExistsByNameAsync(normalized) &&
                normalized != author.FullName.Trim().ToLower())
                throw new Exception("Ya existe otro autor con ese nombre.");

            author.FullName = dto.FullName;

            await _repository.UpdateAsync(author);
        }

        public async Task DeleteAsync(Guid id)
        {
            var author = await _repository.GetByIdAsync(id);
            if (author == null)
                throw new Exception("Autor no encontrado");

            await _repository.DeleteAsync(author.Id);
        }
    }
}
