import axios from 'axios'
import '../style/pages/slide.css'
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
const loader = document.getElementById('loader-js')
const fullScreenBtn = document.getElementById('fullscreenBtn-js')

const inputs = settingsForm?.querySelectorAll<HTMLInputElement>('input')

let images: ImageData[]
let currentImg = 0

;(async function () {
	const queryString = window.location.search
	const url = new URLSearchParams(queryString)
	const id = url.get('id')
	// if (id) getInfos(id)
	const toSearch = url.get('search')
	if (id || toSearch) getInfos({ id, toSearch })
	// if (toSearch) getImages(toSearch)
})()

async function getInfos({ id, toSearch }: { id: string | null; toSearch: string | null }) {
	const url = id ? `/api/infos/byid/${id}` : `/api/infos/bytitle/${toSearch}`
	const datas = await axios.get(url)
	const infos = datas.data
	images = infos.images
	const imgUrl = images[currentImg]?.source
	if (slide && imgUrl) {
		if (loader) loader.className = 'lds-ellipsis-inactive'
		slide.setAttribute('img', imgUrl)
		for (const label of infosLabels) {
			if (infos[label]) {
				slide.setAttribute(label, infos[label])
				const input = document.querySelector<HTMLInputElement>('#' + label)
				if (input) input.value = infos[label]
			}
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

fullScreenBtn?.addEventListener('click', e => {
	e.preventDefault()
	slide.requestFullscreen()
})

inputs?.forEach(input => {
	input.addEventListener('input', e => {
		const el = e.target as HTMLInputElement
		slide.setAttribute(el.id, el.value)
		slide.refresh()
	})
})

customElements.define('slide-view', Slide, { extends: 'canvas' })
