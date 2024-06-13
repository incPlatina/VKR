using Data.Repositories;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BL.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly IRecipeRepository _recipeRepository;
        private readonly IBaseRepository<Ingredient> _ingredientRepository;
        private readonly IBaseRepository<Review> _reviewRepository;
        private readonly IIngredientService _ingredientService;

        public RecipeService(IRecipeRepository recipeRepository, IBaseRepository<Ingredient> ingredientRepository, IIngredientService ingredientService, IBaseRepository<Review> reviewRepository)
        {
            _recipeRepository = recipeRepository;
            _ingredientRepository = ingredientRepository;
            _ingredientService = ingredientService;
            _reviewRepository = reviewRepository;
        }

        public async Task<RecipeViewModel> GetById(int id)
        {
            var recipe = await _recipeRepository.GetByIdAsync(id);

            RecipeViewModel viewModel = new RecipeViewModel
            {
                Id = recipe.Id,
                Name = recipe.Name,
                Description = recipe.Description,
                CategoryId = recipe.CategoryId  ,
                CreatedDate = recipe.CreatedDate,
                user_id = recipe.user_id,
                proportion=recipe.proportion,
                privacy=recipe.privacy,
                Ingredients = recipe.Ingredients.Select(i => new IngredientViewModel
                {
                    Id = i.Id,
                    Name = i.Name,
                    Description = i.Description,
                    Formula = i.Formula,
                    UnitOfMeasurement = i.UnitOfMeasurement
                }).ToList(),
                Reviews = recipe.Reviews.Select(r => new ReviewViewModel 
                {
                    Id = r.Id,
                    RecipeId= r.Recipe_Id,
                    Text = r.Text,
                    Rating = r.Rating,
                    User_Id = r.User_Id
                }).ToList()
            };

            return viewModel;
        }

        public async Task<List<RecipeViewModel>> GetAll()
        {
            var recipes = await _recipeRepository.GetAllAsync();

            return recipes.Select(r => new RecipeViewModel
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                CategoryId = r.CategoryId,
                CreatedDate = r.CreatedDate,
                user_id = r.user_id,
                proportion=r.proportion,
                privacy=r.privacy,
                Ingredients = r.Ingredients.Select(i => new IngredientViewModel
                {
                    Id = i.Id,
                    Name = i.Name,
                    Description = i.Description,
                    Formula = i.Formula,
                    UnitOfMeasurement = i.UnitOfMeasurement
                }).ToList(),
                Reviews = r.Reviews.Select(r => new ReviewViewModel
                {
                    Id = r.Id,
                    RecipeId = r.Recipe_Id,
                    Text = r.Text,
                    Rating = r.Rating,
                    User_Id = r.User_Id
                }).ToList()
            }).ToList();
        }

        public async Task Create(RecipeModel model)
        {
            Recipe recipe = new Recipe
            {
                Name = model.Name,
                Description = model.Description,
                CategoryId = model.CategoryId,
                CreatedDate = model.CreatedDate,
                proportion = model.proportion,
                user_id = model.user_id,
                privacy = model.privacy
            };
            await _recipeRepository.AddAsync(recipe);

            var recipes = await _recipeRepository.GetAllAsync();

            foreach (var ingredient in model.Ingredients)
            {
                await _ingredientRepository.AddAsync(new Ingredient 
                { 
                    Name = ingredient.Name, 
                    Description = ingredient.Description,
                    Formula = ingredient.Formula,
                    UnitOfMeasurement = ingredient.UnitOfMeasurement,
                    recipeId=recipes.Last().Id
                });
            }
            

        }

        public async Task Update(int id, RecipeModel model)
        {
            var recipe = await _recipeRepository.GetByIdAsync(id);
            if (recipe == null) return;
            recipe.Name = model.Name;
            recipe.Description = model.Description;
            recipe.CategoryId = model.CategoryId;
            recipe.proportion = model.proportion;
            //recipe.CreatedDate = model.CreatedDate;
            recipe.user_id = model.user_id;
            recipe.privacy = model.privacy;
            

            await _recipeRepository.UpdateAsync(recipe);

            // Удаление существующих 
            var existingIngredients = recipe.Ingredients.ToList();
            foreach (var existingIngredient in existingIngredients)
            {
                await _ingredientRepository.DeleteAsync(existingIngredient);
            }

            // Добавление новых 
            foreach (var ingredient in model.Ingredients)
            {
                await _ingredientRepository.AddAsync(new Ingredient 
                {
                    Name = ingredient.Name,
                    Description = ingredient.Description,
                    Formula = ingredient.Formula,
                    UnitOfMeasurement = ingredient.UnitOfMeasurement,
                    recipeId = id
                });
            }
        }

        public async Task Delete(int id)
        {
            var recipe = await _recipeRepository.GetByIdAsync(id);
            if (recipe == null) return;
            var existingIngredients = recipe.Ingredients.ToList();
            foreach (var existingIngredient in existingIngredients)
            {
                await _ingredientRepository.DeleteAsync(existingIngredient);
            }
            var existingReviews = recipe.Reviews.ToList();
            foreach (var existingReview in existingReviews)
            {
                await _reviewRepository.DeleteAsync(existingReview);
            }
            await _recipeRepository.DeleteAsync(recipe);
        }
                
    }
    public interface IRecipeService 
    {
        Task<RecipeViewModel> GetById(int id);
        Task<List<RecipeViewModel>> GetAll();
        Task Create(RecipeModel model);
        Task Update(int id, RecipeModel model);
        Task Delete(int id);
    }
}
