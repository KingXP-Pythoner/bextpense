import * as React from "react";

interface CustomCheckboxContextValue {
	checked?: CheckedState;
	disabled?: boolean;
	setChecked?: (checked: CheckedState) => void;
}

const CustomCheckboxContext = React.createContext<
	CustomCheckboxContextValue | undefined
>(undefined);

const useCustomCheckboxContext = () => {
	const context = React.useContext(CustomCheckboxContext);
	if (!context) {
		throw new Error(
			"useCustomCheckbox must be used within a CustomCheckboxContext",
		);
	}
	return context;
};

const Provider = ({
	children,
	...props
}: CustomCheckboxContextValue & { children: React.ReactNode }) => {
	const [checked, setChecked] = React.useState<CheckedState>(
		props.checked ?? "indeterminate",
	);

	return (
		<CustomCheckboxContext.Provider
			value={{
				checked,
				setChecked,
				disabled: props.disabled,
			}}
		>
			{children}
		</CustomCheckboxContext.Provider>
	);
};

interface CustomCheckBoxProps extends React.ComponentProps<"button"> {
	checked: boolean;
	onCheckedChange: (checked: CheckedState) => void;
}

type CheckedState = boolean | "indeterminate";

function isIndeterminate(checked?: CheckedState): checked is "indeterminate" {
	return checked === "indeterminate";
}

function getState(checked?: CheckedState) {
	return isIndeterminate(checked)
		? "indeterminate"
		: checked
			? "checked"
			: "unchecked";
}

const Root = ({
	checked: checkedProp,
	onCheckedChange,
	...props
}: CustomCheckBoxProps) => {
	const { checked, setChecked } = useCustomCheckboxContext();

	React.useEffect(() => {
		if (setChecked && checkedProp !== checked) {
			setChecked(checkedProp);
		}
	}, [checkedProp, checked, setChecked]);

	return (
		<button
			type="button"
			role="checkbox"
			aria-checked={isIndeterminate(checked) ? "mixed" : checked}
			data-state={getState(checked)}
			data-disabled={props.disabled ? "" : undefined}
			value="on"
			{...props}
			onKeyDown={(event) => {
				// WAI ARIA does not support keydown events for checkboxes on Enter

				if (event.key === "Enter") {
					event.preventDefault();
				}
			}}
			onMouseDown={(e) => {
				const newChecked = isIndeterminate(checked) ? true : !checked;
				setChecked?.(newChecked);
				onCheckedChange?.(newChecked);
			}}
		></button>
	);
};

type CustomCheckBoxIndicatorProps = React.ComponentProps<"span">;

const Indicator = ({ children, ...props }: CustomCheckBoxIndicatorProps) => {
	const { checked, disabled } = useCustomCheckboxContext();
	return (
		<span
			data-state={getState(checked)}
			data-disabled={disabled ? "" : undefined}
			{...props}
			style={{
				pointerEvents: "none",
				...props.style,
			}}
		>
			{checked && !isIndeterminate(checked) ? children : null}
		</span>
	);
};

export { Root, Indicator, Provider };
