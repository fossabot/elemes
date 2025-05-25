import {
  Button,
  Center,
  Container,
  Divider,
  Paper,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { redirect } from "@tanstack/react-router";
import { queryGetExamByIdOptions } from "~/lib/server/exam";
import { queryGetExamAttemptOptions } from "~/lib/server/examAttempt";

export const Route = createFileRoute({
  beforeLoad: async ({ context, params: { examId }, search }) => {
    const examIdNum = Number(examId);
    if (isNaN(examIdNum)) {
      throw redirect({ to: "/" });
    }
  },
  loader: async ({ context, params: { examId } }) => {
    const examIdNum = Number(examId);
    const examData = await context.queryClient.ensureQueryData(
      queryGetExamByIdOptions(examIdNum),
    );
    const examResult = await context.queryClient.ensureQueryData(
      queryGetExamAttemptOptions(examIdNum),
    );
    return { examData, examResult };
  },
  component: RouteComponent,
  notFoundComponent: () => NotFound(),
});

function RouteComponent() {
  const { examData, examResult } = Route.useLoaderData();
  const navigate = Route.useNavigate();
  return (
    <Container py="xl">
      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <Title order={3} tt={"uppercase"}>
          {examData.title}
        </Title>
        <Text size={"lg"}>By {examData.authorName}</Text>
        <Divider my={"md"} />
        {examResult ? (
          <>
            <Text>Grade : {examResult.grade} / 100</Text>
            <Text>
              Submission Date : {" "}
              {new Date(examResult.submittedAt).toLocaleString()}
            </Text>
          </>
        ) : (
          <Text>
            Oops! You haven&apos;t submitted this exam yet. Give it your best
            shot and see what you score!
          </Text>
        )}
      </Paper>
      <Space h="xl" />
      <Button
        size={"md"}
        fullWidth
        onClick={() => {
          navigate({
            to: "/$examId",
            params: { examId: examData.id.toString() },
            search: { reset: true },
          });
        }}
      >
        Reset Exam
      </Button>
    </Container>
  );
}

function NotFound() {
  return (
    <Container py="xl">
      <Center>not found</Center>
    </Container>
  );
}
