import axios from 'axios'

export default class Search {
	constructor(private toSearch: string) {}
	async getResults() {
		const wikiDatas = await axios.get(`https://fr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${this.toSearch}&format=json`)
		const datas = wikiDatas.data
		const results = wikiDatas.data.query.search.map((el: { [key: string]: string }) => {
			const { title, pageid } = el
			return { title, pageid }
		})
		const hits = wikiDatas.data.query.searchinfo?.totalhits
		const suggestion = wikiDatas.data.query.searchinfo.suggestion
		return { hits, suggestion, results }
	}
}
