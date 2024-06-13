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
    public class CategoryService : ICategoryService
    {
        private readonly IBaseRepository<Category> _CategoryRepository;

        public CategoryService(IBaseRepository<Category> CategoryRepository)
        {
            _CategoryRepository = CategoryRepository;
        }

        public async Task<CategoryViewModel> GetById(int id)
        {
            var Category = await _CategoryRepository.GetByIdAsync(id);

            CategoryViewModel viewModel = new CategoryViewModel
            {
                id = Category.id,
                category = Category.category
            };

            return viewModel;
        }

        public async Task<List<CategoryViewModel>> GetAll()
        {
            var Categorys = await _CategoryRepository.GetAllAsync();

            return Categorys.Select(r => new CategoryViewModel
            {
                id = r.id,
                category = r.category
            }).ToList();
        }

        public async Task Create(CategoryModel model)
        {
            Category Category = new Category
            {
                category = model.category
            };
            await _CategoryRepository.AddAsync(Category);




        }

        public async Task Update(int id, CategoryModel model)
        {
            var Category = await _CategoryRepository.GetByIdAsync(id);
            if (Category == null) return;
            Category.category = model.category;

            await _CategoryRepository.UpdateAsync(Category);

        }

        public async Task Delete(int id)
        {
            var recipe = await _CategoryRepository.GetByIdAsync(id);
            if (recipe == null) return;

            await _CategoryRepository.DeleteAsync(recipe);
        }

    }
    public interface ICategoryService
    {
        Task<CategoryViewModel> GetById(int id);
        Task<List<CategoryViewModel>> GetAll();
        Task Create(CategoryModel model);
        Task Update(int id, CategoryModel model);
        Task Delete(int id);
    }
}

