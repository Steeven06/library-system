using System;
using System.Collections.Generic;
using System.Text;

namespace LibrarySystem.Domain.Entities
{
    public class Category
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
         
        public  List<Books> Books { get; set; } = new();
    }
}
