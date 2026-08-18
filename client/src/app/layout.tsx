import type { Metadata } from "next";
import { Archivo, Archivo_Black, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { getLocale, getMessages, getTranslations } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { cn } from "@/lib/utils";
import QueryProvider from "@/shared/providers/QueryProvider";
import PersonSchema from "@/components/PersonSchema";

const archivoBlack = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const archivo = Archivo({
  variable: "--font-body",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: "400",
  style: ["italic", "normal"],
});

const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const SITE_URL = "https://nematjonovx.uz";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: "RootMeta" });

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: t("title"),
      template: `%s | Hikmatillo Nematjonov`,
    },
    description: t("description"),
    keywords: t("keywords").split(","),
    authors: [{ name: "Hikmatillo Nematjonov", url: SITE_URL }],
    creator: "Hikmatillo Nematjonov",
    alternates: {
      canonical: "/",
      languages: {
        uz: "/uz",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "uz" ? "uz_UZ" : "en_US",
      url: SITE_URL,
      siteName: "Hikmatillo Nematjonov",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: "/og-image.png",
          width: 1200,
          height: 630,
          alt: t("title"),
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: ["/og-image.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon-16x16.png",
      apple: "/apple-touch-icon.png",
    },
  };
}
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={cn(
        "h-full",
        "antialiased",
        archivoBlack.variable,
        archivo.variable,
        instrumentSerif.variable,
        "font-mono",
        jetbrainsMono.variable
      )}
    >
      <body className="min-h-full flex flex-col bg-paper">
        <PersonSchema />
        <QueryProvider>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
          </NextIntlClientProvider>
        </QueryProvider>
      </body>
    </html>
  );
}