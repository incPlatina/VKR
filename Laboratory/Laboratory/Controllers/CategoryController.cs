using BL.Services;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using Microsoft.AspNetCore.Mvc;

namespace Laboratory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly ICategoryService _CategoryService;

        public CategoryController(ICategoryService CategoryService)
        {
            _CategoryService = CategoryService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryViewModel>> GetCategory(int id)
        {
            var Category = await _CategoryService.GetById(id);
            if (Category == null)
            {
                return NotFound();
            }
            return Ok(Category);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryViewModel>>> GetAllCategorys()
        {
            var Categorys = await _CategoryService.GetAll();
            return Ok(Categorys);
        }

        [HttpPost]
        public async Task<ActionResult<Category>> PostCategory(CategoryModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _CategoryService.Create(model);
            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutCategory(int id, CategoryModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _CategoryService.Update(id, model);
            return Ok(model);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            await _CategoryService.Delete(id);
            return Ok();
        }
    }
}
