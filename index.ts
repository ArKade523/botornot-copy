import express from 'express'
import { createServer } from 'http'
import { engine } from 'express-handlebars'
import fs from 'fs'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { Server as SocketIOServer } from 'socket.io'
import setupWebSocket from './backend/websocket'
dotenv.config()

const DEBUG = process.env.NODE_ENV !== 'production'
const MANIFEST: Record<string, any> = DEBUG
    ? {}
    : JSON.parse(fs.readFileSync('dist/static/.vite/manifest.json').toString())

const app = express()
const httpServer = createServer(app)
const io = setupWebSocket(httpServer)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(bodyParser.json())

app.use((req, res, next) => {
    // console.log(`${req.method} ${req.url}`)
    next()
})

if (!DEBUG) {
    app.use(express.static('dist/static'))
} else {
    app.use((req, res, next) => {
        if (req.url.includes('.')) {
            res.redirect(`${process.env.ASSET_URL}/${req.url}`)
        } else {
            next()
        }
    })
}

console.log(MANIFEST)

app.get('/', (req, res) => {
    res.render('index', {
        debug: DEBUG,
        jsBundle: DEBUG ? '' : MANIFEST['src/main.jsx']['file'],
        cssBundle: DEBUG ? '' : MANIFEST['src/main.jsx']['css'][0],
        assetUrl: process.env.ASSET_URL,
        layout: false
    })
})

httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}...`)
})
