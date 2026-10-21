import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'

const ViewPaste = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const paste = useSelector((state) => state.paste.pastes.find((item) => item._id === id))

  async function copyPaste() {
    try {
      await navigator.clipboard.writeText(`${paste.title}\n\n${paste.value}`)
      toast.success('Paste copied!')
    } catch (error) {
      toast.error('Could not copy paste. Check clipboard permissions and try again.')
    }
  }

  if (!paste) {
    return (
      <main className="mx-auto mt-6 w-full max-w-2xl px-4 sm:mt-12 sm:px-5">
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-slate-600">Paste not found.</p>
        <button className="mt-4 text-sm font-medium text-indigo-700" onClick={() => navigate('/pastes')} type="button">
          Back to pastes
        </button>
      </main>
    )
  }

  return (
    <main className="mx-auto mt-6 w-full max-w-2xl px-4 pb-8 sm:mt-12 sm:px-5">
      <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-8">
        <h1 className="break-words text-2xl font-semibold text-slate-900">{paste.title || 'Untitled paste'}</h1>
        <p className="mt-2 text-xs text-slate-500">
          Created {paste.createdAt ? new Date(paste.createdAt).toLocaleString() : 'date unavailable'}
        </p>
        <pre className="mt-5 max-h-[65vh] overflow-auto whitespace-pre-wrap break-words rounded-xl bg-slate-50 p-4 font-sans text-sm leading-6 text-slate-700 sm:mt-6">
          {paste.value || 'No content'}
        </pre>
        <div className="mt-5 flex flex-wrap gap-2">
          <button
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            onClick={() => navigate('/pastes')}
            type="button"
          >
            ← Back to pastes
          </button>
          <Link className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200" to={`/pastes/${paste._id}/edit`}>
            Update
          </Link>
          <button className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700" onClick={copyPaste} type="button">
            Copy
          </button>
        </div>
      </article>
    </main>
  )
}

export default ViewPaste