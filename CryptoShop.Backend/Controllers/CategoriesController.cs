using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using CryptoShop.Backend.Services;
using CryptoShop.Backend.Models;
using CryptoShop.Backend.DTOs;
using MongoDB.Driver;

namespace CryptoShop.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly MongoDbService _mongoDb;

        public CategoriesController(MongoDbService mongoDb)
        {
            _mongoDb = mongoDb;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
        {
            var categories = await _mongoDb.Categories.Find(_ => true).ToListAsync();
            
            var categoryDtos = new List<CategoryDto>();
            foreach (var category in categories)
            {
                var productCount = await _mongoDb.Products.CountDocumentsAsync(p => p.Category == category.Name);
                
                categoryDtos.Add(new CategoryDto
                {
                    Id = category.Id,
                    Name = category.Name,
                    Description = category.Description,
                    ProductCount = (int)productCount
                });
            }
            
            return Ok(categoryDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryDto>> GetCategory(string id)
        {
            var category = await _mongoDb.Categories.Find(c => c.Id == id).FirstOrDefaultAsync();
            if (category == null)
                return NotFound();

            var productCount = await _mongoDb.Products.CountDocumentsAsync(p => p.Category == category.Name);

            return Ok(new CategoryDto
            {
                Id = category.Id,
                Name = category.Name,
                Description = category.Description,
                ProductCount = (int)productCount
            });
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Category>> CreateCategory(CreateCategoryDto createDto)
        {
            var existingCategory = await _mongoDb.Categories
                .Find(c => c.Name.ToLower() == createDto.Name.ToLower())
                .FirstOrDefaultAsync();

            if (existingCategory != null)
                return BadRequest("Category with this name already exists");

            var category = new Category
            {
                Name = createDto.Name,
                Description = createDto.Description ?? ""
            };

            await _mongoDb.Categories.InsertOneAsync(category);

            return CreatedAtAction(nameof(GetCategory), new { id = category.Id }, category);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory(string id, CreateCategoryDto updateDto)
        {
            var category = await _mongoDb.Categories.Find(c => c.Id == id).FirstOrDefaultAsync();
            if (category == null)
                return NotFound();

            if (category.Name != updateDto.Name)
            {
                var existingCategory = await _mongoDb.Categories
                    .Find(c => c.Name.ToLower() == updateDto.Name.ToLower() && c.Id != id)
                    .FirstOrDefaultAsync();

                if (existingCategory != null)
                    return BadRequest("Category with this name already exists");
            }

            category.Name = updateDto.Name;
            category.Description = updateDto.Description ?? "";

            await _mongoDb.Categories.ReplaceOneAsync(c => c.Id == id, category);

            return NoContent();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory(string id)
        {
            var category = await _mongoDb.Categories.Find(c => c.Id == id).FirstOrDefaultAsync();
            if (category == null)
                return NotFound();

            var productsInCategory = await _mongoDb.Products
                .CountDocumentsAsync(p => p.Category == category.Name);

            if (productsInCategory > 0)
                return BadRequest($"Cannot delete category with {productsInCategory} products. Move or delete products first.");

            await _mongoDb.Categories.DeleteOneAsync(c => c.Id == id);

            return NoContent();
        }
    }
}