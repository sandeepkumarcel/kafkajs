const Decoder = require('../../../decoder')

/**
 * DescribeGroups Request (Version: 3) => [group_ids] include_authorized_operations
 *   group_ids => STRING
 *   include_authorized_operations => BOOLEAN
 */

/**
 * DescribeGroups Request (Version: 3) => [group_ids] include_authorized_operations
 *   group_ids => COMPACT_STRING
 *   include_authorized_operations => BOOLEAN
 */

const decodeRequest = async rawData => {
  const decoder = new Decoder(rawData)
  const groupIds = decoder.readUVarIntArray(d => d.readUVarIntString())
  const includeAuthorizedOperations = decoder.readBoolean()
  return {
    groupIds,
    includeAuthorizedOperations,
  }
}

module.exports = {
  decodeRequest,
}
