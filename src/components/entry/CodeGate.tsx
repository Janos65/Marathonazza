import { useState } from 'react'
import { Lock } from 'lucide-react'
import Logo from '../ui/Logo'
import Button from '../ui/Button'
import { isValidCode, normalizeCode, CODE_STORAGE_KEY } from '../../lib/constants'

interface Props {
  onUnlock: (code: string) => void
}

export default function CodeGate({ onUnlock }: Props) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const [shake, setShake] = useState(false)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (isValidCode(value)) {
      const code = normalizeCode(value)
      sessionStorage.setItem(CODE_STORAGE_KEY, code)
      onUnlock(code)
    } else {
      setError(true)
      setShake(true)
      setTimeout(() => setShake(false), 450)
    }
  }

  return (
    <div className="grid min-h-[70vh] place-items-center">
      <form
        onSubmit={submit}
        className={`w-full max-w-sm rounded-2xl border border-green-100 bg-white p-8 text-center shadow-lg ${
          shake ? 'shake' : ''
        }`}
      >
        <div className="mb-6 flex justify-center">
          <Logo height={44} />
        </div>
        <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-green-50 text-green-700">
          <Lock size={22} />
        </div>
        <h1 className="mb-1 text-xl font-serif font-semibold text-green-800">
          Inserisci il codice del tuo gruppo
        </h1>
        <p className="mb-5 text-sm text-gray-500">Codice fornito dall’organizzatore (es. BUCA3)</p>
        <input
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setError(false)
          }}
          placeholder="BUCA_"
          className={`mb-3 h-14 w-full rounded-xl border-2 text-center text-lg font-semibold uppercase tracking-widest focus:outline-none ${
            error ? 'border-error text-error' : 'border-green-100 text-green-800 focus:border-green-600'
          }`}
        />
        {error && <p className="mb-3 text-sm font-medium text-error">Codice non valido</p>}
        <Button type="submit" variant="primary" size="lg" fullWidth>
          Accedi
        </Button>
      </form>
    </div>
  )
}
