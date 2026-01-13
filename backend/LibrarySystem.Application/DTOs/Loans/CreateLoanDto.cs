using System;
using System.Collections.Generic;
using System.Text;

namespace LibrarySystem.Application.DTOs.Loans
{
    public  class CreateLoanDto
    {
        public Guid BookId { get; set; }
        public Guid UserId { get; set; }
    }
}
