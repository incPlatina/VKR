using BL.Services;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Laboratory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JournalController : ControllerBase
    {
        private readonly IJournalService _JournalService;

        public JournalController(IJournalService JournalService)
        {
            _JournalService = JournalService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<JournalViewModel>> GetRecipe(int id)
        {
            var recipe = await _JournalService.GetById(id);
            if (recipe == null)
            {
                return NotFound();
            }
            return Ok(recipe);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<JournalViewModel>>> GetAllRecipes()
        {
            var recipes = await _JournalService.GetAll();
            return Ok(recipes);
        }

        [HttpPost]
        public async Task<ActionResult<Recipe>> PostRecipe(JournalModel model)
        {
            var journals = await _JournalService.GetByUserId(model.User_Id);
            foreach (var journal in journals)
            {
                if (journal.Recipe_Id == model.Recipe_Id)
                    return BadRequest(ModelState);
            }
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _JournalService.Create(model);
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutRecipe(int id, JournalModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _JournalService.Update(id, model);
            return Ok(model);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRecipe(int id)
        {
            await _JournalService.Delete(id);
            return Ok();
        }
    }
}
