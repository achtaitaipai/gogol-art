import axios from 'axios'
import '../style/pages/index.css'

interface Result {
	title: string
	pageid: number
}

//HTMLelements
const searchForm = document.getElementById('searchForm-js')
const searchInput = document.getElementById('searchInput-js') as HTMLInputElement
const resultsContainer = document.getElementById('results-js') as HTMLUListElement
const suggestionContainer = document.getElementById('suggestion-js') as HTMLParagraphElement
const loader = document.getElementById('loader-js')
const withoutWiki = document.querySelector<HTMLLinkElement>('#withoutWiki-js')

//check url
;(function () {
	const queryString = window.location.search
	const url = new URLSearchParams(queryString)
	const toSearch = url.get('search')
	if (toSearch) search(toSearch)
})()

//events
searchForm?.addEventListener('submit', async e => {
	e.preventDefault()
	const toSearch = searchInput.value
	search(toSearch)
})

async function search(toSearch: string) {
	if (loader) {
		loader.className = 'lds-ellipsis'
	}
	resultsContainer.innerHTML = ''
	const datas = await axios.get(`/api/search/${toSearch}`)
	if (datas.status === 200) {
		if (datas.data.suggestion) {
			suggestionContainer.innerHTML = `Wikipédia vour suggère d'essayer avec : `
			const a = document.createElement('a')
			a.textContent = datas.data.suggestion
			a.setAttribute('href', `/?search=${datas.data.suggestion}`)
			suggestionContainer.appendChild(a)
		} else {
			suggestionContainer.innerHTML = ''
		}
		const results = datas.data.results as Result[]
		resultsContainer.innerHTML = ''
		results.forEach(el => {
			const li = document.createElement('li')
			li.classList.add('results_itm')
			const a = document.createElement('a')
			a.classList.add('results_link')
			a.setAttribute('href', `/slide/index.html?id=${el.pageid}`)
			a.textContent = el.title
			li.appendChild(a)
			resultsContainer?.appendChild(li)
		})
		if (withoutWiki) {
			withoutWiki.className = 'withoutWiki-active'
			withoutWiki.setAttribute('href', `/slide/index.html?search=${toSearch}`)
		}
	}
	if (datas && loader) loader.className = 'lds-ellipsis-inactive'
}
