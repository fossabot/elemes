import {
  Button,
  Container,
  Paper,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { authClient } from "~/lib/client/auth";
import { serverGetApiKey } from "~/lib/server/auth";

export const Route = createFileRoute({
  loader: async () => {
    const apiKeys = await serverGetApiKey();
    return { apiKeys };
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { apiKeys } = Route.useLoaderData();
  const navigate = Route.useNavigate();

  const [newApikey, setNewApikey] = useState<string>();

  const mutationCreateApiKey = useMutation({
    mutationFn: async () => {
      const { data: apiKey, error } = await authClient.apiKey.create();
      if (error) {
        throw new Error(error.message);
      }
      return apiKey;
    },
    onSuccess: async (data) => {
      setNewApikey(data.key);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  const mutationDeleteApiKey = useMutation({
    mutationFn: async (keyId: string) => {
      const { data, error } = await authClient.apiKey.delete({ keyId });
      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: async () => {
      navigate({ to: ".", reloadDocument: true });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return (
    <Container py="xl">
      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <Title order={3}>Generate Api Key</Title>
        <Space h="md" />
        <Button
          fullWidth
          onClick={() => mutationCreateApiKey.mutate()}
          loading={mutationCreateApiKey.isPending}
        >
          Generate Key
        </Button>
        <Space h="md" />
        {newApikey && (
          <Paper withBorder shadow="sm" p={16} radius="md">
            <Text fw={700}>New API Key</Text>
            <Text ta={"center"}>{newApikey}</Text>
            <Space h="md" />
          </Paper>
        )}
        {apiKeys && apiKeys.length > 0 ? (
          <>
            <Text ta={"center"}>(click on the key to delete it)</Text>
            <Space h="sm" />
            <Stack gap={"sm"}>
              {apiKeys.map((key) => (
                <Button
                  key={key.id}
                  color={"red"}
                  fullWidth
                  onClick={() => mutationDeleteApiKey.mutate(key.id)}
                  loading={mutationDeleteApiKey.isPending}
                >
                  {key.id}
                </Button>
              ))}
            </Stack>
          </>
        ) : (
          <>
            <Space h="md" />
            <Text ta={"center"} fw={700}>
              No API keys found.
            </Text>
          </>
        )}
      </Paper>
    </Container>
  );
}
