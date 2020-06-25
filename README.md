# Device OBD Reader - Lambda


This lambda is used by AWS IOT to deploye it on ELD device

Environment Variables:

| Parameter Name | Required | Default        | Description                                  |
| -------------- | -------- | -------------- | -------------------------------------------- |
| POLLING_RATE   | NO       | 15 seconds     | Polling interval to send data to cloud       |
| SERIAL_PORT    | NO       | `/dev/ttyUSB0` | Serial port to which OBD device is connected |
