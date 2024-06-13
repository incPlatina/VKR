using BL.Services;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Laboratory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {
        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ReviewViewModel>> GetRecipe(int id)
        {
            var recipe = await _reviewService.GetById(id);
            if (recipe == null)
            {
                return NotFound();
            }
            return Ok(recipe);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ReviewViewModel>>> GetAllRecipes()
        {
            var recipes = await _reviewService.GetAll();
            return Ok(recipes);
        }

        [HttpPost]
        public async Task<ActionResult<Recipe>> PostRecipe(ReviewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _reviewService.Create(model);
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, ReviewModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _reviewService.Update(id, model);
            return Ok(model);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            await _reviewService.Delete(id);
            return Ok();
        }
    }
}
