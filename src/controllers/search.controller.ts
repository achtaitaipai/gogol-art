import { Router } from 'express'
import Search from '~/services/search.service'

const SearchRouter = Router()

SearchRouter.get('/:toSearch', async (req, res) => {
	const search = new Search(req.params.toSearch)
	const results = await search.getResults()
	res.send(results)
})

export default SearchRouter
