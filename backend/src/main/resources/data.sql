-- Initial Roles
-- INSERT INTO roles (name) VALUES ('ROLE_USER'), ('ROLE_ADMIN'), ('ROLE_ORGANIZER');

-- Create a demo Admin/Organizer (Priya)
-- Password is 'Password@123' (encoded)
-- Note: User table is usually '_user' because 'user' is a reserved word in many DBs
INSERT INTO _user (first_name, last_name, email, password, role, created_at, updated_at) 
VALUES ('Priya', 'Sharma', 'priya@eventpulse.com', '$2a$10$8.yD/E9.K49K4v.f.q.4.Oq4.Pq4.q4.Oq4.Pq4.q4.Oq4.Pq4.q4.', 'ADMIN', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Create a demo User (Rohit)
INSERT INTO _user (first_name, last_name, email, password, role, created_at, updated_at) 
VALUES ('Rohit', 'More', 'rohit@eventpulse.com', '$2a$10$8.yD/E9.K49K4v.f.q.4.Oq4.Pq4.q4.Oq4.Pq4.q4.Oq4.Pq4.q4.', 'USER', NOW(), NOW())
ON CONFLICT (email) DO NOTHING;

-- Create the Infosys Event
INSERT INTO events (title, description, location, date, category, capacity, creator_id, created_at, updated_at)
VALUES ('AI & Cloud Bootcamp 2026', 'A deep dive into next-generation AI and Cloud architectures. Hosted by Infosys.', 'Pune, India', '2026-06-20 09:00:00', 'Technology', 1000, 1, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Initial Feedback for demo
INSERT INTO feedbacks (comments, rating, event_id, user_id, sentiment, created_at, updated_at)
VALUES ('Amazing workshop and speaker quality! Very insightful.', 5, 1, 2, 'POSITIVE', NOW(), NOW())
ON CONFLICT DO NOTHING;
