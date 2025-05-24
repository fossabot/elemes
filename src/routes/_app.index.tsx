import { Center, Container } from "@mantine/core";
import { Exams } from "~/components/Exams/Exams";
import { queryGetExamsOptions } from "~/lib/server/exam";

export const Route = createFileRoute({
  loader: async ({ context }) => {
    const data = await context.queryClient.ensureQueryData(
      queryGetExamsOptions(),
    );
    return data;
  },
  component: App,
  notFoundComponent: () => notFound(),
});

function App() {
  const data = Route.useLoaderData();
  return (
    <Container py="xl">
      <Exams data={data} />
    </Container>
  );
}

function notFound() {
  return (
    <Container py="xl">
      <Center>belum ada exam yang publik</Center>
    </Container>
  );
}
