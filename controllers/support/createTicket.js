import asyncHandler from 'express-async-handler';
import Support from '../../models/support.js';

// Create a new ticket
const createTicket = asyncHandler(async (req, res) => {
  const user = req.user?.userId;

  // Extract ticket data from the request body
  const {
    name,
    email,
    subject,
    description,
    status,
    priority,
    type,
    resolution,
    screenshot
  } = req.body;

  // Validate input data
  if (!name || !email || !subject || !description) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }



  try {
    const letters = generateRandomLetters(3);  // e.g., 'ZXQ'
    const threeDigitNumber = generateRandomNumber(3); // e.g., '550'
    const fiveDigitNumber = generateRandomNumber(5); // e.g., '91738'
    
    const ticketId = `#${letters}-${threeDigitNumber}-${fiveDigitNumber}`;

    // Create a new ticket instance
    const newTicket = new Support({
      ticketId,
      user,
      name,
      email,
      subject,
      description,
      status,
      priority,
      type,
      resolution,
      screenshot
    });

    // Save the new ticket to the database
    const savedTicket = await newTicket.save();

    // Send a success response
    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      ticket: savedTicket
    });
  } catch (error) {
    // Handle any errors
    console.error('Error creating ticket:', error); // Log error for server-side debugging
    res.status(500).json({
      success: false,
      message: 'Failed to create ticket',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

function generateRandomLetters(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function generateRandomNumber(length) {
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default createTicket;
