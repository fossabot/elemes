import {
  ActionIcon,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  serverDeleteExamById,
  serverUpdateExamTitleById,
} from "~/lib/server/exam";
import { serverGradingExam } from "~/lib/server/examAttempt";
import { serverCreateNewQuestion } from "~/lib/server/examQuestion";
import { CleanExamWithName, CleanQuestionWithOptions } from "~/types/db";
import IcBaselineEdit from "~icons/ic/baseline-edit";
import IcRoundSave from "~icons/ic/round-save";
import RadixIconsTrash from "~icons/radix-icons/trash";
import { ExamQuestion } from "../ExamQuestion/ExamQuestion";

interface ExamProps {
  examData: CleanExamWithName;
  queryclient: QueryClient;
  examQuestionData: CleanQuestionWithOptions[] | null;
}
export function Exam({ examData, queryclient, examQuestionData }: ExamProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const isEdit = location.pathname.includes("/edit");
  const [isEditable, setIsEditable] = useState(false);
  const { ref, height } = useElementSize();

  const [title, setTitle] = useState(examData.title);

  const [question, setQuestion] = useState<CleanQuestionWithOptions[]>(
    examQuestionData || [],
  );
  const mutationAddQuestion = useMutation({
    mutationFn: async () => {
      const result = await serverCreateNewQuestion({
        data: {
          examId: examData.id,
          questionText: "NewQuestion",
        },
      });
      if (!result) {
        throw new Error("Failed to create new question");
      }
      setQuestion([
        ...question,
        {
          ...result,
          options: [],
        },
      ]);
    },
    onSuccess: async () => {
      await queryclient.invalidateQueries({
        queryKey: ["exam-questions", examData.id],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error adding new question:", error);
    },
  });
  const removeQuestion = (index: number) => {
    const newQuestions = [...question];
    newQuestions.splice(index, 1);
    setQuestion(newQuestions);
  };

  const mutationUpdateExamTitle = useMutation({
    mutationFn: async (title: string) => {
      return serverUpdateExamTitleById({
        data: {
          title,
          examId: examData.id,
        },
      });
    },
    onSuccess: () => {
      setIsEditable(false);
    },
    onError: (error) => {
      console.error("Error updating exam title:", error);
    },
  });

  const mutationDeleteExam = useMutation({
    mutationFn: async () => {
      serverDeleteExamById({
        data: {
          examId: examData.id,
        },
      });
    },
    onSuccess: async () => {
      await queryclient.invalidateQueries({ queryKey: ["exams"], exact: true });
      await queryclient.invalidateQueries({
        queryKey: ["user-exams"],
        exact: true,
      });
      queryclient.removeQueries({
        queryKey: ["exam", examData.id],
        exact: true,
      });
      await navigate({ to: "/edit", reloadDocument: true });
    },
    onError: (error) => {
      console.error("Error deleting exam:", error);
    },
  });

  const [selectedAnswer, setSelectedAnswer] = useState<Map<number, number>>(
    new Map(),
  );
  const mutationSubmitExam = useMutation({
    mutationFn: async () => {
      await serverGradingExam({
        data: {
          examId: examData.id,
          options: Array.from(selectedAnswer.entries()).map(
            ([questionId, selectedOptionId]) => ({
              questionId,
              selectedOptionId,
            }),
          ),
        },
      });
    },
    onSuccess: async () => {
      await queryclient.invalidateQueries({
        queryKey: ["exam-attempt", examData.id],
        exact: true,
      });
      await navigate({
        to: `/${examData.id}/result`,
        reloadDocument: true,
      });
    },
    onError: (error) => {
      console.error("Error submitting exam:", error);
    },
  });

  return (
    <Container py="xl">
      <Grid>
        <Grid.Col span={isEdit ? 11 : 12} w={"100%"}>
          <Card shadow={"md"} p="xl" w={"100%"} h={100} ref={ref}>
            <Flex align={"center"} h={"100%"} w={"100%"}>
              {isEditable ? (
                <TextInput
                  size={"lg"}
                  w={"100%"}
                  value={title}
                  onChange={(e) => setTitle(e.currentTarget.value)}
                />
              ) : (
                <Title order={2}>{title}</Title>
              )}
            </Flex>
          </Card>
        </Grid.Col>
        {isEdit && (
          <Grid.Col span={1}>
            <Stack
              px={0}
              w={40}
              gap={10}
              align={"flex-end"}
              h={height}
              justify={"flex-start"}
            >
              {isEditable ? (
                <ActionIcon
                  bg={"green"}
                  size={40}
                  onClick={() => mutationUpdateExamTitle.mutate(title)}
                >
                  <IcRoundSave style={{ width: "70%", height: "auto" }} />
                </ActionIcon>
              ) : (
                <ActionIcon size={40} onClick={() => setIsEditable(true)}>
                  <IcBaselineEdit style={{ width: "70%", height: "auto" }} />
                </ActionIcon>
              )}
              <ActionIcon
                bg={"red"}
                size={40}
                onClick={() => mutationDeleteExam.mutate()}
              >
                <RadixIconsTrash style={{ width: "70%", height: "auto" }} />
              </ActionIcon>
            </Stack>
          </Grid.Col>
        )}
      </Grid>
      <Stack py={"50"} h={"100%"}>
        {question?.map((question, index) => (
          <ExamQuestion
            key={question.id}
            examId={examData.id}
            questionId={question.id}
            questionText={question.questionText}
            removeQuestion={() => removeQuestion(index)}
            questionOptions={question.options || []}
            setSelectedAnswer={setSelectedAnswer}
          />
        ))}
      </Stack>
      {isEdit && (
        <Button
          fullWidth
          color="blue"
          size={"md"}
          variant={"light"}
          onClick={() => mutationAddQuestion.mutate()}
          loading={mutationAddQuestion.isPending}
        >
          Add New Question
        </Button>
      )}
      {!isEdit && (
        <Button
          fullWidth
          size={"md"}
          onClick={() => mutationSubmitExam.mutate()}
          loading={mutationSubmitExam.isPending}
        >
          Submit Exam
        </Button>
      )}
    </Container>
  );
}
