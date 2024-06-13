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
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IHashService _hashService;

        public UserService(IUserRepository userRepository, IHashService hashService)
        {
            _userRepository = userRepository;
            _hashService = hashService;
        }

        public async Task<UserViewModel> GetUserById(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);

            UserViewModel viewModel = new UserViewModel
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                Role = user.Role
            };

            return viewModel;
        }

        public async Task<List<UserViewModel>> GetAllUsers()
        {
            var users = await _userRepository.GetAllAsync();

            return users.Select(u => new UserViewModel
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email,
                Role = u.Role
            }).ToList();
        }

        public async Task CreateUser(UserModel userModel)
        {
            User user = new User
            {
                Email = userModel.Email,
                Name = userModel.Name,
                Role = userModel.Role,
                PasswordSalt = _hashService.GenerateRandomSalt()
            };
            user.PasswordHash = _hashService.CalculateSHA256(userModel.Password + user.PasswordSalt);
            await _userRepository.AddAsync(user);
            
        }

        public async Task UpdateUser(int id, UserModel userModel)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return;
            user.Name = userModel.Name;
            user.Email = userModel.Email;
            user.Role = userModel.Role;
            user.PasswordHash = _hashService.CalculateSHA256(userModel.Password + user.PasswordSalt);
            await _userRepository.UpdateAsync(user);
        }
        public async Task AdminUpdateUser(int id, AdminUserModel userModel)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return;
            user.Name = userModel.Name;
            user.Email = userModel.Email;
            user.Role = userModel.Role;
            await _userRepository.UpdateAsync(user);
        }

        public async Task DeleteUser(int id)
        {
            var user = await _userRepository.GetByIdAsync(id);
            if (user == null) return;

            await _userRepository.DeleteAsync(user);
        }

        public async Task<User> GetByEmail(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            return user;
        }
    }
    public interface IUserService
    {
        Task<UserViewModel> GetUserById(int id);
        Task<List<UserViewModel>> GetAllUsers();
        Task CreateUser(UserModel userModel);
        Task UpdateUser(int id, UserModel userModel);
        Task AdminUpdateUser(int id, AdminUserModel userModel);
        Task DeleteUser(int id);
        Task<User> GetByEmail(string email);
    }
}
