import { College } from '../types/college';
import { Document, Packer, Paragraph, Table, TableRow, TableCell, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';

export const exportToPDF = (colleges: College[]) => {
    const doc = new jsPDF();
    const margin = 20;
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

        college.requiredExams.forEach(exam => {
            doc.text(`${exam.exam}: ${exam.score}`, margin, yOffset);
            yOffset += 8;
        });

        // Add spacing between colleges
        if (index < colleges.length - 1) {
            doc.setDrawColor(200);
            doc.line(margin, yOffset, margin + 190, yOffset);
            yOffset += 10;
        }
    });

    doc.save('colleges.pdf');
};

export const exportToWord = async (colleges: College[]) => {
    const doc = new Document({
        sections: [{
            properties: {},
            children: colleges.map(college => [
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
            ]).flat()
        }]
    });

    const buffer = await Packer.toBuffer(doc);
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    saveAs(blob, 'colleges.docx');
}; 