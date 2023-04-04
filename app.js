const express = require('express');
const app = express();
const cors = require('cors');
const agencyClientRoutes = require('./routes/agencyClientRoutes');
const errorHandler = require('./utils/errorHandler');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/agency-clients', agencyClientRoutes);

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
