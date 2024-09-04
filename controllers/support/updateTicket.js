import asyncHandler from 'express-async-handler';
import Support from '../../models/support.js'; // Import your Support model

const updateTicket = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract the ticket ID from the request parameters
  const { resolution } = req.body; // Extract the resolution from the request body

  try {
    // Validate that resolution is provided
    if (!resolution) {
      return res.status(400).json({
        success: false,
        message: 'Resolution is required'
      });
    }

    // Find the ticket by ID and update the resolution field
    const updatedTicket = await Support.findByIdAndUpdate(
      id, 
      { resolution }, 
      { new: true, runValidators: true } // Return the updated ticket and apply validators
    );

    if (!updatedTicket) {
      // If no ticket is found, send a 404 response
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // Send a success response with the updated ticket data
    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      ticket: updatedTicket
    });
  } catch (error) {
    // Handle any errors that occur during the update operation
    console.error('Error updating ticket:', error); // Log error for server-side debugging
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default updateTicket;
