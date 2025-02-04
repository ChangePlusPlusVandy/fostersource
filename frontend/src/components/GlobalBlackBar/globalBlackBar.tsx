import React from "react";
import { Phone, Mail } from "lucide-react";
import "./globalBlackBar.css";

const GlobalBlackBar = () => {
	return (
		<div className="global-black-bar">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-4">
					<div className="flex items-center space-x-2">
						<Phone className="text-white w-5 h-5" />
						<a href="tel:+13036184331" className="text-white">
							(303) 618-4331
						</a>
					</div>
					<div className="flex items-center space-x-2">
						<Mail className="text-white w-5 h-5" />
						<a href="mailto:info@fostersource.org" className="text-white">
							info@fostersource.org
						</a>
					</div>
				</div>

				<div className="flex space-x-4">
					<a
						href="https://www.facebook.com/FosterSource/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="/assets/icons/facebook.png"
							alt="Facebook"
							className="text-white w-5 h-5"
						/>
					</a>
					<a
						href="https://twitter.com/FosterSource"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="/assets/icons/twitter.png"
							alt="Twitter"
							className="text-white w-5 h-5"
						/>
					</a>
					<a
						href="https://instagram.com/fostersource"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="/assets/icons/instagram.png"
							alt="Instagram"
							className="text-white w-5 h-5"
						/>
					</a>
					<a
						href="https://www.youtube.com/channel/UCh_IJt7uDOjTLlGR14dtCFg"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="/assets/icons/youtube.png"
							alt="YouTube"
							className="text-white w-5 h-5"
						/>
					</a>
				</div>

				<a
					href="https://fostersource.org/donate/"
					target="_blank"
					rel="noopener noreferrer"
					className="donate-now-btn"
				>
					DONATE NOW
				</a>
			</div>
		</div>
	);
};

export default GlobalBlackBar;
