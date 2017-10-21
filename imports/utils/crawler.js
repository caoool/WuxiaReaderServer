import fs from 'fs'
import fetch from 'isomorphic-fetch'
import Promise from 'bluebird'
import cheerio from 'cheerio'
import Epub from 'epub-gen'
import Books from '../api/books/books'

const dir = '/epub-repo/'

function dumpError(err) {
  if (typeof err === 'object') {
    if (err.message) {
      console.log('\nMessage: ' + err.message)
    }
    if (err.stack) {
      console.log('\nStacktrace:')
      console.log('====================')
      console.log(err.stack)
    }
  } else {
    console.log('dumpError :: argument is not an object')
  }
}

async function parseChapter(url) {
  try {
    if (!url) { return null }

    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    const raw_html = $('div[itemprop=articleBody]').html()
    if (!raw_html) { return null }
    let raw = cheerio.load(raw_html)
    raw('p').has('a, img').remove()
    raw('a').remove()
    return raw.html()
  } catch(error) {
    dumpError(error)
  }
}

async function generateEpub(url, title, category) {
  try {
    if (!url) { return null }

    const response = await fetch(url)
    const html = await response.text()
    const $ = cheerio.load(html)

    // parse online
    console.log(`Start ${title}`)
    let option = { title }
    option['cover'] = $('main > article img').first().attr('src')
    option['author'] = 'wuxiaworld'
    option['content'] = []
    const chapters_raw = $('article a[href*="hapter"]')
    const chapters_arr = Object.keys(chapters_raw).map(key => chapters_raw[key])
    await Promise.mapSeries(chapters_arr, async (elem, i) => {
      let chapterTitle = $(elem).text()
      if ($(elem).attr("title")) {
        chapterTitle = `(${$(elem).attr('title')}) ${chapterTitle}`
      }
      // filter duplicate or blank chapter links
      if (/[a-z]/i.test(chapterTitle)) {
        const data = await parseChapter($(elem).attr('href'))
        if (data) {
          option['content'].push({ title, data })
          console.log(`crawled ${title} >> ${chapterTitle}`)
        }
      }
    })
    const description = $('article p:nth-of-type(2)').text()
    const chapterCount = option['content'].length
    const lastChapter = option['content'][chapterCount-1].title

    // generate epub
    await new Epub(option, `${dir+title}.epub`).promise.then(() => {
        console.log(`Ebook ${title} Generated Successfully!`)
    }, (err) => {
        console.error("Failed to generate Ebook because of ", err)
    })

    // save to colleciton
    Books.addFile(`${dir+title}.epub`, {
      fileName: `${title}.epub`,
      meta: {
        category,
        description,
        chapterCount,
        lastChapter,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })
  } catch(error) {
    dumpError(error)
  }
}

export default async function crawl() {
  try {
    if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }

    const response = await fetch('http://www.wuxiaworld.com')
    const html = await response.text()
    const $ = cheerio.load(html)

    // generateEpub('http://www.wuxiaworld.com/col-index/', 'Child of Light (光之子)', 'Completed')
    const books_raw = $('#menu-home-menu').children()
    const books_arr = Object.keys(books_raw).map(key => books_raw[key])
    await Promise.mapSeries(books_arr, async (elem, i) => {
      if (![0, 5, 6, 7].includes(i)) {  // exclude 'home', 'resources', 'forums', 'wiki'
        const category = $(elem).children('a').text()
        const index_raw = $(elem).children('ul').first().children()
        const index_arr = Object.keys(index_raw).map(key => index_raw[key])
        await Promise.mapSeries(index_arr, async (e2, i2) => {
          const url = $(e2).children('a').attr('href')
          const title = $(e2).children('a').text()
          await generateEpub(url, title, category)
        })
      }
    })
    console.log(```
    ----------------------------------------
    ------------------YEAH------------------
    ----------------------------------------
    ALL JOB FINISHED! AMAZING!
    ----------------------------------------
    ------------------WOAH------------------
    ----------------------------------------
    ```)
  } catch(error) {
    dumpError(error)
  }
}


