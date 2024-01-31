import React from "react";
import { Helmet } from "react-helmet-async";

type IPageSEOProps = {
  title: string;
  description: string;
  themeColor?: string;
  children: React.ReactNode;
};

export default function SEO(props: IPageSEOProps) {
  const { children, description, title } = props;
  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#F05B2A" />
      </Helmet>
      {children}
    </>
  );
}
