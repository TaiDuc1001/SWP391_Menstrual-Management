
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportNodeToPDF(node: HTMLElement, filename: string = 'result.pdf') {
    
    const canvas = await html2canvas(node, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

    
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const pdfWidth = pageWidth;
    const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

    let position = 0;
    if (pdfHeight < pageHeight) {
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    } else {
        
        let remainingHeight = pdfHeight;
        let y = 0;
        while (remainingHeight > 0) {
            pdf.addImage(imgData, 'PNG', 0, y ? 0 : position, pdfWidth, pdfHeight);
            remainingHeight -= pageHeight;
            if (remainingHeight > 0) pdf.addPage();
            y += 1;
        }
    }
    pdf.save(filename);
}

