# iShare Payment System - Complete Implementation Guide

## 📋 Overview

This guide covers the complete payment system implementation for the iShare rental marketplace, including customer payments, vendor wallet management, and admin financial controls.

## 🎯 Quick Start

### For Customers

1. Go to `/booking-details/:bookingId` after vendor approves rental
2. Click "Pay Now" button
3. Redirected to `/payment-flow/:bookingId`
4. Select payment provider (mock for testing)
5. System polls payment status every 3 seconds
6. Auto-redirect to booking confirmation on success

### For Vendors

1. Navigate to `/vendor/my-wallet` to see wallet summary
2. View transaction history in wallet tab
3. Request withdrawal via "Withdraw Money" button
4. Track withdrawal status in `/vendor/withdrawals`
5. Can cancel pending withdrawals

### For Admins

1. Visit `/admin/financial/dashboard` for KPI overview
2. Manage payments: `/admin/payments` (view, refund, filter by status/date)
3. Manage withdrawals: `/admin/withdrawals` (approve, reject, process, complete)
4. View refunds: `/admin/refunds` (track by status/reason)

---

## 📱 Frontend Pages & Routes

### Customer Pages

| Route                      | Component             | Purpose                                    |
| -------------------------- | --------------------- | ------------------------------------------ |
| `/payment-flow/:bookingId` | `PaymentFlowPage.jsx` | Multi-step payment with provider selection |

### Vendor Pages

| Route                 | Component                   | Purpose                            |
| --------------------- | --------------------------- | ---------------------------------- |
| `/vendor/my-wallet`   | `VendorWalletPage.jsx`      | Wallet summary & withdrawal form   |
| `/vendor/withdrawals` | `VendorWithdrawalsPage.jsx` | Withdrawal requests list & details |

### Admin Pages

| Route                        | Component                     | Purpose                                      |
| ---------------------------- | ----------------------------- | -------------------------------------------- |
| `/admin/financial/dashboard` | `AdminFinancialDashboard.jsx` | KPI dashboard & key metrics                  |
| `/admin/payments`            | `AdminPaymentsPage.jsx`       | All payments with filters & refund option    |
| `/admin/withdrawals`         | `AdminWithdrawalsPage.jsx`    | Withdrawal management with approval workflow |
| `/admin/refunds`             | `AdminRefundsPage.jsx`        | Refund tracking by status & reason           |

---

## 🔌 Backend API Endpoints

### Customer Payment Endpoints

```
POST   /api/payments/initiate              # Start payment, get payment_url
GET    /api/payments/{id}/verify           # Check payment status (polling)
POST   /api/payments/webhook               # Public webhook (no auth)
```

### Vendor Wallet Endpoints

```
GET    /api/vendor/wallet                  # Get balance summary
GET    /api/vendor/wallet/transactions     # Paginated transaction history
GET    /api/vendor/withdrawals             # List vendor's withdrawals
GET    /api/vendor/withdrawals/{id}        # Single withdrawal details
POST   /api/vendor/withdrawals             # Request withdrawal
DELETE /api/vendor/withdrawals/{id}        # Cancel pending withdrawal
```

### Admin Financial Endpoints

```
GET    /api/admin/financial/dashboard                  # KPI metrics
GET    /api/admin/financial/payments/analytics         # Payment analytics
GET    /api/admin/financial/withdrawals/analytics      # Withdrawal analytics
GET    /api/admin/financial/refunds/analytics          # Refund analytics
GET    /api/admin/financial/vendors/{id}/summary       # Vendor earnings summary
GET    /api/admin/financial/wallet-transactions        # Audit trail
```

### Admin Payment Endpoints

```
GET    /api/admin/payments                 # List all payments (filterable)
GET    /api/admin/payments/{id}            # Payment details with booking info
POST   /api/admin/payments/{id}/refund     # Initiate refund
```

### Admin Withdrawal Endpoints

```
GET    /api/admin/withdrawals              # List with status filter
POST   /api/admin/withdrawals/{id}/approve # Approve withdrawal
POST   /api/admin/withdrawals/{id}/reject  # Reject with reason
POST   /api/admin/withdrawals/{id}/processing  # Mark as processing
POST   /api/admin/withdrawals/{id}/complete    # Complete with transaction_id
```

### Admin Refund Endpoints

```
GET    /api/admin/refunds                  # List all refunds (filterable)
GET    /api/admin/refunds/{id}             # Refund details
```

---

## 🔐 Authentication & Authorization

All endpoints use Laravel Sanctum JWT authentication except:

- `POST /api/payments/webhook` - Public endpoint with signature validation

Role-based access:

```
- /vendor/*        → middleware('vendor')
- /admin/*         → middleware('admin')
- /api/payments/*  → middleware('auth:sanctum')
```

Header for authenticated requests:

```
Authorization: Bearer {authToken}
```

---

## 💳 Payment Flow Sequence

```
1. Customer clicks "Pay Now" on booking
   ↓
2. POST /api/payments/initiate
   - Backend creates Payment record with idempotency_key
   - Calls PaymentProvider->initiate()
   - Returns payment_url
   ↓
3. Frontend redirects to payment_url (or mock provider page)
   ↓
4. Payment provider processes payment
   ↓
5. Payment provider sends webhook to POST /api/payments/webhook
   - Signature validation
   - Duplicate prevention via idempotency_key
   - Updates Payment status to 'paid'
   - Increments vendor pending_balance
   - Sends notifications
   ↓
6. Frontend polling: GET /api/payments/{id}/verify (every 3 seconds)
   - Checks if payment_status == 'paid'
   - Auto-redirects on success
   ↓
7. Customer redirected to booking confirmation
```

---

## 💰 Withdrawal Flow Sequence

```
1. Vendor views available_balance at /vendor/my-wallet
   ↓
2. Vendor fills withdrawal form
   - Amount must be ≤ available_balance
   - Selects payment method
   ↓
3. POST /api/vendor/withdrawals
   - Creates VendorPayout record with payout_status='pending'
   - Reserves amount from available_balance
   - Available balance decreases immediately
   ↓
4. Admin views pending withdrawals at /admin/withdrawals
   ↓
5. Admin approves: POST /api/admin/withdrawals/{id}/approve
   - Sets payout_status='approved'
   - Sets approved_by, approved_at
   ↓
6. Admin marks processing: POST /api/admin/withdrawals/{id}/processing
   - Sets payout_status='processing'
   - Triggers bank transfer/payout
   ↓
7. Admin completes: POST /api/admin/withdrawals/{id}/complete
   - Sets payout_status='completed'
   - Stores transaction_id from bank
   - Amount removed from available_balance permanently
   ↓
8. Vendor sees withdrawal completed in /vendor/withdrawals
```

Rejection flow (can happen at any time before processing):

```
5. Admin rejects: POST /api/admin/withdrawals/{id}/reject
   - Sets payout_status='rejected'
   - Stores rejection_reason
   - Returns reserved amount back to available_balance
   ↓
6. Vendor can see rejection reason in /vendor/withdrawals
```

---

## 💱 Payment Providers

### MockPaymentProvider (Testing)

- Returns simulated payment flow
- Generates MOCK-\* provider references
- Always validates signatures correctly
- Parses JSON webhook payloads

### Stripe (Stub - Ready for Integration)

- File: `app/Services/PaymentProviders/StripePaymentProvider.php`
- Methods to implement: `initiate()`, `verify()`, `refund()`, `checkStatus()`, etc.

### Chapa (Stub - Ready for Integration)

- File: `app/Services/PaymentProviders/ChapaPaymentProvider.php`

### Telebirr (Stub - Ready for Integration)

- File: `app/Services/PaymentProviders/TelabirPaymentProvider.php`

---

## 🗄️ Database Schema

### Payments Table

```sql
- id
- booking_id (FK → bookings)
- customer_id (FK → users)
- vendor_id (FK → vendor_profiles)
- amount (decimal:2)
- platform_fee (decimal:2) -- auto-calculated by backend
- vendor_amount (decimal:2) -- amount minus platform_fee
- payment_method (string) -- "mock", "stripe", "chapa", "telebirr"
- payment_status (enum) -- pending, processing, paid, failed
- provider_reference (string unique) -- payment gateway reference
- idempotency_key (string unique) -- prevent duplicates
- webhook_verified (boolean)
- paid_at (timestamp)
- failed_at (timestamp)
- created_at, updated_at
```

### VendorPayouts Table

```sql
- id
- vendor_id (FK → users)
- amount (decimal:2)
- payout_status (enum) -- pending, approved, processing, completed, rejected
- payment_method_id (FK → vendor_payment_methods)
- approved_by (FK → users, nullable)
- approved_at (timestamp, nullable)
- rejected_by (FK → users, nullable)
- rejected_at (timestamp, nullable)
- rejection_reason (text, nullable)
- processing_at (timestamp, nullable)
- completed_at (timestamp, nullable)
- transaction_id (string, nullable) -- bank transfer ID
- admin_note (text, nullable)
- notes (text, nullable)
- created_at, updated_at
```

### Refunds Table

```sql
- id
- payment_id (FK → payments)
- booking_id (FK → bookings)
- customer_id (FK → users)
- vendor_id (FK → vendor_profiles)
- amount (decimal:2)
- reason (string)
- status (enum) -- pending, processing, completed, failed
- provider_reference (string, nullable) -- refund gateway reference
- initiated_by (FK → users) -- admin user
- processed_by (FK → users, nullable)
- completed_at (timestamp, nullable)
- failure_reason (text, nullable)
- notes (text, nullable)
- created_at, updated_at
```

### WalletTransactions Table (Audit Trail)

```sql
- id
- vendor_id (FK → users)
- transaction_type (enum) -- rental_earning, commission, withdrawal, refund, adjustment
- amount (decimal:2)
- balance_after (decimal:2)
- related_payment_id (FK → payments, nullable)
- related_withdrawal_id (FK → vendor_payouts, nullable)
- description (text)
- metadata (json)
- created_at
```

---

## 💡 Key Features

### Security

- ✅ Webhook signature validation
- ✅ Idempotency key prevents duplicate payments
- ✅ Provider reference uniqueness prevents double-charging
- ✅ Backend calculates fees (frontend can't manipulate)
- ✅ Database transactions ensure atomic operations
- ✅ Role-based access control (vendor, admin middleware)

### User Experience

- ✅ Multi-step payment flow with visual feedback
- ✅ Real-time payment status polling
- ✅ Auto-redirect on success
- ✅ Clear error messages with retry capability
- ✅ Responsive mobile-first design

### Admin Controls

- ✅ Financial dashboard with KPIs
- ✅ Payment filtering and search
- ✅ Withdrawal approval workflow
- ✅ Refund initiation and tracking
- ✅ Comprehensive audit trail

### Vendor Features

- ✅ Real-time wallet balance display
- ✅ Transaction history with breakdowns
- ✅ Easy withdrawal requests
- ✅ Withdrawal status tracking
- ✅ Cancellation of pending withdrawals

---

## 🧪 Testing

### Test Payment Flow (Using Mock Provider)

```
1. Customer creates booking
2. Vendor approves booking
3. Navigate to /payment-flow/:bookingId
4. Select "Mock Payment (Testing)"
5. Click "Pay Now"
6. Auto-redirect to mock payment page
7. Confirm payment
8. System polls and redirects to booking confirmation
```

### Test Withdrawal Flow (Using Mock Data)

```
1. Vendor navigates to /vendor/my-wallet
2. View available balance (from completed bookings)
3. Click "Request Withdrawal"
4. Enter amount and select bank
5. Admin navigates to /admin/withdrawals
6. Approve withdrawal
7. Mark as processing
8. Enter transaction ID
9. Mark as complete
10. Vendor sees withdrawal completed
```

---

## 📊 Example API Responses

### POST /api/payments/initiate

```json
{
  "success": true,
  "payment_id": 123,
  "payment_url": "https://mock-payment-gateway.local/pay?token=...",
  "booking_id": 456
}
```

### GET /api/payments/{id}/verify

```json
{
  "success": true,
  "payment": {
    "id": 123,
    "payment_status": "paid",
    "amount": 1500,
    "platform_fee": 150,
    "vendor_amount": 1350,
    "paid_at": "2024-01-15T10:30:00Z"
  }
}
```

### GET /api/admin/financial/dashboard

```json
{
  "success": true,
  "dashboard": {
    "total_payments": 150000,
    "platform_revenue": 15000,
    "total_vendor_earnings": 135000,
    "pending_earnings": 25000,
    "total_available_balance": 110000,
    "total_withdrawals": 50000,
    "pending_withdrawals": 10000,
    "completed_withdrawals": 40000,
    "total_refunds": 5000,
    "failed_payment_count": 2,
    "failed_payment_amount": 1000
  }
}
```

---

## 🔧 Configuration

### Service Configuration (`config/services.php`)

```php
'payment' => [
    'default' => env('PAYMENT_PROVIDER', 'mock'),
    'mock' => [
        'api_key' => env('MOCK_PAYMENT_API_KEY'),
    ],
    'stripe' => [
        'api_key' => env('STRIPE_SECRET_KEY'),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET'),
    ],
    'chapa' => [
        'api_key' => env('CHAPA_API_KEY'),
        'webhook_secret' => env('CHAPA_WEBHOOK_SECRET'),
    ],
    'telebirr' => [
        'api_key' => env('TELEBIRR_API_KEY'),
        'merchant_id' => env('TELEBIRR_MERCHANT_ID'),
    ],
],
```

### Environment Variables (`.env`)

```
PAYMENT_PROVIDER=mock
MOCK_PAYMENT_API_KEY=test_key_123
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
CHAPA_API_KEY=...
TELEBIRR_API_KEY=...
TELEBIRR_MERCHANT_ID=...
```

---

## 📝 Common Tasks

### Enable Stripe Payments

1. Update `.env`: `PAYMENT_PROVIDER=stripe`
2. Implement `app/Services/PaymentProviders/StripePaymentProvider.php`
3. Set Stripe webhook URL in provider settings
4. Test with `/payment-flow/:bookingId`

### Add New Payment Provider

1. Create: `app/Services/PaymentProviders/YourProvider.php`
2. Implement `PaymentProviderInterface`
3. Register in `PaymentProviderFactory::make()`
4. Add env variables to `.env`
5. Test with PaymentFlowPage

### Track Withdrawal Delays

```php
// Get average processing time
$avgTime = VendorPayout::where('payout_status', 'completed')
    ->selectRaw('AVG(DATEDIFF(completed_at, approved_at)) as avg_days')
    ->first();
```

### Generate Financial Reports

```
GET /api/admin/financial/dashboard         # Overview
GET /api/admin/financial/payments/analytics # Payment trends
GET /api/admin/financial/withdrawals/analytics # Withdrawal stats
GET /api/admin/financial/refunds/analytics # Refund analysis
```

---

## 🐛 Troubleshooting

### Payment Not Confirming

- Check webhook endpoint is accessible
- Verify signature validation in payment provider
- Check payment provider logs
- Ensure idempotency_key uniqueness

### Withdrawal Not Approved

- Verify vendor has available_balance > 0
- Check vendor payment method is valid
- Ensure admin user has 'admin' role
- Check admin middleware configuration

### Balance Incorrect

- Verify WalletTransaction audit trail
- Check PaymentService wallet updates
- Review booking payment_status field
- Check platform_fee calculation

---

## 📚 Related Files

### Services

- `app/Services/PaymentService.php` - Business logic
- `app/Services/WalletService.php` - Wallet operations
- `app/Services/BookingService.php` - Booking operations

### Controllers

- `app/Http/Controllers/Api/PaymentController.php` - Payment endpoints
- `app/Http/Controllers/Api/PaymentWebhookController.php` - Webhook handler
- `app/Http/Controllers/Api/WithdrawalController.php` - Withdrawal endpoints
- `app/Http/Controllers/Api/FinancialDashboardController.php` - Analytics

### Models

- `app/Models/Payment.php`
- `app/Models/Refund.php`
- `app/Models/VendorPayout.php`
- `app/Models/WalletTransaction.php`

### Routes

- `routes/api.php` - All API endpoints

### Migrations

- `database/migrations/*enhance_payments_table.php`
- `database/migrations/*enhance_vendor_payouts_table.php`
- `database/migrations/*create_refunds_table.php`

---

## ✅ Deployment Checklist

- [ ] All models created and migrations run
- [ ] Services implemented with business logic
- [ ] Controllers created and endpoints tested
- [ ] Routes configured in `routes/api.php`
- [ ] React components created and compiled
- [ ] Routes added to `App.jsx`
- [ ] Payment providers configured (at least mock)
- [ ] Webhook endpoint public and HTTPS
- [ ] Database backups configured
- [ ] Error logging enabled
- [ ] Monitoring alerts set up
- [ ] Documentation updated

---

**Last Updated**: January 2024
**Version**: 1.0.0
**Status**: ✅ Ready for Testing
