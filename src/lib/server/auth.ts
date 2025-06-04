import { queryOptions } from "@tanstack/react-query";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "../auth";

export const serverGetUser = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getWebRequest();
    const session = await auth.api.getSession({ headers });

    return session?.user || null;
  },
);

export const serverCheckSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getWebRequest();
    const session = await auth.api.getSession({ headers });
    return !!session?.session;
  },
);

export const queryGetUserOptions = () =>
  queryOptions({
    queryKey: ["user"],
    queryFn: () => serverGetUser(),
  });

export const serverGetApiKey = createServerFn({ method: "GET" }).handler(
  async () => {
    const { headers } = getWebRequest();
    const apikey = await auth.api.listApiKeys({ headers });

    return apikey || null;
  },
);
