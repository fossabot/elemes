import { Center, Container } from "@mantine/core";
import { redirect } from "@tanstack/react-router";
import { Exam } from "~/components/Exam/Exam";
import { queryGetExamByIdOptions } from "~/lib/server/exam";
import { queryGetExamQuestionByExamIsCorrectFalseId } from "~/lib/server/examQuestion";

export const Route = createFileRoute({
  loader: async ({ context, params: { examId } }) => {
    const examIdNum = Number(examId);
    if (isNaN(examIdNum)) {
      throw redirect({ to: "/" });
    }
    const examData = await context.queryClient.ensureQueryData(
      queryGetExamByIdOptions(examIdNum),
    );
    const examQuestionData = await context.queryClient.ensureQueryData(
      queryGetExamQuestionByExamIsCorrectFalseId(examIdNum),
    );
    return { examData, examQuestionData };
  },
  component: RouteComponent,
  notFoundComponent: () => NotFound(),
});

function RouteComponent() {
  const { examData, examQuestionData } = Route.useLoaderData();
  const { queryClient } = Route.useRouteContext();

  return (
    <Exam
      examData={examData}
      queryclient={queryClient}
      examQuestionData={examQuestionData}
    />
  );
}

function NotFound() {
  return (
    <Container py="xl">
      <Center>not found</Center>
    </Container>
  );
}
