-- Demo credentials use Password@123
INSERT INTO _user (
    first_name, last_name, email, password, role, created_at, updated_at
)
VALUES (
    'Priya', 'Sharma', 'priya@eventpulse.com',
    '$2a$10$SvhZUTRy41PD16awC76n0OZciPMjy6Ia9h.J56DvnOUtaPT4JTcbC',
    'ADMIN', NOW(), NOW()
)
ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    updated_at = NOW();

INSERT INTO _user (
    first_name, last_name, email, password, role, created_at, updated_at
)
VALUES (
    'Rohit', 'More', 'rohit@eventpulse.com',
    '$2a$10$SvhZUTRy41PD16awC76n0OZciPMjy6Ia9h.J56DvnOUtaPT4JTcbC',
    'USER', NOW(), NOW()
)
ON CONFLICT (email) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    updated_at = NOW();

INSERT INTO events (
    title, description, location, date, category, capacity, available_seats,
    creator_id, price, created_at, updated_at
)
SELECT
    'AI & Cloud Bootcamp 2026',
    'A deep dive into next-generation AI and Cloud architectures. Hosted by Infosys.',
    'Pune, India',
    '2026-06-20 09:00:00',
    'Technology',
    1000,
    1000,
    creator.id,
    499.0,
    NOW(),
    NOW()
FROM _user creator
WHERE creator.email = 'priya@eventpulse.com'
  AND NOT EXISTS (
      SELECT 1
      FROM events
      WHERE title = 'AI & Cloud Bootcamp 2026'
        AND location = 'Pune, India'
  );

INSERT INTO feedbacks (comments, rating, event_id, user_id, sentiment, created_at, updated_at)
SELECT
    'Amazing workshop and speaker quality! Very insightful.',
    5,
    event_row.id,
    user_row.id,
    'POSITIVE',
    NOW(),
    NOW()
FROM events event_row
JOIN _user user_row ON user_row.email = 'rohit@eventpulse.com'
WHERE event_row.title = 'AI & Cloud Bootcamp 2026'
  AND event_row.location = 'Pune, India'
  AND NOT EXISTS (
      SELECT 1
      FROM feedbacks existing
      WHERE existing.event_id = event_row.id
        AND existing.user_id = user_row.id
  );
