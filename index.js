const express = require('express')
const app = express()
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const scholarshipRoute = require('./routes/scholarships')
const PORT = process.env.PORT || 3000

dotenv.config()

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}, () => {
    console.log("Connected to MongoDB");
})

// middleware
app.use(express.json())

app.use('/api/v1/scholarships', scholarshipRoute)
// tambahin routes kalian di bawah ini => contohnya ada di atas text ini



app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))