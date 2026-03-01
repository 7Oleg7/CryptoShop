using System.ComponentModel.DataAnnotations;

namespace CryptoShop.Backend.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Phone { get; set; }
        public string Status { get; set; } = "New";
        public string DeliveryAddress { get; set; }
        public string TransactionHash { get; set; }
        public List<OrderItem> Items { get; set; }
    }
}
