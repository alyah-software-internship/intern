# Quick Reference Card - iShare Payment System

## 🚀 Quick Start for Developers

### Test Payment (5 minutes)

```bash
# 1. Start backend
cd backend && php artisan serve

# 2. Start frontend
cd frontend && npm run dev

# 3. Login as customer
# 4. Create booking, get vendor approval
# 5. Navigate to /payment-flow/BOOKING_ID
# 6. Select "Mock Payment (Testing)"
# 7. Click "Pay Now"
# 8. Confirm on mock payment page
```

### Test Withdrawal (10 minutes)

```bash
# 1. Login as vendor
# 2. Visit /vendor/my-wallet
# 3. Click "Request Withdrawal"
# 4. Enter amount, select bank
# 5. Login as admin
# 6. Visit /admin/withdrawals
# 7. Approve, process, complete
```

---

## 📱 Component Map

```
Frontend/
├── customer/
│   └── PaymentFlowPage.jsx          → /payment-flow/:bookingId
├── vendor/
│   ├── VendorWalletPage.jsx         → /vendor/my-wallet
│   └── VendorWithdrawalsPage.jsx    → /vendor/withdrawals
└── admin/
    ├── AdminFinancialDashboard.jsx  → /admin/financial/dashboard
    ├── AdminPaymentsPage.jsx        → /admin/payments
    ├── AdminWithdrawalsPage.jsx     → /admin/withdrawals
    └── AdminRefundsPage.jsx         → /admin/refunds
```

---

## 🔌 API Endpoints Quick Lookup

### Customer

```
POST   /api/payments/initiate           # Get payment_url
GET    /api/payments/{id}/verify        # Check status (poll)
POST   /api/payments/webhook            # Webhook receiver
```

### Vendor

```
GET    /api/vendor/wallet               # Balance summary
GET    /api/vendor/wallet/transactions  # Transaction list
GET    /api/vendor/withdrawals          # Withdrawal list
POST   /api/vendor/withdrawals          # Create withdrawal
DELETE /api/vendor/withdrawals/{id}     # Cancel withdrawal
```

### Admin

```
GET    /api/admin/payments              # All payments
POST   /api/admin/payments/{id}/refund  # Refund payment
GET    /api/admin/withdrawals           # All withdrawals
POST   /api/admin/withdrawals/{id}/approve
POST   /api/admin/withdrawals/{id}/reject
POST   /api/admin/withdrawals/{id}/processing
POST   /api/admin/withdrawals/{id}/complete
GET    /api/admin/refunds               # All refunds
```

---

## 🔐 Authentication Header

```javascript
// Always include for authenticated requests:
headers: {
  'Authorization': `Bearer ${localStorage.getItem('authToken')}`
}
```

---

## 💡 Common Code Patterns

### Fetch with Auth (React)

```javascript
const [data, setData] = useState(null);
const { backendUrl } = useContext(AppContext);

useEffect(() => {
  axios
    .get(`${backendUrl}/endpoint`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    })
    .then((res) => setData(res.data))
    .catch((err) => messageApi.error(err.response?.data?.message));
}, []);
```

### API Response Format

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {},
  "pagination": {
    "current_page": 1,
    "per_page": 15,
    "total": 100
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Error message"]
  }
}
```

---

## 🗄️ Database Quick Facts

### Critical Fields

- `payments.provider_reference` - UNIQUE, prevents duplicate processing
- `payments.idempotency_key` - UNIQUE, webhook duplicate prevention
- `vendor_payouts.payout_status` - Tracks workflow (pending→approved→processing→completed)
- `wallet_transactions.type` - Audit trail breakdown

### Important Relationships

- `Payment` ← belongs to → `Booking`, `User (customer)`, `VendorProfile`
- `VendorPayout` ← belongs to → `User (vendor)`, `PaymentMethod`
- `Refund` ← belongs to → `Payment`, `Booking`, `User (initiated_by)`

---

## 🧪 Testing Checklist

### Customer Payment

- [ ] Booking shows after vendor approval
- [ ] /payment-flow page loads
- [ ] Provider dropdown shows all options
- [ ] "Pay Now" redirects to payment page
- [ ] Polling detects payment completion
- [ ] Auto-redirect on success works

### Vendor Wallet

- [ ] Wallet summary displays correct balances
- [ ] Transaction history shows all events
- [ ] Withdrawal form validates amount
- [ ] Pending withdrawal appears in list

### Admin Controls

- [ ] Dashboard loads all KPIs
- [ ] Can filter payments by status/date
- [ ] Can initiate refund for paid payment
- [ ] Can approve/reject/complete withdrawals
- [ ] Can view refund details

---

## 🐛 Common Issues & Fixes

### Issue: "401 Unauthorized"

**Fix**: Check auth token in localStorage

```javascript
localStorage.getItem("authToken"); // Should exist
```

### Issue: Payment webhook not firing

**Fix**: Ensure webhook endpoint is PUBLIC (no auth middleware)

```
POST /api/payments/webhook  # No auth:sanctum middleware
```

### Issue: Admin endpoints return 403

**Fix**: Verify user has 'admin' role

```php
// In middleware check:
if ($user->role !== 'admin') return 403;
```

### Issue: Withdrawal amount stays reserved

**Fix**: Check rejection clears reservation

```php
// Should return amount to available_balance
$walletService->releaseWithdrawalReservation($withdrawal);
```

---

## 📊 Key Numbers

| Metric                     | Value        |
| -------------------------- | ------------ |
| Polling Interval           | 3 seconds    |
| Page Size (Paginated)      | 15 items     |
| Platform Fee %             | Configurable |
| DB Transaction Timeout     | 10 seconds   |
| API Response Time (Target) | < 500ms      |

---

## 🚨 Important Notes

1. **Platform Fee**: Always calculated on backend, never trust frontend calculation
2. **Idempotency**: Payment provider reference must be unique to prevent double-charging
3. **Webhook Security**: Always validate signature before processing
4. **Wallet Updates**: Use WalletService transactions for audit trail
5. **Admin Actions**: Always log who approved/rejected what and when

---

## 💻 Development Commands

### Backend

```bash
# Start server
php artisan serve

# Run migrations
php artisan migrate

# Clear cache
php artisan cache:clear

# Check routes
php artisan route:list | grep payment

# Create test data
php artisan tinker
```

### Frontend

```bash
# Start dev server
npm run dev

# Build production
npm run build

# Format code
npm run lint

# Check types
npm run type-check
```

---

## 📚 File Locations

| Component             | Location                                                    |
| --------------------- | ----------------------------------------------------------- |
| Payment Flow          | `frontend/src/page/customer/PaymentFlowPage.jsx`            |
| Vendor Wallet         | `frontend/src/page/vendor/VendorWalletPage.jsx`             |
| Admin Dashboard       | `frontend/src/page/admin/AdminFinancialDashboard.jsx`       |
| Payment Service       | `backend/app/Services/PaymentService.php`                   |
| Withdrawal Controller | `backend/app/Http/Controllers/Api/WithdrawalController.php` |
| API Routes            | `backend/routes/api.php`                                    |

---

## 🔗 Related Documentation

- **Full Guide**: See `PAYMENT_SYSTEM_GUIDE.md`
- **Implementation Details**: See `IMPLEMENTATION_SUMMARY.md`
- **Models**: `backend/app/Models/{Payment,Refund,VendorPayout}.php`
- **Services**: `backend/app/Services/{PaymentService,WalletService}.php`

---

## ✅ Pre-Deployment Checklist

- [ ] All payment providers configured
- [ ] Webhook endpoint is HTTPS (production)
- [ ] Database backups configured
- [ ] Error logging configured
- [ ] Performance monitoring enabled
- [ ] Load testing completed
- [ ] Security audit passed
- [ ] Documentation updated
- [ ] Team trained on workflow

---

**Quick Reference v1.0**
_Keep this card open while developing_
