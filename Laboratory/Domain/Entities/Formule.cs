using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class Formule
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string FormuleText { get; set; }
        public string Element1 { get; set; }
        public string Element2 { get; set; }
        public string Description { get; set; }
    }
}
