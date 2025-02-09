import { Request, Response } from "express";
import Certificate from "../models/certificateModel";

// @desc    Create a new certificate
// @route   POST /api/certificates
// @access  Public
export const createCertificate = async (req: Request, res: Response): Promise<void> => {
    const { name, courseTitle, creditHours, dateCompleted } = req.body;

    if (!name || !courseTitle || !creditHours || !dateCompleted) {
        res.status(400).json({
            success: false,
            message: "Required fields are missing.",
        });
        return;
    }

    try {
        const newCertificate = new Certificate({
            name,
            courseTitle,
            creditHours,
            dateCompleted,
        });

        const savedCertificate = await newCertificate.save();
        res.status(201).json(savedCertificate);
    } catch (error) {
        res.status(400).json({
            message: "Error creating certificate.", error
        });
    }
};

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
export const getCertificates = async (req: Request, res: Response): Promise<void> => {
    try {
        const certificates = await Certificate.find(req.query);
        res.status(200).json(certificates);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching certificates.", error
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
            runValidators: true, // Ensures data integrity
        });

        if (!updatedCertificate) {
            res.status(404).json({
                message: "Certificate not found",
            });
            return;
        }

        res.status(200).json(updatedCertificate);
    } catch (error) {
        res.status(400).json({
            message: "Error updating certificate.",
            error,
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
                message: "Certificate not found"
            });
            return;
        }

        res.status(200).json({message:"Certificate deleted successfully"});
    } catch (error) {
        res.status(400).json({
            message: "Error deleting certificate.", error
        });
    }
};