import { useEffect, useState } from "react";
import { useSearchContext } from "../components/context/search";
import WriteButton from "../components/WriteButton";
import chatStationABI from "../abi/chatStationABI.json";
import { contractAddress } from "../config";
import { useContract, useNetwork, useProvider } from "wagmi";
import { ethers } from "ethers";
const Index = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const [search, setSearch] = useSearchContext();
  const [data, setData] = useState({});
  const { chain } = useNetwork();
  const chatStation = contractAddress[chain?.id]?.chatStation;
  const isAddress = ethers.utils.isAddress(search);
  const send = {
    data: {
      address: chatStation,
      abi: chatStationABI,
      functionName: "send",
      args: [search, data?.["send"]],
    },
    buttonName: (
      <svg
        t="1679833017881"
        class="icon"
        viewBox="0 0 1024 1024"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        p-id="2780"
        width="32"
        height="32"
      >
        <path
          d="M128.37 832L896 512 128.37 192 128 440.89 676.57 512 128 583.11z"
          fill="#1296db"
          p-id="2781"
        ></path>
      </svg>
    ),
    callback: (confirmed) => {
      if (confirmed) {
        data["send"] = "";
        showLog(search);
      }
    },
  };

  const provider = useProvider();

  const showLog = async (search) => {
    if (isAddress) {
      const contract = new ethers.Contract(
        chatStation,
        chatStationABI,
        provider
      );
      const filter = contract.filters.Send(search);
      const logs = await contract.queryFilter(filter);
      data["logs"] = logs;
      setData({ ...data });
    }
  };

  useEffect(() => {
    if (isAddress) {
      showLog(search);
    }
  }, [search]);

  return (
    mounted &&
    isAddress && (
      <>
        <div className="m-auto w-72 md:w-1/2 my-10 bg-white card shadow-xl">
          <div className="card-body">
            <h1> {isAddress && "Chatroom : " + search}</h1>
            <div className="divider"></div>
            {data["logs"]?.map((item, index) => {
              return (
                <div className="chat chat-start" key={index}>
                  <div className="chat-image avatar">
                    <div className="w-10 rounded-full">
                      <img src="/vercel.svg" />
                    </div>
                  </div>
                  <div className="chat-bubble">{item["args"]["_content"]}</div>
                </div>
              );
            })}

            <div className="divider"></div>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Type here"
                className="input w-full"
                value={data["send"]}
                onChange={(e) => {
                  data["send"] = e.target.value;
                  setData({ ...data });
                }}
              />
              <WriteButton {...send} className="btn-ghost" />
            </div>
          </div>
        </div>
      </>
    )
  );
};

export default Index;
