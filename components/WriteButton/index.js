import { useAccount, useContractWrite, useWaitForTransaction } from "wagmi";
import { useEffect, useState } from "react";
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import lang from "../../lang/index";
const WriteButton = (props) => {
  const { locale, locales, defaultLocale, asPath } = useRouter();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { isConnected } = useAccount();

  const { data: tx, write } = useContractWrite({
    ...props?.data,
    onError(error) {
      Notify.failure(error.message);
    },
  });
  const { isSuccess: confirmed, isLoading: confirming } = useWaitForTransaction(
    {
      ...tx,
      onError(error) {
        Notify.failure(error.message);
      },
    }
  );

  useEffect(() => {
    props?.callback?.(confirmed);
  }, [confirmed]);

  return (
    mounted && (
      <>
        {!isConnected && <ConnectButton />}
        {isConnected && (
          <button
            className={
              (props?.disabled || !write || confirming ? "btn-disabled " : "") +
              (confirming
                ? "btn btn-hoverable loading btn-sm md:btn-md text-base md:text-lg " +
                  props.className
                : "btn btn-hoverable btn-sm md:btn-md text-base md:text-lg " +
                  props.className)
            }
            // disabled={props?.disabled || !write || confirming}
            style={{ minWidth: 112 }}
            onClick={() => write?.()}
          >
            {confirming ? lang[locale]?.confirming : props?.buttonName}
          </button>
        )}
      </>
    )
  );
};

export default WriteButton;
