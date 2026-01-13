using System;
using System.Collections.Generic;
using System.Text;

namespace LibrarySystem.Application.DTOs.Loans
{
    public class LoanDto
    {
        public Guid Id { get; set; }
        public Guid BookId { get; set; }
        public Guid UserId { get; set; }
        public DateTime LoanDate { get; set; }
        public DateTime? ReturnDate { get; set; }
        public string UserFullName { get; set; }
        public string BookTitle { get; set; }



    }
}
