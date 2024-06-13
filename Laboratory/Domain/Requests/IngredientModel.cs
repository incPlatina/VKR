using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Requests
{
    public class IngredientModel
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Formula { get; set; }
        public string UnitOfMeasurement { get; set; }
    }
}
