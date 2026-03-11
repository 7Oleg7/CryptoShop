using System.ComponentModel.DataAnnotations;

namespace CryptoShop.Backend.DTOs
{
    public class ProductDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public string ImageUrl { get; set; } = string.Empty;
        public int StockQuantity { get; set; }
        public Dictionary<string, string> Specifications { get; set; } = new();
        public string Category { get; set; } = "Uncategorized";
        public double AverageRating { get; set; }
    }

    public class CreateProductDto
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        [Range(0.01, double.MaxValue)]
        public decimal Price { get; set; }
        
        public string? ImageUrl { get; set; }
        
        [Range(0, int.MaxValue)]
        public int StockQuantity { get; set; } = 100;
        
        public Dictionary<string, string>? Specifications { get; set; }
        
        public string Category { get; set; } = "Uncategorized";
    }

    public class UpdateProductDto
    {
        public string? Name { get; set; }
        public string? Description { get; set; }
        public decimal? Price { get; set; }
        public string? ImageUrl { get; set; }
        public int? StockQuantity { get; set; }
        public Dictionary<string, string>? Specifications { get; set; }
        public string? Category { get; set; }
    }
}