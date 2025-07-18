import React from "react";
import { Clock, Truck, Shield } from "lucide-react";

import { certificates } from "../data/certificates";
import { Mail } from "lucide-react";
import { MapPin } from "lucide-react";
const Certificates = () => {
  return (
    <section className="py-16 bg-neutral-100 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-heading font-bold text-primary-800 dark:text-primary-200 mb-12 text-center">
          Our Certifications
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
          {certificates.map((certificate) => (
            <div
              key={certificate.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-800/50 overflow-hidden hover:shadow-lg dark:hover:shadow-gray-700/50 transition-all"
            >
              <div className="aspect-[4/3] w-full overflow-hidden">
                <img
                  src={certificate.image}
                  alt={certificate.name}
                  className="w-full h-full object-contain p-4"
                />
              </div>
              <div className="p-4 border-t border-neutral-100 dark:border-gray-700">
                <h3 className="text-primary-700 dark:text-primary-300 font-medium text-center">
                  {certificate.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-800/50 p-6 transform hover:scale-105 transition-transform">
            <Clock className="text-primary-600 dark:text-primary-400 w-8 h-8 mb-4" />
            <h3 className="text-xl font-heading font-semibold text-primary-800 dark:text-primary-200 mb-2">
              Quick Response
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              We aim to respond to all inquiries within 24 hours during business
              days.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-800/50 p-6 transform hover:scale-105 transition-transform">
            <Truck className="text-primary-600 dark:text-primary-400 w-8 h-8 mb-4" />
            <h3 className="text-xl font-heading font-semibold text-primary-800 dark:text-primary-200 mb-2">
              Global Shipping
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              We ship worldwide with reliable tracking and insurance coverage.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-800/50 p-6 transform hover:scale-105 transition-transform">
            <Shield className="text-primary-600 dark:text-primary-400 w-8 h-8 mb-4" />
            <h3 className="text-xl font-heading font-semibold text-primary-800 dark:text-primary-200 mb-2">
              Secure Transactions
            </h3>
            <p className="text-neutral-700 dark:text-neutral-300">
              Your data is protected with industry-standard encryption and
              security measures.
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-heading font-semibold text-primary-800 dark:text-primary-200 mb-4">
            Address
          </h3>

          <div className="flex items-start mb-4">
            <MapPin
              className="text-primary-600 dark:text-primary-400 mt-1 mr-3 shrink-0"
              size={20}
            />
            <div>
              <p className="text-neutral-700 dark:text-neutral-300">
                3-1/A, Veerabhadravaram Village,
                <br />
                Venkatapuram Mandal,
                <br />
                Mulugu District, Telangana, India.
                <br />
                PIN: 507136
              </p>
            </div>
          </div>
        </div>
        {/* Contact Information Section */}
        <div>
          <h3 className="text-xl font-heading font-semibold text-primary-800 dark:text-primary-200 mb-4">
            Contact Information
          </h3>

          <div className="space-y-3">
            <div>
              <p className="text-neutral-700 dark:text-neutral-300 font-semibold">
                Official Email:
              </p>
              <div className="flex items-center">
                <Mail
                  className="text-primary-600 dark:text-primary-400 mr-3"
                  size={20}
                />
                <a
                  href="mailto:srivenkateswaraagrosandherbs@gmail.com"
                  className="text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-200 transition-colors"
                >
                  srivenkateswaraagrosandherbs@gmail.com
                </a>
              </div>
            </div>

            <div>
              <p className="text-neutral-700 dark:text-neutral-300 font-semibold">
                For Requirements:
              </p>
              <div className="flex items-center">
                <Mail
                  className="text-primary-600 dark:text-primary-400 mr-3"
                  size={20}
                />
                <a
                  href="mailto:Svahpl1@gmail.com"
                  className="text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-200 transition-colors"
                >
                  Svahpl1@gmail.com
                </a>
              </div>
            </div>

            <div>
              <p className="text-neutral-700 dark:text-neutral-300 font-semibold">
                For Sales:
              </p>
              <div className="flex items-center">
                <Mail
                  className="text-primary-600 dark:text-primary-400 mr-3"
                  size={20}
                />
                <a
                  href="mailto:svaherbs@gmail.com"
                  className="text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-200 transition-colors"
                >
                  svaherbs@gmail.com
                </a>
              </div>
            </div>

            <div>
              <p className="text-neutral-700 dark:text-neutral-300 font-semibold">
                Instagram:
              </p>
              <div className="flex items-center flex-wrap">
                <svg
                  className="text-primary-600 dark:text-primary-400 mr-3"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
                <a
                  href="https://www.instagram.com/svah.2021?utm_source=qr&igsh=MTZrbGswaXE4dXhqeA%3D%3D"
                  className="text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  svah.2021
                </a>
                <span className="text-neutral-500 dark:text-neutral-400 mx-2">
                  |
                </span>
                <a
                  href="https://www.instagram.com/svah_nurseries?utm_source=qr&igsh=N2Jpb3JwdmJmdmpk"
                  className="text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  svah_nurseries
                </a>
              </div>
            </div>

            <div>
              <p className="text-neutral-700 dark:text-neutral-300 font-semibold">
                YouTube:
              </p>
              <div className="flex items-center">
                <svg
                  className="text-primary-600 dark:text-primary-400 mr-3"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                  <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                </svg>
                <a
                  href="https://www.youtube.com/@svah-2021"
                  className="text-primary-700 dark:text-primary-300 hover:text-primary-900 dark:hover:text-primary-200 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @svah-2021
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
