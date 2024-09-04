import asyncHandler from 'express-async-handler';
import Support from '../../models/support.js'; // Import your Support model

const getTicketByNumber = asyncHandler(async (req, res) => {
  const { ticketNumber } = req.body; // Extract the ticket number from the request body

  try {
    if (!ticketNumber) {
      return res.status(400).json({
        success: false,
        message: 'Ticket number is required'
      });
    }

    // Fetch the ticket by its number (make sure the ticketNumber matches the format in the database)
    const ticket = await Support.findOne({ ticketId: ticketNumber });

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
    console.error('Error fetching ticket by number:', error); // Log error for server-side debugging
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default getTicketByNumber;
