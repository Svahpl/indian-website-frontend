import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import { motion, AnimatePresence } from 'framer-motion';
import {slideshowData} from "../data/slideshowData.js"

const Slideshow = () => {
  const formatDescription = (text) =>
    text.split('\n').map((line, index) => {
      const trimmed = line.trim();
      if (trimmed === '') return <br key={index} />;
      const isHeading = trimmed === trimmed.toUpperCase() || trimmed.endsWith(':');
      return (
        <p
          key={index}
          className={`mb-2 transition-all duration-300 ${
            isHeading
              ? 'font-semibold text-gray-900 text-xs sm:text-sm md:text-lg tracking-tight'
              : 'text-gray-800 text-xs sm:text-sm md:text-base leading-relaxed'
          }`}
        >
          {trimmed}
        </p>
      );
    });

  return (
    <section className="w-full px-2 sm:px-4 md:px-8 py-8 bg-gradient-to-b from-gray-50 to-white overflow-visible">
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showThumbs={false}
        interval={7000}
        transitionTime={800}
        showArrows={true}
        emulateTouch={true}
        swipeable={true}
        preventMovementUntilSwipeScrollTolerance={true}
        swipeScrollTolerance={50}
        renderArrowPrev={(onClickHandler, hasPrev, label) =>
          hasPrev && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute z-20 left-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 transition"
            >
              ‹
            </button>
          )
        }
        renderArrowNext={(onClickHandler, hasNext, label) =>
          hasNext && (
            <button
              type="button"
              onClick={onClickHandler}
              title={label}
              className="absolute z-20 right-2 top-1/2 transform -translate-y-1/2 bg-white text-gray-800 p-2 rounded-full shadow-md hover:bg-gray-100 transition"
            >
              ›
            </button>
          )
        }
      >
        {slideshowData.map((slide, index) => (
          <AnimatePresence key={slide.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col ${
                index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
              } items-center justify-between gap-4 sm:gap-6 md:gap-8 bg-white rounded-xl sm:rounded-2xl shadow-md sm:shadow-xl p-4 sm:p-6 md:p-8 max-w-7xl mx-auto`}
            >
              {/* Image */}
              <motion.div
                className="w-full md:w-1/2 relative overflow-hidden rounded-lg sm:rounded-xl shadow-md sm:shadow-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="object-contain w-full h-auto max-h-[20rem] sm:max-h-[24rem] md:max-h-[32rem] transition-transform duration-700 hover:scale-110"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </motion.div>

              {/* Text */}
              <div className="w-full md:w-1/2 flex flex-col justify-center p-4 sm:p-6">
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-lg sm:text-xl md:text-3xl font-bold sm:font-extrabold text-gray-900 mb-3 sm:mb-5 tracking-tight"
                >
                  {slide.title}
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed max-h-[200px] sm:max-h-[300px] md:max-h-[400px] overflow-y-auto pr-2"
                >
                  {formatDescription(slide.description)}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        ))}
      </Carousel>
    </section>
  );
};

export default Slideshow;
