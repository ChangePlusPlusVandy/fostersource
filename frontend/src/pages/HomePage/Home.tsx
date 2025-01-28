import { motion } from "framer-motion";
import {Link} from "react-router-dom";
import {logout} from "../../components/Sidebar/sidebar";

export default function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex w-full">
      <div className="flex-grow">
        <main className="container mx-auto py-8 px-6 max-w-screen-lg">
          {/* Welcome Section */}
          <section className="text-center py-6">
            <motion.img
              src="images/welcomeToLearningSource.png"
              alt="Welcome to the Learning Source"
              className="mx-auto shadow-md rounded-lg"
              style={{
                width: "90%",
                maxWidth: "816px",
                height: "auto",
              }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
            />
          </section>

          {/* Navigation Tiles */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {/* Getting Started Tile */}
            <motion.div
              className="relative overflow-hidden shadow-lg mx-auto"
              style={{
                width: "90%",
                maxWidth: "600px",
                aspectRatio: "16/9",
                borderRadius: "20px",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                transition: { duration: 0.15 },
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
                  opacity: 0.6,
                }}
              ></div>

              {/* Text and Button Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-end text-center px-4 pb-4">
                {/* Title */}
                <h2
                  className="text-white font-poppins font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-6"
                  style={{
                    fontSize: "clamp(1.25rem, 1.8vw, 2rem)",
                    lineHeight: "1.2",
                  }}
                >
                  Getting Started
                </h2>

                {/* Animated Button */}
                <motion.button
                  whileHover={{
                    scale: 1.02, 
                    boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.3)", 
                  }}
                  whileTap={{ scale: 0.93 }} 
                  className="bg-black text-white px-6 py-2 rounded-lg shadow hover:bg-gray-800 transition duration-200"
                >
                  Learn More
                </motion.button>
              </div>
            </motion.div>

            {/* Catalog Tile */}

            <Link to={"/catalog"}>
                <motion.div
                    className="relative overflow-hidden shadow-lg mx-auto"
                    style={{
                        width: "90%",
                        maxWidth: "600px",
                        aspectRatio: "16/9",
                        borderRadius: "20px",
                    }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    whileHover={{
                        scale: 1.05,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                        transition: { duration: 0.15 },
                    }}
                >
                    <img
                        src="/images/catalogHomePage.png"
                        alt="Catalog Background"
                        className="absolute inset-0 w-full h-full object-cover filter grayscale"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center pb-4">
                        <h2
                            className="text-white font-poppins font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-1"
                            style={{
                                fontSize: "clamp(1.25rem, 1.8vw, 2rem)",
                                lineHeight: "1.2",
                            }}
                        >
                            Catalog
                        </h2>
                    </div>
                </motion.div>
            </Link>



            {/* In-Person Training Tile */}
            <motion.div
              className="relative overflow-hidden shadow-lg mx-auto"
              style={{
                width: "90%",
                maxWidth: "600px",
                aspectRatio: "16/9",
                borderRadius: "20px",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                transition: { duration: 0.15 },
              }}
            >
              <img
                src="/images/inPersonTraining.png"
                alt="In-Person Training Background"
                className="absolute inset-0 w-full h-full object-cover filter grayscale"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center pb-4">
                <h2
                  className="text-white font-poppins font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-1"
                  style={{
                    fontSize: "clamp(1.25rem, 1.8vw, 2rem)",
                    lineHeight: "1.2",
                  }}
                >
                  In-person Training
                </h2>
              </div>
            </motion.div>

            {/* Online Training Tile */}
            <motion.div
              className="relative overflow-hidden shadow-lg mx-auto"
              style={{
                width: "90%",
                maxWidth: "600px",
                aspectRatio: "16/9",
                borderRadius: "20px",
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0px 4px 10px rgba(0,0,0,0.3)",
                transition: { duration: 0.15 },
              }}
            >
              <img
                src="/images/onlineTraining.png"
                alt="Online Training Background"
                className="absolute inset-0 w-full h-full object-cover filter grayscale"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center pb-4">
                <h2
                  className="text-white font-poppins font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-1"
                  style={{
                    fontSize: "clamp(1.25rem, 1.8vw, 2rem)",
                    lineHeight: "1.2",
                  }}
                >
                  Online Training
                </h2>
              </div>
            </motion.div>
          </section>
        </main>
      </div>
    </div>
  );
}
