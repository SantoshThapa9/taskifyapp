import "./global.scss";
import Sidebar from "./components/sidebar";
import { ThemeProvider } from "./hook/ThemeContext";

const description =
  "Taskify - Smart task management app to boost productivity. Track & plan effortlessly. Created by Santosh Thapa.";

export const metadata = {
  title: "Taskify - Task Management App",
  description: description,
  metadataBase: new URL("https://taskifyapp-smoky.vercel.app"),
  keywords: [
    "taskify",
    "task management app",
    "to-do list app",
    "productivity app",
    "santosh thapa",
  ],
  author: "Santosh Thapa",
  robots: "index, follow",
  canonical: "https://taskifyapp-smoky.vercel.app",
  openGraph: {
    title: "Taskify - Task Management App",
    description: description,
    url: "https://taskifyapp-smoky.vercel.app",
    type: "website",

    images: [
      {
        url: "https://taskifyapp-smoky.vercel.app/taskify.png",
        width: 512,
        height: 512,
        alt: "Taskify - Task Management App",
        type: "image/png",
      },
    ],
    site_name: "Taskify - Task Management App",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@SantoshThapa689",
    title: "Taskify - Task Management App",
    description: description,
    image: "https://taskifyapp-smoky.vercel.app/taskify.png",
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/taskify.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/taskify.png" sizes="32x32" type="image/png" />
        <link rel="icon" href="/taskify.png" sizes="48x48" type="image/png" />
        <link rel="icon" href="/taskify.png" sizes="96x96" type="image/png" />
        <link rel="icon" href="/taskify.png" sizes="192x192" type="image/png" />
        <link rel="apple-touch-icon" href="/taskify.png" sizes="180x180" />
        <link rel="shortcut icon" href="/taskify.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        <meta
          name="google-site-verification"
          content="DJpxevNIXtCQe8Y75L2Vo2UB5r60Sh18n6XOYMTmEj4"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Taskify - Task Management App",
              applicationCategory: "TaskManagementApplication",
              operatingSystem: "All",
              url: "https://taskifyapp-smoky.vercel.app",
              sameAs: [
                "https://github.com/SantoshThapa9",
                "https://linkedin.com/in/santosh-thapa",
                "https://santosh-gamma.vercel.app",
              ],
              logo: "https://taskifyapp-smoky.vercel.app/taskify.png",
              image: "https://taskifyapp-smoky.vercel.app/taskify.png",
              downloadUrl: "https://taskifyapp-smoky.vercel.app",
              description:
                "Taskify - Smart task management app to boost productivity. Track & plan with ease. Created by Santosh Thapa.",
              inLanguage: "en",
              creator: {
                "@type": "Person",
                name: "Santosh Thapa",
                url: "https://santosh-gamma.vercel.app",
              },
              datePublished: "2024-09-25",
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: "Home",
                    item: "https://taskifyapp-smoky.vercel.app",
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: "Login",
                    item: "https://taskifyapp-smoky.vercel.app/login",
                  },
                  {
                    "@type": "ListItem",
                    position: 3,
                    name: "About",
                    item: "https://taskifyapp-smoky.vercel.app/about",
                  },
                ],
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": "https://taskifyapp-smoky.vercel.app",
              },
            }),
          }}
        />
      </head>

      <body>
        <ThemeProvider>
          <Sidebar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
