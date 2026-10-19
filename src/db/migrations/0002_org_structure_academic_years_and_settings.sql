-- Migration 0002: Organization Structure, Academic Years, and Refactored Settings
-- Description: Creates academic_years, campuses, buildings, floors, rooms, and settings tables.

-- 1. Academic Years Table
CREATE TABLE IF NOT EXISTS academic_years (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_current BOOLEAN DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'UPCOMING',
  settings JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_tenant_academic_year_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_academic_years_tenant ON academic_years(tenant_id);
CREATE INDEX IF NOT EXISTS idx_academic_years_current ON academic_years(is_current);

-- 2. Organization Structure: Campuses
CREATE TABLE IF NOT EXISTS campuses (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  address VARCHAR(255),
  city VARCHAR(100),
  phone VARCHAR(50),
  email VARCHAR(255),
  principal_name VARCHAR(255),
  is_main BOOLEAN DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_tenant_campus_code UNIQUE (tenant_id, code)
);

CREATE INDEX IF NOT EXISTS idx_campuses_tenant ON campuses(tenant_id);

-- 3. Organization Structure: Buildings
CREATE TABLE IF NOT EXISTS buildings (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campus_id VARCHAR(64) NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  total_floors INT DEFAULT 1,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_campus_building_code UNIQUE (campus_id, code)
);

CREATE INDEX IF NOT EXISTS idx_buildings_tenant ON buildings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_buildings_campus ON buildings(campus_id);

-- 4. Organization Structure: Floors
CREATE TABLE IF NOT EXISTS floors (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  building_id VARCHAR(64) NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  campus_id VARCHAR(64) NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  floor_number INT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_floors_building ON floors(building_id);

-- 5. Organization Structure: Rooms
CREATE TABLE IF NOT EXISTS rooms (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campus_id VARCHAR(64) NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  building_id VARCHAR(64) NOT NULL REFERENCES buildings(id) ON DELETE CASCADE,
  floor_id VARCHAR(64) NOT NULL REFERENCES floors(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) NOT NULL,
  room_type VARCHAR(50) NOT NULL DEFAULT 'CLASSROOM',
  capacity INT DEFAULT 30,
  facilities JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
  academic_year_id VARCHAR(64) REFERENCES academic_years(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_building_room_code UNIQUE (building_id, code)
);

CREATE INDEX IF NOT EXISTS idx_rooms_floor ON rooms(floor_id);
CREATE INDEX IF NOT EXISTS idx_rooms_academic_year ON rooms(academic_year_id);

-- 6. Refactored Settings: Platform Settings
CREATE TABLE IF NOT EXISTS platform_settings (
  id VARCHAR(64) PRIMARY KEY,
  maintenance_mode BOOLEAN DEFAULT false,
  default_tenant_plan VARCHAR(30) DEFAULT 'STARTER',
  support_email VARCHAR(255) NOT NULL,
  allow_self_registration BOOLEAN DEFAULT false,
  global_notification_notice TEXT,
  max_campuses_per_tenant INT DEFAULT 10,
  ai_integration_enabled BOOLEAN DEFAULT true,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Refactored Settings: Tenant Settings
CREATE TABLE IF NOT EXISTS tenant_settings (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL UNIQUE REFERENCES tenants(id) ON DELETE CASCADE,
  school_name VARCHAR(255) NOT NULL,
  official_registration_number VARCHAR(100),
  logo_url TEXT,
  primary_color VARCHAR(20) DEFAULT '#1e40af',
  secondary_color VARCHAR(20) DEFAULT '#f59e0b',
  language VARCHAR(10) DEFAULT 'fr',
  timezone VARCHAR(50) DEFAULT 'Africa/Casablanca',
  currency VARCHAR(10) DEFAULT 'MAD',
  date_format VARCHAR(30) DEFAULT 'DD/MM/YYYY',
  portal_title VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Morocco',
  massar_integration_enabled BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Refactored Settings: Campus Settings
CREATE TABLE IF NOT EXISTS campus_settings (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  campus_id VARCHAR(64) NOT NULL REFERENCES campuses(id) ON DELETE CASCADE,
  operating_hours JSONB DEFAULT '{}'::jsonb,
  gate_control_enabled BOOLEAN DEFAULT true,
  visitor_policy TEXT,
  emergency_contact_phone VARCHAR(50),
  campus_notice TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_campus_settings UNIQUE (tenant_id, campus_id)
);

-- 9. Refactored Settings: Academic Year Settings
CREATE TABLE IF NOT EXISTS academic_year_settings (
  id VARCHAR(64) PRIMARY KEY,
  tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  academic_year_id VARCHAR(64) NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
  grading_scale INT DEFAULT 20,
  pass_mark INT DEFAULT 10,
  allow_teacher_grade_edit_days INT DEFAULT 14,
  terms JSONB DEFAULT '[]'::jsonb,
  attendance_threshold_percentage INT DEFAULT 85,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_academic_year_settings UNIQUE (tenant_id, academic_year_id)
);
