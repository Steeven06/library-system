using LibrarySystem.Application.DTOs.Users;
using LibrarySystem.Domain.Entities;
using LibrarySystem.Application.Interfaces;
using LibrarySystem.Domain.Interfaces;
using LibrarySystem.Application.Exceptions;

namespace LibrarySystem.Application.Services
{
    public class UserService: IUserService
    {
        private readonly IUserRepository _repository;

        public UserService(IUserRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<UserDto>> GetAllAsync()
        {
            var users = await _repository.GetAllAsync();

            return users.Select(u => new UserDto
            {
                Id = u.Id,
                FullName = u.FullName,
                Phone=u.Phone,
                Cedula=u.Cedula,
                Address=u.Address,
                Email=u.Email
            }).ToList();
        }

        public async Task<UserDto?> GetByIdAsync(Guid id)
        {
            var user = await _repository.GetByIdAsync(id);
            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Phone=user.Phone,
                Cedula=user.Cedula,
                Address=user.Address,
               Email=user.Email
            };
        }

        public async Task<Guid> CreateAsync(CreateUserDto dto)
        {
            var exists = await _repository.ExistsByCedula(dto.Cedula);
            if (exists)
                throw new ValidationException("La cédula ya está registrada.");

            var user = new User
            {
                Id = Guid.NewGuid(),
                FullName = dto.FullName,
                Phone= dto.Phone,
                Email= dto.Email,
                Address= dto.Address,
                Cedula= dto.Cedula
            };

            await _repository.AddAsync(user);
            return user.Id;
        }

        public async Task UpdateAsync(Guid id, UpdateUserDto dto)
        {
            var user = await _repository.GetByIdAsync(id);

            if (user == null)
                throw new Exception("Usuario no encontrado");
            // ⚠️ VALIDACIÓN -> si cambia la cédula, verificar duplicado
            if (user.Cedula != dto.Cedula)
            {
                var exists = await _repository.ExistsByCedula(dto.Cedula);
                if (exists)
                    throw new ValidationException("La cédula ya está registrada.");

            }

            user.FullName = dto.FullName;
            user.Phone = dto.Phone;
            user.Email = dto.Email;
            user.Cedula=dto.Cedula;
            user.Address = dto.Address;

            await _repository.UpdateAsync(user);
        }

        public async Task DeleteAsync(Guid id)
        {
            await _repository.DeleteAsync(id);
        }
    }
}
