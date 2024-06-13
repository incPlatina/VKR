using BL.Services;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Options;

namespace Laboratory.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DemonstrationController : ControllerBase
    {
        private readonly IElementService _elementService;
        private readonly IFormuleService _formuleService;

        public DemonstrationController(IElementService elementService, IFormuleService formuleService)
        {
            _elementService = elementService;
            _formuleService = formuleService;
        }
              

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Element>>> GetAllElements()
        {
            var elements = await _elementService.GetAllElements();
            return Ok(elements);
        }

        [HttpPost]
        public async Task<ActionResult<ReactionViewModel>> Check(ReactionCheckModel model)
        {
            var formules = await _formuleService.GetAllElements();

            
            bool reactionResult = false;
            int i;
            for (i = 0; i < formules.Count(); i++)
            {
                if ((model.Symbol1 == formules[i].Element1 && model.Symbol2 == formules[i].Element2) || (model.Symbol1 == formules[i].Element2 && model.Symbol2 == formules[i].Element1))
                    reactionResult = true;
                else
                    reactionResult = false;
                if (reactionResult)
                    break;
            }
            ReactionViewModel viewModel = new ReactionViewModel();
            viewModel.result= reactionResult;
            if (reactionResult)
                viewModel.formule = formules[i];
            return Ok(viewModel);
        }      

    }
}
