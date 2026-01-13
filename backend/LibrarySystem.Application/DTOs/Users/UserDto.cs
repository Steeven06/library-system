using System;
using System.Collections.Generic;
using System.Text;

namespace LibrarySystem.Application.DTOs.Users
{
    public class UserDto
    {
        public Guid Id { get; set; }
        public string FullName { get; set; }    
        public string Phone { get; set; }

        public string Email { get; set; }
        public string Address { get; set; } 
        public string  Cedula { get; set; }
    }
}
