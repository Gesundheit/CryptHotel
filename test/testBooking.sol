pragma solidity ^0.4.17;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Booking.sol";

contract testBooking {
  Booking booking = Booking(DeployedAddresses.Booking());

  // Testing the book() function
  function testCustomerCanBook() public {
    uint returnedId = booking.book(8);

    uint expected = 8;

    Assert.equal(returnedId, expected, "Booking of hotel ID 8 should be recorded.");
  }

  // Testing retrieval of a single hotel customer
  function testGetUserAddressByHotelId() public {
    // Expected owner is this contract
    address expected = this;

    address customer = booking.customers(8);

    Assert.equal(customer, expected, "Customer of hotel ID 8 should be recorded.");
  }

  // Testing retrieval of all pet owners
  function testGetCustomerAddressByHotelIdInArray() public {
    // Expected owner is this contract
    address expected = this;

    // Store adopters in memory rather than contract's storage
    address[16] memory customers = booking.getCustomers();

    Assert.equal(customers[8], expected, "Customer of hotel ID 8 should be recorded.");
  }
}