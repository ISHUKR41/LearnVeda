import React from 'react';

type SchemaType = 'FAQPage' | 'Article' | 'Course' | 'Event';

interface SchemaMarkupProps {
  type: SchemaType;
  data: any;
}

export default function SchemaMarkup({ type, data }: SchemaMarkupProps) {
  let schemaData = {};

  if (type === 'FAQPage') {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": data.map((faq: { question: string; answer: string }) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
  } else if (type === 'Course') {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Course",
      "name": data.name,
      "description": data.description,
      "provider": {
        "@type": "Organization",
        "name": "EduQuest",
        "sameAs": "https://eduquest.com"
      }
    };
  } else if (type === 'Event') {
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": data.title,
      "startDate": data.startDate,
      "endDate": data.endDate,
      "eventAttendanceMode": "https://schema.org/OnlineEventAttendanceMode",
      "eventStatus": "https://schema.org/EventScheduled",
      "location": {
        "@type": "VirtualLocation",
        "url": data.url
      },
      "description": data.description,
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    };
  } else {
    // Article fallback
    schemaData = {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": data.title,
      "description": data.description,
      "author": {
        "@type": "Organization",
        "name": "EduQuest"
      }
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
    />
  );
}
