import { Loader } from "lucide-react";
type Props = {};

const Loading = (props: Props) => {
	return (
		<div className="flex items-center justify-center h-screen">
			<Loader className="size-6 animate-spin" />
		</div>
	);
};

export default Loading;
