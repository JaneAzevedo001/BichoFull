-- =====================================================
-- BichoFull - MySQL Database
-- Animal Game Simulation System
-- =====================================================

-- Create database
CREATE DATABASE IF NOT EXISTS bicho_full;
USE bicho_full;

-- =====================================
-- 1. USERS
-- =====================================
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    balance DECIMAL(12,2) NOT NULL DEFAULT 1000.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- 2. ANIMALS (GROUPS)
-- =====================================
CREATE TABLE animals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    group_number INT NOT NULL UNIQUE,
    animal_name VARCHAR(50) NOT NULL
);

-- =====================================
-- 3. GROUP NUMBERS (DEZENAS)
-- =====================================
CREATE TABLE group_numbers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    animal_id INT NOT NULL,
    number CHAR(2) NOT NULL,

    CONSTRAINT fk_group_animal
        FOREIGN KEY (animal_id) REFERENCES animals(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_group_number UNIQUE (animal_id, number)
);

-- =====================================
-- 4. DRAWS
-- =====================================
CREATE TABLE draws (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    draw_datetime TIMESTAMP,
    status ENUM('PENDING', 'PROCESSING', 'FINISHED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================
-- 5. DRAW RESULTS
-- =====================================
CREATE TABLE draw_results (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    draw_id BIGINT NOT NULL,
    position INT NOT NULL,
    drawn_thousand CHAR(4) NOT NULL,
    CONSTRAINT fk_result_draw FOREIGN KEY (draw_id) REFERENCES draws(id) ON DELETE CASCADE,
    CONSTRAINT chk_position CHECK (position BETWEEN 1 AND 5),
    CONSTRAINT chk_thousand CHECK (drawn_thousand REGEXP '^[0-9]{4}$'),
    CONSTRAINT uq_draw_position UNIQUE (draw_id, position)
);

-- =====================================
-- 6. BETS
-- =====================================
-- CREATE TABLE bets (
--     id BIGINT AUTO_INCREMENT PRIMARY KEY,
--     user_id BIGINT NOT NULL,
--     draw_id BIGINT NOT NULL,

--     bet_type ENUM('GROUP', 'DEZENA', 'MILHAR') NOT NULL,

--     animal_id INT NULL,
--     chosen_number VARCHAR(4) NULL,

--     bet_amount DECIMAL(10,2) NOT NULL,
--     status ENUM('PENDING', 'WON', 'LOST') DEFAULT 'PENDING',

--     bet_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

--     CONSTRAINT fk_bet_user
--         FOREIGN KEY (user_id) REFERENCES users(id),

--     CONSTRAINT fk_bet_draw
--         FOREIGN KEY (draw_id) REFERENCES draws(id),

--     CONSTRAINT fk_bet_animal
--         FOREIGN KEY (animal_id) REFERENCES animals(id),

--     -- Bet consistency rules
--     CONSTRAINT chk_bet_logic CHECK (
--         (bet_type = 'GROUP' AND animal_id IS NOT NULL AND chosen_number IS NULL)
--         OR
--         (bet_type = 'DEZENA' AND chosen_number REGEXP '^[0-9]{2}$')
--         OR
--         (bet_type = 'MILHAR' AND chosen_number REGEXP '^[0-9]{4}$')
--     )
-- );

CREATE TABLE bets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    bet_type ENUM('grupo','dezena','milhar') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    bet_value VARCHAR(4) NOT NULL,
    potential_prize DECIMAL(12,2) NOT NULL,
    status ENUM('pending','won','lost') DEFAULT 'pending',
    drawn_value VARCHAR(4) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_bet_user FOREIGN KEY (user_id) REFERENCES users(id)
);

-- =====================================
-- 7. WALLET (TRANSACTIONS)
-- =====================================
CREATE TABLE wallet_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    transaction_type ENUM('BET', 'WIN') NOT NULL,
    transaction_amount DECIMAL(12,2) NOT NULL,
    balance_after DECIMAL(12,2) NOT NULL,
    reference_id BIGINT,
    reference_type ENUM('BET', 'DRAW'),
    transaction_datetime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT chk_positive_amount CHECK (transaction_amount > 0)
);

-- =====================================
-- 8. INDEXES (PERFORMANCE)
-- =====================================
CREATE INDEX idx_bets_user ON bets(user_id);
CREATE INDEX idx_wallet_user ON wallet_transactions(user_id);
CREATE INDEX idx_results_draw ON draw_results(draw_id);