import { Card, Flex, Stack, Text, Title } from "@mantine/core";
import { Link, useLocation } from "@tanstack/react-router";
import { CleanExamWithName } from "~/types/db";
import classes from "./style.module.css";

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

  return (
    <Flex gap="md" align="center" direction="row" wrap="wrap">
      {cards}
    </Flex>
  );
}
