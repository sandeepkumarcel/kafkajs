const Encoder = require('../../../encoder')
/**
 * Starting in version 4 : TAG_BUFFERS
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

const encodeMember = ({
  memberId,
  groupInstanceId,
  clientId,
  clientHost,
  memberMetadata,
  memberAssignment,
}) => {
  return new Encoder()
    .writeUVarIntString(memberId)
    .writeUVarIntString(groupInstanceId)
    .writeUVarIntString(clientId)
    .writeUVarIntString(clientHost)
    .writeUVarIntBytes(memberMetadata)
    .writeUVarIntBytes(memberAssignment)
    .writeUVarIntBytes()
}

const encodeGroup = ({
  errorCode,
  groupId,
  state,
  protocolType,
  protocol,
  members,
  authorizedOperations,
}) => {
  return new Encoder()
    .writeInt16(errorCode)
    .writeUVarIntString(groupId)
    .writeUVarIntString(state)
    .writeUVarIntString(protocolType)
    .writeUVarIntString(protocol)
    .writeUVarIntArray(members.map(encodeMember))
    .writeInt32(authorizedOperations)
    .writeUVarIntBytes()
}

const encodeDescribeGroupsResponse = async ({ throttleTime, groups }) => {
  return new Encoder()
    .writeInt32(throttleTime)
    .writeUVarIntArray(groups.map(encodeGroup))
    .writeUVarIntBytes()
}

module.exports = {
  encodeDescribeGroupsResponse,
}
