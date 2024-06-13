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
    public class ReviewService : IReviewService
    {
        private readonly IBaseRepository<Review> _reviewRepository;

        public ReviewService(IBaseRepository<Review> reviewRepository)
        {
            _reviewRepository = reviewRepository;
        }

        public async Task<ReviewViewModel> GetById(int id)
        {
            var review = await _reviewRepository.GetByIdAsync(id);

            ReviewViewModel viewModel = new ReviewViewModel
            {
                Id = review.Id,
                RecipeId = review.Recipe_Id,
                Text = review.Text,
                Rating = review.Rating,
                User_Id = review.User_Id
            };

            return viewModel;
        }

        public async Task<List<ReviewViewModel>> GetAll()
        {
            var reviews = await _reviewRepository.GetAllAsync();

            return reviews.Select(r => new ReviewViewModel
            {
                Id = r.Id,
                RecipeId = r.Recipe_Id,
                Text = r.Text,
                Rating = r.Rating,
                User_Id = r.User_Id                
            }).ToList();
        }

        public async Task Create(ReviewModel model)
        {
            Review review = new Review
            {
                Recipe_Id = model.RecipeId,
                Text = model.Text,
                Rating = model.Rating,
                User_Id = model.User_Id
            };
            await _reviewRepository.AddAsync(review);

            


        }

        public async Task Update(int id, ReviewModel model)
        {
            var review = await _reviewRepository.GetByIdAsync(id);
            if (review == null) return;
            review.Recipe_Id = model.RecipeId;
            review.Text = model.Text;
            review.Rating = model.Rating;
            review.User_Id = model.User_Id;

            await _reviewRepository.UpdateAsync(review);
           
        }

        public async Task Delete(int id)
        {
            var recipe = await _reviewRepository.GetByIdAsync(id);
            if (recipe == null) return;

            await _reviewRepository.DeleteAsync(recipe);
        }

    }
    public interface IReviewService
    {
        Task<ReviewViewModel> GetById(int id);
        Task<List<ReviewViewModel>> GetAll();
        Task Create(ReviewModel model);
        Task Update(int id, ReviewModel model);
        Task Delete(int id);
    }
}

