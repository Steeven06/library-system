using LibrarySystem.Application.DTOs.Loans;
using LibrarySystem.Domain.Entities;
using LibrarySystem.Domain.Interfaces;
using LibrarySystem.Application.Interfaces;
using LibrarySystem.Application.Exceptions;

namespace LibrarySystem.Application.Services
{
    public class LoanService : ILoanService
    {
        private readonly ILoanRepository _loanRepo;
        private readonly IBookRepository _bookRepo;
        private readonly IUserRepository _userRepo;

        public LoanService(
            ILoanRepository loanRepo,
            IBookRepository bookRepo,
            IUserRepository userRepo)
        {
            _loanRepo = loanRepo;
            _bookRepo = bookRepo;
            _userRepo = userRepo;
        }

        public async Task<List<LoanDto>> GetAllAsync()
        {
            var loans = await _loanRepo.GetAllAsync();

            return loans.Select(l => new LoanDto
            {
                Id = l.Id,
                BookId = l.BookId,
                UserId = l.UserId,
                LoanDate = l.LoanDate,
                ReturnDate = l.ReturnDate,
                UserFullName = l.User.FullName,
                BookTitle = l.Book.Title
            }).ToList();
        }

        public async Task<LoanDto?> GetByIdAsync(Guid id)
        {
            var loan = await _loanRepo.GetByIdAsync(id);
            if (loan == null) return null;

            return new LoanDto
            {
                Id = loan.Id,
                BookId = loan.BookId,
                UserId = loan.UserId,
                LoanDate = loan.LoanDate,
                ReturnDate = loan.ReturnDate
            };
        }


        public async Task<Guid> CreateAsync(CreateLoanDto dto)
        {
            var book = await _bookRepo.GetByIdAsync(dto.BookId);
            if (book == null) throw new Exception("Libro no encontrado");

            if (book.AvailableQuantity <= 0)
                throw new ValidationException("No hay copias disponibles");

            var user = await _userRepo.GetByIdAsync(dto.UserId);
            if (user == null) throw new Exception("Usuario no encontrado");

            var loan = new Loan
            {
                Id = Guid.NewGuid(),
                BookId = dto.BookId,
                UserId = dto.UserId,
                LoanDate = DateTime.Now,
                ReturnDate = null
            };

            book.AvailableQuantity -= 1;
            loan.LoanDate = DateTime.UtcNow;

            await _loanRepo.AddAsync(loan);
            await _bookRepo.UpdateAsync(book);

            return loan.Id;
        }


        public async Task ReturnBookAsync(Guid loanId)
        {
            var loan = await _loanRepo.GetByIdAsync(loanId);
            if (loan == null)
                throw new Exception("Prestamo no encontrado");

            if (loan.ReturnDate != null)
                throw new Exception("Este préstamo ya fue devuelto");

            var book = await _bookRepo.GetByIdAsync(loan.BookId);
            if (book == null)
                throw new Exception("Libro no encontrado");

            loan.ReturnDate = DateTime.UtcNow;
            book.AvailableQuantity += 1;

            await _loanRepo.UpdateAsync(loan);
            await _bookRepo.UpdateAsync(book);
        }
    }
}
