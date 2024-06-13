using BL.Services;
using Domain.Requests;
using Domain.Responses;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System.Security.Claims;

namespace Laboratory.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ITokenService _tokenService;
        private readonly IHashService _hashService;
        private readonly IUserService _userService;

        public AuthController(ITokenService tokenService, IUserService userService, IHashService hashService)
        {
            _tokenService = tokenService;
            _userService = userService;
            _hashService = hashService;
        }

        [HttpPost("token")]
        public async Task<IActionResult> Auth(AuthModel model)
        {
            var user = await _userService.GetByEmail(model.Email);
            if (user == null)
            {
                return NotFound("User not found");
            }
            if (user.PasswordHash != _hashService.CalculateSHA256(model.Password + user.PasswordSalt))
            {
                return BadRequest("Wrong password");
            }
            var userClaims = _tokenService.GetAuthClaims(user);
            

            var token = _tokenService.GenerateToken(userClaims, TimeSpan.FromHours(1));

            var Token = new AuthViewModel { AccessToken = token };
            return Ok(Token);
        }
    }
}
