import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { useParams } from "react-router-dom";
import logo from "../../public/images/LOGO.png";
import html2pdf from "html2pdf.js";
import UseTitle from "../components/UseTitle";

const Invoice = () => {
  const [invoiceData, setInvoiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const orderId = id;
  const backendUrl =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  UseTitle(`Invoice | ${orderId?.slice(0, 10).toUpperCase()}`);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const urlUid = queryParams.get("uid");

    if (urlUid && !localStorage.getItem("uid")) {
      localStorage.setItem("uid", urlUid);
    }

    const fetchOrderData = async () => {
      try {
        setLoading(true);
        const uid = localStorage.getItem("uid");

        if (!uid) {
          setTimeout(fetchOrderData, 300);
          return;
        }

        const response = await fetch(
          `${backendUrl}/api/order/get-order/${uid}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch order data");
        }

        const data = await response.json();

        if (data && data.OrdersFound) {
          const specificOrder = data.OrdersFound.find(
            (order) => order._id === orderId
          );

          if (specificOrder) {
            setInvoiceData(specificOrder);
          } else {
            setError("Order not found");
          }
        } else {
          setError("No orders found");
        }
      } catch (err) {
        setError("Failed to fetch order data");
        console.error("Error fetching order data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    }
  }, [orderId, backendUrl]);

  async function handleOnclick() {
    const element = document.querySelector("#invoice");

    const options = {
      margin: [5, 5, 5, 5],
      filename: `invoice_${invoiceNumber}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["avoid-all", "css", "legacy"],
        before: ".page-break-before",
        after: ".page-break-after",
        avoid: [".avoid-break", "tr", "td", "th"],
      },
    };

    html2pdf().set(options).from(element).save();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-gray-900 text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No invoice data available</p>
        </div>
      </div>
    );
  }

  // Calculate item amounts and totals
  const itemsWithTotal = invoiceData.items.map((item) => ({
    ...item,
    totalPrice: item.price * item.quantity * (item.weight || 1),
  }));

  const subtotal = itemsWithTotal.reduce(
    (sum, item) => sum + item.totalPrice,
    0
  );

  const shipping = invoiceData.totalAmount - subtotal;
  const total = invoiceData.totalAmount;

  const invoiceNumber = `INV-${invoiceData._id.slice(-8).toUpperCase()}`;
  const invoiceDate = new Date(invoiceData.placedAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <>
      <style jsx>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
            font-family: Arial, sans-serif;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 5mm !important;
            box-shadow: none !important;
          }
          .avoid-break {
            page-break-inside: avoid !important;
          }
          tr {
            page-break-inside: avoid;
            page-break-after: auto;
          }
          table {
            page-break-inside: auto;
          }
          .page-break-before {
            page-break-before: always;
          }
          .page-break-after {
            page-break-after: always;
          }
        }
        @media screen {
          .print-container {
            background: white;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }
        }

        .table-container {
          overflow: hidden;
          break-inside: avoid;
        }

        .invoice-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          table-layout: fixed;
        }
        .invoice-table th {
          background-color: #f8f9fa;
          padding: 12px 8px;
          text-align: left;
          border-bottom: 2px solid #111827;
          font-weight: 700;
        }
        .invoice-table td {
          padding: 10px 8px;
          border-bottom: 1px solid #e5e7eb;
          word-wrap: break-word;
        }
        .invoice-table tr:last-child td {
          border-bottom: none;
        }
        .total-section {
          border-top: 2px solid #111827;
          margin-top: 15px;
          padding-top: 12px;
        }
        .invoice-container {
          min-height: 297mm;
          position: relative;
        }
        .header-border {
          border-bottom: 3px solid #111827;
          padding-bottom: 1rem;
          margin-bottom: 2rem;
        }
        .section-divider {
          border-bottom: 1px solid #e5e7eb;
          margin: 1.5rem 0;
        }

        /* FIXED COLUMN WIDTHS */
        .description-column {
          width: 40%;
        }
        .quantity-column {
          width: 10%;
          text-align: center;
        }
        .weight-column {
          width: 15%;
          text-align: center;
        }
        .price-column {
          width: 17.5%;
          text-align: right;
        }
        .amount-column {
          width: 17.5%;
          text-align: right;
        }

        .page-break {
          page-break-before: always;
          margin-top: 20px;
        }
      `}</style>

      <div
        id="invoice"
        className="min-h-screen bg-gray-50 py-8 px-4 print:bg-white print:py-0 print:px-0"
      >
        <div className="max-w-4xl mx-auto print-container">
          <div className="p-8 print:p-0 avoid-break invoice-container">
            <div className="header-border avoid-break">
              <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-center md:text-left">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-wide">
                    INVOICE
                  </h1>
                  <div className="space-y-2 text-gray-700">
                    <p className="text-base md:text-lg font-semibold">
                      Invoice:{" "}
                      <span className="font-bold text-gray-900">
                        {invoiceNumber}
                      </span>
                    </p>
                    <p className="text-sm md:text-base">Date: {invoiceDate}</p>
                  </div>
                </div>

                <div className="text-center md:text-right">
                  <div className="mb-3 flex justify-center md:justify-end">
                    <img src={logo} alt="Company Logo" className="w-12" />
                  </div>
                  <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2">
                    Sri Venkateswara Agros And Herbs
                  </h2>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>3-1/A, Veerabhadravaram Village</p>
                    <p>Venkatapuram Mandal</p>
                    <p>Mulugu District, Telangana, India</p>
                    <p>PIN: 507136</p>
                    <p className="font-semibold text-gray-800 mt-2">
                      GSTIN: 36AEOFS5894Q1ZO
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 avoid-break">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-900 pb-2">
                  BILL TO
                </h3>
                <div className="text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900 text-base md:text-lg">
                    {invoiceData.userName}
                  </p>
                  <p className="text-xs md:text-sm">{invoiceData.userEmail}</p>
                  <p className="text-xs md:text-sm font-medium">
                    {invoiceData.phoneNumber}
                  </p>
                  <p className="text-xs md:text-sm leading-relaxed mt-2">
                    {invoiceData.shippingAddress}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3 border-b-2 border-gray-900 pb-2">
                  PAYMENT STATUS
                </h3>
                <div className="text-gray-700">
                  <p className="text-base">
                    Status:{" "}
                    <span className={`font-bold text-sm`}>
                      {invoiceData.paymentStatus.toUpperCase()}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-8 avoid-break table-container">
              <table className="invoice-table">
                <thead>
                  <tr className="avoid-break">
                    <th className="text-left text-xs md:text-sm description-column">
                      DESCRIPTION
                    </th>
                    <th className="text-center text-xs md:text-sm quantity-column">
                      QTY
                    </th>
                    <th className="text-center text-xs md:text-sm weight-column">
                      WEIGHT (kg)
                    </th>
                    <th className="text-right text-xs md:text-sm price-column">
                      UNIT PRICE
                    </th>
                    <th className="text-right text-xs md:text-sm amount-column">
                      AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {itemsWithTotal.length > 0 ? (
                    itemsWithTotal.map((item, index) => (
                      <React.Fragment key={item._id || index}>
                        {index > 0 && index % 8 === 0 && (
                          <tr className="page-break"></tr>
                        )}

                        <tr className="avoid-break">
                          <td className="text-gray-700 text-xs md:text-sm description-column">
                            <div className="font-semibold text-gray-900">
                              {item.title}
                            </div>
                          </td>
                          <td className="text-center text-gray-700 font-medium text-xs md:text-sm quantity-column">
                            {item.quantity}
                          </td>
                          <td className="text-center text-gray-700 font-medium text-xs md:text-sm weight-column">
                            {item.weight || 1}
                          </td>
                          <td className="text-right text-gray-700 text-xs md:text-sm price-column">
                            ₹{item.price.toFixed(2)}
                          </td>
                          <td className="text-right font-bold text-gray-900 text-xs md:text-sm amount-column">
                            ₹{item.totalPrice.toFixed(2)}
                          </td>
                        </tr>
                      </React.Fragment>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 px-4 text-center text-gray-500"
                      >
                        No items found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end mb-8 avoid-break">
              <div className="w-full md:w-80">
                <div className="space-y-2 total-section">
                  <div className="flex justify-between py-2 text-gray-700 text-sm md:text-base">
                    <span className="font-medium">Subtotal:</span>
                    <span className="font-semibold">
                      ₹{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 text-gray-700 text-sm md:text-base">
                    <span className="font-medium">Shipping:</span>
                    <span className="font-semibold">
                      ₹{shipping.toFixed(2)}
                    </span>
                  </div>
                  <div className="border-t-2 border-gray-900 pt-3 mt-3">
                    <div className="flex justify-between py-2 text-lg md:text-xl font-bold text-gray-900">
                      <span>TOTAL:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-divider"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs md:text-sm avoid-break">
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                  SECURE PAYMENTS
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  All transactions are protected by PayPal. Your financial
                  information is never shared with sellers.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                  NOTES
                </h4>
                <p className="text-gray-700 leading-relaxed">
                  Thank you for your business! For questions about this invoice,
                  please contact us at contact@company.com
                </p>
              </div>
            </div>

            <div
              data-html2canvas-ignore
              className="flex justify-center mt-8 no-print"
            >
              <button
                onClick={handleOnclick}
                className="flex items-center gap-3 bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 md:px-8 md:py-3 rounded-lg font-semibold transition-colors shadow-lg text-sm md:text-base"
              >
                <Download size={18} className="hidden md:block" />
                <span>Download Invoice</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Invoice;
