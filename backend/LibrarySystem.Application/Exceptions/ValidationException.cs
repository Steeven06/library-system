using System;
using System.Collections.Generic;
using System.Text;
namespace LibrarySystem.Application.Exceptions
{
    public class ValidationException : Exception
    {
        public ValidationException(string message) : base(message)
        {
        }
    }
}

