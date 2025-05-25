CREATE TABLE exam_attempt
(
    id           INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id      TEXT      NOT NULL REFERENCES "user" (id) ON DELETE CASCADE,
    exam_id      INT       NOT NULL REFERENCES exam (id),
    submitted_at TIMESTAMP NOT NULL DEFAULT now(),
    grade        INT       NOT NULL,
    unique (user_id, exam_id)
);