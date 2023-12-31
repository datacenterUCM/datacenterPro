const mqtt = require('mqtt');
const { ConfigParams } = require("./ConfigParams");

class MqttModule {

    constructor(brokerIP, logicImpl) {

        this.brokerIP = brokerIP;
        this.client = mqtt.connect('mqtt://' + brokerIP);

        this.logicImpl = logicImpl;

        this.configParams = new ConfigParams();

        this.connect();
        this.initCallback();

    }

    connect() {

        // Conectar al broker
        this.client.on('connect', () => {
            console.log('Connecting to MQTT broker on', this.brokerIP + '...');

            this.client.subscribe(this.configParams.dittoTopic);
            this.client.subscribe(this.configParams.alarmModuleTopic);
            this.client.subscribe(this.configParams.movementTopic);
            this.client.subscribe(this.configParams.notMovementTopic);
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