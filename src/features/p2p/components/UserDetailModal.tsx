import React, { useEffect, useState } from 'react'
import { BaseModal } from '@/components/base/BaseModal'
import { BaseButton } from '@/components/base/BaseButton'
import { usePair, usePairActions } from '@/hooks/p2p/usePair'
import { useCoins } from '@/hooks/useCoins'
import { classNames } from '@/classNames'
import { Calendar } from 'lucide-react'

interface ModalProps {
  _id: string | null
  isOpen: boolean
  onClose: () => void
}

// Replace this with actual coin list if available from context or props
const fiatOptions = [
  { label: 'INT', value: 'btc_id' },
  { label: 'ETH', value: 'eth_id' },
  { label: 'USDT', value: 'usdt_id' }
]

const initialFormValue = {
  tikerRoot: '',
  firstCoin: '',
  firstCoinId: '',
  secondCoin: '',
  secondCoinId: '',
  price: '',
  fee: '',
  duration: 0,
  status: 1,
}

export const ModelDetails: React.FC<ModalProps> = ({ _id, isOpen, onClose }) => {
  if (!isOpen) return null

  const { data: currency, isLoading } = usePair(_id || '')
  const { data: coinData } = useCoins()
  const { addPair, updatePair, addPairLoading, updatePairLoading } = usePairActions()
  const [form, setForm] = useState(initialFormValue)
  const [coinOptions, setCoinOptions] = useState<any>([])
  const [fiatOptions, setFiaOptions] = useState<any>([])
  const [errors, setErrors] = useState<any>({})

  const handleModelClose = () => {
    setForm(initialFormValue)
    setErrors({})
    onClose()
  }

  useEffect(() => {
    if (currency) {
      setForm({
        tikerRoot: currency.tikerRoot || '',
        firstCoin: currency.firstCoin || '',
        firstCoinId: currency.firstCoinId || '',
        secondCoin: currency.secondCoin || '',
        secondCoinId: currency.secondCoinId || '',
        price: currency.price || '',
        fee: currency.fee || '',
        duration: currency.duration || 0,
        status: currency.status ?? 1,
      })
    }
  }, [currency])

  useEffect(() => {
    if (coinData && coinData.count > 0) {
      let coins = coinData?.data.filter((coin) => coin.type != "fiat")
      if (coins.length > 0) {
        setCoinOptions(coins.map((coin) => ({ label: coin.symbol, value: coin._id })))
      }
      let fiat = coinData?.data.filter((coin) => coin.type == "fiat")
      if (fiat.length > 0) {
        setFiaOptions(fiat.map((coin) => ({ label: coin.symbol, value: coin._id })))
      }
      setFiaOptions((prev) => [...prev, { label: 'USD', value: '6856b24707bf04dbc214a384' }])

    }
  }, [coinData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? +value : value
    }))
  }

  const validate = () => {
    const newErrors: any = {}

    // if (!form.tikerRoot) newErrors.tikerRoot = 'Required'
    if (!form.firstCoinId) newErrors.firstCoinId = 'Required'
    if (!form.secondCoinId) newErrors.secondCoinId = 'Required'
    if (!form.price) newErrors.price = 'Required'
    if (!form.fee) newErrors.fee = 'Required'
    if (form.duration <= 0) newErrors.duration = 'Must be positive'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return

    let firstCoin = form?.firstCoin;
    let secondCoin = form?.secondCoin;
    let tikerRoot = form?.tikerRoot
    if (form?.firstCoinId) firstCoin = coinOptions.find((coin: any) => coin.value === form.firstCoinId)?.label
    if (form?.secondCoinId) secondCoin = fiatOptions.find((coin: any) => coin.value === form.secondCoinId)?.label
    if (!tikerRoot) tikerRoot= `${firstCoin}${secondCoin}`
    const payload = { ...form, firstCoin, secondCoin,tikerRoot }

    const mutation = _id
      ? updatePair.mutate
      : addPair.mutate

    mutation(
      _id ? { id: _id, data: payload } : payload,
      {
        onError: (data: any) => {
          if (data?.response?.errors) setErrors(data.response.errors)
        },
        onSuccess: () => handleModelClose()
      }
    )
  }

  const modalFooter = (
    <div className="flex items-center space-x-3">
      <BaseButton onClick={handleSubmit} disabled={addPairLoading || updatePairLoading}>
        {_id ? 'Update Pair' : 'Add Pair'}
      </BaseButton>
      <BaseButton variant="secondary" onClick={handleModelClose} disabled={addPairLoading || updatePairLoading}>
        Cancel
      </BaseButton>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={handleModelClose}
      size="lg"
      footer={modalFooter}
      title={`${_id ? 'Update' : 'Add'} Pair`}
    >
      {isLoading ? (
        <div className="p-12 text-center">
          <div className="flex items-center justify-center space-x-4">
            <div className={`${classNames.loading.spinner} ${classNames.loading.sizes.lg}`} />
            <span className={classNames.text.muted}>Loading pair details...</span>
          </div>
        </div>
      ) : (
        <div className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          {_id && (
            <div className="text-sm text-gray-400 flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Created / Updated Info
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

            <Select
              label="First Coin"
              name="firstCoinId"
              value={form.firstCoinId}
              onChange={handleChange}
              options={coinOptions}
              error={errors.firstCoinId}
            />

            <Select
              label="Second Coin"
              name="secondCoinId"
              value={form.secondCoinId}
              onChange={handleChange}
              options={fiatOptions}
              error={errors.secondCoinId}
            />

            <Input label="Price" type="number" name="price" value={form.price} onChange={handleChange} error={errors.price} />
            <Input label="Fee" type="number" name="fee" value={form.fee} onChange={handleChange} error={errors.fee} />
            <Input type="number" label="Duration (in Minutes)" name="duration" value={form.duration} onChange={handleChange} error={errors.duration} />

            <Select
              label="Status"
              name="status"
              value={form.status}
              onChange={handleChange}
              options={[
                { value: 1, label: 'Active' },
                { value: 2, label: 'Inactive' }
              ]}
              error={errors.status}
            />
          </div>
        </div>
      )}
    </BaseModal>
  )
}

// Reusable Input
const Input = ({ label, name, value, onChange, type = 'text', error }: any) => (
  <div>
    <label className="text-sm text-gray-400 mb-1 block">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      min={type === 'number' ? 0 : undefined}
      className={`w-full p-2 bg-gray-800 text-white rounded ${error ? 'border border-red-500' : ''}`}
    />
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
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
      <option value="">Select</option>
      {options.map((opt: any) => (
        <option key={opt.value} value={opt.value}>
          {opt.label || opt}
        </option>
      ))}
    </select>
    {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
  </div>
)
