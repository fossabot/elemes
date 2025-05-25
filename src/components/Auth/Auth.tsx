import { zodResolver } from "@hookform/resolvers/zod";
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "react-hook-form";

import { QueryClient, useMutation } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { authClient } from "~/lib/client/auth";
import { LoginSchema, SignUpSchema } from "./schema";
import classes from "./style.module.css";

interface LoginProps {
  queryClient: QueryClient;
}
export function Login({ queryClient }: LoginProps) {
  const loginForm = useForm({
    resolver: zodResolver(LoginSchema),
  });
  const { register, handleSubmit, formState, control } = loginForm;
  const { errors } = formState;
  const navigate = useNavigate();
  const router = useRouter();

  const mutationLogin = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const { email, password } = data;
      await authClient.signIn.email({
        email: email,
        password: password,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await navigate({ to: "/" });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Welcome back!
      </Title>

      <Text className={classes.subtitle}>
        Do not have an account yet?{" "}
        <Anchor href="/register">Create account</Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={22} mt={30} radius="md">
        <form
          onSubmit={handleSubmit(async (data) => {
            mutationLogin.mutate(data);
          })}
        >
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            radius="md"
            {...register("email")}
            error={errors.email?.message}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            {...register("password")}
            error={errors.password?.message}
          />
          <Button type="submit" fullWidth mt="xl" radius="md">
            Sign in
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

interface RegisterProps {
  queryClient: QueryClient;
}
export function Register({ queryClient }: RegisterProps) {
  const registerForm = useForm({
    resolver: zodResolver(SignUpSchema),
  });
  const { register, handleSubmit, formState, control } = registerForm;
  const { errors } = formState;
  const navigate = useNavigate();

  const mutationRegister = useMutation({
    mutationFn: async (data: {
      email: string;
      password: string;
      name: string;
    }) => {
      const { email, password, name } = data;
      await authClient.signUp.email({
        email: email,
        password: password,
        name: name,
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
      await navigate({ to: "/" });
    },
    onError: (error) => {
      console.error("Register failed:", error);
    },
  });

  return (
    <Container size={420} my={40}>
      <Title ta="center" className={classes.title}>
        Create an account
      </Title>

      <Text className={classes.subtitle} ta="center" mt="sm" color="dimmed">
        Already have an account? <Anchor href="/login">Sign in</Anchor>
      </Text>

      <Paper withBorder shadow="sm" p={30} mt={30} radius="md">
        <form
          onSubmit={handleSubmit(async (data) => {
            mutationRegister.mutate(data);
          })}
        >
          <TextInput
            label="Name"
            placeholder="you"
            required
            radius="md"
            {...register("name")}
            error={errors.name?.message}
          />
          <TextInput
            label="Email"
            placeholder="you@example.com"
            required
            mt="md"
            radius="md"
            {...register("email")}
            error={errors.email?.message}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            radius="md"
            {...register("password")}
            error={errors.password?.message}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            radius="md"
            {...register("confirmPassword")}
          />
          <Button fullWidth mt="xl" radius="md" type="submit">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
