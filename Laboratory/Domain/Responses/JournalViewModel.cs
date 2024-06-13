using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Responses
{
    public class JournalViewModel
    {
        public int Id { get; set; }
        public int User_Id { get; set; }
        public int Recipe_Id { get; set; }
    }
}
