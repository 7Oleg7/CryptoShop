using CryptoShop.Backend.Data;
using Microsoft.AspNetCore.Mvc;
using CryptoShop.Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace CryptoShop.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ProductsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/products (все продукты с фильтрацией)
        [HttpGet]
        public async Task<ActionResult> GetAllProducts(
            string category = "",
            decimal? minPrice = null,
            decimal? maxPrice = null,
            string search = "")
        {
            List<Product> products = await _db.Products
                .Include(p => p.Category)
                .ToListAsync();

            List<Product> filtered = new List<Product>();

            foreach (Product product in products)
            {
                bool matches = true;

                // По категории
                if (!string.IsNullOrEmpty(category))
                {
                    if (product.Category == null || product.Category.Name != category)
                    {
                        matches = false;
                    }
                }

                // По минимальной цене
                if (minPrice.HasValue && product.Price < minPrice.Value)
                {
                    matches = false;
                }

                // По максимальной цене
                if (maxPrice.HasValue && product.Price > maxPrice.Value)
                {
                    matches = false;
                }

                // По поиску в названии
                if (!string.IsNullOrEmpty(search))
                {
                    if (!product.Name.ToLower().Contains(search.ToLower()))
                    {
                        matches = false;
                    }
                }

                if (matches)
                {
                    filtered.Add(product);
                }
            }

            return Ok(filtered);
        }

        // GET: api/products/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult> GetProductById(int id)
        {
            Product? product = await _db.Products
                .Include(p => p.Category)
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
            {
                return NotFound("Товар не найден");
            }

            await _db.Entry(product)
                .Collection(p => p.Reviews)
                .LoadAsync();

            // Загрузка пользователя для каждого отзыва
            foreach (Review review in product.Reviews)
            {
                await _db.Entry(review)
                    .Reference(r => r.User)
                    .LoadAsync();
            }

            return Ok(product);
        }

        // POST: api/products (только админ)
        [HttpPost]
        public async Task<ActionResult> CreateProduct(Product newProduct)
        {
            // Админ ли пользователь
            string? userRole = Request.Headers["X-User-Role"].FirstOrDefault();

            if (userRole != "Admin")
            {
                return StatusCode(403, "Только администратор может создавать товары");
            }

            _db.Products.Add(newProduct);
            await _db.SaveChangesAsync();

            return Ok(newProduct);
        }

        // PUT: api/products/{id} (только админ)
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateProduct(int id, Product updatedProduct)
        {
            if (id != updatedProduct.Id)
            {
                return BadRequest("ID в запросе не совпадает с ID товара");
            }

            Product? existingProduct = await _db.Products.FindAsync(id);

            if (existingProduct == null)
            {
                return NotFound("Товар не найден");
            }

            existingProduct.Name = updatedProduct.Name;
            existingProduct.Description = updatedProduct.Description;
            existingProduct.Price = updatedProduct.Price;
            existingProduct.ImageUrl = updatedProduct.ImageUrl;
            existingProduct.CategoryId = updatedProduct.CategoryId;
            existingProduct.Stock = updatedProduct.Stock;

            await _db.SaveChangesAsync();

            return Ok(existingProduct);
        }

        // DELETE: api/products/{id} (только админ)
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteProduct(int id)
        {
            Product? product = await _db.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound("Товар не найден");
            }

            _db.Products.Remove(product);
            await _db.SaveChangesAsync();

            return Ok("Товар удален");
        }
    }
}
