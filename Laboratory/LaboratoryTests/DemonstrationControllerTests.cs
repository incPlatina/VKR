using BL.Services;
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
    public class DemonstrationControllerTests
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
    }
}
