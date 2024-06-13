using Domain.Entities;
using Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories
{
    public class RecipeRepository: BaseRepository<Recipe>, IRecipeRepository
    {
        private readonly LaboratoryContext _context;

        public RecipeRepository(LaboratoryContext context) : base(context)
        {
            _context = context;
        }
        
        public override async Task<Recipe> GetByIdAsync(int id)
        {
            return await _context.Recipes.AsNoTracking()
            .Include(u => u.Ingredients)
            .Include(u => u.Reviews)
            .SingleOrDefaultAsync(u => u.Id == id);
        }

        public override async Task<List<Recipe>> GetAllAsync()
        {
            var users = await _context.Recipes.AsNoTracking()
            .Include(u => u.Ingredients)
            .Include(u => u.Reviews)
            .ToListAsync();
            return users;
        }
        
    }
    public interface IRecipeRepository : IBaseRepository<Recipe>
    {
        Task<List<Recipe>> GetAllAsync();
        Task<Recipe> GetByIdAsync(int id);
    }
}

