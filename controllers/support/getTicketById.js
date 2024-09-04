import asyncHandler from 'express-async-handler';
import Support from '../../models/support.js'; // Import your Support model

const getTicketById = asyncHandler(async (req, res) => {
  const { id } = req.params; // Extract the ID from the request parameters

  try {
    // Fetch the ticket by ID
    const ticket = await Support.findById(id);

    if (!ticket) {
      // If no ticket is found, send a 404 response
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    // If ticket is found, send a success response with the ticket data
    res.status(200).json({
      success: true,
      ticket
    });
  } catch (error) {
    // Handle any errors that occur during the database operation
    console.error('Error fetching ticket:', error); // Log error for server-side debugging
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default getTicketById;
