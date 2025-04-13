import { Request, Response } from 'express';
import PDFDocument from 'pdfkit'; 
import cloudinary from '../config/cloudinary';
import axios from 'axios';

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

    const backgroundPath = cloudinary.url(`${certificateType}Certificate`, {
      fetch_format: 'auto',
      quality: 'auto',
    });
    
    const backgroundImage = await axios.get(backgroundPath, { responseType: 'arraybuffer' }); 
    doc.image(backgroundImage.data, 0, 0, { width: doc.page.width, height: doc.page.height }); 
    
    if (certificateType === "completion") {
      doc.font('Helvetica-Bold').fillColor('#071860');
      doc.fontSize(22).text(participantName, 160, 275, { width: 520, height: 40, align: 'center' }); 
      doc.fontSize(22).text(courseInfo, 110, 355, { width: 640, height: 40, align: 'center' });
      doc.fontSize(16).text(completionDate, 330, 405, { width: 180, height: 30, align: 'center' }); 
    } else {
      doc.font('Times-Bold').fillColor('black');
      doc.fontSize(20).text(participantName, 160, 225, { width: 520, height: 40, align: 'center' }); 
      doc.fontSize(16).text(courseInfo, 100, 317.5, { width: 640, height: 40, align: 'center' });
      doc.fontSize(16).text(completionDate, 90, 415, { width: 160, height: 40, align: 'center' }); 
    }

    doc.end(); 
  } catch (error: any) {
		res.status(500).json({
			success: false,
			message: error.message,
		});
  }
}