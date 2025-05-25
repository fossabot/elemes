import {
  ActionIcon,
  AppShell,
  Button,
  Container,
  Group,
  Menu,
  Stack,
  Text,
} from "@mantine/core";
import { QueryClient, useQuery } from "@tanstack/react-query";
import {
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useState } from "react";
import Logo from "~/components/logo";
import { SchemaColor } from "~/components/SchemaColor/SchemaColor";
import { authClient } from "~/lib/client/auth";
import { queryGetUserOptions, serverCheckSession } from "~/lib/server/auth";
import RadixIconsAvatar from "~icons/radix-icons/avatar";

export const Route = createFileRoute({
  beforeLoad: async ({ context }) => {
    if (!context.user) {
      throw redirect({ to: "/login" });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { queryClient } = Route.useRouteContext();
  const [opened, setOpened] = useState(false);
  const navigate = useNavigate();

  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Container h={"100%"}>
          <Group h="100%" px="md" justify={"space-between"} align={"center"}>
            <ActionIcon
              size={50}
              variant="transparent"
              aria-label="Logo"
              onClick={() => navigate({ to: "/", reloadDocument: true })}
            >
              <Logo />
            </ActionIcon>
            <Group>
              <Menu width={200} position="bottom-end" opened={opened}>
                <Menu.Target>
                  <ActionIcon
                    radius={"xl"}
                    size={35}
                    onClick={() => setOpened((o) => !o)}
                  >
                    <RadixIconsAvatar
                      style={{ width: "75%", height: "auto" }}
                    />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <AvatarMenu queryClient={queryClient} setOpened={setOpened} />
                </Menu.Dropdown>
              </Menu>
              <SchemaColor />
            </Group>
          </Group>
        </Container>
      </AppShell.Header>
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}

interface AvatarMenuProps {
  queryClient: QueryClient;
  setOpened: React.Dispatch<React.SetStateAction<boolean>>;
}
function AvatarMenu({ queryClient, setOpened }: AvatarMenuProps) {
  const { data: userData } = useQuery(queryGetUserOptions());
  const router = useRouter();
  const navigate = useNavigate();

  return (
    <>
      <Stack gap={0} px={"sm"}>
        <Text size="md" fw={500} truncate="end">
          {userData?.name}
        </Text>
        <Text c="dimmed" size="sm" truncate="end">
          {userData?.email}
        </Text>
      </Stack>
      <Menu.Divider />
      <Button
        fullWidth
        variant={"subtle"}
        justify={"left"}
        component={Link}
        to={"/edit"}
        onClick={() => {
          setOpened(false);
        }}
      >
        My Exam
      </Button>
      <Button
        fullWidth
        variant={"subtle"}
        justify={"left"}
        color="red"
        onClick={async () => {
          await authClient.signOut();
          await queryClient.invalidateQueries({ queryKey: ["user"] });
          await router.invalidate();
          await navigate({ to: "/login" });
        }}
      >
        Sign out
      </Button>
    </>
  );
}
