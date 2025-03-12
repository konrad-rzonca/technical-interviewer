// src/utils/pdfExportUtils.js
import {exportInterviewData as exportToHtml} from './htmlExportUtils';
import {jsPDF} from 'jspdf';
import html2canvas from 'html2canvas';

// =========================================================
// CONFIGURATION CONSTANTS
// =========================================================

// Container size to match HTML export
const CONTAINER_WIDTH = 1200;      // Width in pixels
const IFRAME_HEIGHT = 2000;        // Height of temporary iframe

// PDF dimensions and scaling
const SCALE_FACTOR = 1.5;          // Higher scale factor for better resolution
const HORIZONTAL_MARGIN = 20;      // Left and right margins in points
const VERTICAL_MARGIN = 20;        // Top and bottom margins in points
const MIN_SPACE_FOR_ELEMENT = 100; // Minimum space needed before adding new page

// Spacing constants
const HEADER_BOTTOM_MARGIN = 10;   // Space after header
const DETAILS_BOTTOM_MARGIN = 10;  // Space after candidate details
const TITLE_BOTTOM_MARGIN = 10;    // Space after category title
const HEADER_BOTTOM_PADDING = 10;  // Space after subcategory header
const CARD_BOTTOM_MARGIN = 5;     // Space after question card
const SUBCATEGORY_BOTTOM_MARGIN = 5; // Space after subcategory
const CATEGORY_BOTTOM_MARGIN = 5; // Space after category

// Image quality
const JPEG_QUALITY = 1;         // Quality setting for JPEG compression (0-1)

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

    // Calculate the scale factor for A4 size
    // A4 is approximately 8.27 × 11.69 inches (210 × 297 mm)

    // Add styles to ensure proper layout and page breaks
    const enhancedHtml = htmlContent.replace('</head>', `
      <style>
        /* Basic reset to ensure consistent rendering */
        * {
          box-sizing: border-box;
        }
        
        body {
          margin: 0;
          padding: 0;
          width: ${CONTAINER_WIDTH}px !important;
          background-color: #fafafa;
        }
        
        /* Container styling to match HTML export */
        .container {
          width: ${CONTAINER_WIDTH}px !important;
          max-width: ${CONTAINER_WIDTH}px !important;
          margin: 0 auto !important;
          padding: 10px !important;
          background-color: #ffffff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.08);
          border-radius: 8px;
        }
        
        /* Force each question card onto a single page */
        .question-card {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 0px !important;
        }
        
        /* Ensure subcategories don't break across pages */
        .subcategory {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          margin-bottom: 0px !important;
        }
        
        /* Make sure categories keep logical breaks */
        .category {
          page-break-before: auto !important;
          page-break-after: auto !important;
          margin-bottom: 0px !important;
        }
        
        /* Maintain answer insights styling */
        .answer-insights-container {
          display: flex !important;
          flex-direction: row !important;
          gap: 4px !important;
          width: 100% !important;
        }
        
        .insight-category {
          flex: 1 !important;
          width: 33.33% !important;
        }
        
        /* Fix text overflow issues */
        .point-item {
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          max-width: 100% !important;
        }
        
        .point-item > div:not(.point-indicator), 
        .point-item > span:not(.point-indicator) {
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          white-space: nowrap !important;
          display: inline-block !important;
          max-width: calc(100% - 20px) !important;
        }
        
        /* Strong styling for truncated text */
        .question-title, .point-item {
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          max-height: none !important;
        }
        
        /* Additional fixes for overflow text */
        .points-container, .points-column {
          overflow: hidden !important;
          width: 100% !important;
        }
        
        .points-grid {
          overflow: hidden !important;
          width: 100% !important;
        }
      </style>
    </head>`);

    // Create an invisible iframe to load the content
    const tempIframe = document.createElement('iframe');
    tempIframe.style.position = 'fixed';
    tempIframe.style.top = '0';
    tempIframe.style.left = '-9999px';
    tempIframe.style.width = `${CONTAINER_WIDTH}px`;
    tempIframe.style.height = `${IFRAME_HEIGHT}px`;
    tempIframe.style.border = 'none';
    tempIframe.style.visibility = 'hidden';
    document.body.appendChild(tempIframe);

    // Load the HTML content into the iframe
    tempIframe.contentDocument.open();
    tempIframe.contentDocument.write(enhancedHtml);
    tempIframe.contentDocument.close();

    // Wait for images and fonts to load
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Initialize jsPDF - use points for more precise positioning
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4',
      compress: true,
    });

    // Get PDF dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate content width and scaling
    const contentWidth = pdfWidth - (2 * HORIZONTAL_MARGIN);
    const ratio = contentWidth / CONTAINER_WIDTH;

    // Get elements from the DOM
    const container = tempIframe.contentDocument.querySelector('.container');
    const categories = tempIframe.contentDocument.querySelectorAll('.category');

    // Add the header first
    const header = tempIframe.contentDocument.querySelector('.header');
    let yPosition = VERTICAL_MARGIN;

    if (header) {
      const headerCanvas = await html2canvas(header, {
        scale: SCALE_FACTOR,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const headerImgData = headerCanvas.toDataURL('image/jpeg', JPEG_QUALITY);
      const headerWidth = contentWidth;
      const headerHeight = (headerCanvas.height / SCALE_FACTOR) * ratio;

      pdf.addImage(
          headerImgData,
          'JPEG',
          HORIZONTAL_MARGIN,
          yPosition,
          headerWidth,
          headerHeight,
      );

      yPosition += headerHeight + HEADER_BOTTOM_MARGIN;
    }

    // Add candidate details if present
    const candidateDetails = tempIframe.contentDocument.querySelector(
        '.candidate-details');
    if (candidateDetails) {
      const detailsCanvas = await html2canvas(candidateDetails, {
        scale: SCALE_FACTOR,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const detailsImgData = detailsCanvas.toDataURL('image/jpeg',
          JPEG_QUALITY);
      const detailsWidth = contentWidth;
      const detailsHeight = (detailsCanvas.height / SCALE_FACTOR) * ratio;

      pdf.addImage(
          detailsImgData,
          'JPEG',
          HORIZONTAL_MARGIN,
          yPosition,
          detailsWidth,
          detailsHeight,
      );

      yPosition += detailsHeight + DETAILS_BOTTOM_MARGIN;
    }

    // Process each category one by one
    for (let i = 0; i < categories.length; i++) {
      const category = categories[i];

      // Add category title
      const categoryTitle = category.querySelector('.category-title');
      if (categoryTitle) {
        // Check if we need a new page
        if (yPosition > pdfHeight - MIN_SPACE_FOR_ELEMENT) {
          pdf.addPage();
          yPosition = VERTICAL_MARGIN;
        }

        const titleCanvas = await html2canvas(categoryTitle, {
          scale: SCALE_FACTOR,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });

        const titleImgData = titleCanvas.toDataURL('image/jpeg', JPEG_QUALITY);
        const titleWidth = contentWidth;
        const titleHeight = (titleCanvas.height / SCALE_FACTOR) * ratio;

        pdf.addImage(
            titleImgData,
            'JPEG',
            HORIZONTAL_MARGIN,
            yPosition,
            titleWidth,
            titleHeight,
        );

        yPosition += titleHeight + TITLE_BOTTOM_MARGIN;
      }

      // Process each subcategory in this category
      const subcategories = category.querySelectorAll('.subcategory');
      for (const subcategory of subcategories) {
        // Add subcategory header
        const subcategoryHeader = subcategory.querySelector(
            '.subcategory-header');
        if (subcategoryHeader) {
          // Check if we need a new page
          if (yPosition > pdfHeight - MIN_SPACE_FOR_ELEMENT) {
            pdf.addPage();
            yPosition = VERTICAL_MARGIN;
          }

          const headerCanvas = await html2canvas(subcategoryHeader, {
            scale: SCALE_FACTOR,
            logging: false,
            useCORS: true,
            allowTaint: true,
          });

          const headerImgData = headerCanvas.toDataURL('image/jpeg',
              JPEG_QUALITY);
          const headerWidth = contentWidth;
          const headerHeight = (headerCanvas.height / SCALE_FACTOR) * ratio;

          pdf.addImage(
              headerImgData,
              'JPEG',
              HORIZONTAL_MARGIN,
              yPosition,
              headerWidth,
              headerHeight,
          );

          yPosition += headerHeight + HEADER_BOTTOM_PADDING;
        }

        // Process each question card
        const questionCards = subcategory.querySelectorAll('.question-card');
        for (const card of questionCards) {
          // Apply additional overflow fixes to this card's point items
          const pointItems = card.querySelectorAll('.point-item');
          pointItems.forEach(item => {
            item.style.whiteSpace = 'nowrap';
            item.style.overflow = 'hidden';
            item.style.textOverflow = 'ellipsis';
          });

          // Render the card to canvas
          const cardCanvas = await html2canvas(card, {
            scale: SCALE_FACTOR,
            logging: false,
            useCORS: true,
            allowTaint: true,
          });

          const cardImgData = cardCanvas.toDataURL('image/jpeg', JPEG_QUALITY);
          const cardWidth = contentWidth;
          const cardHeight = (cardCanvas.height / SCALE_FACTOR) * ratio;

          // Check if card fits on current page, otherwise add a new page
          if (yPosition + cardHeight > pdfHeight - VERTICAL_MARGIN) {
            pdf.addPage();
            yPosition = VERTICAL_MARGIN;
          }

          // Add the card to the PDF
          pdf.addImage(
              cardImgData,
              'JPEG',
              HORIZONTAL_MARGIN,
              yPosition,
              cardWidth,
              cardHeight,
          );

          yPosition += cardHeight + CARD_BOTTOM_MARGIN;
        }

        // Add space after subcategory
        yPosition += SUBCATEGORY_BOTTOM_MARGIN;
      }

      // Add space after category
      yPosition += CATEGORY_BOTTOM_MARGIN;
    }

    // Add footer
    const footer = tempIframe.contentDocument.querySelector('.footer');
    if (footer) {
      // Check if we need a new page
      if (yPosition > pdfHeight - MIN_SPACE_FOR_ELEMENT) {
        pdf.addPage();
        yPosition = pdfHeight - MIN_SPACE_FOR_ELEMENT;
      }

      const footerCanvas = await html2canvas(footer, {
        scale: SCALE_FACTOR,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });

      const footerImgData = footerCanvas.toDataURL('image/jpeg', JPEG_QUALITY);
      const footerWidth = contentWidth;
      const footerHeight = (footerCanvas.height / SCALE_FACTOR) * ratio;

      pdf.addImage(
          footerImgData,
          'JPEG',
          HORIZONTAL_MARGIN,
          yPosition,
          footerWidth,
          footerHeight,
      );
    }

    // Save the PDF
    pdf.save(filename);

    // Clean up
    document.body.removeChild(tempIframe);

    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
};

export default exportInterviewData;