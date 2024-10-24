import { CalendarIcon, ChartBarIcon, FolderIcon, HomeIcon, InboxIcon, UsersIcon } from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Dashboard', icon: HomeIcon, href: '#', current: true },
  { name: 'Team', icon: UsersIcon, href: '#', current: false },
  { name: 'Projects', icon: FolderIcon, href: '#', current: false },
  { name: 'Calendar', icon: CalendarIcon, href: '#', current: false },
  { name: 'Documents', icon: InboxIcon, href: '#', current: false },
  { name: 'Reports', icon: ChartBarIcon, href: '#', current: false },
]
const secondaryNavigation = [
  { name: 'Website redesign', href: '#' },
  { name: 'GraphQL API', href: '#' },
  { name: 'Customer migration guides', href: '#' },
  { name: 'Profit sharing program', href: '#' },
]

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function SideNav() {
  return (
    <div className="flex max-w-[200px] flex-grow flex-col overflow-y-auto border-r border-gray-200 bg-white pb-4 pt-5">
      <div className="flex flex-shrink-0 items-center px-4">
        <img
          alt="Your Company"
          src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
          className="h-8 w-auto"
        />
      </div>
      <div className="mt-5 flex flex-grow flex-col">
        <nav aria-label="Sidebar" className="flex-1 space-y-8 bg-white px-2">
          <div className="space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={classNames(
                  item.current ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                  'group flex items-center rounded-md px-2 py-2 text-sm font-medium',
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className={classNames(
                    item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                    'mr-3 h-6 w-6 flex-shrink-0',
                  )}
                />
                {item.name}
              </a>
            ))}
          </div>
          <div className="space-y-1">
            <h3 id="projects-headline" className="px-3 text-sm font-medium text-gray-500">
              Projects
            </h3>
            <div role="group" aria-labelledby="projects-headline" className="space-y-1">
              {secondaryNavigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                >
                  <span className="truncate">{item.name}</span>
                </a>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}
