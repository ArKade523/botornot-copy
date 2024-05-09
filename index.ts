import express from 'express'
import { createServer } from 'http'
import { engine } from 'express-handlebars'
import fs from 'fs'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import { setupWebSockets } from './backend/controllers/roomState_websockets'
dotenv.config()

const DEBUG = process.env.NODE_ENV !== 'production'
const MANIFEST: Record<string, any> = DEBUG
    ? {}
    : JSON.parse(fs.readFileSync('dist/static/.vite/manifest.json').toString())

const app = express()
const httpServer = createServer(app)
setupWebSockets(httpServer)

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', './views')
app.use(bodyParser.json())

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    if (req.url.includes('undefined')) {
        console.log('Undefined in URL: Is your .env set up?')
    }

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
        jsBundle: DEBUG ? '' : MANIFEST['src/main.tsx']['file'],
        cssBundle: DEBUG ? '' : MANIFEST['src/main.tsx']['css'][0],
        assetUrl: process.env.ASSET_URL,
        layout: false
    })
})

httpServer.listen(process.env.PORT || 3000, () => {
    console.log(`Listening on port ${process.env.PORT || 3000}...`)
})
