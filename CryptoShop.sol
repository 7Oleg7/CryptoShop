// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CryptoShop {
    address public owner;
    
    struct Order {
        address buyer;
        uint256 amount;
        uint256 timestamp;
        bool completed;
    }
    
    mapping(string => Order) public orders;
    mapping(string => bool) public processedOrders;
    
    event PurchaseCompleted(
        address indexed buyer,
        uint256 amount,
        string orderId,
        uint256 timestamp
    );
    
    event PurchaseFailed(
        address indexed buyer,
        uint256 amount,
        string orderId,
        string reason
    );
    
    constructor() {
        owner = msg.sender;
    }
    
    function purchase(string memory orderId) public payable {
        require(msg.value > 0, "Payment amount must be > 0");
        require(!processedOrders[orderId], "Order already processed");
        
        processedOrders[orderId] = true;
        
        orders[orderId] = Order({
            buyer: msg.sender,
            amount: msg.value,
            timestamp: block.timestamp,
            completed: true
        });
        
        (bool success, ) = owner.call{value: msg.value}("");
        
        if (!success) {
            emit PurchaseFailed(msg.sender, msg.value, orderId, "Transfer to owner failed");
            payable(msg.sender).transfer(msg.value);
            orders[orderId].completed = false;
            revert("Payment processing failed");
        }
        
        emit PurchaseCompleted(
            msg.sender,
            msg.value,
            orderId,
            block.timestamp
        );
    }
    
    function getOrderStatus(string memory orderId) public view returns (bool) {
        return processedOrders[orderId];
    }
    
    function getOrderDetails(string memory orderId) public view returns (Order memory) {
        return orders[orderId];
    }
    
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }
    
    function refund(string memory orderId) public {
        require(orders[orderId].buyer == msg.sender, "Not your order");
        require(orders[orderId].completed, "Order not completed");
        
        uint256 amount = orders[orderId].amount;
        orders[orderId].completed = false;
        
        payable(msg.sender).transfer(amount);
    }
}