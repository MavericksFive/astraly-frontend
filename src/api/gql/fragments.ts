import { gql } from '@apollo/client'

export const ProjectFragment = gql`
  fragment Project on Project {
    _id
    name
    description
    ticker
    logo
    cover
    coverVideo
    totalRaise
    tokenAddress
    currentRoundIndex
    tokenPrice
    type
    categories
    rounds {
      title
      description
      startDate
      endDate
    }
    idoId
    isFinished
  }
`

export const UserFragment = gql`
  fragment User on Account {
    _id
    address
    alias
    avatar
    bannerHash
    bio
    cover
    autoBurn
    transactions {
      _id
      contractAddress
      hash
      name
      timestamp
    }
    email
    questCompleted {
      _id
    }
    socialLinks {
      type
      id
    }
  }
`

export const PublicUserFragment = gql`
  fragment PublicUser on Account {
    _id
    address
    alias
    avatar
    bannerHash
    bio
    cover
    transactions {
      _id
      contractAddress
      hash
      name
      timestamp
    }
    socialLinks {
      type
      id
    }
  }
`

export const TransactionFragment = gql`
  fragment Transaction on Transaction {
    _id
    contractAddress
    hash
    name
    timestamp
  }
`

export const QuestFragment = gql`
  fragment Quest on Quest {
    _id
    description
    idoId
    isClaimed
    link
    name
    type
    event {
      callData {
        name
        type
        value {
          ... on Felt {
            value
          }
          ... on Uint256 {
            low
            high
          }
        }
      }
      name
      transmitterContract
    }
  }
`
