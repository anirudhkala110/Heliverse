const express = require('express');
const fs = require('fs');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const UserModal = require('./Modals/AddUserModal');
const cors = require('cors')
const doenv = require('dotenv')

doenv.config()
const app = express();
const port = 8096 || process.env.PORT;

mongoose.connect('mongodb+srv://anirudhkala:gMuwTIoI3ojlp8R6@cluster0.pkh7czu.mongodb.net/test?retryWrites=true&w=majority')

app.use(bodyParser.json());
app.use(cors(
    {
        origin: ["https://heliverse-1ugi.vercel.app/"],
        methods: ["POST", "GET", "PUT", "DELETE"],
        credentials: true
    }
))

app.get('/', (req, res) => {
    console.log("Connected")
    res.json('Connected')
})


// Read and store data from data.json
async function readAndStoreData() {
    // console.log("Entering Data")
    try {
        // Read data from data.json
        const rawData = fs.readFileSync('./data.json');
        const jsonData = JSON.parse(rawData);

        // Iterate through each data entry
        for (const entry of jsonData) {
            // Check if a document with the same ID exists
            const existingData = await UserModal.findOne({ id: entry.id });

            if (existingData) {
                // Update existing document with non-empty fields
                for (const key of Object.keys(entry)) {
                    if (entry[key] !== null && entry[key] !== undefined && entry[key] !== '') {
                        existingData[key] = entry[key];
                    }
                }

                // Save the updated data
                await existingData.save();
                // console.log(`Data with ID ${entry.id} updated successfully.`);
            } else {
                // Create a new instance of the model and save it to MongoDB
                const newData = new UserModal(entry);
                await newData.save();
                // console.log(`New data with ID ${entry.id} saved successfully.`);
            }
        }

        console.log('All data processed successfully.');
    } catch (error) {
        console.error('Error:', error);
    }
}

// Endpoint to add new data
app.post('/api/users', async (req, res) => {
    const { first_name, last_name, email, gender, avatar, domain, availablility } = req.body;
    const available = parseInt(availablility);

    try {
        // Find the total number of entries in the UserModal
        const totalEntries = await UserModal.countDocuments();
        // Set the new ID as totalEntries + 1
        const newId = totalEntries + 1;
        const newData = new UserModal({ id: newId, first_name, last_name, email, gender, avatar, domain, available });
        await newData.save();

        return res.json({ msg: "Data Entered Successfully", msg_type: "good" });
    } catch (error) {
        console.error('Error:', error);
        return res.json({ msg: "Error Occurred", msg_type: "error", error: error });
    }
});

// Endpoint to get all data
app.get('/api/users', async (req, res) => {
    try {
        const allData = await UserModal.find();
        res.json(allData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/creating-team', async (req, res) => {
    // console.log('Reached Here')
    try {
        const allData = await UserModal.find({ available: true }).sort({ domain: -1 });
        res.json(allData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// Endpoint to get specific data
app.get('/api/users/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const allData = await UserModal.findOne({ id });
        res.json(allData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to update data by ID
app.put('/api/users/:id', async (req, res) => {
    const id = req.params.id;
    const newData = req.body;

    try {
        const existingData = await UserModal.findOne({ id });

        if (existingData) {
            for (const key of Object.keys(newData)) {
                if (newData[key] !== null && newData[key] !== undefined && newData[key] !== '') {
                    existingData[key] = newData[key];
                }
            }

            await existingData.save();
            res.json({ message: `Data with ID ${id} updated successfully.` });
        } else {
            res.status(404).json({ error: `Data with ID ${id} not found.` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Endpoint to delete data by ID
app.delete('/api/users/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const result = await UserModal.deleteOne({ id });

        if (result.deletedCount > 0) {
            return res.json({ msg: `Data with ID ${id} deleted successfully.`, msg_type: 'good' });
        } else {
            res.status(404).json({ error: `Data with ID ${id} not found.` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Filter 

app.get('/api/domain', async (req, res) => {
    try {
        const domains = await UserModal.distinct('domain');
        res.json({ domains });
    } catch (error) {
        console.error('Error fetching domains:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/gender', async (req, res) => {
    try {
        const genders = await UserModal.distinct('gender');
        res.json({ genders });
    } catch (error) {
        console.error('Error fetching domains:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.get('/api/available', async (req, res) => {
    try {
        const availables = await UserModal.distinct('available');
        res.json({ availables });
    } catch (error) {
        console.error('Error fetching domains:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/filtered-data', async (req, res) => {
    console.log("Reached");

    const Finalavailable = req.query.Finalavailable;
    const Finaldomain = req.query.Finaldomain;
    const Finalgender = req.query.Finalgender;

    console.log(Finalavailable, Finaldomain, Finalgender);

    try {
        let query = {}; // The initial query object

        // Check if 'domain' filter is provided
        if (Finaldomain) {
            query.domain = Finaldomain;
        }

        // Check if 'gender' filter is provided
        if (Finalgender) {
            query.gender = Finalgender;
        }

        // Check if 'availability' filter is provided
        if (Finalavailable !== undefined) {
            query.available = Finalavailable === 'true';
        }

        console.log(query);
        const filteredUsers = await UserModal.find(query);

        res.json(filteredUsers);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Filter Ends

// Creating the Team
const teamSchema = new mongoose.Schema({
    name: { type: String, required: true },
    // id: { type: String, required: true },
    uniqueKey: { type: String, required: true, unique: true },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

const TeamModel = mongoose.model('Team', teamSchema);

app.get('/api/teams', async (req, res) => {
    try {
        const existingTeam = await TeamModel.find();
        return res.json(existingTeam)
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Team with the same users already exists.' });
        }

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
app.post('/api/teams', async (req, res) => {
    const { selectedUsers, teamName } = req.body;
    console.log(selectedUsers)
    try {
        // Validate selected users
        // const userIds = selectedUsers.map(user => user._id.toString());
        var keyID = ''
        for (let index = 0; index < selectedUsers.length; index++) {
            keyID += selectedUsers[index] + ','
        }
        const entryKey = keyID

        // Check if a team with the same composite key already exists
        const existingTeam = await TeamModel.findOne({ uniqueKey: entryKey });

        if (existingTeam) {
            return res.status(400).json({ error: 'Team with the same users already exists.' });
        }
        // console.log(teamName)
        // Create a new team and associate selected users
        const newTeam = new TeamModel({
            name: teamName, // Replace with the desired team name
            uniqueKey: entryKey, // Use the string of user IDs as the uniqueKey
            users: selectedUsers, // Assuming the User model has an '_id' field
        });

        await newTeam.save();

        res.json({ team: newTeam, message: 'Team created successfully.' });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ error: 'Team with the same users already exists.' });
        }

        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/team-detail/:id', async (req, res) => {
    const id = req.params.id;

    // Validate if the provided id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid team ID' });
    }

    try {
        const teamData = await TeamModel.findOne({ _id: id });

        if (!teamData) {
            return res.status(404).json({ error: 'Team not found' });
        }

        res.json(teamData);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/api/details/:members', async (req, res) => {
    const { members } = req.params;
    const membersArray = members.split(',');
    const membersSize = membersArray.length;

    var UserData = [];

    // Validate if members is an array of valid ObjectIds
    if (membersSize) {
        for (var i = 0; i < membersSize; i++) {
            if (!mongoose.Types.ObjectId.isValid(membersArray[i])) {
                return res.status(400).json({ error: 'Invalid member ID' });
            } else {
                try {
                    const userData = await UserModal.findOne({ _id: membersArray[i] });
                    if (!userData) {
                        return res.status(404).json({ error: 'User not found' });
                    }

                    UserData.push(userData); // Use push to add elements to the array
                } catch (error) {
                    console.error('Error:', error);
                    res.status(500).json({ error: 'Internal Server Error' });
                }
            }
        }
        return res.json({ msg: "Users Found", msg_type: "good", UserData });
    } else {
        return res.json({ msg: "Data is not Available", msg_type: "error" })
    }
});

// Start the server and read data from data.json
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    readAndStoreData();
});
