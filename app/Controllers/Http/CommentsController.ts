import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import MyPic from 'App/Models/MyPic'

export default class CommentsController {

    public async store({ request, params, response }: HttpContextContract) {

        const body = request.body()
        const picId = params.pic_id

        console.log('Parametros', params)
        await MyPic.findBy('id', picId)
        body.pic_id = picId

        const comment = await Comment.create(body)
        response.status(201)

        return {
            message: 'Cometário criado com sucesso',
            data: comment
        }
    }
}