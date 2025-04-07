import { Request, Response } from 'express';
import PDFDocument from 'pdfkit'; 

export const generateCertificate = async (
  req: Request, 
  res: Response
) : Promise<void> => {
  try {
    const { certificateType, participantName, courseInfo, completionDate } = req.body; 

    if (certificateType !== "completion" && certificateType !== "attendance") {
      res.status(400).json({
        success: false, 
        message: "Invalid certificate type, must be either 'completion' or 'attendance'."
      });
      return; 
    }

    const doc = new PDFDocument({
      layout: 'landscape',
      size: 'A4',
      font: 'Times-Roman'
    }); 
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=certificate.pdf');

    doc.pipe(res);

    const backgroundPath = `./uploads/${certificateType}Certificate.png`;
    doc.image(backgroundPath, 0, 0, { width: doc.page.width, height: doc.page.height }); 

    doc.fontSize(20).fillColor('black'); 

    if (certificateType === "completion") {
      doc.text(participantName, 160, 280, { width: 520, height: 40, align: 'center' }); 
      doc.text(courseInfo, 110, 360, { width: 640, height: 40, align: 'center' });
      doc.text(completionDate, 330, 405, { width: 180, height: 30, align: 'center' }); 
    } else {
      doc.text(participantName, 160, 225, { width: 520, height: 40, align: 'center' }); 
      doc.text(courseInfo, 100, 315, { width: 640, height: 40, align: 'center' });
      doc.text(completionDate, 90, 415, { width: 160, height: 40, align: 'center' }); 
    }

    doc.end(); 
  } catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
  }
}