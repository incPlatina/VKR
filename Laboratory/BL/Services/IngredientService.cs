using Data.Repositories;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace BL.Services
{
    public class IngredientService : IIngredientService
    {
        private readonly IBaseRepository<Ingredient> _ingredientRepository;

        public IngredientService(IBaseRepository<Ingredient> ingredientRepository)
        {
            _ingredientRepository = ingredientRepository;
        }

        public async Task<IngredientViewModel> GetById(int id)
        {
            var review = await _ingredientRepository.GetByIdAsync(id);

            IngredientViewModel viewModel = new IngredientViewModel
            {
                Id = review.Id,
                Name = review.Name,
                Description = review.Description,
                Formula = review.Formula,
                UnitOfMeasurement = review.UnitOfMeasurement
            };

            return viewModel;
        }

        public async Task<List<IngredientViewModel>> GetAll()
        {
            var reviews = await _ingredientRepository.GetAllAsync();

            return reviews.Select(r => new IngredientViewModel
            {
                Id = r.Id,
                Name = r.Name,
                Description = r.Description,
                Formula = r.Formula,
                UnitOfMeasurement = r.UnitOfMeasurement
            }).ToList();
        }

        public async Task Create(IngredientModel model)
        {
            Ingredient review = new Ingredient
            {
                Name = model.Name,
                Description = model.Description,
                Formula = model.Formula,
                UnitOfMeasurement = model.UnitOfMeasurement
            };
            await _ingredientRepository.AddAsync(review);




        }

        public async Task Update(int id, IngredientModel model)
        {
            var review = await _ingredientRepository.GetByIdAsync(id);
            if (review == null) return;
            review.Name = model.Name;
            review.Description = model.Description;
            review.Formula = model.Formula;
            review.UnitOfMeasurement = model.UnitOfMeasurement;

            await _ingredientRepository.UpdateAsync(review);

        }

        public async Task Delete(int id)
        {
            var recipe = await _ingredientRepository.GetByIdAsync(id);
            if (recipe == null) return;

            await _ingredientRepository.DeleteAsync(recipe);
        }

    }
    public interface IIngredientService
    {
        Task<IngredientViewModel> GetById(int id);
        Task<List<IngredientViewModel>> GetAll();
        Task Create(IngredientModel model);
        Task Update(int id, IngredientModel model);
        Task Delete(int id);
    }
}

