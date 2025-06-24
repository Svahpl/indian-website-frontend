import React from 'react';
import { Lock, Eye, Database, MessageSquare } from 'lucide-react';

const PrivacyPolicy = () => {
  return (
    <div className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-heading font-bold text-primary-800 mb-8 text-center">Privacy Policy</h1>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 space-y-8">
            <section>
              <div className="flex items-center mb-4">
                <Eye className="text-primary-600 w-6 h-6 mr-3" />
                <h2 className="text-xl font-heading font-semibold text-primary-800">Information We Collect</h2>
              </div>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>Personal identification information (Name, email address, phone number, etc.)</li>
                <li>Shipping and billing information</li>
                <li>Transaction history and purchase preferences</li>
                <li>Technical data (IP address, browser type, device information)</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Database className="text-primary-600 w-6 h-6 mr-3" />
                <h2 className="text-xl font-heading font-semibold text-primary-800">How We Use Your Information</h2>
              </div>
              <ul className="list-disc list-inside text-neutral-700 space-y-2">
                <li>To process and fulfill your orders</li>
                <li>To communicate about your purchases and provide customer support</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To improve our products and services</li>
                <li>To protect against fraud and unauthorized transactions</li>
              </ul>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <Lock className="text-primary-600 w-6 h-6 mr-3" />
                <h2 className="text-xl font-heading font-semibold text-primary-800">Data Security</h2>
              </div>
              <p className="text-neutral-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <div className="flex items-center mb-4">
                <MessageSquare className="text-primary-600 w-6 h-6 mr-3" />
                <h2 className="text-xl font-heading font-semibold text-primary-800">Contact Us</h2>
              </div>
              <p className="text-neutral-700 leading-relaxed">
                If you have any questions about this Privacy Policy, please contact us at:
                <br />
                Email: <a href="mailto:srivenkateswaraagrosandherbs@gmail.com" className="text-primary-600 hover:text-primary-800">srivenkateswaraagrosandherbs@gmail.com</a>
                <br />
                
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;