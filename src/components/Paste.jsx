import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { removeFromPastes } from '../redux/pasteSlice.js'

const Paste = () => {
    const pastes = useSelector((state) => state.paste.pastes)
    const dispatch = useDispatch()
    const [searchTerm, setSearchTerm] = React.useState('')
    const [pasteToDelete, setPasteToDelete] = React.useState(null)
    const filteredData = [...pastes]
      .sort((a, b) => {
        const aUpdatedAt = new Date(a.updatedAt || a.createdAt || 0).getTime()
        const bUpdatedAt = new Date(b.updatedAt || b.createdAt || 0).getTime()
        return bUpdatedAt - aUpdatedAt
      })
      .filter((paste) =>
      `${paste.title ?? ''} ${paste.value ?? ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    )

    async function copyPaste(paste) {
      try {
        await navigator.clipboard.writeText(`${paste.title}\n\n${paste.value}`)
        toast.success('Paste copied!')
      } catch (error) {
        toast.error('Could not copy paste. Check clipboard permissions and try again.')
      }
    }

    async function sharePaste(paste) {
      const shareData = { title: paste.title, text: paste.value }
      try {
        if (navigator.share) {
          await navigator.share(shareData)
        } else {
          await navigator.clipboard.writeText(`${paste.title}\n\n${paste.value}`)
          toast.success('Paste content copied so you can share it.')
        }
      } catch (error) {
        if (error.name !== 'AbortError') {
          toast.error('Could not share paste. Check browser permissions and try again.')
        }
      }
    }

    function deletePaste() {
      if (!pasteToDelete) return
      dispatch(removeFromPastes(pasteToDelete._id))
      toast.success('Paste deleted.')
      setPasteToDelete(null)
    }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 pb-8 pt-5 text-left sm:px-5 sm:pb-10 sm:pt-9">
        <header className="mb-5 sm:mb-7">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 sm:mb-4">
            <span className="text-sm font-semibold tracking-wide text-indigo-600">YOUR WORKSPACE</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              {pastes.length} {pastes.length === 1 ? 'paste saved' : 'pastes saved'}
            </span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Your saved ideas.
          </h1>
          <p className="mt-2 text-base text-slate-500">
            Search, manage, and share your notes and snippets.
          </p>
        </header>

        <label className="relative block overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition focus-within:border-indigo-300 focus-within:ring-4 focus-within:ring-indigo-100">
          <svg aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="m16 16 4 4" />
          </svg>
          <input
            className="w-full bg-transparent py-3.5 pl-12 pr-4 text-slate-800 outline-none placeholder:text-slate-400"
            type="search"
            aria-label="Search pastes"
            placeholder="Search by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </label>

        <ul className="mt-4 grid gap-3 sm:mt-5 sm:gap-4 md:grid-cols-2">
          {filteredData.map((paste) => (
            <li key={paste._id} className="group rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-[0_12px_35px_-26px_rgba(15,23,42,0.35)] transition duration-200 hover:border-indigo-200 hover:shadow-lg hover:shadow-slate-200/60 sm:p-5 md:hover:-translate-y-0.5">
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
                <h2 className="w-full min-w-0 break-words text-left text-lg font-semibold leading-6 text-slate-900 sm:flex-1">
                  {paste.title || 'Untitled paste'}
                </h2>
                <div className="flex w-full shrink-0 items-center justify-between gap-1 rounded-xl border border-slate-100 bg-slate-50 p-1 sm:w-auto sm:justify-start">
                  <Link
                    aria-label="Read paste"
                    title="Read"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-indigo-700 transition hover:bg-indigo-50 sm:h-9 sm:w-9"
                    to={`/pastes/${paste._id}`}
                  >
                    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 12s3.5-7 9.5-7 9.5 7 9.5 7-3.5 7-9.5 7-9.5-7-9.5-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  </Link>
                  <Link
                    aria-label="Update paste"
                    title="Update"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 sm:h-9 sm:w-9"
                    to={`/pastes/${paste._id}/edit`}
                  >
                    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m15.5 5.5 3 3M4 20l4.5-1 11-11a2.12 2.12 0 0 0-3-3l-11 11L4 20Z" />
                    </svg>
                  </Link>
                  <button
                    aria-label="Copy paste"
                    title="Copy"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 sm:h-9 sm:w-9"
                    onClick={() => copyPaste(paste)}
                    type="button"
                  >
                    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <rect x="8" y="8" width="12" height="12" rx="2" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
                    </svg>
                  </button>
                  <button
                    aria-label="Share paste"
                    title="Share"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 sm:h-9 sm:w-9"
                    onClick={() => sharePaste(paste)}
                    type="button"
                  >
                    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.7 10.6 6.6-4.2m-6.6 7 6.6 4.1" />
                    </svg>
                  </button>
                  <button
                    aria-label="Delete paste"
                    title="Delete"
                    className="flex h-10 w-10 items-center justify-center rounded-lg text-rose-600 transition hover:bg-rose-50 sm:h-9 sm:w-9"
                    onClick={() => setPasteToDelete(paste)}
                    type="button"
                  >
                    <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16m-10 4v6m4-6v6M5.5 7l1 13h11l1-13M9 7V4h6v3" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="mt-3 min-h-12 whitespace-pre-wrap break-words text-left text-sm leading-6 text-slate-600 line-clamp-3">
                {paste.value || 'No content'}
              </p>
              <div className="mt-3 border-t border-slate-100 pt-2 text-xs text-slate-400">
                {(paste.updatedAt || paste.createdAt)
                  ? new Date(paste.updatedAt || paste.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })
                  : 'Saved paste'}
              </div>
            </li>
          ))}
        </ul>
        {filteredData.length === 0 && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg aria-hidden="true" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 4h8l4 4v12H4V4h4Zm0 0v5h8V4m-8 9h8m-8 4h8" />
              </svg>
            </div>
            <h2 className="mt-4 text-base font-semibold text-slate-900">
              {pastes.length === 0 ? 'Your library is empty' : 'No matching pastes'}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {pastes.length === 0 ? 'Create your first paste from the Home page.' : 'Try another title or search term.'}
            </p>
          </div>
        )}
        {pasteToDelete && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onClick={() => setPasteToDelete(null)}
          >
            <section
              aria-labelledby="delete-confirmation-title"
              aria-modal="true"
              className="w-full max-w-md rounded-2xl bg-white p-6 text-left shadow-2xl"
              onClick={(event) => event.stopPropagation()}
              role="alertdialog"
            >
              <h2 id="delete-confirmation-title" className="text-lg font-semibold text-slate-900">
                Delete this paste?
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                “{pasteToDelete.title || 'Untitled paste'}” will be permanently deleted. This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  autoFocus
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  onClick={() => setPasteToDelete(null)}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 focus:outline-none focus:ring-4 focus:ring-rose-100"
                  onClick={deletePaste}
                  type="button"
                >
                  Delete paste
                </button>
              </div>
            </section>
          </div>
        )}
    </main>
  )
}

export default Paste