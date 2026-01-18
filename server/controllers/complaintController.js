import Complaint from '../models/Complaint.js';
import cloudinary from '../config/cloudinary.js';

export const createComplaint = async (req, res) => {
  try {
    const { city, state, address, image } = req.body;

    // Validate required fields
    if (!city || !state || !address) {
      return res.status(400).json({ message: 'City, state, and address are required.' });
    }

    let imageUrl;
    if (image) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image);
        imageUrl = uploadResponse.secure_url;
      } catch (err) {
        return res.status(500).json({ message: 'Image upload to Cloudinary failed.', error: err.message });
      }
    }

    const newComplaint = await Complaint.create({
      user: req.user._id,
      city,
      state,
      address,
      imageUrl
    });

    res.status(201).json({
      message: 'Complaint submitted successfully.',
      complaint: newComplaint
    });

  } catch (error) {
    console.error('Error while creating complaint:', error);
    res.status(500).json({ message: 'Server error while submitting complaint.' });
  }
};


export const getAllComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().populate('user', 'email');
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching complaints:', error);
    res.status(500).json({ message: 'Failed to fetch complaints.' });
  }
};

export const getMyComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ user: req.user._id });
    res.status(200).json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ message: 'Failed to fetch your complaints.' });
  }
};

export const updateComplaintStatus = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const { status } = req.body;

    if (!['New', 'In Progress', 'Resolved'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const updatedComplaint = await Complaint.findByIdAndUpdate(
      complaintId,
      { status },
      { new: true }
    );

    if (!updatedComplaint) {
      return res.status(404).json({ message: 'Complaint not found.' });
    }

    res.status(200).json({
      message: 'Complaint status updated.',
      complaint: updatedComplaint
    });
  } catch (error) {
    console.error('Error updating complaint status:', error);
    res.status(500).json({ message: 'Failed to update status.' });
  }
};