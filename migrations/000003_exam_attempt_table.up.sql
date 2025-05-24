CREATE TABLE exam_attempt
(
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      TEXT NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
    exam_id      INT  NOT NULL REFERENCES exam (id),
    submitted_at TIMESTAMP,
    grade        INT
);