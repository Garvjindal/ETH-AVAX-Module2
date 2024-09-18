// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BusRental {
    address payable public owner;
    mapping(address => bool) public rentals;

    event BusRented(address indexed user);
    event RentalReturned(address indexed user);

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    constructor() payable {
        owner = payable(msg.sender);
    }

    function rentBus(uint256 amount) public payable {
        require(amount == 1 ether, "You must send exactly 1 ETH to rent a Bus");
        require(!rentals[msg.sender], "Bus already rented");

        rentals[msg.sender] = true;
        emit BusRented(msg.sender);
    }

    function returnBus() public {
        require(rentals[msg.sender], "No Bus to return");
        rentals[msg.sender] = false;
        payable(msg.sender).transfer(0.9 ether);
        emit RentalReturned(msg.sender);
    }

    function getRentalStatus(address user) public view returns (bool) {
        return rentals[user];
    }

    function getOwner() public view returns (address) {
        return owner;
    }

    // Fallback function to receive ETH
    receive() external payable {}

    fallback() external payable {}
}
