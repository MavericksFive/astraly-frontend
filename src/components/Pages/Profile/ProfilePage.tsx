import Vertical from '../../ui/Separator/Vertical'
import InvestmentOverview from '../../ui/Investment/InvestmentOverview'
import ProjectsSlider from '../../ui/Slider/ProjectsSlider'
import ProfileCover from './ProfileCover'
import VerifyAccount from './VerifyAccount'
import AccountLinks from './AccountLinks'
import Planets from 'assets/animations/planet.svg?inline'
import { useStarknetReact } from '@web3-starknet-react/core'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useMutation, useQuery } from '@apollo/client'
import { useTransactions } from 'context/TransactionsProvider'
import { USER } from '../../../api/gql/querries'
import { isSameAddress } from '../../../utils'
import { useLotteryTokenContract } from 'contracts'
import ToggleAutoBurn from 'components/ui/inputs/ToggleAutoBurn'
import { UPDATE_PROFILE } from 'api/gql/mutations'

const ProfilePage = () => {
  const router = useRouter()
  const { uid } = router.query
  const { account } = useStarknetReact()
  const { addTransaction } = useTransactions()
  const [autoBurn, setautoBurn] = useState(false)
  const [loading, setLoading] = useState(true)
  const { data } = useQuery(USER, {
    variables: {
      address: uid ?? account?.address,
    },
  })

  const { setApprovalForAll, isApprovedForAll } = useLotteryTokenContract()

  const user = data?.getAccount
  const isSelf = isSameAddress(account?.address, user?.address)

  const moderator = '0x02356b628D108863BAf8644c945d97bAD70190AF5957031f4852d00D0F690a77'

  const [mutateFunction] = useMutation(UPDATE_PROFILE)

  const autoBurnTickets = async () => {
    if (!autoBurn) {
      try {
        const tx = await setApprovalForAll(moderator, 1)
        addTransaction(
          tx,
          'Turn ON AutoBurn',
          async () => {
            fetchApprovalToModerator()
            const { data } = await mutateFunction({
              variables: {
                data: {
                  autoBurn: true,
                },
              },
            })
          },
          () => {}
        )
      } catch (e) {
        console.error(e)
      }
    } else {
      try {
        const tx = await setApprovalForAll(moderator, 0)
        addTransaction(
          tx,
          'Turn OFF AutoBurn',
          async () => {
            fetchApprovalToModerator()
            const { data } = await mutateFunction({
              variables: {
                data: {
                  autoBurn: false,
                },
              },
            })
          },
          () => {}
        )
      } catch (e) {
        console.error(e)
      }
    }
  }

  const fetchApprovalToModerator = async () => {
    try {
      setLoading(true)
      const approval_state = await isApprovedForAll(account?.address, moderator)
      const value_approval = approval_state.is_approved.words[0]
      setautoBurn(value_approval)
      setLoading(false)
    } catch (e) {
      console.error(e)
      setLoading(false)
    }
  }

  useEffect(() => {
    if (account?.address) {
      fetchApprovalToModerator()
    }
  }, [account, autoBurn])

  return (
    <>
      <div className="ProfilePage g-container mb-10">
        <div className="page-title mb-14">Profile</div>
        <Planets className={'lightning_svg absolute right-40 top-20 -z-10'} />
        <div className="lg:flex gap-6 mb-10">
          <div className="w-full">
            <ProfileCover user={user} />
            {isSelf && <InvestmentOverview />}
          </div>

          <div className="hidden lg:block">
            <div className="sticky top-6 left-0">
              <Vertical />
            </div>
          </div>

          <div className={'mt-4 lg:mt-0 lg:w-1/3 flex-shrink-0'}>
            {isSelf && <VerifyAccount />}
            <div className="VerifyAccount block mb-6">
              <div className="block--contrast">
                <div className="title--medium">Automatic Burning</div>
                <p className={'text-primaryClear font-bold'}>
                  Let us burn your lottery tickets for you and get more sleep
                </p>
              </div>
              <div className="block__item">
                <div className="flex justify-center flex-row gap-4">
                  <div className="title--medium ">Auto-Burn</div>
                  <ToggleAutoBurn
                    value={autoBurn}
                    onClick={() => autoBurnTickets()}></ToggleAutoBurn>
                </div>
              </div>
            </div>

            <AccountLinks user={user} />
          </div>
        </div>
      </div>
      <div className="g-container">
        <div className="font-heading uppercase mb-6 text-primaryClear text-24">
          INVESTED PROJECTS
        </div>
      </div>

      <ProjectsSlider />
      <div className="h-20"></div>
    </>
  )
}

export default ProfilePage
