import React from "react";
import { productCategories } from "../data/categories";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CategorySection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-primary-800 dark:text-primary-200 mb-12 text-center">
          Our Product Categories
        </h2>

        <div className="space-y-16">
          {productCategories.map((category) => (
            <div
              key={category.id}
              id={`category-${category.id}`}
              className="scroll-mt-24"
            >
              <h3 className="text-2xl font-heading font-semibold text-secondary-700 dark:text-secondary-300 mb-6 pb-2 border-b-2 border-secondary-300 dark:border-secondary-600">
                {category.name}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {category.subcategories.map((subcategory) => (
                  <div
                    onClick={() => navigate(`/view-products`)}
                    key={subcategory.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-800/50 overflow-hidden transition-transform hover:transform hover:scale-[1.02] group"
                  >
                    <div className="relative w-full aspect-square overflow-hidden">
                      <img
                        src={
                          subcategory.image ||
                          "https://images.pexels.com/photos/5946026/pexels-photo-5946026.jpeg"
                        }
                        alt={subcategory.name}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-4">
                      <h4 className="text-primary-800 dark:text-primary-200 font-medium text-lg mb-2">
                        {subcategory.name}
                      </h4>
                      <a
                        href="#"
                        className="inline-flex items-center text-sm text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200 transition-colors"
                      >
                        View Products{" "}
                        <ChevronRight size={16} className="ml-1" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
