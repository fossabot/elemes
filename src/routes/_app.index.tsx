import { Center, Container } from "@mantine/core";
import { Exams } from "~/components/Exams/Exams";
import { queryGetExamsOptions } from "~/lib/server/exam";

export const Route = createFileRoute({
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(queryGetExamsOptions());
  },
  component: App,
  notFoundComponent: () => NotFound(),
});

function App() {
  const data = Route.useLoaderData();
  return (
    <Container py="xl">
      <Exams data={data} />
    </Container>
  );
}

function NotFound() {
  return (
    <Container py="xl">
      <Center>belum ada exam yang publik</Center>
    </Container>
  );
}
