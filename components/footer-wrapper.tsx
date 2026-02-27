"use client";
import { usePathname } from "next/navigation";
import Footer from "@/components/footer";

const FooterWrapper = () => {
  const pathname = usePathname();
  const footerHiddenRoutes = ["/checkout", "/cart", "/login", "/auth"];
  const shouldHideFooter = footerHiddenRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (shouldHideFooter) return null;
  return <Footer />;
};

export default FooterWrapper;
