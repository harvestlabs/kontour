import React from "react";
import Nav from "@layouts/Nav";
import Footer from "@components/Footer";

type Props = {};
export default function Layout({ children }: React.PropsWithChildren<Props>) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
