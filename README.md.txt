# Cement Shop - Online Ordering System

A web-based platform that connects cement vendors with customers, enabling seamless order placement and management.

## Features

### For Customers
- Browse verified cement vendors
- View vendor details including pricing and location
- Place orders with detailed delivery information
- Multiple payment options (M-Pesa, Credit/Debit Card, Bank Transfer)

### For Vendors
- Vendor dashboard to manage orders
- Real-time order status updates
- Order filtering by status (pending, confirmed, delivered)
- Detailed customer information view

## Project Structure

```
Landing/
├── index.html          # Home page
├── vendors.html        # List of verified vendors
├── orders.html         # Order placement form
├── vendor-dashboard.html # Vendor order management
├── Verify.html         # Vendor verification page
├── results.html        # Search/Filter results
└── README.md          # Project documentation
```

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6+)
- Bootstrap 5.3.0
- Local Storage for data persistence
-mongo db
## Getting Started

1. Clone the repository
2. Open `index.html` in your web browser
3. Browse vendors and place orders as a customer
4. Access vendor dashboard through `vendor-dashboard.html`

## Order Flow

1. Customer selects a vendor from `vendors.html`
2. Customer fills out order form in `orders.html` with:
   - Personal information
   - Delivery details
   - Payment method
3. Vendor receives order in dashboard
4. Vendor can:
   - View order details
   - Confirm orders
   - Mark orders as delivered

## Payment Methods

- M-Pesa
- Credit/Debit Card
- Bank Transfer

## Future Enhancements

- Backend integration for data persistence
- User authentication system
- Real-time notifications
- Payment gateway integration
- Mobile app development
- Order tracking system
- Customer reviews and ratings

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details