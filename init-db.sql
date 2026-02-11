-- Archivo de inicialización automática para PostgreSQL
-- Este archivo se ejecuta automáticamente cuando se crea la base de datos por primera vez
-- o cuando se agregan los volumenes de scripts

-- Paso 1: Crear tablas si no existen
CREATE TABLE IF NOT EXISTS roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    role_id INTEGER REFERENCES roles(id),
    
    date_of_birth DATE,
    gender VARCHAR(20),
    weight_kg DECIMAL(5,2),
    height_cm DECIMAL(5,2),
    
    email_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    coach_id INTEGER REFERENCES users(id),
    
    CONSTRAINT check_weight CHECK (weight_kg > 0 AND weight_kg < 500),
    CONSTRAINT check_height CHECK (height_cm > 0 AND height_cm < 300)
);

-- Paso 2: Agregar la columna full_name si no existe (migración automática)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'full_name'
    ) THEN
        ALTER TABLE users ADD COLUMN full_name VARCHAR(255);
        UPDATE users SET full_name = 'User' WHERE full_name IS NULL;
        ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;
        RAISE NOTICE 'Columna full_name agregada exitosamente';
    END IF;
    
    -- Asegurar que role_id sea NOT NULL si hay roles
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'roles') THEN
        IF EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_name = 'users' 
            AND column_name = 'role_id'
            AND is_nullable = 'YES'
        ) THEN
            ALTER TABLE users ALTER COLUMN role_id SET NOT NULL;
        END IF;
    END IF;
END $$;

-- Paso 3: Crear el resto de las tablas
CREATE TABLE IF NOT EXISTS user_preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    notifications_enabled BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT FALSE,
    
    water_reminder BOOLEAN DEFAULT TRUE,
    water_reminder_interval INTEGER DEFAULT 120,
    activity_reminder BOOLEAN DEFAULT TRUE,
    activity_reminder_time TIME DEFAULT '18:00:00',
    sleep_reminder BOOLEAN DEFAULT TRUE,
    sleep_reminder_time TIME DEFAULT '22:00:00',
    
    language VARCHAR(10) DEFAULT 'es-ES',
    timezone VARCHAR(50) DEFAULT 'America/Guayaquil',
    
    google_fit_enabled BOOLEAN DEFAULT FALSE,
    google_fit_token TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    goal_type VARCHAR(50) NOT NULL,
    
    goal_name VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    
    frequency VARCHAR(20) CHECK (frequency IN ('diario', 'semanal', 'mensual')),
    
    is_active BOOLEAN DEFAULT TRUE,
    start_date DATE NOT NULL,
    end_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS daily_habits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    habit_type VARCHAR(50) NOT NULL,
    habit_name VARCHAR(255),
    
    value DECIMAL(10,2),
    unit VARCHAR(50),
    
    duration_minutes INTEGER,
    
    notes TEXT,
    mood VARCHAR(50),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goals_progress (
    id SERIAL PRIMARY KEY,
    goal_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    current_value DECIMAL(10,2) NOT NULL,
    percentage DECIMAL(5,2),
    
    notes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS shared_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT,
    
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    
    is_public BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    recommendation_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority INTEGER DEFAULT 1,
    
    is_active BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
CREATE INDEX IF NOT EXISTS idx_daily_habits_user_date ON daily_habits(user_id, date);
CREATE INDEX IF NOT EXISTS idx_goals_user_active ON goals(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
