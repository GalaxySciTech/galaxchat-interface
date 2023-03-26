import Head from "next/head";
import Navbar from "../Navbar";
const Layout = ({ children }) => {
  return (
    <>
      <Head>
        <title>Galaxchat Interface</title>
        <meta name="description" content="Galaxchat Interface" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Navbar />
        {children}
      </main>
    </>
  );
};


export default Layout