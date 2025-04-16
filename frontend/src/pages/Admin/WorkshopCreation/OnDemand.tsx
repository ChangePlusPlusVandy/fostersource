import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

interface OnDemandComponentProps {
	onDemandData: {
		embeddingLink: string;
	};
	setOnDemandData: Dispatch<SetStateAction<any>>;
}
export default function OnDemandComponent({
	onDemandData,
	setOnDemandData,
}: OnDemandComponentProps) {
	const handleChange = (e: any) => {
		const { name, value } = e.target;
		setOnDemandData({ ...onDemandData, [name]: value });
	};
	return (
		<div>
			<label className="text-sm font-medium block">Embedding Link</label>
			<input
				name="embeddingLink"
				value={onDemandData.embeddingLink}
				onChange={handleChange}
				className="mt-1 w-full p-2 border rounded"
				placeholder=""
				required
			/>
		</div>
	);
}
