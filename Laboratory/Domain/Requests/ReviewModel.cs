using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Requests
{
    public class ReviewModel
    {
        public int RecipeId { get; set; }
        public string Text { get; set; }
        public int Rating { get; set; }
        public int User_Id { get; set; }
    }
}
