import asyncHandler from 'express-async-handler';
import Support from '../../models/support.js'; // Import your Support model

const getTickets = asyncHandler(async (req, res) => {
  try {
    // Fetch all tickets from the database
    const tickets = await Support.find();

    // Send a success response
    res.status(200).json({
      success: true,
      message: 'Tickets retrieved successfully',
      tickets
    });
  } catch (error) {
    // Handle any errors
    console.error('Error retrieving tickets:', error); // Log error for debugging
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve tickets',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default getTickets;
