import { ContactEmail, DiscordLink, GitHubLink, TwitterLink, WhitepaperLink } from '../constants'
import TwitterIcon from 'assets/icons/Twitter.svg'
import DiscordIcon from 'assets/icons/Discord.svg'
import DocumentIcon from 'assets/icons/Document.svg'
import FolderIcon from 'assets/icons/Folder.svg'
import Logo from 'assets/images/logo-text.svg'
import Link from 'next/link'

const Item = ({ icon, label, href }: { icon: string; label: string; href: string }) => {
  return (
    <>
      <Link href={href}>
        <div className="flex items-center text-primary cursor-pointer">
          <div className="icon mr-2 transform -translate-y-0.5">
            <img src={icon} alt={label} />
          </div>

          <div className="text">{label}</div>
        </div>
      </Link>
    </>
  )
}

const Footer = () => {
  const Links = [
    [TwitterIcon, 'Twitter', TwitterLink],
    [DiscordIcon, 'Discord', DiscordLink],
    [DocumentIcon, 'Whitepaper', WhitepaperLink],
    [FolderIcon, 'Docs', GitHubLink],
  ]
  return (
    <>
      <div className="g-container py-4">
        <div className="py-2 flex flex-col lg:flex-row items-center justify-between text-16">
          <div className="links flex flex-wrap items-center gap-4 lg:gap-11 mb-6 lg:mb-0">
            {Links.map(([icon, label, href]) => (
              <Item icon={icon} label={label} href={href} key={label} />
            ))}
          </div>

          <div className="flex items-center">
            <p className={'mr-8'}>
              Get in touch:{' '}
              <a href={`mailto:${ContactEmail}`} className={'text-primary'}>
                {ContactEmail}{' '}
              </a>
            </p>

            <Link href={'/'}>
              <img src={Logo} alt={'Astraly'} />
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer
