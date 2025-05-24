import { CleanExamQuestion } from "~/types/db";
import { db } from "../config";

export async function dbGetExamQuestions(
  examId: number,
): Promise<CleanExamQuestion[]> {
  const examIdB = examId as number & { __brand: "public.exam" };

  const questions = await db
    .selectFrom("examQuestion")
    .selectAll()
    .where("examId", "=", examIdB)
    .orderBy("id")
    .execute();

  return questions as CleanExamQuestion[];
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

export async function dbUpdateQuestionById(
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
