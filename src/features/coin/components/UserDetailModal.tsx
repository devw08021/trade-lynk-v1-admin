import React, { useEffect, useState } from 'react'
import { BaseModal } from '@/components/base/BaseModal'
import { BaseButton } from '@/components/base/BaseButton'
import { BaseStatusBadge } from '@/components/base/BaseStatusBadge'
import { useCoin, useCoinActions } from '@/hooks/useCoins'
import { classNames } from '@/classNames'
import { Calendar, Coins, Plus, Trash2 } from 'lucide-react'

interface CurrencyDetailModalProps {
  _id: string | null
  isOpen: boolean
  onClose: () => void
}

const initalFormValue = {
  symbol: '',
  name: '',
  type: '',
  image: '',
  isActive: false,
  network: [
    {
      chainId: '',
      chainName: '',
      decimals: 18,
      rpcUrls: [''],
      tag: '',
      isActive: false,
      contractAddress: '',
      withdrawalFee: 0,
      minDeposit: 0,
      maxDeposit: 0,
      minWithdraw: 0,
      dailyLimit: 0,
      isEvm: true
    }
  ]
}

export const UserDetailModal: React.FC<CurrencyDetailModalProps> = ({
  _id,
  isOpen,
  onClose
}) => {
  const { data: currency, isLoading } = useCoin(_id || '')

  const { updateCoin, addCoin, addCoinLoading, updateCoinLoading } = useCoinActions()

  const [form, setForm] = useState(initalFormValue)

  const [errors, setErrors] = useState<any>({})
  const handleModelClose = () => {
    setForm(initalFormValue)
    setErrors({})
    onClose()
  }

  useEffect(() => {
    if (currency) {
      setForm({
        symbol: currency.symbol || '',
        name: currency.name || '',
        type: currency.type || '',
        image: currency.image || '',
        isActive: currency.isActive || false,
        network: currency.network?.length ? currency.network : form.network
      })
    }
  }, [currency])

  const validate = () => {
    const newErrors: any = {}

    form.network.forEach((net, index) => {
      if (net.decimals < 0) newErrors[`network-${index}-decimals`] = 'Must be non-negative'
      if (net.withdrawalFee < 0) newErrors[`network-${index}-withdrawalFee`] = 'Must be non-negative'
      if (net.minDeposit < 0) newErrors[`network-${index}-minDeposit`] = 'Must be non-negative'
      if (net.maxDeposit < 0) newErrors[`network-${index}-maxDeposit`] = 'Must be non-negative'
      if (net.minWithdraw < 0) newErrors[`network-${index}-minWithdraw`] = 'Must be non-negative'
      if (net.dailyLimit < 0) newErrors[`network-${index}-dailyLimit`] = 'Must be non-negative'
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNetworkChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value, type, checked } = e.target
    setForm((prev) => {
      const updatedNetwork = [...prev.network]
      updatedNetwork[index] = {
        ...updatedNetwork[index],
        [name]: type === 'checkbox' ? checked : type === 'number' ? +value : value
      }
      return {
        ...prev,
        network: updatedNetwork
      }
    })
  }


  const addNetwork = () => {
    setForm((prev) => ({
      ...prev,
      network: [
        ...prev.network,
        {
          chainId: '',
          chainName: '',
          decimals: 18,
          rpcUrls: [''],
          tag: '',
          isActive: false,
          contractAddress: '',
          withdrawalFee: 0,
          minDeposit: 0,
          maxDeposit: 0,
          minWithdraw: 0,
          dailyLimit: 0,
          isEvm: true
        }
      ]
    }))
  }

  const removeNetwork = (index: number) => {
    setForm((prev) => ({
      ...prev,
      network: prev.network.filter((_, i) => i !== index)
    }))
  }

  const handleUpdate = async () => {
    try {
      if (!validate()) return

      const updatedCurrency = {
        symbol: form.symbol,
        name: form.name,
        type: form.type,
        image: form.image,
        isActive: form.isActive,
        network: form.network
      }
      updateCoin.mutate({ id: _id || '', data: updatedCurrency }, {
        onError: (data: any) => {
          if (data?.response?.errors)
            setErrors(data?.response?.errors)
        },
        onSuccess: () => {
          handleModelClose()
        }
      })
    } catch (error) {
      console.error(error, "error_handleUpdate")
    }
  }


  const handleAdd = async () => {
    try {
      if (!validate()) return

      const updatedCurrency = {
        symbol: form.symbol,
        name: form.name,
        type: form.type,
        image: form.image,
        isActive: form.isActive,
        network: form.network
      }
      addCoin.mutate(updatedCurrency, {
        onError: (data: any) => {
          if (data?.response?.errors)
            setErrors(data?.response?.errors)
        },
        onSuccess: () => {
          handleModelClose()
        }
      })
    } catch (error) {
      console.error(error, "error_handleUpdate")
    }
  }
  const modalFooter = (
    <div className="flex items-center space-x-3">
      {
        !_id ?
          <BaseButton onClick={handleAdd} disabled={addCoinLoading || updateCoinLoading}>Add Currency</BaseButton>
          :

          <BaseButton onClick={handleUpdate} disabled={addCoinLoading || updateCoinLoading}>Update Currency</BaseButton>
      }
      <BaseButton variant="secondary" onClick={handleModelClose} disabled={addCoinLoading || updateCoinLoading}>Cancel</BaseButton>

    </div>
  )

  // if (!_id) return null

  return (
    <BaseModal isOpen={isOpen} onClose={handleModelClose} size="full" footer={modalFooter} title={`${_id ? 'Update' : 'Add'} Coin`}>
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className={`${classNames.loading.spinner} ${classNames.loading.sizes.lg}`} />
            <span className={classNames.text.muted}>Loading currency details...</span>
          </div>
        </div>
      ) : (
        <div className="p-8 space-y-10 max-h-[80vh] overflow-y-auto">
          {/* Top Section */}
          {
            _id &&
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase">
                {form.symbol}
              </div>
              <div className="flex-1 space-y-2">
                <h2 className="text-2xl font-semibold">
                  {form.name} <span className="text-sm text-gray-500">({form.symbol})</span>
                </h2>
                <div className="flex items-center gap-2">
                  <BaseStatusBadge status={form.isActive ? 'active' : 'inactive'} />
                  <BaseStatusBadge status={form.type} icon={<Coins className="w-4 h-4" />} />
                </div>
                <div className="text-gray-400 text-sm">
                  <Calendar className="inline w-4 h-4 mr-1" /> Created / Updated Info
                </div>
              </div>
            </div>
          }
          {/* Basic Info Form */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Input label="Name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
            <Input label="Symbol" name="symbol" value={form.symbol} onChange={handleChange} error={errors.symbol} />
            <Input label="Image URL" name="image" value={form.image} onChange={handleChange} error={errors.image} />
            <Select label="Type" name="type" value={form.type} onChange={handleChange} options={['', 'coin', 'token']} error={errors.type} />
            <Checkbox label="Is Active" name="isActive" checked={form.isActive} onChange={handleChange} error={errors.isActive} />
          </div>

          {/* Networks */}
          <div className="flex justify-between items-center mt-8">
            <h3 className="text-xl font-semibold">Network Settings</h3>
            {form?.type === 'token' && (
              <BaseButton size="sm" onClick={addNetwork}>
                <Plus className="w-4 h-4 mr-1" /> Add Network
              </BaseButton>
            )}
          </div>

          {form.network.map((net, index) => (
            <div key={index} className="border border-gray-700 p-4 rounded-lg mt-4 space-y-4 relative">
              <div className="flex justify-between">
                <h4 className="text-lg font-semibold text-indigo-300">Network #{index + 1}</h4>
                {form.network.length > 1 && (
                  <BaseButton variant="destructive" size="icon" onClick={() => removeNetwork(index)}>
                    <Trash2 className="w-4 h-4" />
                  </BaseButton>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <Input label="Chain ID" name="chainId" value={net.chainId} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-chainId`]} />
                <Input label="Chain Name" name="chainName" value={net.chainName} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-chainName`]} />
                <Input type="number" label="Decimals" name="decimals" value={net.decimals} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-decimals`]} />
                <Input label="Tag" name="tag" value={net.tag} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-tag`]} />
                <Input label="Contract Address" name="contractAddress" value={net.contractAddress} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-contractAddress`]} />
                <Input type="number" label="Withdrawal Fee" name="withdrawalFee" value={net.withdrawalFee} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-withdrawalFee`]} />
                <Input type="number" label="Min Deposit" name="minDeposit" value={net.minDeposit} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-minDeposit`]} />
                <Input type="number" label="Max Deposit" name="maxDeposit" value={net.maxDeposit} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-maxDeposit`]} />
                <Input type="number" label="Min Withdraw" name="minWithdraw" value={net.minWithdraw} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-minWithdraw`]} />
                <Input type="number" label="Daily Limit" name="dailyLimit" value={net.dailyLimit} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-dailyLimit`]} />
                <Checkbox label="Is EVM" name="isEvm" checked={net.isEvm} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-isEvm`]} />
                <Checkbox label="Network Active" name="isActive" checked={net.isActive} onChange={(e) => handleNetworkChange(e, index)} error={errors[`network-${index}-isActive`]} />
              </div>
            </div>
          ))}
        </div>
      )}
    </BaseModal>
  )
}

// Reusable Input
const Input = ({ label, name, value, onChange, type = 'text', error }: any) => (
  <div>
    <label className="text-sm text-gray-400 mb-1 block">{label}</label>
    <div className="flex items-center space-x-2">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={type === 'number' ? 0 : undefined}
        className={`w-full p-2 bg-gray-800 text-white rounded ${error ? 'border border-red-500' : ''}`}
      />
    </div>
    {error && <span className="text-red-500 text-xs whitespace-nowrap">{error}</span>}
  </div>
)

// Reusable Select
const Select = ({ label, name, value, onChange, options, error }: any) => (
  <div>
    <label className="text-sm text-gray-400 mb-1 block">{label}</label>
    <select
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 p-2 bg-gray-800 text-white rounded"
    >
      {options.map((opt: string) => {
        if (opt === "") {
          return <option key={""} value={""} selected>{"Select"}</option>
        }
        return <option key={opt} value={opt}>{opt}</option>
      }
      )}
    </select>
    {error && <span className="text-red-500 text-xs whitespace-nowrap">{error}</span>}
  </div>
)

// Reusable Checkbox
const Checkbox = ({ label, name, checked, onChange, error }: any) => (
  <div className="flex items-center mt-2 space-x-2">
    <input
      type="checkbox"
      name={name}
      checked={checked}
      onChange={onChange}
      className="form-checkbox bg-gray-800 border-gray-600"
    />
    <label className="text-sm text-gray-400">{label}</label>
    {error && <span className="text-red-500 text-xs whitespace-nowrap">{error}</span>}
  </div>
)
