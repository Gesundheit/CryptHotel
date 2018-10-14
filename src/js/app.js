App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    // Load hotels.
    $.getJSON('../hotels.json', function(data) {
      var hotelsRow = $('#hotelsRow');
      var hotelTemplate = $('#hotelTemplate');

      for (i = 0; i < data.length; i ++) {
        hotelTemplate.find('.panel-title').text(data[i].name);
        hotelTemplate.find('img').attr('src', data[i].picture);
        hotelTemplate.find('.hotel-rooms').text(data[i].rooms);
        hotelTemplate.find('.hotel-location').text(data[i].location);
        hotelTemplate.find('.btn-book').attr('data-id', data[i].id);

        hotelsRow.append(hotelTemplate.html());
      }
    });

    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    }
    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Booking.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var BookingArtifact = data;
      App.contracts.Booking = TruffleContract(BookingArtifact);

      // Set the provider for our contract
      App.contracts.Booking.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the booked hotels
      return App.markBooked();
    });
    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-book', App.handleBook);
  },

  markBooked: function(customers, account) {
    var bookingInstance;

    App.contracts.Booking.deployed().then(function(instance) {
    bookingInstance = instance;

    return bookingInstance.getCustomers.call();
    }).then(function(customers) {
    for (i = 0; i < customers.length; i++) {
      if (customers[i] !== '0x0000000000000000000000000000000000000000') {
        $('.panel-hotel').eq(i).find('button').text('Success').attr('disabled', true);
      }
    }
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handleBook: function(event) {
    event.preventDefault();

    var hotelId = parseInt($(event.target).data('id'));
    var bookingInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.Booking.deployed().then(function(instance) {
        bookingInstance = instance;

        // Execute book as a transaction by sending account
        return bookingInstance.book(hotelId, {from: account});
      }).then(function(result) {
        return App.markBooked();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
