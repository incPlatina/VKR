using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public int Recipe_Id { get; set; }
        public string Text { get; set; }
        public int Rating { get; set; }
        public int User_Id { get; set; }
        public Recipe Recipe { get; set; }
        public User User { get; set; }
    }
}
