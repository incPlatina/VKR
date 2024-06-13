using BL.Services;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Laboratory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IngredientController : ControllerBase
    {
        private readonly IIngredientService _IngredientService;

        public IngredientController(IIngredientService IngredientService)
        {
            _IngredientService = IngredientService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IngredientViewModel>> GetIngredient(int id)
        {
            var Ingredient = await _IngredientService.GetById(id);
            if (Ingredient == null)
            {
                return NotFound();
            }
            return Ok(Ingredient);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<IngredientViewModel>>> GetAllIngredients()
        {
            var Ingredients = await _IngredientService.GetAll();
            return Ok(Ingredients);
        }

        [HttpPost]
        public async Task<ActionResult<Ingredient>> PostIngredient(IngredientModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _IngredientService.Create(model);
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutIngredient(int id, IngredientModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _IngredientService.Update(id, model);
            return Ok(model);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteIngredient(int id)
        {
            await _IngredientService.Delete(id);
            return Ok();
        }
    }
}
