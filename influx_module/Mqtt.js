const mqtt = require('mqtt');
const { ConfigParams } = require("./ConfigParams");

class MqttModule {

    constructor(logicImpl) {
        this.configParams = new ConfigParams();

        this.brokerIP = this.configParams.brokerIP;
        this.client = mqtt.connect('mqtt://' + this.brokerIP);

        this.logicImpl = logicImpl;

        this.connect();
        this.initCallback();

    }

    connect() {

        // Conectar al broker
        this.client.on('connect', () => {
            console.log('Connecting to MQTT broker on', this.brokerIP + '...');

            this.client.subscribe(this.configParams.dittoTopic);
            this.client.subscribe(this.configParams.movementTopic)
            // Sólo se miden las vibraciones si se especifica en los parámetros de configuración
            if (this.configParams.measureVibrations == true){
                this.client.subscribe(this.configParams.vibrMeasTopic);
            }
            console.log('Connected to broker on', this.brokerIP);
        });

    }

    initCallback() {

        this.client.on('message', (topic, message) => {
                this.logicImpl.checkMsg(message, topic);
        });

    }

}

module.exports = { MqttModule };
