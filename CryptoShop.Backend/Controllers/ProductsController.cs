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
    public class ProductsController : ControllerBase
    {
        private readonly MongoDbService _mongoDb;
        private readonly ILogger<ProductsController> _logger;

        public ProductsController(MongoDbService mongoDb, ILogger<ProductsController> logger)
        {
            _mongoDb = mongoDb;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts(
            [FromQuery] string? category = null,
            [FromQuery] decimal? minPrice = null,
            [FromQuery] decimal? maxPrice = null,
            [FromQuery] string? search = null)
        {
            try
            {
                var filter = Builders<Product>.Filter.Empty;
                
                if (!string.IsNullOrEmpty(category))
                {
                    filter = filter & Builders<Product>.Filter.Eq(p => p.Category, category);
                }
                
                if (minPrice.HasValue)
                {
                    filter = filter & Builders<Product>.Filter.Gte(p => p.Price, minPrice.Value);
                }
                
                if (maxPrice.HasValue)
                {
                    filter = filter & Builders<Product>.Filter.Lte(p => p.Price, maxPrice.Value);
                }
                
                if (!string.IsNullOrEmpty(search))
                {
                    filter = filter & Builders<Product>.Filter.Regex(p => p.Name, new MongoDB.Bson.BsonRegularExpression(search, "i"));
                }
                
                var products = await _mongoDb.Products.Find(filter).ToListAsync();
                return Ok(products);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting products");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(string id)
        {
            try
            {
                var product = await _mongoDb.GetProductByIdAsync(id);
                if (product == null) 
                    return NotFound();
                    
                return Ok(product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error getting product {Id}", id);
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<Product>> CreateProduct(CreateProductDto createDto)
        {
            try
            {
                var product = new Product
                {
                    Name = createDto.Name,
                    Description = createDto.Description ?? "",
                    Price = createDto.Price,
                    ImageUrl = createDto.ImageUrl ?? "",
                    StockQuantity = createDto.StockQuantity,
                    Category = createDto.Category,
                    Specifications = createDto.Specifications ?? new Dictionary<string, string>()
                };

                await _mongoDb.CreateProductAsync(product);
                return CreatedAtAction(nameof(GetProduct), new { id = product.Id }, product);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating product");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateProduct(string id, UpdateProductDto updateDto)
        {
            try
            {
                var product = await _mongoDb.GetProductByIdAsync(id);
                if (product == null)
                    return NotFound();

                if (updateDto.Name != null)
                    product.Name = updateDto.Name;
                if (updateDto.Description != null)
                    product.Description = updateDto.Description;
                if (updateDto.Price.HasValue)
                    product.Price = updateDto.Price.Value;
                if (updateDto.ImageUrl != null)
                    product.ImageUrl = updateDto.ImageUrl;
                if (updateDto.StockQuantity.HasValue)
                    product.StockQuantity = updateDto.StockQuantity.Value;
                if (updateDto.Category != null)
                    product.Category = updateDto.Category;
                if (updateDto.Specifications != null)
                    product.Specifications = updateDto.Specifications;

                var updated = await _mongoDb.UpdateProductAsync(id, product);
                
                if (updated)
                    return NoContent();
                else
                    return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error updating product {Id}", id);
                return StatusCode(500, new { error = "Internal server error" });
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteProduct(string id)
        {
            try
            {
                var deleted = await _mongoDb.DeleteProductAsync(id);
                
                if (deleted)
                    return NoContent();
                else
                    return NotFound();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting product {Id}", id);
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }
}