<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\BookingService;
use App\Services\ProductService;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class BookingController extends Controller
{
    protected $bookingService;
    protected $productService;
    protected $notificationService;

    public function __construct(
        BookingService $bookingService,
        ProductService $productService,
        NotificationService $notificationService
    ) {
        $this->bookingService = $bookingService;
        $this->productService = $productService;
        $this->notificationService = $notificationService;
    }

    /**
     * Create a new booking
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'start_date' => 'required|date|after_or_equal:today',
            'end_date' => 'required|date|after:start_date',
            'operator_id' => 'nullable|exists:operators,id',
            'delivery_address' => 'nullable|string|max:500',
            'special_requests' => 'nullable|string',
            'delivery_charge' => 'nullable|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $data = $request->all();
            $data['customer_id'] = $request->user()->id;
            $data['start_date'] = \Carbon\Carbon::parse($data['start_date']);
            $data['end_date'] = \Carbon\Carbon::parse($data['end_date']);

            $booking = $this->bookingService->createBooking($data);

            return response()->json([
                'success' => true,
                'message' => 'Booking created successfully',
                'booking' => $booking,
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get user bookings
     */
    public function index(Request $request)
    {
        try {
            $bookings = $this->bookingService->getUserBookings(
                $request->user()->id,
                $request->status ?? null
            );

            return response()->json([
                'success' => true,
                'bookings' => $bookings,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get booking details
     */
    public function show($id, Request $request)
    {
        try {
            $booking = $this->bookingService->getBookingDetails(
                $id,
                $request->user()->id
            );

            if (!$booking) {
                return response()->json([
                    'success' => false,
                    'message' => 'Booking not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'booking' => $booking,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get booking details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get vendor bookings
     */
    public function vendorBookings(Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $bookings = $this->bookingService->getVendorBookings(
                $vendor->id,
                $request->status ?? null
            );

            return response()->json([
                'success' => true,
                'bookings' => $bookings,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get vendor bookings',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Approve booking (Vendor only)
     */
    public function approve($id, Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $booking = $this->bookingService->approveBooking($id, $vendor->id);

            return response()->json([
                'success' => true,
                'message' => 'Booking approved successfully',
                'booking' => $booking,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Reject booking (Vendor only)
     */
    public function reject($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $booking = $this->bookingService->rejectBooking(
                $id,
                $vendor->id,
                $request->reason
            );

            return response()->json([
                'success' => true,
                'message' => 'Booking rejected successfully',
                'booking' => $booking,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to reject booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Cancel booking (Customer only)
     */
    public function cancel($id, Request $request)
    {
        $validator = Validator::make($request->all(), [
            'reason' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $booking = $this->bookingService->cancelBooking(
                $id,
                $request->user()->id,
                $request->reason
            );

            return response()->json([
                'success' => true,
                'message' => 'Booking cancelled successfully',
                'booking' => $booking,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Complete booking (Vendor only)
     */
    public function complete($id, Request $request)
    {
        try {
            $vendor = $request->user()->vendorProfile;
            
            if (!$vendor) {
                return response()->json([
                    'success' => false,
                    'message' => 'You are not registered as a vendor'
                ], 403);
            }

            $booking = $this->bookingService->completeBooking($id, $vendor->id);

            return response()->json([
                'success' => true,
                'message' => 'Booking completed successfully',
                'booking' => $booking,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to complete booking',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}