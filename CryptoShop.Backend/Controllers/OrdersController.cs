using CryptoShop.Backend.Models;
using CryptoShop.Backend.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CryptoShop.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly AppDbContext _db;

        public OrdersController(AppDbContext db)
        {
            _db = db;
        }

        // POST: api/orders/create
        [HttpPost("create")]
        public async Task<ActionResult> CreateOrder(OrderData data)
        {
            string orderNumber = "ORD-" + DateTime.Now.Ticks;

            Order order = new Order();
            order.OrderNumber = orderNumber;
            order.UserId = data.UserId;
            order.OrderDate = DateTime.Now;
            order.TotalAmount = data.TotalAmount;
            order.DeliveryAddress = data.DeliveryAddress;
            order.Phone = data.Phone;
            order.Status = "New";
            order.TransactionHash = "";

            order.Items = new List<OrderItem>();

            foreach (var item in data.Items)
            {
                OrderItem orderItem = new OrderItem();
                orderItem.ProductId = item.ProductId;
                orderItem.Quantity = item.Quantity;
                orderItem.Price = item.Price;

                order.Items.Add(orderItem);
            }

            _db.Orders.Add(order);
            await _db.SaveChangesAsync();

            return Ok(new
            {
                OrderId = order.Id,
                OrderNumber = order.OrderNumber
            });
        }

        // POST: api/orders/confirm-payment
        [HttpPost("confirm-payment")]
        public async Task<ActionResult> ConfirmPayment(int orderId, string transactionHash)
        {
            Order? order = await _db.Orders.FindAsync(orderId);

            if (order == null)
            {
                return NotFound("Заказ не найден");
            }

            order.Status = "Paid";
            order.TransactionHash = transactionHash;

            await _db.SaveChangesAsync();

            return Ok("Оплата подтверждена");
        }

        // GET: api/orders/user/{userId}
        [HttpGet("user/{userId}")]
        public async Task<ActionResult> GetUserOrders(int userId)
        {
            // Все заказы пользователя
            List<Order> orders = await _db.Orders
                .Where(o => o.UserId == userId)
                .OrderByDescending(o => o.OrderDate)
                .ToListAsync();

            // Загрузка товара для каждого заказа
            foreach (Order order in orders)
            {
                await _db.Entry(order)
                    .Collection(o => o.Items)
                    .LoadAsync();

                foreach (OrderItem item in order.Items)
                {
                    await _db.Entry(item)
                        .Reference(i => i.Product)
                        .LoadAsync();
                }
            }

            return Ok(orders);
        }

        // PUT: api/orders/{id}/status (только для админа)
        [HttpPut("{id}/status")]
        public async Task<ActionResult> UpdateStatus(int id, string newStatus)
        {
            Order? order = await _db.Orders.FindAsync(id);

            if (order == null)
            {
                return NotFound("Заказ не найден");
            }

            order.Status = newStatus;
            await _db.SaveChangesAsync();

            return Ok("Статус обновлен");
        }
    }

    public class OrderData
    {
        public int UserId { get; set; }
        public decimal TotalAmount { get; set; }
        public string? DeliveryAddress { get; set; }
        public string? Phone { get; set; }
        public List<OrderItemData>? Items { get; set; }
    }

    public class OrderItemData
    {
        public int ProductId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
