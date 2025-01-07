import './premium.css'
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Premium() {
  let [paymentId, setPaymentId] = useState(null);
  let [paymentDate, setPaymentDate] = useState(null);
  let [paymentAmount, setPaymentAmount] = useState(null);
  let [res, setRes] = useState(false);
  let [pre, setPre] = useState(false);
  let navigate = useNavigate();
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const res = await loadRazorpayScript();

    if (!res) {
      alert("Failed to load Razorpay script. Check your internet connection.");
      return;
    }

    // Fetch order ID from the server
    const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/order", {
      method: "POST",
    });
    const orderData = await response.json();
    console.log(orderData);
    if (!orderData || !orderData.id) {
      alert("Failed to create order. Please try again.");
      return;
    }

    const options = {
      key: "rzp_test_0zj2Qh539VIZwI", // Replace with environment variable
      amount: orderData.amount, // Amount in smallest currency unit
      currency: "INR",
      name: "AveFlix",
      description: "Premium Subscription",
      image: "", // Replace with your logo URL
      order_id: orderData.id, // Order ID from the backend
      handler: function (response) {
        setPaymentId(response.razorpay_payment_id);
        setPaymentDate(new Date().toISOString());
        setPaymentAmount(orderData.amount);
      },
      prefill: {
        name: "Your User's Name",
        email: "user@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Your Company Address",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.on("payment.failed", function (response) {
      alert(`Payment failed: ${response.error.description}`);
    });

    try {
      rzp.open();
    } catch (error) {
      console.error("Error opening Razorpay checkout:", error);
    }
  };
  useEffect(() => {
    async function premiumUpdate() {
      let form = {
        paymentId: paymentId,
        paymentDate: paymentDate,
        paymentAmount: paymentAmount,
      };
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL +"/premiumUpdate", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(form),
          credentials: "include",
        });
        if (!response.ok) {
          const error = await response.json();
          return error;
        }

        const data = await response.json();
        if (data.result) {
          setRes(true);
        }
        console.log("Response from server:", data);
      } catch (error) {
        console.log("Error while updating premium");
      }
    }
    premiumUpdate();
  }, [paymentId, paymentDate, paymentAmount]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/fetchPremium", {
          method: "POST",
          credentials: "include",
        });
        if (!response.ok) {
          const error = await response.json();
          return error;
        }

        const data = await response.json();
        if (data.result) {
          setPre(true);
        }
        console.log("Response from server:", data);
      } catch (error) {
        console.log("Error while updating premium");
      }
    })();
  }, []);
  return (
    <>
      {pre ? null :
        <>
        <div className="premiumBox">
        <h1>Premium Member</h1>
        <span>Rs 10 per month {`(Non-refundable)`}</span>
        <button onClick={handlePayment}>Pay Now</button>
        </div>
          {res?navigate("/"):null}
        </>
      }
    </>
  );
}
