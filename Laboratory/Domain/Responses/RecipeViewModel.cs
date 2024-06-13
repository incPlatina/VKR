using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Responses
{
    public class RecipeViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CategoryId { get; set; }
        public DateTime CreatedDate { get; set; }
        public int user_id { get; set; }
        public string proportion { get; set; }
        public string privacy { get; set; }
        public List<IngredientViewModel> Ingredients { get; set; }
        public List<ReviewViewModel> Reviews { get; set; }
    }
}
