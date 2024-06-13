using BL.Services;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Laboratory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RecipeController : ControllerBase
    {
        private readonly IRecipeService _recipeService;

        public RecipeController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecipeViewModel>> GetRecipe(int id)
        {
            var recipe = await _recipeService.GetById(id);
            if (recipe == null)
            {
                return NotFound();
            }
            return Ok(recipe);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<RecipeViewModel>>> GetAllRecipes()
        {
            var recipes = await _recipeService.GetAll();
            return Ok(recipes);
        }

        [HttpPost]
        public async Task<ActionResult<Recipe>> PostRecipe(RecipeModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _recipeService.Create(model);
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, RecipeModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _recipeService.Update(id, model);
            return Ok(model);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            await _recipeService.Delete(id);
            return Ok();
        }
    }
}
