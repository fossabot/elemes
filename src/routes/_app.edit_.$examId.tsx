import { Box, Button, Center, Container } from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { redirect } from "@tanstack/react-router";
import { useState } from "react";
import { Exam } from "~/components/Exam/Exam";
import {
  queryGetExamByIdOptions,
  serverChangeExamVisibility,
} from "~/lib/server/exam";
import { queryGetExamQuestionByExamId } from "~/lib/server/examQuestion";

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
      queryGetExamQuestionByExamId(examIdNum),
    );
    return { examData, examQuestionData };
  },
  component: RouteComponent,
  notFoundComponent: () => NotFound(),
});

function RouteComponent() {
  const { examData, examQuestionData } = Route.useLoaderData();
  const { queryClient } = Route.useRouteContext();

  const [visibility, setVisibility] = useState(examData.private);

  const mutationChangeVisibility = useMutation({
    mutationFn: async () => {
      const result = await serverChangeExamVisibility({
        data: {
          examId: examData.id,
          isPrivate: !visibility,
        },
      });
      if (!result) {
        throw new Error("Failed to change visibility");
      }
      setVisibility(!visibility);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["exams"],
      });
    },
  });

  return (
    <Container>
      <Box px={"xl"}>
        <Button
          fullWidth
          onClick={() => mutationChangeVisibility.mutate()}
          loading={mutationChangeVisibility.isPending}
        >
          {visibility
            ? "Change Visibility to Public"
            : "Change Visibility to Private"}
        </Button>
      </Box>
      <Exam
        examData={examData}
        queryclient={queryClient}
        examQuestionData={examQuestionData}
      />
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
