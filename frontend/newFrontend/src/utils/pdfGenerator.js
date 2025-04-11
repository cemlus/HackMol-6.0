// firPdfGenerator.js
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const generateFIRPDF = (complaintData) => {
  const {
    complaintId,
    complainant,
    complaintType,
    description,
    proofURIs,
    location,
    contactNumber,
    victimSignatureURI,
    status,
    // severity,
    policeStation,
    policeSignatureURI,
    rejectionReason,
    recordedTimestamp,
    lastUpdatedTimestamp,
    processedTimestamp,
  } = complaintData;

  const docDefinition = {
    content: [
      { text: 'First Information Report (FIR)', style: 'header' },
      { text: `Complaint ID: ${complaintId}`, margin: [0, 10, 0, 10] },

      { text: 'Victim Information', style: 'subheader' },
      {
        table: {
          widths: ['30%', '*'],
          body: [
            ['Complainant Address', complainant],
            ['Type of Complaint', complaintType],
            ['Description', description],
            ['Location', location],
            ['Contact Number', contactNumber.toString()],
            ['Victim Signature (URI)', victimSignatureURI],
            ['Proofs', proofURIs.join('\n')],
          ],
        },
      },

      { text: 'Status Information', style: 'subheader', margin: [0, 15, 0, 5] },
      {
        table: {
          widths: ['30%', '*'],
          body: [
            ['Status', status],
            ['Severity', severity],
            ['Rejection Reason', rejectionReason || 'N/A'],
          ],
        },
      },

      { text: 'Police Information', style: 'subheader', margin: [0, 15, 0, 5] },
      {
        table: {
          widths: ['30%', '*'],
          body: [
            ['Police Station Address', policeStation],
            ['Police Signature (URI)', policeSignatureURI],
          ],
        },
      },

      { text: 'Timestamps', style: 'subheader', margin: [0, 15, 0, 5] },
      {
        table: {
          widths: ['30%', '*'],
          body: [
            ['Recorded On', new Date(Number(recordedTimestamp) * 1000).toString()],
            ['Last Updated', new Date(Number(lastUpdatedTimestamp) * 1000).toString()],
            ['Processed On', new Date(Number(processedTimestamp) * 1000).toString()],
          ],
        },
      },
    ],
    styles: {
      header: { fontSize: 22, bold: true, alignment: 'center' },
      subheader: { fontSize: 16, bold: true, margin: [0, 10, 0, 5] },
    },
    defaultStyle: { fontSize: 12 },
  };

  pdfMake.createPdf(docDefinition).download(`FIR_${complaintId}.pdf`);
};
