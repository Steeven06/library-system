using System;
using System.Collections.Generic;
using System.Text;

namespace LibrarySystem.Domain.Entities
{
    public class User
    {
       
            public Guid Id { get; set; }
            public string FullName { get; set; }
            public string Phone { get; set; }
            public string Cedula { get; set; }
           public string Address { get; set; }
         public string Email { get; set; }

        // Relación 1 -> N
        public List<Loan> Loans { get; set; } = new();
        }
}
