import { Card, Flex, Modal, Stack, Text, Title } from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import { CleanExamWithName } from "~/types/db";
import classes from "./style.module.css";
import { useDisclosure } from "@mantine/hooks";

interface ExamsProps {
  data: CleanExamWithName[];
}

export function Exams({ data }: ExamsProps) {
  const location = useLocation();

  const cards = data.map((exam) => (
    <Card
      key={exam.title}
      p="md"
      radius="md"
      component={Link}
      from={"/" + location.pathname.split("/")[1]}
      to={exam.id.toString()}
      className={classes.card}
      shadow="none"
      w={"100%"}
    >
      <Title order={3} lineClamp={1}>
        {exam.title}
      </Title>
      <Stack gap={0} mt={"xs"}>
        <Text c={"dimmed"} size="md">
          Author: {exam.authorName}
        </Text>
        <Text c={"dimmed"} size="sm">
          Created: {exam.createdAt.toLocaleDateString()}
        </Text>
      </Stack>
    </Card>
  ));

  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication">
        {/* Modal content */}
      </Modal>
      <Flex gap="md" align="center" direction="row" wrap="wrap">
        {cards}
      </Flex>
    </>
  );
}
