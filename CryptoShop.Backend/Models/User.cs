using System.ComponentModel.DataAnnotations;

namespace CryptoShop.Backend.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }

        public string Name { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public string Role { get; set; } = "User";
        public bool IsBlocked { get; set; } = false;
    }
}
