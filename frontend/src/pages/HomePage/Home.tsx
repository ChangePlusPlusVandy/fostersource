import React from "react";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex">
      <div className="flex-grow">
        {/* Main Content */}
        <main className="container mx-auto py-8 px-6 max-w-screen-lg">
          {/* Welcome Section */}
          <section className="text-center py-6">
            <img
              src="images/welcomeToLearningSource.png"
              alt="Welcome to the Learning Source"
              className="mx-auto shadow-md rounded-lg"
              style={{
                width: "90%",
                maxWidth: "816px",
                height: "auto",
              }}
            />
          </section>

          {/* Navigation Tiles */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">

            {/* Getting Started Tile */}        
            <div
            className="relative overflow-hidden shadow-lg mx-auto"
            style={{
                width: "90%",
                maxWidth: "600px",
                aspectRatio: "16/9",
                borderRadius: "20px",
            }}
            >
            {/* Background Image */}
            <img
                src="/images/gettingStarted.png"
                alt="Getting Started Background"
                className="absolute inset-0 w-full h-full object-cover filter grayscale"
            />

            {/* Orange Overlay */}
            <div
                className="absolute inset-0"
                style={{
                backgroundColor: "#F79518",
                opacity: 0.7,
                }}
            ></div>

            {/* Text and Button Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 pb-9">
                {/* Title */}
                <h2
                className="text-white font-poppins font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-6"
                style={{
                    fontSize: "clamp(1.5rem, 2vw, 2.5rem)", // This is supposed to scale fontsize but idk if it works
                    lineHeight: "1.2",
                }}
                >
                Getting Started
                </h2>

                {/* Button */}
                <button
                className="bg-black text-white px-6 py-2 rounded-lg shadow hover:bg-gray-800 transition duration-200"
                >
                Learn More
                </button>
            </div>
            </div>

            {/* Catalog Tile */}
            <div
              className="relative overflow-hidden shadow-lg mx-auto"
              style={{
                width: "90%",
                maxWidth: "600px",
                aspectRatio: "16/9",
                borderRadius: "20px",
              }}
            >
              {/* Background Image */}
              <img
                src="/images/catalogHomePage.png"
                alt="Catalog Background"
                className="absolute inset-0 w-full h-full object-cover filter grayscale"
              />

              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center pb-9">
              <h2
                className="text-white font-poppins font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1"
                style={{
                    fontSize: "clamp(1.5rem, 2vw, 2.5rem)", 
                    lineHeight: "1.2",
                }}
                >
                  Catalog
                </h2>
              </div>
            </div>

            {/* In-Person Training Tile */}
            <div
              className="relative overflow-hidden shadow-lg mx-auto"
              style={{
                width: "90%",
                maxWidth: "600px",
                aspectRatio: "16/9",
                borderRadius: "20px",
              }}
            >
              {/* Background Image */}
              <img
                src="/images/inPersonTraining.png"
                alt="In-Person Training Background"
                className="absolute inset-0 w-full h-full object-cover filter grayscale"
              />

              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center pb-9">
              <h2
                className="text-white font-poppins font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1"
                style={{
                    fontSize: "clamp(1.5rem, 2vw, 2.5rem)", 
                    lineHeight: "1.2",
                }}
                >
                  In-person Training
                </h2>
              </div>
            </div>

            {/* Online Training Tile */}
            <div
              className="relative overflow-hidden shadow-lg mx-auto"
              style={{
                width: "90%",
                maxWidth: "600px",
                aspectRatio: "16/9",
                borderRadius: "20px",
              }}
            >
              {/* Background Image */}
              <img
                src="/images/onlineTraining.png"
                alt="Online Training Background"
                className="absolute inset-0 w-full h-full object-cover filter grayscale"
              />

              {/* Text Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center pb-9">
              <h2
                className="text-white font-poppins font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-1"
                style={{
                    fontSize: "clamp(1.5rem, 2vw, 2.5rem)", 
                    lineHeight: "1.2",
                }}
                >
                  Online Training
                </h2>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
