using Microsoft.AspNetCore.Mvc;
using CryptoShop.Backend.Services;
using CryptoShop.Backend.Models;
using CryptoShop.Backend.DTOs;
using MongoDB.Driver;

namespace CryptoShop.Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrdersController : ControllerBase
    {
        private readonly MongoDbService _mongoDb;

        public OrdersController(MongoDbService mongoDb)
        {
            _mongoDb = mongoDb;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetOrders()
        {
            var orders = await _mongoDb.Orders.Find(_ => true).ToListAsync();
            
            var orderDtos = new List<OrderDto>();
            foreach (var order in orders)
            {
                var user = await _mongoDb.Users.Find(u => u.Id == order.UserId).FirstOrDefaultAsync();
                
                var orderDto = new OrderDto
                {
                    Id = order.Id,
                    OrderDate = order.OrderDate,
                    TotalAmount = order.TotalAmount,
                    Status = order.Status,
                    ShippingAddress = order.ShippingAddress,
                    ContactPhone = order.ContactPhone,
                    ContactName = order.ContactName,
                    TransactionHash = order.TransactionHash,
                    Items = order.Items.Select(i => new OrderItemDto
                    {
                        ProductId = i.ProductId,
                        ProductName = i.ProductName,
                        Quantity = i.Quantity,
                        UnitPrice = i.UnitPrice,
                        TotalPrice = i.Quantity * i.UnitPrice
                    }).ToList()
                };
                orderDtos.Add(orderDto);
            }

            return Ok(orderDtos.OrderByDescending(o => o.OrderDate));
        }

        [HttpGet("user/{userId}")]
        public async Task<ActionResult<IEnumerable<OrderDto>>> GetUserOrders(string userId)
        {
            var orders = await _mongoDb.Orders.Find(o => o.UserId == userId).ToListAsync();
            
            var orderDtos = orders.Select(order => new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                ContactPhone = order.ContactPhone,
                ContactName = order.ContactName,
                TransactionHash = order.TransactionHash,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.Quantity * i.UnitPrice
                }).ToList()
            }).OrderByDescending(o => o.OrderDate);

            return Ok(orderDtos);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(string id)
        {
            var order = await _mongoDb.Orders.Find(o => o.Id == id).FirstOrDefaultAsync();
            if (order == null)
                return NotFound();

            var user = await _mongoDb.Users.Find(u => u.Id == order.UserId).FirstOrDefaultAsync();

            var orderDto = new OrderDto
            {
                Id = order.Id,
                OrderDate = order.OrderDate,
                TotalAmount = order.TotalAmount,
                Status = order.Status,
                ShippingAddress = order.ShippingAddress,
                ContactPhone = order.ContactPhone,
                ContactName = order.ContactName,
                TransactionHash = order.TransactionHash,
                Items = order.Items.Select(i => new OrderItemDto
                {
                    ProductId = i.ProductId,
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice,
                    TotalPrice = i.Quantity * i.UnitPrice
                }).ToList()
            };

            return Ok(orderDto);
        }

        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDto createDto)
        {
            var userId = "67d8f8c3b4c5d6e7f8a9b0c1";

            var order = new Order
            {
                UserId = userId,
                ShippingAddress = createDto.ShippingAddress,
                ContactPhone = createDto.ContactPhone,
                ContactName = createDto.ContactName,
                Status = "New",
                OrderDate = DateTime.UtcNow,
                TotalAmount = createDto.Items.Sum(i => i.Quantity * i.UnitPrice),
                Items = createDto.Items.Select(i => new OrderItem
                {
                    ProductId = i.ProductId.ToString(),
                    ProductName = i.ProductName,
                    Quantity = i.Quantity,
                    UnitPrice = i.UnitPrice
                }).ToList()
            };

            await _mongoDb.Orders.InsertOneAsync(order);
            
            var update = Builders<User>.Update.Push(u => u.OrderIds, order.Id);
            await _mongoDb.Users.UpdateOneAsync(u => u.Id == userId, update);

            return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, order);
        }

        [HttpPut("{id}/status")]
        public async Task<IActionResult> UpdateOrderStatus(string id, UpdateOrderStatusDto statusDto)
        {
            var order = await _mongoDb.Orders.Find(o => o.Id == id).FirstOrDefaultAsync();
            if (order == null)
                return NotFound();

            order.Status = statusDto.Status;
            if (!string.IsNullOrEmpty(statusDto.TransactionHash))
                order.TransactionHash = statusDto.TransactionHash;

            await _mongoDb.Orders.ReplaceOneAsync(o => o.Id == id, order);

            return NoContent();
        }
    }
}