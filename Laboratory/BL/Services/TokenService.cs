using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Threading.Tasks;
using Domain.Entities;

namespace BL.Services
{
    public class TokenService : ITokenService
    {
        public string GenerateToken(IEnumerable<Claim> claims, TimeSpan lifetime)
        {
            var now = DateTime.UtcNow;
            var jwt = new JwtSecurityToken(
                issuer: "laboratory",
                audience: "laboratory",
                notBefore: now,
                claims: claims,
                expires: now.Add(lifetime),
                signingCredentials: new SigningCredentials(GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256)
                );
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
            return encodedJwt;
        }
        public SymmetricSecurityKey GetSymmetricSecurityKey()
        {
            return new SymmetricSecurityKey(Encoding.UTF8.GetBytes("mysupersecret_secretkey!123111111"));
        }
        public IEnumerable<Claim> GetAuthClaims(User user)
        {
            yield return new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString());
            yield return new Claim(JwtRegisteredClaimNames.Email, user.Email);
            yield return new Claim(JwtRegisteredClaimNames.Name, user.Name);
            yield return new Claim(JwtRegisteredClaimNames.GivenName, user.Role);
        }
    }
    public interface ITokenService
    {
        public string GenerateToken(IEnumerable<Claim> claims, TimeSpan lifetime);
        public SymmetricSecurityKey GetSymmetricSecurityKey();
        public IEnumerable<Claim> GetAuthClaims(User user);

    }
}
