using System;
using System.Collections.Generic;
using System.Text;

namespace LibrarySystem.Domain.Entities
{
    public class Author
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }
        public List<Books> Books { get; set; } = new();
    }
}
