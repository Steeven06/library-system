using System;
using System.Collections.Generic;
using System.Text;
using LibrarySystem.Domain.Entities;

namespace LibrarySystem.Domain.Entities
{
    public class Loan
    {
            public Guid BookId { get; set; }
            public Books Book { get; set; }

            public Guid UserId { get; set; }
            public User User { get; set; }

            public Guid Id { get; set; }

            public DateTime LoanDate { get; set; } = DateTime.UtcNow;
            public DateTime? ReturnDate { get; set; } // Null = no devuelto aún

          
            
        }

    }
