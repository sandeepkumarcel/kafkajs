const Decoder = require('../../../decoder')
const { failure, createErrorFromCode } = require('../../../error')

/**
 * AlterPartitionReassignments Response (Version: 0) => throttle_time_ms error_code error_message [responses] TAG_BUFFER
 * throttle_time_ms => INT32
 * error_code => INT16
 * error_message => COMPACT_NULLABLE_STRING
 * responses => name [partitions] TAG_BUFFER
 *  name => COMPACT_STRING
 *  partitions => partition_index error_code error_message TAG_BUFFER
 *    partition_index => INT32
 *    error_code => INT16
 *    error_message => COMPACT_NULLABLE_STRING
 */

const decodeResponses = decoder => ({
  topic: decoder.readUVarIntString(),
  partitions: decoder.readUVarIntArray(decodePartitions),
})

const decodePartitions = decoder => {
  const partition = decoder.readInt32()
  return {
    partition,
    errorCode: decoder.readInt16(),
  }
}

const decode = async rawData => {
  const decoder = new Decoder(rawData)
  decoder.readUVarInt()
  const throttleTime = decoder.readInt32()
  const errorCode = decoder.readInt16()
  return {
    throttleTime,
    errorCode,
    responses: decoder.readUVarIntArray(decodeResponses),
  }
}

const parse = async data => {
  if (failure(data.errorCode)) {
    throw createErrorFromCode(data.errorCode)
  }

  const partitionsWithError = data.responses.flatMap(response =>
    response.partitions.filter(partition => failure(partition.errorCode))
  )

  const partitionWithError = partitionsWithError[0]
  if (partitionWithError) {
    throw createErrorFromCode(partitionWithError.errorCode)
  }

  return data
}

module.exports = {
  decode,
  parse,
}
