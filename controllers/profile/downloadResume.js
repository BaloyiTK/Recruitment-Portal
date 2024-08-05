import asyncHandler from 'express-async-handler';
import Profile from '../../models/profile.js';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types'; // To handle MIME types

const downloadResume = asyncHandler(async (req, res) => {
    try {
        const { userId } = req.params;
        // Find the user's profile by userId
        const profile = await Profile.findOne({ user: userId });

        if (!profile || !profile.resume) {
            return res.status(404).json({ message: 'Resume not found' });
        }

        // Get the file path from the profile
        const filePath = profile.resume;

        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ message: 'File not found' });
        }

        // Extract filename from the file path
        const fileName = path.basename(filePath);

        // Determine the MIME type of the file
        const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    
        // Set the appropriate content type for the file
        res.setHeader('Content-Type', mimeType);
        res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

        // Stream the file to the response
        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);
      
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default downloadResume;
