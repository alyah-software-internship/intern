-- =============================================
-- i-Share Multi-Vendor Rental Marketplace
-- MySQL Database Schema (v5.1 - Bugfixed & Hardened)
-- =============================================



-- 15 table 

CREATE DATABASE IF NOT EXISTS ishare;
USE ishare;

-- 1. USERS TABLE
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    full_name_am VARCHAR(255),
    phone VARCHAR(50),
    phone_verified_at TIMESTAMP NULL,
    avatar_url VARCHAR(500),
    role ENUM('admin', 'vendor', 'customer', 'operator') DEFAULT 'customer',
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP NULL,
    last_login_at TIMESTAMP NULL,
    login_attempts INT DEFAULT 0,
    locked_until TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    INDEX idx_email (email),
    INDEX idx_role (role),
    INDEX idx_is_active (is_active),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. NOTIFICATIONS (ADDED MISSING DEPENDENCY)
CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link VARCHAR(255) NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_read (is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. CATEGORIES (ADDED MISSING DEPENDENCY)
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    name_am VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    image_url VARCHAR(500) NULL,
    parent_id INT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. VENDOR PROFILES
CREATE TABLE vendor_profiles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    business_name_am VARCHAR(255),
    business_type VARCHAR(100),
    business_type_am VARCHAR(100),
    description TEXT,
    description_am TEXT,
    address VARCHAR(500),
    address_am VARCHAR(500),
    city VARCHAR(100),
    city_am VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Ethiopia',
    postal_code VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    logo_url VARCHAR(500),
    cover_image_url VARCHAR(500),
    tax_id VARCHAR(100),
    registration_number VARCHAR(100),
    verification_status ENUM('pending', 'under_review', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
    identity_verified BOOLEAN DEFAULT FALSE,
    identity_verified_at TIMESTAMP NULL,
    verification_approved_at TIMESTAMP NULL,
    payment_methods_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_bookings INT DEFAULT 0,
    total_revenue DECIMAL(10,2) DEFAULT 0.00,
    pending_payouts DECIMAL(10,2) DEFAULT 0.00,
    security_deposit_held DECIMAL(10,2) DEFAULT 0.00,
    response_time_avg DECIMAL(5,2) DEFAULT 0.00,
    joined_date DATE,
    completed_projects INT DEFAULT 0,
    trust_score INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_verification_status (verification_status),
    INDEX idx_is_active (is_active),
    INDEX idx_city (city)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. IDENTITY DOCUMENTS
CREATE TABLE identity_documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    document_type ENUM('national_id', 'passport', 'drivers_license', 'voter_id', 'other') NOT NULL,
    document_number VARCHAR(100) NOT NULL,
    document_country VARCHAR(100) DEFAULT 'Ethiopia',
    document_issue_date DATE,
    document_expiry_date DATE,
    document_front_url VARCHAR(500) NOT NULL,
    document_back_url VARCHAR(500),
    selfie_with_document_url VARCHAR(500),
    verification_status ENUM('pending', 'under_review', 'verified', 'rejected', 'expired') DEFAULT 'pending',
    verification_notes TEXT,
    verified_by INT NULL,
    verified_at TIMESTAMP NULL,
    rejection_reason TEXT,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_document (user_id, document_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. VENDOR PAYMENT METHODS
CREATE TABLE vendor_payment_methods (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT NOT NULL,
    payment_type ENUM('bank_transfer', 'mobile_money', 'paypal', 'stripe', 'chapa', 'telebirr', 'other') NOT NULL,
    account_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(100) NOT NULL,
    bank_name VARCHAR(255),
    bank_branch VARCHAR(255),
    swift_code VARCHAR(50),
    mobile_provider VARCHAR(100),
    mobile_number VARCHAR(50),
    paypal_email VARCHAR(255),
    stripe_account_id VARCHAR(255),
    chapa_account_id VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by INT NULL,
    verified_at TIMESTAMP NULL,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. OPERATORS
CREATE TABLE operators (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT NOT NULL,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    full_name_am VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    address VARCHAR(500),
    specialization VARCHAR(255),
    specialization_am VARCHAR(255),
    experience_years INT DEFAULT 0,
    hourly_rate DECIMAL(10,2) DEFAULT 0.00,
    daily_rate DECIMAL(10,2) DEFAULT 0.00,
    weekly_rate DECIMAL(10,2) DEFAULT 0.00,
    monthly_rate DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    verified_by INT NULL,
    verified_at TIMESTAMP NULL,
    certification_url VARCHAR(500),
    id_document_url VARCHAR(500),
    profile_image_url VARCHAR(500),
    bio TEXT,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    total_assignments INT DEFAULT 0,
    available_status ENUM('available', 'busy', 'on_leave', 'unavailable') DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (verified_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. PRODUCTS (UPDATED: DATETIME / Inventory enhancements)
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT NOT NULL,
    category_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    name_am VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    description_am TEXT,
    pricing_model ENUM('hourly', 'daily', 'weekly', 'monthly', 'flexible') DEFAULT 'daily',
    price_hourly DECIMAL(10,2) DEFAULT 0.00,
    price_daily DECIMAL(10,2) DEFAULT 0.00,
    price_weekly DECIMAL(10,2) DEFAULT 0.00,
    price_monthly DECIMAL(10,2) DEFAULT 0.00,
    price_flexible DECIMAL(10,2) DEFAULT 0.00,
    security_deposit_type ENUM('percentage', 'fixed') DEFAULT 'fixed',
    security_deposit_amount DECIMAL(10,2) DEFAULT 0.00,
    security_deposit_percentage DECIMAL(5,2) DEFAULT 0.00,
    security_deposit_held BOOLEAN DEFAULT TRUE,
    security_deposit_refund_days INT DEFAULT 3,
    operator_required BOOLEAN DEFAULT FALSE,
    operator_included BOOLEAN DEFAULT FALSE,
    operator_charge_type ENUM('hourly', 'daily', 'weekly', 'monthly', 'fixed') DEFAULT 'daily',
    operator_charge_amount DECIMAL(10,2) DEFAULT 0.00,
    quantity INT DEFAULT 1,
    status ENUM('active', 'inactive', 'pending', 'suspended') DEFAULT 'pending',
    availability_status ENUM('available', 'unavailable', 'booked', 'maintenance') DEFAULT 'available',
    is_featured BOOLEAN DEFAULT FALSE,
    views_count INT DEFAULT 0,
    rating DECIMAL(3,2) DEFAULT 0.00,
    total_reviews INT DEFAULT 0,
    specifications JSON,
    rental_policies JSON,
    delivery_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FULLTEXT idx_search (name, description, name_am, description_am)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. PRODUCT IMAGES (ADDED: MULTIPLE IMAGES PER PRODUCT)
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    is_primary BOOLEAN DEFAULT FALSE,
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    INDEX idx_product_id (product_id),
    INDEX idx_is_primary (is_primary),
    UNIQUE KEY unique_product_image_order (product_id, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. PRODUCT OPERATOR ASSIGNMENTS
CREATE TABLE product_operator_assignments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    operator_id INT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    assignment_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE CASCADE,
    UNIQUE KEY unique_product_operator (product_id, operator_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. OPERATOR AVAILABILITY
CREATE TABLE operator_availability (
    id INT PRIMARY KEY AUTO_INCREMENT,
    operator_id INT NOT NULL,
    date DATE NOT NULL,
    status ENUM('available', 'booked', 'unavailable', 'holiday') DEFAULT 'available',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE CASCADE,
    UNIQUE KEY unique_operator_date (operator_id, date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. BOOKINGS (UPDATED DATETIME FOR HOURLY SUPPORT)
CREATE TABLE bookings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_reference VARCHAR(50) UNIQUE NOT NULL,
    product_id INT NOT NULL,
    customer_id INT NOT NULL,
    vendor_id INT NOT NULL,
    operator_id INT NULL,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    rental_days INT NOT NULL DEFAULT 1,
    rental_hours INT DEFAULT 0,
    pricing_model ENUM('hourly', 'daily', 'weekly', 'monthly', 'flexible') DEFAULT 'daily',
    rental_amount DECIMAL(10,2) NOT NULL,
    operator_charge DECIMAL(10,2) DEFAULT 0.00,
    security_deposit_amount DECIMAL(10,2) DEFAULT 0.00,
    delivery_charge DECIMAL(10,2) DEFAULT 0.00,
    discount_amount DECIMAL(10,2) DEFAULT 0.00,
    coupon_code VARCHAR(50),
    platform_fee DECIMAL(10,2) DEFAULT 0.00,
    total_amount DECIMAL(10,2) NOT NULL,
    vendor_payment DECIMAL(10,2) NOT NULL,
    platform_commission DECIMAL(10,2) DEFAULT 0.00,
    security_deposit_held BOOLEAN DEFAULT TRUE,
    status ENUM('pending', 'confirmed', 'active', 'completed', 'cancelled', 'rejected') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid', 'failed', 'refunded', 'partially_refunded') DEFAULT 'pending',
    security_deposit_status ENUM('pending', 'held', 'released', 'refunded', 'deducted') DEFAULT 'pending',
    operator_status ENUM('pending', 'assigned', 'confirmed', 'declined', 'completed') DEFAULT 'pending',
    payment_method VARCHAR(50),
    transaction_id VARCHAR(255),
    delivery_address VARCHAR(500),
    delivery_address_am VARCHAR(500),
    special_requests TEXT,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id),
    FOREIGN KEY (operator_id) REFERENCES operators(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. PAYMENTS
CREATE TABLE payments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    user_id INT NOT NULL,
    vendor_id INT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_type ENUM('rental', 'security_deposit', 'operator', 'delivery', 'platform_fee', 'refund') NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(255) UNIQUE,
    status ENUM('pending', 'processing', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_data JSON,
    refund_amount DECIMAL(10,2) DEFAULT 0,
    refund_transaction_id VARCHAR(255),
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. SECURITY DEPOSITS
CREATE TABLE security_deposits (
    id INT PRIMARY KEY AUTO_INCREMENT,
    booking_id INT NOT NULL,
    customer_id INT NOT NULL,
    vendor_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'held', 'released', 'refunded', 'deducted', 'disputed') DEFAULT 'pending',
    payment_transaction_id VARCHAR(255),
    release_transaction_id VARCHAR(255),
    refund_transaction_id VARCHAR(255),
    held_at TIMESTAMP NULL,
    released_at TIMESTAMP NULL,
    refunded_at TIMESTAMP NULL,
    deducted_amount DECIMAL(10,2) DEFAULT 0,
    deduction_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (booking_id) REFERENCES bookings(id),
    FOREIGN KEY (customer_id) REFERENCES users(id),
    FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id),
    UNIQUE KEY unique_booking_deposit (booking_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. VENDOR PAYOUTS
CREATE TABLE vendor_payouts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    vendor_id INT NOT NULL,
    payment_method_id INT NOT NULL,
    booking_id INT NULL,
    amount DECIMAL(10,2) NOT NULL,
    platform_commission DECIMAL(10,2) DEFAULT 0.00,
    net_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'completed', 'failed', 'cancelled') DEFAULT 'pending',
    transaction_id VARCHAR(255),
    reference_number VARCHAR(100),
    processing_fee DECIMAL(10,2) DEFAULT 0.00,
    notes TEXT,
    processed_by INT NULL,
    processed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (vendor_id) REFERENCES vendor_profiles(id) ON DELETE CASCADE,
    FOREIGN KEY (payment_method_id) REFERENCES vendor_payment_methods(id) ON DELETE CASCADE,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL,
    FOREIGN KEY (processed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. PLATFORM COMMISSION SETTINGS
CREATE TABLE platform_commission_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    commission_type ENUM('percentage', 'fixed') DEFAULT 'percentage',
    commission_value DECIMAL(10,2) NOT NULL,
    min_commission DECIMAL(10,2) DEFAULT 0,
    max_commission DECIMAL(10,2) DEFAULT 0,
    applies_to ENUM('all', 'hourly', 'daily', 'weekly', 'monthly') DEFAULT 'all',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO platform_commission_settings (commission_type, commission_value, min_commission, applies_to, is_active) 
VALUES ('percentage', 10.00, 0.00, 'all', TRUE);

-- =============================================
-- HARDENED STORED PROCEDURES
-- =============================================

DELIMITER $$

-- 1. Create Booking Procedure
CREATE PROCEDURE create_booking(
    IN p_product_id INT,
    IN p_customer_id INT,
    IN p_start_date DATETIME,
    IN p_end_date DATETIME,
    IN p_operator_id INT,
    IN p_delivery_address VARCHAR(500),
    IN p_special_requests TEXT,
    IN p_payment_method VARCHAR(50)
)
BEGIN
    DECLARE v_vendor_id INT;
    DECLARE v_unit_price DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_rental_units INT DEFAULT 1;
    DECLARE v_operator_rate DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_operator_charge DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_rental_amount DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_security_deposit DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_commission_rate DECIMAL(5,2) DEFAULT 10.00;
    DECLARE v_platform_fee DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_total_amount DECIMAL(10,2) DEFAULT 0.00;
    DECLARE v_booking_reference VARCHAR(50);
    DECLARE v_booking_id INT;
    DECLARE v_pricing_model VARCHAR(20);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    -- Fetch product details with explicit lock
    SELECT 
        vendor_id, pricing_model,
        CASE 
            WHEN pricing_model = 'hourly' THEN price_hourly
            WHEN pricing_model = 'daily' THEN price_daily
            WHEN pricing_model = 'weekly' THEN price_weekly
            WHEN pricing_model = 'monthly' THEN price_monthly
            ELSE price_daily
        END,
        security_deposit_amount
    INTO 
        v_vendor_id, v_pricing_model, v_unit_price, v_security_deposit
    FROM products 
    WHERE id = p_product_id AND status = 'active' FOR UPDATE;

    -- Calculate duration
    IF v_pricing_model = 'hourly' THEN
        SET v_rental_units = GREATEST(1, TIMESTAMPDIFF(HOUR, p_start_date, p_end_date));
    ELSE
        SET v_rental_units = GREATEST(1, DATEDIFF(p_end_date, p_start_date));
    END IF;

    SET v_rental_amount = v_unit_price * v_rental_units;

    -- Calculate Operator Charges
    IF p_operator_id IS NOT NULL AND p_operator_id > 0 THEN
        SELECT 
            CASE 
                WHEN v_pricing_model = 'hourly' THEN hourly_rate
                WHEN v_pricing_model = 'daily' THEN daily_rate
                WHEN v_pricing_model = 'weekly' THEN weekly_rate
                WHEN v_pricing_model = 'monthly' THEN monthly_rate
                ELSE daily_rate
            END INTO v_operator_rate
        FROM operators 
        WHERE id = p_operator_id AND is_active = TRUE FOR UPDATE;
        
        SET v_operator_charge = v_operator_rate * v_rental_units;
    END IF;

    -- Calculate active commission
    SELECT commission_value INTO v_commission_rate 
    FROM platform_commission_settings 
    WHERE is_active = TRUE AND (applies_to = 'all' OR applies_to = v_pricing_model) 
    ORDER BY id DESC LIMIT 1;

    SET v_platform_fee = v_rental_amount * (v_commission_rate / 100.00);
    SET v_total_amount = v_rental_amount + v_operator_charge + v_security_deposit;

    -- Generate reference ID
    SET v_booking_reference = CONCAT('BK', DATE_FORMAT(NOW(), '%Y%m%d'), LPAD(FLOOR(RAND() * 1000000), 6, '0'));

    -- Create booking entry
    INSERT INTO bookings (
        booking_reference, product_id, customer_id, vendor_id, operator_id,
        start_date, end_date, rental_days, pricing_model,
        rental_amount, operator_charge, security_deposit_amount,
        platform_fee, total_amount, vendor_payment, platform_commission,
        delivery_address, special_requests, payment_method,
        status, payment_status, security_deposit_status
    ) VALUES (
        v_booking_reference, p_product_id, p_customer_id, v_vendor_id, p_operator_id,
        p_start_date, p_end_date, v_rental_units, v_pricing_model,
        v_rental_amount, v_operator_charge, v_security_deposit,
        v_platform_fee, v_total_amount, (v_rental_amount + v_operator_charge - v_platform_fee), v_platform_fee,
        p_delivery_address, p_special_requests, p_payment_method,
        'pending', 'pending', 'pending'
    );

    SET v_booking_id = LAST_INSERT_ID();

    -- Create security deposit ledger record
    IF v_security_deposit > 0 THEN
        INSERT INTO security_deposits (
            booking_id, customer_id, vendor_id, amount, status
        ) VALUES (
            v_booking_id, p_customer_id, v_vendor_id, v_security_deposit, 'pending'
        );
    END IF;

    -- Notifications
    INSERT INTO notifications (user_id, type, title, message, link) VALUES
    ((SELECT user_id FROM vendor_profiles WHERE id = v_vendor_id), 'new_booking', 'New Booking Request', 
     CONCAT('You have a new booking request. Ref: ', v_booking_reference), CONCAT('/vendor/bookings/', v_booking_id)),
    (p_customer_id, 'booking_created', 'Booking Created', 
     CONCAT('Your booking has been created. Ref: ', v_booking_reference), CONCAT('/customer/bookings/', v_booking_id));

    COMMIT;

    SELECT v_booking_id AS booking_id, v_booking_reference AS booking_reference;
END$$

-- 2. Process Booking Payment
CREATE PROCEDURE process_booking_payment(
    IN p_booking_id INT,
    IN p_payment_method VARCHAR(50),
    IN p_transaction_id VARCHAR(255),
    IN p_payment_data JSON
)
BEGIN
    DECLARE v_customer_id INT;
    DECLARE v_vendor_id INT;
    DECLARE v_rental_amount DECIMAL(10,2);
    DECLARE v_security_deposit DECIMAL(10,2);
    DECLARE v_platform_fee DECIMAL(10,2);
    DECLARE v_total_amount DECIMAL(10,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT 
        customer_id, vendor_id, rental_amount, security_deposit_amount,
        platform_fee, total_amount
    INTO 
        v_customer_id, v_vendor_id, v_rental_amount, v_security_deposit,
        v_platform_fee, v_total_amount
    FROM bookings 
    WHERE id = p_booking_id AND status = 'pending' FOR UPDATE;

    -- Rental Payment Record
    INSERT INTO payments (
        booking_id, user_id, vendor_id, amount, payment_type,
        payment_method, transaction_id, payment_data, status
    ) VALUES (
        p_booking_id, v_customer_id, v_vendor_id, v_rental_amount, 'rental',
        p_payment_method, CONCAT(p_transaction_id, '-RENT'), p_payment_data, 'completed'
    );

    -- Security Deposit Record
    IF v_security_deposit > 0 THEN
        INSERT INTO payments (
            booking_id, user_id, vendor_id, amount, payment_type,
            payment_method, transaction_id, payment_data, status
        ) VALUES (
            p_booking_id, v_customer_id, v_vendor_id, v_security_deposit, 'security_deposit',
            p_payment_method, CONCAT(p_transaction_id, '-DEP'), p_payment_data, 'completed'
        );

        UPDATE security_deposits 
        SET status = 'held', held_at = NOW()
        WHERE booking_id = p_booking_id;
    END IF;

    -- Update Booking Status
    UPDATE bookings 
    SET payment_status = 'paid', status = 'confirmed', transaction_id = p_transaction_id
    WHERE id = p_booking_id;

    -- Update Vendor Financial Counters
    UPDATE vendor_profiles 
    SET 
        total_bookings = total_bookings + 1,
        pending_payouts = pending_payouts + (v_rental_amount - v_platform_fee),
        security_deposit_held = security_deposit_held + v_security_deposit
    WHERE id = v_vendor_id;

    COMMIT;
    SELECT 'Payment processed successfully' AS message;
END$$

-- 3. Release Security Deposit Procedure
CREATE PROCEDURE release_security_deposit(
    IN p_booking_id INT,
    IN p_refund_amount DECIMAL(10,2),
    IN p_deduction_reason TEXT
)
BEGIN
    DECLARE v_customer_id INT;
    DECLARE v_vendor_id INT;
    DECLARE v_deposit_amount DECIMAL(10,2);
    DECLARE v_actual_refund DECIMAL(10,2);

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT customer_id, vendor_id, amount
    INTO v_customer_id, v_vendor_id, v_deposit_amount
    FROM security_deposits 
    WHERE booking_id = p_booking_id FOR UPDATE;

    SET v_actual_refund = COALESCE(p_refund_amount, v_deposit_amount);

    IF v_actual_refund >= v_deposit_amount THEN
        UPDATE security_deposits 
        SET status = 'released', released_at = NOW(), notes = 'Full deposit released'
        WHERE booking_id = p_booking_id;
        
        UPDATE bookings SET security_deposit_status = 'released' WHERE id = p_booking_id;
    ELSE
        UPDATE security_deposits 
        SET status = 'deducted', deducted_amount = (v_deposit_amount - v_actual_refund),
            deduction_reason = p_deduction_reason, refunded_at = NOW()
        WHERE booking_id = p_booking_id;

        UPDATE bookings SET security_deposit_status = 'deducted' WHERE id = p_booking_id;
    END IF;

    -- Write Refund Ledger
    INSERT INTO payments (
        booking_id, user_id, vendor_id, amount, payment_type,
        payment_method, transaction_id, status
    ) VALUES (
        p_booking_id, v_customer_id, v_vendor_id, v_actual_refund, 'refund',
        'security_deposit', CONCAT('REF-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', p_booking_id), 'completed'
    );

    UPDATE vendor_profiles 
    SET security_deposit_held = GREATEST(0, security_deposit_held - v_deposit_amount)
    WHERE id = v_vendor_id;

    COMMIT;
    SELECT 'Security deposit process complete' AS message;
END$$

-- 4. Complete Booking Procedure (FIXED TRUNCATION)
CREATE PROCEDURE complete_booking(
    IN p_booking_id INT,
    IN p_operator_performance_rating INT,
    IN p_operator_performance_notes TEXT
)
BEGIN
    DECLARE v_vendor_id INT;
    DECLARE v_operator_id INT;
    DECLARE v_customer_id INT;

    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        RESIGNAL;
    END;

    START TRANSACTION;

    SELECT vendor_id, operator_id, customer_id
    INTO v_vendor_id, v_operator_id, v_customer_id
    FROM bookings WHERE id = p_booking_id FOR UPDATE;

    UPDATE bookings 
    SET status = 'completed', completed_at = NOW()
    WHERE id = p_booking_id;

    IF v_operator_id IS NOT NULL THEN
        UPDATE operators 
        SET total_assignments = total_assignments + 1, available_status = 'available'
        WHERE id = v_operator_id;
    END IF;

    UPDATE vendor_profiles 
    SET completed_projects = completed_projects + 1
    WHERE id = v_vendor_id;

    COMMIT;
    SELECT 'Booking marked as completed' AS message;
END$$

DELIMITER ;