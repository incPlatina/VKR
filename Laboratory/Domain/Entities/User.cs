using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string PasswordHash { get; set; }
        public string PasswordSalt { get; set; }
        public string Role { get; set; }
        public string Name { get; set; }
        public ICollection<Recipe> Recipes { get; set; }
        public ICollection<Review> Reviews { get; set; }
        public ICollection<Journal> Journal { get; set; }
    }
}
