import {
	ActionIcon,
	useMantineColorScheme,
	useComputedColorScheme,
} from "@mantine/core";
import IcOutlineDarkMode from "~icons/ic/outline-dark-mode";
import IcBaselineLightMode from "~icons/ic/baseline-light-mode";
import cx from "clsx";
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
