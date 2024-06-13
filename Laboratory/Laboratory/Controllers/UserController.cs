using BL.Services;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Laboratory.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserViewModel>> GetUser(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserViewModel>>> GetAllUsers()
        {
            var users = await _userService.GetAllUsers();
            return Ok(users);
        }

        [HttpPost]
        public async Task<ActionResult<UserModel>> PostUser(UserModel userModel)
        {
            if (userModel.Role == "")
                userModel.Role = "User";
            var user = await _userService.GetByEmail(userModel.Email);
            if (user == null) {
                if (!ModelState.IsValid)
                {
                    return BadRequest(ModelState);
                }
                await _userService.CreateUser(userModel);
                return Ok(userModel);
            }
            return BadRequest("Пользователь с такой почтой уже существует");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _userService.UpdateUser(id, userModel);
            return Ok(userModel);
        }
        [HttpPut("admin/{id}")]
        public async Task<IActionResult> PutAdminUser(int id, AdminUserModel userModel)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            await _userService.AdminUpdateUser(id, userModel);
            return Ok(userModel);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound();
            }
            await _userService.DeleteUser(id);
            return Ok();
        }
    }
}
