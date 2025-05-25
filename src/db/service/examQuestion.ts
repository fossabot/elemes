import { CleanExamQuestion, CleanQuestionWithOptions } from "~/types/db";
import { db } from "../config";

export async function dbGetExamQuestions(
  examId: number,
): Promise<CleanQuestionWithOptions[]> {
  const examIdB = examId as number & { __brand: "public.exam" };

  const questions = await db
    .selectFrom("examQuestion")
    .selectAll()
    .where("examId", "=", examIdB)
    .orderBy("id")
    .execute();

  const questionsWithOptions = await Promise.all(
    questions.map(async (question) => {
      const questionIdB = question.id as number & {
        __brand: "public.exam_question";
      };

      const options = await db
        .selectFrom("examOption")
        .selectAll()
        .where("questionId", "=", questionIdB)
        .orderBy("id")
        .execute();

      return {
        ...question,
        options,
      };
    }),
  );

  return questionsWithOptions as CleanQuestionWithOptions[];
}

export async function dbGetExamQuestionsIsCorrectFalse(
  examId: number,
): Promise<CleanQuestionWithOptions[]> {
  const examIdB = examId as number & { __brand: "public.exam" };

  const questions = await db
    .selectFrom("examQuestion")
    .selectAll()
    .where("examId", "=", examIdB)
    .orderBy("id")
    .execute();

  const questionsWithOptions = await Promise.all(
    questions.map(async (question) => {
      const questionIdB = question.id as number & {
        __brand: "public.exam_question";
      };

      const options = await db
        .selectFrom("examOption")
        .selectAll()
        .where("questionId", "=", questionIdB)
        .orderBy("id")
        .execute();

      const optionsWithoutIsCorrect = options.map((option) => ({
        ...option,
        isCorrect: false,
      }));

      return {
        ...question,
        options: optionsWithoutIsCorrect,
      };
    }),
  );

  return questionsWithOptions as CleanQuestionWithOptions[];
}

export async function dbCreateNewQuestionByExamId(
  examId: number,
  questionText: string,
) {
  const examIdB = examId as number & { __brand: "public.exam" };

  const newQuestion = await db
    .insertInto("examQuestion")
    .values({ examId: examIdB, questionText })
    .returningAll()
    .executeTakeFirst();

  if (!newQuestion) {
    return null;
  }

  return {
    ...newQuestion,
  } as CleanExamQuestion;
}

export async function dbUpdateQuestionTextById(
  questionId: number,
  questionText: string,
) {
  const questionIdB = questionId as number & {
    __brand: "public.exam_question";
  };

  const updatedQuestion = await db
    .updateTable("examQuestion")
    .set({ questionText })
    .where("id", "=", questionIdB)
    .returningAll()
    .executeTakeFirst();

  if (!updatedQuestion) {
    return null;
  }

  return {
    ...updatedQuestion,
  } as CleanExamQuestion;
}

export async function dbDeleteQuestionById(questionId: number) {
  const questionIdB = questionId as number & {
    __brand: "public.exam_question";
  };

  const deletedQuestion = await db
    .deleteFrom("examQuestion")
    .where("id", "=", questionIdB)
    .returningAll()
    .executeTakeFirst();

  if (!deletedQuestion) {
    return null;
  }

  return {
    ...deletedQuestion,
  } as CleanExamQuestion;
}

export async function dbGetQuestionLengthByExamId(
  examId: number,
): Promise<number> {
  const examIdB = examId as number & { __brand: "public.exam" };

  const count = await db
    .selectFrom("examQuestion")
    .where("examId", "=", examIdB)
    .select((eb) => eb.fn.count("id").as("count"))
    .executeTakeFirst();

  return Number(count?.count) ?? 0;
}
