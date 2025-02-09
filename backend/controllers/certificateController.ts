import { Request, Response } from "express";
import Certificate from "../models/certificateModel";

// @desc    Create a new certificate
// @route   POST /api/certificates
// @access  Public
export const createCertificate = async (req: Request, res: Response): Promise<void> => {
    const { name, courseTitle, creditHours, dateCompleted } = req.body;

    try {
        const newCertificate = new Certificate({
            name,
            courseTitle,
            creditHours,
            dateCompleted,
        });

        const savedCertificate = await newCertificate.save();
        res.status(201).json({
            success: true,
            data: savedCertificate,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error creating certificate.",
        });
    }
};

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
export const getCertificates = async (req: Request, res: Response): Promise<void> => {
    try {
        const certificates = await Certificate.find();
        res.status(200).json({
            success: true,
            data: certificates,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching certificates.",
        });
    }
};

// @desc    Update a certificate
// @route   PUT /api/certificates/:id
// @access  Public
export const updateCertificate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedCertificate = await Certificate.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!updatedCertificate) {
            res.status(404).json({
                success: false,
                message: "Certificate not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            data: updatedCertificate,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error updating certificate.",
        });
    }
};

// @desc    Delete a certificate
// @route   DELETE /api/certificates/:id
// @access  Public
export const deleteCertificate = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const deletedCertificate = await Certificate.findByIdAndDelete(id);

        if (!deletedCertificate) {
            res.status(404).json({
                success: false,
                message: "Certificate not found.",
            });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Certificate deleted successfully.",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error deleting certificate.",
        });
    }
}; 