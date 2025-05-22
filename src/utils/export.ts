import { College } from '../types/college';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

export const exportToPDF = (colleges: College[]) => {
    const doc = new jsPDF();
    let yOffset = 20;
    const lineHeight = 10;
    const pageHeight = 280;

    colleges.forEach((college, index) => {
        // Check if we need a new page
        if (yOffset > pageHeight) {
            doc.addPage();
            yOffset = 20;
        }

        // College Name and University
        doc.setFontSize(16);
        doc.text(college.collegeName, 20, yOffset);
        yOffset += lineHeight;

        doc.setFontSize(12);
        doc.text(college.universityName, 20, yOffset);
        yOffset += lineHeight * 1.5;

        // Details
        doc.setFontSize(10);
        doc.text(`Location: ${college.location.city}, ${college.location.country}`, 20, yOffset);
        yOffset += lineHeight;

        doc.text(`Tuition Fee: $${college.tuitionFee.toLocaleString()}`, 20, yOffset);
        yOffset += lineHeight;

        doc.text(`Number of Semesters: ${college.numberOfSemesters}`, 20, yOffset);
        yOffset += lineHeight;

        doc.text(`Application Deadline: ${new Date(college.applicationDeadline).toLocaleDateString()}`, 20, yOffset);
        yOffset += lineHeight;

        doc.text(`Required Exams: ${college.requiredExams.join(', ')}`, 20, yOffset);
        yOffset += lineHeight;

        if (college.description) {
            doc.text(`Notes: ${college.description}`, 20, yOffset);
            yOffset += lineHeight;
        }

        // Add separator between colleges
        if (index < colleges.length - 1) {
            doc.setDrawColor(200, 200, 200);
            doc.line(20, yOffset, 190, yOffset);
            yOffset += lineHeight * 1.5;
        }
    });

    doc.save('colleges.pdf');
};

export const exportToWord = async (colleges: College[]) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'College Shortlist',
                            bold: true,
                            size: 32,
                        }),
                    ],
                }),
                new Paragraph({}),
                new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph('College Name')],
                                    width: { size: 20, type: WidthType.PERCENTAGE },
                                }),
                                new TableCell({
                                    children: [new Paragraph('University')],
                                    width: { size: 20, type: WidthType.PERCENTAGE },
                                }),
                                new TableCell({
                                    children: [new Paragraph('Location')],
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                }),
                                new TableCell({
                                    children: [new Paragraph('Tuition Fee')],
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                }),
                                new TableCell({
                                    children: [new Paragraph('Deadline')],
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                }),
                                new TableCell({
                                    children: [new Paragraph('Exams')],
                                    width: { size: 15, type: WidthType.PERCENTAGE },
                                }),
                            ],
                        }),
                        ...colleges.map(college => new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph(college.collegeName)],
                                }),
                                new TableCell({
                                    children: [new Paragraph(college.universityName)],
                                }),
                                new TableCell({
                                    children: [new Paragraph(`${college.location.city}, ${college.location.country}`)],
                                }),
                                new TableCell({
                                    children: [new Paragraph(`$${college.tuitionFee.toLocaleString()}`)],
                                }),
                                new TableCell({
                                    children: [new Paragraph(new Date(college.applicationDeadline).toLocaleDateString())],
                                }),
                                new TableCell({
                                    children: [new Paragraph(college.requiredExams.join(', '))],
                                }),
                            ],
                        })),
                    ],
                }),
            ],
        }],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'colleges.docx');
}; 