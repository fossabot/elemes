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

export async function dbUpdateExamOptionText(
  optionId: number,
  newText: string,
): Promise<CleanExamOption | null> {
  const optionIdB = optionId as number & { __brand: "public.exam_option" };

  const updatedOption = await db
    .updateTable("examOption")
    .set({ optionText: newText })
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
): Promise<CleanExamOption | null> {
  const questionIdB = questionId as number & {
    __brand: "public.exam_question";
  };

  const newOption = await db
    .insertInto("examOption")
    .values({ questionId: questionIdB, optionText })
    .returningAll()
    .executeTakeFirst();

  if (!newOption) {
    return null;
  }

  return newOption as CleanExamOption;
}

export async function dbSetExamOptionCorrect(
  questionId: number,
  optionId: number,
): Promise<CleanExamOption | null> {
  const optionIdB = optionId as number & { __brand: "public.exam_option" };
  const questionIdB = questionId as number & {
    __brand: "public.exam_question";
  };

  await db
    .updateTable("examOption")
    .set({ isCorrect: false })
    .where("questionId", "=", questionIdB)
    .execute();

  const updatedOption = await db
    .updateTable("examOption")
    .set({ isCorrect: true })
    .where("id", "=", optionIdB)
    .returningAll()
    .executeTakeFirst();

  if (!updatedOption) {
    return null;
  }

  return updatedOption as CleanExamOption;
}
