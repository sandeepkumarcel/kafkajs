const RequestV2Protocol = require('./request')
const { decodeRequest } = require('./request.helper')

describe('Protocol > Requests > DescribeGroups > v5', () => {
  test('request', async () => {
    const orginalData = {
      groupIds: [
        'consumer-group-id-4de0aa10ef94403a397d-53384-d2fee969-1446-4166-bc8e-c88e8daffdfe',
      ],
      includeAuthorizedOperations: true,
    }
    const { buffer } = await RequestV2Protocol(orginalData).encode()
    const data = await decodeRequest(buffer)
    expect(data).toEqual(orginalData)
    expect(buffer).toEqual(Buffer.from(require('../fixtures/v5_request.json')))
  })
})
