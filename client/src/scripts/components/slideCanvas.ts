export default class Slide extends HTMLCanvasElement {
	private ctx: CanvasRenderingContext2D
	private img: HTMLImageElement
	private cartelPadding: number

	constructor() {
		super()
		this.ctx = this.getContext('2d') as CanvasRenderingContext2D
		this.img = new Image()
		this.cartelPadding = 32
	}

	private _loadImage() {
		const src = this.getAttribute('img')

		if (src) {
			if (this.img.src !== src) {
				this.img.crossOrigin = 'anonymous'
				this.img.src = src
				this.img.onload = () => {
					this._draw()
				}
			} else {
				this._draw()
			}
		}
	}

	private _img(w: number, h: number) {
		const ratio = w / h
		const imgRatio = this.img.width / this.img.height
		const width = imgRatio < ratio ? imgRatio * h : w
		const height = imgRatio >= ratio ? (this.img.height / this.img.width) * w : h
		const drawImg = (x: number, y: number) => {
			this.ctx.drawImage(this.img, x, y, width, height)
		}
		return { width, height, drawImg }
	}

	private _cartel() {
		const artist = this.getAttribute('artiste')
		const title = this.getAttribute('titre')
		const date = this.getAttribute('date')
		const medium = this.getAttribute('medium')
		const dimensions = this.getAttribute('dimensions')
		const localisation = this.getAttribute('localisation')

		const lines = [artist, title, date, medium, dimensions, localisation].filter(el => el !== null && el !== '')

		const fontSize = 30
		this.ctx.strokeStyle = '#ffffff'
		this.ctx.font = `${fontSize}px Roboto`
		this.ctx.fillStyle = '#fff'

		const width = lines.reduce((max, el) => Math.max(this.ctx.measureText(el || '').width, max), 0) + this.cartelPadding * 2
		const height = (lines.length - 1) * fontSize + this.cartelPadding * 2

		const draw = (x: number, y: number) => {
			lines.forEach((l, i) => {
				this.ctx.fillText(l || '', x + this.cartelPadding, y + this.cartelPadding + i * fontSize)
			})
		}
		return { draw, width, height }
	}

	private _clearCanvas() {
		this.ctx.fillStyle = '#010923'
		this.ctx.fillRect(0, 0, this.width, this.height)
	}

	private _draw() {
		this._clearCanvas()
		const cartel = this._cartel()
		const img = this._img(this.width - cartel.width, this.height)
		const x = Math.floor((this.width - img.width - cartel.width) * 0.5)
		const y = Math.floor((this.height - img.height) * 0.5)
		img.drawImg(x, y)
		cartel.draw(x + img.width, y + img.height - cartel.height)
	}

	public refresh() {
		this._loadImage()
	}

	public download() {
		const title = this.getAttribute('titre')
		const artist = this.getAttribute('artiste')
		const name = [artist || 'anonyme', title || 'sans-titre'].join('-')
		const link = document.createElement('a')
		link.download = name + '.png'
		link.href = this.toDataURL()
		link.click()
	}
}
