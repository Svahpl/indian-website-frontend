import React, { useEffect } from "react";
import {
  Phone,
  Mail,
  Youtube,
  Instagram,
  MapPin,
  Clock,
  Truck,
  Shield,
} from "lucide-react";
import RequirementForm from "./RequirementForm";
import SalesForm from "./SalesForm";
import UseTitle from "./UseTitle";
import Header from "./Header";
import Footer from "./Footer";

const Contact = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  UseTitle("SVAH | Contact Us");
  return (
    <>
      <Header />
      <section id="contact" className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-primary-800 mb-12 text-center">
            Contact Us
          </h2>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-heading font-semibold text-primary-800 mb-4">
                  Contact Information
                </h3>

                <div className="space-y-3">
                  <div>
                    <p className="text-neutral-700 font-semibold">
                      Official Email:
                    </p>
                    <div className="flex items-center">
                      <Mail className="text-primary-600 mr-3" size={20} />
                      <a
                        href="mailto:srivenkateswaraagrosandherbs@gmail.com"
                        className="text-primary-700 hover:text-primary-900 transition-colors"
                      >
                        srivenkateswaraagrosandherbs@gmail.com
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="text-neutral-700 font-semibold">
                      For Requirements:
                    </p>
                    <div className="flex items-center">
                      <Mail className="text-primary-600 mr-3" size={20} />
                      <a
                        href="mailto:Svahpl1@gmail.com"
                        className="text-primary-700 hover:text-primary-900 transition-colors"
                      >
                        Svahpl1@gmail.com
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="text-neutral-700 font-semibold">For Sales:</p>
                    <div className="flex items-center">
                      <Mail className="text-primary-600 mr-3" size={20} />
                      <a
                        href="mailto:svaherbs@gmail.com"
                        className="text-primary-700 hover:text-primary-900 transition-colors"
                      >
                        svaherbs@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
                <Clock className="text-primary-600 w-8 h-8 mb-4" />
                <h3 className="text-xl font-heading font-semibold text-primary-800 mb-2">
                  Quick Response
                </h3>
                <p className="text-neutral-700">
                  We aim to respond to all inquiries within 24 hours during
                  business days.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
                <Truck className="text-primary-600 w-8 h-8 mb-4" />
                <h3 className="text-xl font-heading font-semibold text-primary-800 mb-2">
                  Global Shipping
                </h3>
                <p className="text-neutral-700">
                  We ship worldwide with reliable tracking and insurance
                  coverage.
                </p>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 transform hover:scale-105 transition-transform">
                <Shield className="text-primary-600 w-8 h-8 mb-4" />
                <h3 className="text-xl font-heading font-semibold text-primary-800 mb-2">
                  Secure Transactions
                </h3>
                <p className="text-neutral-700">
                  Your data is protected with industry-standard encryption and
                  security measures.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contact;
