import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { addToPastes, updateToPastes } from '../redux/pasteSlice.js'
import { useNavigate, useParams } from 'react-router-dom'

const Home = () => {
    const[title, setTitle] = React.useState("")
    const[value, setValue] = React.useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { id: pasteId } = useParams()
    const pastes = useSelector((state) => state.paste.pastes)
    const existingPaste = pastes.find((paste) => paste._id === pasteId)
    const [confirmation, setConfirmation] = React.useState(null)
    const hasChanges = Boolean(existingPaste) && (
        title.trim() !== (existingPaste.title ?? '') ||
        value !== (existingPaste.value ?? '')
    )

    React.useEffect(() => {
        if (existingPaste) {
            setTitle(existingPaste.title ?? '')
            setValue(existingPaste.value ?? '')
        }
    }, [existingPaste])

    function createPaste() {
        if (pasteId && !hasChanges) {
            toast('No changes to save.')
            return
        }

        const normalizedTitle = title.trim().toLowerCase()
        const duplicateTitle = pastes.some((paste) =>
            String(paste.title ?? '').trim().toLowerCase() === normalizedTitle && paste._id !== pasteId
        )

        if (!normalizedTitle) {
            toast.error('Please enter a title.')
            return
        }

        if (duplicateTitle) {
            toast.error('This title already exists. Please choose a different title.')
            return
        }

        const pasteData = {
            title: title.trim(),
            value: value,
            _id: pasteId || Date.now().toString(36),
            createdAt: existingPaste?.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        }

        if (pasteId) {
            setConfirmation({
                message: 'Save the changes made to this paste?',
                confirmLabel: 'Save changes',
                onConfirm: () => {
                    dispatch(updateToPastes(pasteData))
                    toast.success('Paste updated successfully!')
                    navigate('/pastes')
                },
            })
        } else {
            dispatch(addToPastes(pasteData))
            toast.success('Paste added successfully!')
            setTitle("")
            setValue("")
        }
    }

    function goBack() {
        if (hasChanges) {
            setConfirmation({
                message: 'Discard your unsaved changes and go back?',
                confirmLabel: 'Discard changes',
                onConfirm: () => navigate('/pastes'),
            })
            return
        }
        navigate('/pastes')
    }
        
  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-5 sm:px-6 sm:pb-12 sm:pt-10">
      <div className="mb-5 flex min-h-8 items-center justify-between sm:mb-7">
        {pasteId ? (
          <button
            onClick={goBack}
            type="button"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg pr-3 text-sm font-medium text-slate-500 transition hover:text-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100"
          >
            <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M17 10a.75.75 0 0 1-.75.75H5.56l3.22 3.22a.75.75 0 1 1-1.06 1.06l-4.5-4.5a.75.75 0 0 1 0-1.06l4.5-4.5a.75.75 0 1 1 1.06 1.06l-3.22 3.22h10.69A.75.75 0 0 1 17 10Z" clipRule="evenodd" />
            </svg>
            Back to pastes
          </button>
        ) : <span />}
        <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-500 shadow-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Saved in this browser
        </span>
      </div>

      <header className="mb-6 sm:mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
          {pasteId ? 'Paste editor' : 'Your workspace'}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
          {pasteId ? 'Edit your paste' : 'Create a paste'}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
          {pasteId
            ? 'Make your changes below. Your original paste stays safe until you confirm saving.'
            : 'Keep notes, code snippets, and useful text together in one simple place.'}
        </p>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_45px_-30px_rgba(15,23,42,0.3)]">
        <div className="border-b border-slate-100 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0 flex-1">
              <label htmlFor="paste-title" className="mb-2 block text-sm font-medium text-slate-700">
                Title
              </label>
              <input
                id="paste-title"
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                type="text"
                placeholder="Give your paste a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <button
              onClick={createPaste}
              type="button"
              className="inline-flex min-h-12 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 sm:w-auto"
            >
              <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                {pasteId
                  ? <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.564a1 1 0 0 1-1.42.005L3.29 9.77a1 1 0 1 1 1.42-1.408l3.79 3.82 6.79-6.846a1 1 0 0 1 1.414-.046Z" clipRule="evenodd" />
                  : <path d="M10 3a1 1 0 0 1 1 1v5h5a1 1 0 1 1 0 2h-5v5a1 1 0 1 1-2 0v-5H4a1 1 0 1 1 0-2h5V4a1 1 0 0 1 1-1Z" />}
              </svg>
              {pasteId ? 'Save changes' : 'Create paste'}
            </button>
          </div>
        </div>

        <div className="bg-slate-50/60">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-6">
            <label htmlFor="paste-content" className="text-sm font-medium text-slate-700">
              Content
            </label>
            <span className="font-mono text-xs tabular-nums text-slate-400">
              {value.length.toLocaleString()} characters
            </span>
          </div>
          <textarea
            id="paste-content"
            className="min-h-[40vh] w-full resize-y bg-transparent px-4 py-4 font-mono text-sm leading-7 text-slate-700 outline-none placeholder:font-sans placeholder:text-slate-400 focus:bg-white/70 sm:min-h-[360px] sm:px-6 sm:py-5"
            placeholder="Write or paste your content here..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <footer className="flex items-center justify-between border-t border-slate-100 px-4 py-3 text-xs text-slate-400 sm:px-6">
          <span>Plain text</span>
          <span>{value.trim() ? 'Ready to save' : 'Your content stays private in this browser'}</span>
        </footer>
      </section>
      {confirmation && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
          onClick={() => setConfirmation(null)}
        >
          <section
            aria-labelledby="confirmation-title"
            aria-modal="true"
            className="w-full max-w-md rounded-2xl bg-white p-6 text-left shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="alertdialog"
          >
            <h2 id="confirmation-title" className="text-lg font-semibold text-slate-900">
              Please confirm
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{confirmation.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                autoFocus
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                onClick={() => setConfirmation(null)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                onClick={() => {
                    const confirmAction = confirmation.onConfirm
                    setConfirmation(null)
                    confirmAction()
                }}
                type="button"
              >
                {confirmation.confirmLabel}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}

export default Home