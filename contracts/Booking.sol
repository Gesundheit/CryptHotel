pragma solidity ^0.4.17;

contract Booking{
	
	address[16] public customers;

	//Booking a flight
	function book(uint hotelId) public returns (uint) {
	  require(hotelId >= 0 && hotelId <= 15);

	  customers[hotelId] = msg.sender;

	  return hotelId;
	}

	// Retrieving the customers
	function getCustomers() public view returns (address[16]) {
	  return customers;
	}

}