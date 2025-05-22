import { College } from '../types/college';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

export const exportToPDF = (colleges: College[]) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);
    let yOffset = margin;

    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('College Shortlist', margin, yOffset);
    yOffset += 20;

    // Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, margin, yOffset);
    yOffset += 20;

    // Colleges
    colleges.forEach((college, index) => {
        if (yOffset > doc.internal.pageSize.getHeight() - margin) {
            doc.addPage();
            yOffset = margin;
        }

        // Institution Name
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(college.institutionName, margin, yOffset);
        yOffset += 10;

        // Location
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Location: ${college.location.city}, ${college.location.country}`, margin, yOffset);
        yOffset += 8;

        // Tuition Fee
        doc.text(`Tuition Fee: $${college.tuitionFee.toLocaleString()}`, margin, yOffset);
        yOffset += 8;

        // Number of Semesters
        doc.text(`Number of Semesters: ${college.numberOfSemesters}`, margin, yOffset);
        yOffset += 8;

        // Application Deadline
        doc.text(`Application Deadline: ${new Date(college.applicationDeadline).toLocaleDateString()}`, margin, yOffset);
        yOffset += 8;

        // Required Exams
        const examText = college.requiredExams.map(exam => `${exam.exam}: ${exam.score}`).join(', ');
        doc.text(`Required Exams: ${examText}`, margin, yOffset);
        yOffset += 8;

        // Description
        if (college.description) {
            const splitDescription = doc.splitTextToSize(`Notes: ${college.description}`, contentWidth);
            doc.text(splitDescription, margin, yOffset);
            yOffset += splitDescription.length * 7;
        }

        // Add spacing between colleges
        if (index < colleges.length - 1) {
            yOffset += 15;
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
                    text: 'College Shortlist',
                    heading: 'Heading1',
                    spacing: {
                        after: 200,
                    },
                }),
                new Paragraph({
                    text: `Generated on: ${new Date().toLocaleDateString()}`,
                    spacing: {
                        after: 400,
                    },
                }),
                new Table({
                    width: {
                        size: 100,
                        type: WidthType.PERCENTAGE,
                    },
                    borders: {
                        top: { style: BorderStyle.SINGLE, size: 1 },
                        bottom: { style: BorderStyle.SINGLE, size: 1 },
                        left: { style: BorderStyle.SINGLE, size: 1 },
                        right: { style: BorderStyle.SINGLE, size: 1 },
                        insideHorizontal: { style: BorderStyle.SINGLE, size: 1 },
                        insideVertical: { style: BorderStyle.SINGLE, size: 1 },
                    },
                    rows: [
                        new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: 'Institution Name' })],
                                    width: {
                                        size: 25,
                                        type: WidthType.PERCENTAGE,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: 'Location' })],
                                    width: {
                                        size: 15,
                                        type: WidthType.PERCENTAGE,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: 'Tuition Fee' })],
                                    width: {
                                        size: 15,
                                        type: WidthType.PERCENTAGE,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: 'Semesters' })],
                                    width: {
                                        size: 10,
                                        type: WidthType.PERCENTAGE,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: 'Deadline' })],
                                    width: {
                                        size: 15,
                                        type: WidthType.PERCENTAGE,
                                    },
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: 'Required Exams' })],
                                    width: {
                                        size: 20,
                                        type: WidthType.PERCENTAGE,
                                    },
                                }),
                            ],
                        }),
                        ...colleges.map((college) => new TableRow({
                            children: [
                                new TableCell({
                                    children: [new Paragraph({ text: college.institutionName })],
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `${college.location.city}, ${college.location.country}` })],
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: `$${college.tuitionFee.toLocaleString()}` })],
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: college.numberOfSemesters.toString() })],
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: new Date(college.applicationDeadline).toLocaleDateString() })],
                                }),
                                new TableCell({
                                    children: [new Paragraph({ text: college.requiredExams.map(exam => `${exam.exam}: ${exam.score}`).join(', ') })],
                                }),
                            ],
                        })),
                    ],
                }),
            ],
        }],
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, 'colleges.docx');
}; 