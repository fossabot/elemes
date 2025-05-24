import { db } from "../config";

export async function dbGetExamOptions(questionId: number) {
    const questionIdB = questionId as number & { __brand: "public.exam_question" };

  const options = await db
    .selectFrom("examOption")
    .selectAll()
    .where("questionId", "=", questionIdB)
    .execute();
}
