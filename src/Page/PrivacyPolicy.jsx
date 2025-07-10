import React from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";

const PrivacyPolicy = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#fdfcf9] text-[#2c2c2c]">
      <Header />
      
      <main className="flex-grow px-4 py-8 sm:px-8 lg:px-32">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 sm:p-12 border border-green-100 h-full">
          <h1 className="text-4xl font-bold text-green-700 mb-6 border-b-2 border-green-300 pb-2">Privacy Policy</h1>
          
          <p className="mb-6 text-lg leading-relaxed">
            Welcome to <strong>svahpl</strong> (Sri Venkateswara Agros & Herbs). This Privacy Policy outlines how we collect, use, and protect your information when you use our website.
          </p>

          <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-3">1. Information We Collect</h2>
          <ul className="list-disc list-inside space-y-2 text-base">
            <li>Personal information (name, email, phone) when you submit forms.</li>
            <li>Browsing data through cookies and analytics tools.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-3">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-base">
            <li>To respond to your queries and requests.</li>
            <li>To improve website experience and performance.</li>
            <li>To send updates or promotional information if you subscribe.</li>
          </ul>

          <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-3">3. Sharing Your Information</h2>
          <p className="text-base mb-4">
            We do not sell, trade, or share your personal information with third parties, except to comply with legal obligations or trusted services helping us operate our website.
          </p>

          <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-3">4. Cookies</h2>
          <p className="text-base mb-4">
            Our website uses cookies to improve user experience. You can control cookie preferences through your browser settings.
          </p>

          <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-3">5. Your Rights</h2>
          <p className="text-base mb-4">
            You have the right to access, modify, or delete your data. To do so, please contact us at the details provided below.
          </p>

          <h2 className="text-2xl font-semibold text-green-600 mt-8 mb-3">6. Contact Us</h2>
          <p className="text-base">
            If you have any questions or concerns about our Privacy Policy, please contact:
          </p>
          <p className="text-base mt-2 font-medium">
            Email: <a href="mailto:srivenkateswaraagrosandherbs@gmail.com" className="text-green-700 hover:underline">srivenkateswaraagrosandherbs@gmail.com</a><br />
          </p>

          <p className="mt-10 text-sm text-gray-600">
            3-1/A, Veerabhadravaram Village,
            Venkatapuram Mandal,
            Mulugu District, Telangana, India.
            PIN: 507136
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
