import { MantineProvider } from "@mantine/core";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import * as React from "react";

import defaultMantine from "@mantine/core/styles.css?url";
import { queryGetUserOptions, serverGetUser } from "~/lib/server/auth";
import { shadcnCssVariableResolver } from "~/mantine/cssVariableResolver";
import fontCustom from "~/mantine/font.css?url";
import customMantine from "~/mantine/style.css?url";
import { shadcnTheme } from "~/mantine/theme";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  user: boolean;
}>()({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.fetchQuery({
      ...queryGetUserOptions(),
      queryFn: ({ signal }) => serverGetUser({ signal }),
    });

    return { user };
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "elemes",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: defaultMantine,
      },
      {
        rel: "stylesheet",
        href: customMantine,
      },
      {
        rel: "stylesheet",
        href: fontCustom,
      },
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon-16x16.png",
      },
      { rel: "manifest", href: "/site.webmanifest", color: "#fffff" },
      { rel: "icon", href: "/favicon.ico" },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html data-mantine-color-scheme="light">
      <head>
        <HeadContent />
      </head>
      <body>
        <MantineProvider
          theme={shadcnTheme}
          cssVariablesResolver={shadcnCssVariableResolver}
        >
          {children}
        </MantineProvider>
        <TanStackRouterDevtools />
        <ReactQueryDevtools initialIsOpen={false} />
        <Scripts />
      </body>
    </html>
  );
}
