using LibrarySystem.Application.DTOs.Books;
using LibrarySystem.Application.Interfaces;
using LibrarySystem.Domain.Entities;
using LibrarySystem.Domain.Interfaces;

namespace LibrarySystem.Application.Services
{
    public class BookService : IBookService
    {
        private readonly IBookRepository _bookRepo;
        private readonly IAuthorRepository _authorRepo;
        private readonly ICategoryRepository _categoryRepo;

        public BookService(
            IBookRepository bookRepo,
            IAuthorRepository authorRepo,
            ICategoryRepository categoryRepo)
        {
            _bookRepo = bookRepo;
            _authorRepo = authorRepo;
            _categoryRepo = categoryRepo;
        }

        public async Task<List<BookDto>> GetAllAsync()
        {
            var books = await _bookRepo.GetAllAsync();

            return books.Select(b => new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
                Year = b.Year,
                ImageUrl = b.ImageUrl,
                Quantity = b.Quantity,
                AvailableQuantity = b.AvailableQuantity,
                AuthorFullName = b.Author.FullName,
                CategoryName = b.Category.Name,
                CategoryId = b.CategoryId,
                AuthorId = b.AuthorId
            }).ToList();
        }
        public async Task<BookDto?> GetByIdAsync(Guid id)
        {
            var b = await _bookRepo.GetByIdAsync(id);

            if (b == null)
                return null;

            return new BookDto
            {
                Id = b.Id,
                Title = b.Title,
                Description = b.Description,
                Year = b.Year,
                ImageUrl = b.ImageUrl,
                Quantity = b.Quantity,
                AvailableQuantity = b.AvailableQuantity,
                AuthorFullName = b.Author.FullName,
                CategoryName = b.Category.Name,
                CategoryId = b.CategoryId,
                AuthorId = b.AuthorId
            };
        }


        public async Task<Guid> CreateAsync(CreateBookDto dto)
        {
            var author = await _authorRepo.GetByIdAsync(dto.AuthorId);
            if (author == null) throw new Exception("Autor no encontrado");

            var category = await _categoryRepo.GetByIdAsync(dto.CategoryId);
            if (category == null) throw new Exception("Categoria no encontrada");

            var book = new Books
            {
                Id = Guid.NewGuid(),
                Title = dto.Title,
                Description = dto.Description,
                Year = dto.Year,
                ImageUrl = dto.ImageUrl,
                Quantity = dto.Quantity,
                AvailableQuantity = dto.Quantity,
                AuthorId = dto.AuthorId,
                CategoryId = dto.CategoryId
            };

            await _bookRepo.AddAsync(book);
            return book.Id;
        }

        public async Task UpdateAsync(Guid id, UpdateBookDto dto)
        {
            var book = await _bookRepo.GetByIdAsync(id);
            if (book == null) throw new Exception("Libro no encontrado");

            // ---------------------------
            // Validaciones 
            // ---------------------------
            if (dto.Quantity <= 0)
                throw new Exception("La cantidad debe ser mayor que 0");

            var currentYear = DateTime.Now.Year;
            if (dto.Year < 1000 || dto.Year > currentYear)
                throw new Exception($"Año no válido. Debe estar entre 1000 y {currentYear}");

            // ---------------------------
            // Calcular prestados actuales
            // ---------------------------
            var borrowed = book.Quantity - book.AvailableQuantity; // copias prestadas

            // No permitir bajar el total por debajo de lo prestado
            if (dto.Quantity < borrowed)
                throw new Exception($"No puedes reducir la cantidad a {dto.Quantity} porque hay {borrowed} prestado(s).");

            // ---------------------------
            // Actualizar campos
            // ---------------------------
            book.Title = dto.Title;
            book.Description = dto.Description;
            book.Year = dto.Year;
            book.ImageUrl = dto.ImageUrl;
            book.AuthorId = dto.AuthorId;
            book.CategoryId = dto.CategoryId;

            // ---------------------------
            // Ajustar Quantity y AvailableQuantity
            // ---------------------------
            book.Quantity = dto.Quantity;
            book.AvailableQuantity = dto.Quantity - borrowed;

            await _bookRepo.UpdateAsync(book);
        }


        public async Task DeleteAsync(Guid id)
        {
            await _bookRepo.DeleteAsync(id);
        }
    }
}
