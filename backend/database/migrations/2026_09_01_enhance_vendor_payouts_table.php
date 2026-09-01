<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('vendor_payouts', function (Blueprint $table) {
            // Add admin note field
            if (!Schema::hasColumn('vendor_payouts', 'admin_note')) {
                $table->text('admin_note')->nullable()->after('notes');
            }
            
            // Change status enum to include all statuses from spec
            if (!Schema::hasColumn('vendor_payouts', 'payout_status')) {
                $table->enum('payout_status', [
                    'pending', 'approved', 'processing', 'completed', 'rejected'
                ])->default('pending')->after('status');
            }
            
            // Add approval tracking
            if (!Schema::hasColumn('vendor_payouts', 'approved_by')) {
                $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null')->after('processed_by');
            }
            
            if (!Schema::hasColumn('vendor_payouts', 'approved_at')) {
                $table->timestamp('approved_at')->nullable()->after('processed_at');
            }
            
            // Add rejection tracking
            if (!Schema::hasColumn('vendor_payouts', 'rejected_by')) {
                $table->foreignId('rejected_by')->nullable()->constrained('users')->onDelete('set null')->after('approved_by');
            }
            
            if (!Schema::hasColumn('vendor_payouts', 'rejected_at')) {
                $table->timestamp('rejected_at')->nullable()->after('approved_at');
            }
            
            if (!Schema::hasColumn('vendor_payouts', 'rejection_reason')) {
                $table->text('rejection_reason')->nullable()->after('rejected_at');
            }
        });
    }

    public function down(): void
    {
        Schema::table('vendor_payouts', function (Blueprint $table) {
            $table->dropForeign(['approved_by']);
            $table->dropForeign(['rejected_by']);
            $table->dropColumn([
                'admin_note',
                'payout_status',
                'approved_by',
                'approved_at',
                'rejected_by',
                'rejected_at',
                'rejection_reason',
            ]);
        });
    }
};
