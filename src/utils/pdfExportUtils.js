// src/utils/pdfExportUtils.js
import {exportInterviewData as exportToHtml} from './htmlExportUtils';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Convert HTML content to PDF and export
 * @param {string} htmlContent - The HTML content to convert to PDF
 * @param {string} filename - The filename for the exported PDF
 */
const convertHtmlToPdf = async (htmlContent, filename) => {
  try {
    // Add <base> tag to ensure local fonts are loaded correctly
    htmlContent = htmlContent.replace('</head>',
        '<base href="' + window.location.href + '"></head>');

    // Include code to hide elements until fully loaded
    htmlContent = htmlContent.replace('</head>',
        `      <style>
        body {
          visibility: hidden;
          padding: 50px 0 100px !important; /* Add more padding at bottom to prevent cuts */
          max-width: 1200px !important; /* Match container width */
          width: 1200px !important;
          margin: 0 auto !important;
        }
        @page {
          margin: 10mm 5mm !important; /* Very small margins to maximize content */
        }
        /* Page break hints */
        .question-card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .subcategory {
          page-break-before: auto !important;
          page-break-after: auto !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .category {
          page-break-before: auto !important;
          page-break-after: auto !important;
        }
        .container {
          max-width: 1200px !important;
          width: 1200px !important;
          padding: 20px !important;
          margin: 0 auto !important;
        }
        /* Ensure content opacity is correct */
        .answer-insights-container.no-selections,
        .notes-container.empty,
        .rating-container.empty,
        .point-item.unselected {
          opacity: 0.4 !important;
        }
      </style>
      <script>
        window.onload = function() {
          document.body.style.visibility = 'visible';
        }
      </script>
      </head>`);

    // Create a temporary iframe to render the HTML
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.left = '-9999px';
    iframe.style.top = '0';
    iframe.style.width = '1200px'; // Match container width from HTML
    iframe.style.height = '1500px'; // Taller for better rendering
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    // Write the HTML to the iframe
    iframe.contentWindow.document.open();
    iframe.contentWindow.document.write(htmlContent);
    iframe.contentWindow.document.close();

    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Create PDF with A4 dimensions
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      compress: true,
      margins: { // Reduce margins to maximize content area
        top: 10,
        right: 5,
        bottom: 10,
        left: 5,
      },
    });

    // Function to render a page
    const renderPage = async (pageNum, totalPages) => {
      // Calculate height of each page (assuming A4 aspect ratio but with 1200px width)
      const pageHeight = 1200 * 1.414; // A4 aspect ratio is 1:1.414 (width:height)

      // Set scroll position for this page
      iframe.contentWindow.scrollTo(0, pageNum * pageHeight);

      await new Promise(resolve => setTimeout(resolve, 200)); // Allow more time to scroll

      // Create canvas from content
      const canvas = await html2canvas(iframe.contentWindow.document.body, {
        scale: 2, // Higher resolution
        windowWidth: 1200,
        windowHeight: pageHeight,
        y: pageNum * pageHeight,
        height: pageHeight,
        allowTaint: true,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Add extra checks for page breaks in cloned document
          const questionCards = clonedDoc.querySelectorAll('.question-card');
          questionCards.forEach(card => {
            card.style.pageBreakInside = 'avoid';
            card.style.breakInside = 'avoid';
          });
        },
      });

      // Add image to PDF
      const imgData = canvas.toDataURL('image/jpeg', 1.0); // Use highest quality

      if (pageNum > 0) {
        pdf.addPage();
      }

      // Add image with minimal margins - use aspect ratio to fill the page
      pdf.addImage(imgData, 'JPEG', 5, 5, 200, 282); // A4 dimensions in mm with small margins
    };

    // Determine the total height of the content
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait longer for content to render

    const bodyHeight = iframe.contentWindow.document.body.scrollHeight;
    const pageHeight = 1200 * 1.414; // A4 aspect ratio
    const pages = Math.ceil(bodyHeight / pageHeight);

    // Render each page
    for (let i = 0; i < pages; i++) {
      await renderPage(i, pages);
    }

    // Save the PDF
    pdf.save(filename);

    // Clean up
    document.body.removeChild(iframe);

    return true;
  } catch (error) {
    console.error('Error converting HTML to PDF:', error);
    throw error;
  }
};

/**
 * Export interview data as a PDF file
 * @param {Object} interviewState - Current interview state
 * @param {Array} allQuestions - All available questions
 * @param {Object} metadata - Additional metadata for the report
 */
export const exportInterviewData = async (
    interviewState, allQuestions, metadata = {}) => {
  try {

    // First generate HTML content
    // We'll use a special flag to indicate we're preparing for PDF export
    const htmlContent = await exportToHtml(interviewState, allQuestions,
        metadata, {
          generateHtmlOnly: true,
          forPdfExport: true,
        });

    // Create filename
    const candidateName = metadata.candidateName ?
        `-${metadata.candidateName.toLowerCase().replace(/\s+/g, '-')}` : '';
    const filename = `technical-interview-notes${candidateName}-${new Date().toISOString().
        split('T')[0]}.pdf`;

    // Convert and export
    return await convertHtmlToPdf(htmlContent, filename);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
};

export default exportInterviewData;