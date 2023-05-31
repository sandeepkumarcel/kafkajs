const Decoder = require('../../../decoder')
const { failure, createErrorFromCode } = require('../../../error')

/**
 * Version 7 group_instance_id added
 *
 * OffsetCommit Request (Version: 7) => group_id generation_id member_id [topics]
 *   group_id => STRING
 *   generation_id => INT32
 *   member_id => STRING
 *   group_instance_id => NULLABLE_STRING //new
 *   topics => topic [partitions]
 *     topic => STRING
 *     partitions => partition offset metadata
 *       partition => INT32
 *       offset => INT64
 *       committed_leader_epoch => INT32
 *       metadata => NULLABLE_STRING
 */

const decode = async rawData => {
  const decoder = new Decoder(rawData)
  return {
    groupId: decoder.readString(),
    groupGenerationId: decoder.readInt32(),
    memberId: decoder.readString(),
    groupInstanceId: decoder.readString(),
    topics: decoder.readArray(decodeTopics),
  }
}

const decodeTopics = decoder => ({
  topic: decoder.readString(),
  partitions: decoder.readArray(decodePartitions),
})

const decodePartitions = decoder => ({
  partition: decoder.readInt32(),
  offset: decoder.readInt64().toString(),
  committedLeaderEpoch: decoder.readInt32(),
  metadata: decoder.readString(),
})

const parse = async data => {
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
  decodeRequest: decode,
  parse,
}
