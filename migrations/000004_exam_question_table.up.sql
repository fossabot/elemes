CREATE TABLE exam_question
(
    id            INT  NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    exam_id       INT  NOT NULL REFERENCES exam (id) ON DELETE CASCADE,
    question_text TEXT NOT NULL
);