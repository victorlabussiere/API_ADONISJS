import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Comment from 'App/Models/Comment'
import MyPic from 'App/Models/MyPic'

export default class CommentsController {
    // POST -> Postando comentário
    async store({ params, request, response }: HttpContextContract) {
        const body = request.body()
        const picture_id = params.pic_id

        await MyPic.findBy('id', picture_id)
            .then(() => body.my_pic_id = picture_id)
            .catch(errorPicID => console.error('Foto não encontrada', errorPicID))

        const comment = await Comment.create(body)

        try {

            if (!comment.username || !comment.text) throw Error()

            response.status(201)
            return {
                message: 'Comentário inserido com sucesso',
                data: comment
            }

        } catch {
            console.error('A sua mensagem ou nome de usuário apresentaram um erro. Confira as informações e tente novamente.')
            return {
                message: 'Erro com o nome de usuário ou o comentário. Verifique suas informações e tente novamente'
            }
        }
    }
}
