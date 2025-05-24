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
import { useLocation } from "@tanstack/react-router";
import { useState } from "react";
import IcBaselineEdit from "~icons/ic/baseline-edit";
import IcRoundSave from "~icons/ic/round-save";
import RadixIconsTrash from "~icons/radix-icons/trash";

interface ExamQuestionProps {
  questionId: string;
}
export function ExamQuestion({ questionId }: ExamQuestionProps) {
  const location = useLocation();
  const [isEditable, setIsEditable] = useState(false);
  const { ref, height } = useElementSize();
  const isEdit = location.pathname.includes("/edit");

  const [problem, setProblem] = useState(questionId);
  function handleProblemChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProblem(e.currentTarget.value);
  }

  const [radioOptions, setRadioOptions] = useState([
    { value: "react", label: "React", isCorrect: false },
    { value: "svelte", label: "Svelte", isCorrect: false },
    { value: "ng", label: "Angular", isCorrect: false },
    { value: "vue", label: "Vue", isCorrect: false },
  ]);

  const addRadioOption = () => {
    setRadioOptions([
      ...radioOptions,
      {
        value: `option-${radioOptions.length + 1}`,
        label: "New Option",
        isCorrect: false,
      },
    ]);
  };

  const deleteRadioOption = (index: number) => {
    const newOptions = [...radioOptions];
    newOptions.splice(index, 1);
    setRadioOptions(newOptions);
  };

  const updateOptionLabel = (index: number, newLabel: string) => {
    const newOptions = [...radioOptions];
    newOptions[index].label = newLabel;
    setRadioOptions(newOptions);
  };

  const setCorrectAnswer = (index: number) => {
    const newOptions = radioOptions.map((option, i) => ({
      ...option,
      isCorrect: i === index,
    }));
    setRadioOptions(newOptions);
  };

  return (
    <Grid>
      <Grid.Col span={isEdit ? 11 : 12}>
        <Card shadow={"md"} p={"md"} w={"100%"} ref={ref}>
          {isEditable ? (
            <TextInput
              size={"md"}
              value={problem}
              onChange={(e) => {
                handleProblemChange(e);
              }}
            />
          ) : (
            <Text>{problem}</Text>
          )}
          <Divider my={"md"} />
          <Radio.Group
            name="favoriteFramework"
          >
            <Stack mt="xs">
              {radioOptions.map((option, index) => (
                <Flex key={index} align="center" gap="sm">
                  {isEditable ? (
                    <>
                      <TextInput
                        value={option.label}
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
                      value={option.value}
                      label={
                        <Flex align="center" gap="sm">
                          {option.label}
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
                onClick={() => setIsEditable(false)}
              >
                <IcRoundSave style={{ width: "70%", height: "auto" }} />
              </ActionIcon>
            ) : (
              <ActionIcon size={40} onClick={() => setIsEditable(true)}>
                <IcBaselineEdit style={{ width: "70%", height: "auto" }} />
              </ActionIcon>
            )}
            <ActionIcon bg={"red"} size={40}>
              <RadixIconsTrash style={{ width: "70%", height: "auto" }} />
            </ActionIcon>
          </Stack>
        </Grid.Col>
      )}
    </Grid>
  );
}
