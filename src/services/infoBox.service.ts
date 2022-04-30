import axios from 'axios'
import { image_search } from 'duckduckgo-images-api'

interface InfoBox {
	titre: string
	artiste: string
	dimensions: string
	date: string
	medium: string
	localisation: string
}

interface Image {
	titre?: string
	source: string
	width: number
	height: number
}

export default class SlideDatas {
	constructor() {}

	async getImgWiki(id: string) {
		try {
			const wikiDatas = await axios.get(
				`https://fr.wikipedia.org/w/api.php?action=query&prop=pageimages|pageterms&piprop=thumbnail&pithumbsize=1000&&format=json&pageids=${id}`
			)
			return wikiDatas.data.query.pages[id].thumbnail
		} catch (error) {
			return { msg: "pb d'image", error }
		}
	}

	async getImgs(toSearch: string) {
		try {
			const imgs = await image_search({ query: toSearch })
			return imgs.map(img => {
				const { title, image, width, height, thumbnail } = img
				return { title, source: thumbnail, width, height }
			})
		} catch (error) {}
	}

	async getInfoBox(id: string) {
		try {
			const wikiDatas = await axios.get(`https://fr.wikipedia.org/w/api.php?action=query&prop=revisions&rvprop=content&format=json&pageids=${id}&rvsection=0`)
			let infos = wikiDatas?.data?.query?.pages[id]?.revisions[0]['*']?.match(/\{Infobox((.|\s)*?)\}/)[0]
			if (!infos) return { msg: 'pas de box' }
			//efface les doubles espaces
			infos = infos.replace(/\s+/gm, ' ')
			//efface les '[' et ']'
			infos = infos.replace(/\[|\]/g, '')
			const datas = infos.split('|').map((l: string) => l.split('='))
			const hauteur = this.parseInfosBox('hauteur', datas)
			const largeur = this.parseInfosBox('largeur', datas)
			const technique = this.parseInfosBox('technique', datas)
			const unity = this.parseInfosBox('unité', datas)
			let retour: InfoBox = {
				titre: this.parseInfosBox('titre', datas),
				artiste: this.parseInfosBox('artiste', datas),
				dimensions: (largeur !== '' && hauteur != '' ? largeur + ' x ' + hauteur + ' ' + unity : '').trim(),
				date: this.parseInfosBox('année', datas),
				medium: technique !== '' ? technique : this.parseInfosBox('type', datas),
				localisation: (this.parseInfosBox('musée', datas) + ' ' + this.parseInfosBox('ville', datas) + ' ' + this.parseInfosBox('france', datas)).trim(),
			}

			return { msg: 'ok', body: retour }
		} catch (error) {
			return { msg: "pb d'infobox", error }
		}
	}

	private parseInfosBox(name: string, box: string[][]) {
		const reg = new RegExp(name, 'i')
		const line = box.find(l => reg.test(l[0]))
		if (line && /[a-zA-Z0-9]/.test(line[1])) return (line[1] || '').trim()
		return ''
	}
}
