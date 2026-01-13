using System;
using System.Collections.Generic;
using System.Text;

namespace LibrarySystem.Application.DTOs.Books
{
    public class BookDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string? Description { get; set; }
        public int Year { get; set; }
        public string? ImageUrl { get; set; }
        public int Quantity { get; set; }
        public int AvailableQuantity { get; set; }

        public Guid AuthorId { get; set; }
        public string AuthorFullName { get; set; } = null!;

        public Guid CategoryId { get; set; }
        public string CategoryName { get; set; } = null!;
    }
}

