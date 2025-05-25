CREATE TABLE exam_option
(
    id          INT     NOT NULL GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    question_id INT     NOT NULL REFERENCES exam_question (id) ON DELETE CASCADE,
    option_text TEXT    NOT NULL,
    is_correct  BOOLEAN NOT NULL DEFAULT FALSE
);
