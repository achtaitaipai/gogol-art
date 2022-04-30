import express from 'express'
import 'dotenv/config'
import path from 'path'
import cors from 'cors'

import InfosController from './controllers/infos.controller'
import SearchRouter from './controllers/search.controller'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static(path.resolve(__dirname, './client')))

app.get('/', (req, res) => {
	res.sendFile(path.resolve(__dirname, './client', 'index.html'))
})

app.get('/slide', (req, res) => {
	res.sendFile(path.resolve(__dirname, './client', '/slide/slide.html'))
})

app.use('/api/search', SearchRouter)
app.use('/api/infos', InfosController)

app.listen(process.env.PORT || 4000, () => console.log(`http://loacalhost:${process.env.PORT || 4000}`))
