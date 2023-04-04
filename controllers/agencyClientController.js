const Agency = require('../models/agency');
const Client = require('../models/client');

const createAgencyClient = async (req, res, next) => {
  try {
    const { name, address1, address2, state, city, phoneNumber, clients } = req.body;

    const agency = new Agency({
      name,
      address1,
      address2,
      state,
      city,
      phoneNumber,
    });

    const createdAgency = await agency.save();

    if (clients && clients.length > 0) {
      const clientDocs = clients.map((client) => new Client({ ...client, agencyId: createdAgency._id }));
      const createdClients = await Client.insertMany(clientDocs);

      createdAgency.clients = createdClients.map((client) => client._id);
      await createdAgency.save();
    }

    res.status(201).json(createdAgency);
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    const client = await Client.findByIdAndUpdate(
      clientId,
      {
        $set: { ...req.body },
      },
      { new: true }
    );

    if (!client) {
      const error = new Error(`Client with ID ${clientId} not found`);
      error.statusCode = 404;
      throw error;
    }

    res.json(client);
  } catch (error) {
    next(error);
  }
};

const getTopClients = async (req, res, next) => {
  try {
    const pipeline = [
      {
        $lookup: {
          from: 'clients',
          localField: '_id',
          foreignField: 'agencyId',
          as: 'clients',
        },
      },
      {
        $addFields: {
          totalBill: { $sum: '$clients.totalBill' },
        },
      },
      {
        $unwind: '$clients',
      },
      {
        $sort: { 'clients.totalBill': -1 },
      },
      {
        $limit: 1,
      },
      {
        $project: {
          _id: 0,
          agencyName: '$name',
          clientName: '$clients.name',
          totalBill: '$clients.totalBill',
        },
      },
    ];

    const result = await Agency.aggregate(pipeline);

    res.json(result[0]);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAgencyClient,
  updateClient,
  getTopClients,
};
