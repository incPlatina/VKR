using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace BL.Services
{
    public class HashService : IHashService
    {
        public string CalculateSHA256(string str)
        {
            SHA256 sha256 = SHA256.Create();
            UTF8Encoding objUtf8 = new UTF8Encoding();
            byte[] hashValue = sha256.ComputeHash(objUtf8.GetBytes(str));

            return BitConverter.ToString(hashValue).Replace("-", "").ToLower();
        }
        public string GenerateRandomSalt()
        {
            byte[] randomBytes = new byte[16];
            using (var rng = new RNGCryptoServiceProvider())
            {
                rng.GetBytes(randomBytes);
            }
            return Convert.ToBase64String(randomBytes);
        }
    }
    public interface IHashService
    {
        public string GenerateRandomSalt();
        string CalculateSHA256(string input);
    }
}
