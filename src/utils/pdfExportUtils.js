// src/utils/pdfExportUtils.js
import {exportInterviewData as exportToHtml} from './htmlExportUtils';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';
import {isUbsTheme} from '../themes/themeUtils';

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
          padding-top: 50px !important; /* Increase padding for better page breaks */
        }
        @page {
          margin: 10mm 5mm !important; /* Very small margins to maximize content */
        }
        /* Page break hints */
        .question-card {
          page-break-inside: avoid !important;
        }
        .subcategory {
          page-break-before: auto !important;
          page-break-after: auto !important;
          page-break-inside: avoid !important;
        }
        .category {
          page-break-before: auto !important;
          page-break-after: auto !important;
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
    iframe.style.width = '794px'; // A4 width in pixels at 96 DPI
    iframe.style.height = '1123px'; // A4 height in pixels
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
      // Set scroll position for this page
      iframe.contentWindow.scrollTo(0, pageNum * 1123);

      await new Promise(resolve => setTimeout(resolve, 100)); // Allow time to scroll

      // Create canvas from content
      const canvas = await html2canvas(iframe.contentWindow.document.body, {
        scale: 2, // Higher resolution
        windowWidth: 794,
        windowHeight: 1123,
        y: pageNum * 1123,
        height: 1123,
        allowTaint: true,
        useCORS: true,
        logging: false,
      });

      // Add image to PDF
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (pageNum > 0) {
        pdf.addPage();
      }

      // Add image with minimal margins
      pdf.addImage(imgData, 'JPEG', 5, 5, 200, 287); // A4 dimensions in mm with small margins
    };

    // Determine the total height of the content
    const bodyHeight = iframe.contentWindow.document.body.scrollHeight;
    const pages = Math.ceil(bodyHeight / 1123);

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
    // Notify about local logo - we're adding this note for developers
    if (isUbsTheme()) {
      console.info(
          'Note: UBS logo should be saved at "/public/assets/images/ubs-logo.png" for proper export');
    }

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