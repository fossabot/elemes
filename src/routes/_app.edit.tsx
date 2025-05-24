import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Card,
  Center,
  Container,
  Modal,
  Space,
  Stack,
  TextInput,
  UnstyledButton,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Exams } from "~/components/Exams/Exams";
import {
  queryGetUserExamsOptions,
  serverCreateNewExam,
} from "~/lib/server/exam";

export const Route = createFileRoute({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(
      queryGetUserExamsOptions(),
    );
    return data;
  },
  component: RouteComponent,
  notFoundComponent: () => RouteComponent({ notFound: true }),
});

interface RouteComponentProps {
  notFound?: boolean;
}
function RouteComponent({ notFound }: RouteComponentProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const data = Route.useLoaderData();
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();

  const newExamForm = useForm({
    resolver: zodResolver(newExamsSchema),
  });
  const { register, handleSubmit, formState, control } = newExamForm;
  const { errors } = formState;

  const mutationNewExam = useMutation({
    mutationFn: async (name: string) => {
      const result = await serverCreateNewExam({ data: { name } });
      return result;
    },
    onSuccess: (data, variables, context) => {
      router.invalidate();
      newExamForm.reset();
      navigate({
        from: "/",
        to: `/edit/${data.id}`,
      });
    },
    onError: (error) => {
      console.error("Error creating exam:", error);
    },
  });

  return (
    <>
      <Modal opened={opened} onClose={close} title="Add New Exam">
        <Stack px={"md"}>
          <form
            onSubmit={handleSubmit((data) => {
              mutationNewExam.mutate(data.name);
            })}
          >
            <TextInput
              label="Exam Name"
              required
              {...register("name")}
              error={errors.name?.message}
            />
            <Button fullWidth mt="md" type="submit">
              Save
            </Button>
          </form>
        </Stack>
      </Modal>

      <Container py="xl">
        <Stack>
          <UnstyledButton onClick={() => open()}>
            <Card shadow="none">
              <Center>Add New Exam</Center>
            </Card>
          </UnstyledButton>
        </Stack>
        <Space h="xl" />
        {notFound ? (
          <Container py="xl">
            <Center>No exams available</Center>
          </Container>
        ) : (
          <Exams data={data} />
        )}
      </Container>
    </>
  );
}

const newExamsSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
});
