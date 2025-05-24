import { CleanExam, CleanExamWithName } from "~/types/db";
import { db } from "../config";
import { dbGetNameById } from "./user";

export async function dbGetAllExams(): Promise<CleanExamWithName[]> {
  const exams = await db.selectFrom("exam").selectAll().execute();

  const authorIds = Array.from(new Set(exams.map((exam) => exam.author)));

  const authorNames = await Promise.all(
    authorIds.map((id) => dbGetNameById(id)),
  );

  const authorIdToName: Record<string, string> = {};
  authorIds.forEach((id, idx) => {
    authorIdToName[id] = authorNames[idx]?.name ?? "";
  });

  return exams.map((exam) => ({
    ...exam,
    authorName: authorIdToName[exam.author] || "",
  }));
}

export async function dbGetAllUserExams(
  userId: string,
): Promise<CleanExamWithName[]> {
  const userIdB = userId as string & { __brand: "public.user" };

  const exams = await db
    .selectFrom("exam")
    .selectAll()
    .where("author", "=", userIdB)
    .execute();

  if (exams.length === 0) {
    return [];
  }

  const { name: authorName } = await dbGetNameById(exams[0].author);

  return exams.map((exam) => ({
    ...exam,
    authorName,
  })) as CleanExamWithName[];
}

export async function dbCreateNewExam(
  name: string,
  userId: string,
): Promise<CleanExam> {
  const userIdB = userId as string & { __brand: "public.user" };

  try {
    const exam = await db
      .insertInto("exam")
      .values({
        title: name,
        author: userIdB,
      })
      .returningAll()
      .executeTakeFirstOrThrow();

    return exam as CleanExam;
  } catch (error) {
    throw new Error("Error creating exam");
  }
}

export async function dbGetExamById(
  examId: number,
): Promise<CleanExamWithName | null> {
  const examIdB = examId as number & { __brand: "public.exam" };

  const exam = await db
    .selectFrom("exam")
    .selectAll()
    .where("id", "=", examIdB)
    .executeTakeFirst();

  if (!exam) {
    return null;
  }

  const { name: authorName } = await dbGetNameById(exam.author);

  return {
    ...exam,
    authorName,
  } as CleanExamWithName;
}

export async function dbUpdateExamTitle(
  examId: number,
  newTitle: string,
): Promise<CleanExam | null> {
  const examIdB = examId as number & { __brand: "public.exam" };

  const updatedExam = await db
    .updateTable("exam")
    .set({ title: newTitle })
    .where("id", "=", examIdB)
    .returningAll()
    .executeTakeFirst();

  if (!updatedExam) {
    return null;
  }

  return {
    ...updatedExam,
  } as CleanExam;
}

export async function dbDeleteExamById(
  examId: number,
): Promise<CleanExam | null> {
  const examIdB = examId as number & { __brand: "public.exam" };

  const deletedExam = await db
    .deleteFrom("exam")
    .where("id", "=", examIdB)
    .returningAll()
    .executeTakeFirst();

  if (!deletedExam) {
    return null;
  }

  return {
    ...deletedExam,
  } as CleanExam;
}

interface dbIsAuthorExamParams {
  examId: number;
  userId: string;
}
export async function dbIsAuthorExam(
  params: dbIsAuthorExamParams,
): Promise<boolean> {
  const examIdB = params.examId as number & { __brand: "public.exam" };
  const userIdB = params.userId as string & { __brand: "public.user" };

  const exam = await db
    .selectFrom("exam")
    .selectAll()
    .where("id", "=", examIdB)
    .where("author", "=", userIdB)
    .executeTakeFirst();

  return !!exam;
}
