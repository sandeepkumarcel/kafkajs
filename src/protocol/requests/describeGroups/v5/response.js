const Decoder = require('../../../decoder')
const { parse } = require('../v1/response')

/**
 * Starting in version 5 : TAG_BUFFERS
 * @see https://kafka.apache.org/protocol.html#The_Messages_DescribeGroups
 *
 * DescribeGroups Response (Version: 3) => throttle_time_ms [groups] TAG_BUFFER
 *   throttle_time_ms => INT32
 *   groups => error_code group_id state protocol_type protocol [members] authorized_operations TAG_BUFFER
 *     error_code => INT16
 *     group_id => COMPACT_STRING
 *     state => COMPACT_STRING
 *     protocol_type => COMPACT_STRING
 *     protocol => COMPACT_STRING
 *     members => member_id group_instance_id client_id client_host member_metadata member_assignment
 *       member_id => COMPACT_STRING
 *       group_instance_id => COMPACT_NULLABLE_STRING
 *       client_id => COMPACT_STRING
 *       client_host => COMPACT_STRING
 *       member_metadata => COMPACT_BYTES
 *       member_assignment => COMPACT_BYTES
 *     authorized_operations => INT32
 */

const decoderMember = decoder => ({
  memberId: decoder.readUVarIntString(),
  groupInstanceId: decoder.readUVarIntString(),
  clientId: decoder.readUVarIntString(),
  clientHost: decoder.readUVarIntString(),
  memberMetadata: decoder.readUVarIntBytes(),
  memberAssignment: decoder.readUVarIntBytes(),
})

const decodeGroup = decoder => ({
  errorCode: decoder.readInt16(),
  groupId: decoder.readUVarIntString(),
  state: decoder.readUVarIntString(),
  protocolType: decoder.readUVarIntString(),
  protocol: decoder.readUVarIntString(),
  members: decoder.readUVarIntArray(decoderMember),
  authorizedOperations: decoder.readInt32(),
})

const decode = async rawData => {
  const decoder = new Decoder(rawData)
  const throttleTime = decoder.readInt32()
  const groups = decoder.readUVarIntArray(decodeGroup)

  return {
    throttleTime,
    groups,
  }
}

module.exports = {
  decode,
  parse,
}
