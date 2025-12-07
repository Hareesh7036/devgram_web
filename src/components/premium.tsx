import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Premium = () => {
  const [isUserPremium, setIsUserPremium] = useState(false);

  useEffect(() => {
    verifyPremiumUser();
  }, []);

  const verifyPremiumUser = async () => {
    const res = await axios.get(BASE_URL + "/premium/verify", {
      withCredentials: true,
    });

    if (res.data.isPremium) {
      setIsUserPremium(true);
    }
  };

  const handleBuyClick = async (type: string) => {
    const order = await axios.post(
      BASE_URL + "/payment/create",
      {
        membershipType: type,
      },
      { withCredentials: true }
    );

    const { amount, keyId, currency, notes, orderId } = order.data;

    const options = {
      key: keyId,
      amount,
      currency,
      name: "Dev Gram",
      description: "Connect to other developers",
      order_id: orderId,
      prefill: {
        name: notes.firstName + " " + notes.lastName,
        email: notes.emailId,
        contact: "9999999999",
      },
      theme: {
        color: "#F37254",
      },
      handler: verifyPremiumUser,
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return isUserPremium ? (
    <div className="m-10">
      <div className="card bg-gradient-to-r from-primary to-secondary shadow-2xl border-0 max-w-2xl mx-auto">
        <div className="card-body items-center text-center p-12">
          <div className="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2 flex items-center justify-center bg-base-100 p-2">
            <svg
              className="w-16 h-16 text-success flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6.5a.75.75 0 011.06-1.06l5.353 5.817 8.614-12.916a.75.75 0 011.04-.208z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h1 className="card-title text-4xl font-bold text-white mb-4">
            Premium Member
          </h1>
          <p className="text-xl text-primary-content mb-8 max-w-md">
            You're already enjoying premium benefits!
            <br />
            <span className="font-semibold">
              Blue tick ✓ | Unlimited connections ✓ | Priority support ✓
            </span>
          </p>
          <div className="stats shadow bg-base-100/20 backdrop-blur-xl text-primary-content">
            <div className="stat">
              <div className="stat-title text-lg">Status</div>
              <div className="stat-value text-2xl">Active</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="m-10">
      <div className="hero min-h-[400px] bg-base-200 rounded-2xl mb-8">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Go Premium
            </h1>
            <p className="text-xl mb-8 text-base-content/70">
              Unlock unlimited connections and premium features
            </p>
          </div>
        </div>
      </div>

      <div className="flex w-full gap-8">
        <div className="card bg-gradient-to-br from-silver to-gray-400 shadow-2xl border-0 flex-grow transform hover:scale-[1.02] transition-all duration-300">
          <div className="card-body items-center text-center p-8">
            <div className="badge badge-lg badge-secondary mb-4 px-6 py-3">
              SILVER
            </div>
            <h1 className="text-4xl font-bold text-base-content mb-6">₹300</h1>
            <ul className="text-left mb-8 space-y-3 text-base-content/80 w-full">
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Chat with other people
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                100 connection requests/day
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Blue tick verification
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-base-content">
                  3 months
                </span>{" "}
                access
              </li>
            </ul>
            <button
              onClick={() => handleBuyClick("silver")}
              className="btn btn-secondary btn-wide shadow-xl hover:shadow-2xl transition-all duration-300 text-lg"
            >
              Buy Silver
            </button>
          </div>
        </div>

        <div className="divider divider-horizontal">OR</div>

        <div className="card bg-gradient-to-br from-yellow-500 to-orange-500 shadow-2xl border-0 flex-grow transform hover:scale-[1.02] transition-all duration-300">
          <div className="card-body items-center text-center p-8">
            <div className="badge badge-lg badge-warning mb-4 px-6 py-3">
              GOLD
            </div>
            <h1 className="text-4xl font-bold text-white mb-6">₹700</h1>
            <ul className="text-left mb-8 space-y-3 text-white/90 w-full">
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Chat with other people
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-white">Infinite</span>{" "}
                connection requests
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Blue tick verification
              </li>
              <li className="flex items-center gap-3">
                <svg
                  className="w-5 h-5 text-success"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="font-semibold text-white">6 months</span>{" "}
                access
              </li>
            </ul>
            <button
              onClick={() => handleBuyClick("gold")}
              className="btn btn-warning btn-wide shadow-xl hover:shadow-2xl transition-all duration-300 text-lg font-bold"
            >
              Buy Gold
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Premium;
