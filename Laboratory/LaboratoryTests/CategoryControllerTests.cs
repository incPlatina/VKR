using BL.Services;
using Domain.Requests;
using Domain.Responses;
using Laboratory.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LaboratoryTests
{
    public class CategoryControllerTests
    {
        [Fact]
        public async Task GetUser_ReturnsOkResult_WhenUserExists()
        {
            // Arrange
            var userId = 1;
            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(repo => repo.GetUserById(userId))
                .ReturnsAsync(new UserViewModel { Id = userId, Name = "John", Email = "john@example.com", Role = "User" });
            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = await controller.GetUser(userId);

            // Assert
            var actionResult = Assert.IsType<ActionResult<UserViewModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var userViewModel = Assert.IsType<UserViewModel>(okResult.Value);
            Assert.Equal(userId, userViewModel.Id);
        }

        [Fact]
        public async Task GetUser_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = 999; // Несуществующий ID пользователя
            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(repo => repo.GetUserById(userId))
                .ReturnsAsync((UserViewModel)null); // Явно указываем, что возвращаемое значение - это Task<UserViewModel>
            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = await controller.GetUser(userId);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }
        [Fact]
        public async Task GetAllUsers_ReturnsOkResult_WithListOfUsers()
        {
            // Arrange
            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(repo => repo.GetAllUsers())
                .ReturnsAsync(new List<UserViewModel>
                {
            new UserViewModel { Id = 1, Name = "John", Email = "john@example.com", Role = "User" },
            new UserViewModel { Id = 2, Name = "Alice", Email = "alice@example.com", Role = "Admin" }
                });
            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = await controller.GetAllUsers();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<UserViewModel>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var users = Assert.IsAssignableFrom<IEnumerable<UserViewModel>>(okResult.Value);
            Assert.Equal(2, users.Count());
        }
        [Fact]
        public async Task PostUser_ReturnsOkResult_WhenUserIsValid()
        {
            // Arrange
            var userModel = new UserModel { Name = "NewUser", Email = "newuser@example.com", Role = "User", Password = "password" };
            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(repo => repo.CreateUser(userModel)).Verifiable();
            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = await controller.PostUser(userModel);

            // Assert
            var actionResult = Assert.IsType<ActionResult<UserModel>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var createdUser = Assert.IsType<UserModel>(okResult.Value);
            Assert.Equal(userModel.Name, createdUser.Name);
            userServiceMock.Verify(repo => repo.CreateUser(userModel), Times.Once);
        }

        [Fact]
        public async Task DeleteUser_ReturnsOkResult_WhenUserExists()
        {
            // Arrange
            var userId = 1;
            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(repo => repo.GetUserById(userId))
                .ReturnsAsync(new UserViewModel { Id = userId, Name = "John", Email = "john@example.com", Role = "User" });
            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = await controller.DeleteUser(userId);

            // Assert
            Assert.IsType<OkResult>(result);
            userServiceMock.Verify(repo => repo.DeleteUser(userId), Times.Once);
        }

        [Fact]
        public async Task DeleteUser_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = 999; // Non-existent user ID
            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(repo => repo.GetUserById(userId))
                .ReturnsAsync((UserViewModel)null); // Явно указываем, что возвращаемое значение - это Task<UserViewModel>
            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = await controller.DeleteUser(userId);

            // Assert
            Assert.IsType<NotFoundResult>(result);
        }
        [Fact]
        public async Task PutUser_ReturnsOkResult_WhenUserExists()
        {
            // Arrange
            var userId = 1;
            var updatedUserModel = new UserModel { Name = "UpdatedName", Email = "updated@example.com", Role = "Admin", Password = "newpassword" };
            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(repo => repo.GetUserById(userId))
                .ReturnsAsync(new UserViewModel { Id = userId, Name = "John", Email = "john@example.com", Role = "User" });
            var controller = new UserController(userServiceMock.Object);

            // Act
            var result = await controller.PutUser(userId, updatedUserModel);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var updatedUser = Assert.IsType<UserModel>(okResult.Value);
            Assert.Equal(updatedUserModel.Name, updatedUser.Name);
            userServiceMock.Verify(repo => repo.UpdateUser(userId, updatedUserModel), Times.Once);
        }
    }
}

