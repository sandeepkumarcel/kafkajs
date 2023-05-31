const Encoder = require('../../../encoder')
const { DescribeGroups: apiKey } = require('../../apiKeys')

/**
 * DescribeGroups Request (Version: 5) => [group_ids] include_authorized_operations
 *   group_ids => COMPACT_STRING
 *   include_authorized_operations => BOOLEAN
 */

module.exports = ({ groupIds, includeAuthorizedOperations = true }) => ({
  apiKey,
  apiVersion: 5,
  apiName: 'DescribeGroups',
  encode: async () => {
    return new Encoder()
      .writeUVarIntArray(groupIds.map(groupId => new Encoder().writeUVarIntString(groupId)))
      .writeBoolean(includeAuthorizedOperations)
  },
})
