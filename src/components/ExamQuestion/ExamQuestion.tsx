import {
  ActionIcon,
  Button,
  Card,
  Divider,
  Flex,
  Grid,
  Radio,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { useElementSize } from "@mantine/hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  serverCreateExamOption,
  serverDeleteExamOption,
  serverUpdateExamOptionText,
} from "~/lib/server/examOption";
import {
  serverDeleteQuestionById,
  serverUpdateQuestionTextById,
} from "~/lib/server/examQuestion";
import { CleanExamOption } from "~/types/db";
import IcBaselineEdit from "~icons/ic/baseline-edit";
import IcRoundSave from "~icons/ic/round-save";
import RadixIconsTrash from "~icons/radix-icons/trash";

interface ExamQuestionProps {
  examId: number;
  questionId: number;
  questionText: string;
  removeQuestion: () => void;
  questionOptions: CleanExamOption[];
  setSelectedAnswer: React.Dispatch<React.SetStateAction<Map<number, number>>>;
}
export function ExamQuestion({
  examId,
  questionId,
  questionText,
  removeQuestion,
  questionOptions,
  setSelectedAnswer,
}: ExamQuestionProps) {
  const location = useLocation();
  const [isEditable, setIsEditable] = useState(false);
  const { ref, height } = useElementSize();
  const isEdit = location.pathname.includes("/edit");
  const queryclient = useQueryClient();

  const [question, setQuestion] = useState(questionText);
  const [questionTextEdited, setQuestionTextEdited] = useState(false);
  function handleQuestionTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    setQuestion(e.currentTarget.value);
    setQuestionTextEdited(true);
  }
  const mutationSaveQuestionTextEdited = useMutation({
    mutationFn: async () => {
      const result = await serverUpdateQuestionTextById({
        data: {
          examId,
          questionId,
          questionText: question,
        },
      });
      if (!result) {
        console.error("Failed to update question text");
      }
    },
    onSuccess: () => {
      setIsEditable(false);
      queryclient.refetchQueries({
        queryKey: ["exam-questions", examId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error updating question:", error);
    },
  });

  const [radioOptions, setRadioOptions] = useState(questionOptions || []);
  const countNewOptions = useRef(0);

  const addRadioOption = () => {
    countNewOptions.current += 1;
    setRadioOptions([
      ...radioOptions,
      {
        optionText: `New Option ${radioOptions.length + 1}`,
        questionId: questionId,
        isCorrect: false,
        id: 0,
      },
    ]);
  };
  const mutationSaveNewQuestionOptions = useMutation({
    mutationFn: async () => {
      if (countNewOptions.current > 0) {
        const newOptions = radioOptions
          .filter((option) => option.id === 0)
          .map((option) => ({
            questionId: questionId,
            optionText: option.optionText,
            isCorrect: option.isCorrect,
          }));
        const result = await serverCreateExamOption({
          data: {
            create: newOptions,
            examId,
          },
        });
      }
    },
    onSuccess: () => {
      queryclient.refetchQueries({
        queryKey: ["exam-questions", examId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error saving new question options:", error);
    },
  });

  const [dbIdDeletedOption, setDbIdDeletedOption] = useState<number[]>([]);
  const [dbIdUpdatedOptionMap, setDbIdUpdatedOptionMap] = useState<
    Map<number, { id: number; optionText: string; isCorrect: boolean }>
  >(new Map());

  const deleteRadioOption = (index: number) => {
    const newOptions = [...radioOptions];
    if (newOptions[index].id !== 0) {
      const deletedId = newOptions[index].id;
      setDbIdDeletedOption([...dbIdDeletedOption, deletedId]);
      setDbIdUpdatedOptionMap((prev) => {
        const updated = new Map(prev);
        updated.delete(deletedId);
        return updated;
      });
    }
    if (newOptions[index].id === 0) {
      countNewOptions.current -= 1;
    }
    newOptions.splice(index, 1);
    setRadioOptions(newOptions);
  };
  const mutationSaveDeleteOptions = useMutation({
    mutationFn: async () => {
      if (dbIdDeletedOption.length > 0) {
        const result = await serverDeleteExamOption({
          data: {
            optionId: dbIdDeletedOption,
            examId,
          },
        });
      }
    },
    onSuccess: () => {
      queryclient.refetchQueries({
        queryKey: ["exam-questions", examId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error deleting options:", error);
    },
  });

  const updateOptionLabel = (index: number, newLabel: string) => {
    const newOptions = [...radioOptions];
    if (newOptions[index].id !== 0) {
      setDbIdUpdatedOptionMap((prev) => {
        const updated = new Map(prev);
        updated.set(newOptions[index].id, {
          id: newOptions[index].id,
          optionText: newLabel,
          isCorrect: newOptions[index].isCorrect,
        });
        return updated;
      });
    }
    newOptions[index].optionText = newLabel;
    setRadioOptions(newOptions);
  };
  const mutationSaveUpdateOptions = useMutation({
    mutationFn: async () => {
      if (dbIdUpdatedOptionMap.size > 0) {
        const updates = Array.from(dbIdUpdatedOptionMap.values()).map(
          (option) => ({
            questionId: questionId,
            optionId: option.id,
            optionText: option.optionText,
            id: option.id,
            isCorrect: option.isCorrect,
          }),
        );
        const result = await serverUpdateExamOptionText({
          data: {
            update: updates,
            examId,
          },
        });
      }
    },
    onSuccess: () => {
      queryclient.refetchQueries({
        queryKey: ["exam-questions", examId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error updating options:", error);
    },
  });

  const setCorrectAnswer = (index: number) => {
    const newOptions = radioOptions.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    const optionId = newOptions[index].id;
    if (optionId !== 0) {
      setDbIdUpdatedOptionMap((prev) => {
        const updated = new Map(prev);
        updated.set(optionId, {
          id: optionId,
          optionText: newOptions[index].optionText,
          isCorrect: true,
        });
        return updated;
      });
    }
    setRadioOptions(newOptions);
  };

  const mutationRemoveQuestion = useMutation({
    mutationFn: async () => {
      const result = await serverDeleteQuestionById({
        data: {
          examId,
          questionId,
        },
      });
      if (!result) {
        throw new Error("Failed to delete question");
      }
      removeQuestion();
      return result;
    },
    onSuccess: () => {
      queryclient.refetchQueries({
        queryKey: ["exam-questions", examId],
        exact: true,
      });
    },
    onError: (error) => {
      console.error("Error removing question:", error);
    },
  });

  const [selectedOption, setSelectedOption] = useState("-1");

  return (
    <Grid>
      <Grid.Col span={isEdit ? 11 : 12}>
        <Card shadow={"md"} p={"md"} w={"100%"} ref={ref}>
          {isEditable ? (
            <TextInput
              size={"md"}
              value={question}
              onChange={(e) => {
                handleQuestionTextChange(e);
              }}
            />
          ) : (
            <Text>{question}</Text>
          )}
          <Divider my={"md"} />
          <Radio.Group
            name={`question-${questionId}`}
            value={selectedOption}
            onChange={(e) => {
              setSelectedOption(e);
              setSelectedAnswer((prev) => {
                const newMap = new Map(prev);
                newMap.set(questionId, Number(e));
                return newMap;
              });
            }}
          >
            <Stack mt="xs">
              {radioOptions.map((option, index) => (
                <Flex key={index} align="center" gap="sm">
                  {isEditable ? (
                    <>
                      <TextInput
                        value={option.optionText}
                        onChange={(e) =>
                          updateOptionLabel(index, e.currentTarget.value)
                        }
                        size="xs"
                        style={{ flex: 1 }}
                      />
                      <Button
                        color={option.isCorrect ? "green" : "gray"}
                        size="xs"
                        variant={option.isCorrect ? "filled" : "outline"}
                        onClick={() => setCorrectAnswer(index)}
                      >
                        {option.isCorrect ? "Answer" : "Set Answer"}
                      </Button>
                    </>
                  ) : (
                    <Radio
                      value={String(option.id)}
                      disabled={isEdit}
                      label={
                        <Flex align="center" gap="sm">
                          {option.optionText}
                          {option.isCorrect && isEdit && (
                            <Text size="xs" c="green" fw={700}>
                              (Correct Answer)
                            </Text>
                          )}
                        </Flex>
                      }
                      style={{ flex: 1 }}
                    />
                  )}
                  {isEditable && (
                    <ActionIcon
                      color="red"
                      size="md"
                      radius={"xs"}
                      onClick={() => deleteRadioOption(index)}
                    >
                      <RadixIconsTrash
                        style={{ width: "70%", height: "auto" }}
                      />
                    </ActionIcon>
                  )}
                </Flex>
              ))}
              {isEditable && (
                <Flex justify="center" mt="xs">
                  <Button
                    fullWidth
                    color="blue"
                    variant="light"
                    onClick={addRadioOption}
                  >
                    +
                  </Button>
                </Flex>
              )}
            </Stack>
          </Radio.Group>
        </Card>
      </Grid.Col>
      {isEdit && (
        <Grid.Col span={1}>
          <Stack
            h={height}
            w={40}
            gap={10}
            align={"flex-end"}
            justify={"flex-start"}
          >
            {isEditable ? (
              <ActionIcon
                bg={"green"}
                size={40}
                onClick={() => {
                  if (questionTextEdited) {
                    mutationSaveQuestionTextEdited.mutate();
                    setQuestionTextEdited(false);
                  }
                  mutationSaveNewQuestionOptions.mutate();
                  mutationSaveDeleteOptions.mutate();
                  mutationSaveUpdateOptions.mutate();
                  setIsEditable(false);
                }}
                loading={
                  mutationSaveQuestionTextEdited.isPending ||
                  mutationSaveNewQuestionOptions.isPending ||
                  mutationSaveDeleteOptions.isPending ||
                  mutationSaveUpdateOptions.isPending
                }
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
              onClick={() => mutationRemoveQuestion.mutate()}
              loading={mutationRemoveQuestion.isPending}
            >
              <RadixIconsTrash style={{ width: "70%", height: "auto" }} />
            </ActionIcon>
          </Stack>
        </Grid.Col>
      )}
    </Grid>
  );
}
