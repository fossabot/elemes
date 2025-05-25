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
  const [listAPiKeys, setListApiKeys] = useState<string[]>(
    apiKeys.map((key) => key.id),
  );

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
      setListApiKeys((prevKeys) => [...prevKeys, data.id]);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  type mutationDeleteApiKeyType = {
    keyId: string;
    index: number;
  };
  const mutationDeleteApiKey = useMutation({
    mutationFn: async (props: mutationDeleteApiKeyType) => {
      const { data, error } = await authClient.apiKey.delete({
        keyId: props.keyId,
      });
      if (error) {
        throw new Error(error.message);
      }
      return props;
    },
    onSuccess: async (props) => {
      setListApiKeys((prevKeys) => {
        const newKeys = [...prevKeys];
        newKeys.splice(props.index, 1);
        return newKeys;
      });
      if (newApikey === props.keyId) {
        setNewApikey(undefined);
      }
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
        {listAPiKeys && listAPiKeys.length > 0 ? (
          <>
            <Text ta={"center"}>(click on the key to delete it)</Text>
            <Space h="sm" />
            <Stack gap={"sm"}>
              {listAPiKeys.map((keyId, index) => (
                <Button
                  key={keyId}
                  color={"red"}
                  fullWidth
                  onClick={() =>
                    mutationDeleteApiKey.mutate({
                      keyId,
                      index,
                    })
                  }
                  loading={mutationDeleteApiKey.isPending}
                >
                  {keyId}
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
