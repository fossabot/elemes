import {
  ActionIcon,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import cx from "clsx";
import IcBaselineLightMode from "~icons/ic/baseline-light-mode";
import IcOutlineDarkMode from "~icons/ic/outline-dark-mode";
import classes from "./style.module.css";

export function SchemaColor() {
  const { setColorScheme } = useMantineColorScheme();
  const computedColorScheme = useComputedColorScheme("light", {
    getInitialValueInEffect: true,
  });

  return (
    <ActionIcon
      onClick={() =>
        setColorScheme(computedColorScheme === "light" ? "dark" : "light")
      }
      variant="default"
      size="xl"
      aria-label="Toggle color scheme"
    >
      <IcOutlineDarkMode
        className={cx(classes.icon, classes.light)}
        stroke={"1.5"}
      />
      <IcBaselineLightMode
        className={cx(classes.icon, classes.dark)}
        stroke={"1.5"}
      />
    </ActionIcon>
  );
}
