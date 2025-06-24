import React from "react";
import { Truck, Package, Clock, Globe, Shield, RefreshCw } from "lucide-react";
import UseTitle from "./UseTitle";
import Header from "./Header";
import Footer from "./Footer";

const ShippingPolicy = () => {
  UseTitle("Shipping Policy");
  return (
    <>
      <Header />
      <div className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-heading font-bold text-primary-800 mb-8 text-center">
              Shipping Policy
            </h1>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-8">
              <section>
                <div className="flex items-center mb-4">
                  <Globe className="text-primary-600 w-6 h-6 mr-3" />
                  <h2 className="text-xl font-heading font-semibold text-primary-800">
                    Shipping Coverage
                  </h2>
                </div>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  We ship our products worldwide, partnering with reliable
                  courier services to ensure safe delivery. All shipments are
                  tracked and insured for your peace of mind.
                </p>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <Clock className="text-primary-600 w-6 h-6 mr-3" />
                  <h2 className="text-xl font-heading font-semibold text-primary-800">
                    Processing Time
                  </h2>
                </div>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>Orders are processed within 1-2 business days</li>
                  <li>
                    Custom or bulk orders may require additional processing time
                  </li>
                  <li>
                    You will receive a confirmation email with tracking details
                    once your order ships
                  </li>
                </ul>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <Truck className="text-primary-600 w-6 h-6 mr-3" />
                  <h2 className="text-xl font-heading font-semibold text-primary-800">
                    Delivery Timeframes
                  </h2>
                </div>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>Domestic (India): 3-7 business days</li>
                  <li>International: 7-21 business days</li>
                  <li>Express shipping options available upon request</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <Package className="text-primary-600 w-6 h-6 mr-3" />
                  <h2 className="text-xl font-heading font-semibold text-primary-800">
                    Packaging
                  </h2>
                </div>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  All products are carefully packaged to ensure they arrive in
                  perfect condition. We use eco-friendly packaging materials
                  whenever possible while maintaining product safety and
                  quality.
                </p>
              </section>
              <section>
                <div className="flex items-center mb-4">
                  <RefreshCw className="text-primary-600 w-6 h-6 mr-3" />
                  <h2 className="text-xl font-heading font-semibold text-primary-800">
                    Returns & Refunds
                  </h2>
                </div>
                <p className="text-neutral-700 leading-relaxed">
                  Please refer to our Returns Policy for detailed information
                  about our return and refund process. We strive to ensure
                  customer satisfaction with every order.
                </p>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShippingPolicy;
