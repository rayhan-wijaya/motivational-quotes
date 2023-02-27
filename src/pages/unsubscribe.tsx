import { type NextPage } from "next";
import { useState } from "react";
import { useRouter } from "next/router";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { api } from "../utils/api";

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const Home: NextPage = () => {
  const unsubscribeMutation = api.subscribe.unsubscribe.useMutation({
    onSuccess: async () => {
        toast.success('You successfully unsubscribed!', { delay: 100 })

        await sleep(2 * 1000);
        await router.replace('/');
    },
    onError: async (error) => {
        toast.error(error.message, { delay: 100 });

        await sleep(2 * 1000);
        await router.replace('/');
    },
  });

  const [areButtonsDisabled, setAreButtonsDisabled] = useState(false);

  const router = useRouter();

  const email = router.query.email as string | undefined;
  const token = router.query.token as string | undefined;

  const onUnsubscribe = () => {
    setAreButtonsDisabled(true);

    if (!email || !token) {
      return;
    }

    unsubscribeMutation.mutate({
        email,
        token,
    });
  }

  const goBack = () => {
    void router.replace('/');
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-3">
        <h1 className="font-bold text-2xl text-center">Are you sure you want to unsubscribe?</h1>

        <div className="flex gap-3">
            <button
                className={`bg-gray-600 text-white px-5 py-2 rounded-md ${areButtonsDisabled ? "bg-gray-300" : ""}`}
                disabled={areButtonsDisabled}
                onClick={onUnsubscribe}
            >
                Yes
            </button>

            <button
                className={`bg-gray-600 text-white px-5 py-2 rounded-md ${areButtonsDisabled ? "bg-gray-300" : ""}`}
                disabled={areButtonsDisabled}
                onClick={goBack}
            >
                No
            </button>
        </div>

      <ToastContainer />
    </div>
  );
};

export default Home;
