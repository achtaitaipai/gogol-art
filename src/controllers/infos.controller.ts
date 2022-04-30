import { Router } from 'express'
import SlideDatas from '~/services/infoBox.service'

const InfosController = Router()

InfosController.get('/byId/:id', async (req, res) => {
	const datas = new SlideDatas()
	const infoBox = await datas.getInfoBox(req.params.id)
	const title = infoBox?.body?.titre || ''
	const artiste = infoBox?.body?.artiste || ''
	const toSearch = title + ' ' + artiste
	const img = await datas.getImgWiki(req.params.id)
	let images = [img]
	const imgs = await datas.getImgs(toSearch)
	if (imgs?.length) images = [...images, ...imgs]
	res.send({ ...infoBox?.body, images })
})

InfosController.get('/byTitle/:title', async (req, res) => {
	const datas = new SlideDatas()
	const images = await datas.getImgs(req.params.title)
	res.send({ images })
})

export default InfosController
