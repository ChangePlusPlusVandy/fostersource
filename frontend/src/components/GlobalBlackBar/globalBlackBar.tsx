import React, { useEffect, useRef } from "react";
import { Phone, Mail } from "lucide-react";

import "./globalBlackBar.css";
import GoogleTranslate from "../GoogleTranslate/GoogleTranslate";

const GlobalBlackBar = () => {
	const translateLabelRef = useRef<HTMLSpanElement>(null);

	useEffect(() => {
		const checkTranslateElement = () => {
			const translateElement = document.getElementById("google_translate_element");
			if (translateElement && !translateElement.hasChildNodes()) {
				if (window.googleTranslateElementInit) {
					window.googleTranslateElementInit();
				}
			}
		};
		
		setTimeout(checkTranslateElement, 1000);
		const handleTranslateClick = () => {
			const googleElement = document.querySelector('.goog-te-gadget-simple');
			if (googleElement) {
				(googleElement as HTMLElement).click();
			} else {
				console.log('Google translate element not found, trying to initialize');
				if (window.googleTranslateElementInit) {
					window.googleTranslateElementInit();
					setTimeout(() => {
						const newElement = document.querySelector('.goog-te-gadget-simple');
						if (newElement) {
							(newElement as HTMLElement).click();
						}
					}, 500);
				}
			}
		};

		const translateLabel = translateLabelRef.current;
		if (translateLabel) {
			translateLabel.addEventListener('click', handleTranslateClick);
		}

		return () => {
			if (translateLabel) {
				translateLabel.removeEventListener('click', handleTranslateClick);
			}
		};
	}, []);

	return (
		<div className="global-black-bar">
			<div className="left-side">
				<div className="contact-info">
					<div className="contact-item">
						<Phone className="contact-icon" />
						<a href="tel:+13036184331">
							(303) 618-4331
						</a>
					</div>
					<div className="contact-item">
						<Mail className="contact-icon" />
						<a href="mailto:info@fostersource.org">
							info@fostersource.org
						</a>
					</div>
				</div>

				<div className="social-links">
					<a
						href="https://www.facebook.com/FosterSource/"
						target="_blank"
						rel="noopener noreferrer"
					>
						<img
							src="/assets/icons/facebook.png"
							alt="Facebook"
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
						/>
					</a>
				</div>
			</div>

			<div className="right-side">
				<div className="translate-wrapper">
					<span 
						ref={translateLabelRef} 
						className="translate-label"
						style={{ cursor: 'pointer', color: 'white' }}
					>
						Translate
					</span>
					<GoogleTranslate />
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
