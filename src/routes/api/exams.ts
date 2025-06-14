import { json } from "@tanstack/react-start";
import { dbGetAllExams } from "~/db/service/exam";

export const ServerRoute = createServerFileRoute().methods({
  GET: async () => {
    const exams = await dbGetAllExams();

    return json(exams);
  },
});
