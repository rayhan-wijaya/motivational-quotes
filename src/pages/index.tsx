import { type NextPage } from "next";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { api } from "../utils/api";

const Home: NextPage = () => {
  const subscribeMutation = api.subscribe.subscribe.useMutation({
    onSuccess: () => toast.success('You successfully subscribed!', { delay: 100 }),
    onError: (error) => toast.error(error.message, { delay: 100 }),
  });

  const [email, setEmail] = useState<string>();

  const onSubscribe = () => {
    if (!email) {
      return;
    }

    subscribeMutation.mutate({ email });
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-3">
      <h1 className="font-bold text-2xl text-center">Motivate Me</h1>

      <p className="text-center">
        This is an email subscription service for sending motivational quotes
        everyday. Subscribe and get the motivation you need everyday!
      </p>

      <div className="flex gap-3">
        <input
          className="border rounded-md p-2"
          placeholder="Your email here"
          onChange={event => setEmail(event.target.value)}
        />

        <button
          className="bg-gray-600 text-white px-5 py-2 rounded-md"
          onClick={onSubscribe}
        >
          Subscribe
        </button>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Home;
