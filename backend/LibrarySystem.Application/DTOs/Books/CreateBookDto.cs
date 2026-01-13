using System;
using System.Collections.Generic;
using System.Text;

namespace LibrarySystem.Application.DTOs.Books
{
    public class CreateBookDto
    {
        public string Title { get; set; }
     
       
        public string Description { get; set; } 
        public int Quantity { get; set; }
        public string ImageUrl { get; set; }
        public int Year { get; set; }
        public Guid AuthorId { get; set; }
        public Guid CategoryId { get; set; }
    }
}
