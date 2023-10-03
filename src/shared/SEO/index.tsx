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
    <div className="seo_wrapper">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content="#001f8f" />
      </Helmet>
      {children}
    </div>
  );
}
