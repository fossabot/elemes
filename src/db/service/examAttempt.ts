import { CleanExamAttempt } from "~/types/db";
import { db } from "../config";

export async function dbGetExamAttemptById(examId: number, userId: string) {
  const examIdB = examId as number & {
    __brand: "public.exam";
  };
  const userIdB = userId as string & { __brand: "public.user" };

  const examAttempt = await db
    .selectFrom("examAttempt")
    .where("examId", "=", examIdB)
    .where("userId", "=", userIdB)
    .selectAll()
    .executeTakeFirst();
  if (!examAttempt) {
    return null;
  }

  return examAttempt as CleanExamAttempt;
}

export async function dbCreateExamAttempt(
  examId: number,
  userId: string,
  grade: number,
): Promise<CleanExamAttempt | null> {
  const examIdB = examId as number & { __brand: "public.exam" };
  const userIdB = userId as string & { __brand: "public.user" };

  await db
    .deleteFrom("examAttempt")
    .where("examId", "=", examIdB)
    .where("userId", "=", userIdB)
    .execute();

  const newExamAttempt = await db
    .insertInto("examAttempt")
    .values({
      examId: examIdB,
      userId: userIdB,
      grade,
    })
    .returningAll()
    .executeTakeFirst();

  if (!newExamAttempt) {
    return null;
  }

  return newExamAttempt as CleanExamAttempt;
}
