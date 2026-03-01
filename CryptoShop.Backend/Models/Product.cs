using System.ComponentModel.DataAnnotations;

namespace CryptoShop.Backend.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }
        public string Description { get; set; }

        [Required]
        public decimal Price { get; set; }
        public string ImageUrl { get; set; }
        public int CategoryId { get; set; }
        public Category Category { get; set; }
        public int Stock { get; set; }
        public ICollection<Review> Reviews { get; set; }
    }
}
