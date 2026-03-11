using Microsoft.AspNetCore.Mvc;
using CryptoShop.Backend.Services;
using CryptoShop.Backend.Models;
using CryptoShop.Backend.DTOs;
using MongoDB.Driver;

namespace CryptoShop.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly MongoDbService _mongoDb;

        public UsersController(MongoDbService mongoDb)
        {
            _mongoDb = mongoDb;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            var users = await _mongoDb.Users.Find(_ => true).ToListAsync();
            return Ok(users.Select(u => new UserDto
            {
                Id = u.Id,
                Email = u.Email,
                Username = u.Username,
                FirstName = u.FirstName,
                LastName = u.LastName,
                PhoneNumber = u.PhoneNumber,
                Address = u.Address,
                Role = u.Role,
                IsBlocked = u.IsBlocked
            }));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(string id)
        {
            var user = await _mongoDb.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
            if (user == null)
                return NotFound();

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                FirstName = user.FirstName,
                LastName = user.LastName,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                Role = user.Role,
                IsBlocked = user.IsBlocked
            };
        }

        [HttpPut("{id}/profile")]
        public async Task<IActionResult> UpdateProfile(string id, UpdateProfileDto profileDto)
        {
            var user = await _mongoDb.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
            if (user == null)
                return NotFound();

            if (profileDto.FirstName != null)
                user.FirstName = profileDto.FirstName;
            if (profileDto.LastName != null)
                user.LastName = profileDto.LastName;
            if (profileDto.PhoneNumber != null)
                user.PhoneNumber = profileDto.PhoneNumber;
            if (profileDto.Address != null)
                user.Address = profileDto.Address;

            await _mongoDb.Users.ReplaceOneAsync(u => u.Id == id, user);
            return NoContent();
        }

        [HttpPut("{id}/block")]
        public async Task<IActionResult> BlockUser(string id)
        {
            var user = await _mongoDb.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
            if (user == null)
                return NotFound();

            user.IsBlocked = !user.IsBlocked;
            await _mongoDb.Users.ReplaceOneAsync(u => u.Id == id, user);

            return Ok(new { isBlocked = user.IsBlocked });
        }

        [HttpPut("{id}/role")]
        public async Task<IActionResult> ChangeRole(string id, [FromBody] string role)
        {
            var user = await _mongoDb.Users.Find(u => u.Id == id).FirstOrDefaultAsync();
            if (user == null)
                return NotFound();

            user.Role = role;
            await _mongoDb.Users.ReplaceOneAsync(u => u.Id == id, user);

            return NoContent();
        }
    }
}