import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'

import { v4 as uuidv4 } from 'uuid' // Gerador de strings para nomear as images.
import MyPic from 'App/Models/MyPic' // importando o modelo do DB para realizar os serviços.

export default class MyPicsController {

    private validationOptions = {
        type: ['image'],
        size: '2mb'
    }
    // POST
    async store({ request, response }: HttpContextContract) {
        const body = request.body()
        const image = request.file('image', this.validationOptions)

        if (image) {
            const imageName = `${uuidv4()}.${image.extname}`

            await image.move(Application.tmpPath('uploads')), {
                name: imageName
            }

            body.image = imageName
        }

        const pic = await MyPic.create(body)
        pic
        response.status(201)
        return {
            message: "Foto publicada com sucesso.",
            data: pic
        }
    }
    // GET
    async index({ response }: HttpContextContract) {
        const result = await MyPic.query().preload('comments')
        if (!result) throw Error('Nenhum item encontrado na lista')

        response.status(200)
        return {
            data: result
        }
    }
    // GET w QUERY
    async show({ params, response }: HttpContextContract) {
        const result = await MyPic.findBy("id", params.id)
        if (!result) throw Error('Item não existe.')
        console.log('result', result)

        response.status(200)
        await result.load('comments')
        return {
            data: result
        }
    }
    // PATCH
    async update({ request, params, response }: HttpContextContract) {
        const body = request.body()
        const pic: any = await MyPic.findBy('id', params.id)

        pic.title = body.title
        pic.description = body.description

        if (pic.image !== body.image || !pic.image) {
            const image = request.file('image', this.validationOptions)
            if (image) {
                const imageName = `${uuidv4()}.${image.extname}`

                await image.move(Application.tmpPath('uploads')), {
                    name: imageName
                }

                pic.image = imageName
            }
        }

        await pic.save()
        response.status(200)

        return {
            message: 'êxito',
            data: pic
        }
    }
    // DELETE 
    public async destroy({ params, response }) {
        const result = await MyPic.findBy('id', params.id)
        if (!result) throw ('Item não encontrado. Não foi possível realizar a operação.')

        result?.delete()
        response.status(200)
        return {
            message: 'Item deletado com sucesso',
            data: result
        }
    }
}