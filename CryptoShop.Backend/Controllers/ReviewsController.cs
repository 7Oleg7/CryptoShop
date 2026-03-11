using Microsoft.AspNetCore.Mvc;
using CryptoShop.Backend.Services;
using CryptoShop.Backend.Models;
using CryptoShop.Backend.DTOs;
using MongoDB.Driver;

namespace CryptoShop.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly MongoDbService _mongoDb;

        public ReviewsController(MongoDbService mongoDb)
        {
            _mongoDb = mongoDb;
        }

        [HttpGet("product/{productId}")]
        public async Task<ActionResult<IEnumerable<ReviewDto>>> GetProductReviews(string productId)
        {
            var reviews = await _mongoDb.Reviews
                .Find(r => r.ProductId == productId)
                .SortByDescending(r => r.CreatedAt)
                .ToListAsync();

            return Ok(reviews.Select(r => new ReviewDto
            {
                Id = r.Id,
                UserId = r.UserId,
                UserName = r.UserName,
                ProductId = r.ProductId,
                Rating = r.Rating,
                Comment = r.Comment,
                CreatedAt = r.CreatedAt
            }));
        }

        [HttpPost]
        public async Task<ActionResult<Review>> CreateReview(CreateReviewDto createDto)
        {
            var userId = "67d8f8c3b4c5d6e7f8a9b0c1";
            var userName = "current_user";

            var existingReview = await _mongoDb.Reviews
                .Find(r => r.UserId == userId && r.ProductId == createDto.ProductId)
                .FirstOrDefaultAsync();

            if (existingReview != null)
                return BadRequest("You have already reviewed this product");

            var review = new Review
            {
                UserId = userId,
                UserName = userName,
                ProductId = createDto.ProductId,
                Rating = createDto.Rating,
                Comment = createDto.Comment ?? "",
                CreatedAt = DateTime.UtcNow
            };

            await _mongoDb.Reviews.InsertOneAsync(review);
            return CreatedAtAction(nameof(GetProductReviews), new { productId = review.ProductId }, review);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteReview(string id)
        {
            var review = await _mongoDb.Reviews.Find(r => r.Id == id).FirstOrDefaultAsync();
            if (review == null)
                return NotFound();

            await _mongoDb.Reviews.DeleteOneAsync(r => r.Id == id);
            return NoContent();
        }
    }
}