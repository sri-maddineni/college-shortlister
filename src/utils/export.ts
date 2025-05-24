import { College } from '../types/college';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

export const exportToPDF = (colleges: College[]) => {
    const doc = new jsPDF();
    const margin = 20;
    const pageHeight = doc.internal.pageSize.getHeight();
    let yOffset = margin;

    // Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('College Shortlist', margin, yOffset);
    yOffset += 20;

    // Date
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, yOffset);
    yOffset += 20;

    // Colleges
    colleges.forEach((college, index) => {
        // Check if we need a new page before starting a new college
        if (yOffset > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
        }

        // Institution Name
        doc.setFontSize(16);
        doc.setFont('helvetica', 'bold');
        doc.text(college.institutionName, margin, yOffset);
        yOffset += 10;

        // Program
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        doc.text(`Program: ${college.courseName}`, margin, yOffset);
        yOffset += 8;

        // Location
        doc.text(`Location: ${college.location.city}, ${college.location.country}`, margin, yOffset);
        yOffset += 8;

        // Duration
        doc.text(`Duration: ${college.numberOfSemesters} semesters`, margin, yOffset);
        yOffset += 8;

        // Tuition Fee
        doc.text(`Tuition Fee: $${college.tuitionFee.toLocaleString()}`, margin, yOffset);
        yOffset += 8;

        // Application Deadline
        doc.text(`Application Deadline: ${new Date(college.applicationDeadline).toLocaleDateString()}`, margin, yOffset);
        yOffset += 8;

        // Admission Status
        doc.text(`Admission Status: ${college.admissionStatus}`, margin, yOffset);
        yOffset += 8;

        // Required Exams
        doc.text('Required Exams:', margin, yOffset);
        yOffset += 8;

        // Check if we need a new page before adding exams
        if (yOffset + (college.requiredExams.length * 8) > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
        }

        college.requiredExams.forEach(exam => {
            doc.text(`${exam.exam}: ${exam.score}`, margin, yOffset);
            yOffset += 8;
        });

        // Description if exists
        if (college.description) {
            // Check if we need a new page before adding description
            if (yOffset + 16 > pageHeight - margin) {
                doc.addPage();
                yOffset = margin;
            }

            doc.text('Description:', margin, yOffset);
            yOffset += 8;

            // Split description into lines that fit the page width
            const splitText = doc.splitTextToSize(college.description, doc.internal.pageSize.getWidth() - (2 * margin));

            // Check if we need a new page for the description
            if (yOffset + (splitText.length * 8) > pageHeight - margin) {
                doc.addPage();
                yOffset = margin;
            }

            splitText.forEach((line: string) => {
                doc.text(line, margin, yOffset);
                yOffset += 8;
            });
        }

        // Add spacing between colleges
        if (index < colleges.length - 1) {
            // Check if we need a new page before adding the divider
            if (yOffset + 10 > pageHeight - margin) {
                doc.addPage();
                yOffset = margin;
            } else {
                doc.setDrawColor(200);
                doc.line(margin, yOffset, margin + 190, yOffset);
                yOffset += 10;
            }
        }
    });

    // Add JSON representation at the end
    doc.addPage();
    yOffset = margin;

    // JSON Title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('JSON Representation', margin, yOffset);
    yOffset += 15;

    // JSON Content
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const jsonString = JSON.stringify(colleges, null, 2);
    const jsonLines = doc.splitTextToSize(jsonString, doc.internal.pageSize.getWidth() - (2 * margin));

    jsonLines.forEach((line: string) => {
        if (yOffset > pageHeight - margin) {
            doc.addPage();
            yOffset = margin;
        }
        doc.text(line, margin, yOffset);
        yOffset += 6;
    });

    doc.save('colleges.pdf');
};

export const exportToWord = async (colleges: College[]) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                // College details
                ...colleges.map(college => [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: college.institutionName,
                                bold: true,
                                size: 32
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Program: ${college.courseName}`,
                                size: 24
                            })
                        ]
                    }),
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Location: ${college.location.city}, ${college.location.country}`,
                                size: 24
                            })
                        ]
                    }),
                    new Table({
                        rows: [
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph('Duration')],
                                        width: { size: 30, type: 'pct' }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`${college.numberOfSemesters} semesters`)],
                                        width: { size: 70, type: 'pct' }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph('Tuition Fee')],
                                        width: { size: 30, type: 'pct' }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(`$${college.tuitionFee.toLocaleString()}`)],
                                        width: { size: 70, type: 'pct' }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph('Application Deadline')],
                                        width: { size: 30, type: 'pct' }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(new Date(college.applicationDeadline).toLocaleDateString())],
                                        width: { size: 70, type: 'pct' }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph('Admission Status')],
                                        width: { size: 30, type: 'pct' }
                                    }),
                                    new TableCell({
                                        children: [new Paragraph(college.admissionStatus)],
                                        width: { size: 70, type: 'pct' }
                                    })
                                ]
                            }),
                            new TableRow({
                                children: [
                                    new TableCell({
                                        children: [new Paragraph('Required Exams')],
                                        width: { size: 30, type: 'pct' }
                                    }),
                                    new TableCell({
                                        children: [
                                            new Paragraph(
                                                college.requiredExams
                                                    .map(exam => `${exam.exam}: ${exam.score}`)
                                                    .join('\n')
                                            )
                                        ],
                                        width: { size: 70, type: 'pct' }
                                    })
                                ]
                            })
                        ]
                    }),
                    new Paragraph({ text: '' })
                ]).flat(),

                // JSON Representation
                new Paragraph({
                    children: [
                        new TextRun({
                            text: 'JSON Representation',
                            bold: true,
                            size: 32
                        })
                    ]
                }),
                new Paragraph({
                    children: [
                        new TextRun({
                            text: JSON.stringify(colleges, null, 2),
                            size: 24
                        })
                    ]
                })
            ]
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, 'colleges.docx');
}; 