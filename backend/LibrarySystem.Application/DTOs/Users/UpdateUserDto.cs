using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text;

namespace LibrarySystem.Application.DTOs.Users
{
    public class UpdateUserDto
    {
        [Required]
        [MinLength(3)]
        public string FullName { get; set; }

        [Required]
        [StringLength(10, MinimumLength = 10)]
        public string Cedula { get; set; }

        [Required]
        [Phone]
        public string Phone { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        [MinLength(5)]
        public string Address { get; set; }
    }
}
