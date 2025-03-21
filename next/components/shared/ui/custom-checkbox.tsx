import { Check } from "lucide-react";
import * as CustomCheckboxPrimitive from "./custom-checkbox-primitives";
import { cn } from "@/lib/utils";

const CustomCheckbox = ({
	ref,
	className,
	...props
}: React.ComponentProps<typeof CustomCheckboxPrimitive.Root>) => {
	return (
		<CustomCheckboxPrimitive.Provider>
			<CustomCheckboxPrimitive.Root
				ref={ref}
				className={cn(
					"peer size-3.5 shrink-0 rounded-[6px] border border-primary ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground",
					className,
				)}
				{...props}
			>
				<CustomCheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
					<Check className="size-3" />
				</CustomCheckboxPrimitive.Indicator>
			</CustomCheckboxPrimitive.Root>
		</CustomCheckboxPrimitive.Provider>
	);
};
CustomCheckbox.displayName = "CustomCheckbox";

export { CustomCheckbox };
