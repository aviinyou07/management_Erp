-- ============================================================
-- HR Leave Management System — Database Schema
-- Run this file once to initialise the database
-- ============================================================

CREATE DATABASE IF NOT EXISTS hr_leave_db;
USE hr_leave_db;

-- ---------------------------------------------------------------
-- Table: users
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id           INT          UNSIGNED NOT NULL AUTO_INCREMENT,
  name         VARCHAR(100) NOT NULL,
  email        VARCHAR(150) NOT NULL UNIQUE,
  password     VARCHAR(255) NOT NULL,
  role         ENUM('employee','admin') NOT NULL DEFAULT 'employee',
  department   VARCHAR(100) DEFAULT NULL,
  created_at   DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_email (email),
  INDEX idx_role  (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------
-- Table: leave_balance
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leave_balance (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id       INT UNSIGNED NOT NULL,
  annual_total  INT NOT NULL DEFAULT 18,
  annual_used   INT NOT NULL DEFAULT 0,
  sick_total    INT NOT NULL DEFAULT 8,
  sick_used     INT NOT NULL DEFAULT 0,
  casual_total  INT NOT NULL DEFAULT 4,
  casual_used   INT NOT NULL DEFAULT 0,
  lwop_used     INT NOT NULL DEFAULT 0,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user (user_id),
  CONSTRAINT fk_lb_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------
-- Table: leaves
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS leaves (
  id          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  user_id     INT UNSIGNED  NOT NULL,
  leave_type  ENUM('Annual','Sick','Casual','LWOP') NOT NULL,
  start_date  DATE          NOT NULL,
  end_date    DATE          NOT NULL,
  duration    INT           NOT NULL DEFAULT 1,
  reason      TEXT          NOT NULL,
  status      ENUM('Pending','Approved','Rejected') NOT NULL DEFAULT 'Pending',
  applied_on  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_by INT UNSIGNED  DEFAULT NULL,
  reviewed_at DATETIME      DEFAULT NULL,
  PRIMARY KEY (id),
  INDEX idx_leaves_user   (user_id),
  INDEX idx_leaves_status (status),
  INDEX idx_leaves_dates  (start_date, end_date),
  CONSTRAINT fk_leaves_user     FOREIGN KEY (user_id)     REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_leaves_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------
-- Table: holidays
-- ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS holidays (
  id    INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  name  VARCHAR(150)  NOT NULL,
  date  DATE          NOT NULL UNIQUE,
  type  VARCHAR(100)  NOT NULL DEFAULT 'National Holiday',
  PRIMARY KEY (id),
  INDEX idx_holiday_date (date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------
-- Seed: sample admin user  (password: Admin@123)
-- ---------------------------------------------------------------
INSERT IGNORE INTO users (name, email, password, role, department)
VALUES (
  'Admin User',
  'admin@company.com',
  '$2a$12$KIX9z3oBMaQBbhMSEqXXj.RKr6Xj1Y3zLbqVNhW2yZR3cF4d9U8lO',
  'admin',
  'HR'
);

-- Seed: sample employee (password: Employee@123)
INSERT IGNORE INTO users (name, email, password, role, department)
VALUES (
  'John Doe',
  'john@company.com',
  '$2a$12$LIX9z3oBMaQBbhMSEqXXj.RKr6Xj1Y3zLbqVNhW2yZR3cF4d9U8lO',
  'employee',
  'Engineering'
);

-- Seed: holidays 2026
INSERT IGNORE INTO holidays (name, date, type) VALUES
  ('New Year''s Day',    '2026-01-01', 'National Holiday'),
  ('Republic Day',       '2026-01-26', 'National Holiday'),
  ('Holi',               '2026-03-14', 'Festival Holiday'),
  ('Good Friday',        '2026-04-03', 'National Holiday'),
  ('Independence Day',   '2026-08-15', 'National Holiday'),
  ('Gandhi Jayanti',     '2026-10-02', 'National Holiday'),
  ('Diwali',             '2026-10-20', 'Festival Holiday'),
  ('Christmas Day',      '2026-12-25', 'National Holiday');
