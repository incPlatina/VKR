using BL.Services;
using Domain.Entities;
using Domain.Requests;
using Domain.Responses;
using Laboratory.Controllers;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace LaboratoryTests
{
    public class AuthControllerTests
    {
        [Fact]
        public async Task Auth_ReturnsOkResult_WhenValidCredentials()
        {
            // Arrange
            var email = "john@example.com";
            var password = "correctpassword";
            var user = new User { Id = 1, Name = "John", Email = email, Role = "User", PasswordHash="Hash", PasswordSalt="2323" };
            var authModel = new AuthModel { Email = email, Password = password };

            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(repo => repo.GetByEmail(email)).ReturnsAsync(user);

            var hashServiceMock = new Mock<IHashService>();
            hashServiceMock.Setup(hashService => hashService.CalculateSHA256(password + user.PasswordSalt))
                .Returns(user.PasswordHash);

            var tokenServiceMock = new Mock<ITokenService>();
            var userClaims = new List<Claim> { new Claim(ClaimTypes.Name, user.Name) };
            tokenServiceMock.Setup(tokenService => tokenService.GetAuthClaims(user)).Returns(userClaims);
            tokenServiceMock.Setup(tokenService => tokenService.GenerateToken(userClaims, TimeSpan.FromHours(1)))
                .Returns("fakeAccessToken");

            var controller = new AuthController(tokenServiceMock.Object, userServiceMock.Object, hashServiceMock.Object);

            // Act
            var result = await controller.Auth(authModel);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var authViewModel = Assert.IsType<AuthViewModel>(okResult.Value);
            Assert.Equal("fakeAccessToken", authViewModel.AccessToken);
        }

        [Fact]
        public async Task Auth_ReturnsNotFound_WhenUserDoesNotExist()
        {
            // Arrange
            var email = "nonexistent@example.com";
            var authModel = new AuthModel { Email = email, Password = "password" };

            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(repo => repo.GetByEmail(email))
                .ReturnsAsync((User)null); // Явно указываем, что возвращаемое значение - это Task<UserViewModel>

            var tokenServiceMock = new Mock<ITokenService>();
            var controller = new AuthController(tokenServiceMock.Object, userServiceMock.Object, new HashService());

            // Act
            var result = await controller.Auth(authModel);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        [Fact]
        public async Task Auth_ReturnsBadRequest_WhenWrongPassword()
        {
            var email = "john@example.com";
            var wrongPassword = "wrongpassword";
            var user = new User { Id = 1, Name = "John", Email = email, Role = "User", PasswordHash="hash" };
            var authModel = new AuthModel { Email = email, Password = wrongPassword };

            var userServiceMock = new Mock<IUserService>();
            userServiceMock.Setup(repo => repo.GetByEmail(email)).ReturnsAsync(user);

            var hashServiceMock = new Mock<IHashService>();
            hashServiceMock.Setup(hashService => hashService.CalculateSHA256(It.IsAny<string>()))
                .Returns("fakehash"); // Фиктивное значение хэша для неправильного пароля
            var tokenServiceMock = new Mock<ITokenService>();
            var controller = new AuthController(tokenServiceMock.Object, userServiceMock.Object, hashServiceMock.Object);

            // Act
            var result = await controller.Auth(authModel);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
        }
    }
}
