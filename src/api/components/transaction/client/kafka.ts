import { object, string } from "joi"
import { EachMessagePayload, Kafka  } from "kafkajs"
import logger from "../../../../utils/logger"
import {Transaction, UpdateTransaction } from "../model"

export class KafkaClient {
    private kafka: Kafka
    private producer: any
    private consumer: any

    constructor() {
        this.kafka =  new Kafka({
            clientId: 'wallet',
            brokers: ["localhost:9092"]
        })
        this.producer = this.kafka.producer()
        this.consumer = this.kafka.consumer({ groupId: 'newConsummer4'})
    }


    async sendNotification(topic: string, message: Transaction) {
        try{
            
            const messageUpdate = Object.assign({}, message);
            messageUpdate.status = 'existoso'
            await this.producer.connect()
            await this.producer.send({
                topic,
                messages:[
                    {value: JSON.stringify(messageUpdate)}
                ]
            })
            await this.producer.disconnect()
            logger.info('Notification send successfully')

        } catch (error) {
            logger.info('Failed to send Notification', error)
        }
    }


    async Listener(topic: string, updateTransaction: (id: number, updates: UpdateTransaction) => void) {
        await this.consumer.connect()
        await this.consumer.subscribe({ topic: topic, fromBeginning: true })
        await this.consumer.run({
            eachMessage: async ({message}: EachMessagePayload) => {
                const noti =  message.value?.toString()
                const data:Transaction = JSON.parse((noti==undefined)?"": noti)
                const updateTx: UpdateTransaction = {
                    updated_at: new Date(),
                    status: (data.status=='existoso')? data.status: 'existoso'
                }
                
                function delay(ms: number) {
                    return new Promise( resolve => setTimeout(resolve, ms) );
                }
                await delay(5000);
                console.log(noti)
                updateTransaction(data.transaction_id, updateTx)
            }
        })
    }

}