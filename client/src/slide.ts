import axios from 'axios'
import './slide.css'
import Slide from './components/slideCanvas'

interface ImageData {
	// title:string, source: thumbnail, width, height: ;
	title: string
	source: string
	width: string
	height: string
}

const infosLabels = ['artiste', 'titre', 'date', 'medium', 'dimensions', 'localisation']

const slide = document.getElementById('slide-js') as Slide
const exportBtn = document.getElementById('export-js')
const prevBtn = document.getElementById('prevBtn-js')
const nextBtn = document.getElementById('nextBtn-js')
const settingsForm = document.querySelector('body > main > form')

const inputs = settingsForm?.querySelectorAll<HTMLInputElement>('input')

let images: ImageData[]
let currentImg = 0

;(async function () {
	const queryString = window.location.search
	const url = new URLSearchParams(queryString)
	const toSearch = url.get('search')
	if (toSearch) getImages(toSearch)
})()

async function getImages(id: string) {
	const datas = await axios.get(`/api/infos/byid/${id}`)
	const infos = datas.data
	images = infos.images
	const imgUrl = images[currentImg].source
	if (slide && imgUrl) {
		slide.setAttribute('img', imgUrl)
		for (const label of infosLabels) {
			slide.setAttribute(label, infos[label])
			const input = document.querySelector<HTMLInputElement>('#' + label)
			if (input) input.value = infos[label]
		}
		slide.refresh()
	}
}

exportBtn?.addEventListener('click', e => {
	e.preventDefault()
	slide.download()
})

nextBtn?.addEventListener('click', _ => {
	currentImg = (currentImg + 1) % images.length
	const imgUrl = images[currentImg].source
	slide.setAttribute('img', imgUrl)
	slide.refresh()
})

prevBtn?.addEventListener('click', _ => {
	currentImg = currentImg > 0 ? currentImg - 1 : images.length - 1
	const imgUrl = images[currentImg].source
	slide.setAttribute('img', imgUrl)
	slide.refresh()
})

inputs?.forEach(input => {
	input.addEventListener('input', e => {
		const el = e.target as HTMLInputElement
		console.log(el.value, el.id)
		slide.setAttribute(el.id, el.value)
		slide.refresh()
	})
})

customElements.define('slide-view', Slide, { extends: 'canvas' })
