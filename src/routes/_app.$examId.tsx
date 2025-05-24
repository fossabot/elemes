import { redirect } from "@tanstack/react-router";
import { Exam } from "~/components/Exam/Exam";
import { queryGetExamByIdOptions } from "~/lib/server/exam";

export const Route = createFileRoute({
  loader: async ({ context, params: { examId } }) => {
    const examIdNum = Number(examId);
    if (isNaN(examIdNum)) {
      throw redirect({ to: "/" });
    }
    const examData = await context.queryClient.ensureQueryData(
      queryGetExamByIdOptions(examIdNum),
    );
    return { examData };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { examData } = Route.useLoaderData();
  const { queryClient } = Route.useRouteContext();

  return <Exam examData={examData} queryclient={queryClient} />;
}
