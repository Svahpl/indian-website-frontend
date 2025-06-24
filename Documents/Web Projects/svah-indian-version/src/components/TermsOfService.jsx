import React from "react";
import { Scale, Shield, FileText, AlertCircle } from "lucide-react";
import Header from "./Header";
import Footer from "./Footer";

const TermsOfService = () => {
  return (
    <>
      <Header />
      <div className="py-16 bg-neutral-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-heading font-bold text-primary-800 mb-8 text-center">
              Terms of Service
            </h1>

            <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-8">
              <section>
                <div className="flex items-center mb-4">
                  <Scale className="text-primary-600 w-6 h-6 mr-3" />
                  <h2 className="text-xl font-heading font-semibold text-primary-800">
                    Agreement to Terms
                  </h2>
                </div>
                <p className="text-neutral-700 leading-relaxed">
                  By accessing or using our website, you agree to be bound by
                  these Terms of Service. If you disagree with any part of these
                  terms, you may not access our services.
                </p>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <Shield className="text-primary-600 w-6 h-6 mr-3" />
                  <h2 className="text-xl font-heading font-semibold text-primary-800">
                    Intellectual Property
                  </h2>
                </div>
                <p className="text-neutral-700 leading-relaxed">
                  All content on this website, including text, graphics, logos,
                  and images, is the property of Sri Venkateswara Agros and
                  Herbs and is protected by applicable copyright and trademark
                  law.
                </p>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <FileText className="text-primary-600 w-6 h-6 mr-3" />
                  <h2 className="text-xl font-heading font-semibold text-primary-800">
                    User Accounts
                  </h2>
                </div>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>
                    You are responsible for maintaining the confidentiality of
                    your account
                  </li>
                  <li>You must provide accurate and complete information</li>
                  <li>You must notify us of any unauthorized access</li>
                </ul>
              </section>

              <section>
                <div className="flex items-center mb-4">
                  <AlertCircle className="text-primary-600 w-6 h-6 mr-3" />
                  <h2 className="text-xl font-heading font-semibold text-primary-800">
                    Limitation of Liability
                  </h2>
                </div>
                <p className="text-neutral-700 leading-relaxed">
                  We shall not be liable for any indirect, incidental, special,
                  consequential, or punitive damages resulting from your use of
                  our services.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-heading font-semibold text-primary-800 mb-4">
                  Product Information
                </h2>
                <ul className="list-disc list-inside text-neutral-700 space-y-2">
                  <li>We strive to provide accurate product information</li>
                  <li>
                    Prices and availability are subject to change without notice
                  </li>
                  <li>Product images are for illustration purposes only</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-heading font-semibold text-primary-800 mb-4">
                  Governing Law
                </h2>
                <p className="text-neutral-700 leading-relaxed">
                  These terms shall be governed by and construed in accordance
                  with the laws of India, without regard to its conflict of law
                  provisions.
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

export default TermsOfService;
