const DisplayBar = ({
	status,
}: {
	status: "webinar" | "survey" | "certificate";
}) => {
	const getButtonStyle = (button: "webinar" | "survey" | "certificate") => {
		const baseStyle = {
			width: "100px",
			height: "28px",
			fontWeight: 600,
			fontSize: "10px",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			border: "none",
			cursor: "pointer",
		};

		const colors = {
			webinar: status === "webinar" ? "#F79518" : "#FBD9A5",
			survey:
				status === "survey"
					? "#F79518"
					: status === "certificate"
						? "#FBD9A5"
						: "#D9D9D9",
			certificate: status === "certificate" ? "#F79518" : "#D9D9D9",
		};

		return {
			...baseStyle,
			backgroundColor: colors[button],
			color: status === button ? "white" : "black",
		};
	};

	return (
		<div
			className="mt-1"
			style={{ display: "flex", alignItems: "center", gap: "2px" }}
		>
			{/* Webinar Button */}
			<button
				style={{
					...getButtonStyle("webinar"),
					clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%)",
					borderRadius: "15px 0 0 15px",
					marginRight: "-10px",
				}}
			>
				Webinar
			</button>

			{/* Survey Button */}
			<button
				style={{
					...getButtonStyle("survey"),
					clipPath: "polygon(0 0, 85% 0, 100% 50%, 85% 100%, 0 100%, 15% 50%)",
					marginRight: "-10px",
				}}
			>
				Survey
			</button>

			{/* Certificate Button */}
			<button
				style={{
					...getButtonStyle("certificate"),
					clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 15% 50%)",
					borderRadius: "0 15px 15px 0",
				}}
			>
				Certificate
			</button>
		</div>
	);
};

export default DisplayBar;
