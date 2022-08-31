import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { Project } from '../../../../interfaces'
import ProjectLayout from '../ProjectLayout'
import AllocationInfo from '../Main/AllocationInfo'
import BaseButton from '../../../ui/buttons/BaseButton'
import { useStarknetReact } from '@web3-starknet-react/core'
import { useTokenContract, useLotteryTokenContract, useIDOContract } from 'contracts'
import { Result, uint256, hash } from 'starknet'
import { ethers } from 'ethers'
import { LockIcon, SendIcon } from '../../../ui/Icons/Icons'
import Link from 'next/link'
import { useTransactions } from 'context/TransactionsProvider'
import { useQuery } from '@apollo/client'
import { PROJECT } from '../../../../api/gql/querries'
import Spinner from '../../../ui/Spinner/Spinner'
import ToastActions from 'actions/toast.actions'
import { ToastState } from 'components/ui/Toast/utils'
import { useAppDispatch } from 'hooks/hooks'

const ProjectClaimPage = () => {
  const router = useRouter()
  const { pid } = router.query
  const { account } = useStarknetReact()
  const [ticketsBalance, setTicketsBalance] = useState<string | null>(null)
  const [userInfo, setUserInfo] = useState<Result>({} as Result)
  const [xzkpBalance, setXZkpBalance] = useState('0')
  const [project, setProject] = useState<Project | undefined>(undefined)
  const [claiming, setClaiming] = useState(false)
  const [loading, setLoading] = useState(true)
  const [hasClaimed, setHasClaimed] = useState(false)

  const { getXZKPBalance } = useTokenContract()
  const { claimLotteryTickets, getTicketsBalance } = useLotteryTokenContract()
  const dispatch = useAppDispatch()
  const { addTransaction } = useTransactions()

  const { data } = useQuery(PROJECT, {
    variables: {
      idoId: pid,
    },
  })

  useEffect(() => {
    data && setProject(data.project)
  }, [data])



  const handleClaimTickets = async () => {
    if (!project) return
    try {
      setClaiming(true)
      const tx = await claimLotteryTickets(project.idoId.toString())
      addTransaction(
        tx,
        'Claim Tickets',
        () => fetchBalances(),
        () => {}
      )
      setClaiming(false)
    } catch (e) {
      console.error(e)
      setClaiming(false)
    }
  }

  const fetchBalances = async () => {
    if (!project) return
    try {
      setLoading(true)
      const _xbalance = await getXZKPBalance(account?.address)
      const _xformattedBalance = ethers.utils.formatUnits(
        uint256.uint256ToBN(_xbalance.balance).toString(),
        'ether'
      )
      setXZkpBalance(_xformattedBalance)

      const _ticketsBalance = await getTicketsBalance(account?.address, project.idoId.toString())
      setTicketsBalance(uint256.uint256ToBN(_ticketsBalance.balance).toString())

      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (account?.address && project) {
      fetchBalances()
    }
  }, [account, project])

  if (!project) {
    return <></>
  }

  return (
    <>
      <ProjectLayout project={project}>
        <div className="block mb-4">
          <div className="block--contrast">
            <div className="title--medium mb-1">Total Claimable Tickets</div>
            <div className="title--small mb-5">YOU CAN ONLY CLAIM TICKETS ONCE PER IDO!</div>
            <div className="flex items-center">
              {/* TODO: CHANGE THIS TO CHECK WITH API */}
              {loading ? (
                <Spinner />
              ) : Number(ticketsBalance) > 0 ? (
                <div className="text-primaryClear font-bold transform translate-y-px">
                  Tickets already claimed
                </div>
              ) : (
                <>
                  <div className="text-primaryClear font-bold transform translate-y-px">
                    Available
                  </div>
                  <div className="font-heading text-primary ml-6">
                    {Math.floor(Math.pow(Number(xzkpBalance), 0.6))}
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="block__item">
            <div className="flex flex-col md:flex-row gap-4">
              <BaseButton
                className="w-full"
                onClick={handleClaimTickets}
                disabled={claiming || Number(ticketsBalance) > 0}>
                <SendIcon className={'mr-2'} />
                {claiming ? <Spinner /> : 'Claim Tickets'}
              </BaseButton>
              <Link href="/stake">
                <BaseButton className="xl:col-span-1 whitespace-nowrap px-5">
                  <LockIcon className={'mr-2'} />
                  Lock more $ASTR
                </BaseButton>
              </Link>
            </div>
          </div>
        </div>
        <AllocationInfo projectType={project.type} />
      </ProjectLayout>
    </>
  )
}

export default ProjectClaimPage
