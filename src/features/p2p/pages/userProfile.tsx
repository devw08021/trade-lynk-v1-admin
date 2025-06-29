import React, { useState, useEffect, FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { User } from '@/types'
import Card from '@/components/base/Card'
import { CreditCardIcon, ActivityIcon } from '@/components/base/Icons'
import { useUser, useUserActions } from '@/hooks/useUsers'

const ProfileField: React.FC<{
  label: string
  value: string
  isEditing?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  type?: string
}> = ({ label, value, isEditing = false, onChange, name, type = 'text' }) => (
  <div>
    <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">{label}</label>
    {isEditing ? (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-sm"
      />
    ) : (
      <p className="text-sm text-slate-800 dark:text-slate-200 mt-1 truncate">{value}</p>
    )}
  </div>
)

export const UserProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>()

  const [user, setUser] = useState<any | null>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState<Partial<User>>({})
  const [activeTab, setActiveTab] = useState<'passbook' | 'activity'>('passbook')

  const { data, isUserLoading } = useUser(id)
  console.log('datadatadata', data)
  useEffect(() => {
    if (data) {
      setUser(data)
      setFormData(data)
      // setTransactions(getTransactionsByUserId(id))
      // setActivities(getActivitiesByUserId(id))
    }
  }, [data])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (user) {
      const updatedUser = { ...user, ...formData }
      updateUser(updatedUser)
      setUser(updatedUser) // Immediately update local state
      setIsEditing(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-10">
        <h2 className="text-xl">User not found</h2>
        <Link to="/users" className="text-blue-500 hover:underline mt-4 inline-block">
          Back to User List
        </Link>
      </div>
    )
  }

  const TabButton: React.FC<{
    tabName: 'passbook' | 'activity'
    label: string
    icon: React.ReactNode
  }> = ({ tabName, label, icon }) => {
    const isActive = activeTab === tabName
    const activeClasses = 'border-blue-500 text-blue-600 dark:text-blue-400'
    const inactiveClasses =
      'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300 dark:hover:border-slate-700'

    return (
      <button
        onClick={() => setActiveTab(tabName)}
        className={`flex items-center space-x-2 whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none transition-colors duration-150 ${isActive ? activeClasses : inactiveClasses}`}
        aria-current={isActive ? 'page' : undefined}
      >
        {icon}
        <span>{label}</span>
      </button>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Row 1: Profile Info */}
      <Card>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
              <img src={user?.avatarUrl} alt={user?.username} className="w-20 h-20 rounded-full" />
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                  {user?.username}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">{user?.role}</p>
              </div>
            </div>
            {isEditing ? (
              <div className="flex space-x-2 self-start sm:self-center">
                <button
                  type="submit"
                  className="px-3 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false)
                    setFormData(user)
                  }}
                  className="px-3 py-1.5 text-sm font-medium bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="px-3 py-1.5 text-sm font-medium bg-slate-200 dark:bg-slate-700 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Edit Profile
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-4 border-t border-slate-200 dark:border-slate-800 pt-6">
            <ProfileField
              label="Full Name"
              name="name"
              value={formData.username || ''}
              isEditing={isEditing}
              onChange={handleInputChange}
            />
            <ProfileField
              label="Email Address"
              name="email"
              value={formData.email || ''}
              isEditing={isEditing}
              onChange={handleInputChange}
              type="email"
            />
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400">
                Status
              </label>
              {isEditing ? (
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-sm"
                >
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Pending</option>
                </select>
              ) : (
                <p className="text-sm text-slate-800 dark:text-slate-200 mt-1">{user?.status}</p>
              )}
            </div>
            <ProfileField
              label="Member Since"
              value={new Date(user?.createdAt).toLocaleDateString()}
            />
          </div>
        </form>
      </Card>

      {/* Row 2: Tabs */}
      <Card>
        <div className="border-b border-slate-200 dark:border-slate-800">
          <nav className="-mb-px flex space-x-6 px-6" aria-label="Tabs">
            <TabButton
              tabName="passbook"
              label="Passbook & Balance"
              icon={<CreditCardIcon className="w-5 h-5" />}
            />
            <TabButton
              tabName="activity"
              label="User Activity"
              icon={<ActivityIcon className="w-5 h-5" />}
            />
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'passbook' && (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Current Balance</p>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">
                  ${user?.balance?.toFixed(2)}
                </p>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-600 dark:text-slate-300 mb-2">
                  Transaction History
                </h4>
                <ul className="divide-y divide-slate-200 dark:divide-slate-800 max-h-80 overflow-y-auto pr-2">
                  {transactions.length > 0 ? (
                    transactions.map(t => (
                      <li key={t.id} className="py-3 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                            {t.description}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(t.date).toLocaleDateString()}
                          </p>
                        </div>
                        <p
                          className={`text-sm font-mono ${t.type === 'Credit' ? 'text-green-500' : 'text-red-500'}`}
                        >
                          {t.type === 'Credit' ? '+' : '-'}${t.amount.toFixed(2)}
                        </p>
                      </li>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      No transactions found.
                    </p>
                  )}
                </ul>
              </div>
            </div>
          )}
          {activeTab === 'activity' && (
            <div>
              <ul className="divide-y divide-slate-200 dark:divide-slate-800 max-h-96 overflow-y-auto pr-2">
                {activities.length > 0 ? (
                  activities.map(a => (
                    <li key={a.id} className="py-3">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                        {a.action}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">{a.details}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                        {new Date(a.timestamp).toLocaleString()}
                      </p>
                    </li>
                  ))
                ) : (
                  <p className="text-sm text-slate-500 dark:text-slate-400">No recent activity.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
