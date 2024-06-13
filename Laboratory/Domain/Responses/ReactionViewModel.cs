using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Responses
{
    public class ReactionViewModel
    {
        public bool result {  get; set; }
        public Formule formule { get; set; }
    }
}
