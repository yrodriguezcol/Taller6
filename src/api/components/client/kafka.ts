import { Kafka  } from "kafkajs"
import logger from "../../../utils/logger"

export class KafkaClient {
    private kafka: Kafka
    private producer: any
    
    constructor() {
        this.kafka =  new Kafka({
            clientId: 'wallet',
            brokers: ["localhost:9092"]
        })
        this.producer = this.kafka.producer()
    }

    async sendNotification(topic: string, message: string) {
        try{
            await this.producer.connect()
            console.log(topic)
            console.log(message)
            await this.producer.send({
                topic,
                messages:[
                    {value: message}
                ]
            })
            console.log(message)
            await this.producer.disconnect()
            logger.info('Notification send successfully')

        } catch (error) {
            logger.info('Failed to send Notification', error)
        }
    }

}