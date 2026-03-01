using CryptoShop.Backend.Models;
using Microsoft.AspNetCore.Mvc;
using CryptoShop.Backend.Data;
using Microsoft.EntityFrameworkCore;

namespace CryptoShop.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public ReviewsController(AppDbContext db)
        {
            _db = db;
        }

        // GET: api/reviews/product/{productId}
        [HttpGet("product/{productId}")]
        public async Task<ActionResult> GetReviews(int productId)
        {
            // Все отзывы для конкретного товара
            List<Review> reviews = await _db.Reviews
                .Where(r => r.ProductId == productId)
                .OrderByDescending(r => r.Date)
                .ToListAsync();

            // Загрузка инфы о пользователе для каждого отзыва
            foreach (Review review in reviews)
            {
                await _db.Entry(review)
                    .Reference(r => r.User)
                    .LoadAsync();
            }

            return Ok(reviews);
        }

        // POST: api/reviews
        [HttpPost]
        public async Task<ActionResult> AddReview(ReviewData data)
        {
            Review review = new Review();
            review.ProductId = data.ProductId;
            review.UserId = data.UserId;
            review.Rating = data.Rating;
            review.Comment = data.Comment;
            review.Date = DateTime.Now;

            _db.Reviews.Add(review);
            await _db.SaveChangesAsync();

            // Загрузка пользователя для ответа
            await _db.Entry(review)
                .Reference(r => r.User)
                .LoadAsync();

            return Ok(review);
        }
    }

    public class ReviewData
    {
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public int Rating { get; set; }
        public string? Comment { get; set; }
    }
}
