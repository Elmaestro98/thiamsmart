import "./globals.css";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";

const RootLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  const locale = await getLocale();
  const messages = await getMessages(); // Récupère les messages pour la locale active

  return (
    <html lang={locale}>
      <body className="font-poppins antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#66030E",
                color: "#fff",
              },
            }}
          />
        </NextIntlClientProvider>
      </body>
    </html>
  );
};

export default RootLayout;