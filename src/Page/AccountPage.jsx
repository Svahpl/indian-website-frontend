import React from "react";
import {
  ChevronRight,
  Package,
  RotateCcw,
  Shield,
  Smartphone,
  Headphones,
  Wallet,
  Mail,
  MessageSquare,
  Bell,
  Gift,
  List,
  Settings,
  Star,
  Users,
  Download,
  User,
  ShoppingCart,
  Heart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UseTitle } from "../components/compIndex";
import Header from "../components/Header";
import Footer from "../components/Footer";

const AccountPage = () => {
  UseTitle("Your Account");
  const navigate = useNavigate();

  const AccountSection = ({ title, items, className = "" }) => (
    <div
      className={`bg-white rounded-2xl border border-gray-200 p-4 md:p-6 ${className}`}
    >
      <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
        {title}
      </h2>
      <div className="space-y-0 divide-y divide-gray-100">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between py-3 md:py-4 hover:bg-gray-50 cursor-pointer group"
            onClick={() => item.link && navigate(item.link)}
          >
            <div className="flex items-center space-x-3 md:space-x-4">
              <div className="font-green group-hover:font-green">
                {item.icon}
              </div>
              <div>
                <h3 className="font-medium text-gray-900 text-sm md:text-base">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs md:text-sm text-gray-600 mt-1">
                    {item.description}
                  </p>
                )}
              </div>
            </div>
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-hover:text-gray-600" />
          </div>
        ))}
      </div>
    </div>
  );

  const quickAccessItems = [
    {
      icon: <Package className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Your Orders",
      description: "Track, return, or buy things again",
      link: "/my-account/orders",
    },
    {
      icon: <ShoppingCart />,
      title: "Your Cart",
      description: "Your cart. Review and edit selections.",
      link: "/my-account/cart",
    },
    {
      icon: <Settings className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Your Addresses",
      description: "Edit addresses for orders and gifts",
      link: "/my-account/addresses",
    },
    {
      icon: <Headphones className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Contact Us",
      description: "Contact our customer service via phone or chat",
      link: "/contact",
    },
    {
      icon: <Heart className="w-6 h-6 md:w-8 md:h-8" />,
      title: "Your Wishlist",
      description: "Save items. Keep track of what you love.",
      link: "/my-account/wishlist",
    },
  ];

  const digitalContentItems = [
    {
      icon: <Smartphone className="w-5 h-5" />,
      title: "Apps and more",
      link: "/apps",
    },
    {
      icon: <Download className="w-5 h-5" />,
      title: "Content Library",
      link: "/library",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Devices",
      link: "/devices",
    },
    {
      icon: <Gift className="w-5 h-5" />,
      title: "Digital gifts you've received",
      link: "/digital-gifts",
    },
  ];

  const emailAlertsItems = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Advertising preferences",
      link: "/ads-preferences",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Communication preferences",
      link: "/communication-preferences",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "SMS alert preferences",
      link: "/sms-preferences",
    },
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Message Centre",
      link: "/message-centre",
    },
    {
      icon: <Bell className="w-5 h-5" />,
      title: "Alexa shopping notifications",
      link: "/alexa-notifications",
    },
  ];

  const moreWaysToPayItems = [
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Default Purchase Settings",
      link: "/purchase-settings",
    },
    {
      icon: <Wallet className="w-5 h-5" />,
      title: "Amazon Pay",
      link: "/amazon-pay",
    },
    { icon: <Star className="w-5 h-5" />, title: "Coupons", link: "/coupons" },
  ];

  const orderingShoppingItems = [
    {
      icon: <MessageSquare className="w-5 h-5" />,
      title: "Leave packaging feedback",
      link: "/packaging-feedback",
    },
    { icon: <List className="w-5 h-5" />, title: "Lists", link: "/lists" },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Manage saved IDs",
      link: "/saved-ids",
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "Your Shopping preferences",
      link: "/shopping-preferences",
    },
    {
      icon: <User className="w-5 h-5" />,
      title: "Your Content",
      link: "/your-content",
    },
    {
      icon: <Settings className="w-5 h-5" />,
      title: "Language settings",
      link: "/language-settings",
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Recalls and Product Safety Alerts",
      link: "/safety-alerts",
    },
  ];

  const shoppingProgramsItems = [
    {
      icon: <Users className="w-5 h-5" />,
      title: "Manage Your Amazon Family",
      link: "/amazon-family",
    },
    {
      icon: <RotateCcw className="w-5 h-5" />,
      title: "Subscribe & Save",
      link: "/subscribe-save",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Shop the Kids' Store by age",
      link: "/kids-store",
    },
  ];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 md:mb-8">
            Your Account
          </h1>

          {/* Quick Access Grid - Mobile */}
          <div className="md:hidden space-y-4 mb-8">
            <AccountSection
              title="Orders"
              items={quickAccessItems.slice(0, 3)}
            />
            <AccountSection
              title="Account Settings"
              items={quickAccessItems.slice(3)}
            />
          </div>

          {/* Desktop Quick Access Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 mb-8">
            {quickAccessItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => item.link && navigate(item.link)}
              >
                <div className="flex items-start space-x-4">
                  <div className="font-green">{item.icon}</div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AccountPage;
