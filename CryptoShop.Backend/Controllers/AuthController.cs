using CryptoShop.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using CryptoShop.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace CryptoShop.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AuthController(AppDbContext db)
        {
            _db = db;
        }

        // POST: api/auth/register
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterData data)
        {
            var existingUser = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == data.Email);

            if (existingUser != null)
            {
                return BadRequest("Этот email уже зарегистрирован");
            }

            var user = new User
            {
                Email = data.Email,
                Password = data.Password,
                Name = data.Name,
                Phone = data.Phone,
                Address = data.Address
            };

            _db.Users.Add(user);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Name,
                user.Phone,
                user.Address,
                user.Role,
                user.IsBlocked
            });
        }

        // POST: api/auth/login
        [HttpPost("login")]
        public async Task<ActionResult> Login(LoginData data)
        {
            var user = await _db.Users
                .FirstOrDefaultAsync(u => u.Email == data.Email && u.Password == data.Password);

            if (user == null)
            {
                return Unauthorized("Неверный email или пароль");
            }

            if (user.IsBlocked)
            {
                return Unauthorized("Пользователь заблокирован");
            }

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Name,
                user.Phone,
                user.Address,
                user.Role,
                user.IsBlocked
            });
        }

        // PUT: api/auth/profile/{id}
        [HttpPut("profile/{id}")]
        public async Task<ActionResult> UpdateProfile(int id, UpdateData data)
        {
            var user = await _db.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound("Пользователь не найден");
            }

            if (!string.IsNullOrEmpty(data.Name))
                user.Name = data.Name;

            if (!string.IsNullOrEmpty(data.Phone))
                user.Phone = data.Phone;

            if (!string.IsNullOrEmpty(data.Address))
                user.Address = data.Address;

            if (!string.IsNullOrEmpty(data.NewPassword))
                user.Password = data.NewPassword;

            await _db.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.Email,
                user.Name,
                user.Phone,
                user.Address,
                user.Role,
                user.IsBlocked
            });
        }
    }

    public class RegisterData
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
    }

    public class LoginData
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class UpdateData
    {
        public string? Name { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }
        public string? NewPassword { get; set; }
    }
}
