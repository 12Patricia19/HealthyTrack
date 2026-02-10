
DROP TABLE IF EXISTS recommendations CASCADE;
DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS shared_progress CASCADE;
DROP TABLE IF EXISTS goals_progress CASCADE;
DROP TABLE IF EXISTS goals CASCADE;
DROP TABLE IF EXISTS daily_habits CASCADE;
DROP TABLE IF EXISTS user_preferences CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;


CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    google_id VARCHAR(255) UNIQUE,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    
    full_name VARCHAR(255) NOT NULL,
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

CREATE TABLE user_preferences (
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

CREATE TABLE goals (
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

CREATE TABLE daily_habits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    habit_type VARCHAR(50) NOT NULL,
    habit_name VARCHAR(255),
    
    value DECIMAL(10,2),
    unit VARCHAR(50),
    description TEXT,
    notes TEXT,
    
    entry_method VARCHAR(20) CHECK (entry_method IN ('manual', 'google_fit', 'automatico')),
    
    metadata JSONB,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_habit_entry UNIQUE (user_id, date, habit_type, timestamp)
);

CREATE TABLE goals_progress (
    id SERIAL PRIMARY KEY,
    goal_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    
    current_value DECIMAL(10,2) NOT NULL,
    target_value DECIMAL(10,2) NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS ((current_value / NULLIF(target_value, 0)) * 100) STORED,
    
    is_achieved BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_goal_progress UNIQUE (goal_id, date)
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    notification_type VARCHAR(50) NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    scheduled_time TIMESTAMP,
    sent_at TIMESTAMP,
    
    is_read BOOLEAN DEFAULT FALSE,
    is_sent BOOLEAN DEFAULT FALSE,
    
    priority VARCHAR(20) DEFAULT 'normal',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE recommendations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    recommendation_type VARCHAR(50) NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    recommendation_text TEXT NOT NULL,
    
    trigger_condition TEXT,
    based_on_data JSONB,
    
    is_active BOOLEAN DEFAULT TRUE,
    is_viewed BOOLEAN DEFAULT FALSE,
    viewed_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE TABLE shared_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    share_type VARCHAR(50) NOT NULL,
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    progress_data JSONB NOT NULL,
    
    shared_with_user_id INTEGER REFERENCES users(id),
    
    external_platform VARCHAR(50),
    external_url TEXT,
    
    is_public BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role_id);
CREATE INDEX idx_users_coach ON users(coach_id);
CREATE INDEX idx_daily_habits_user_date ON daily_habits(user_id, date);
CREATE INDEX idx_daily_habits_type ON daily_habits(habit_type);
CREATE INDEX idx_goals_user ON goals(user_id);
CREATE INDEX idx_goals_active ON goals(is_active);
CREATE INDEX idx_goals_progress_goal ON goals_progress(goal_id);
CREATE INDEX idx_goals_progress_date ON goals_progress(date);
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_scheduled ON notifications(scheduled_time) WHERE is_sent = FALSE;
CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_recommendations_active ON recommendations(is_active);
CREATE INDEX idx_daily_habits_metadata ON daily_habits USING GIN(metadata);
CREATE INDEX idx_recommendations_data ON recommendations USING GIN(based_on_data);


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_preferences_updated_at BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON goals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON daily_habits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


INSERT INTO roles (name, description) VALUES
    ('usuario', 'Usuario regular que monitorea sus hábitos saludables'),
    ('coach', 'Coach que visualiza el progreso de sus clientes'),
    ('administrador', 'Administrador del sistema con acceso completo');


CREATE OR REPLACE VIEW daily_summary AS
SELECT 
    dh.user_id,
    dh.date,
    u.full_name,
    COUNT(DISTINCT dh.id) as total_entries,
    COUNT(DISTINCT CASE WHEN dh.habit_type = 'actividad_fisica' THEN dh.id END) as physical_activities,
    COUNT(DISTINCT CASE WHEN dh.habit_type = 'comida' THEN dh.id END) as meals,
    COUNT(DISTINCT CASE WHEN dh.habit_type = 'agua' THEN dh.id END) as water_entries,
    COUNT(DISTINCT CASE WHEN dh.habit_type = 'sueño' THEN dh.id END) as sleep_entries,
    COUNT(DISTINCT CASE WHEN dh.habit_type = 'mindfulness' THEN dh.id END) as mindfulness_sessions
FROM daily_habits dh
JOIN users u ON dh.user_id = u.id
GROUP BY dh.user_id, dh.date, u.full_name;
CREATE OR REPLACE VIEW goals_summary AS
SELECT 
    g.id as goal_id,
    g.user_id,
    u.full_name,
    g.goal_name,
    g.goal_type,
    g.target_value,
    g.unit,
    g.frequency,
    gp.date,
    gp.current_value,
    gp.percentage,
    gp.is_achieved
FROM goals g
JOIN users u ON g.user_id = u.id
LEFT JOIN goals_progress gp ON g.id = gp.goal_id
WHERE g.is_active = TRUE
ORDER BY g.user_id, gp.date DESC;
CREATE OR REPLACE FUNCTION calculate_bmi(user_id_param INTEGER)
RETURNS DECIMAL(5,2) AS $$
DECLARE
    weight DECIMAL(5,2);
    height DECIMAL(5,2);
    bmi DECIMAL(5,2);
BEGIN
    SELECT weight_kg, height_cm INTO weight, height
    FROM users
    WHERE id = user_id_param;
    
    IF weight IS NULL OR height IS NULL THEN
        RETURN NULL;
    END IF;
    
    bmi := weight / POWER(height / 100, 2);
    RETURN bmi;
END;
$$ LANGUAGE plpgsql;
CREATE OR REPLACE FUNCTION get_user_stats(
    user_id_param INTEGER,
    start_date DATE,
    end_date DATE
)
RETURNS TABLE (
    habit_type VARCHAR(50),
    total_entries BIGINT,
    avg_value DECIMAL(10,2),
    total_value DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        dh.habit_type,
        COUNT(*)::BIGINT as total_entries,
        AVG(dh.value) as avg_value,
        SUM(dh.value) as total_value
    FROM daily_habits dh
    WHERE dh.user_id = user_id_param
        AND dh.date BETWEEN start_date AND end_date
    GROUP BY dh.habit_type
    ORDER BY dh.habit_type;
END;
$$ LANGUAGE plpgsql;


SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
FROM information_schema.tables t
WHERE table_schema = 'public' 
    AND table_type = 'BASE TABLE'
ORDER BY table_name;
