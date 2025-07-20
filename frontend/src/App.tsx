import React from "react";
import AppRoutes from "./routes/appRoutes";
import "react-datepicker/dist/react-datepicker.css";

const App: React.FC = () => {
	return (
		<div className="min-h-screen flex flex-col">
			<AppRoutes />
		</div>
	);
};

export default App;
