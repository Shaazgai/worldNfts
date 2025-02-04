import { Metadata } from "next";



// Helper function to get the base URL
const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  return 'https://www.mintpark.io/';
};

export const metadata: Metadata = {
  metadataBase: new URL(getBaseUrl()),
  title: {
    default: "World Nfts - Create Unique Digital Art & NFTs",
    template: "%s | World Nfts"
  },
  description: "Explore and create unique digital art on World Nfts. Launch your NFT projects, connect with artists, and bridge your digital assets across blockchains.",
  applicationName: "World Nft",
  
  keywords: [
    "create digital art",
    "unique NFT",
    "art marketplace",
    "digital creation",
    "launch NFT",
    "bitcoin NFT",
    "blockchain bridge",
    "crypto art",
    "NFT explorer",
    "citrea blockchain",
    "mint NFT",
    "worldNfts",
    "world nfts",
    "digital assets",
    "web3 platform",
    "bitcoin ordinals",
    "nft marketplace",
    "digital art platform",
    "citrea",
    "nubit",
    "launchpad",
    "collections",
    "world",
    "nft"
  ],

  // Canonical URL configuration
  alternates: {
    canonical: getBaseUrl(),
    languages: {
      'en': getBaseUrl(),
      'x-default': getBaseUrl()
    }
  },

  // OpenGraph metadata
  openGraph: {
    title: "World Nfts - Create & Explore Digital Art",
    description: "Create, launch, and bridge unique digital art on World Nfts. Your gateway to Bitcoin NFTs and cross-chain digital assets.",
    siteName: 'World Nfts',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: `/logo.png`,
        width: 1200,
        height: 630,
        alt: 'World Nfts - Digital Art Creation Platform',
        type: 'image/png',
      },
      {
        url: `/logo.png`,
        width: 600,
        height: 315,
        alt: 'World Nfts - Digital Art Creation Platform',
        type: 'image/png',
      }
    ],
  },

  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'World Nfts - Digital Art Creation Platform',
    description: 'Create and launch unique digital art on World Nfts. Explore Bitcoin NFTs and cross-chain opportunities.',
    images: [`/logo.png`],
    site: '@worldNfts',
    creator: '@worldNfts'
  },

  // Icons
  icons: {
    icon: '/logo.png',
    apple: [
      { url: '/logo.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/logo.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#000000'
      }
    ]
  },

  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Verification
  verification: {
    google: 'your-google-site-verification',
    other: {
      yandex: 'your-yandex-verification'
    }
  },

  // Additional metadata
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
  },
  
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false
  },

  category: 'technology',
  creator: 'World Nfts Team',
  publisher: 'World Nfts',
  
  // manifest: '/manifest.json',
  themeColor: '#ffffff',
};

// For dynamic routes and pages
export async function generateMetadata({ 
  params,
  searchParams
}: { 
  params: { slug?: string; id?: string }
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  const path = params.slug || params.id || '';
  const baseUrl = getBaseUrl();

  return {
    ...metadata,
    alternates: {
      canonical: path ? `${baseUrl}/${path}` : baseUrl,
    },
    openGraph: {
      ...metadata.openGraph,
      url: path ? `${baseUrl}/${path}` : baseUrl,
    }
  };
}

// Helper function for specific page metadata
export function getPageMetadata(title: string, description?: string): Metadata {
  return {
    ...metadata,
    title,
    description: description || metadata?.description,
    openGraph: {
      ...metadata.openGraph,
      title,
      description: description || metadata?.openGraph?.description,
    },
    twitter: {
      ...metadata.twitter,
      title,
      description: description || metadata?.twitter?.description,
    },
  };
}