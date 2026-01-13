using System;
using System.Collections.Generic;
using System.Text;
using LibrarySystem.Application.DTOs.Loans;

namespace LibrarySystem.Application.Interfaces
{
    public interface ILoanService
    {
       
        Task<List<LoanDto>> GetAllAsync();
        Task<LoanDto?> GetByIdAsync(Guid id);
        Task<Guid> CreateAsync(CreateLoanDto dto);
        Task ReturnBookAsync(Guid id);
    }

    }
 


