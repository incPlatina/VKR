﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Requests
{
    public class AdminUserModel
    {
        public string Email { get; set; }
        public string Name { get; set; }
        public string Role { get; set; }
    }
}
