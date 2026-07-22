import Appliance from '../models/Appliance.js';

// @desc    Get all appliances for logged in user
// @route   GET /api/v1/appliances
// @access  Private
export const getAppliances = async (req, res) => {
  try {
    const appliances = await Appliance.find({ userId: req.user._id });
    res.status(200).json(appliances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new appliance
// @route   POST /api/v1/appliances
// @access  Private
export const addAppliance = async (req, res) => {
  try {
    const { name, category, ratedWattage, isSmartPlugConnected } = req.body;

    const appliance = new Appliance({
      userId: req.user._id,
      name,
      category,
      ratedWattage,
      isSmartPlugConnected,
    });

    const createdAppliance = await appliance.save();
    res.status(201).json(createdAppliance);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update appliance status or details
// @route   PUT /api/v1/appliances/:id
// @access  Private
export const updateAppliance = async (req, res) => {
  try {
    const appliance = await Appliance.findById(req.params.id);

    if (!appliance) {
      return res.status(404).json({ message: 'Appliance not found' });
    }

    // Ensure user owns this appliance
    if (appliance.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to update this appliance' });
    }

    appliance.name = req.body.name || appliance.name;
    appliance.category = req.body.category || appliance.category;
    appliance.ratedWattage = req.body.ratedWattage || appliance.ratedWattage;
    appliance.status = req.body.status || appliance.status;
    appliance.isSmartPlugConnected =
      req.body.isSmartPlugConnected !== undefined
        ? req.body.isSmartPlugConnected
        : appliance.isSmartPlugConnected;

    const updatedAppliance = await appliance.save();
    res.status(200).json(updatedAppliance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an appliance
// @route   DELETE /api/v1/appliances/:id
// @access  Private
export const deleteAppliance = async (req, res) => {
  try {
    const appliance = await Appliance.findById(req.params.id);

    if (!appliance) {
      return res.status(404).json({ message: 'Appliance not found' });
    }

    // Ensure user owns this appliance
    if (appliance.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to delete this appliance' });
    }

    await appliance.deleteOne();
    res.status(200).json({ message: 'Appliance removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};