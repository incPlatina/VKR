using Domain;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Data.Repositories
{
    public class UserRepository : BaseRepository<User>, IUserRepository
    {
        private readonly LaboratoryContext _context;

        public UserRepository(LaboratoryContext context) : base(context)
        {
            _context = context;
        }
        
        public async Task<User> GetByEmailAsync(string email)
        {
            return await _context.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Email == email);
        }
    }
    public interface IUserRepository : IBaseRepository<User>
    {
        
        Task<User> GetByEmailAsync(string email);
    }
}
