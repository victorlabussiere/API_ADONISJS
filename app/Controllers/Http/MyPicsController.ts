import { v4 as uuidv4 } from 'uuid'

import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import MyPic from 'App/Models/MyPic'

import Application from "@ioc:Adonis/Core/Application"

export default class MyPicsController {

    private validationOptions = {
        types: ["image"],
        size: "2mb"
    }
    // POST
    public async store({ request, response }: HttpContextContract) {

        const body = request.body()
        const image = request.file('image', this.validationOptions)
        if (image) {
            const imageName = `${uuidv4()}.${image.extname}`

            await image.move(Application.tmpPath('uploads'), {
                name: imageName
            })

            body.image = imageName

        }

        const mypic = await MyPic.create(body)
        response.status(201)

        return {
            message: 'Operação realizada com sucesso',
            data: mypic
        }
    }
    // GET
    public async index() {
        const pics = await MyPic.query().preload('comments')
        return { data: pics }
    }
    // GET w/ QUERY
    public async show({ params }: HttpContextContract) {

        const pic = await MyPic.findByOrFail('id', params.id)

        if (!pic) throw Error('Item não encontrado')

        pic.load('comments')

        return {
            data: pic
        }
    }
    // DELETE
    public async destroy({ params }: HttpContextContract) {
        const pic = await MyPic.findBy('id', params.id)

        if (!pic) throw Error('Item não encontrado')
        await pic.delete()

        return {
            message: 'Item deletado com sucesso',
            data: pic
        }
    }
    // UPDATE
    public async update({ params, request }: HttpContextContract) {
        const body = request.body()
        const pic = await MyPic.findBy('id', params.id)
        if (!pic) throw Error('Item não encontrado. Update NÃO realizado.')

        pic.title = body.title
        pic.description = body.description

        if (pic.image !== body.image || !pic.image) {
            const image = request.file('image', this.validationOptions)
            if (image) {
                const imageName = `${uuidv4()}.${image.extname}`
                await image.move(Application.tmpPath('uploads'), {
                    name: imageName
                })

                pic.image = imageName
            }
        }

        await pic.save()

        return {
            message: 'Item atualizado com sucesso',
            data: pic
        }
    }
}