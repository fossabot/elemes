import { CleanExamOption } from "~/types/db";
import { db } from "../config";

export async function dbDeleteExamOption(
  optionId: number,
): Promise<CleanExamOption | null> {
  const optionIdB = optionId as number & { __brand: "public.exam_option" };

  const deletedOption = await db
    .deleteFrom("examOption")
    .where("id", "=", optionIdB)
    .returningAll()
    .executeTakeFirst();

  if (!deletedOption) {
    return null;
  }

  return deletedOption as CleanExamOption;
}

export async function dbUpdateExamOption(
  questionId: number,
  optionId: number,
  newText: string,
  isCorrect: boolean,
): Promise<CleanExamOption | null> {
  const questionIdB = questionId as number & {
    __brand: "public.exam_question";
  };
  const optionIdB = optionId as number & { __brand: "public.exam_option" };

  if (isCorrect) {
    await db
      .updateTable("examOption")
      .set({ isCorrect: false })
      .where("questionId", "=", questionIdB)
      .execute();
  }

  const updatedOption = await db
    .updateTable("examOption")
    .set({ optionText: newText, isCorrect })
    .where("id", "=", optionIdB)
    .returningAll()
    .executeTakeFirst();

  if (!updatedOption) {
    return null;
  }

  return updatedOption as CleanExamOption;
}

export async function dbCreateExamOption(
  questionId: number,
  optionText: string,
  isCorrect: boolean,
): Promise<CleanExamOption | null> {
  const questionIdB = questionId as number & {
    __brand: "public.exam_question";
  };

  const newOption = await db
    .insertInto("examOption")
    .values({ questionId: questionIdB, optionText, isCorrect })
    .returningAll()
    .executeTakeFirst();

  if (!newOption) {
    return null;
  }

  return newOption as CleanExamOption;
}
